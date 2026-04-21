async function ShareIG() {
  try {
    const chance = document.getElementById("chance")?.innerText || "";
    const resultHTML = document.getElementById("result")?.innerText || "尚未抽卡";
    const isWin = resultHTML.includes("恭喜");
    let code = resultHTML.replace("🎉 恭喜中獎", "").trim();

    // =========================
    // 🎨 Canvas 基礎設定
    // =========================
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // ==========================================
    // 1. 🌌 底圖層 (Background & Base Frames)
    // ==========================================
    // 全域背景
    const bg = ctx.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, "#0a0a0a");
    bg.addColorStop(1, "#000");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // 中央大黑卡外框
    drawRoundRect(ctx, 120, 520, 840, 1000, 40, "#111");
    
    // 內部小卡底色（像螢幕畫面感）
    drawRoundRect(ctx, 260, 620, 560, 820, 30, "#0d0d0d");

    // ==========================================
    // 2. 🎴 圖片/卡片裝飾層 (Image & Card Ornaments)
    // ==========================================
    // 金色卡片（發光效果）
    ctx.save();
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 80;
    drawRoundRect(ctx, 360, 780, 360, 480, 30, "gold");
    ctx.restore();

    // ==========================================
    // 3. ✍️ 文字與按鈕層 (Text & Buttons)
    // ==========================================
    ctx.textAlign = "center";
    
    // --- 標題 ---
    ctx.fillStyle = "#fff";
    ctx.font = "bold 90px sans-serif";
    ctx.fillText("🎴 抽卡結果", 540, 220);

    // --- 頂部偽按鈕 (登出) ---
    drawBtn(ctx, 470, 380, 140, 60, "#222", "登出");

    // --- 中間資訊文字 ---
    ctx.fillStyle = "#fff";
    ctx.font = "40px sans-serif";
    ctx.fillText(chance, 540, 640);

    ctx.font = "bold 42px sans-serif";
    ctx.fillText("可自訂文字", 540, 700);

    // --- 金色卡片內文字 ---
    ctx.fillStyle = "#000";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("🎉 文字可自訂", 540, 960);
    
    ctx.font = "48px monospace";
    wrapText(ctx, code, 540, 1020, 600, 60);

    // --- 中獎狀態文字 ---
    ctx.fillStyle = isWin ? "#fff" : "#777";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(isWin ? "🎉 恭喜中獎" : "未中獎", 540, 1350);

    // 如果中獎，顯示 16 位碼
    if (isWin) {
      ctx.font = "48px monospace";
      ctx.fillStyle = "#fff";
      wrapText(ctx, code, 540, 1420, 600, 60);
    }

    // --- 底部偽操作按鈕 ---
    drawBtn(ctx, 260, 1450, 200, 80, "#222", "📤 SSR分享");
    drawBtn(ctx, 440, 1450, 220, 80, "#222", "📋 複製驗證碼");
    drawBtn(ctx, 660, 1450, 220, 80, "orange", "🎴 再抽一次");

    // --- Footer 頁腳 ---
    ctx.fillStyle = "#666";
    ctx.font = "30px sans-serif";
    ctx.fillText("自訂分享專用卡片", 540, 1820);

    // =========================
    // 📤 輸出邏輯 (不變)
    // =========================
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "ig-share.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "抽卡結果" });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "ig-share.png";
        a.click();
      }
    });

  } catch (e) {
    console.error(e);
  }
}
