import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StickyRevealProps = {
  children: React.ReactNode;
  className?: string;
  pin?: boolean;
  pinSpacing?: boolean;
  scrub?: boolean;
};

export const StickyReveal = ({
  children,
  className = "",
  pin = false,
  pinSpacing = true,
  scrub = false,
}: StickyRevealProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const element = sectionRef.current;

    // Fade in + slide up при входе в viewport
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
          pin: pin,
          pinSpacing: pinSpacing,
          scrub: scrub,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [pin, pinSpacing, scrub]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};
