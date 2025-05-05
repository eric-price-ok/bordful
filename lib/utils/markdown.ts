import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

/**
 * Normalize raw Markdown from Airtable into GitHub-Flavored Markdown.
 * Processes Airtable's markdown-like content into standard, well-formatted markdown
 * with proper list structure and consistent formatting.
 *
 * This function applies all necessary transformations in a single pass through the content
 * for better performance.
 *
 * @param raw The raw Markdown text from Airtable
 * @returns A cleaned, standardized Markdown string with proper paragraphs
 */
export function normalizeMarkdown(raw: string): string {
  if (!raw) return "";

  // First, apply some general regex replacements to standardize content
  let fixed = raw;

  // Fix the technical requirements header line that has multiple sections on one line
  fixed = fixed.replace(
    /(\*\*Technical Requirements:\*\*)\s*-\s*(\*\*[^*\n]+:\*\*)\s*-\s*(\*\*[^*\n]+:\*\*)/g,
    "$1\n\n- $2\n  - $3"
  );

  // Fix lines where a category and subcategory are on the same line
  fixed = fixed.replace(
    /(\*\s+\*\*[^*\n]+:\*\*)\s*-\s*(\*\*[^*\n]+:\*\*)/g,
    "$1\n  - $2"
  );

  // Preserve literal asterisks in text by temporarily replacing them
  fixed = fixed.replace(/\\\*/g, "___ESCAPED_ASTERISK___");

  // Handle all line processing in a single pass for better performance
  const lines = fixed.split("\n");
  const result: string[] = [];

  // Track section and formatting state
  let inTechnicalSection = false;
  let currentMainCategory = "";
  let currentSubCategory = "";
  let indentLevel = 0;

  // Process each line once
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";

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

    // Is this a special line type? (list item, heading, code block, etc.)
    const isSpecialLine =
      line.startsWith("- ") ||
      line.startsWith("* ") ||
      line.startsWith("+ ") ||
      line.startsWith("#") ||
      line.startsWith("```") ||
      line.startsWith(">") ||
      (nextLine.startsWith("- ") && line !== "") ||
      (nextLine.startsWith("* ") && line !== "") ||
      (nextLine.startsWith("+ ") && line !== "");

    // Process lines in technical section with special handling
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
      // Outside technical section
      if (isSpecialLine) {
        // For special lines like lists and headings, just add them as-is
        result.push(line);
      } else {
        // Regular content line - add the line and potentially create a paragraph break
        result.push(line);

        // Add paragraph break if next line is not empty or a heading
        // and this isn't a special formatting element
        if (nextLine !== "" && !nextLine.startsWith("#")) {
          result.push("");
        }
      }
    }
  }

  // Join the processed lines
  let processed = result.join("\n");

  // Apply additional fixes that are better handled with regex

  // Handle bold text formatting (preserve original spacing)
  processed = processed.replace(/\*\*\s*([^*\n]+?)\s*\*\*/g, (_, content) => {
    return `**${content}**`;
  });

  // Fix missing spaces between bold text and opening parentheses
  processed = processed.replace(/\*\*([^*\n]+?)\*\*\(/g, "**$1** (");

  // Fix bolded text with colons
  processed = processed.replace(/\*\*([^*\n:]+):\s*\*\*\s*/g, "**$1:** ");

  // Ensure proper paragraph breaks after sentences
  processed = processed.replace(/([.!?])\s*\n([A-Z])/g, "$1\n\n$2");

  // Ensure proper separation between paragraphs and lists
  processed = processed.replace(/([^\n])\n([\-\*]\s)/g, "$1\n\n$2");

  // Ensure proper separation between headings and lists
  processed = processed.replace(
    /(\*\*[^*\n]+\*\*)\s*\n([\-\*]\s)/g,
    "$1\n\n$2"
  );

  // Ensure proper separation between sections in lists
  processed = processed.replace(
    /([\-\*]\s[^\n]+)\n(\*\*[^*\n]+\*\*)/g,
    "$1\n\n$2"
  );

  // Handle section headers followed by dash and plain text
  processed = processed.replace(
    /(\*\*[^*\n]+:\*\*)\s*-\s+([^*\n])/g,
    "$1\n\n- $2"
  );
  processed = processed.replace(/([^*\n]+:)\s*-\s+([^*\n])/g, "$1\n\n- $2");

  // Restore literal asterisks
  processed = processed.replace(/___ESCAPED_ASTERISK___/g, "\\*");

  // Process the Markdown through unified with standard settings
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
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
    .processSync(processed);

  return String(file);
}
