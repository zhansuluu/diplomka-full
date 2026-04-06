import { motion } from "framer-motion";
import type { ComponentType } from "react";

const EASING = [0.22, 1, 0.36, 1];

type StaggerTextProps<T extends keyof JSX.IntrinsicElements | ComponentType<any>> = {
  as?: T;
  lines: string[];
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightClassName?: string;
};

export const StaggerText = <T extends keyof JSX.IntrinsicElements | React.ComponentType<any>>({
  as,
  lines,
  className,
  delay = 0,
  highlightWords = [],
  highlightClassName = "text-purple-600",
}: StaggerTextProps<T>) => {
  const Component = (as || "h1") as any;

  return (
    <Component className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="inline-block w-full">
          {line.split(/(\s+)/).map((word, wordIndex) => {
            const isSpace = /^\s+$/.test(word);

            if (isSpace) {
              return <span key={wordIndex} aria-hidden="true">{word}</span>;
            }

            const cleanedWord = word.replace(/[^A-Za-z0-9]/g, "");
            const shouldHighlight = highlightWords.includes(cleanedWord);

            return (
              <motion.span
                key={wordIndex}
                className={`inline-block ${shouldHighlight ? highlightClassName : ""}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{
                  duration: 0.9,
                  ease: EASING,
                  delay: delay + lineIndex * 0.08 + wordIndex * 0.035,
                }}
              >
                {word}
              </motion.span>
            );
          })}
          {lineIndex !== lines.length - 1 && <br />}
        </span>
      ))}
    </Component>
  );
};
