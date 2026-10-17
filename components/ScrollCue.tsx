interface ScrollCueProps {
  onClick: () => void;
  /** Accessible name, since the button itself shows only an icon. */
  label?: string;
  className?: string;
}

/**
 * "Scroll down" button: a mouse outline with a moving wheel and a small chevron. It takes its colour from the
 * surrounding text colour (`currentColor`), is a real button (keyboard and screen-reader friendly) and scrolls
 * to the next scene when pressed.
 */
export default function ScrollCue({ onClick, label = "Scroll to the next section", className = "" }: ScrollCueProps) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={`scroll-cue-button group inline-flex flex-col items-center gap-2 ${className}`}>
      <span aria-hidden className="scroll-mouse">
        <span className="scroll-wheel" />
      </span>
      <svg aria-hidden viewBox="0 0 16 16" className="scroll-chevron h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6l5 5 5-5" />
      </svg>
    </button>
  );
}
