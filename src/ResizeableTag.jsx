import { Resizable } from "react-resizable";
import React from "react";
import useLocalStorage from "react-use/esm/useLocalStorage";

function ResizeableTag({ defaultWidth, localkey, ...restProps }) {
  const [width, setWdith] = useLocalStorage(localkey,defaultWidth);

  const onResize = (e, { size }) => {
    setWdith(size.width);
    window.localStorage.setItem(localkey, size.width);
  };

  if (!width) {
    return <div {...restProps} />;
  }
  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <div {...restProps} style={{ width }} />
    </Resizable>
  );
}

export default ResizeableTag;
