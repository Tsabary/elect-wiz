/**
 * Parser for research documents (`content/research/{en,he}/<party-id>.md`).
 *
 * Format:
 *
 * ```md
 * ---
 * partyId: blue-horizon
 * lang: en
 * researchedAsOf: 2026-10-06
 * ---
 *
 * ## Overview {#overview}
 * Text with inline citations [1] or [1, 3].
 *
 * ## Positions on the issues {#issues}
 * ### Cost of living {#issue-cost-of-living}
 * ...
 * ## Sources {#sources}
 * 1. Title, Publisher, date. https://example.org
 * ```
 *
 * Level-2 headings are sections, level-3 headings are sub-sections; every heading
 * carries an explicit `{#anchor}`.
 */

export interface ResearchSubsection {
  id: string;
  title: string;
  body: string;
}

export interface ResearchSection {
  id: string;
  title: string;
  /** Markdown before the first sub-section. */
  body: string;
  subsections: ResearchSubsection[];
}

export interface ResearchSource {
  n: number;
  text: string;
}

export interface ParsedResearchDoc {
  frontmatter: Record<string, string>;
  sections: ResearchSection[];
  sources: ResearchSource[];
  /** All anchors (sections and sub-sections) in document order. */
  anchors: string[];
  /** Citation numbers used in the body, outside the Sources section. */
  citations: number[];
  /** Structural problems found while parsing (e.g. headings without anchors). */
  problems: string[];
}

const HEADING_RE = /^(#{1,6})\s+(.*?)\s*$/;
const ANCHOR_RE = /^(.*?)\s*\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}$/;
const SOURCE_LINE_RE = /^(\d+)\.\s+(.+)$/;
const CITATION_RE = /\[(\d+(?:\s*[,–-]\s*\d+)*)\](?!\()/g;

export function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const normalized = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { data: {}, content: normalized };
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return { data: {}, content: normalized };
  const data: Record<string, string> = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (m) data[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  const rest = normalized.slice(end + 4).replace(/^[^\n]*\n/, "");
  return { data, content: rest };
}

export function extractCitations(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(CITATION_RE)) {
    for (const part of m[1].split(",")) {
      const range = part.split(/[–-]/).map((s) => Number(s.trim()));
      if (range.length === 2 && range[0] <= range[1] && range[1] - range[0] < 50) {
        for (let i = range[0]; i <= range[1]; i++) out.push(i);
      } else {
        for (const n of range) if (Number.isFinite(n)) out.push(n);
      }
    }
  }
  return out;
}

export function parseResearchDoc(raw: string): ParsedResearchDoc {
  const { data, content } = parseFrontmatter(raw);
  const problems: string[] = [];
  const sections: ResearchSection[] = [];
  const anchors: string[] = [];
  let currentSection: ResearchSection | null = null;
  let currentSub: ResearchSubsection | null = null;
  let inFence = false;

  const append = (line: string) => {
    if (currentSub) currentSub.body += line + "\n";
    else if (currentSection) currentSection.body += line + "\n";
    else if (line.trim())
      problems.push(`content before the first section: "${line.trim().slice(0, 60)}"`);
  };

  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h = inFence ? null : line.match(HEADING_RE);
    if (!h) {
      append(line);
      continue;
    }
    const level = h[1].length;
    const a = h[2].match(ANCHOR_RE);
    if (level !== 2 && level !== 3) {
      problems.push(
        `unexpected heading level ${level}: "${h[2]}" (use ## for sections, ### for sub-sections)`,
      );
      append(line);
      continue;
    }
    if (!a) {
      problems.push(`heading without {#anchor}: "${h[2]}"`);
      append(line);
      continue;
    }
    const [, title, id] = a;
    anchors.push(id);
    if (level === 2) {
      currentSection = { id, title, body: "", subsections: [] };
      currentSub = null;
      sections.push(currentSection);
    } else {
      if (!currentSection) {
        problems.push(`sub-section "${title}" appears before any section`);
        continue;
      }
      currentSub = { id, title, body: "" };
      currentSection.subsections.push(currentSub);
    }
  }

  const sourcesSection = sections.find((s) => s.id === "sources");
  const sources: ResearchSource[] = [];
  if (sourcesSection) {
    for (const line of sourcesSection.body.split("\n")) {
      const m = line.trim().match(SOURCE_LINE_RE);
      if (m) sources.push({ n: Number(m[1]), text: m[2].trim() });
    }
  }

  const citations: number[] = [];
  for (const s of sections) {
    if (s.id === "sources") continue;
    citations.push(...extractCitations(s.body));
    for (const sub of s.subsections) citations.push(...extractCitations(sub.body));
  }

  return { frontmatter: data, sections, sources, anchors, citations, problems };
}

/** All prose of a document except the Sources section, for content checks. */
export function researchProse(doc: ParsedResearchDoc): { anchor: string; text: string }[] {
  const out: { anchor: string; text: string }[] = [];
  for (const s of doc.sections) {
    if (s.id === "sources") continue;
    out.push({ anchor: s.id, text: `${s.title}\n${s.body}` });
    for (const sub of s.subsections)
      out.push({ anchor: sub.id, text: `${sub.title}\n${sub.body}` });
  }
  return out;
}
