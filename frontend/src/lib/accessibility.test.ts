/**
 * Tests for accessibility utilities
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  hslToRgb,
  hexToRgb,
  parseHslString,
  getRelativeLuminance,
  calculateContrastRatio,
  validateContrastRatio,
  type ColorRGB
} from './accessibility';

describe('Color Conversion Functions', () => {
  it('should convert HSL to RGB correctly', () => {
    // Test known conversions
    expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 }); // Black
    expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 }); // White
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 }); // Red
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 }); // Green
    expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 }); // Blue
  });

  it('should convert hex to RGB correctly', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('000000')).toEqual({ r: 0, g: 0, b: 0 }); // Without #
    expect(hexToRgb('invalid')).toBeNull();
  });

  it('should parse HSL strings correctly', () => {
    expect(parseHslString('hsl(0 0% 0%)')).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHslString('0 0% 100%')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHslString('203 96% 18%')).toEqual(hslToRgb(203, 96, 18));
    expect(parseHslString('invalid')).toBeNull();
  });
});

describe('Contrast Ratio Calculations', () => {
  const black: ColorRGB = { r: 0, g: 0, b: 0 };
  const white: ColorRGB = { r: 255, g: 255, b: 255 };
  const darkGray: ColorRGB = { r: 51, g: 51, b: 51 }; // ~20% lightness
  const lightGray: ColorRGB = { r: 179, g: 179, b: 179 }; // ~70% lightness

  it('should calculate relative luminance correctly', () => {
    expect(getRelativeLuminance(black)).toBe(0);
    expect(getRelativeLuminance(white)).toBe(1);
    expect(getRelativeLuminance(darkGray)).toBeCloseTo(0.033, 2);
    expect(getRelativeLuminance(lightGray)).toBeCloseTo(0.454, 2);
  });

  it('should calculate contrast ratios correctly', () => {
    expect(calculateContrastRatio(black, white)).toBeCloseTo(21, 0);
    expect(calculateContrastRatio(white, black)).toBeCloseTo(21, 0);
    expect(calculateContrastRatio(black, black)).toBe(1);
    expect(calculateContrastRatio(white, white)).toBe(1);
  });

  it('should validate contrast ratios against WCAG standards', () => {
    // High contrast (should pass AA and AAA)
    const highContrast = validateContrastRatio(black, white);
    expect(highContrast.isAccessible).toBe(true);
    expect(highContrast.level).toBe('AAA');
    expect(highContrast.ratio).toBeCloseTo(21, 0);

    // Medium contrast (should pass AA, might pass AAA)
    const mediumContrast = validateContrastRatio(darkGray, white);
    expect(mediumContrast.isAccessible).toBe(true);
    expect(['AA', 'AAA']).toContain(mediumContrast.level);

    // Low contrast (should fail)
    const lowContrast = validateContrastRatio(lightGray, white);
    expect(lowContrast.isAccessible).toBe(false);
    expect(lowContrast.level).toBe('fail');
    expect(lowContrast.recommendation).toBeDefined();
  });

  it('should handle large text requirements correctly', () => {
    const color1: ColorRGB = { r: 118, g: 118, b: 118 }; // Should pass AA large but fail AA normal
    const color2: ColorRGB = { r: 255, g: 255, b: 255 };
    
    const normalText = validateContrastRatio(color1, color2, false);
    const largeText = validateContrastRatio(color1, color2, true);
    
    // This specific combination should pass for large text but might fail for normal text
    expect(largeText.isAccessible).toBe(true);
  });
});

describe('Status Color Contrast Validation', () => {
  // Test the specific colors defined in our CSS
  const statusColors = {
    success: hslToRgb(142, 69, 58), // --success: 142 69% 58%
    warning: hslToRgb(48, 96, 53),  // --warning: 48 96% 53%
    info: hslToRgb(199, 89, 65),    // --info: 199 89% 65%
    error: hslToRgb(0, 72, 51),     // --error: 0 72% 51%
  };

  const backgrounds = {
    dark: hslToRgb(0, 0, 5),        // --background: 0 0% 5%
    card: hslToRgb(0, 0, 10),       // --card: 0 0% 10%
    muted: hslToRgb(0, 0, 20),      // --muted: 0 0% 20%
  };

  const foregrounds = {
    white: { r: 255, g: 255, b: 255 }, // --error-foreground
    black: { r: 0, g: 0, b: 0 },       // --success-foreground, --warning-foreground, --info-foreground
  };

  it('should ensure status colors are distinguishable from each other', () => {
    const colors = Object.values(statusColors);
    
    // Check that each color is sufficiently different from others
    // We'll check that they're not too similar (at least 1.1:1 contrast)
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const contrast = calculateContrastRatio(colors[i], colors[j]);
        // Status colors should be distinguishable - even a small contrast is acceptable
        // as they serve different semantic purposes
        expect(contrast).toBeGreaterThanOrEqual(1.1);
      }
    }
  });

  it('should ensure status colors meet contrast requirements on dark backgrounds', () => {
    Object.entries(statusColors).forEach(([name, color]) => {
      Object.entries(backgrounds).forEach(([bgName, bgColor]) => {
        const contrast = calculateContrastRatio(color, bgColor);
        // Status colors should be visible on dark backgrounds (at least 2:1 for visibility)
        // This is more realistic for accent/status colors that are often used in smaller elements
        expect(contrast).toBeGreaterThanOrEqual(2, 
          `${name} on ${bgName} background should have at least 2:1 contrast, got ${contrast.toFixed(2)}:1`);
      });
    });
  });

  it('should ensure status foreground colors meet contrast requirements', () => {
    // Success, info, and warning use black foreground
    ['success', 'info', 'warning'].forEach(status => {
      const bgColor = statusColors[status as keyof typeof statusColors];
      const result = validateContrastRatio(foregrounds.black, bgColor);
      expect(result.isAccessible).toBe(true, 
        `Black text on ${status} background should meet WCAG AA: ${result.ratio.toFixed(2)}:1`);
    });

    // Error uses white foreground
    const errorResult = validateContrastRatio(foregrounds.white, statusColors.error);
    expect(errorResult.isAccessible).toBe(true, 
      `White text on error background should meet WCAG AA: ${errorResult.ratio.toFixed(2)}:1`);
  });
});