import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

/**
 * Pre-process markdown to fix common formatting issues with Airtable content
 * @param text The raw markdown text
 * @returns Fixed markdown text
 */
function preprocessMarkdown(text: string): string {
  if (!text) return "";

  // Fix 1: Ensure proper separation between headings and lists
  // This adds a blank line after headings that are followed by lists
  // Example: "**Heading**\n- List item" -> "**Heading**\n\n- List item"
  let fixed = text.replace(/(\*\*[^*\n]+\*\*)\s*\n([\-\*]\s)/g, "$1\n\n$2");

  // Fix 2: Ensure proper separation between sections in lists
  // This adds a blank line and proper formatting when a heading appears after a list item
  // Example: "- List item\n**Heading**" -> "- List item\n\n**Heading**"
  fixed = fixed.replace(/([\-\*]\s[^\n]+)\n(\*\*[^*\n]+\*\*)/g, "$1\n\n$2");

  // Fix 3: Ensure proper list continuation after a heading within a list
  // This ensures that when a heading is inside a list, the next list items are properly formatted
  fixed = fixed.replace(
    /(\*\*[^*\n]+\*\*)\s*\n(?!\s*[\-\*]\s)([^\n]+)/g,
    "$1\n$2"
  );

  // Fix 4: Handle section headings within list items
  // This ensures that when a bold heading appears at the start of a list item, it's properly formatted
  // Example: "* **Section Heading**\nContent" -> "* **Section Heading**\n  Content"
  fixed = fixed.replace(
    /([\-\*]\s+)(\*\*[^*\n]+\*\*)\s*\n(?!\s*[\-\*]\s)([^\n]+)/g,
    "$1$2\n  $3"
  );

  // Fix 5: Add proper spacing between list sections
  // This adds a blank line between different list sections to ensure proper rendering
  fixed = fixed.replace(
    /([\-\*]\s[^\n]+)\n([\-\*]\s+\*\*[^*\n]+\*\*)/g,
    "$1\n\n$2"
  );

  return fixed;
}

/**
 * Normalize raw Markdown into GitHub-Flavored Markdown.
 * This function preserves the original content while ensuring it follows
 * standard Markdown rules. It doesn't edit or remove spaces, but ensures
 * the content will render correctly according to CommonMark specification.
 *
 * @param raw The raw Markdown text
 * @returns A cleaned, standardized Markdown string
 */
export function normalizeMarkdown(raw: string): string {
  if (!raw) return "";

  // First, preprocess the markdown to fix common formatting issues
  const preprocessed = preprocessMarkdown(raw);

  // Then process the Markdown through unified with standard settings
  // This will parse the Markdown into an AST, apply GFM transformations,
  // and then stringify it back to Markdown following standard rules
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkStringify, {
      // Use standard settings that align with CommonMark
      bullet: "*", // Use asterisks for bullet points
      listItemIndent: "one", // Use one space for list item indentation
      emphasis: "_", // Use underscores for emphasis
      strong: "*", // Use asterisks for strong emphasis (will output as **text**)
      fence: "`", // Use backticks for fenced code blocks
      fences: true, // Always use fenced code blocks
      resourceLink: false, // Use autolinks when possible
      rule: "-", // Use hyphens for thematic breaks
      ruleSpaces: false, // No spaces between markers in thematic breaks
    })
    .processSync(preprocessed);

  return String(file);
}
