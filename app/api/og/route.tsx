import { ImageResponse } from 'next/og';
import config from "@/config";

// Specify that this route should run on Vercel's edge runtime
export const runtime = 'edge';

// Helper function to load font data from Google Fonts for a family subset
async function loadGoogleFontData(fontFamily: string, text: string): Promise<ArrayBuffer | null> {
  // Replace spaces for URL compatibility
  const fontNameForUrl = fontFamily.replace(/\s/g, '+');
  // Fetch CSS for the family, subset by text, WITHOUT specifying weight
  const url = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}&text=${encodeURIComponent(text)}`;

  try {
    const cssResponse = await fetch(url);
    if (!cssResponse.ok) {
      console.error(`Failed to fetch Google Font CSS (${fontFamily}): ${cssResponse.status} ${cssResponse.statusText}`);
      return null;
    }
    const css = await cssResponse.text();

    // Extract the first compatible (TTF/OTF) font URL
    const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);

    if (resource && resource[1]) {
      const fontDataResponse = await fetch(resource[1]);
      if (fontDataResponse.ok) {
        return await fontDataResponse.arrayBuffer();
      } else {
        console.error(`Failed to fetch font data (${fontFamily}): ${fontDataResponse.status} ${fontDataResponse.statusText}`);
        return null;
      }
    } else {
      console.error(`Could not extract compatible (TTF/OTF) font URL from Google CSS (${fontFamily})`);
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
  // Get config values
  const fontFamily = config.font.family || 'geist';
  const siteTitle = config.title || 'Bordful';
  const siteDescription = config.description || 'Find your dream job today!';
  const textToRender = `${siteTitle} ${siteDescription}`; // Combine text for font loading

  let fontFamilyName = '';     // Name to use in ImageResponse fonts array
  let fontNameToLoad = '';     // Name for Google Fonts API

  switch (fontFamily) {
    case 'inter':
      fontFamilyName = 'Inter';
      fontNameToLoad = 'Inter';
      break;
    case 'ibm-plex-serif':
      fontFamilyName = 'IBM Plex Serif';
      fontNameToLoad = 'IBM Plex Serif';
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
      style: 'normal' as const, // Use 'as const' for specific literal type
    });
    imageResponseFonts.push({
      name: fontFamilyName,
      data: fontData, // Use the single loaded data buffer
      weight: 800 as const, // Use 'as const' for specific literal type
      style: 'normal' as const, // Use 'as const' for specific literal type
    });
  }

  // Use the font family name for CSS if loaded, otherwise fallback
  const fontFamilyCSS = fontFamilyName && imageResponseFonts.length > 0
    ? fontFamilyName
    : (fontFamily === 'ibm-plex-serif' ? 'serif' : 'sans-serif');

  // --- Fetch Logo --- START
  let logoDataUri = ""; // Initialize as empty
  const logoConfig = config.footer.brand.logo;
  if (logoConfig?.enabled && logoConfig?.src) {
    try {
      const logoUrl = `${config.url}${logoConfig.src}`;
      const logoResponse = await fetch(logoUrl);
      if (!logoResponse.ok) {
        throw new Error(`Failed to fetch logo: ${logoResponse.statusText}`);
      }
      let svgText = await logoResponse.text();
      // Remove width and height attributes from the root <svg> tag using a single regex
      // Satori struggles with respecting aspect ratio via CSS for some SVGs,
      // so removing internal dimensions and setting explicit W/H in CSS is more reliable.
      svgText = svgText.replace(/<svg(?=\s)([^>]*?)\s+(width|height)="[^"]*"/g, '<svg$1');

      logoDataUri = `data:image/svg+xml;base64,${btoa(svgText)}`;

    } catch (logoError: unknown) {
      const errorMessage = logoError instanceof Error ? logoError.message : String(logoError);
      console.error(`Error fetching or processing logo: ${errorMessage}`);
      // logoDataUri remains "" on error
    }
  }
  // --- Fetch Logo --- END

  try {
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: config.ui.heroBackgroundColor || '#005450',
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: fontFamilyCSS,
            textAlign: 'center',
            padding: '50px',
            position: 'relative', // Needed for absolute positioning of logo
          }}
        >
          {/* Logo Image - Added */}
          {logoDataUri && (
            <img
              src={logoDataUri}
              alt={`${config.title} Logo`}
              style={{
                position: "absolute",
                top: "60px",
                left: "60px",
                height: "56px",      // Set height as requested
                width: "186.48px",   // Set calculated width (56 * (1665/500))
                                     // Explicit width needed due to Satori SVG rendering quirks
              }}
            />
          )}
          <h1 style={{
            fontSize: '60px',
            fontWeight: 800, // Request Extra Bold weight
            color: config.ui.heroTitleColor || '#FFFFFF',
            margin: '0 0 20px 0',
            lineHeight: '1.2'
          }}>
            {siteTitle}
          </h1>
          <p style={{
            fontSize: '30px',
            fontWeight: 400, // Request regular weight
            color: config.ui.heroSubtitleColor || '#FFFFFF',
            maxWidth: '1000px',
            margin: 0,
            lineHeight: '1.5'
          }}>
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
  } catch (e: unknown) { // Use unknown instead of any
    const errorMessage = e instanceof Error ? e.message : String(e); // Type check before accessing message
    console.error(`Error generating ImageResponse (${fontFamilyName}): ${errorMessage}`);
    return new Response(`Failed to generate the image: ${errorMessage}`, {
      status: 500,
    });
  }
}
