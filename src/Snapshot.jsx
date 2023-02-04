import React,{useState} from "react";
import { downloadBlob, takeSnapshot } from "./utils";

export default function Snapshot() {
  const [exporting, setExporting] = useState(false);
  const onExport = () => {
    setExporting(true);
    setTimeout(() => {
      const node = document.querySelector("#root");
      takeSnapshot(node)
        .then((blobUrl) => {
          downloadBlob(
            blobUrl,
            new Date().toLocaleString().replace(/\//g, "-") + `.png`
          );
        })
        .catch((error) => {
          console.log("Error: " + error);
        })
        .finally(() => setExporting(false));
    }, 100);
  };

  return (
    <button disabled={exporting} onClick={onExport}>
      截屏
    </button>
  );
}
