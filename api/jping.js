export default async function handler(req, res) {
    // 1. 驗證你的 jkey 密碼
    const key = req.query.jkey;
    if (key !== 'j808') { // 記得改成你自己的密碼
        return res.status(401).json({ success: false, message: '未授權：密碼錯誤' });
    }

    try {
        console.log('⚡ 正在自動發送喚醒請求給 drawCard...');

        // 2. 在後端自己用 fetch 去打你自己的 /api/drawCard
        const response = await fetch('https://j808vip.vercel.app/api/drawCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: 'j808' })
        });

        const data = await response.json();
        console.log('⚡ 喚醒響應結果:', data);

        // 3. 回傳結果給 cron-job.org
        return res.status(200).json({ 
            success: true, 
            message: '已成功透過 ping 觸發 drawCard', 
            drawCardResult: data 
        });

    } catch (err) {
        console.error('⚡ 喚醒請求失敗:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
