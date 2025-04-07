import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { parseMultiLanguageText } from "@/lib/utils";

export const revalidate = 1800; // Revalidate every 30 minutes

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    categoryId: category.category_id,
  }));
}

export async function generateMetadata({ params }) {
  const { categoryId, locale } = await params;
  const categories = await getCategories();
  const category = categories.find((cat) => cat.category_id === categoryId);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const categoryName = parseMultiLanguageText(category.category_name, locale);

  return {
    title: `${categoryName} | CHAOMI`,
    description: `Browse our selection of ${categoryName} at CHAOMI Tashkent`,
  };
}

export default async function ProductsPage({ params }) {
  const { categoryId, locale } = await params;

  // Get category information
  const categories = await getCategories();
  const category = categories.find((cat) => cat.category_id === categoryId);

  if (!category) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-gray-500">Category not found</p>
      </div>
    );
  }

  // Get products for this category
  const allProducts = await getProducts(categoryId);
  const products = allProducts.filter(
    (product) =>
      product.menu_category_id === categoryId && product.hidden === "0"
  );

  if (products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-chaomi-navy/90 my-4 w-11/12 mx-auto border-chaomi-cream text-chaomi-cream rounded-md">
          <p className="p-4 text-2xl text-center">
            {parseMultiLanguageText(category.category_name, locale)}
          </p>
        </div>
        <p className="text-gray-500">
          {locale === "uz" && "Bu kategoriyada mahsulotlar topilmadi"}
          {locale === "ru" && "В этой категории нет товаров"}
          {locale === "zh" && "此类别中没有找到产品"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-chaomi-navy/90 border-chaomi-cream text-chaomi-cream rounded-md">
        <p className="p-4 text-2xl text-center">
          {parseMultiLanguageText(category.category_name, locale)}
        </p>
      </div>

      <div className="space-y-4">
        {products?.map((product) => (
          <ProductCard
            allProducts={allProducts}
            key={product.product_id}
            product={product}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
