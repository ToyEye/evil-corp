import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { selectThemeMode } from "../../store/theme/theme.slice";
import { COLORS, getActivePalette } from "../../theme/COLORS";

type SignaturePadProps = {
  value?: string;
  onChange: (value: string) => void;
};

export const SignaturePad = ({ value, onChange }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const themeMode = useSelector(selectThemeMode);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || value) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = getActivePalette().background.subtle;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [themeMode, value]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getPoint(event);

    if (!canvas || !context || !point) {
      return;
    }

    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.strokeStyle = getActivePalette().text.primary;
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) {
      return;
    }

    const context = canvasRef.current?.getContext("2d");
    const point = getPoint(event);

    if (!context || !point) {
      return;
    }

    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const handlePointerUp = () => {
    const canvas = canvasRef.current;

    drawing.current = false;

    if (canvas) {
      onChange(canvas.toDataURL("image/png"));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.fillStyle = getActivePalette().background.subtle;
    context.fillRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: COLORS.text.tertiary,
        }}
      >
        Signature
      </Typography>
      {value ? (
        <Box
          component="img"
          src={value}
          alt="Captured signature"
          sx={{
            display: "block",
            width: "100%",
            mt: 0.75,
            borderRadius: "10px",
            border: `1px solid ${COLORS.border.default}`,
            backgroundColor: COLORS.background.subtle,
          }}
        />
      ) : (
        <Box
          component="canvas"
          ref={canvasRef}
          width={480}
          height={160}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          sx={{
            display: "block",
            width: "100%",
            height: 140,
            mt: 0.75,
            borderRadius: "10px",
            border: `1px dashed ${COLORS.border.strong}`,
            backgroundColor: COLORS.background.subtle,
            touchAction: "none",
            cursor: "crosshair",
          }}
        />
      )}
      <Button
        type="button"
        onClick={handleClear}
        sx={{
          mt: 0.75,
          textTransform: "none",
          fontWeight: 600,
          color: COLORS.text.secondary,
        }}
      >
        Clear signature
      </Button>
    </Box>
  );
};
