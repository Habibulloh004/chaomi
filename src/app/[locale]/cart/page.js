"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useLanguageStore } from "@/store/languageStore";
import { TRANSLATIONS, DELIVERY_OPTIONS } from "@/lib/constants";
import {
  formatPrice,
  getTranslation,
  parseMultiLanguageText,
} from "@/lib/utils";
import { parseProductDescription } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CartPage({ params }) {
  const { locale } = use(params);
  const router = useRouter();
  const { language } = useLanguageStore();

  // Cart state
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTotal,
    deliveryMethod,
    setDeliveryMethod,
    deliveryFee,
  } = useCartStore();

  // If cart is empty, show message
  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-lg font-medium text-gray-600">
          {language === "uz" && "Savatingiz bo'sh"}
          {language === "ru" && "Ваша корзина пуста"}
          {language === "zh" && "您的购物车是空的"}
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          {language === "uz" && "Marhamat, biror nima tanlang"}
          {language === "ru" && "Пожалуйста, выберите что-нибудь"}
          {language === "zh" && "请选择一些产品"}
        </p>
        <Link href={`/${locale}/categories`}>
          <Button variant="chaomi">
            {language === "uz" && "Mahsulotlarni ko'rish"}
            {language === "ru" && "Посмотреть товары"}
            {language === "zh" && "浏览产品"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Cart Items */}
      <div className="space-y-4 p-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            locale={locale}
            onRemove={() => removeItem(item.id)}
            onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
          />
        ))}
      </div>

      {/* Delivery Options */}
      <div className="border-t border-b border-gray-200 bg-gray-50 p-4">
        <h2 className="mb-3 font-medium">
          {language === "uz" && "Yetkazib berish usuli"}
          {language === "ru" && "Способ доставки"}
          {language === "zh" && "配送方式"}
        </h2>

        <Tabs
          defaultValue={deliveryMethod}
          onValueChange={setDeliveryMethod}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="delivery">
              {getTranslation(DELIVERY_OPTIONS.DELIVERY.labels, language)}
            </TabsTrigger>
            <TabsTrigger value="pickup">
              {getTranslation(DELIVERY_OPTIONS.PICKUP.labels, language)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="delivery" className="mt-4">
            <p className="text-sm text-gray-600">
              {language === "uz" && "Yetkazib berish narxi:"}
              {language === "ru" && "Стоимость доставки:"}
              {language === "zh" && "配送费用:"} {formatPrice(deliveryFee)}
            </p>
          </TabsContent>

          <TabsContent value="pickup" className="mt-4">
            <Link href={`/${locale}/spots`}>
              <Button variant="outline" className="w-full">
                {language === "uz" && "Chayhonani tanlash"}
                {language === "ru" && "Выбрать чайхану"}
                {language === "zh" && "选择茶馆"}
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Summary */}
      <div className="p-4">
        <h2 className="mb-4 font-medium">
          {language === "uz" && "Buyurtma tafsilotlari"}
          {language === "ru" && "Детали заказа"}
          {language === "zh" && "订单详情"}
        </h2>

        <div className="space-y-2 border-b border-gray-200 pb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">
              {language === "uz" && "Oraliq jami"}
              {language === "ru" && "Промежуточный итог"}
              {language === "zh" && "小计"}
            </span>
            <span>{formatPrice(getSubtotal())}</span>
          </div>

          {deliveryMethod === "delivery" && (
            <div className="flex justify-between">
              <span className="text-gray-600">
                {getTranslation(TRANSLATIONS.deliveryFee, language)}
              </span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <span className="font-medium">
            {getTranslation(TRANSLATIONS.total, language)}
          </span>
          <span className="text-lg font-bold text-chaomi-red">
            {formatPrice(getTotal())}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 flex bg-white p-4 shadow-lg">
        <Button
          variant="chaomiRed"
          className="w-full"
          onClick={() => {
            if (
              deliveryMethod === "pickup" &&
              !useCartStore.getState().selectedSpot
            ) {
              router.push(`/${locale}/spots`);
            } else {
              router.push(`/${locale}/takeaway`);
            }
          }}
        >
          {getTranslation(TRANSLATIONS.checkout, language)}
        </Button>
      </div>
    </div>
  );
}

// Cart Item Component
const CartItem = ({ item, locale, onRemove, onUpdateQuantity }) => {
  const { language } = useLanguageStore();
  const { product, quantity, options } = item;

  // Get product name in current language
  let productName = product.product_name;
  const { names } = parseProductDescription(product);

  if (names[language]) {
    productName = names[language];
  } else if (productName.includes("***")) {
    productName = parseMultiLanguageText(productName, language);
  }

  // Format options for display
  const formatOptionLabel = (option, value) => {
    switch (option) {
      case "size":
        return value;
      case "temperature":
        return value === "hot"
          ? getTranslation(TRANSLATIONS.temperature.hot, language)
          : getTranslation(TRANSLATIONS.temperature.cold, language);
      case "sugar":
        return `${value}%`;
      default:
        return value;
    }
  };

  return (
    <div className="flex rounded-lg border border-gray-200 bg-white p-3">
      {/* Product Image */}
      <div className="relative h-20 w-20 overflow-hidden rounded-md">
        {product.photo ? (
          <Image
            src={`https://joinposter.com${product.photo}`}
            alt={productName}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="ml-3 flex-1">
        <h3 className="font-medium">{productName}</h3>

        {/* Options */}
        <div className="mt-1 text-xs text-gray-500">
          {options &&
            Object.entries(options).map(([key, value]) => (
              <span key={key} className="mr-2">
                {formatOptionLabel(key, value)}
              </span>
            ))}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-chaomi-red">
            {formatPrice(item.price)}
          </div>

          <div className="flex items-center">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-l-md border border-gray-300 bg-gray-100"
            >
              <Minus className="h-3 w-3" />
            </button>
            <div className="flex h-6 w-8 items-center justify-center border-y border-gray-300 bg-white text-sm">
              {quantity}
            </div>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-r-md border border-gray-300 bg-gray-100"
            >
              <Plus className="h-3 w-3" />
            </button>

            <button
              onClick={onRemove}
              className="ml-3 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
