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

  // Preserve literal asterisks in text by temporarily replacing them
  // This prevents them from being interpreted as markdown syntax
  let fixed = text.replace(/\\\*/g, "___ESCAPED_ASTERISK___");

  // Fix for bold text with extra spaces inside the markers
  // This handles cases like "**cloud engineering **" or "** infrastructure-as-code**"
  // We need to be careful to only trim spaces at the edges of the content, not within the content
  fixed = fixed.replace(/\*\*\s*([^*\n]+?)\s*\*\*/g, (match, content) => {
    // Only trim if there are actual spaces at the beginning or end
    if (content.startsWith(" ") || content.endsWith(" ")) {
      return `**${content.trim()}**`;
    }
    // Otherwise, leave it as is to avoid affecting correctly formatted bold text
    return match;
  });

  // Fix missing spaces between bold text and opening parentheses
  // This ensures there's always a space between bold text and following parentheses
  // Example: "**cloud engineering**(AWS/Azure/GCP)" -> "**cloud engineering** (AWS/Azure/GCP)"
  fixed = fixed.replace(/\*\*([^*\n]+?)\*\*\(/g, "**$1** (");

  // Fix missing spaces between words and bold text
  // This ensures there's always a space between words and following bold text
  // Example: "and**infrastructure-as-code**" -> "and **infrastructure-as-code**"
  fixed = fixed.replace(/(\s[a-z]+)\*\*([^*\n]+?)\*\*/g, "$1 **$2**");

  // Fix for common technical terms followed by bold text with extra spaces
  // This ensures proper spacing and formatting for technical terms
  // We use a more general pattern to catch various technical terms
  fixed = fixed.replace(
    /(Proficiency|Experience|Fluency|Knowledge|Skills|Expertise) (in|with)\s*\*\*([^*\n]+?)\s*\*\*/g,
    "$1 $2 **$3**"
  );

  // Ensure proper paragraph breaks after sentences ending with periods
  // This adds a blank line after sentences that should start a new paragraph
  fixed = fixed.replace(/([.!?])\s*\n([A-Z])/g, "$1\n\n$2");

  // CRITICAL FIXES FOR SPECIFIC PATTERNS IN JOB DESCRIPTIONS

  // Fix for "For more information about the company and the team" appearing in a list item
  // Using a more specific pattern to match exactly what's in the Airtable content
  fixed = fixed.replace(
    /(\* [^\n]+)\n(\s*)(For more information about the company and the team)/g,
    "$1\n\n$3"
  );

  // Fix for "As a distributed team" appearing in a list item
  // Using a more specific pattern to match exactly what's in the Airtable content
  fixed = fixed.replace(
    /(\* [^\n]+)\n(\s*)(As a distributed team)/g,
    "$1\n\n$3"
  );

  // Fix for "What we're looking for" appearing in a list item
  // Using a more specific pattern to match exactly what's in the Airtable content
  fixed = fixed.replace(
    /(\* [^\n]+)\n(\s*)(What we're looking for)/g,
    "$1\n\n$3"
  );

  // Fix for "Residency and authorization to work in the U.S. is required." appearing in a list item
  // Using a more specific pattern to match exactly what's in the Airtable content
  fixed = fixed.replace(
    /(\* [^\n]*Location: remote within the U\.S\.)\n(\s*)(Residency and authorization)/g,
    "$1\n\n$3"
  );

  // More general fix for sentences that should be separate paragraphs
  // This looks for sentences that start with specific words that indicate they should be separate
  fixed = fixed.replace(
    /([\-\*]\s+[^\n]+)\n\s*(If this role|For our employees|Please note|Important|Note:)/g,
    "$1\n\n$2"
  );

  // Ensure proper separation between headings and lists
  // This adds a blank line after headings that are followed by lists
  fixed = fixed.replace(/(\*\*[^*\n]+\*\*)\s*\n([\-\*]\s)/g, "$1\n\n$2");

  // Ensure proper separation between sections in lists
  // This adds a blank line when a heading appears after a list item
  fixed = fixed.replace(/([\-\*]\s[^\n]+)\n(\*\*[^*\n]+\*\*)/g, "$1\n\n$2");

  // Fix indentation after list items
  // This ensures that paragraphs after list items are not indented
  fixed = fixed.replace(/([\-\*]\s+[^\n]+)\n\s+([^\-\*\s][^\n]+)/g, "$1\n$2");

  // Ensure proper list continuation after a heading within a list
  // This ensures that when a heading is inside a list, the next list items are properly formatted
  fixed = fixed.replace(
    /([\-\*]\s+\*\*[^*\n]+\*\*)\s*\n(?!\s*[\-\*]\s)([^\n]+)/g,
    "$1\n  $2"
  );

  // Add proper spacing between list sections
  // This adds a blank line between different list sections to ensure proper rendering
  fixed = fixed.replace(
    /([\-\*]\s[^\n]+)\n([\-\*]\s+\*\*[^*\n]+\*\*)/g,
    "$1\n\n$2"
  );

  // Fix bolded text with colons
  // This ensures colons are inside the bold markers and followed by a space
  fixed = fixed.replace(/\*\*([^*\n:]+):\s*\*\*\s*/g, "**$1:** ");

  // Ensure proper paragraph breaks after URLs
  // This adds a blank line after URLs that should be followed by a new paragraph
  fixed = fixed.replace(/(\]\([^)]+\))\s*\n([A-Z])/g, "$1\n\n$2");

  // Restore literal asterisks
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
