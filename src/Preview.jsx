import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import { layout } from "./Layouts";

export default function Preview({ slides }) {
  const [current, setCurrent] = useState(0);

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

  return (
    <div>
      <div className="h-screen w-screen overflow-hidden">
        <div
          className="flex h-full transition-transform transform duration-500"
          style={{
            width: slides.length * 100 + "%",
            transform: `translate(-${100 * current + "vw"}, 0)`,
          }}
        >
          {slides.map((item, index) => {
            const Slide =
              layout[item.frontmatter.layout || "default"] || layout["default"];
            return <Slide item={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
