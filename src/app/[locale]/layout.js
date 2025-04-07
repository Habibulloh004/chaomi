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
        <div className="fixed top-0 left-0 inset-0 w-full h-screen -z-50">
          <Image
            src={"/images/background.png"}
            alt={"img"}
            layout="fill"
            objectFit="cover"
            objectPosition="bottom"
            priority
            quality={100}
            loading="eager"
            className="-z-50"
          />
        </div>
        <div className="flex-1 pb-16">{children}</div>
        <Footer locale={locale} />
      </Suspense>
    </main>
  );
}
