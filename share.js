async function Share() {

  try {

    document.body.classList.add("freeze-capture");

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // ⭐ 9:16 固定尺寸（IG 標準）
    const targetWidth = 1080;
    const targetHeight = 1920;

    // ⭐ 建立虛擬容器（截圖專用畫布）
    const frame = document.createElement("div");
    frame.style.position = "fixed";
    frame.style.left = "-99999px";
    frame.style.top = "0";
    frame.style.width = targetWidth + "px";
    frame.style.height = targetHeight + "px";
    frame.style.overflow = "hidden";
    frame.style.background = "#111";

    // ⭐ clone 畫面
    const clone = document.body.cloneNode(true);

    // ⭐ 關動畫
    clone.querySelectorAll("*").forEach(el => {
      el.style.animation = "none";
      el.style.transition = "none";
    });

    // ⭐ 縮放成 9:16（重點）
    const scaleX = targetWidth / document.documentElement.scrollWidth;
    const scaleY = targetHeight / document.documentElement.scrollHeight;
    const scale = Math.min(scaleX, scaleY);

    clone.style.transform = `scale(${scale})`;
    clone.style.transformOrigin = "top left";

    frame.appendChild(clone);
    document.body.appendChild(frame);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const blob = await domtoimage.toBlob(frame, {
      width: targetWidth,
      height: targetHeight,
      bgcolor: "#111"
    });

    document.body.removeChild(frame);
    document.body.classList.remove("freeze-capture");

    const file = new File([blob], "share-9-16.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "抽卡結果"
      });
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "share-9-16.png";
      a.click();
    }

  } catch (e) {
    console.error(e);
    document.body.classList.remove("freeze-capture");
  }
}
