/**
 * Utility functions for handling Airtable's markdown format
 */

// Regular expressions for pattern matching - focused on structure, not content
const PATTERNS = {
  // List item patterns
  LIST_ITEM: /^- /,
  INDENTED_LIST_ITEM: /^\s+- /,

  // Italic and bold patterns
  ITALIC_LIST_ITEM_1: /^- \*([^*]+)\*$/,
  ITALIC_LIST_ITEM_2: /^- \*([^*]+)\*\*$/,
  BOLD_LIST_ITEM: /^- \*\*([^*]+)\*\*$/,
  ITALIC_WITH_ASTERISK: /^- \*([^*]+)\*\*?$/,

  // Bold text patterns (not in list items)
  STANDALONE_BOLD: /^\*\*([^*:]+?)\*\*$/,
  BOLD_HEADER: /^\*\*([^*:]+?):\*\*$/,

  // Content extraction patterns
  EXTRACT_CONTENT_BOLD: /^- \*\*([^*]+)\*\*$/,
  EXTRACT_CONTENT_ITALIC: /^- \*([^*]+)\*\*?$/,

  // Cleanup patterns
  TRIPLE_ASTERISKS: /\*\*([^*]+?)\*\*\*/g,
  MULTIPLE_NEWLINES: /\n{3,}/g,
  TRAILING_SPACES: /\s+$/gm,

  // Special patterns
  EMOJI: /\p{Emoji}/u,
  PARAGRAPH_END: /([.!?]"?'?)\s*$/,
};

/**
 * Process Airtable's markdown format to make it compatible with standard markdown renderers
 * Handles Airtable's specific formatting quirks like italic text that should be bold,
 * proper list indentation, and other edge cases.
 *
 * @param markdown The raw markdown from Airtable
 * @returns Processed markdown that can be properly rendered by standard markdown renderers
 */
export function processAirtableMarkdown(markdown: string): string {
  if (!markdown) return "";

  // First, normalize line endings
  let processedMarkdown = markdown.replace(/\r\n/g, "\n");

  // Handle Airtable's trailing newline character
  if (processedMarkdown.endsWith("\n")) {
    processedMarkdown = processedMarkdown.slice(0, -1);
  }

  // Pre-process to fix common issues before line-by-line processing
  processedMarkdown = preProcessMarkdown(processedMarkdown);

  // Process line by line for a robust solution
  const lines = processedMarkdown.split("\n");
  const processedLines = [];

  // State tracking variables
  let inList = false;
  let listLevel = 0;
  let previousLineWasBoldListHeader = false;
  let previousLineWasStandaloneHeader = false;
  let previousLineWasParagraphEnd = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const prevLine = i > 0 ? lines[i - 1].trim() : "";
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : "";

    // Skip empty lines but preserve them in the output
    if (line === "") {
      // Don't add multiple consecutive empty lines
      if (
        processedLines.length === 0 ||
        processedLines[processedLines.length - 1] !== ""
      ) {
        processedLines.push("");
      }

      // Empty line typically ends a list context
      if (inList) {
        inList = false;
        listLevel = 0;
        previousLineWasBoldListHeader = false;
      }
      previousLineWasStandaloneHeader = false;
      previousLineWasParagraphEnd = false;
      continue;
    }

    // Check for various patterns
    const isListItem = PATTERNS.LIST_ITEM.test(line);
    // const isIndentedListItem = PATTERNS.INDENTED_LIST_ITEM.test(line); // Not used but kept for future reference
    const isItalicListItem =
      PATTERNS.ITALIC_LIST_ITEM_1.test(line) ||
      PATTERNS.ITALIC_LIST_ITEM_2.test(line);
    const isBoldListItem = PATTERNS.BOLD_LIST_ITEM.test(line);
    const isItalicWithAsterisk = PATTERNS.ITALIC_WITH_ASTERISK.test(line);
    const isStandaloneBold = PATTERNS.STANDALONE_BOLD.test(line);
    const isBoldHeader = PATTERNS.BOLD_HEADER.test(line);
    const hasEmoji = PATTERNS.EMOJI.test(line);
    const isParagraphEnd = PATTERNS.PARAGRAPH_END.test(line);

    // Check if this looks like a section header based on structure (short, no punctuation)
    const isLikelyHeader =
      (isItalicListItem || isBoldListItem || isItalicWithAsterisk) &&
      line.replace(/^- \*\*?|\*\*?$/g, "").length < 30 &&
      !line.replace(/^- \*\*?|\*\*?$/g, "").match(/[.!?,;]/) &&
      !line.replace(/^- \*\*?|\*\*?$/g, "").endsWith(":");

    // Handle special case: Standalone headers that shouldn't be list items
    // This is a heuristic - if it's an italic/bold list item with no other list items around it
    const isStandaloneHeader =
      (isItalicListItem || isBoldListItem) &&
      (!prevLine.startsWith("- ") || prevLine === "") &&
      (!nextLine.startsWith("- ") || nextLine === "");

    // Handle special case: Headers with emojis or that look like section headers
    if (
      (isItalicListItem || isItalicWithAsterisk) &&
      (hasEmoji || isLikelyHeader)
    ) {
      // Convert to bold text, not a list item
      const match = line.match(PATTERNS.EXTRACT_CONTENT_ITALIC);
      if (match) {
        // Add a blank line before headers if needed
        if (
          processedLines.length > 0 &&
          processedLines[processedLines.length - 1] !== ""
        ) {
          processedLines.push("");
        }

        processedLines.push(`**${match[1]}**`);
        previousLineWasBoldListHeader = false;
        previousLineWasStandaloneHeader = true;
        inList = false;

        // Add a blank line after headers
        processedLines.push("");
      } else {
        processedLines.push(line);
      }
      continue;
    }

    // Handle standalone headers
    if (isStandaloneHeader || isLikelyHeader) {
      if (isBoldListItem) {
        const match = line.match(PATTERNS.EXTRACT_CONTENT_BOLD);
        if (match) {
          // Add a blank line before headers if needed
          if (
            processedLines.length > 0 &&
            processedLines[processedLines.length - 1] !== ""
          ) {
            processedLines.push("");
          }

          processedLines.push(`**${match[1]}**`);
          previousLineWasBoldListHeader = false;
          previousLineWasStandaloneHeader = true;
          inList = false;

          // Add a blank line after headers
          processedLines.push("");
        } else {
          processedLines.push(line);
        }
      } else if (isItalicListItem || isItalicWithAsterisk) {
        const match = line.match(PATTERNS.EXTRACT_CONTENT_ITALIC);
        if (match) {
          // Add a blank line before headers if needed
          if (
            processedLines.length > 0 &&
            processedLines[processedLines.length - 1] !== ""
          ) {
            processedLines.push("");
          }

          processedLines.push(`**${match[1]}**`);
          previousLineWasBoldListHeader = false;
          previousLineWasStandaloneHeader = true;
          inList = false;

          // Add a blank line after headers
          processedLines.push("");
        } else {
          processedLines.push(line);
        }
      } else {
        processedLines.push(line);
      }
      continue;
    }

    // Handle bold list headers (section headers in lists)
    if (isBoldListItem) {
      // If the previous line wasn't empty and wasn't a list item, add an empty line
      if (
        processedLines.length > 0 &&
        processedLines[processedLines.length - 1] !== "" &&
        !previousLineWasBoldListHeader &&
        !previousLineWasStandaloneHeader
      ) {
        processedLines.push("");
      }

      processedLines.push(line);
      previousLineWasBoldListHeader = true;
      previousLineWasStandaloneHeader = false;
      inList = true;
      listLevel = 1;
      continue;
    }

    // Handle italic list items that should be bold (common in Airtable)
    if (isItalicWithAsterisk) {
      const match = line.match(PATTERNS.EXTRACT_CONTENT_ITALIC);
      if (match) {
        // Convert to bold list item
        processedLines.push(`- **${match[1]}**`);
        previousLineWasBoldListHeader = true;
        previousLineWasStandaloneHeader = false;
        inList = true;
        listLevel = 1;
      } else {
        processedLines.push(line);
      }
      continue;
    }

    // Handle regular list items
    if (isListItem) {
      if (previousLineWasBoldListHeader) {
        // This is a subitem under a bold list header
        processedLines.push(`  ${line}`);
        inList = true;
        listLevel = 2;
        previousLineWasStandaloneHeader = false;
      } else if (inList && listLevel === 2) {
        // Continue the sublist
        processedLines.push(`  ${line}`);
        previousLineWasStandaloneHeader = false;
      } else {
        // If the previous line was a paragraph end and this is a new list,
        // add an empty line before starting the list
        if (previousLineWasParagraphEnd && !inList) {
          processedLines.push("");
        }

        // Regular list item
        processedLines.push(line);
        inList = true;
        listLevel = 1;
        previousLineWasBoldListHeader = false;
        previousLineWasStandaloneHeader = false;
      }
      previousLineWasParagraphEnd = false;
      continue;
    }

    // Handle standalone bold text (not in a list)
    if (isStandaloneBold || isBoldHeader) {
      // Add a blank line before standalone bold text if needed
      if (
        processedLines.length > 0 &&
        processedLines[processedLines.length - 1] !== "" &&
        !previousLineWasStandaloneHeader
      ) {
        processedLines.push("");
      }

      processedLines.push(line);
      previousLineWasBoldListHeader = false;
      previousLineWasStandaloneHeader = true;
      inList = false;
      listLevel = 0;

      // Add a blank line after standalone bold text
      processedLines.push("");
      previousLineWasParagraphEnd = false;
      continue;
    }

    // Handle non-list items (regular paragraphs)
    if (previousLineWasStandaloneHeader) {
      // If the previous line was a standalone header, we already added an empty line
      processedLines.push(line);
    } else if (previousLineWasParagraphEnd) {
      // If the previous line ended a paragraph, add an empty line before starting a new one
      processedLines.push("");
      processedLines.push(line);
    } else {
      processedLines.push(line);
    }

    previousLineWasBoldListHeader = false;
    previousLineWasStandaloneHeader = false;
    previousLineWasParagraphEnd = isParagraphEnd;

    // Check if this is the end of a list
    if (!line.startsWith("- ") && inList) {
      inList = false;
      listLevel = 0;
    }
  }

  processedMarkdown = processedLines.join("\n");

  // Final cleanup passes
  return postProcessMarkdown(processedMarkdown);
}

