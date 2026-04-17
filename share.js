async function Share(selector) {

  const node = document.querySelector(selector);
  if (!node) return console.error("找不到:", selector);

  try {

    // ⭐ 凍結動畫（保留畫面狀態）
    document.body.classList.add("freeze-capture");

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const clone = node.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.background = "#111"; // ⭐ 跟你頁面一致

    // ⭐ 重點：只關動畫，不動 transform（避免翻面消失）
    clone.querySelectorAll("*").forEach(el => {
      el.style.animation = "none";
      el.style.transition = "none";
      // ❌ 不要再寫 transform = none
    });

    document.body.appendChild(clone);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const blob = await domtoimage.toBlob(clone, {
      bgcolor: "#111", // ⭐ 背景一致（避免變白）
      width: clone.scrollWidth,
      height: clone.scrollHeight
    });

    document.body.removeChild(clone);
    document.body.classList.remove("freeze-capture");

    const file = new File([blob], "share.png", { type: "image/png" });

    // ⭐ 分享（手機）
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      // ⭐ fallback 下載
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