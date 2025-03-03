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

// Use example config by default
const config: Config = { ...exampleConfig };

// Always try to load custom config first, regardless of environment
try {
  // Use dynamic import with a specific path that won't be bundled
  // This prevents build errors when config.ts doesn't exist
  const userConfigModule = require("./config");
  if (userConfigModule && userConfigModule.config) {
    Object.assign(config, userConfigModule.config);
    console.log("Using custom config.ts");
  }
} catch (e) {
  // If we're in development, show a more detailed message
  if (process.env.NODE_ENV === "development") {
    console.log("Using config.example.ts (no custom config.ts found)");
  } else {
    console.log(
      "Production build: Using config.example.ts (no custom config.ts found)"
    );
  }
}

export type { Config };
export default config;