/**
 * Pre-process markdown to fix common issues before line-by-line processing
 * Focuses on structural patterns rather than specific content
 */
function preProcessMarkdown(markdown: string): string {
  return (
    markdown
      // Fix standalone bold/italic text that appears as list items
      // This is a structural pattern - any bold/italic text at the start of a line that's also a list item
      .replace(/^- \*\*([^*\n]+?)\*\*$/gm, (match, content) => {
        // If it looks like a header (short, contains no punctuation except colon at end)
        if (
          content.length < 30 &&
          !content.match(/[.!?,;]/) &&
          !content.endsWith(":")
        ) {
          return `**${content}**`;
        }
        // Otherwise keep it as a list item
        return match;
      })

      // Fix italic list items that should be headers
      .replace(/^- \*([^*\n]+?)\*$/gm, (match, content) => {
        // If it looks like a header (short, contains no punctuation except colon at end)
        if (
          content.length < 30 &&
          !content.match(/[.!?,;]/) &&
          !content.endsWith(":")
        ) {
          return `**${content}**`;
        }
        // Otherwise convert to bold list item for consistency
        return `- **${content}**`;
      })

      // Fix emoji announcements with bold formatting
      // This is a structural pattern - any line starting with emoji in a list item
      .replace(/^- \*\*(\p{Emoji}[^*\n]+?)\*\*$/gmu, "**$1**")
      .replace(/^- \*(\p{Emoji}[^*\n]+?)\*\*?$/gmu, "**$1**")

      // Fix section headers with colons that should not be list items
      // This is a structural pattern - any line with a colon at the end of bold text in a list item
      .replace(/^- \*\*([^*\n:]+?):\*\*$/gm, "**$1:**")

      // Fix the pattern with trailing asterisks in list items (standardize formatting)
      // This is a structural pattern - standardizing italic to bold in list items
      .replace(/^- \*([^*\n]+?)\*\*$/gm, "- **$1**")
      .replace(/^- \*([^*\n]+?)\*$/gm, "- **$1**")

      // Fix triple asterisks (common markdown error)
      // This is a structural pattern - fixing malformed markdown
      .replace(/\*\*([^*]+?)\*\*\*/g, "**$1**")

      // Ensure proper spacing around headers
      // This is a structural pattern - ensuring proper markdown formatting
      .replace(/([^\n])\n(\*\*[^*\n:]+?:\*\*)/g, "$1\n\n$2")
      .replace(/(\*\*[^*\n:]+?:\*\*)([^\n])/g, "$1\n$2")

      // Ensure proper paragraph breaks
      // This is a structural pattern - ensuring proper markdown formatting
      .replace(/([.!?]"?'?)\s*\n([A-Z])/g, "$1\n\n$2")

      // Remove trailing spaces
      // This is a structural pattern - cleaning up whitespace
      .replace(/\s+$/gm, "")
  );
}

/**
 * Post-process markdown to fix any remaining issues
 */
function postProcessMarkdown(markdown: string): string {
  return (
    markdown
      // Fix any remaining formatting issues
      .replace(PATTERNS.TRIPLE_ASTERISKS, "**$1**") // Fix triple asterisks
      .replace(PATTERNS.MULTIPLE_NEWLINES, "\n\n") // Remove extra blank lines
      .replace(PATTERNS.TRAILING_SPACES, "") // Remove trailing spaces

      // Ensure proper spacing around bold headers
      .replace(/([^\n])\n\*\*([^*:]+?):\*\*/g, "$1\n\n**$2:**")
      .replace(/\*\*([^*:]+?):\*\*([^\n])/g, "**$1:**\n$2")

      // Ensure proper spacing between paragraphs
      .replace(/([^\n])\n([A-Z])/g, "$1\n\n$2")

      // Fix spacing around list items
      .replace(/([^\n])\n(- )/g, "$1\n\n$2")
      .replace(/(- [^\n]+)\n([A-Z])/g, "$1\n\n$2")

      .trim()
  );
}

/**
 * Additional utility functions for handling Airtable's specific markdown features
 * can be added here as needed.
 */
