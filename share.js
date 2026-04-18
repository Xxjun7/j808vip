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

function drawButton(ctx, x, y, w, h, color, text) {
  drawRoundRect(ctx, x, y, w, h, 20, color);

  ctx.fillStyle = "#fff";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, x + w / 2, y + h / 2 + 10);
}

async function ShareIG() {

  try {

    const uid = document.getElementById("uid")?.value || "";
    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";

    // 🎨 畫布
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");

    // =========================
    // 🌌 背景（黑色漸層）
    // =========================
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(1, "#000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // 🏷 標題
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 90px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 220);

    // UID
    ctx.font = "42px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText(uid, 540, 320);

    // 次數
    ctx.fillText(chance, 540, 400);

    // =========================
    // 🧱 中央黑卡（像你圖）
    // =========================
    drawRoundRect(ctx, 140, 520, 800, 900, 40, "#111");

    // =========================
    // 🎴 金色卡片（發光）
    // =========================
    ctx.save();

    // 發光
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 60;

    drawRoundRect(ctx, 340, 750, 400, 500, 30, "gold");

    ctx.restore();

    // 卡片內文字
    ctx.fillStyle = "#000";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎉 文字可自訂", 540, 950);

    ctx.font = "32px monospace";
    wrapText(ctx, result.replace("🎉 恭喜中獎", ""), 540, 1020, 320, 50);

    // =========================
    // 🎉 中獎文字
    // =========================
    if (result.includes("恭喜")) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 50px sans-serif";
      ctx.fillText("🎉 恭喜中獎", 540, 1350);
    } else {
      ctx.fillStyle = "#888";
      ctx.font = "bold 50px sans-serif";
      ctx.fillText("未中獎", 540, 1350);
    }

    // =========================
    // 🔘 假按鈕列（裝飾）
    // =========================
    drawButton(ctx, 260, 1500, 200, 80, "#222", "分享");
    drawButton(ctx, 440, 1500, 200, 80, "#222", "複製");
    drawButton(ctx, 620, 1500, 220, 80, "orange", "再抽一次");

    // =========================
    // footer
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "30px sans-serif";
    ctx.fillText("IG 分享專用卡片", 540, 1820);

    // =========================
    // 輸出
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
