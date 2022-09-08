import React from "react";
import SlideItem from "./SlideItem";

export default function DefaultSlideItem({ item, style }) {
  return (
    <section style={style} className="slide-content">
      <SlideItem item={item} />
    </section>
  );
}
