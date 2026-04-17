async function ShareIG() {
  try {
    const uid = document.getElementById("uid")?.value || "";
    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";

    // ⭐ 你中獎卡圖片（這裡改成你的）
    const cardImgUrl = "/img/card.png"; // ⭐⭐⭐ 改這裡

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");

    // =========================
    // 🎨 背景
    // =========================
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#111");
    grad.addColorStop(1, "#000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // ✨ 背景光暈（增加質感）
    // =========================
    ctx.fillStyle = "rgba(255,215,0,0.08)";
    ctx.beginPath();
    ctx.arc(540, 900, 500, 0, Math.PI * 2);
    ctx.fill();

    // =========================
    // 🏷 標題
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 180);

    // =========================
    // 👤 使用者資訊
    // =========================
    ctx.fillStyle = "#aaa";
    ctx.font = "40px sans-serif";
    ctx.fillText(uid, 540, 280);
    ctx.fillText(chance, 540, 340);

    // =========================
    // 🎴 載入卡片圖片
    // =========================
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = cardImgUrl;

    await img.decode();

    // =========================
    // ✨ 卡片發光（模擬 glow-selected）
    // =========================
    ctx.save();

    ctx.shadowColor = "gold";
    ctx.shadowBlur = 80;

    // ⭐ 主卡（大）
    const cardW = 500;
    const cardH = 750;

    const cardX = 540 - cardW / 2;
    const cardY = 600;

    ctx.drawImage(img, cardX, cardY, cardW, cardH);

    ctx.restore();

    // =========================
    // 🎴 卡片外框（強化質感）
    // =========================
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 6;
    roundRect(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.stroke();

    // =========================
    // 🎉 結果文字（卡片下方）
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 60px sans-serif";
    ctx.fillText("你抽中了", 540, 1450);

    ctx.font = "50px sans-serif";
    wrapText(ctx, result, 540, 1550, 800, 70);

    // =========================
    // footer
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "28px sans-serif";
    ctx.fillText("快來試試你的手氣！", 540, 1820);

    // =========================
    // 📦 輸出
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
