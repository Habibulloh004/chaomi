import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { POSTER_IMAGE_BASE_URL } from "./constants";

/**
 * Combines multiple class names with Tailwind CSS utility
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price for display
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: 'sum')
 * @returns {string} Formatted price
 */

export function formatPrice(price) {
  // Agar price raqam yoki string bo‘lsa, uni stringga aylantiramiz
  let priceStr = String(price);

  // Vergul bo‘lsa, uni nuqtaga almashtiramiz (standartlashtirish uchun)
  priceStr = priceStr.replace(',', '.');

  // Raqamni butun va kasr qismlarga ajratamiz
  const [integerPart, decimalPart] = priceStr.split('.');

  // Butun qismga minglik ajratgich (bo‘shliq) qo‘shamiz
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Agar kasr qism bo‘lsa, uni qo‘shib qaytaramiz, aks holda faqat butun qism
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

/**
 * Gets the full image URL from Poster API
 * @param {string} photoPath - Relative path to the image
 * @returns {string} Full image URL
 */
export function getImageUrl(photoPath) {
  if (!photoPath) {
    return "/images/placeholder.png";
  }

  return `${POSTER_IMAGE_BASE_URL}${photoPath}`;
}

/**
 * Parses a string with language-specific content (format: "uz***ru***zh")
 * @param {string} text - Text to parse
 * @param {string} language - Language code to extract
 * @returns {string} Parsed text in the specified language
 */
export function parseMultiLanguageText(text, language = "uz") {
  if (!text) return "";

  // Split by *** and filter out empty parts
  const parts = text
    .split("***")
    .map((part) => part.trim())
    .filter((part) => part);

  // Check if we have valid parts
  if (parts.length >= 1) {
    switch (language) {
      case "uz":
        return parts[0] || ""; // Uzbek
      case "ru":
        return parts[1] || parts[0] || ""; // Russian, fallback to Uzbek
      case "zh":
        return parts[2] || parts[0] || ""; // Chinese, fallback to Uzbek
      default:
        return parts[0] || ""; // Default to Uzbek
    }
  }

  return text; // Return original text if parsing fails
}

export function capitalizeMultiLanguageText(text, language = "uz") {
  const parsedText = parseMultiLanguageText(text, language);
  if (!parsedText) return "";
  return parsedText.slice(0, 1).toUpperCase() + parsedText.slice(1).toLowerCase();
}

/**
 * Generate a unique order ID
 * @returns {string} Unique order ID
 */
export function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

/**
 * Format a date for display
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return "";

  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get translation based on current language
 * @param {Object} translations - Object with translations for each language
 * @param {string} language - Current language code
 * @returns {string} Translated text
 */
export function getTranslation(translations, language = "uz") {
  if (!translations) return "";

  return translations[language] || translations.uz || "";
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
  if (typeof window === "undefined") return false;

  return window.innerWidth <= 768;
}
