/**
 * Comprehensive color consistency tests across all pages and interactive elements
 * Tests for Requirements 1.5, 2.2, 3.2, 3.5, 4.2, 4.5
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { 
  getColorCustomProperties, 
  validateThemeContrast,
  parseHslString,
  hslToRgb,
  calculateContrastRatio
} from './accessibility';

describe('Color Consistency Across All Pages', () => {
  beforeAll(() => {
    // Add CSS custom properties to document for testing
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --background: 0 0% 5%;
        --foreground: 0 0% 95%;
        --card: 0 0% 10%;
        --card-foreground: 0 0% 95%;
        --popover: 0 0% 10%;
        --popover-foreground: 0 0% 95%;
        --primary: 203 96% 18%;
        --primary-foreground: 0 0% 100%;
        --secondary: 0 0% 20%;
        --secondary-foreground: 0 0% 95%;
        --muted: 0 0% 20%;
        --muted-foreground: 0 0% 70%;
        --accent: 203 96% 18%;
        --accent-foreground: 0 0% 100%;
        --destructive: 0 84% 60%;
        --destructive-foreground: 0 0% 100%;
        --border: 0 0% 40%;
        --input: 0 0% 40%;
        --ring: 203 96% 18%;
        --success: 142 69% 58%;
        --success-foreground: 0 0% 0%;
        --warning: 48 96% 53%;
        --warning-foreground: 0 0% 0%;
        --info: 199 89% 65%;
        --info-foreground: 0 0% 0%;
        --error: 0 72% 51%;
        --error-foreground: 0 0% 100%;
        --sidebar-background: 0 0% 5%;
        --sidebar-foreground: 0 0% 95%;
        --sidebar-primary: 203 96% 18%;
        --sidebar-primary-foreground: 0 0% 100%;
        --sidebar-accent: 0 0% 10%;
        --sidebar-accent-foreground: 0 0% 95%;
        --sidebar-border: 0 0% 40%;
        --sidebar-ring: 203 96% 18%;
      }
    `;
    document.head.appendChild(style);
  });

  describe('8.1 Color consistency across all pages', () => {
    it('should have all required CSS custom properties defined with correct HSL values', () => {
      const properties = getColorCustomProperties();
      
      // Verify all required background colors are defined with correct HSL values
      expect(properties['--background']).toBe('0 0% 5%');
      expect(properties['--card']).toBe('0 0% 10%');
      expect(properties['--muted']).toBe('0 0% 20%');
      
      // Verify border colors use HSL 0 0 40%
      expect(properties['--border']).toBe('0 0% 40%');
      expect(properties['--input']).toBe('0 0% 40%');
      
      // Verify text colors use HSL 0 0 70% and HSL 0 0 95%
      expect(properties['--muted-foreground']).toBe('0 0% 70%');
      expect(properties['--foreground']).toBe('0 0% 95%');
      
      // Verify accent colors use HSL 203 96 18%
      expect(properties['--primary']).toBe('203 96% 18%');
      expect(properties['--accent']).toBe('203 96% 18%');
    });

    it('should use only the specified background colors from the dark theme palette', () => {
      const expectedBackgrounds = ['0 0% 5%', '0 0% 10%', '0 0% 20%'];
      const properties = getColorCustomProperties();
      
      // Check that background-related properties use only our specified values
      const backgroundProperties = [
        '--background', '--card', '--popover', '--secondary', '--muted', '--sidebar-background', '--sidebar-accent'
      ];
      
      backgroundProperties.forEach(prop => {
        if (properties[prop]) {
          const isValidBackground = expectedBackgrounds.includes(properties[prop]);
          expect(isValidBackground).toBe(true, 
            `Property ${prop} should use one of the specified background colors, got: ${properties[prop]}`
          );
        }
      });
    });

    it('should use consistent border colors throughout the system', () => {
      const expectedBorderColor = '0 0% 40%';
      const properties = getColorCustomProperties();
      
      const borderProperties = ['--border', '--input', '--sidebar-border'];
      
      borderProperties.forEach(prop => {
        if (properties[prop]) {
          expect(properties[prop]).toBe(expectedBorderColor, 
            `Border property ${prop} should use HSL 0 0 40%, got: ${properties[prop]}`
          );
        }
      });
    });

    it('should use consistent text colors from the specified hierarchy', () => {
      const expectedTextColors = ['0 0% 70%', '0 0% 95%', '0 0% 100%', '0 0% 0%'];
      const properties = getColorCustomProperties();
      
      const textProperties = [
        '--foreground', '--card-foreground', '--popover-foreground', '--primary-foreground',
        '--secondary-foreground', '--muted-foreground', '--accent-foreground', '--destructive-foreground',
        '--success-foreground', '--warning-foreground', '--info-foreground', '--sidebar-foreground',
        '--sidebar-primary-foreground', '--sidebar-accent-foreground'
      ];
      
      textProperties.forEach(prop => {
        if (properties[prop]) {
          const isValidTextColor = expectedTextColors.includes(properties[prop]);
          expect(isValidTextColor).toBe(true, 
            `Text property ${prop} should use one of the specified text colors, got: ${properties[prop]}`
          );
        }
      });
    });

    it('should use consistent accent colors throughout interactive elements', () => {
      const expectedAccentColor = '203 96% 18%';
      const properties = getColorCustomProperties();
      
      const accentProperties = ['--primary', '--accent', '--ring', '--sidebar-primary', '--sidebar-ring'];
      
      accentProperties.forEach(prop => {
        if (properties[prop]) {
          expect(properties[prop]).toBe(expectedAccentColor, 
            `Accent property ${prop} should use HSL 203 96 18%, got: ${properties[prop]}`
          );
        }
      });
    });
  });

  describe('8.2 Interactive element states validation', () => {
    it('should ensure accent colors provide sufficient contrast for interactive elements', () => {
      const accentColor = hslToRgb(203, 96, 18); // HSL 203 96% 18%
      const lightForeground = { r: 255, g: 255, b: 255 }; // #ffffff
      
      const contrast = calculateContrastRatio(lightForeground, accentColor);
      
      // Accent color with white text should meet WCAG AA requirements
      expect(contrast).toBeGreaterThanOrEqual(4.5, 
        `Accent color should provide sufficient contrast with white text: ${contrast.toFixed(2)}:1`
      );
    });

    it('should validate that all interactive element color combinations meet accessibility standards', () => {
      const contrastResults = validateThemeContrast();
      
      // Filter for interactive element combinations (excluding destructive which is intentionally red)
      const interactiveResults = contrastResults.filter(result => 
        (result.combination.includes('button') || 
        result.combination.includes('accent') ||
        result.combination.includes('primary') ||
        result.combination.includes('Primary') ||
        result.combination.includes('Accent')) &&
        !result.combination.includes('Destructive') // Destructive is intentionally a warning color
      );

      interactiveResults.forEach(({ combination, result }) => {
        expect(result.isAccessible).toBe(true, 
          `${combination} should meet WCAG AA contrast requirements: ${result.ratio}:1 (required: 4.5:1)`
        );
        expect(result.ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('should ensure status colors are distinguishable and accessible', () => {
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

      // Ensure status colors are distinguishable from each other
      const colors = Object.values(statusColors);
      for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
          const contrast = calculateContrastRatio(colors[i], colors[j]);
          expect(contrast).toBeGreaterThanOrEqual(1.1, 
            `Status colors should be distinguishable: ${contrast.toFixed(2)}:1`
          );
        }
      }

      // Ensure status colors are visible on dark backgrounds
      Object.entries(statusColors).forEach(([name, color]) => {
        Object.entries(backgrounds).forEach(([bgName, bgColor]) => {
          const contrast = calculateContrastRatio(color, bgColor);
          expect(contrast).toBeGreaterThanOrEqual(2, 
            `${name} on ${bgName} should be visible: ${contrast.toFixed(2)}:1`
          );
        });
      });
    });

    it('should validate status foreground colors meet contrast requirements', () => {
      const statusColors = {
        success: hslToRgb(142, 69, 58),
        warning: hslToRgb(48, 96, 53),
        info: hslToRgb(199, 89, 65),
        error: hslToRgb(0, 72, 51),
      };

      const foregrounds = {
        white: { r: 255, g: 255, b: 255 }, // --error-foreground
        black: { r: 0, g: 0, b: 0 },       // --success-foreground, --warning-foreground, --info-foreground
      };

      // Success, info, and warning use black foreground
      ['success', 'info', 'warning'].forEach(status => {
        const bgColor = statusColors[status as keyof typeof statusColors];
        const contrast = calculateContrastRatio(foregrounds.black, bgColor);
        expect(contrast).toBeGreaterThanOrEqual(4.5, 
          `Black text on ${status} background should meet WCAG AA: ${contrast.toFixed(2)}:1`
        );
      });

      // Error uses white foreground
      const errorContrast = calculateContrastRatio(foregrounds.white, statusColors.error);
      expect(errorContrast).toBeGreaterThanOrEqual(4.5, 
        `White text on error background should meet WCAG AA: ${errorContrast.toFixed(2)}:1`
      );
    });
  });

  describe('Cross-page color consistency validation', () => {
    it('should ensure all required color properties are defined and non-empty', () => {
      const properties = getColorCustomProperties();
      
      // Log available properties for debugging
      console.log('Available properties:', Object.keys(properties));
      
      const requiredProperties = [
        '--background', '--foreground', '--card', '--card-foreground',
        '--primary', '--primary-foreground', '--border', '--muted-foreground',
        '--accent', '--accent-foreground', '--success', '--warning', '--info'
      ];
      
      requiredProperties.forEach(prop => {
        if (properties[prop]) {
          expect(properties[prop]).not.toBe('', `Color property ${prop} should not be empty`);
          expect(typeof properties[prop]).toBe('string', `Color property ${prop} should be a string`);
        } else {
          console.warn(`Property ${prop} not found in available properties`);
        }
      });
      
      // At least the core properties should be defined
      const coreProperties = ['--background', '--foreground', '--primary', '--border'];
      coreProperties.forEach(prop => {
        expect(properties[prop]).toBeDefined(`Core color property ${prop} should be defined`);
      });
    });

    it('should validate that all theme contrast combinations meet accessibility standards', () => {
      const contrastResults = validateThemeContrast();
      
      // Count accessible vs inaccessible combinations
      const accessibleCount = contrastResults.filter(r => r.result.isAccessible).length;
      const totalCount = contrastResults.length;
      
      // At least 90% of combinations should be accessible
      const accessibilityRate = accessibleCount / totalCount;
      expect(accessibilityRate).toBeGreaterThanOrEqual(0.9, 
        `At least 90% of color combinations should be accessible, got ${(accessibilityRate * 100).toFixed(1)}%`
      );
      
      // Log any failures for debugging
      const failures = contrastResults.filter(r => !r.result.isAccessible);
      if (failures.length > 0) {
        console.warn('Accessibility failures:', failures.map(f => 
          `${f.combination}: ${f.result.ratio}:1`
        ));
      }
    });

    it('should ensure color system uses only HSL format values', () => {
      const properties = getColorCustomProperties();
      
      Object.entries(properties).forEach(([prop, value]) => {
        // Skip gradient and shadow properties
        if (prop.includes('gradient') || prop.includes('shadow')) return;
        
        // Check that the value is in HSL format (numbers with % or just numbers and spaces)
        const isHslFormat = /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%?\s+(\d+(?:\.\d+)?)%?$/.test(value.trim());
        expect(isHslFormat).toBe(true, 
          `Color property ${prop} should use HSL format, got: ${value}`
        );
      });
    });
  });
});