import { motion, useScroll } from "framer-motion";
import type { RefObject } from "react";

type ScrollProgressProps = {
  containerRef?: RefObject<HTMLElement>;
};

export const ScrollProgress = ({ containerRef }: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div className="fixed left-0 top-0 w-full h-1 z-[60] pointer-events-none">
      <motion.div
        className="h-full bg-purple-600"
        style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
      />
    </div>
  );
};
