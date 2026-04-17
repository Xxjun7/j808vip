async function ShareIG() {

  try {

    const uid = document.getElementById("uid")?.value || "";
    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";

    // ⭐ 解析 code（避免整段亂）
    const code = result;

    // =========================
    // 🎨 建立 IG 畫布
    // =========================
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
    // 🏷 標題
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 180);

    // =========================
    // 👤 使用者
    // =========================
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText(uid, 540, 300);
    ctx.fillText(chance, 540, 360);

    // =========================
    // 🟡 SSR 黃色框（重點）
    // =========================
    const boxX = 140;
    const boxY = 520;
    const boxW = 800;
    const boxH = 900;

    // 背景框
    ctx.fillStyle = "#1a1a1a";
    roundRect(ctx, boxX, boxY, boxW, boxH, 40);
    ctx.fill();

    // ⭐ 金色發光外框
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 8;
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 30;

    roundRect(ctx, boxX, boxY, boxW, boxH, 40);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // =========================
    // 🎴 中獎卡樣式標題
    // =========================
    ctx.fillStyle = "gold";
    ctx.font = "bold 60px sans-serif";
    ctx.fillText("🎉 中獎卡", 540, 650);

    // =========================
    // 🔑 CODE 區塊（重點）
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 45px monospace";

    wrapText(
      ctx,
      code,
      540,
      780,
      700,
      65
    );

    // =========================
    // ✨ 裝飾文字
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "28px sans-serif";
    ctx.fillText("SSR 抽卡分享卡", 540, 1750);

    // =========================
    // 📤 轉檔 + 分享
    // =========================
    canvas.toBlob(async (blob) => {

      const file = new File([blob], "ssr-share.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {

        await navigator.share({
          files: [file],
          title: "SSR 抽卡結果"
        });

      } else {

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "ssr-share.png";
        a.click();
      }

    });

  } catch (e) {
    console.error(e);
  }
}
