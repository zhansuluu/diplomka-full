import { useEffect } from "react";
import Lenis from "lenis";
import type { RefObject } from "react";

type SmoothScrollProps = {
  rootRef?: RefObject<HTMLElement>;
};

const ease = (t: number) => {
  // cubic-bezier(0.22, 1, 0.36, 1) approximation
  const u = 1 - t;
  const y1 = 1;
  const y2 = 1;
  return 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
};

export const SmoothScroll = ({ rootRef }: SmoothScrollProps) => {
  useEffect(() => {
    const wrapper = rootRef?.current ?? window;
    const content =
      rootRef?.current?.firstElementChild ?? rootRef?.current ?? document.documentElement;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
      easing: ease,
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [rootRef]);

  return null;
};
