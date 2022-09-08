import { useState, useEffect, useRef } from "react";
import "./App.css";
import defaultMdText from "./slides.md?raw";
import { parse } from "@slidev/parser";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism-okaidia.css";
import domtoimage from "dom-to-image";
import { downloadBlob } from "./utils";
import { layout } from "./Layouts";
import RecordView from "./RecordView";

const SCALE = 2;

function Preview({ slides, onEdit }) {
  const [current, setCurrent] = useState(0);
  const [exporting, setExporting] = useState(false);

  const backgroundRef = useRef(null);
  const framesRef = useRef([]);

  useEffect(() => {
    const handleKeydown = (e) => {
      e.preventDefault();
      if (e.code === "ArrowRight" || e.code === "ArrowDown") {
        if (current < slides.length - 1) {
          setCurrent((prev) => prev + 1);
        }
      }
      if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
        if (current > 0) {
          setCurrent((prev) => prev - 1);
        }
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [current]);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const takeSnapshot = async (node) => {
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

  const makeVideo = (frames, speed) => {
    const width = backgroundRef.current.offsetWidth * SCALE;
    const height = backgroundRef.current.offsetHeight * SCALE;
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
      currentFrame += 1;
      setCurrent(currentFrame);
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
      downloadBlob(URL.createObjectURL(blob), "1.mp4");
      framesRef.current = [];
    };

    mediaRecorder.start();
  };

  const onExport = () => {
    setExporting(true);

    setTimeout(() => {
      const nodes = document.querySelectorAll(".slide-content");
      takeSnapshot(nodes[current])
        .then((blobUrl) => {
          downloadBlob(blobUrl, `1.png`);
        })
        .catch((error) => {
          console.log("Error: " + error);
        })
        .finally(() => setExporting(false));
    }, 100);
  };

  const play = async (cur) => {
    const nodes = document.querySelectorAll(".slide-content");
    for (let i = 0; i < nodes.length; i++) {
      const imageBlob = await takeSnapshot(nodes[i]);
      framesRef.current.push(imageBlob);
    }
    console.log(framesRef.current);
    makeVideo(framesRef.current, 1000);
  };

  return (
    <div>
      <div className="App">
        <div
          className="flex h-full transition-transform transform duration-500"
          ref={backgroundRef}
          style={{
            width: slides.length * 100 + "%",
            transform: `translate(-${100 * current + "vw"}, 0)`,
          }}
        >
          {slides.map((item, index) => {
            const Slide = layout[item.frontmatter.layout || "default"];
            return <Slide item={item} key={index} />;
          })}
        </div>
      </div>
      <div className="record-tools">
        <RecordView />
        <button onClick={onEdit}>编辑</button>
        <button onClick={() => play(0)}>自动播放</button>
        <button disabled={exporting} onClick={onExport}>
          截屏
        </button>
      </div>
    </div>
  );
}

function Editor({ value, slides, onFinish, onChange }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <div className="bar">
          <button onClick={onFinish}>完成</button>
        </div>
        <textarea
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3"
        >
          {value}
        </textarea>
      </div>
      <div className="flex-1 editable">
        {slides.map((item, index) => {
          const Slide = layout[item.frontmatter.layout || "default"];
          return <Slide item={item} key={index} />;
        })}
      </div>
    </div>
  );
}

function App() {
  const [editable, setEditable] = useState(true);
  const [mdText, setMdText] = useState(defaultMdText);
  const [parsed, setParsed] = useState(parse(mdText));

  const handleChange = (value) => {
    setMdText(value);
    setParsed(parse(value));
  };

  return editable ? (
    <Editor
      slides={parsed.slides}
      onFinish={() => setEditable(false)}
      onChange={handleChange}
      value={mdText}
    />
  ) : (
    <Preview onEdit={() => setEditable(true)} slides={parsed.slides} />
  );
}

export default App;
