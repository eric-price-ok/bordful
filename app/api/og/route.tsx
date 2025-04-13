import { ImageResponse } from "next/og";
import config from "@/config";

// Specify that this route should run on Vercel's edge runtime
export const runtime = "edge";

// Define TypeScript interfaces to match our configuration
interface OGLogoPosition {
  top: number;
  left: number;
}

interface OGLogoConfig {
  show?: boolean;
  src?: string;
  width?: number | string;
  height?: number | string;
  position?: OGLogoPosition;
}

interface OGFontConfig {
  family?: string | null;
}

interface OGConfig {
  enabled?: boolean;
  title?: string | null;
  description?: string | null;
  backgroundColor?: string | null;
  titleColor?: string | null;
  descriptionColor?: string | null;
  font?: OGFontConfig;
  logo?: OGLogoConfig;
}

// Helper function to load font data from Google Fonts for a family subset
async function loadGoogleFontData(
  fontFamily: string,
  text: string
): Promise<ArrayBuffer | null> {
  // Replace spaces for URL compatibility
  const fontNameForUrl = fontFamily.replace(/\s/g, "+");
  // Fetch CSS for the family, subset by text, WITHOUT specifying weight
  const url = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}&text=${encodeURIComponent(
    text
  )}`;

  try {
    const cssResponse = await fetch(url);
    if (!cssResponse.ok) {
      console.error(
        `Failed to fetch Google Font CSS (${fontFamily}): ${cssResponse.status} ${cssResponse.statusText}`
      );
      return null;
    }
    const css = await cssResponse.text();

    // Extract the first compatible (TTF/OTF) font URL
    const resource = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype)'\)/
    );

    if (resource && resource[1]) {
      const fontDataResponse = await fetch(resource[1]);
      if (fontDataResponse.ok) {
        return await fontDataResponse.arrayBuffer();
      } else {
        console.error(
          `Failed to fetch font data (${fontFamily}): ${fontDataResponse.status} ${fontDataResponse.statusText}`
        );
        return null;
      }
    } else {
      console.error(
        `Could not extract compatible (TTF/OTF) font URL from Google CSS (${fontFamily})`
      );
      return null;
    }
  } catch (error) {
    console.error(`Error loading Google Font (${fontFamily}):`, error);
    return null;
  }
}

/**
 * Generate a dynamic Open Graph image based on the site configuration
 * using dynamically fetched Google Fonts.
 * @returns {Promise<ImageResponse | Response>} The generated image response or an error response
 */
export async function GET(): Promise<ImageResponse | Response> {
  // Get and type-check the OG configuration
  const ogConfig: OGConfig = config.og || {};

  // Check if OG image generation is enabled
  if (ogConfig.enabled === false) {
    return new Response("OG image generation is disabled in config", {
      status: 404,
    });
  }

  // Get config values with fallbacks
  const fontFamily = ogConfig.font?.family || config.font.family || "geist";
  const siteTitle = ogConfig.title || config.title || "Bordful";
  const siteDescription =
    ogConfig.description || config.description || "Find your dream job today!";
  const backgroundColor =
    ogConfig.backgroundColor || config.ui.heroBackgroundColor || "#005450";
  const titleColor =
    ogConfig.titleColor || config.ui.heroTitleColor || "#FFFFFF";
  const descriptionColor =
    ogConfig.descriptionColor || config.ui.heroSubtitleColor || "#FFFFFF";

  const textToRender = `${siteTitle} ${siteDescription}`; // Combine text for font loading

  let fontFamilyName = ""; // Name to use in ImageResponse fonts array
  let fontNameToLoad = ""; // Name for Google Fonts API

  switch (fontFamily) {
    case "inter":
      fontFamilyName = "Inter";
      fontNameToLoad = "Inter";
      break;
    case "ibm-plex-serif":
      fontFamilyName = "IBM Plex Serif";
      fontNameToLoad = "IBM Plex Serif";
      break;
    default: // geist or others
      break;
  }

  let fontData: ArrayBuffer | null = null;

  // Load font data ONCE per family if needed
  if (fontNameToLoad) {
    fontData = await loadGoogleFontData(fontNameToLoad, textToRender);
  }

  // Prepare fonts array for ImageResponse
  const imageResponseFonts = [];
  // If font data was loaded successfully, add entries for both weights
  // using the SAME font data buffer.
  if (fontFamilyName && fontData) {
    imageResponseFonts.push({
      name: fontFamilyName,
      data: fontData, // Use the single loaded data buffer
      weight: 400 as const, // Use 'as const' for specific literal type
      style: "normal" as const, // Use 'as const' for specific literal type
    });
    imageResponseFonts.push({
      name: fontFamilyName,
      data: fontData, // Use the single loaded data buffer
      weight: 800 as const, // Use 'as const' for specific literal type
      style: "normal" as const, // Use 'as const' for specific literal type
    });
  }

  // Use the font family name for CSS if loaded, otherwise fallback
  const fontFamilyCSS =
    fontFamilyName && imageResponseFonts.length > 0
      ? fontFamilyName
      : fontFamily === "ibm-plex-serif"
      ? "serif"
      : "sans-serif";

  // --- Logo Handling Start ---
  let logoDataUri = ""; // Initialize as empty

  // Get logo configuration with proper type checking
  const logoConfig = ogConfig.logo || {};
  const logoEnabled = logoConfig.show !== false; // Default to true if not specified
  const logoSrc = logoConfig.src || ""; // Get source directly from config

  // Get logo dimensions and position
  const logoHeight = logoConfig.height || 56;
  // NOTE: Always use a fixed width (number) value - "auto" doesn't work reliably with Satori
  const logoWidth = logoConfig.width || 185; // Default fixed width if not specified
  const logoTop = logoConfig.position?.top || 60;
  const logoLeft = logoConfig.position?.left || 60;

  // Only try to load the logo if it's enabled and has a source
  if (logoEnabled && logoSrc) {
    try {
      // Construct the full URL for the logo
      // If starts with http, use as is; otherwise, prefix with site URL
      const logoUrl =
        typeof logoSrc === "string" && logoSrc.startsWith("http")
          ? logoSrc
          : `${config.url}${logoSrc}`;

      console.log(`Fetching logo from: ${logoUrl}`);

      const logoResponse = await fetch(logoUrl);
      if (!logoResponse.ok) {
        throw new Error(
          `Failed to fetch logo: ${logoResponse.status} ${logoResponse.statusText}`
        );
      }

      // Check content type to handle SVG and raster images differently
      const contentType = logoResponse.headers.get("content-type") || "";

      if (contentType.includes("svg")) {
        // Handle SVG
        let svgText = await logoResponse.text();
        // Remove width and height attributes from SVG for better styling control
        svgText = svgText.replace(
          /<svg(?=\s)([^>]*?)\s+(width|height)="[^"]*"/g,
          "<svg$1"
        );
        logoDataUri = `data:image/svg+xml;base64,${btoa(svgText)}`;
      } else {
        // Handle other image types (PNG, JPG, etc.)
        const imageData = await logoResponse.arrayBuffer();
        const base64 = Buffer.from(imageData).toString("base64");
        logoDataUri = `data:${contentType};base64,${base64}`;
      }
    } catch (logoError: unknown) {
      const errorMessage =
        logoError instanceof Error ? logoError.message : String(logoError);
      console.error(`Error fetching or processing logo: ${errorMessage}`);
      // logoDataUri remains "" on error
    }
  }
  // --- Logo Handling End ---

  try {
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: backgroundColor,
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontFamily: fontFamilyCSS,
            textAlign: "center",
            padding: "50px",
            position: "relative", // Needed for absolute positioning of logo
          }}
        >
          {/* Logo Image */}
          {logoDataUri && (
            <img
              src={logoDataUri}
              alt={`${config.title} Logo`}
              style={{
                position: "absolute",
                top: `${logoTop}px`,
                left: `${logoLeft}px`,
                height:
                  typeof logoHeight === "number"
                    ? `${logoHeight}px`
                    : logoHeight,
                width:
                  typeof logoWidth === "number" ? `${logoWidth}px` : logoWidth,
                objectFit: "contain", // Ensure the image maintains its aspect ratio
              }}
            />
          )}
          <h1
            style={{
              fontSize: "60px",
              fontWeight: 800, // Request Extra Bold weight
              color: titleColor,
              margin: "0 0 20px 0",
              lineHeight: "1.2",
            }}
          >
            {siteTitle}
          </h1>
          <p
            style={{
              fontSize: "30px",
              fontWeight: 400, // Request regular weight
              color: descriptionColor,
              maxWidth: "1000px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            {siteDescription}
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: imageResponseFonts.length > 0 ? imageResponseFonts : undefined,
      }
    );
  } catch (e: unknown) {
    // Use unknown instead of any
    const errorMessage = e instanceof Error ? e.message : String(e); // Type check before accessing message
    console.error(
      `Error generating ImageResponse (${fontFamilyName}): ${errorMessage}`
    );
    return new Response(`Failed to generate the image: ${errorMessage}`, {
      status: 500,
    });
  }
}
