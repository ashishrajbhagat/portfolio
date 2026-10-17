import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontFile = (name: string) =>
  readFile(join(process.cwd(), "node_modules/@fontsource", name.split("/")[0], "files", name.split("/")[1]));

const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif" };

/** Reads the portrait as a data URL (the share-image renderer supports JPEG, PNG and GIF, not WebP). */
async function portraitDataUrl(): Promise<string | null> {
  const extension = site.avatar.split(".").pop()?.toLowerCase() ?? "";
  const mime = MIME[extension];
  if (!mime) return null;
  try {
    const file = await readFile(join(process.cwd(), "public", site.avatar));
    return `data:${mime};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

interface OgOptions {
  /** Small line above the name, e.g. "Recruiter view · Cinematic story". */
  eyebrow: string;
  accent?: string;
}

/** The 1200x630 share card used for link previews (LinkedIn, WhatsApp, X...). */
export async function renderOgImage({ eyebrow, accent = "#c9a45c" }: OgOptions) {
  const [photo, serif, sans] = await Promise.all([
    portraitDataUrl(),
    fontFile("fraunces/fraunces-latin-600-normal.woff"),
    fontFile("instrument-sans/instrument-sans-latin-500-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#0a0a0c",
          backgroundImage: `radial-gradient(circle at 15% 0%, ${accent}33, transparent 55%)`,
          color: "#f1ece2",
          fontFamily: "Instrument Sans",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: accent, textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 104, lineHeight: 1.05, marginTop: 24 }}>{site.name}</div>
          <div style={{ display: "flex", width: 96, height: 3, background: accent, marginTop: 30 }} />
          <div style={{ display: "flex", fontSize: 34, marginTop: 30, color: "#cfc9bd" }}>Software Engineer · AEM &amp; Full-stack</div>
          <div style={{ display: "flex", fontSize: 24, marginTop: 56, color: "#8f8a80" }}>{site.domain}</div>
        </div>

        {photo ? (
          <div style={{ display: "flex", padding: 10, borderRadius: 9999, border: `3px solid ${accent}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} width={380} height={380} alt="" style={{ borderRadius: 9999, objectFit: "cover" }} />
          </div>
        ) : null}
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: serif, weight: 600, style: "normal" },
        { name: "Instrument Sans", data: sans, weight: 500, style: "normal" },
      ],
    }
  );
}
