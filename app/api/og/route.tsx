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
      // console.log("Google CSS received:", css); // Optional debug logging
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
      weight: 400 as 400,
      style: 'normal' as 'normal',
    });
    imageResponseFonts.push({
      name: fontFamilyName,
      data: fontData, // Use the single loaded data buffer
      weight: 800 as 800, // Use Extra Bold weight
      style: 'normal' as 'normal',
    });
  }

  // Use the font family name for CSS if loaded, otherwise fallback
  const fontFamilyCSS = fontFamilyName && imageResponseFonts.length > 0
    ? fontFamilyName
    : (fontFamily === 'ibm-plex-serif' ? 'serif' : 'sans-serif');

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
          }}
        >
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
  } catch (e: any) {
    console.error(`Error generating ImageResponse (${fontFamilyName}): ${e.message}`);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
