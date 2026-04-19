async function ShareIG() {

  try {

    //const uid = document.getElementById("UID")?.value || "";
    const chance = document.getElementById("chance")?.innerText || "";
    const resultHTML = document.getElementById("result")?.innerText || "尚未抽卡";

    const isWin = resultHTML.includes("恭喜");

    // =========================
    // 🎨 Canvas
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

   
    ctx.fillStyle = "#aaa";
    ctx.font = "40px sans-serif";
    // UID
    //ctx.fillText(uid, 540, 320);
    // 次數
    ctx.fillText(chance, 540, 400);

    // =========================
    // 🧱 中央黑卡（外框）
    // =========================
    drawRoundRect(ctx, 120, 520, 840, 1000, 40, "#111");

    // =========================
    // 🎴 內部小卡（像畫面）
    // =========================
    drawRoundRect(ctx, 260, 620, 560, 820, 30, "#0d0d0d");

    // 標題
    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("可自訂文字", 540, 700);

    // =========================
    // 💡 金色卡片（發光）
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

    ctx.font = "48px monospace";

    let code = resultHTML.replace("🎉 恭喜中獎", "").trim();
    wrapText(ctx, code, 540, 1020, 260, 40);

    // =========================
    // 🎉 中獎 / 未中
    // =========================
    ctx.fillStyle = isWin ? "#fff" : "#777";
    ctx.font = "bold 42px sans-serif";

    ctx.fillText(
    isWin ? "🎉 恭喜中獎" : "未中獎",
    540,
    1350
    );

    // 👉 如果中獎，再多畫一行16位碼
    if (isWin) {
    ctx.font = "48px monospace";
    ctx.fillStyle = "#fff";

    wrapText(ctx, code, 540, 1420, 300, 40);
    }

    // =========================
    // 🔘 按鈕（畫假的）
    // =========================
    drawBtn(ctx, 260, 1450, 200, 80, "#222", "📤 SSR分享");
    drawBtn(ctx, 440, 1450, 220, 80, "#222", "📋 複製驗證碼");
    drawBtn(ctx, 660, 1450, 220, 80, "orange", "🎴 再抽一次");

    // =========================
    // footer
    // =========================
    ctx.fillStyle = "#666";
    ctx.font = "30px sans-serif";
    ctx.fillText("自訂分享專用卡片", 540, 1820);

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

function drawBtn(ctx, x, y, w, h, color, text) {

  drawRoundRect(ctx, x, y, w, h, 20, color);

  ctx.fillStyle = "#fff";
  ctx.font = "26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, x + w/2, y + h/2 + 8);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {

  const chars = text.split("");
  let line = "";

  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    const w = ctx.measureText(test).width;

    if (w > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = chars[i];
      y += lineHeight;
    } else {
      line = test;
    }
  }

  ctx.fillText(line, x, y);
}
