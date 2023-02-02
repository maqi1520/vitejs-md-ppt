import React, { useEffect, useRef } from "react";
import { getTheme, onDidChangeTheme } from "./utils/theme";

export default function MonacoEditor({ defaultValue, className, onChange }) {
  const editorRef = useRef();
  const domRef = useRef();
  useEffect(() => {
    require(["vs/editor/editor.main"], function () {
      if (!editorRef.current) {
        const editor = monaco.editor.create(domRef.current, {
          value: defaultValue,
          language: "markdown",
          fontSize: "14px",
          minimap: { enabled: false },
          theme: getTheme() === "dark" ? "vs-dark" : "vs-light",
        });
        editor.onDidChangeModelContent(() => {
          onChange(editor.getValue());
        });
        editorRef.current = editor;

        window.editor = editorRef.current;
      }
    });
  }, []);
  useEffect(() => {
    function handleThemeChange(theme) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs-light");
    }
    const dispose = onDidChangeTheme(handleThemeChange);
    return () => dispose();
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      window.setTimeout(() => editorRef.current?.layout(), 0);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);
  return <div className={className} ref={domRef}></div>;
}
