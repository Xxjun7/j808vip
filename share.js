async function ShareIG() {

  try {

    const chance = document.getElementById("chance")?.innerText || "";
    const resultHTML = document.getElementById("result")?.innerText || "尚未抽卡";

    const isWin = resultHTML.includes("恭喜");

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");

    // =================================================
    // 🧱 1. 背景層（只畫背景）
    // =================================================
    const bg = ctx.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, "#0a0a0a");
    bg.addColorStop(1, "#000");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // =================================================
    // 🧱 2. 卡片層（只畫圖形，不放文字）
    // =================================================

    // 標題（背景裝飾）
    ctx.fillStyle = "#fff";
    ctx.font = "bold 90px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 220);

    // 登出按鈕（背景層）
    drawBtn(ctx, 470, 380, 140, 60, "#222", "登出");

    // 外卡
    drawRoundRect(ctx, 120, 520, 840, 1000, 40, "#111");

    // 內卡
    drawRoundRect(ctx, 260, 620, 560, 820, 30, "#0d0d0d");

    // 金卡（特效）
    ctx.save();
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 80;
    drawRoundRect(ctx, 360, 860, 360, 420, 30, "gold");
    ctx.restore();

    // =================================================
    // ✏️ 3. 文字 + UI層（全部集中這裡🔥）
    // =================================================

    ctx.textAlign = "center";

    // 次數
    ctx.fillStyle = "#aaa";
    ctx.font = "28px sans-serif";
    ctx.fillText("抽卡次數", 540, 670);

    ctx.fillStyle = "#fff";
    ctx.font = "40px sans-serif";
    ctx.fillText(chance, 540, 720);

    // 內卡標題
    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("可自訂文字", 540, 780);

    // 金卡文字
    ctx.fillStyle = "#000";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("🎉 文字可自訂", 540, 950);

    ctx.font = "48px monospace";

    let code = resultHTML.replace("🎉 恭喜中獎", "").trim();
    wrapText(ctx, code, 540, 1020, 600, 60);

    // 結果文字（最上層）
    ctx.fillStyle = isWin ? "#fff" : "#777";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(isWin ? "🎉 恭喜中獎" : "未中獎", 540, 1350);

    // 16位碼
    if (isWin) {
      ctx.fillStyle = "#fff";
      ctx.font = "48px monospace";
      wrapText(ctx, code, 540, 1420, 600, 60);
    }

    // =================================================
    // 🔘 4. 按鈕層（全部集中🔥 最後畫）
    // =================================================

    drawBtn(ctx, 260, 1450, 200, 80, "#222", "📤 SSR分享");
    drawBtn(ctx, 440, 1450, 220, 80, "#222", "📋 複製驗證碼");
    drawBtn(ctx, 660, 1450, 220, 80, "orange", "🎴 再抽一次");

    // =================================================
    // 🧾 footer（最上層）
    // =================================================
    ctx.fillStyle = "#666";
    ctx.font = "30px sans-serif";
    ctx.fillText("自訂分享專用卡片", 540, 1820);

    // =================================================
    // 📤 輸出
    // =================================================
    canvas.toBlob(async (blob) => {

      const file = new File([blob], "ig-share.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {

        await navigator.share({
          files: [file],
          title: "抽卡結果"
        });

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
