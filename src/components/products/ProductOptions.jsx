"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PRODUCT_SIZES,
  TEMPERATURE_OPTIONS,
  SUGAR_LEVELS,
  TRANSLATIONS,
} from "@/lib/constants";
import { parseProductDescription } from "@/lib/api";
import {
  formatPrice,
  parseMultiLanguageText,
  getTranslation,
} from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingBag } from "lucide-react";

const ProductOptions = ({ product, price, locale }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Product options state
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedTemperature, setSelectedTemperature] = useState("cold");
  const [selectedSugar, setSelectedSugar] = useState(100);
  const [quantity, setQuantity] = useState(1);

  // Extract multilingual data
  const { names } = parseProductDescription(product);

  // Get product name in the current language
  let productName = product.product_name;

  if (names[locale]) {
    productName = names[locale];
  } else if (productName.includes("***")) {
    productName = parseMultiLanguageText(productName, locale);
  }

  // Calculate price with selected options
  const calculatePrice = () => {
    let basePrice = price;

    // Adjust price based on size
    if (selectedSize === "S") {
      basePrice = basePrice * 0.85;
    } else if (selectedSize === "L") {
      basePrice = basePrice * 1.15;
    }

    return basePrice;
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Add to cart handler
  const handleAddToCart = () => {
    const finalPrice = calculatePrice();

    // Prepare the product with options
    const productWithPrice = {
      ...product,
      price: finalPrice,
    };

    // Create options object
    const options = {
      size: selectedSize,
      temperature: selectedTemperature,
      sugar: selectedSugar,
    };

    addItem(productWithPrice, quantity, options);

    // Show a confirmation message or navigate
    router.push(`/${locale}/cart`);
  };

  // Buy now handler
  const handleBuyNow = () => {
    handleAddToCart();
    router.push(`/${locale}/cart`);
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Size Selection */}
      <div className="space-y-2">
        <h3 className="font-medium">
          {getTranslation(TRANSLATIONS.size, locale)}
        </h3>
        <div className="flex space-x-3">
          {Object.values(PRODUCT_SIZES).map((size) => (
            <button
              key={size.value}
              onClick={() => setSelectedSize(size.value)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                selectedSize === size.value
                  ? "border-chaomi-red bg-chaomi-red text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Selection */}
      <div className="space-y-2">
        <h3 className="font-medium">
          {getTranslation(TRANSLATIONS.temperature, locale)}
        </h3>
        <div className="flex space-x-3">
          {Object.values(TEMPERATURE_OPTIONS).map((temp) => (
            <button
              key={temp.value}
              onClick={() => setSelectedTemperature(temp.value)}
              className={`flex-1 rounded-md py-2 ${
                selectedTemperature === temp.value
                  ? "bg-chaomi-navy text-white"
                  : "border border-gray-300 bg-white"
              }`}
            >
              {getTranslation(temp.labels, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Sugar Level Selection */}
      <div className="space-y-2">
        <h3 className="font-medium">
          {getTranslation(TRANSLATIONS.sugar, locale)}
        </h3>
        <div className="flex justify-between space-x-2">
          {SUGAR_LEVELS.map((sugar) => (
            <button
              key={sugar.value}
              onClick={() => setSelectedSugar(sugar.value)}
              className={`flex-1 rounded-md py-2 text-sm ${
                selectedSugar === sugar.value
                  ? "bg-chaomi-navy text-white"
                  : "border border-gray-300 bg-white"
              }`}
            >
              {sugar.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {locale === "uz"
            ? "Miqdori"
            : locale === "ru"
            ? "Количество"
            : "数量"}
        </h3>
        <div className="flex items-center">
          <button
            onClick={decreaseQuantity}
            className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-100"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-10 items-center justify-center border-y border-gray-300 bg-white">
            {quantity}
          </div>
          <button
            onClick={increaseQuantity}
            className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {getTranslation(TRANSLATIONS.total, locale)}
        </h3>
        <div className="text-xl font-bold text-chaomi-red">
          {formatPrice(calculatePrice() * quantity)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex space-x-2 bg-white p-4 shadow-lg">
        <Button
          variant="outline"
          className="flex-1 border-chaomi-navy text-chaomi-navy"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {getTranslation(TRANSLATIONS.addToCart, locale)}
        </Button>

        <Button variant="chaomiRed" className="flex-1" onClick={handleBuyNow}>
          {getTranslation(TRANSLATIONS.buyNow, locale)}
        </Button>
      </div>
    </div>
  );
};

export default ProductOptions;
