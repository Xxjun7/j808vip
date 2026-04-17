async function Share() {
  try {
    document.body.classList.add("freeze-capture");

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // ⭐ 建立 9:16 畫布（模擬手機畫面）
    const canvas = document.createElement("div");

    const WIDTH = 1080;
    const HEIGHT = 1920;

    canvas.style.width = WIDTH + "px";
    canvas.style.height = HEIGHT + "px";
    canvas.style.position = "fixed";
    canvas.style.left = "-99999px";
    canvas.style.top = "0";
    canvas.style.overflow = "hidden";
    canvas.style.background = "#111";

    // ⭐ 把整個畫面塞進去
    const clone = document.body.cloneNode(true);

    // ⭐ 關動畫
    clone.querySelectorAll("*").forEach(el => {
      el.style.animation = "none";
      el.style.transition = "none";
    });

    // ⭐ 縮放成手機比例（重點）
    const scaleX = WIDTH / window.innerWidth;
    const scaleY = HEIGHT / window.innerHeight;
    const scale = Math.min(scaleX, scaleY);

    clone.style.transform = `scale(${scale})`;
    clone.style.transformOrigin = "top left";
    clone.style.width = window.innerWidth + "px";

    canvas.appendChild(clone);
    document.body.appendChild(canvas);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const blob = await domtoimage.toBlob(canvas, {
      bgcolor: "#111",
      width: WIDTH,
      height: HEIGHT
    });

    document.body.removeChild(canvas);
    document.body.classList.remove("freeze-capture");

    const file = new File([blob], "share.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "抽卡結果"
      });
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "share.png";
      a.click();
    }

  } catch (e) {
    console.error(e);
    document.body.classList.remove("freeze-capture");
  }
}