import { ImageResponse } from 'next/og';
import config from "@/config";

// Specify that this route should run on Vercel's edge runtime
export const runtime = 'edge';

/**
 * Load font files from @fontsource packages
 * These will be properly available in the Vercel production environment
 * Local development might fallback to system fonts
 */
const fonts = {
  inter: {
    regular: fetch(new URL('../../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff', import.meta.url))
      .then((res) => res.arrayBuffer())
      .catch(() => null),
    semibold: fetch(new URL('../../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff', import.meta.url))
      .then((res) => res.arrayBuffer())
      .catch(() => null),
  },
  ibmPlexSerif: {
    regular: fetch(new URL('../../../node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-normal.woff', import.meta.url))
      .then((res) => res.arrayBuffer())
      .catch(() => null),
    semibold: fetch(new URL('../../../node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff', import.meta.url))
      .then((res) => res.arrayBuffer())
      .catch(() => null),
  }
};

/**
 * Generate a dynamic Open Graph image based on the site configuration
 * This uses the configured colors, fonts, and content
 * @returns {Promise<ImageResponse>} The generated image response
 */
export async function GET(): Promise<ImageResponse> {
  // Get font configuration from the config file
  const fontFamily = config.font.family || 'geist';
  let fontFamilyCSS = 'system-ui, sans-serif';
  let fontData: (ArrayBuffer | null)[] = [];
  
  try {
    // Set appropriate font family and load font data based on config
    switch (fontFamily) {
      case 'inter':
        fontFamilyCSS = 'Inter, system-ui, sans-serif';
        fontData = [
          await fonts.inter.regular,
          await fonts.inter.semibold
        ];
        break;
      case 'ibm-plex-serif':
        fontFamilyCSS = 'IBM Plex Serif, serif';
        fontData = [
          await fonts.ibmPlexSerif.regular,
          await fonts.ibmPlexSerif.semibold
        ];
        break;
      default:
        // Default to system UI fonts for geist or others
        fontFamilyCSS = 'system-ui, sans-serif';
    }
  } catch (error) {
    console.error('Error loading fonts:', error);
    // Fallback to system fonts if there's an error
    fontFamilyCSS = 'system-ui, sans-serif';
    fontData = [];
  }
  
  // Filter out any null values from fontData
  const validFontData = fontData.filter(Boolean) as ArrayBuffer[];

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
          fontWeight: '600', 
          color: config.ui.heroTitleColor || '#FFFFFF',
          margin: '0 0 20px 0',
          lineHeight: '1.2'
        }}>
          {config.title || 'Bordful'}
        </h1>
        <p style={{ 
          fontSize: '30px', 
          color: config.ui.heroSubtitleColor || '#FFFFFF', 
          maxWidth: '1000px',
          margin: 0,
          lineHeight: '1.5'
        }}>
          {config.description || 'Find your dream job today!'}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Only include fonts if we have valid font data
      ...(validFontData.length >= 2 && {
        fonts: [
          {
            name: fontFamily === 'inter' ? 'Inter' : 'IBM Plex Serif',
            data: validFontData[0],
            weight: 400,
            style: 'normal',
          },
          {
            name: fontFamily === 'inter' ? 'Inter' : 'IBM Plex Serif',
            data: validFontData[1],
            weight: 600,
            style: 'normal',
          },
        ]
      })
    }
  );
}
