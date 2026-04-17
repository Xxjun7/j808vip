async function ShareIG() {

  try {

    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";
    const code = "XXXXXXXX"; // 你可換成實際卡片 code

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // =========================
    // 🌌 背景
    // =========================
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#0b0b0f");
    grad.addColorStop(1, "#000");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // 🎴 標題（縮小）
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 70px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 180);

    // =========================
    // 💰 次數（小字）
    // =========================
    ctx.fillStyle = "#888";
    ctx.font = "36px sans-serif";
    ctx.fillText(chance, 540, 260);

    // =========================
    // ✨ 中央發光卡片區
    // =========================
    const cardX = 190;
    const cardY = 420;
    const cardW = 700;
    const cardH = 900;

    // 🌟 外層發光（重點）
    ctx.save();
    ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
    ctx.shadowBlur = 60;

    const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
    cardGrad.addColorStop(0, "#1a1a1a");
    cardGrad.addColorStop(1, "#0a0a0a");

    ctx.fillStyle = cardGrad;
    roundRect(ctx, cardX, cardY, cardW, cardH, 50);
    ctx.fill();
    ctx.restore();

    // 金色邊框
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 5;
    roundRect(ctx, cardX, cardY, cardW, cardH, 50);
    ctx.stroke();

    // =========================
    // 🎉 SSR / 結果文字（置中強化）
    // =========================
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 80px sans-serif";
    ctx.fillText(result, 540, 750);

    // =========================
    // 🎁 CODE
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "40px monospace";
    ctx.fillText(`CODE: ${code}`, 540, 860);

    // =========================
    // 💰 次數（移到底部區）
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "32px sans-serif";
    ctx.fillText(`抽卡次數：${chance}`, 540, 1650);

    // =========================
    // footer
    // =========================
    ctx.fillStyle = "#444";
    ctx.font = "28px sans-serif";
    ctx.fillText("IG 分享專用卡片", 540, 1750);

    // =========================
    // 輸出
    // =========================
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

// =========================
// 🧩 圓角矩形
// =========================
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, y, x + w, r);
  ctx.closePath();
}
