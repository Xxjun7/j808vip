const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// 初始化 Firebase Admin（避免重複初始化）
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // 確保私密金鑰中的換行符號被正確還原
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    })
  });
}

const db = getFirestore();

module.exports = async function handler(req, res) {
  // 限制只能用 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: '缺少必要的參數 (userId)' });
  }

  try {
    // 使用 Transaction 確保資料讀寫的原子性與安全性（防止前端竄改與並發漏洞）
    const result = await db.runTransaction(async (transaction) => {
      const userDocRef = db.collection("users").doc(userId);
      const userDocSnap = await transaction.get(userDocRef);

      if (!userDocSnap.exists) {
        throw new Error('查無此 VIP 資料');
      }

      const data = userDocSnap.data();
      const currentChances = Number(data.chances) || 0; // 剩餘遊戲次數

      if (currentChances <= 0) {
        throw new Error('目前剩餘可抽次數不足');
      }

      const guaranteeTotal = Number(data.guaranteeCount) || 0; // 保底總次數
      const winRate = data.winRate !== undefined ? Number(data.winRate) : 100; // 個人中獎率

      // 收集所有還有剩餘次數的指定金額
      const prizeCounts = {
        100: Number(data.p100) || 0,
        500: Number(data.p500) || 0,
        1000: Number(data.p1000) || 0,
        2000: Number(data.p2000) || 0,
        10000: Number(data.p10000) || 0
      };

      let totalSpecificLeft = 0;
      const availableSpecificPrizes = [];
      for (const [amountStr, count] of Object.entries(prizeCounts)) {
        if (count > 0) {
          totalSpecificLeft += count;
          for (let i = 0; i < count; i++) {
            availableSpecificPrizes.push(Number(amountStr));
          }
        }
      }

      let chosenPrize = null;
      let matchedFieldToDecrement = null;

      // 1. 檢查指定金額獎品權重
      if (totalSpecificLeft > 0 && currentChances > 0) {
        const specificProbability = totalSpecificLeft / currentChances;
        if (Math.random() < specificProbability) {
          const randomIndex = Math.floor(Math.random() * availableSpecificPrizes.length);
          chosenPrize = availableSpecificPrizes[randomIndex];
          matchedFieldToDecrement = `p${chosenPrize}`;
        }
      }

      // 2. 如果沒有抽中指定金額，走保底或一般中獎判定
      if (chosenPrize === null) {
        let lotteryPool = [];
        if (guaranteeTotal > 0 && currentChances > 0) {
          const guaranteeProb = guaranteeTotal / currentChances;
          if (Math.random() < guaranteeProb) {
            lotteryPool.push('guarantee');
          }
        }

        const roll = Math.random() * 100;
        if (roll <= winRate) {
          lotteryPool.push('normal_win');
        } else {
          lotteryPool.push('lose');
        }

        const outcome = lotteryPool[Math.floor(Math.random() * lotteryPool.length)];
        const defaultPool = [100, 500, 1000, 2000, 10000];

        if (outcome === 'guarantee') {
          // 扣除保底次數
          transaction.update(userDocRef, {
            guaranteeCount: FieldValue.increment(-1)
          });
          chosenPrize = defaultPool[Math.floor(Math.random() * defaultPool.length)];
        } else if (outcome === 'normal_win') {
          chosenPrize = defaultPool[Math.floor(Math.random() * defaultPool.length)];
        } else {
          chosenPrize = 0; // 銘謝惠顧
        }
      } else {
        // 如果剛才有抽中指定金額，扣除該指定金額的庫存
        transaction.update(userDocRef, {
          [matchedFieldToDecrement]: FieldValue.increment(-1)
        });
      }

      // 3. 統一扣除遊戲次數與增加已抽次數
      transaction.update(userDocRef, {
        chances: FieldValue.increment(-1),
        drawnCount: FieldValue.increment(1)
      });

      return { 
        prize: chosenPrize, 
        remainingChances: currentChances - 1 
      };
    });

    return res.status(200).json({ success: true, ...result });

  } catch (error) {
    console.error('抽獎發生錯誤:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
