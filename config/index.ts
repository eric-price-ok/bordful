/**
 * Configuration Loader
 * ------------------
 * This module exports the configuration for the job board.
 *
 * Quick Start:
 * 1. Copy config.example.ts to config.ts
 * 2. Customize config.ts with your settings
 * 3. The app will use your custom configuration
 */

import { config as exampleConfig } from "./config.example";
import type { Config } from "./config.example";

let customConfig: Partial<Config> = {};

// Try to load custom config if it exists
try {
  // Using dynamic import with ES modules syntax
  // This is compatible with Next.js and will be properly tree-shaken
  customConfig = require("./config").config;
  console.log("Using custom config.ts");
} catch (e) {
  // If config.ts doesn't exist, we'll just use the example config
  console.log("Using config.example.ts (no custom config.ts found)");
}

// Merge the configs (custom config overrides example config)
const config: Config = {
  ...exampleConfig,
  ...customConfig,
};

export type { Config };
export default config;
