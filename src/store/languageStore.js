import { create } from "zustand";
import { persist } from "zustand/middleware";

// Language store for managing the application's language
export const useLanguageStore = create(
  persist(
    (set) => ({
      language: "uz", // Default language is Uzbek
      supportedLanguages: ["uz", "ru", "zh"], // Supported languages: Uzbek, Russian, Chinese

      // Function to change the language
      setLanguage: (lang) => {
        if (["uz", "ru", "zh"].includes(lang)) {
          set({ language: lang });
        }
      },

      // Function to get localized text based on the current language
      getText: (text) => {
        if (!text) return "";

        // Parse the text if it's in the format "Uzbek***Russian***Chinese"
        const parts = text.split("***");
        const currentLang = useLanguageStore.getState().language;

        if (parts.length === 3) {
          switch (currentLang) {
            case "uz":
              return parts[0];
            case "ru":
              return parts[1];
            case "zh":
              return parts[2];
            default:
              return parts[0];
          }
        }

        // If the text doesn't have language variants, return it as is
        return text;
      },

      // Get alternative language name for display
      getLanguageName: (lang) => {
        switch (lang) {
          case "uz":
            return "O'zbekcha";
          case "ru":
            return "Русский";
          case "zh":
            return "中文";
          default:
            return "O'zbekcha";
        }
      },
    }),
    {
      name: "chaomi-language", // Name for localStorage
    }
  )
);
