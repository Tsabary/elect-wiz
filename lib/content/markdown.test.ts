import { describe, expect, it } from "vitest";
import { renderInlineMarkdown, renderMarkdown } from "./markdown";

describe("research markdown rendering", () => {
  it("links citations to numbered sources", () => {
    const html = renderMarkdown("Holds 4 seats [1]. Supports it [2, 3] and [4–5].");
    expect(html).toContain('<a href="#source-1" class="citation">1</a>');
    expect(html).toContain('<a href="#source-2" class="citation">2</a>, <a href="#source-3"');
    expect(html).toContain('<a href="#source-4" class="citation">4</a>–<a href="#source-5"');
  });

  it("renders emphasis and leaves markdown links alone", () => {
    const html = renderMarkdown("**Evidence: Action.** See [the platform](https://example.org).");
    expect(html).toContain("<strong>Evidence: Action.</strong>");
    expect(html).toContain('href="https://example.org" rel="noopener noreferrer"');
  });

  it("escapes raw HTML", () => {
    expect(renderMarkdown("<script>alert(1)</script>")).not.toContain("<script>");
    expect(renderInlineMarkdown('x <img src=x onerror="y">')).not.toContain("<img");
  });

  it("autolinks source URLs inline", () => {
    expect(renderInlineMarkdown("Profile. https://example.org/a")).toContain(
      '<a href="https://example.org/a"',
    );
  });
});
