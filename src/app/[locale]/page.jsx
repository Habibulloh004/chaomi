import Link from "next/link";
import Image from "next/image";
import { TRANSLATIONS } from "@/lib/constants";

export default async function Home({ params }) {
  const { locale } = await params;

  return (
    <section className="space-y-6 p-4">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden space-y-5">
        <article className="relative mx-auto aspect-square w-72">
          <Image
            src="/images/logo.png"
            alt="CHAOMI"
            fill
            priority
            className="object-contain"
          />
        </article>
        <article className="bg-chaomi-navy p-6 text-center text-white rounded-lg">
          <h1
            className="mb-2 text-2xl font-bold max-w-2/3 mx-auto"
            dangerouslySetInnerHTML={{
              __html: TRANSLATIONS.welcome[locale] || "CHAOMI",
            }}
          ></h1>
        </article>
        <article className="flex gap-4 justify-between items-center">
          <Link
            href={`/${locale}/categories`}
            className="block rounded-md bg-chaomi-navy w-full py-10 text-center text-lg font-medium text-white shadow-md"
          >
            {TRANSLATIONS.order[locale] || "Order Now"}
          </Link>
          <Link
            href={`/${locale}/spots`}
            className="block rounded-md bg-chaomi-navy w-full py-10 text-center text-lg font-medium text-white shadow-md"
          >
            {TRANSLATIONS.locations[locale] || "Spots"}
          </Link>
        </article>
      </div>
    </section>
  );
}
