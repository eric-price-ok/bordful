/**
 * Utility functions for handling Airtable's markdown format
 */

// Regular expressions for pattern matching
const PATTERNS = {
  ITALIC_LIST_ITEM_1: /^- \*([^*]+)\*$/,
  ITALIC_LIST_ITEM_2: /^- \*([^*]+)\*\*$/,
  BOLD_LIST_ITEM: /^- \*\*([^*]+)\*\*$/,
  ITALIC_WITH_ASTERISK: /^- \*([^*]+)\*\*?$/,
  SECTION_HEADER_PATTERN:
    /^- \*\*?[A-Za-z]+ (Marketing|Management|Development|Requirements|teams)\*\*?$/,
  EXTRACT_CONTENT_BOLD: /^- \*\*([^*]+)\*\*$/,
  EXTRACT_CONTENT_ITALIC: /^- \*([^*]+)\*\*?$/,
  TRIPLE_ASTERISKS: /\*\*([^*]+?)\*\*\*/g,
  MULTIPLE_NEWLINES: /\n{3,}/g,
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

  // Process line by line for a robust solution
  const lines = processedMarkdown.split("\n");
  const processedLines = [];

  // State tracking variables
  let inList = false;
  let listLevel = 0;
  let previousLineWasBoldListHeader = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines but preserve them in the output
    if (line === "") {
      processedLines.push("");
      // Empty line typically ends a list context
      if (inList) {
        inList = false;
        listLevel = 0;
        previousLineWasBoldListHeader = false;
      }
      continue;
    }

    // Check for various patterns
    const isListItem = line.startsWith("- ");
    const isItalicListItem =
      line.match(PATTERNS.ITALIC_LIST_ITEM_1) ||
      line.match(PATTERNS.ITALIC_LIST_ITEM_2);
    const isBoldListItem = line.match(PATTERNS.BOLD_LIST_ITEM);
    const isItalicWithAsterisk = line.match(PATTERNS.ITALIC_WITH_ASTERISK);

    // Handle special case: Standalone headers that shouldn't be list items
    // This is a heuristic - if it's an italic/bold list item with no other list items around it
    const isStandaloneHeader =
      (isItalicListItem || isBoldListItem) &&
      (i === 0 || !lines[i - 1].trim().startsWith("- ")) &&
      (i === lines.length - 1 || !lines[i + 1].trim().startsWith("- "));

    // Handle special case: Headers like "About the role" or with emojis
    if (
      (isItalicListItem || isItalicWithAsterisk) &&
      (line.includes("About the") || /\p{Emoji}/u.test(line)) &&
      !line.match(PATTERNS.SECTION_HEADER_PATTERN)
    ) {
      // Convert to bold text, not a list item
      const match = line.match(PATTERNS.EXTRACT_CONTENT_ITALIC);
      if (match) {
        processedLines.push(`**${match[1]}**`);
        previousLineWasBoldListHeader = false;
        inList = false;
      } else {
        processedLines.push(line);
      }
      continue;
    }

    // Handle standalone headers
    if (isStandaloneHeader) {
      if (isBoldListItem) {
        const match = line.match(PATTERNS.EXTRACT_CONTENT_BOLD);
        if (match) {
          processedLines.push(`**${match[1]}**`);
          previousLineWasBoldListHeader = false;
          inList = false;
        } else {
          processedLines.push(line);
        }
      } else if (isItalicListItem || isItalicWithAsterisk) {
        const match = line.match(PATTERNS.EXTRACT_CONTENT_ITALIC);
        if (match) {
          processedLines.push(`**${match[1]}**`);
          previousLineWasBoldListHeader = false;
          inList = false;
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
      processedLines.push(line);
      previousLineWasBoldListHeader = true;
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
      } else if (inList && listLevel === 2) {
        // Continue the sublist
        processedLines.push(`  ${line}`);
      } else {
        // Regular list item
        processedLines.push(line);
        inList = true;
        listLevel = 1;
        previousLineWasBoldListHeader = false;
      }
      continue;
    }

    // Handle non-list items
    processedLines.push(line);
    previousLineWasBoldListHeader = false;

    // Check if this is the end of a list
    if (!line.startsWith("- ") && inList) {
      inList = false;
      listLevel = 0;
    }
  }

  processedMarkdown = processedLines.join("\n");

  // Final cleanup passes
  return (
    processedMarkdown
      // Fix any remaining formatting issues
      .replace(PATTERNS.TRIPLE_ASTERISKS, "**$1**") // Fix triple asterisks
      .replace(PATTERNS.MULTIPLE_NEWLINES, "\n\n") // Remove extra blank lines
      .trim()
  );
}

/**
 * Additional utility functions for handling Airtable's specific markdown features
 * can be added here as needed.
 */
