import React, { useRef, useEffect } from "react";
import Draggable from "react-draggable";
import useLocalStorage from "react-use/esm/useLocalStorage";

const RecordView = ({ cameraDeviceId,setShowCamera }) => {
  const [size, setSize] = useLocalStorage("size", "small");
  const ref = useRef(null);
  useEffect(() => {
    const constraints = {
      audio: false,
      video: {
        deviceId: cameraDeviceId,
        width: 384,
        height: 384,
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
    <Draggable>
      <div className="absolute right-10 bottom-14 z-10 group">
        <video
          className={
            size == "small"
              ? "w-48 h-48 rounded-full"
              : "w-72 h-72 rounded-full"
          }
          ref={ref}
          controls
          autoPlay
          loop
        />
        <div className="absolute inset-0 cursor-move"></div>
        <div className="absolute -bottom-12  left-0 w-full flex opacity-0 group-hover:opacity-100">
          <div className="rounded-full bg-neutral-800 grid grid-cols-3 gap-2 py-2 px-3 m-auto">
            <button onClick={()=>setSize('small')} className="w-6 h-6 bg-transparent hover:bg-neutral-600 grid rounded-full">
              <span className="w-[8px] h-[8px] p-0 m-auto bg-white rounded-full"></span>
            </button>
            <button onClick={()=>setSize('medium')} className="w-6 h-6 hover:bg-neutral-600 grid rounded-full">
              <span className="w-[10px] h-[10px]  m-auto  bg-white rounded-full"></span>
            </button>
            <button onClick={()=>setShowCamera(false)} className="w-6 h-6 hover:bg-neutral-600 gird rounded-full">
              <svg
                className="w-4 h-4 m-auto text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default RecordView;
