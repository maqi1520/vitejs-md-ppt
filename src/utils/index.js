import domtoimage from "dom-to-image";

export function downloadBlob(blob, filename) {
  let element = document.createElement("a");
  element.setAttribute("href", blob);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const SCALE = 2;

export const takeSnapshot = async (node) => {
  const style = {
    transform: "scale(" + SCALE + ")",
    transformOrigin: "top left",
    width: node.offsetWidth + "px",
    height: node.offsetHeight + "px",
  };

  const param = {
    height: node.offsetHeight * SCALE,
    width: node.offsetWidth * SCALE,
    quality: 1,
    style,
  };

  const base64Image = await domtoimage.toPng(node, param);
  return base64Image;
};

let framesRef = [];

const makeVideo = (frames, speed) => {
  const body = document.querySelector("body");
  const width = body.offsetWidth * SCALE;
  const height = body.offsetHeight * SCALE;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const images = [];

  frames.forEach((frame) => {
    const img = new Image();
    img.src = frame;
    images.push(img);
  });

  let currentFrame = 0;

  function draw() {
    ctx.drawImage(images[currentFrame], 0, 0, width, height);
    requestAnimationFrame(draw);
  }
  draw();

  const interval = setInterval(() => {
    currentFrame ++;
    if (currentFrame === frames.length - 1) {
      clearInterval(interval);
      setTimeout(() => {
        mediaRecorder.stop();
      }, 1000);
    }
  }, speed);

  const videoStream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(videoStream);

  let chunks = [];

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = function (e) {
    clearInterval(interval);
    const blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];
    downloadBlob(
      URL.createObjectURL(blob),
      new Date().toLocaleString().replace(/\//g, "-") + ".mp4"
    );
    framesRef = [];
  };

  mediaRecorder.start();
};

export const play = async (cur) => {
  const nodes = document.querySelectorAll(".slide-content");
  for (let i = 0; i < nodes.length; i++) {
    const imageBlob = await takeSnapshot(nodes[i]);
    framesRef.push(imageBlob);
  }
  makeVideo(framesRef, 1000);
};
