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

// Start with example config as the base
const config: Config = { ...exampleConfig };

// Try to load custom config if it exists
try {
  const customConfig = require("./config").config;
  if (customConfig) {
    Object.assign(config, customConfig);
    console.log("Using custom config.ts");
  }
} catch (e) {
  // If config.ts doesn't exist, we'll just use the example config
  console.log("Using config.example.ts (no custom config.ts found)");
}

export type { Config };
export default config;
