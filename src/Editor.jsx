import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import { toggleTheme } from "./utils/theme";
import { layout } from "./Layouts";
import MonacoEditor from "./MonacoEditor";

export default function Editor({ value, slides, onFinish, onChange }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [slides]);

  return (
    <div className="flex h-screen">
      <div style={{ width: "50%" }} className="flex-1 border-right">
        <div className="px-4 py-2 shadow border-b dark:border-gray-800 flex justify-between items-center">
          <span className="inline-flex items-center">
            <span className="text-xl mr-2 font-medium text-gray-800 dark:text-white">
              Markdown PPT Online
            </span>
            <svg
              onClick={() => toggleTheme()}
              fill="none"
              className="w-6 h-6 text-gray-900 dark:text-white cursor-pointer"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g className="dark:opacity-0">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                ></path>
              </g>
              <g className="opacity-0 dark:opacity-100">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                ></path>
              </g>
            </svg>
          </span>
          <button className="w-20 py-2" onClick={onFinish}>
            完成
          </button>
        </div>
        <MonacoEditor
          onChange={onChange}
          className="w-full h-[calc(100vh-52px)]"
          defaultValue={value}
        />
      </div>
      <div className="flex-1 editable pt-20">
        {slides.map((item, index) => {
          const Slide =
            layout[item.frontmatter.layout || "default"] || layout["default"];
          return <Slide item={item} key={index} />;
        })}
      </div>
    </div>
  );
}
