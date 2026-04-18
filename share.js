// =========================
// 📤 IG 分享（純 Canvas 版）
// =========================
async function ShareIG() {

  try {

    const uid = document.getElementById("可以文字")?.value || "";
    const chance = document.getElementById("chance")?.innerText || "";

    const resultText = document.getElementById("result")?.innerText || "尚未抽卡";
    const resultHTML = document.getElementById("result")?.innerHTML || "";

    const isWin = resultText.includes("恭喜");

    // =========================
    // ⭐ 抓 16碼（關鍵修正）
    // =========================
    let code = "";

    if (resultHTML.includes("<br>")) {
      code = resultHTML.split("<br>")[1].trim();
    }

    // =========================
    // 🎨 建立 Canvas
    // =========================
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");

    // =========================
    // 🌌 背景
    // =========================
    const bg = ctx.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, "#0a0a0a");
    bg.addColorStop(1, "#000");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // 🎴 標題
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 90px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 220);

    // UID
    ctx.fillStyle = "#aaa";
    ctx.font = "40px sans-serif";
    ctx.fillText(uid, 540, 320);

    // 次數
    ctx.fillText(chance, 540, 400);

    // =========================
    // 🧱 外層黑卡
    // =========================
    drawRoundRect(ctx, 120, 520, 840, 1000, 40, "#111");

    // 內層卡
    drawRoundRect(ctx, 260, 620, 560, 820, 30, "#0d0d0d");

    // 標題
    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("抽卡遊戲", 540, 700);

    // =========================
    // 🎴 金色發光卡片
    // =========================
    ctx.save();
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 80;

    drawRoundRect(ctx, 360, 780, 360, 480, 30, "gold");

    ctx.restore();

    // 卡片文字
    ctx.fillStyle = "#000";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("🎉 文字可自訂", 540, 960);

    // =========================
    // ⭐ 16碼（重點顯示）
    // =========================
    ctx.fillStyle = "#000";
    ctx.font = "bold 40px monospace";

    ctx.fillText(code, 540, 1040);

    // =========================
    // 🎉 結果文字
    // =========================
    ctx.fillStyle = isWin ? "#fff" : "#777";
    ctx.font = "bold 42px sans-serif";

    ctx.fillText(
      isWin ? "🎉 恭喜中獎" : "未中獎",
      540,
      1350
    );

    // =========================
    // 🔘 假按鈕列
    // =========================
    drawBtn(ctx, 260, 1450, 200, 80, "#222", "SSR分享");
    drawBtn(ctx, 460, 1450, 220, 80, "#222", "複製驗證碼");
    drawBtn(ctx, 680, 1450, 220, 80, "orange", "再抽一次");

    // =========================
    // footer
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "30px sans-serif";
    ctx.fillText("IG 分享專用卡片", 540, 1820);

    // =========================
    // 📤 輸出
    // =========================
    canvas.toBlob(async (blob) => {

      const file = new File([blob], "ig-share.png", { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {

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

// =========================
// 🧩 圓角矩形
// =========================
function drawRoundRect(ctx, x, y, w, h, r, color) {

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

// =========================
// 🔘 按鈕
// =========================
function drawBtn(ctx, x, y, w, h, color, text) {

  drawRoundRect(ctx, x, y, w, h, 20, color);

  ctx.fillStyle = "#fff";
  ctx.font = "26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, x + w / 2, y + h / 2 + 8);
}
