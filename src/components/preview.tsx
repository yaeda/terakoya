import clsx from "clsx";
import { FC, useEffect, useRef } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Worksheet } from "./worksheet/worksheet";

type PreviewProps = {
  className?: ClassNameValue;
};

export const Preview: FC<PreviewProps> = ({ className }) => {
  const ref = useRef<HTMLDivElement>(null);

  // resize observer
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((el) => {
        const OFFSET = 16 * 2;
        const worksheetEl = el.target.firstChild as HTMLDivElement;
        const worksheetWidth = worksheetEl.clientWidth;
        const worksheetHeight = worksheetEl.clientHeight;
        const scaleX = (el.contentRect.width - OFFSET) / worksheetWidth;
        const scaleY = (el.contentRect.height - OFFSET) / worksheetHeight;
        worksheetEl.style.setProperty(
          "--preview-scale",
          `${Math.min(scaleX, scaleY)}`,
        );
      });
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={clsx("flex size-full items-center justify-center", className)}
    >
      <div className="size-fit scale-[var(--preview-scale)] shadow-2xl [--preview-scale:1]">
        <Worksheet />
      </div>
    </div>
  );
};
