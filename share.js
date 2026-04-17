async function ShareIG() {
  try {
    console.log("SSR 分享生成中...");

    const uid = document.getElementById("uid")?.value || "";
    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";

    // ⭐ SSR 卡片（你可以換成真正 SSR 圖）
    const cardImgUrl = "https://png.pngtree.com/png-vector/20190130/ourmid/pngtree-ai-cartoon-new-year-red-envelope-pig-year-material-year-red-png-image_623861.jpg";

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");

    // =========================
    // 🌌 背景（SSR 星空感）
    // =========================
    const grad = ctx.createRadialGradient(540, 800, 100, 540, 900, 900);
    grad.addColorStop(0, "#2a1a00");
    grad.addColorStop(0.5, "#0a0a0a");
    grad.addColorStop(1, "#000");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // ✨ 金色光暈（SSR核心）
    // =========================
    ctx.fillStyle = "rgba(255,215,0,0.08)";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(540, 900, 200 + i * 60, 0, Math.PI * 2);
      ctx.fill();
    }

    // =========================
    // 🏷 SSR 標籤
    // =========================
    ctx.fillStyle = "gold";
    ctx.font = "bold 100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SSR", 540, 160);

    ctx.fillStyle = "#fff";
    ctx.font = "30px sans-serif";
    ctx.fillText("超稀有抽卡", 540, 210);

    // =========================
    // 👤 使用者
    // =========================
    ctx.fillStyle = "#aaa";
    ctx.font = "40px sans-serif";
    ctx.fillText(uid, 540, 300);

    ctx.fillText(chance, 540, 360);

    // =========================
    // 🎴 載入卡片
    // =========================
    const img = await loadImage(cardImgUrl);

    const cardW = 520;
    const cardH = 780;
    const x = 540 - cardW / 2;
    const y = 520;

    // =========================
    // ✨ SSR 發光（核心）
    // =========================
    ctx.save();

    // 外發光（像你 CSS glow）
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 120;

    ctx.drawImage(img, x, y, cardW, cardH);

    ctx.restore();

    // =========================
    // 外框（金邊）
    // =========================
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 8;
    roundRect(ctx, x, y, cardW, cardH, 30);
    ctx.stroke();

    // =========================
    // 🎉 結果文字
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 60px sans-serif";
    ctx.fillText("你抽到 SSR！", 540, 1450);

    ctx.font = "45px sans-serif";
    wrapText(ctx, result, 540, 1550, 800, 65);

    // =========================
    // ✨ footer
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "28px sans-serif";
    ctx.fillText("SSR限定分享卡", 540, 1820);

    // =========================
    // 📤 輸出
    // =========================
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "SSR-share.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "SSR 抽卡結果"
        });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "SSR-share.png";
        a.click();
      }
    });

  } catch (e) {
    console.error("SSR 分享失敗:", e);
  }
}
