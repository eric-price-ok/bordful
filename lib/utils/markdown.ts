import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import remarkBreaks from "remark-breaks";

/**
 * Normalize list structure in markdown content.
 * This function specifically targets the complex nested list structures in technical requirements sections.
 *
 * @param text The markdown text to normalize
 * @returns Normalized markdown with proper list structure
 */
function normalizeListStructure(text: string): string {
  if (!text) return "";

  // First, normalize complex structures to make line-by-line processing easier
  let normalized = text;

  // Fix the technical requirements header line that has multiple sections on one line
  // Example: "**Technical Requirements:** - **Frontend Development:** - **Frameworks & Libraries:**"
  normalized = normalized.replace(
    /(\*\*Technical Requirements:\*\*)\s*-\s*(\*\*[^*\n]+:\*\*)\s*-\s*(\*\*[^*\n]+:\*\*)/g,
    "$1\n\n- $2\n  - $3"
  );

  // Fix lines where a category and subcategory are on the same line
  // Example: "* **Backend Development:** - **Frameworks & Tools:**"
  normalized = normalized.replace(
    /(\*\s+\*\*[^*\n]+:\*\*)\s*-\s*(\*\*[^*\n]+:\*\*)/g,
    "$1\n  - $2"
  );

  // Process line by line with the normalized text
  const lines = normalized.split("\n");
  const result: string[] = [];

  // Track section state
  let inTechnicalSection = false;
  let currentMainCategory = "";
  let currentSubCategory = "";
  let indentLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines but preserve them in the output
    if (line === "") {
      result.push("");
      continue;
    }

    // Check if we're entering a technical requirements section
    if (line.includes("**Technical Requirements:**")) {
      inTechnicalSection = true;
      result.push(line);
      result.push(""); // Add blank line after section header
      continue;
    }

    // Check if we're exiting a technical section (by finding another section header)
    if (
      inTechnicalSection &&
      (line.startsWith("###") ||
        line.startsWith("##") ||
        line.startsWith("#")) &&
      !line.includes("Technical Requirements")
    ) {
      inTechnicalSection = false;
      currentMainCategory = "";
      currentSubCategory = "";
      indentLevel = 0;
      result.push(""); // Add blank line before new section
      result.push(line);
      continue;
    }

    // Process lines in technical section
    if (inTechnicalSection) {
      // Check if this is a main category (e.g., "- **Frontend Development:**")
      const mainCategoryMatch = line.match(/^-\s+\*\*([^*\n]+):\*\*$/);
      if (mainCategoryMatch) {
        currentMainCategory = mainCategoryMatch[1];
        currentSubCategory = "";
        indentLevel = 0;
        result.push(`- **${currentMainCategory}:**`);
        continue;
      }

      // Check if this is a subcategory (e.g., "  - **Frameworks & Libraries:**")
      const subCategoryMatch = line.match(/^-\s+\*\*([^*\n]+):\*\*$/);
      if (subCategoryMatch && line.startsWith("  ")) {
        currentSubCategory = subCategoryMatch[1];
        indentLevel = 1;
        result.push(`  - **${currentSubCategory}:**`);
        continue;
      }

      // Check if this is a list item with an asterisk
      const listItemMatch = line.match(/^\*\s+(.*)/);
      if (listItemMatch) {
        const content = listItemMatch[1];

        // If the content is a subcategory header (e.g., "* **API Integration:**")
        const subCategoryMatch = content.match(/^\*\*([^*\n]+):\*\*$/);
        if (subCategoryMatch) {
          const subCategory = subCategoryMatch[1];
          currentSubCategory = subCategory;
          indentLevel = 1;
          result.push(`  - ${content}`);
        } else {
          // This is a regular list item
          // If we're in a subcategory, indent it more
          if (currentSubCategory) {
            indentLevel = 2;
            result.push(`    - ${content}`);
          } else {
            // Top-level list item
            indentLevel = 1;
            result.push(`  - ${content}`);
          }
        }
        continue;
      }

      // Check if this is an indented list item (e.g., "  * Proficiency with...")
      const indentedListItemMatch = line.match(/^\*\s+(.*)/);
      if (indentedListItemMatch && line.startsWith("  ")) {
        const content = indentedListItemMatch[1];

        // If the content is a subcategory header (e.g., "  * **API Integration:**")
        const subCategoryMatch = content.match(/^\*\*([^*\n]+):\*\*$/);
        if (subCategoryMatch) {
          const subCategory = subCategoryMatch[1];
          currentSubCategory = subCategory;
          indentLevel = 1;
          result.push(`  - ${content}`);
        } else {
          // This is a nested list item
          indentLevel = 3;
          result.push(`      - ${content}`);
        }
        continue;
      }

      // If we get here, it's not a recognized pattern
      // Add it with indentation based on the current level
      const prefix = "  ".repeat(indentLevel + 1);
      result.push(`${prefix}${line}`);
    } else {
      // Outside technical section, preserve the line as is
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * Preprocessing function to fix common formatting issues with Airtable content.
 * Applies general formatting fixes and handles complex list structures.
 *
 * @param text The raw markdown text
 * @returns Fixed markdown text
 */
function preprocessMarkdown(text: string): string {
  if (!text) return "";

  // First, normalize the list structure
  let fixed = normalizeListStructure(text);

  // Preserve literal asterisks in text by temporarily replacing them
  fixed = fixed.replace(/\\\*/g, "___ESCAPED_ASTERISK___");

  // Handle bold text formatting (preserve original spacing)
  fixed = fixed.replace(/\*\*\s*([^*\n]+?)\s*\*\*/g, (_, content) => {
    return `**${content}**`;
  });

  // Fix missing spaces between bold text and opening parentheses
  fixed = fixed.replace(/\*\*([^*\n]+?)\*\*\(/g, "**$1** (");

  // Fix bolded text with colons
  fixed = fixed.replace(/\*\*([^*\n:]+):\s*\*\*\s*/g, "**$1:** ");

  // Ensure proper paragraph breaks after sentences
  fixed = fixed.replace(/([.!?])\s*\n([A-Z])/g, "$1\n\n$2");

  // Ensure proper separation between paragraphs and lists
  fixed = fixed.replace(/([^\n])\n([\-\*]\s)/g, "$1\n\n$2");

  // Ensure proper separation between headings and lists
  fixed = fixed.replace(/(\*\*[^*\n]+\*\*)\s*\n([\-\*]\s)/g, "$1\n\n$2");

  // Ensure proper separation between sections in lists
  fixed = fixed.replace(/([\-\*]\s[^\n]+)\n(\*\*[^*\n]+\*\*)/g, "$1\n\n$2");

  // Fix indentation after list items
  fixed = fixed.replace(/([\-\*]\s+[^\n]+)\n\s+([^\-\*\s][^\n]+)/g, "$1\n$2");

  // Handle section headers followed by dash and plain text
  fixed = fixed.replace(/(\*\*[^*\n]+:\*\*)\s*-\s+([^*\n])/g, "$1\n\n- $2");
  fixed = fixed.replace(/([^*\n]+:)\s*-\s+([^*\n])/g, "$1\n\n- $2");

  // Restore literal asterisks
  fixed = fixed.replace(/___ESCAPED_ASTERISK___/g, "\\*");

  return fixed;
}

/**
 * Normalize raw Markdown from Airtable into GitHub-Flavored Markdown.
 * Processes Airtable's markdown-like content into standard, well-formatted markdown
 * with proper list structure and consistent formatting.
 *
 * @param raw The raw Markdown text from Airtable
 * @returns A cleaned, standardized Markdown string
 */
export function normalizeMarkdown(raw: string): string {
  if (!raw) return "";

  // First, preprocess the markdown to fix common formatting issues
  const preprocessed = preprocessMarkdown(raw);

  // Process the Markdown through unified with standard settings
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks) // Handle line breaks more naturally
    .use(remarkStringify, {
      bullet: "*", // Use asterisks for bullet points
      listItemIndent: "one", // Use one space for list item indentation
      emphasis: "_", // Use underscores for emphasis
      strong: "*", // Use asterisks for strong emphasis
      fence: "`", // Use backticks for fenced code blocks
      fences: true, // Always use fenced code blocks
      resourceLink: false, // Use autolinks when possible
      rule: "-", // Use hyphens for thematic breaks
      ruleSpaces: false, // No spaces between markers in thematic breaks
    })
    .processSync(preprocessed);

  return String(file);
}
