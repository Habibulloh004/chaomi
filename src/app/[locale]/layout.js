import { Suspense } from "react";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export async function generateStaticParams() {
  return [{ locale: "uz" }, { locale: "ru" }, { locale: "zh" }];
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <main className="chaomi-container relative">
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Image
          src={"/images/background.png"}
          alt="background"
          width={100}
          height={100}
          className="fixed top-0 left-0 w-[100vw] h-[100vh] -z-50 object-cover"
        />
        <div className="flex-1 pb-16">{children}</div>
        <Footer locale={locale} />
      </Suspense>
    </main>
  );
}
