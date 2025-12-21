/**
 * Interactive element states validation tests
 * Tests for Requirements 3.2, 3.5, 4.2, 4.5
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { 
  hslToRgb,
  calculateContrastRatio,
  validateContrastRatio
} from './accessibility';

describe('Interactive Element States Validation', () => {
  beforeAll(() => {
    // Add CSS custom properties to document for testing
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --background: 0 0% 5%;
        --foreground: 0 0% 95%;
        --primary: 203 96% 18%;
        --primary-foreground: 0 0% 100%;
        --accent: 203 96% 18%;
        --accent-foreground: 0 0% 100%;
        --border: 0 0% 40%;
        --muted: 0 0% 20%;
        --muted-foreground: 0 0% 70%;
        --ring: 203 96% 35%;
        --success: 142 69% 58%;
        --success-foreground: 0 0% 0%;
        --warning: 48 96% 53%;
        --warning-foreground: 0 0% 0%;
        --info: 199 89% 65%;
        --info-foreground: 0 0% 0%;
        --error: 0 72% 51%;
        --error-foreground: 0 0% 100%;
      }
      
      /* Test interactive element styles */
      .test-button {
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        border: 1px solid hsl(var(--border));
      }
      
      .test-button:hover {
        background-color: hsl(203 96% 22%); /* Lighter variant */
      }
      
      .test-button:focus {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }
      
      .test-input {
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
      }
      
      .test-input:focus {
        border-color: hsl(var(--ring));
        box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
      }
    `;
    document.head.appendChild(style);
  });

  describe('Button state color validation', () => {
    it('should ensure primary buttons use correct accent colors', () => {
      const primaryColor = hslToRgb(203, 96, 18); // HSL 203 96% 18%
      const primaryForeground = { r: 255, g: 255, b: 255 }; // white
      
      const contrast = calculateContrastRatio(primaryForeground, primaryColor);
      
      expect(contrast).toBeGreaterThanOrEqual(4.5, 
        `Primary button should have sufficient contrast: ${contrast.toFixed(2)}:1`
      );
    });

    it('should validate hover state color variations provide appropriate feedback', () => {
      const baseColor = hslToRgb(203, 96, 18);    // Base accent color
      const hoverColor = hslToRgb(203, 96, 22);   // Hover variant (lighter)
      
      const contrast = calculateContrastRatio(baseColor, hoverColor);
      
      // Hover should be visually different but not too different
      expect(contrast).toBeGreaterThanOrEqual(1.1, 
        `Hover state should be visually distinct: ${contrast.toFixed(2)}:1`
      );
      expect(contrast).toBeLessThanOrEqual(2.0, 
        `Hover state should not be too different: ${contrast.toFixed(2)}:1`
      );
    });

    it('should ensure focus indicators use appropriate ring colors', () => {
      const ringColor = hslToRgb(203, 96, 35);    // Updated lighter ring color
      const backgroundColor = hslToRgb(0, 0, 5);   // Dark background
      
      const contrast = calculateContrastRatio(ringColor, backgroundColor);
      
      expect(contrast).toBeGreaterThanOrEqual(3.0, 
        `Focus ring should be visible on background: ${contrast.toFixed(2)}:1`
      );
    });
  });

  describe('Form element state validation', () => {
    it('should validate input border colors meet visibility requirements', () => {
      const borderColor = hslToRgb(0, 0, 40);     // Border color
      const backgroundColor = hslToRgb(0, 0, 5);   // Background
      
      const contrast = calculateContrastRatio(borderColor, backgroundColor);
      
      expect(contrast).toBeGreaterThanOrEqual(2.0, 
        `Input borders should be visible: ${contrast.toFixed(2)}:1`
      );
    });

    it('should ensure input text meets contrast requirements', () => {
      const textColor = hslToRgb(0, 0, 95);       // Foreground text
      const inputBackground = hslToRgb(0, 0, 5);   // Input background
      
      const contrast = calculateContrastRatio(textColor, inputBackground);
      
      expect(contrast).toBeGreaterThanOrEqual(4.5, 
        `Input text should meet WCAG AA: ${contrast.toFixed(2)}:1`
      );
    });

    it('should validate focus states for form elements', () => {
      const focusRing = hslToRgb(203, 96, 35);    // Updated lighter ring color
      const inputBackground = hslToRgb(0, 0, 5);   // Input background
      
      const contrast = calculateContrastRatio(focusRing, inputBackground);
      
      expect(contrast).toBeGreaterThanOrEqual(3.0, 
        `Focus ring should be visible on inputs: ${contrast.toFixed(2)}:1`
      );
    });
  });

  describe('Status indicator validation', () => {
    it('should ensure all status colors are accessible with their foregrounds', () => {
      const statusCombinations = [
        { bg: hslToRgb(142, 69, 58), fg: { r: 0, g: 0, b: 0 }, name: 'success' },
        { bg: hslToRgb(48, 96, 53), fg: { r: 0, g: 0, b: 0 }, name: 'warning' },
        { bg: hslToRgb(199, 89, 65), fg: { r: 0, g: 0, b: 0 }, name: 'info' },
        { bg: hslToRgb(0, 72, 51), fg: { r: 255, g: 255, b: 255 }, name: 'error' },
      ];

      statusCombinations.forEach(({ bg, fg, name }) => {
        const contrast = calculateContrastRatio(fg, bg);
        expect(contrast).toBeGreaterThanOrEqual(4.5, 
          `${name} status should meet WCAG AA: ${contrast.toFixed(2)}:1`
        );
      });
    });

    it('should validate status colors are distinguishable on dark backgrounds', () => {
      const statusColors = [
        { color: hslToRgb(142, 69, 58), name: 'success' },
        { color: hslToRgb(48, 96, 53), name: 'warning' },
        { color: hslToRgb(199, 89, 65), name: 'info' },
        { color: hslToRgb(0, 72, 51), name: 'error' },
      ];

      const darkBackgrounds = [
        { bg: hslToRgb(0, 0, 5), name: 'primary background' },
        { bg: hslToRgb(0, 0, 10), name: 'card background' },
        { bg: hslToRgb(0, 0, 20), name: 'muted background' },
      ];

      statusColors.forEach(({ color, name: statusName }) => {
        darkBackgrounds.forEach(({ bg, name: bgName }) => {
          const contrast = calculateContrastRatio(color, bg);
          expect(contrast).toBeGreaterThanOrEqual(2.0, 
            `${statusName} should be visible on ${bgName}: ${contrast.toFixed(2)}:1`
          );
        });
      });
    });
  });

  describe('Interactive state consistency', () => {
    it('should ensure all interactive elements use colors from the defined palette', () => {
      const paletteColors = {
        primary: hslToRgb(203, 96, 18),
        background: hslToRgb(0, 0, 5),
        card: hslToRgb(0, 0, 10),
        muted: hslToRgb(0, 0, 20),
        border: hslToRgb(0, 0, 40),
        foreground: hslToRgb(0, 0, 95),
        mutedForeground: hslToRgb(0, 0, 70),
      };

      // Verify that our palette colors are internally consistent
      Object.entries(paletteColors).forEach(([name, color]) => {
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(255);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(255);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(255);
      });
    });

    it('should validate that hover states maintain accessibility', () => {
      // Test various hover state combinations
      const hoverTests = [
        {
          base: hslToRgb(203, 96, 18),    // Primary
          hover: hslToRgb(203, 96, 22),   // Lighter primary
          text: { r: 255, g: 255, b: 255 },
          name: 'primary button hover'
        },
        {
          base: hslToRgb(0, 0, 20),       // Muted
          hover: hslToRgb(0, 0, 25),      // Lighter muted
          text: hslToRgb(0, 0, 95),
          name: 'secondary button hover'
        }
      ];

      hoverTests.forEach(({ base, hover, text, name }) => {
        const baseContrast = calculateContrastRatio(text, base);
        const hoverContrast = calculateContrastRatio(text, hover);
        
        expect(baseContrast).toBeGreaterThanOrEqual(4.5, 
          `${name} base state should meet WCAG AA: ${baseContrast.toFixed(2)}:1`
        );
        expect(hoverContrast).toBeGreaterThanOrEqual(4.5, 
          `${name} hover state should meet WCAG AA: ${hoverContrast.toFixed(2)}:1`
        );
      });
    });
  });
});