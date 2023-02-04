import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import Draggable from "react-draggable";
import { downloadBlob, play } from "./utils";
import Camera from "./Camera";
import useMediaDevices from "react-use/esm/useMediaDevices";
import useLocalStorage from "react-use/esm/useLocalStorage";
import Snapshot from "./Snapshot";

export default function RecordView({ onEdit, editable }) {
  const [cameraDeviceId, setCameraDeviceId] = useLocalStorage("cameraDeviceId");
  const [audioDeviceId, setAudioDeviceId] = useLocalStorage("audioDeviceId");

  const { devices = [] } = useMediaDevices();

  const [showCamera, setShowCamera] = useState(false);
  const onStop = (mediaBlobUrl) => {
    downloadBlob(
      mediaBlobUrl,
      new Date().toLocaleString().replace(/\//g, "-") + `.mp4`
    );
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
      <Draggable>
        <div className="opacity-0 p-5 fixed bg-neutral-800 cursor-move text-white bg-opacity-80 rounded-lg bottom-12 left-4 transition-opacity hover:opacity-100 active:opacity-100">
          <div className="space-x-3">
            <label className="mr-3 inline-flex items-center">
              录像：
              <input
                className="accent-indigo-500"
                type="checkbox"
                checked={showCamera}
                onChange={(e) => setShowCamera(e.target.checked)}
              />
            </label>
            <span className="mr-3">状态：{status}</span>
            {status === "idle" && (
              <button className="btn" onClick={startRecording}>
                开始
              </button>
            )}
            {status === "recording" && (
              <button className="btn" onClick={pauseRecording}>
                暂停
              </button>
            )}
            {status === "stopped" && (
              <button className="btn" onClick={resumeRecording}>
                继续
              </button>
            )}
            {status !== "idle" && (
              <button className="btn" onClick={stopRecording}>
                结束
              </button>
            )}
            <button className="btn" onClick={onEdit}>
              编辑
            </button>
            {!editable && (
              <button className="btn" onClick={() => play(0)}>
                自动播放
              </button>
            )}

            {!editable && <Snapshot />}
          </div>
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
      </Draggable>
      {showCamera && (
        <Camera setShowCamera={setShowCamera} cameraDeviceId={cameraDeviceId} />
      )}
    </>
  );
}
