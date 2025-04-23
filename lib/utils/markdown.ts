import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

/**
 * Normalize raw Markdown into GitHub-Flavored Markdown.
 * @param raw The raw Markdown text
 * @returns A cleaned, standardized Markdown string
 */
export function normalizeMarkdown(raw: string): string {
  if (!raw) return "";
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkStringify)
    .processSync(raw);

  return String(file);
}
