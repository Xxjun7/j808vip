// 使用方式：Share("#captureArea")

async function Share(selector) {

  const node = document.querySelector(selector);
  if (!node) {
    console.error("找不到元素:", selector);
    return;
  }

  try {

    // 等畫面穩定
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // clone 避免污染畫面
    const clone = node.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.background = "#fff";

    document.body.appendChild(clone);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // 轉圖片
    const blob = await domtoimage.toBlob(clone, {
      bgcolor: "#ffffff",
      width: clone.scrollWidth,
      height: clone.scrollHeight
    });

    document.body.removeChild(clone);

    const file = new File([blob], "share.png", { type: "image/png" });

    // 分享（手機）
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: document.title
      });
    } else {
      // fallback 下載
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "share.png";
      a.click();
    }

  } catch (err) {
    console.error("分享失敗:", err);
  }
}