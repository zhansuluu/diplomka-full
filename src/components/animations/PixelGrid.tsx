import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Pixel = {
  col: number;
  row: number;
  opacity: number;
  targetOpacity: number;
  speed: number;
  colorIndex: number;

  // движение
  dx: number;
  dy: number;
  moveTimer: number;
};

type PixelGridProps = {
  className?: string;
  pixelSize?: number;
  gridLineColor?: string;
  pixelColors?: string[];
  maxOpacity?: number;
  density?: number;
  showGrid?: boolean;
};

export const PixelGrid = ({
  className = "",
  pixelSize = 36,
  gridLineColor = "rgba(200, 190, 220, 0.25)",
  pixelColors = [
    "200, 180, 235",
    "180, 160, 225",
    "220, 200, 245",
    "160, 140, 210",
  ],
  maxOpacity = 0.18,
  density = 0.06,
  showGrid = true,
}: PixelGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const pixelsRef = useRef<Pixel[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement?.parentElement; // Section element
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const cols = Math.ceil(rect.width / pixelSize);
      const rows = Math.ceil(rect.height / pixelSize);

      dimensionsRef.current = {
        width: rect.width,
        height: rect.height,
        cols,
        rows,
      };

      initPixels(cols, rows);
    };

    const initPixels = (cols: number, rows: number) => {
      const total = cols * rows;
      const count = Math.floor(total * density);

      pixelsRef.current = [];

      for (let i = 0; i < count; i++) {
        pixelsRef.current.push({
          col: Math.floor(Math.random() * cols),
          row: Math.floor(Math.random() * rows),
          opacity: 0,
          targetOpacity: Math.random() * maxOpacity + 0.05,
          speed: 0.02 + Math.random() * 0.02,
          colorIndex: Math.floor(Math.random() * pixelColors.length),

          dx: randomDir(),
          dy: randomDir(),
          moveTimer: 0,
        });
      }
    };

    const randomDir = () => {
      const dirs = [-1, 0, 1];
      return dirs[Math.floor(Math.random() * dirs.length)];
    };

            const updatePixel = (p: Pixel) => {
        const { cols, rows } = dimensionsRef.current;

        // плавное изменение прозрачности
        p.opacity += (p.targetOpacity - p.opacity) * p.speed;

        // если почти исчез — перезапускаем
        if (p.opacity < 0.03 && p.targetOpacity === 0) {
            p.col = Math.floor(Math.random() * cols);
            p.row = Math.floor(Math.random() * rows);
            p.targetOpacity = Math.random() * maxOpacity + 0.05;
            p.colorIndex = Math.floor(Math.random() * pixelColors.length);
        }

        // случайное движение
        if (Math.random() > 0.93) {
            p.col += Math.floor(Math.random() * 3) - 1;
            p.row += Math.floor(Math.random() * 3) - 1;

            // циклические границы
            if (p.col < 0) p.col = cols - 1;
            if (p.col >= cols) p.col = 0;
            if (p.row < 0) p.row = rows - 1;
            if (p.row >= rows) p.row = 0;
        }

        // очень редко начать затухание
        if (Math.random() > 0.999) {
            p.targetOpacity = 0;
        }
        };

    const drawGrid = () => {
      const { width, height, cols, rows } = dimensionsRef.current;

      ctx.strokeStyle = gridLineColor;
      ctx.lineWidth = 0.5;

      ctx.beginPath();

      for (let i = 0; i <= cols; i++) {
        const x = i * pixelSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let j = 0; j <= rows; j++) {
        const y = j * pixelSize;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
    };

    const draw = () => {
      const { width, height } = dimensionsRef.current;

      ctx.clearRect(0, 0, width, height);

      if (showGrid) {
        drawGrid();
      }

      const padding = 3;
      const size = pixelSize - padding * 2;

      for (const p of pixelsRef.current) {
        updatePixel(p);

        if (p.opacity > 0.01) {
          const x = p.col * pixelSize + padding;
          const y = p.row * pixelSize + padding;
          const color = pixelColors[p.colorIndex];

          ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
          ctx.fillRect(x, y, size, size);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    // ScrollTrigger to fade out when section scrolls up
    const parent = canvas.parentElement?.parentElement;
    if (parent) {
      ScrollTrigger.create({
        trigger: parent,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          canvas.style.opacity = (1 - progress * 2).toString(); // Fade out faster
        },
      });
    }

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      cancelAnimationFrame(animationRef.current);
    };
  }, [pixelSize, gridLineColor, pixelColors, maxOpacity, density, showGrid]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};