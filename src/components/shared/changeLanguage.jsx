"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { setCookie } from "cookies-next";
import { ChevronDown } from "lucide-react";

const LanguageSwitcher = ({ currentLocale }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const supportedLanguages = [
    { code: "uz", name: "O'zbek" },
    { code: "ru", name: "Русский" },
    { code: "zh", name: "中文" },
  ];

  // Debug the isOpen state (fixed from 'open' to 'isOpen')

  const changeLanguage = (locale) => {
    // Set cookie to remember language preference
    setCookie("chaomi-language", locale, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Construct new URL with the selected language
    const segments = pathname.split("/");
    segments[1] = locale; // Replace the locale segment
    const newPath = segments.join("/");

    // Close dropdown
    setIsOpen(false);

    // Navigate to new path
    router.push(newPath);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if the click is outside the component
      if (!event.target.closest(".language-switcher")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Get current language name
  const currentLanguage =
    supportedLanguages.find((lang) => lang.code === currentLocale) ||
    supportedLanguages[0];

  return (
    <div className="relative inline-block text-left language-switcher">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1 cursor-pointer p-2 text-chaomi-cream rounded-md bg-chaomi-navy/80 hover:bg-chaomi-navy transition-colors"
      >
        <span>{currentLanguage.name}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {supportedLanguages
              .filter((lang) => lang.code !== currentLocale)
              .map((language) => (
                <div
                  key={language.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLanguage(language.code);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                >
                  {language.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
