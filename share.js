async function ShareIG() {

  try {

    const uid = document.getElementById("uid")?.value || "";
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
    ctx.fillText("🎴 抽卡結果", 540, 180);

    // =========================
    // 👤 使用者 + 次數
    // =========================
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText(uid, 540, 300);
    ctx.fillText(chance, 540, 360);

    // =========================
    // 🟡 SSR 卡片本體（重點）
    // =========================
    const x = 140;
    const y = 520;
    const w = 800;
    const h = 1000;

    // 卡片底
    ctx.fillStyle = "#1a1a1a";
    roundRect(ctx, x, y, w, h, 40);
    ctx.fill();

    // ⭐ 發光外框（SSR效果）
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 40;

    ctx.strokeStyle = "gold";
    ctx.lineWidth = 10;
    roundRect(ctx, x, y, w, h, 40);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // =========================
    // 🎴 SSR 標示
    // =========================
    ctx.fillStyle = "gold";
    ctx.font = "bold 70px sans-serif";
    ctx.fillText("SSR", 540, 680);

    // =========================
    // 🔑 CODE（卡片核心）
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 60px monospace";

    wrapText(
      ctx,
      result,
      540,
      820,
      700,
      80
    );

    // =========================
    // 🎮 footer
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

    const file = new File([blob], "ssr-card.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {

      await navigator.share({
        files: [file],
        title: "SSR 抽卡結果"
      });

    } else {

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "ssr-card.png";
      a.click();
    }

  } catch (e) {
    console.error(e);
  }
}
