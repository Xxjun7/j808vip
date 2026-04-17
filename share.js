async function Share(selector) {

  const node = document.querySelector(selector);
  if (!node) return console.error("找不到:", selector);

  try {

    // ⭐ 凍結動畫
    document.body.classList.add("freeze-capture");

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const clone = node.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.background = "#fff";

    // ⭐ 解決 3D transform 問題
    clone.querySelectorAll("*").forEach(el => {
      el.style.transform = "none";
      el.style.animation = "none";
    });

    document.body.appendChild(clone);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const blob = await domtoimage.toBlob(clone, {
      bgcolor: "#ffffff",
      width: clone.scrollWidth,
      height: clone.scrollHeight
    });

    document.body.removeChild(clone);
    document.body.classList.remove("freeze-capture");

    const file = new File([blob], "share.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
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