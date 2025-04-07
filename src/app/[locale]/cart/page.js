"use client";

import { useCallback, memo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
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

// Memoized CartItem component
const CartItem = memo(({ item, onRemove, locale }) => {
  const { updateQuantity } = useCartStore();

  const getProductName = useCallback(() => {
    let name = item?.product_name;
    const { names } = parseProductDescription(item);
    return (
      names[locale] ||
      (name.includes("***") ? parseMultiLanguageText(name, locale) : name)
    );
  }, [item, locale]);

  return (
    <div className="flex rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        {item?.photo ? (
          <Image
            src={`https://joinposter.com${item.photo}`}
            alt={getProductName()}
            fill
            sizes="80px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="ml-3 flex-1 flex flex-col justify-between">
        <h3 className="font-medium text-sm line-clamp-2">{getProductName()}</h3>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-chaomi-red">
            {formatPrice(item.price["1"] / 100)}
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-md border border-gray-300 bg-gray-50">
              <button
                onClick={() => updateQuantity(item.product_id, 1)}
                disabled={item.quantity <= 0}
                className="p-1.5 disabled:opacity-50 hover:bg-gray-200 rounded-l-md transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium bg-white py-1">
                {item.count}
              </span>
              <button
                onClick={() => updateQuantity(item.product_id, -1)}
                className="p-1.5 hover:bg-gray-200 rounded-r-md transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button
              onClick={onRemove}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = "CartItem";

export default function CartPage({ params }) {
  const { locale } = use(params);
  const router = useRouter();
  const {
    products,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    deliveryMethod,
    setDeliveryMethod,
    deliveryFee,
  } = useCartStore();

  const handleCheckout = useCallback(() => {
    const selectedSpot = useCartStore.getState().selectedSpot;
    const redirectPath =
      deliveryMethod === "pickup" && !selectedSpot
        ? `/${locale}/spots`
        : `/${locale}/takeaway`;
    router.push(redirectPath);
  }, [deliveryMethod, locale, router]);

  if (products?.length == 0) {
    return (
      <main className="p-4">
        <div className="bg-chaomi-navy/90 mb-4 mx-auto border-chaomi-cream text-chaomi-cream rounded-md">
          <p className="p-4 text-2xl text-center">
            {TRANSLATIONS.cart[locale]}
          </p>
        </div>
        <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-gray-400" />
          <h2 className="mb-2 text-lg font-medium text-gray-600">
            {locale === "uz" && "Savatingiz bo'sh"}
            {locale === "ru" && "Ваша корзина пуста"}
            {locale === "zh" && "您的购物车是空的"}
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            {locale === "uz" && "Marhamat, biror nima tanlang"}
            {locale === "ru" && "Пожалуйста, выберите что-нибудь"}
            {locale === "zh" && "请选择一些产品"}
          </p>
          <Link href={`/${locale}/categories`}>
            <Button variant="chaomi">
              {locale === "uz" && "Mahsulotlarni ko'rish"}
              {locale === "ru" && "Посмотреть товары"}
              {locale === "zh" && "浏览产品"}
            </Button>
          </Link>
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen p-4">
      <div className="bg-chaomi-navy/90 mb-4 border-chaomi-cream text-chaomi-cream rounded-md">
        <p className="p-4 text-2xl text-center">{TRANSLATIONS.cart[locale]}</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Cart Items */}

        {/* Delivery Options */}
        <section className="border-t border-b border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-medium text-lg">
            {getTranslation(TRANSLATIONS.deliveryMethod, locale)}
          </h2>
          <Tabs
            value={deliveryMethod}
            onValueChange={setDeliveryMethod}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="delivery">
                {getTranslation(DELIVERY_OPTIONS.DELIVERY.labels, locale)}
              </TabsTrigger>
              <TabsTrigger value="pickup">
                {getTranslation(DELIVERY_OPTIONS.PICKUP.labels, locale)}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="delivery">
              <p className="text-sm text-gray-600">
                {getTranslation(TRANSLATIONS.deliveryFee, locale)}:{" "}
                {formatPrice(deliveryFee)}
              </p>
            </TabsContent>
            <TabsContent value="pickup">
              <Link href={`/${locale}/spots`}>
                <Button variant="outline" className="w-full">
                  {getTranslation(TRANSLATIONS.selectSpot, locale)}
                </Button>
              </Link>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4 p-4">
          {products?.map((item) => (
            <CartItem
              key={item.product_id}
              item={item}
              locale={locale}
              onRemove={() => removeItem(item.product_id)}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </section>

        {/* Order Summary */}
        <section className="p-4 bg-white shadow-sm rounded-lg">
          <h2 className="mb-4 font-medium text-lg">
            {getTranslation(TRANSLATIONS.orderDetails, locale)}
          </h2>
          <div className="space-y-3 border-b border-gray-200 pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {getTranslation(TRANSLATIONS.subtotal, locale)}
              </span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            {deliveryMethod === "delivery" && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {getTranslation(TRANSLATIONS.deliveryFee, locale)}
                </span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-medium">
              {getTranslation(TRANSLATIONS.total, locale)}
            </span>
            <span className="text-lg font-bold text-chaomi-red">
              {formatPrice(getTotal())}
            </span>
          </div>
        </section>

        {/* Checkout Button */}
        <div className="bottom-20 bg-white p-4 shadow-lg border-t max-w-3xl mx-auto">
          <Button
            variant="chaomiRed"
            className="w-full py-3"
            onClick={handleCheckout}
          >
            {getTranslation(TRANSLATIONS.checkout, locale)}
          </Button>
        </div>
      </div>
    </div>
  );
}
