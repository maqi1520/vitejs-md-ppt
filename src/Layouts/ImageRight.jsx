import React from "react";
import SlideItem from "./SlideItem";

export default function ImageRight({ item, style }) {
  return (
    <section style={style} className="slide-content flex">
      <SlideItem item={item} />
      <div
        className="w-full h-full"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundImage: item.frontmatter.image
            ? `url(${item.frontmatter.image})`
            : "",
        }}
      ></div>
    </section>
  );
}
