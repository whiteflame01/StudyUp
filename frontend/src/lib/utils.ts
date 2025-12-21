import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { validateCSSPropertyContrast, type ContrastResult } from "./accessibility";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validate contrast ratio for common text-background combinations
 * Returns null if validation cannot be performed
 */
export function validateContrast(
  foregroundProperty: string,
  backgroundProperty: string,
  isLargeText: boolean = false
): ContrastResult | null {
  return validateCSSPropertyContrast(foregroundProperty, backgroundProperty, isLargeText);
}