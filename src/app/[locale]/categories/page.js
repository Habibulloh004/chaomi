import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api";
import {
  capitalizeMultiLanguageText,
  parseMultiLanguageText,
} from "@/lib/utils";
import { TRANSLATIONS } from "@/lib/constants";
import { CornerDownRight } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function CategoriesPage({ params }) {
  const { locale } = await params;
  const categories = await getCategories();

  // Filter out hidden categories and parent-level categories
  const visibleCategories = categories.filter(
    (cat) => cat.category_hidden === "0"
  );

  return (
    <div className="p-4 space-y-6">
      <div className="bg-chaomi-navy/90 border-chaomi-cream text-chaomi-cream rounded-md">
        <p className="py-4 text-2xl text-center">
          {TRANSLATIONS.categories[locale]}
        </p>
      </div>
      <div className="grid gap-4">
        {visibleCategories.map((category) => (
          <Link
            key={category.category_id}
            href={`/${locale}/products/${category.category_id}`}
            className="overflow-hidden rounded-lg flex items-center bg-chaomi-navy/90 border-chaomi-cream text-chaomi-cream shadow-md transition-all hover:shadow-lg p-3 relative"
          >
            <div className="relative aspect-square w-28">
              {category.category_photo == "" && (
                <Image
                  src={`https://static-00.iconduck.com/assets.00/no-image-icon-2048x2048-2t5cx953.png`}
                  alt={"no-image"}
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 28vw, 112px"
                  className="object-cover w-full aspect-square rounded-lg"
                />
              )}
              {category.category_photo && (
                <Image
                  src={`https://joinposter.com${
                    category.category_photo_origin || category.category_photo
                  }`}
                  alt={parseMultiLanguageText(category.category_name, locale)}
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 28vw, 112px"
                  className="object-cover w-full aspect-square rounded-lg"
                />
              )}
            </div>
            <div className="p-3 w-[calc(100%-120px)]">
              <h3 className="text-xl font-medium">
                {capitalizeMultiLanguageText(
                  parseMultiLanguageText(category.category_name, locale),
                  locale
                )}
              </h3>
            </div>
            <CornerDownRight className="absolute bottom-3 right-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
