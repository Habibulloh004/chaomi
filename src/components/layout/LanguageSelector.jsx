"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES } from "@/lib/constants";
import { useLanguageStore } from "@/store/languageStore";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSelector = ({ locale }) => {
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();

  // Initialize language from URL on first load
  useEffect(() => {
    if (locale && LANGUAGES.some((lang) => lang.id === locale)) {
      setLanguage(locale);
    }
  }, [locale, setLanguage]);

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);

    // Redirect to the same page with the new language prefix
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.substring(
      currentPath.indexOf("/", 1) || currentPath.length
    );
    const newPath = `/${newLanguage}${pathWithoutLocale}`;

    router.push(newPath);
  };

  // Find current language object
  const currentLanguage =
    LANGUAGES.find((lang) => lang.id === language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 rounded-md border border-chaomi-navy/20 px-2 py-1.5 text-sm">
        <Globe className="h-4 w-4 text-chaomi-navy" />
        <span>{currentLanguage.flag}</span>
        <ChevronDown className="h-4 w-4 text-chaomi-navy" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleLanguageChange(lang.id)}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
