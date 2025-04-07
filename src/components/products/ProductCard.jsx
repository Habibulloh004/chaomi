"use client";

import Image from "next/image";
import { parseMultiLanguageText, formatPrice } from "@/lib/utils";
import { parseProductDescription } from "@/lib/api";
import { Button } from "../ui/button";
// Import Dialog components from shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cartStore";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product, locale }) => {
  const { products, add, removeItem, updateQuantity } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!product) return null;

  const { names, descriptions } = parseProductDescription(product);
  const displayDescription =
    descriptions[locale] || descriptions["uz"] || "No description available";

  let price = 0;
  if (product.price && typeof product.price === "object") {
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

  let productName = product.product_name;
  if (product.product_production_description) {
    const { names } = parseProductDescription(product);
    if (names[locale]) {
      productName = names[locale];
    }
  }
  if (productName.includes("***")) {
    productName = parseMultiLanguageText(productName, locale);
  }

  const cartProduct = products.find((p) => p.product_id === product.product_id);
  const quantity = cartProduct ? cartProduct.count : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <article
          className="overflow-hidden mx-auto rounded-lg flex items-center bg-chaomi-navy/90 border-chaomi-cream text-chaomi-cream shadow-md transition-all hover:shadow-lg p-3 relative cursor-pointer"
          onClick={() => setIsOpen(true)}
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
            {product.photo && (
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
            )}
          </div>

          <div className="pl-3 w-[calc(100%-120px)] flex flex-col justify-between h-28">
            <h3 className="my-2 text-sm font-medium line-clamp-2">
              {productName}
            </h3>
            <div className="mt-auto flex items-center justify-between">
              <p className="text-sm font-semibold text-chaomi-red">
                {formatPrice(Number(price) / 100)} {locale == "uz" && "so'm"}
                {locale == "ru" && "сум"}
                {locale == "zh" && "索姆"}
              </p>

              <div className="flex items-center gap-2">
                {quantity === 0 ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dialog from opening when clicking button
                      add(product);
                    }}
                    className="bg-chaomi-red hover:bg-chaomi-red/90 text-white rounded-md text-sm transition-colors"
                  >
                    {locale == "uz" && "Qo'shish"}
                    {locale == "ru" && "Добавлять"}
                    {locale == "zh" && "添加"}
                  </Button>
                ) : (
                  <>
                    <div className="flex items-center bg-chaomi-cream/20 rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(product.product_id, 1);
                        }}
                        className="p-1 hover:bg-chaomi-cream/30 text-chaomi-cream"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {quantity < 10 ? `0${quantity}` : quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(product.product_id, -1);
                        }}
                        className="p-1 hover:bg-chaomi-cream/30 text-chaomi-cream"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(product.product_id);
                      }}
                      className="p-1 text-chaomi-red hover:bg-chaomi-red/20 hover:text-chaomi-red transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </article>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{productName}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
