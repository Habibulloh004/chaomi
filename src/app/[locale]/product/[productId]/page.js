import Image from "next/image";
import {
  getProducts,
  getProductById,
  parseProductDescription,
} from "@/lib/api";
import { parseMultiLanguageText, formatPrice } from "@/lib/utils";
import ProductOptions from "@/components/products/ProductOptions";

export const revalidate = 1800; // Revalidate every 30 minutes

export async function generateStaticParams() {
  const products = await getProducts();

  // Generate only for a subset of products to avoid too many pages
  return products.slice(0, 10).map((product) => ({
    productId: product.product_id,
  }));
}

export async function generateMetadata({ params }) {
  const { productId, locale } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  // Get product name
  let productName = product.product_name;
  const { names } = parseProductDescription(product);
  if (names[locale]) {
    productName = names[locale];
  } else if (productName.includes("***")) {
    productName = parseMultiLanguageText(productName, locale);
  }

  return {
    title: `${productName} | CHAOMI`,
    description: `Order ${productName} at CHAOMI Tashkent`,
  };
}

export default async function ProductPage({ params }) {
  const { productId, locale } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-gray-500">Product not found</p>
      </div>
    );
  }

  // Extract multilingual data
  const { names, descriptions } = parseProductDescription(product);

  // Get product name and description in the current language
  let productName = product.product_name;
  let productDescription = "";

  if (names[locale]) {
    productName = names[locale];
  } else if (productName.includes("***")) {
    productName = parseMultiLanguageText(productName, locale);
  }

  if (descriptions[locale]) {
    productDescription = descriptions[locale];
  }

  // Determine price - Poster API can store prices differently
  let price = 0;
  if (product.price && typeof product.price === "object") {
    // If price is an object, find the first non-zero price
    const priceValues = Object.values(product.price);
    for (const val of priceValues) {
      if (val && val > 0) {
        price = val;
        break;
      }
    }
  } else if (product.price) {
    price = product.price;
  }

  return (
    <div className="pb-24">
      {/* Product Image */}
      <div className="relative h-64 w-full">
        {product.photo ? (
          <Image
            src={`https://joinposter.com${product.photo}`}
            alt={productName}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h1 className="text-xl font-bold">{productName}</h1>

        <div className="mt-2 text-xl font-semibold text-chaomi-red">
          {formatPrice(price)}
        </div>

        {productDescription && (
          <div className="mt-4 text-sm text-gray-600">
            <p>{productDescription}</p>
          </div>
        )}

        {/* Product Options Component */}
        <ProductOptions product={product} price={price} locale={locale} />
      </div>
    </div>
  );
}
