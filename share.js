async function ShareIG() {

  try {

    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";
    const code = "XXXXXXXX";

    // =========================
    // 🖼 Canvas
    // =========================
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    ctx.textAlign = "center";

    // =========================
    // 🌌 背景（深色漸層）
    // =========================
    const bg = ctx.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, "#0b0b10");
    bg.addColorStop(1, "#000000");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // 🎴 標題（弱化）
    // =========================
    ctx.fillStyle = "#ddd";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText("🎴 抽卡結果", 540, 140);

    ctx.fillStyle = "#666";
    ctx.font = "32px sans-serif";
    ctx.fillText("💰 " + chance, 540, 210);

    // =========================
    // ✨ 卡片主體（重點）
    // =========================

    const cardX = 340;
    const cardY = 420;
    const cardW = 400;
    const cardH = 900;

    ctx.save();

    // 🌟 發光
    ctx.shadowColor = "rgba(255, 215, 0, 0.85)";
    ctx.shadowBlur = 80;

    // 微傾斜（立體感）
    ctx.translate(540, 860);
    ctx.rotate(-0.03);
    ctx.translate(-540, -860);

    // 卡片背景
    const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
    cardGrad.addColorStop(0, "#2a2a2a");
    cardGrad.addColorStop(1, "#0a0a0a");

    ctx.fillStyle = cardGrad;
    roundRect(ctx, cardX, cardY, cardW, cardH, 40);
    ctx.fill();

    // 金色邊框
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 6;
    roundRect(ctx, cardX, cardY, cardW, cardH, 40);
    ctx.stroke();

    ctx.restore();

    // =========================
    // 🎉 稀有度（貼卡）
    // =========================
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 72px sans-serif";
    ctx.fillText(result, 540, 560);

    // =========================
    // 🎮 CODE（貼卡底部）
    // =========================
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px monospace";
    ctx.fillText("CODE: " + code, 540, 1260);

    // =========================
    // 💬 底部文字
    // =========================
    ctx.fillStyle = "#444";
    ctx.font = "28px sans-serif";
    ctx.fillText("IG 分享專用卡片", 540, 1780);

    // =========================
    // 📤 輸出
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
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
