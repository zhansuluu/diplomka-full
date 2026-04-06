import { useEffect, useRef } from "react";
import gsap from "gsap";

type HoverLiftProps = {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  y?: number;
  shadowIntensity?: number;
  duration?: number;
};

export const HoverLift = ({
  children,
  className = "",
  scale = 1.02,
  y = -8,
  shadowIntensity = 0.25,
  duration = 0.4,
}: HoverLiftProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale,
        y,
        boxShadow: `8px 8px 0px rgba(0, 0, 0, ${shadowIntensity})`,
        duration,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
        duration,
        ease: "power2.out",
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [scale, y, shadowIntensity, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};
