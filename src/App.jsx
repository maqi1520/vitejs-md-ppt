import { useState, useEffect, useRef } from 'react';
import './App.css';

const md =
  '---\n' +
  'background: https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6a6d6d5701543c5bff1dd2ca14b8ab3~tplv-k3u1fbpfcp-watermark.image?\n' +
  'class: text-white\n' +
  '---\n' +
  '\n' +
  '# Markdown 写PPT 是如何实现的？\n' +
  '\n' +
  '码上掘金幻灯片演示\n' +
  '\n' +
  '---\n' +
  'layout: image-right\n' +
  'image: https://images.unsplash.com/photo-1502189562704-87e622a34c85?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHw5NDczNDU2Nnx8fHx8fHwxNjU5OTI2OTkz&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400\n' +
  '---\n' +
  '\n' +
  '## 常用的 Markdown 解析器\n' +
  '\n' +
  '- [markdown-it](https://github.com/markdown-it/markdown-it)\n' +
  '- [marked](https://github.com/markedjs/marked)\n' +
  '- [remark](https://github.com/remarkjs/remark)\n' +
  '\n' +
  '---\n' +
  '\n' +
  '## markdown-it 使用\n' +
  '\n' +
  '```js\n' +
  "import Markdown from 'markdown-it';\n" +
  '\n' +
  'const markdown = new Markdown();\n' +
  '\n' +
  'markdown.render(`# 欢迎使用 Slidev! \\n 为开发者打造的演示文稿工具`)\n' +
  '```\n' +
  '\n' +
  '**输出**\n' +
  '\n' +
  '``` html\n' +
  '<h1>欢迎使用 Slidev!</h1>\n' +
  '<p>为开发者打造的演示文稿工具</p>\n' +
  '```\n' +
  '\n' +
  '---\n' +
  'layout: image-right\n' +
  'image: https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a00c4bd02971430abbe3506e2d8ccc56~tplv-k3u1fbpfcp-watermark.image?\n' +
  '---\n' +
  '\n' +
  '##  简单布局\n' +
  '\n' +
  '加层 section 和 css 就成了一张幻灯片\n' +
  '\n' +
  '``` html\n' +
  '<section>  \n' +
  '  <h1>用 Slidev!</h1>\n' +
  '  <p>为开发者打造的演示文稿工具</p>\n' +
  '</section>\n' +
  '```\n' +
  '\n' +
  '---\n' +
  '\n' +
  '# 如何丰富布局？\n' +
  '\n' +
  '- PPT 布局千变万化\n' +
  '- markdown 布局一成不变\n' +
  '- md 文件，如何实现布局？\n' +
  '\n' +
  '\n' +
  '---\n' +
  'layout: default\n' +
  '---\n' +
  '\n' +
  '## 给 md 文件增加 Front Matter\n' +
  '\n' +
  '```md\n' +
  '---\n' +
  'background: https://sli.dev/demo-cover.png\n' +
  'class: text-white\n' +
  '---\n' +
  '\n' +
  '# Slidev\n' +
  '\n' +
  'This is the default page.\n' +
  '```\n' +
  '\n' +
  '---\n' +
  '\n' +
  '## 经过 paser 解析\n' +
  '\n' +
  '得到 json 数据\n' +
  '\n' +
  '```js\n' +
  'const slides=[\n' +
  '  {\n' +
  '    data: {\n' +
  "      layout: 'image-right',\n" +
  "      background: 'https://sli.dev/demo-cover.png',\n" +
  "      class: 'text-white'\n" +
  '    },\n' +
  "    content: '# Slidev\\n\\nThis is the default page.'\n" +
  '  }\n' +
  ']\n' +
  '```\n' +
  '\n' +
  '---\n' +
  '\n' +
  '## 根据 layout 字段渲染不同的模板\n' +
  '\n' +
  '```js\n' +
  'const layout = {\n' +
  '  default: DefaultSlideItem,\n' +
  "  'image-right': ImageRight,\n" +
  '};\n' +
  'function App() {\n' +
  '  return (\n' +
  '    <div className="app">\n' +
  '      {slides.map((item, index) => {\n' +
  "        const Slide = layout[item.data.layout || 'default'];\n" +
  '        return <Slide item={item} key={index} />;\n' +
  '      })}\n' +
  '    </div>\n' +
  '  );\n' +
  '}\n' +
  '```\n' +
  '\n' +
  '---\n' +
  '\n' +
  '\n' +
  '## 不止 ImageRight 布局，你可以使用 HTML 任意布局\n' +
  '\n' +
  '```jsx\n' +
  'function ImageRight({ item }) {\n' +
  '  return (\n' +
  '    <section className="slide-content grid grid-cols-2">\n' +
  '      <SlideItem item={item} />\n' +
  '      <div\n' +
  '        className="w-full h-full"\n' +
  '        style={{\n' +
  '          backgroundImage: `url(${item.data.image})`,\n' +
  '        }}\n' +
  '      ></div>\n' +
  '    </section>\n' +
  '  );\n' +
  '}\n' +
  '```\n' +
  '\n' +
  '---\n' +
  '\n' +
  '## 键盘控制 —— 在 useEffect 中监听 keydown 事件\n' +
  '\n' +
  '\n' +
  '```js\n' +
  'const [current, setCurrent] = React.useState(0)\n' +
  'React.useEffect(() => {\n' +
  '  const handleKeydown = (e) => {\n' +
  '    e.preventDefault();\n' +
  "    if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {\n" +
  '      if (current < slides.length - 1) { setCurrent((prev) => prev + 1); }\n' +
  '    }\n' +
  "    if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {\n" +
  '      if (current > 0) { setCurrent((prev) => prev - 1); }\n' +
  '    }\n' +
  '  };\n' +
  "  document.addEventListener('keydown', handleKeydown);\n" +
  '  return () => {\n' +
  "    document.removeEventListener('keydown', handleKeydown);\n" +
  '  };\n' +
  '}, [current]);\n' +
  '```\n' +
  '\n' +
  '---\n' +
  '\n' +
  '## 代码高亮\n' +
  '\n' +
  '使用 prismjs 完成代码高亮\n' +
  '\n' +
  '```js\n' +
  "import Markdown from 'markdown-it';\n" +
  "import Prism from 'prismjs';\n" +
  "import 'prismjs/themes/prism-okaidia.css';\n" +
  '\n' +
  'useEffect(() => {\n' +
  '    Prism.highlightAll();\n' +
  '  }, []);\n' +
  '```\n' +
  '\n' +
  '---\n' +
  'layout: image-right \n' +
  'image: https://img-qn.51miz.com/preview/video/00/00/15/58/V-155887-0E6CACA1.gif\n' +
  '---\n' +
  '\n' +
  '# 雏形完成\n' +
  '\n' +
  '感谢你观看，帮我点赞，对我真的很重要！！！\n';

