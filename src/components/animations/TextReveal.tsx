import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  splitBy?: "words" | "lines" | "chars";
};

export const TextReveal = ({
  children,
  className = "",
  delay = 0,
  stagger = 0.05,
  splitBy = "words",
}: TextRevealProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const text = children;

    // Разбиваем текст на части
    let parts: string[] = [];
    if (splitBy === "words") {
      parts = text.split(" ");
    } else if (splitBy === "lines") {
      parts = text.split("\n");
    } else {
      parts = text.split("");
    }

    // Создаем HTML с обертками
    element.innerHTML = parts
      .map(
        (part, i) =>
          `<span class="inline-block overflow-hidden">
            <span class="inline-block reveal-word" style="transform: translateY(100%); opacity: 0;">
              ${part}${splitBy === "words" && i < parts.length - 1 ? "&nbsp;" : ""}
            </span>
          </span>`
      )
      .join("");

    const words = element.querySelectorAll(".reveal-word");

    // GSAP анимация
    gsap.fromTo(
      words,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: stagger,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
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
  }, [children, delay, stagger, splitBy]);

  return <div ref={textRef} className={className} />;
};
