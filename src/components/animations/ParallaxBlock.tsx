import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode, RefObject } from "react";

type ParallaxBlockProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  containerRef?: RefObject<HTMLElement>;
};

export const ParallaxBlock = ({
  children,
  className,
  intensity = 20,
  containerRef,
}: ParallaxBlockProps) => {
  const { scrollY } = useScroll({ container: containerRef });
  const translateY = useTransform(scrollY, [0, 1000], [0, intensity]);

  return (
    <motion.div style={{ y: translateY }} className={className}>
      {children}
    </motion.div>
  );
};
