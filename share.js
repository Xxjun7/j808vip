async function Share() {
  try {
    document.body.classList.add("freeze-capture");

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const width = window.innerWidth;
    const height = window.innerHeight;

    // ⭐ 建立 viewport 容器（只顯示目前畫面）
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.style.width = width + "px";
    wrapper.style.height = height + "px";
    wrapper.style.overflow = "hidden";
    wrapper.style.background = "#111";

    // ⭐ clone 當前畫面
    const clone = document.body.cloneNode(true);

    clone.style.margin = "0";

    // ⭐ 把畫面「移動到目前 scroll 位置」
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    clone.style.transform = `translate(${-scrollX}px, ${-scrollY}px)`;

    // ⭐ 關動畫
    clone.querySelectorAll("*").forEach(el => {
      el.style.animation = "none";
      el.style.transition = "none";
    });

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const blob = await domtoimage.toBlob(wrapper, {
      width,
      height,
      bgcolor: "#111"
    });

    document.body.removeChild(wrapper);
    document.body.classList.remove("freeze-capture");

    const file = new File([blob], "share.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
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
