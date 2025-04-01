import { Inter } from "next/font/google";
import { IBM_Plex_Serif } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import config from "@/config";

// Load Inter font
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// Load IBM Plex Serif font
export const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-serif",
  weight: ["400", "500", "600", "700"],
});

// Export Geist fonts
export const geistSans = GeistSans;
export const geistMono = GeistMono;

// Helper function to get the appropriate font class based on config
export function getFontClass() {
  try {
    const fontFamily = config?.font?.family;

    switch (fontFamily) {
      case "inter":
        return inter.variable;
      case "ibm-plex-serif":
        return ibmPlexSerif.variable;
      default:
        return geistSans.variable;
    }
  } catch {
    // Fallback to Geist Sans if config is not available
    return geistSans.variable;
  }
}

// Helper function to get appropriate CSS class for body
export function getBodyClass() {
  try {
    return config?.font?.family === "ibm-plex-serif" ? "font-serif" : "";
  } catch {
    return "";
  }
}

// Export all configured fonts together
export const fonts = {
  inter,
  ibmPlexSerif,
  geistSans,
  geistMono,
  getFontClass,
  getBodyClass,
};

export default fonts;
