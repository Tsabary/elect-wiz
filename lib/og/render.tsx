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

/** The site's palette (app/globals.css): flag blue, ink, and the booth's paper and cardboard. */
const FLAG_BLUE = "#0038b8";
const ENVELOPE_BACK = "#002a8c";
const INK = "#0f1730";
const INK_SOFT = "#454d63";
const PAPER = "#f8f4eb";

const DISPLAY = "DisplayHe, DisplayLat";
const BOLD = "HeeboBoldHe, HeeboBoldLat";
const REGULAR = "HeeboHe, HeeboLat";

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

async function fonts() {
  const load = (f: string) => readFile(path.join(FONT_DIR, f));
  const [latin700, hebrew700, latin400, hebrew400, displayLatin, displayHebrew] = await Promise.all(
    [
      load("heebo-latin-700-normal.woff"),
      load("heebo-hebrew-700-normal.woff"),
      load("heebo-latin-400-normal.woff"),
      load("heebo-hebrew-400-normal.woff"),
      load("noto-serif-hebrew-latin-700-normal.woff"),
      load("noto-serif-hebrew-hebrew-700-normal.woff"),
    ],
  );
  // One family name per subset file: satori uses only the first file of a
  // family, so Hebrew and Latin are chained as a fallback list (see BOLD/REGULAR).
  return [
    { name: "DisplayHe", data: displayHebrew, weight: 700 as const, style: "normal" as const },
    { name: "DisplayLat", data: displayLatin, weight: 700 as const, style: "normal" as const },
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

/** Usable text width: the image's 1200px less the side padding. */
const TEXT_WIDTH = 1200 - 2 * 76;

/**
 * Breaks text into lines of at most `perLine` characters, at spaces. The
 * renderer would wrap by itself, but only left to right: a wrapped Hebrew line
 * pair comes out bottom line first. So lines are broken here, in logical order,
 * and each is made visual on its own. Past `maxLines` the last line is clipped.
 */
function wrap(text: string, perLine: number, maxLines: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word;
    if (Array.from(next).length <= perLine || !current) current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  const last = Array.from(kept[maxLines - 1])
    .slice(0, perLine - 1)
    .join("");
  kept[maxLines - 1] = `${last}…`;
  return kept;
}

/** Characters that fit on a line at a font size (a rough average glyph width). */
const perLine = (size: number) => Math.floor(TEXT_WIDTH / (size * 0.52));

/** The largest headline size at which the text fits in two lines, and its lines. */
function headlineLines(text: string): { size: number; lines: string[] } {
  for (const size of [84, 70, 60]) {
    const lines = wrap(text, perLine(size), 3);
    if (lines.length <= 2) return { size, lines };
  }
  return { size: 52, lines: wrap(text, perLine(52), 2) };
}

export interface OgContent {
  rtl: boolean;
  siteName: string;
  eyebrow?: string;
  headline: string;
  secondary?: string;
  cta: string;
}

/**
 * The slip rising out of the voting envelope (components/brand/ballot-art.tsx),
 * cut off by the image's bottom edge. The slip carries a question mark, never a
 * list's letters.
 */
function BallotArt({ rtl }: { rtl: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: -40,
        ...(rtl ? { left: 76 } : { right: 76 }),
        width: 300,
        height: 330,
        display: "flex",
        // Kept small and low, in the corner the button leaves free, so it never
        // reaches the text above.
        transform: "scale(0.5)",
        transformOrigin: rtl ? "bottom left" : "bottom right",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 300,
          height: 172,
          background: ENVELOPE_BACK,
          borderRadius: 4,
          transform: "rotate(3deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 34,
          width: 152,
          height: 212,
          background: "#ffffff",
          border: "2px solid #444444",
          transform: "rotate(9deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 0,
          width: 168,
          height: 236,
          background: "#ffffff",
          border: "3px solid #111111",
          transform: "rotate(-6deg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#000000",
          fontFamily: "HeeboBoldLat",
          fontWeight: 700,
          fontSize: 128,
          lineHeight: 1.1,
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 300,
          height: 152,
          background: FLAG_BLUE,
          borderRadius: 4,
          transform: "rotate(3deg)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: "22px 22px",
        }}
      >
        <div style={{ width: 60, height: 5, background: "#ffffff" }} />
        <div style={{ width: 60, height: 5, background: "#ffffff" }} />
      </div>
    </div>
  );
}

export async function renderOgImage(c: OgContent): Promise<ImageResponse> {
  const align = c.rtl ? "flex-end" : "flex-start";
  const text = { display: "flex", justifyContent: align, width: "100%" } as const;
  const headline = headlineLines(c.headline);
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: PAPER,
        color: INK,
        fontFamily: REGULAR,
      }}
    >
      {/* The flag's two stripes, as on the site's header. */}
      <div style={{ display: "flex", height: 10, marginTop: 10, background: FLAG_BLUE }} />
      <div style={{ display: "flex", height: 10, marginTop: 10, background: FLAG_BLUE }} />
      <BallotArt rtl={c.rtl} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          padding: "44px 76px 60px",
        }}
      >
        <div
          style={{
            ...text,
            fontSize: 36,
            fontWeight: 700,
            fontFamily: DISPLAY,
          }}
        >
          {line(c.siteName, c.rtl)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
          {c.eyebrow ? (
            <div
              style={{
                ...text,
                fontSize: 34,
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
              display: "flex",
              flexDirection: "column",
              alignItems: align,
              width: "100%",
              fontSize: headline.size,
              fontWeight: 700,
              fontFamily: DISPLAY,
              lineHeight: 1.1,
            }}
          >
            {headline.lines.map((l, i) => (
              <div key={i} style={{ display: "flex" }}>
                {line(l, c.rtl)}
              </div>
            ))}
          </div>
          {c.secondary ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: align,
                width: "100%",
                fontSize: 32,
                fontWeight: 400,
                fontFamily: REGULAR,
                color: INK_SOFT,
                lineHeight: 1.3,
              }}
            >
              {wrap(c.secondary, perLine(32), 2).map((l, i) => (
                <div key={i} style={{ display: "flex" }}>
                  {line(l, c.rtl, 80)}
                </div>
              ))}
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
              padding: "14px 30px",
              borderRadius: 4,
              boxShadow: `${c.rtl ? -7 : 7}px 7px 0 ${INK}`,
            }}
          >
            {line(c.cta, c.rtl)}
          </div>
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}
