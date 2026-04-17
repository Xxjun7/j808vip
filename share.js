const Share = {

  isReady: false,

  // 🔹 圖片轉 base64（解決跨域）
  async init(selector) {
    const imgs = document.querySelectorAll(`${selector} img`);

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
        console.warn("image failed:", img.src);
      }
    }));

    // 等字體
    if (document.fonts) {
      await document.fonts.ready;
    }

    this.isReady = true;
  },

  // 🔹 等畫面穩定
  waitStable() {
    return new Promise(r => {
      requestAnimationFrame(() => {
        requestAnimationFrame(r);
      });
    });
  },

  // 🔹 fallback 下載
  download(blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "share.png";
    a.click();
  },

  // 🔹 主功能
  async run(selector) {

    const node = document.querySelector(selector);
    if (!node) {
      console.error("找不到元素:", selector);
      return;
    }

    try {

      if (!this.isReady) {
        await this.init(selector);
      }

      await this.waitStable();

      // 凍結動畫（避免畫面跑掉）
      document.body.classList.add("freeze");

      const clone = node.cloneNode(true);

      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.background = "#fff";

      document.body.appendChild(clone);

      await this.waitStable();

      const blob = await domtoimage.toBlob(clone, {
        bgcolor: "#ffffff",
        width: clone.scrollWidth,
        height: clone.scrollHeight
      });

      document.body.removeChild(clone);
      document.body.classList.remove("freeze");

      const file = new File([blob], "share.png", { type: "image/png" });

      // 📱 分享 or 下載
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {

        await navigator.share({
          files: [file],
          title: document.title
        });

      } else {
        this.download(blob);
      }

    } catch (err) {
      console.error("分享失敗:", err);
    }
  }
};