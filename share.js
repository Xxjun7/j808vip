async function Share() {
  try {
    // ⭐ 要求使用者選擇畫面（手機會是整個畫面）
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" }
    });

    const video = document.createElement("video");
    video.srcObject = stream;

    await video.play();

    // ⭐ 建立 canvas 畫當前畫面
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    // ⭐ 截圖（真正畫面）
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ⭐ 停止錄影（很重要）
    stream.getTracks().forEach(track => track.stop());

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/png")
    );

    const file = new File([blob], "share.png", { type: "image/png" });

    // ⭐ 分享
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

  } catch (err) {
    console.error(err);
  }
}
