import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import defaultMdText from "./slides.md?raw";
import { parse } from "@slidev/parser";
import Editor from "./Editor";
import Preview from "./Preview";
import useLocalStorage from "react-use/esm/useLocalStorage";
import RecordView from "./RecordView";

function App() {
  const [editable, setEditable] = useState(true);
  const [mdText, setMdText] = useLocalStorage("md", defaultMdText);
  const [parsed, setParsed] = useState({
    slides: [],
  });

  useEffect(() => {
    let newParse;
    try {
      newParse = parse(defaultMdText);
    } catch (error) {
      console.log(error);
    }
    if (newParse) {
      setParsed(newParse);
    }
  }, []);

  const handleChange = (value) => {
    setMdText(value);
    let newParse;
    try {
      newParse = parse(value);
    } catch (error) {
      console.log(error);
    }
    if (newParse) {
      setParsed(newParse);
    }
  };

  return (
    <div>
      {editable ? (
        <Editor
          slides={parsed.slides}
          onFinish={() => setEditable(false)}
          onChange={handleChange}
          value={mdText}
        />
      ) : (
        <Preview slides={parsed.slides} />
      )}
      <RecordView editable={editable} onEdit={() => setEditable(true)} />
    </div>
  );
}

export default App;
