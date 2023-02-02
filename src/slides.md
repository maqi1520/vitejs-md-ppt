---
background: https://images.unsplash.com/photo-1568983268695-74a04650c8b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80
class: text-white
---

# Markdown 实现写 PPT、录视频 Demo 演示

在线幻灯片演示

---
layout: image-right
image: https://images.unsplash.com/photo-1662581871625-7dbd3ac1ca18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80
---

## 常用的 Markdown 解析器

- [markdown-it](https://github.com/markdown-it/markdown-it)
- [marked](https://github.com/markedjs/marked)
- [remark](https://github.com/remarkjs/remark)

---

## markdown-it 使用

```js
import Markdown from 'markdown-it';

const markdown = new Markdown();

markdown.render(`# 欢迎使用 Slidev! \n 为开发者打造的演示文稿工具`)
```

## 输出

``` html
<h1>欢迎使用 Slidev!</h1>
<p>为开发者打造的演示文稿工具</p>
```

---
layout: image-right
image: https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a00c4bd02971430abbe3506e2d8ccc56~tplv-k3u1fbpfcp-watermark.image?
---

##  简单布局


加层 section 和 css 就成了一张幻灯片

``` html
<section>  
  <h1>用 Slidev!</h1>
  <p>为开发者打造的演示文稿工具</p>
</section>
```

---
background: https://images.unsplash.com/photo-1494506281370-d80348b928fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
class: text-white
---

# 如何丰富布局？

- PPT 布局千变万化
- markdown 布局一成不变
- md 文件，如何实现布局？


---
layout: default
---

## 给 md 文件增加 Front Matter

```md
---
background: https://sli.dev/demo-cover.png
class: text-white
---

# Slidev

This is the default page.
```

---

## 经过 paser 解析

得到 json 数据

```js
const slides=[
  {
    data: {
      layout: 'image-right',
      background: 'https://sli.dev/demo-cover.png',
      class: 'text-white'
    },
    content: '# Slidev\n\nThis is the default page.'
  }
]
```

---

## 根据 layout 字段渲染不同的模板

```js
const layout = {
  default: DefaultSlideItem,
  'image-right': ImageRight,
};
function App() {
  return (
    <div className="app">
      {slides.map((item, index) => {
        const Slide = layout[item.data.layout || 'default'];
        return <Slide item={item} key={index} />;
      })}
    </div>
  );
}
```

---


## 不止 ImageRight 布局，你可以使用 HTML 任意布局

```jsx
function ImageRight({ item }) {
  return (
    <section className="slide-content grid grid-cols-2">
      <SlideItem item={item} />
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${item.data.image})`,
        }}
      ></div>
    </section>
  );
}
```

---

## 键盘控制 —— 在 useEffect 中监听 keydown 事件


```js
const [current, setCurrent] = React.useState(0)
React.useEffect(() => {
  const handleKeydown = (e) => {
    e.preventDefault();
    if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
      if (current < slides.length - 1) { setCurrent((prev) => prev + 1); }
    }
    if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
      if (current > 0) { setCurrent((prev) => prev - 1); }
    }
  };
  document.addEventListener('keydown', handleKeydown);
  return () => {
    document.removeEventListener('keydown', handleKeydown);
  };
}, [current]);
```

---

## 代码高亮

使用 prismjs 完成代码高亮

```js
import Markdown from 'markdown-it';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

useEffect(() => {
    Prism.highlightAll();
  }, []);
```

---
layout: image-right
image: https://images.unsplash.com/photo-1516961642265-531546e84af2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80
---

# 录制视频的 API

- `MediaDevices.getUserMedia()` 可用于获取麦克风以及摄像头的流
- `MediaDevices.getDisplayMedia()` 屏幕捕获流 MediaStream
- `MediaRecorder()` 构造函数会 Record 相关的接口

---

# 开源

GitHub地址：https://github.com/maqi1520/vitejs-md-ppt

具体关注我的掘金文章

---
layout: image-right 
image: https://img-qn.51miz.com/preview/video/00/00/15/58/V-155887-0E6CACA1.gif
---

# 雏形完成

感谢你观看，帮我点赞，对我真的很重要！！！
