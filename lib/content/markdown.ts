/**
 * Markdown → HTML for research documents (server only, so the renderer never
 * ships to the browser). Research files are version-controlled corpus content,
 * written and reviewed through the pipeline, not user input. Raw HTML in the
 * markdown is escaped anyway, as defence in depth.
 */
import "server-only";
import { Marked } from "marked";

const CITATION_RE = /\[(\d+(?:\s*[,–-]\s*\d+)*)\](?!\()/g;
const TOKEN_RE = /@@CITE([\d,;-]+)@@/g;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const marked = new Marked({
  gfm: true,
  async: false,
  renderer: {
    // Escape raw HTML instead of passing it through.
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, text }) {
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' rel="noopener noreferrer" target="_blank"' : "";
      return `<a href="${escapeHtml(href)}"${attrs}>${text}</a>`;
    },
  },
});

/** Replaces citation markers ([1], [1, 3], [2–4]) with tokens that survive markdown parsing. */
function tokenizeCitations(markdown: string): string {
  return markdown.replace(CITATION_RE, (_m, inner: string) => {
    const parts = inner.split(/\s*,\s*/).map((p) => p.split(/\s*[–-]\s*/).join("-"));
    return `@@CITE${parts.join(";")}@@`;
  });
}

/** Turns citation tokens into superscript links to the numbered sources. */
function renderCitationTokens(html: string): string {
  return html.replace(TOKEN_RE, (_m, inner: string) => {
    const links = inner
      .split(";")
      .map((part) =>
        part
          .split("-")
          .map((n) => `<a href="#source-${Number(n)}" class="citation">${Number(n)}</a>`)
          .join("–"),
      )
      .join(", ");
    return `<sup class="citations">[${links}]</sup>`;
  });
}

export function renderMarkdown(markdown: string): string {
  return renderCitationTokens(marked.parse(tokenizeCitations(markdown)) as string);
}

export function renderInlineMarkdown(markdown: string): string {
  return renderCitationTokens(marked.parseInline(tokenizeCitations(markdown)) as string);
}
