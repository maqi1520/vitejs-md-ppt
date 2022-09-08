import React from "react";
import VideoPreview from "./VideoPreview";
import { useReactMediaRecorder } from "react-media-recorder";
import { downloadBlob } from "./utils";

export default function RecordView() {
  const onStop = (mediaBlobUrl) => {
    downloadBlob(mediaBlobUrl, "1.mp4");
  };
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useReactMediaRecorder({
    screen: true,
    audio: true,
    onStop,
  });

  return (
    <>
      <span className="text-white mr-3">状态：{status}</span>
      {status === "idle" && <button onClick={startRecording}>开始</button>}
      {status === "recording" && <button onClick={pauseRecording}>暂停</button>}
      {status === "stopped" && <button onClick={resumeRecording}>继续</button>}
      {status !== "idle" && <button onClick={stopRecording}>结束</button>}
    </>
  );
}
