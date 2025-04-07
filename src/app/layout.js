import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = {
  title: "CHAOMI Tashkent - Tea Shop",
  description: "CHAOMI Tashkent - Premium Tea Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-floral-pattern bg-repeat">
          {children}
        </div>
      </body>
    </html>
  );
}
