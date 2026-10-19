import { Fragment } from "react";

interface WordsProps {
  text: string;
  /** Class applied to every animated word (GSAP targets it). */
  wordClassName?: string;
}

/**
 * Splits text into words wrapped in clipping masks so they can slide up one by one.
 * Screen readers get the whole sentence from a visually hidden copy; the animated pieces are aria-hidden
 * (an aria-label on a plain <span> is not reliably announced, so it is not used).
 */
export default function Words({ text, wordClassName = "word" }: WordsProps) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span className={`${wordClassName} inline-block will-change-transform`}>{word}</span>
            </span>
            {index < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>
  );
}
