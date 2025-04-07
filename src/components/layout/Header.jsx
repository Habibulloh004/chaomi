"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LanguageSelector from "./LanguageSelector";
import { useCartStore } from "@/store/cartStore";
import { useLanguageStore } from "@/store/languageStore";
import { TRANSLATIONS } from "@/lib/constants";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const Header = ({ locale }) => {
  const pathname = usePathname();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { language } = useLanguageStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <Link href={`/${locale}`} className="flex items-center">
          <div className="relative h-10 w-10">
            <Image
              src="/images/logo.png"
              alt="CHAOMI"
              fill
              // sizes="40px"
              className="object-contain"
            />
          </div>
          <span className="ml-2 text-lg font-semibold text-chaomi-red">
            CHAOMI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSelector locale={locale} />

          <Link href={`/${locale}/cart`} className="relative">
            <ShoppingBag className="h-6 w-6 text-chaomi-navy" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-chaomi-red text-xs text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Title bar for subpages */}
      {pathname !== `/${locale}` && (
        <div className="bg-chaomi-navy p-3 text-center text-white">
          <h1 className="text-lg font-medium">
            {renderPageTitle(pathname, locale, language)}
          </h1>
        </div>
      )}
    </header>
  );
};

// Helper function to render the page title based on the current path
const renderPageTitle = (pathname, locale, language) => {
  const path = pathname.replace(`/${locale}`, "");

  if (path.startsWith("/categories")) {
    return TRANSLATIONS.categories[language];
  } else if (path.startsWith("/products")) {
    return TRANSLATIONS.categories[language];
  } else if (path.startsWith("/product")) {
    return "Product Detail";
  } else if (path === "/cart") {
    return TRANSLATIONS.cart[language];
  } else if (path === "/takeaway") {
    return TRANSLATIONS.order[language];
  } else if (path === "/spots") {
    return TRANSLATIONS.locations[language];
  } else if (path === "/profile") {
    return TRANSLATIONS.profile[language];
  }

  return "";
};

export default Header;
