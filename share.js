async function Share(selector) {

  const node = document.querySelector(selector);
  if (!node) return;

  try {

    // 🔥 1. 把圖片轉 base64（關鍵）
    const imgs = node.querySelectorAll("img");

    await Promise.all([...imgs].map(async (img) => {
      try {
        const res = await fetch(img.src);
        const blob = await res.blob();

        const base64 = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        img.src = base64;
      } catch (e) {
        console.warn("image fail:", img.src);
      }
    }));

    // 等畫面穩定
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const clone = node.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.background = "#fff";

    document.body.appendChild(clone);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const blob = await domtoimage.toBlob(clone, {
      bgcolor: "#ffffff",
      width: clone.scrollWidth,
      height: clone.scrollHeight
    });

    document.body.removeChild(clone);

    const file = new File([blob], "share.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: document.title
      });
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "share.png";
      a.click();
    }

  } catch (err) {
    console.error(err);
  }
}