import React, { useRef, useEffect, useState } from "react";

const RecordView = ({ cameraDeviceId }) => {
  const ref = useRef(null);
  useEffect(() => {
    const constraints = {
      audio: false,
      video: {
        deviceId: cameraDeviceId,
        width: 720,
        height: 720,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        const video = ref.current;
        video.srcObject = mediaStream;
        video.onloadedmetadata = () => {
          video.play();
        };
      })
      .catch((err) => {
        // always check for errors at the end.
        console.error(`${err.name}: ${err.message}`);
      });
  }, [cameraDeviceId]);

  return (
    <div className="absolute right-10 bottom-10 z-10">
      <video
        className="w-32 h-32 rounded-full"
        ref={ref}
        controls
        autoPlay
        loop
      />
    </div>
  );
};

export default RecordView;
