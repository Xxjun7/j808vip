async function Share() {

  try {

    // ⭐ 凍結所有動畫（很重要）
    document.body.classList.add("freeze-capture");

    // ⭐ 等畫面穩定（避免截到動畫中）
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // ⭐ 直接用整個 body
    const node = document.body;

    // ⭐ clone（避免污染畫面）
    const clone = node.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.background = "#111"; // 跟你背景一致

    // ⭐ 關掉動畫（但保留 transform）
   // clone.querySelectorAll("*").forEach(el => {
   //   el.style.animation = "none";
   //   el.style.transition = "none";
   // });

    document.body.appendChild(clone);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // ⭐ 抓整頁尺寸
    const width = document.documentElement.scrollWidth;
    const height = document.documentElement.scrollHeight;

    const blob = await domtoimage.toBlob(clone, {
      bgcolor: "#111",
      width,
      height
    });

    document.body.removeChild(clone);
    document.body.classList.remove("freeze-capture");

    const file = new File([blob], "share.png", { type: "image/png" });

    // ⭐ 手機分享
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "抽卡結果"
      });
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
