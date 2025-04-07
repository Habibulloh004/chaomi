"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Grid, ShoppingBag, User, CornerUpLeft } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";

const Footer = ({ locale }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "home",
      href: `/${locale}`,
      icon: CornerUpLeft,
      label: TRANSLATIONS.foo_welcome[locale],
    },
    {
      name: "categories",
      href: `/${locale}/categories`,
      icon: Grid,
      label: TRANSLATIONS.categories[locale],
    },
    {
      name: "cart",
      href: `/${locale}/cart`,
      icon: ShoppingBag,
      label: TRANSLATIONS.cart[locale],
    },
    {
      name: "profile",
      href: `/${locale}/profile`,
      icon: User,
      label: TRANSLATIONS.profile[locale],
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-primary/80">
      <nav className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.name === "home"
              ? pathname === `/${locale}`
              : pathname.startsWith(`/${locale}/${item.name}`);

          return item.name === "home" ? (
            <button
              key={item.name} // Use item.name as a unique key
              onClick={() => router.back()}
              type="button"
              className={`flex flex-col items-center w-2/8 justify-center space-y-1 p-2 ${
                isActive && item.name !== "home"
                  ? "text-chaomi-red"
                  : "text-chaomi-cream"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] text-center">{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.name} // Use item.name as a unique key
              href={item.href}
              className={`flex flex-col items-center w-2/8 justify-center space-y-1 p-2 ${
                isActive && item.name !== "home"
                  ? "text-chaomi-red"
                  : "text-chaomi-cream"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;