import { useLayoutEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

type FitTextProps = {
  text: string;
  maxFontSize?: number;
  minFontSize?: number;
  sx?: SxProps<Theme>;
};

export const FitText = ({
  text,
  maxFontSize = 16,
  minFontSize = 11,
  sx,
}: FitTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const element = ref.current;
    const parent = element?.parentElement;

    if (!element || !parent) {
      return;
    }

    const fit = () => {
      let nextSize = maxFontSize;
      element.style.fontSize = `${nextSize}px`;

      while (nextSize > minFontSize && element.scrollWidth > parent.clientWidth) {
        nextSize -= 0.5;
        element.style.fontSize = `${nextSize}px`;
      }

      setFontSize(nextSize);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(parent);

    return () => observer.disconnect();
  }, [maxFontSize, minFontSize, text]);

  return (
    <Typography
      ref={ref}
      component="span"
      title={text}
      sx={{
        display: "block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontWeight: 700,
        lineHeight: 1.2,
        fontSize: `${fontSize}px`,
        ...sx,
      }}
    >
      {text}
    </Typography>
  );
};
