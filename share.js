async function ShareIG() {

  try {

    const uid = document.getElementById("uid")?.value || "";
    const chance = document.getElementById("chance")?.innerText || "";
    const result = document.getElementById("result")?.innerText || "尚未抽卡";

    // ⭐ 建立 IG 畫布（9:16）
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");

    // =========================
    // 🎨 背景（黑色漸層）
    // =========================
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#111");
    grad.addColorStop(1, "#000");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // =========================
    // 🏷 標題
    // =========================
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎴 抽卡結果", 540, 200);

    // =========================
    // 👤 使用者
    // =========================
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText(uid, 540, 320);

    // =========================
    // 💰 次數
    // =========================
    ctx.fillText(chance, 540, 420);

    // =========================
    // 🎉 結果框
    // =========================
    ctx.fillStyle = "#1a1a1a";
    roundRect(ctx, 140, 600, 800, 600, 40);
    ctx.fill();

    // 外框金色
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 6;
    ctx.stroke();

    // =========================
    // 結果文字
    // =========================
    ctx.fillStyle = "#fff";
    ctx.font = "bold 60px sans-serif";
    ctx.fillText("結果", 540, 750);

    ctx.font = "50px sans-serif";
    wrapText(ctx, result, 540, 850, 700, 70);

    // =========================
    // footer
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "30px sans-serif";
    ctx.fillText("IG 分享專用卡片", 540, 1750);

    // =========================
    // 轉檔 & 分享
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
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// =========================
// 🧩 自動換行
// =========================
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {

  const words = text.split("");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n];
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}