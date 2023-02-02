import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { downloadBlob } from "./utils";
import Camera from "./Camera";
import useMediaDevices from "react-use/esm/useMediaDevices";
import useLocalStorage from "react-use/esm/useLocalStorage";

export default function RecordView({ onEdit, play, onExport, exporting }) {
  const [cameraDeviceId, setCameraDeviceId] = useLocalStorage('cameraDeviceId');
  const [audioDeviceId, setAudioDeviceId] = useLocalStorage('audioDeviceId');

  const { devices = [] } = useMediaDevices();
  
  const [showCamera, setShowCamera] = useState(false);
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
    audio: showCamera
      ? false
      : audioDeviceId
      ? {
          deviceId: audioDeviceId,
        }
      : true,
    video: false,
    onStop,
  });

  return (
    <>
      <div className="opacity-0 p-5 fixed bg-black text-white bg-opacity-40 rounded-sm bottom-0 left-3 transition-opacity hover:opacity-100 active:opacity-100 space-x-3">
        <label className="mr-3 inline-flex items-center">
          录像：
          <input
            className="accent-indigo-500"
            type="checkbox"
            checked={showCamera}
            onChange={(e) => setShowCamera(e.target.checked)}
          />
        </label>
        <span className=" mr-3">状态：{status}</span>
        {status === "idle" && <button onClick={startRecording}>开始</button>}
        {status === "recording" && (
          <button onClick={pauseRecording}>暂停</button>
        )}
        {status === "stopped" && (
          <button onClick={resumeRecording}>继续</button>
        )}
        {status !== "idle" && <button onClick={stopRecording}>结束</button>}
        <button onClick={onEdit}>编辑</button>
        <button onClick={() => play(0)}>自动播放</button>
        <button disabled={exporting} onClick={onExport}>
          截屏
        </button>
        <div className="space-y-3 mt-3">
          <div className="flex justify-start items-center">
            <label className="flex-shrink">🎤 麦克风：</label>
            <select
              className="rounded w-60 text-black"
              value={audioDeviceId}
              onChange={(e) => setAudioDeviceId(e.target.value)}
            >
              {devices.map((device) => {
                if (device.kind === "audioinput") {
                  return (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div className="flex justify-start items-center">
            <label className="flex-shrink"> 📷 摄像头：</label>
            <select
              className="rounded w-60 text-black"
              value={cameraDeviceId}
              onChange={(e) => setCameraDeviceId(e.target.value)}
            >
              {devices.map((device) => {
                if (device.kind === "videoinput") {
                  return (
                    <option value={device.deviceId} key={device.deviceId}>
                      {device.label}
                    </option>
                  );
                }
              })}
            </select>
          </div>
        </div>
      </div>
      {showCamera && <Camera cameraDeviceId={cameraDeviceId} />}
    </>
  );
}
