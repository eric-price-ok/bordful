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

// Create the final config object with example config as base
const config: Config = {
  ...exampleConfig,
};

// In development, we can override with custom config
if (process.env.NODE_ENV === "development") {
  // Using a type assertion to handle the dynamic import
  const importConfig = () => import("./config" as string);

  importConfig()
    .then(
      (module) => {
        const customConfig = module.config as Partial<Config>;
        if (customConfig) {
          Object.assign(config, customConfig);
          console.log("Using custom config.ts");
        }
      },
      () => {
        console.log("Using config.example.ts (no custom config.ts found)");
      }
    )
    .catch(() => {
      // Fallback to example config
      console.log("Using config.example.ts (no custom config.ts found)");
    });
}

export type { Config };
export default config;
