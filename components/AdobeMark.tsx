/**
 * A simplified Adobe "A" mark (white on Adobe red), used next to the Adobe certifications to show who issued them.
 * Adobe and the Adobe logo are trademarks of Adobe Inc.; this is used only to identify the issuer of the credentials.
 */
export default function AdobeMark({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Adobe" className={className}>
      <rect width="64" height="64" rx="12" fill="#fa0f00" />
      <path d="M32 13 54 52H42.5L32 32.5 21.5 52H10Z" fill="#fff" />
    </svg>
  );
}
