"use client";

/**
 * Last-resort error page used when the root layout itself fails. It replaces the whole document, so it brings
 * its own <html> and <body> and relies on inline styles only (global CSS may not have loaded).
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0a0a0c",
          color: "#f1ece2",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 300, margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: "#a39e94", marginTop: "1rem" }}>The site could not load. Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.4rem",
              border: 0,
              borderRadius: 4,
              background: "#c9a45c",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && <p style={{ color: "#6b675f", fontSize: 12, marginTop: "1.5rem" }}>Reference: {error.digest}</p>}
        </div>
      </body>
    </html>
  );
}
