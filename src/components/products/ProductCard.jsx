"use client";

import Link from "next/link";
import Image from "next/image";
import { parseMultiLanguageText, formatPrice } from "@/lib/utils";
import { parseProductDescription } from "@/lib/api";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cartStore";

const ProductCard = ({ product, locale }) => {
  const { products, add, removeItem, updateQuantity } = useCartStore();
  if (!product) return null;

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

  // Get multilingual product name
  let productName = product.product_name;

  // Check if we have a language-specific name in the description
  if (product.product_production_description) {
    const { names } = parseProductDescription(product);
    if (names[locale]) {
      productName = names[locale];
    }
  }

  // If name still has language separators, parse them
  if (productName.includes("***")) {
    productName = parseMultiLanguageText(productName, locale);
  }


  return (
    <article
      // href={`/${locale}/product/${product.product_id}`}
      className="overflow-hidden rounded-lg flex items-center bg-chaomi-navy/90 border-chaomi-cream text-chaomi-cream shadow-md transition-all hover:shadow-lg p-3 relative"
    >
      <div className="relative aspect-square w-28">
        {product.photo == "" && (
          <Image
            src={`https://static-00.iconduck.com/assets.00/no-image-icon-2048x2048-2t5cx953.png`}
            alt={"no-image"}
            fill
            quality={100}
            sizes="(max-width: 768px) 28vw, 112px"
            className="object-cover w-full aspect-square rounded-lg"
          />
        )}
        {product.photo ? (
          <Image
            src={`https://joinposter.com${
              product.photo_origin || product.photo
            }`}
            alt={productName}
            fill
            quality={100}
            sizes="(max-width: 768px) 28vw, 112px"
            className="object-cover w-full aspect-square rounded-lg"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="p-3 w-[calc(100%-120px)]">
        <h3 className="mb-2 text-sm font-medium line-clamp-2">
          {product.product_name}
        </h3>
        <h3 className="mb-2 text-sm font-medium line-clamp-2">{productName}</h3>

        <div className="mt-auto text-sm font-semibold text-chaomi-red">
          <p>
            {formatPrice(Number(price) / 100)} {locale == "uz" && "so'm"}
            {locale == "ru" && "сум"}
            {locale == "zh" && "索姆"}
          </p>
          {/* {!findProduct ? (
            <div className="flex justify-end items-center gap-2">
              <button
                aria-label={`shcard plus`}
                disabled={paymentData && paymentData.payment_id}
                onClick={handleAddProduct}
                className="rounded-md px-3 py-[10px] bg-primary active:bg-primary-modal text-white text-xs"
              >
                {all("add")}
              </button>
            </div>
          ) : (
            <div className="flex justify-end items-center gap-2">
              <div className="max-sm:w-full flex justify-around sm:justify-center items-center gap-1 bg-primary rounded-md">
                <button
                  aria-label={`shcard plus2`}
                  disabled={paymentData && paymentData.payment_id}
                  onClick={handleIncrementCount}
                  className="max-sm:w-full rounded-l-md p-2 bg-primary active:bg-gradient-to-r active:from-white/20 active:to-primary"
                >
                  <Plus
                    className="text-white max-md:w-4 max-md:h-4 w-5 h-5"
                    size={18}
                  />
                </button>
                <span className="font-bold text-[12px] md:textSmall4 text-white min-w-6 text-center">
                  {findProduct.count >= 10
                    ? findProduct.count
                    : `0${findProduct.count}`}
                </span>
                <button
                  aria-label={`shcard minus`}
                  disabled={paymentData && paymentData.payment_id}
                  onClick={handleDecrementCount}
                  className="max-sm:flex justify-center items-center max-sm:w-full rounded-r-md p-2 bg-primary active:bg-gradient-to-l active:from-white/20 active:to-primary"
                >
                  <Minus className="text-white max-md:w-4 max-md:h-4 w-5 h-5" />
                </button>
              </div>
            </div>
          )} */}
          <Button
            
            onClick={() => {
              add(product.product_id);
            }}
          >
            add
          </Button>
          <button
            onClick={() => {
              removeItem(product.product_id);
            }}
          >
            remove
          </button>
          <button
            onClick={() => {
              updateQuantity(product.product_id);
            }}
          >
            minus
          </button>
        </div>
      </div>

      {/* <CornerDownRight className="absolute bottom-3 right-3" /> */}
    </article>
  );
};

export default ProductCard;