import Markdown from 'markdown-it';
import clsx from 'clsx';
import { parse } from '@slidev/parser';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-okaidia.css';

import { useReactMediaRecorder } from 'react-media-recorder';
import domtoimage from 'dom-to-image';

const sl = parse(md);

const markdown = new Markdown();

console.log(markdown.render(`# Title \n markdown PPT`));

function downloadBlob(blob, filename) {
  let element = document.createElement('a');
  element.setAttribute('href', blob);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const SCALE = 2;

function SlideItem({ item }) {
  return (
    <section
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundImage: item.frontmatter.background
          ? `linear-gradient(rgba(0, 0, 0, 0.333), rgba(0, 0, 0, 0.533)), url(${item.frontmatter.background})`
          : '',
      }}
      className={clsx('slidev-layout cover', item.frontmatter.class)}
    >
      <div className="my-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: markdown.render(item.content),
          }}
        ></div>
      </div>
    </section>
  );
}

function DefaultSlideItem({ item, style }) {
  return (
    <section style={style} className="slide-content">
      <SlideItem item={item} />
    </section>
  );
}

function ImageRight({ item, style }) {
  return (
    <section style={style} className="slide-content flex">
      <SlideItem item={item} />
      <div
        className="w-full h-full"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundImage: item.frontmatter.image
            ? `url(${item.frontmatter.image})`
            : '',
        }}
      ></div>
    </section>
  );
}

const layout = {
  default: DefaultSlideItem,
  'image-right': ImageRight,
};

const RecordView = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true, screen: true });

  return (
    <div>
      <p className="white">{status}</p>
      <button className="mr-3" onClick={startRecording}>
        开始
      </button>
      <button onClick={stopRecording}>停止</button>
      <video src={mediaBlobUrl} controls autoPlay loop />
    </div>
  );
};

let frames = [];

function App() {
  const [current, setCurrent] = useState(0);
  const [exporting, setExporting] = useState(0);
  const backgroundRef = useRef(null);
  useEffect(() => {
    const handleKeydown = (e) => {
      e.preventDefault();
      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        if (current < sl.slides.length - 1) {
          setCurrent((prev) => prev + 1);
        }
      }
      if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        if (current > 0) {
          setCurrent((prev) => prev - 1);
        }
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [current]);
  console.log(current);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const takeSnapshot = async () => {
    const node = backgroundRef.current;

    const style = {
      transform: 'scale(' + SCALE + ')',
      transformOrigin: 'top left',
      width: node.offsetWidth + 'px',
      height: node.offsetHeight + 'px',
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
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
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
      const blob = new Blob(chunks, { type: 'video/mp4' });
      chunks = [];
      const element = document.createElement('a');
      element.setAttribute('href', URL.createObjectURL(blob));
      element.setAttribute('download', `1.mp4`);

      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    mediaRecorder.start();
  };

  const onExport = () => {
    setExporting(true);

    setTimeout(() => {
      takeSnapshot()
        .then((blobUrl) => {
          downloadBlob(blobUrl, `1.png`);
        })
        .catch((error) => {
          console.log('Error: ' + error);
        })
        .finally(() => setExporting(false));
    }, 100);
  };

  useEffect(() => {
    takeSnapshot().then((imageBlob) => {
      frames.push(imageBlob);
    });
  }, [current]);

  const play = (cur) => {
    if (cur < sl.slides.length - 1) {
      setCurrent(cur + 1);
      setTimeout(() => {
        play(cur + 1);
      }, 1000);
    } else {
      console.log(frames);
      makeVideo(frames, 1000);
    }
  };

  return (
    <div>
      <div ref={backgroundRef} className="App">
        <div
          className="flex h-full transition-transform transform duration-500"
          style={{
            width: sl.slides.length * 100 + '%',
            transform: `translate(-${800 * current + 'px'}, 0)`,
          }}
        >
          {sl.slides.map((item, index) => {
            const Slide = layout[item.frontmatter.layout || 'default'];
            return <Slide item={item} key={index} />;
          })}
        </div>
      </div>
      <button className="mr-3" onClick={() => play(0)}>
        play
      </button>
      <button disabled={exporting} onClick={onExport}>
        export
      </button>
    </div>
  );
}

export default App;
