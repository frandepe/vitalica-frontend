import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 40 + Math.random() * 80,
    length: height * 2.5,
    angle,
    speed: 0.5 + Math.random() * 0.8,
    opacity: 0.15 + Math.random() * 0.15,
    hue: 180 + Math.random() * 80,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({
  className,
  children,
  intensity = "medium",
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  const opacityMap = {
    subtle: 0.6,
    medium: 0.85,
    strong: 1,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      beamsRef.current = Array.from({ length: 24 }, () =>
        createBeam(window.innerWidth, window.innerHeight)
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const opacity =
        beam.opacity *
        (0.85 + Math.sin(beam.pulse) * 0.15) *
        opacityMap[intensity];

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `hsla(${beam.hue},75%,55%,0)`);
      gradient.addColorStop(0.35, `hsla(${beam.hue},75%,55%,${opacity})`);
      gradient.addColorStop(0.65, `hsla(${beam.hue},75%,55%,${opacity})`);
      gradient.addColorStop(1, `hsla(${beam.hue},75%,55%,0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(30px)";

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          Object.assign(
            beam,
            createBeam(window.innerWidth, window.innerHeight)
          );
          beam.y = window.innerHeight + 100;
        }

        drawBeam(beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-white dark:bg-background",
        className
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ backdropFilter: "blur(60px)" }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
