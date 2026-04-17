async function ShareIG() {

  try {

    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");

    // =========================
    // 🌌 背景
    // =========================
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#111");
    grad.addColorStop(1, "#000");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // 🎴 標題
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 200);

    // =========================
    // 💰 次數
    // =========================
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText(chance, 540, 320);

    // =========================
    // 🟡 SSR 卡片（只顯示一張）
    // =========================
    const x = 140;
    const y = 480;
    const w = 800;
    const h = 1000;

    // 卡片底
    ctx.fillStyle = "#1a1a1a";
    roundRect(ctx, x, y, w, h, 40);
    ctx.fill();

    // ⭐ 發光效果（SSR重點）
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 50;

    ctx.strokeStyle = "gold";
    ctx.lineWidth = 10;
    roundRect(ctx, x, y, w, h, 40);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // =========================
    // 🎉 中獎卡標題
    // =========================
    ctx.fillStyle = "gold";
    ctx.font = "bold 70px sans-serif";
    ctx.fillText("🎉 中獎卡", 540, 620);

    // =========================
    // 🔑 CODE（核心）
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 55px monospace";

    wrapText(
      ctx,
      result,
      540,
      780,
      700,
      80
    );

    // =========================
    // 🧾 footer
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "28px sans-serif";
    ctx.fillText("SSR 抽卡分享卡", 540, 1750);

    // =========================
    // 📤 分享
    // =========================
    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/png")
    );

    const file = new File([blob], "ssr-share.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {

      await navigator.share({
        files: [file],
        title: "SSR 中獎卡"
      });

    } else {

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "ssr-share.png";
      a.click();
    }

  } catch (e) {
    console.error(e);
  }
}
