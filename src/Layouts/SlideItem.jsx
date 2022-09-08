import React from "react";
import clsx from "clsx";
import Markdown from "markdown-it";
const markdown = new Markdown();

export default function SlideItem({ item }) {
  return (
    <section
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundImage: item.frontmatter.background
          ? `linear-gradient(rgba(0, 0, 0, 0.333), rgba(0, 0, 0, 0.533)), url(${item.frontmatter.background})`
          : "",
      }}
      className={clsx("slidev-layout cover", item.frontmatter.class)}
    >
      <div className="my-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: markdown.render(item.content),
          }}
        ></div>
      </div>
    </section>
  );
}
