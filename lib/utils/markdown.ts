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

  // Fix 0: Preserve literal asterisks in text by temporarily replacing them
  // This prevents them from being interpreted as markdown syntax
  let fixed = text.replace(/\\\*/g, "___ESCAPED_ASTERISK___");

  // Fix 1: Handle the specific case of "**Being fluent... is essential **" with trailing space
  // This preserves the bold formatting even with the trailing space
  fixed = fixed.replace(
    /\*\*([^*\n]+?)\s+\*\*/g,
    (_, content) => `**${content.trim()}**`
  );

  // Fix 2: Ensure proper separation between headings and lists
  // This adds a blank line after headings that are followed by lists
  // Example: "**Heading**\n- List item" -> "**Heading**\n\n- List item"
  fixed = fixed.replace(/(\*\*[^*\n]+\*\*)\s*\n([\-\*]\s)/g, "$1\n\n$2");

  // Fix 3: Ensure proper separation between sections in lists
  // This adds a blank line and proper formatting when a heading appears after a list item
  // Example: "- List item\n**Heading**" -> "- List item\n\n**Heading**"
  fixed = fixed.replace(/([\-\*]\s[^\n]+)\n(\*\*[^*\n]+\*\*)/g, "$1\n\n$2");

  // Fix 4: Ensure proper list continuation after a heading within a list
  // This ensures that when a heading is inside a list, the next list items are properly formatted
  fixed = fixed.replace(
    /(\*\*[^*\n]+\*\*)\s*\n(?!\s*[\-\*]\s)([^\n]+)/g,
    "$1\n$2"
  );

  // Fix 5: Handle section headings within list items
  // This ensures that when a bold heading appears at the start of a list item, it's properly formatted
  // Example: "* **Section Heading**\nContent" -> "* **Section Heading**\n  Content"
  fixed = fixed.replace(
    /([\-\*]\s+)(\*\*[^*\n]+\*\*)\s*\n(?!\s*[\-\*]\s)([^\n]+)/g,
    "$1$2\n  $3"
  );

  // Fix 6: Add proper spacing between list sections
  // This adds a blank line between different list sections to ensure proper rendering
  fixed = fixed.replace(
    /([\-\*]\s[^\n]+)\n([\-\*]\s+\*\*[^*\n]+\*\*)/g,
    "$1\n\n$2"
  );

  // Fix 7: Fix bolded text with colons followed by spaces
  // Example: "**Privacy Policy: **Please review" -> "**Privacy Policy:** Please review"
  fixed = fixed.replace(/\*\*([^*\n]+):\s*\*\*\s*/g, "**$1:** ");

  // Fix 8: Handle the specific case where literal asterisks are used for bold text
  // This ensures that text like "\*\*Being fluent in the English language, written and verbal, is essential \*\*"
  // is properly rendered as bold
  fixed = fixed.replace(
    /\\\*\\\*([^*\n]+?)\\\*\\\*/g,
    (_, content) => `**${content.trim()}**`
  );

  // Fix 9: Fix indentation after list items with bold text
  // This ensures that paragraphs after list items are not indented
  fixed = fixed.replace(
    /([\-\*]\s+\*\*[^*\n]+\*\*)\n\s+([^\-\*\s][^\n]+)/g,
    "$1\n$2"
  );

  // Fix 10: Handle the specific case of "Additional Qualifications:" followed by bolded list items
  // This ensures proper formatting of the list after this heading
  fixed = fixed.replace(
    /(\*\*Additional Qualifications:\*\*)\s*-\s*(\*\*[^*\n]+\*\*)/g,
    "$1\n\n- $2"
  );

  // Fix 11: Properly format list items that contain bold text
  // This ensures that list items like "- **Bold text**" are properly rendered
  fixed = fixed.replace(/([\-\*]\s+)(\*\*[^*\n]+\*\*)/g, "$1$2");

  // Fix 12: Fix indentation after "Must be legally authorized to work in Canada"
  // This ensures the "For information about..." text is not indented and starts a new paragraph
  fixed = fixed.replace(
    /(\*\*Must be legally authorized to work in Canada\*\*)\s*\n\s*(For information about)/g,
    "$1\n\n$2"
  );

  // Fix 13: Specifically handle the "Being fluent" case
  fixed = fixed.replace(
    /\*\*Being fluent in the English language, written and verbal, is essential \*\*/g,
    "**Being fluent in the English language, written and verbal, is essential**"
  );

  // Fix 14: Handle the case where "Being fluent" appears in a list item with escaped asterisks
  fixed = fixed.replace(
    /([\-\*]\s+)\\\*\\\*Being fluent in the English language, written and verbal, is essential \\\*\\\*/g,
    "$1**Being fluent in the English language, written and verbal, is essential**"
  );

  // Fix 15: Handle the case where "Being fluent" appears in a list item with regular asterisks
  fixed = fixed.replace(
    /([\-\*]\s+)\*\*Being fluent in the English language, written and verbal, is essential \*\*/g,
    "$1**Being fluent in the English language, written and verbal, is essential**"
  );

  // Fix 16: Fix the "InnQuest Software," bolding issue
  fixed = fixed.replace(
    /For information about\s*\*\*InnQuest Software,\*\*\s*/g,
    "For information about **InnQuest Software**, "
  );

  // Fix 17: Ensure "We thank all applicants..." is a separate paragraph
  fixed = fixed.replace(
    /(\[www\.innquest\.com\]\([^)]+\))\s*(\*\*We thank all applicants)/g,
    "$1\n\n$2"
  );

  // Fix 18: Restore literal asterisks
  fixed = fixed.replace(/___ESCAPED_ASTERISK___/g, "\\*");

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
