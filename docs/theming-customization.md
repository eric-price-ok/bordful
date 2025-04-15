# Theming and Color Customization

This document explains how to customize the visual appearance of your job board by configuring colors and other theming options.

## Primary Color Configuration

The job board now supports a configurable primary color that is consistently applied across various UI elements throughout the site. This allows for easy branding customization without having to modify individual components.

### Configuration

To set your primary color, update the `primaryColor` property in the `ui` section of your `config.ts` file:

```typescript
// config/config.ts
export const config = {
  // ... other configuration
  ui: {
    // Hero section background color
    heroBackgroundColor: "#f8fafc",
    
    // Primary color used throughout the site (buttons, links, etc.)
    // Can be hex, rgb, hsl, etc.
    primaryColor: "#4f46e5", // Example: indigo color
  },
  // ... other configuration
};
```

The `primaryColor` value can be any of the following:

1. **Standard CSS color values:**
   - Hexadecimal: `#4f46e5`
   - RGB: `rgb(79, 70, 229)`
   - HSL: `hsl(245, 75%, 59%)`

2. **Tailwind color patterns:**
   - Format: `{color}-{shade}` (e.g., `slate-500`)
   - Examples:
     - `indigo-600` (Tailwind's indigo-600 color)
     - `blue-700` (Tailwind's blue-700 color)
     - `emerald-500` (Tailwind's emerald-500 color)

Supported Tailwind colors include: slate, gray, zinc, red, orange, amber, yellow, green, emerald, teal, cyan, blue, indigo, purple, and pink, with shades from 50 to 950.

### Components Using Primary Color

The primary color is automatically applied to the following components:

1. **Navigation Bar**
   - "Post a Job" button in the top navigation

2. **Job Cards**
   - Featured badges on job listings
   - "Apply Now" buttons (visible on hover)

3. **Job Detail Pages**
   - "Apply Now" buttons (top and bottom of job details)

4. **Footer**
   - "Post a Job" button in the footer

5. **Post Job Banner**
   - Call-to-action button in the "Hiring? Post Your Job Ad Here" banner

### Implementation Details

The primary color is applied using a color resolver that handles both direct CSS colors and Tailwind color patterns. This provides flexibility while maintaining a clean configuration.

The implementation:
1. Automatically detects if you're using CSS colors (`#hex`, `rgb()`, etc.) or Tailwind patterns (`blue-500`)
2. Resolves Tailwind patterns to their corresponding hex values
3. Applies the color consistently across all components

## Background Customization

In addition to the primary color, you can customize the background color of specific sections:

```typescript
// config/config.ts
export const config = {
  // ... other configuration
  ui: {
    // Hero section background color
    heroBackgroundColor: "#f8fafc", // Or use "slate-50" as a Tailwind color
    
    // ... other UI configuration
  },
  // ... other configuration
};
```

## Hero Gradient Backgrounds

The hero section now supports both solid color backgrounds and gradient backgrounds for enhanced visual appeal. Gradients can be configured using the `heroGradient` property in the `ui` section of your configuration file.

### Basic Configuration

To set up a gradient background:

```typescript
// config/config.ts
export const config = {
  // ... other configuration
  ui: {
    // Hero section solid background color (used as fallback)
    heroBackgroundColor: "#005450",
    
    // Hero section gradient background
    heroGradient: {
      enabled: true, // Set to true to enable gradient background
      type: "linear", // "linear" or "radial"
      direction: "to right", // Direction for linear or style for radial
      colors: [
        "#005450", // Start color
        "#007a73", // Optional middle color(s)
        "#00a59c", // End color
      ],
      // Optional stops for precise color position control
      stops: ["0%", "50%", "100%"],
    },
    
    // ... other UI configuration
  },
  // ... other configuration
};
```

### Gradient Types and Options

#### Linear Gradients

Linear gradients transition colors along a straight line. Configure them using:

```typescript
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "to right", // or "to left", "to bottom", "to top", etc.
  colors: ["#3b82f6", "#d946ef"], // At least 2 colors
}
```

The `direction` property accepts any valid CSS linear-gradient direction:
- Cardinal directions: `"to right"`, `"to left"`, `"to top"`, `"to bottom"`
- Corners: `"to top right"`, `"to bottom left"`, etc.
- Angles: `"45deg"`, `"135deg"`, etc.

#### Radial Gradients

Radial gradients transition colors outward from a center point. Configure them using:

```typescript
heroGradient: {
  enabled: true,
  type: "radial",
  direction: "circle", // or "ellipse", "circle at center", etc.
  colors: ["#3b82f6", "#d946ef"], // At least 2 colors
}
```

The `direction` property accepts any valid CSS radial-gradient value:
- Shape: `"circle"`, `"ellipse"`
- Position: `"circle at center"`, `"ellipse at top left"`, etc.

### Color Stops

For more precise control over color positioning, you can use the optional `stops` array to specify where each color should appear in the gradient:

```typescript
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "to right",
  colors: ["#3b82f6", "#8b5cf6", "#d946ef"],
  stops: ["0%", "30%", "100%"], // Position each color
}
```

The `stops` array should have the same length as the `colors` array. Each stop is a percentage value that determines where the corresponding color appears in the gradient.

### Disabling Gradients

To revert to a solid background color, simply set `enabled` to `false`:

```typescript
heroGradient: {
  enabled: false,
}
```

When gradients are disabled, the system falls back to using the `heroBackgroundColor` property.

### Examples

#### Blue-to-Purple Horizontal Gradient

```typescript
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "to right",
  colors: ["#1d4ed8", "#7e22ce"],
}
```

#### Three-Color Diagonal Gradient

```typescript
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "135deg",
  colors: ["#0ea5e9", "#8b5cf6", "#ec4899"],
  stops: ["0%", "50%", "100%"],
}
```

#### Radial Gradient

```typescript
heroGradient: {
  enabled: true,
  type: "radial",
  direction: "circle at center",
  colors: ["#34d399", "#10b981", "#059669"],
}
```

#### Sunset Gradient

```typescript
heroGradient: {
  enabled: true,
  type: "linear",
  direction: "to bottom",
  colors: ["#f97316", "#db2777"],
}
```

### Technical Implementation

The hero gradient system generates valid CSS gradient strings based on your configuration. For linear gradients, it creates CSS like:

```css
background: linear-gradient(to right, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%);
```

For radial gradients, it creates CSS like:

```css
background: radial-gradient(circle, #3b82f6 0%, #d946ef 100%);
```

The implementation intelligently handles color stops to ensure smooth transitions even if stops are not specified.

## Best Practices

When customizing colors, consider the following best practices:

1. **Accessibility**: Ensure sufficient contrast between text and background colors. Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

2. **Consistency**: Use the primary color for key actions and important elements consistently throughout the site.

3. **Brand Alignment**: Choose colors that align with your brand identity for a cohesive look.

4. **Color Psychology**: Consider the psychological impact of your color choices. Different colors evoke different emotions and reactions.

## Future Enhancements

Planned enhancements to the theming system include:

- Secondary color configuration
- Text color customization
- Full theme configuration with dark mode support
- Custom CSS variables for advanced theming 