/**
 * Accessibility utilities for color contrast validation
 * Implements WCAG 2.1 AA contrast ratio requirements
 */

export interface ContrastResult {
  ratio: number;
  isAccessible: boolean;
  level: 'AA' | 'AAA' | 'fail';
  recommendation?: string;
}

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert HSL color to RGB
 */
export function hslToRgb(h: number, s: number, l: number): ColorRGB {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= h && h < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= h && h < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h < 1) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Parse CSS HSL string to RGB
 */
export function parseHslString(hsl: string): ColorRGB | null {
  // Match patterns like "hsl(203 96% 18%)" or "203 96% 18%"
  const match = hsl.match(/(?:hsl\()?(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\)?/);
  if (!match) return null;

  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]);
  const l = parseFloat(match[3]);

  return hslToRgb(h, s, l);
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 specification
 */
export function getRelativeLuminance(color: ColorRGB): number {
  const { r, g, b } = color;
  
  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function calculateContrastRatio(color1: ColorRGB, color2: ColorRGB): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate contrast ratio against WCAG 2.1 standards
 */
export function validateContrastRatio(
  foregroundColor: ColorRGB,
  backgroundColor: ColorRGB,
  isLargeText: boolean = false
): ContrastResult {
  const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
  
  // WCAG 2.1 AA requirements
  const minRatioNormal = 4.5;
  const minRatioLarge = 3.0;
  const minRatioAAA = isLargeText ? 4.5 : 7.0;
  
  const requiredRatio = isLargeText ? minRatioLarge : minRatioNormal;
  const isAccessible = ratio >= requiredRatio;
  
  let level: 'AA' | 'AAA' | 'fail';
  if (ratio >= minRatioAAA) {
    level = 'AAA';
  } else if (ratio >= requiredRatio) {
    level = 'AA';
  } else {
    level = 'fail';
  }

  let recommendation: string | undefined;
  if (!isAccessible) {
    recommendation = `Contrast ratio ${ratio.toFixed(2)}:1 is below the required ${requiredRatio}:1. Consider using a ${ratio < requiredRatio ? 'darker' : 'lighter'} ${ratio < requiredRatio ? 'background' : 'text'} color.`;
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    isAccessible,
    level,
    recommendation
  };
}

/**
 * Validate contrast for CSS custom property values
 */
export function validateCSSPropertyContrast(
  foregroundProperty: string,
  backgroundProperty: string,
  isLargeText: boolean = false
): ContrastResult | null {
  // Get computed styles from CSS custom properties
  const foregroundValue = getComputedStyle(document.documentElement)
    .getPropertyValue(foregroundProperty).trim();
  const backgroundValue = getComputedStyle(document.documentElement)
    .getPropertyValue(backgroundProperty).trim();

  const foregroundRgb = parseHslString(foregroundValue) || hexToRgb(foregroundValue);
  const backgroundRgb = parseHslString(backgroundValue) || hexToRgb(backgroundValue);

  if (!foregroundRgb || !backgroundRgb) {
    return null;
  }

  return validateContrastRatio(foregroundRgb, backgroundRgb, isLargeText);
}

/**
 * Get all defined CSS custom properties for colors
 */
export function getColorCustomProperties(): Record<string, string> {
  const styles = getComputedStyle(document.documentElement);
  const properties: Record<string, string> = {};
  
  // Common color property names to check
  const colorProperties = [
    '--background', '--foreground', '--card', '--card-foreground',
    '--popover', '--popover-foreground', '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
    '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
    '--border', '--input', '--ring', '--success', '--success-foreground',
    '--warning', '--warning-foreground', '--info', '--info-foreground',
    '--sidebar-background', '--sidebar-foreground', '--sidebar-primary',
    '--sidebar-primary-foreground', '--sidebar-accent', '--sidebar-accent-foreground'
  ];

  colorProperties.forEach(prop => {
    const value = styles.getPropertyValue(prop).trim();
    if (value) {
      properties[prop] = value;
    }
  });

  return properties;
}

/**
 * Validate all text-background combinations in the current theme
 */
export function validateThemeContrast(): Array<{
  combination: string;
  result: ContrastResult;
}> {
  const results: Array<{ combination: string; result: ContrastResult }> = [];
  
  // Define text-background combinations to validate
  const combinations = [
    { fg: '--foreground', bg: '--background', name: 'Primary text on background' },
    { fg: '--card-foreground', bg: '--card', name: 'Card text on card background' },
    { fg: '--popover-foreground', bg: '--popover', name: 'Popover text on popover background' },
    { fg: '--primary-foreground', bg: '--primary', name: 'Primary button text' },
    { fg: '--secondary-foreground', bg: '--secondary', name: 'Secondary button text' },
    { fg: '--muted-foreground', bg: '--muted', name: 'Muted text on muted background' },
    { fg: '--accent-foreground', bg: '--accent', name: 'Accent text on accent background' },
    { fg: '--destructive-foreground', bg: '--destructive', name: 'Destructive button text' },
    { fg: '--success-foreground', bg: '--success', name: 'Success indicator text' },
    { fg: '--warning-foreground', bg: '--warning', name: 'Warning indicator text' },
    { fg: '--info-foreground', bg: '--info', name: 'Info indicator text' },
    { fg: '--sidebar-foreground', bg: '--sidebar-background', name: 'Sidebar text' },
    { fg: '--sidebar-primary-foreground', bg: '--sidebar-primary', name: 'Sidebar primary text' },
    { fg: '--sidebar-accent-foreground', bg: '--sidebar-accent', name: 'Sidebar accent text' }
  ];

  combinations.forEach(({ fg, bg, name }) => {
    const result = validateCSSPropertyContrast(fg, bg);
    if (result) {
      results.push({
        combination: name,
        result
      });
    }
  });

  return results;
}

/**
 * Development utility to log contrast validation results
 */
export function logContrastValidation(): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const results = validateThemeContrast();
  const failures = results.filter(r => !r.result.isAccessible);
  
  if (failures.length > 0) {
    console.group('🚨 Accessibility Contrast Issues');
    failures.forEach(({ combination, result }) => {
      console.warn(`${combination}: ${result.ratio}:1 (${result.recommendation})`);
    });
    console.groupEnd();
  } else {
    console.log('✅ All color combinations meet WCAG 2.1 AA contrast requirements');
  }
  
  // Log all results for reference
  console.group('📊 All Contrast Ratios');
  results.forEach(({ combination, result }) => {
    const icon = result.level === 'AAA' ? '🟢' : result.level === 'AA' ? '🟡' : '🔴';
    console.log(`${icon} ${combination}: ${result.ratio}:1 (${result.level})`);
  });
  console.groupEnd();
}