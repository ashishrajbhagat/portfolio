import { Fragment } from "react";

interface WordsProps {
  text: string;
  /** Class applied to every animated word (GSAP targets it). */
  wordClassName?: string;
}

/**
 * Splits text into words wrapped in clipping masks so they can slide up one by one.
 * The visual spans are aria-hidden; screen readers get the full sentence from the label.
 */
export default function Words({ text, wordClassName = "word" }: WordsProps) {
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span className={`${wordClassName} inline-block will-change-transform`}>{word}</span>
          </span>
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
