import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = {
  title: "CHAOMI Tashkent - Tea Shop",
  description: "CHAOMI Tashkent - Premium Tea Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js?56"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-floral-pattern bg-repeat">
          {children}
        </div>
      </body>
    </html>
  );
}
