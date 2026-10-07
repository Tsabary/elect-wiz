/**
 * Social preview images (Open Graph / X). Party names and site copy only:
 * never the user's answers, never poll figures or threshold notes (social
 * platforms cache these images beyond our control; research/legal-findings.md
 * §3.1, impact 3), never anything identifying the operator.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hasRtl, visualRtl } from "@/lib/share/bidi";

export const OG_SIZE = { width: 1200, height: 630 };

/** Israeli flag blue, matching `--flag-blue` in app/globals.css. */
const FLAG_BLUE = "#0038b8";
const INK = "#0f1b3d";
const INK_SOFT = "#3d4a6b";

const BOLD = "HeeboBoldHe, HeeboBoldLat";
const REGULAR = "HeeboHe, HeeboLat";

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

async function fonts() {
  const load = (f: string) => readFile(path.join(FONT_DIR, f));
  const [latin700, hebrew700, latin400, hebrew400] = await Promise.all([
    load("heebo-latin-700-normal.woff"),
    load("heebo-hebrew-700-normal.woff"),
    load("heebo-latin-400-normal.woff"),
    load("heebo-hebrew-400-normal.woff"),
  ]);
  // One family name per subset file: satori uses only the first file of a
  // family, so Hebrew and Latin are chained as a fallback list (see BOLD/REGULAR).
  return [
    { name: "HeeboBoldHe", data: hebrew700, weight: 700 as const, style: "normal" as const },
    { name: "HeeboBoldLat", data: latin700, weight: 700 as const, style: "normal" as const },
    { name: "HeeboHe", data: hebrew400, weight: 400 as const, style: "normal" as const },
    { name: "HeeboLat", data: latin400, weight: 400 as const, style: "normal" as const },
  ];
}

function line(text: string, rtl: boolean, max = 60): string {
  const clipped =
    Array.from(text).length > max
      ? `${Array.from(text)
          .slice(0, max - 1)
          .join("")}…`
      : text;
  return rtl && hasRtl(clipped) ? visualRtl(clipped) : clipped;
}

function sizeFor(text: string): number {
  const n = Array.from(text).length;
  return n <= 18 ? 84 : n <= 28 ? 68 : n <= 40 ? 54 : 44;
}

export interface OgContent {
  rtl: boolean;
  siteName: string;
  eyebrow?: string;
  headline: string;
  secondary?: string;
  cta: string;
}

export async function renderOgImage(c: OgContent): Promise<ImageResponse> {
  const align = c.rtl ? "flex-end" : "flex-start";
  const text = { display: "flex", justifyContent: align, width: "100%" } as const;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        color: INK,
        fontFamily: REGULAR,
        padding: "72px 72px",
        // Flag-style bands: a thick blue stripe set in from each edge.
        borderTop: `14px solid ${FLAG_BLUE}`,
        borderBottom: `14px solid ${FLAG_BLUE}`,
      }}
    >
      <div
        style={{
          ...text,
          fontSize: 34,
          fontWeight: 700,
          fontFamily: BOLD,
          color: FLAG_BLUE,
        }}
      >
        {line(c.siteName, c.rtl)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
        {c.eyebrow ? (
          <div
            style={{
              ...text,
              fontSize: 36,
              fontWeight: 400,
              fontFamily: REGULAR,
              color: INK_SOFT,
            }}
          >
            {line(c.eyebrow, c.rtl)}
          </div>
        ) : null}
        <div
          style={{
            ...text,
            fontSize: sizeFor(c.headline),
            fontWeight: 700,
            fontFamily: BOLD,
            lineHeight: 1.1,
          }}
        >
          {line(c.headline, c.rtl)}
        </div>
        {c.secondary ? (
          <div
            style={{
              ...text,
              fontSize: 32,
              fontWeight: 400,
              fontFamily: REGULAR,
              color: INK_SOFT,
            }}
          >
            {line(c.secondary, c.rtl, 80)}
          </div>
        ) : null}
      </div>
      <div style={{ ...text }}>
        <div
          style={{
            display: "flex",
            background: FLAG_BLUE,
            color: "#ffffff",
            fontSize: 34,
            fontWeight: 700,
            fontFamily: BOLD,
            padding: "14px 28px",
            borderRadius: 14,
          }}
        >
          {line(c.cta, c.rtl)}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}
