"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, formatDate, generateOrderId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Truck } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";
export default function TakeawayPage({ params }) {
  const { locale } = use(params);
  const [telegram, setTelegram] = useState(null);
  const router = useRouter();
  const {
    products,
    deliveryMethod,
    selectedSpot,
    getSubtotal,
    getTotal,
    deliveryFee,
    clearCart,
    addOrder,
  } = useCartStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTelegram(window.Telegram?.WebApp);
    }
  }, []);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (products?.length === 0) {
      router.push(`/${locale}/cart`);
      return null;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a unique order ID
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      const orderData = {
        // id: newOrderId,
        // name,
        // phone,
        // address,
        products: products?.map((product) => {
          return {
            product_id: product?.product_id,
            count: product?.count,
          };
        }),
        service_mode: deliveryMethod == "delivery" ? 3 : 2,
        spot_id: selectedSpot?.id,
        all_price: getTotal(),
        // delivery_price: deliveryFee,
        comment: notes,
        // date: new Date().toISOString(),
      };
      console.log(orderData);

      telegram.sendData(JSON.stringify(orderData)); // Отправляем данные в бота
      telegram.close();
      // Show success message
      addOrder({ ...orderData, products });
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        router.push(`/${locale}/profile`);
      }, 3000);
    } catch (error) {
      console.error("Error submitting order:", error);
      setIsSubmitting(false);
    }
  };

  // If order was successful, show success message
  if (isSuccess) {
    return (
      <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-2 text-xl font-medium text-green-600">
          {locale === "uz" && "Buyurtmangiz qabul qilindi!"}
          {locale === "ru" && "Ваш заказ принят!"}
          {locale === "zh" && "您的订单已接收！"}
        </h2>
        <p className="mb-1 text-gray-600">
          {locale === "uz" && "Buyurtma raqami:"}
          {locale === "ru" && "Номер заказа:"}
          {locale === "zh" && "订单号："}{" "}
          <span className="font-medium">{orderId}</span>
        </p>
        <p className="text-sm text-gray-500">
          {locale === "uz" && "Tez orada siz bilan bog'lanamiz"}
          {locale === "ru" && "Мы скоро свяжемся с вами"}
          {locale === "zh" && "我们很快会与您联系"}
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-chaomi-navy/90 my-4 border-chaomi-cream text-chaomi-cream rounded-md">
        <p className="p-4 text-2xl text-center">
          {TRANSLATIONS.takeaway[locale]}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white">
        {/* Contact Information */}
        {/* <div>
          <h2 className="mb-4 font-medium">
            {locale === "uz" && "Aloqa ma'lumotlari"}
            {locale === "ru" && "Контактная информация"}
            {locale === "zh" && "联系信息"}
          </h2>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {locale === "uz" && "Ism"}
                {locale === "ru" && "Имя"}
                {locale === "zh" && "名字"}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-chaomi-red focus:outline-none focus:ring-1 focus:ring-chaomi-red"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {locale === "uz" && "Telefon raqami"}
                {locale === "ru" && "Номер телефона"}
                {locale === "zh" && "电话号码"}
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-chaomi-red focus:outline-none focus:ring-1 focus:ring-chaomi-red"
                placeholder="+998 __ ___ __ __"
              />
            </div>
          </div>
        </div> */}

        {/* Delivery Information */}
        {/* {deliveryMethod === "delivery" && (
          <div>
            <h2 className="mb-4 font-medium">
              {locale === "uz" && "Yetkazib berish ma'lumotlari"}
              {locale === "ru" && "Информация о доставке"}
              {locale === "zh" && "配送信息"}
            </h2>

            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {locale === "uz" && "Manzil"}
                {locale === "ru" && "Адрес"}
                {locale === "zh" && "地址"}
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-chaomi-red focus:outline-none focus:ring-1 focus:ring-chaomi-red"
              />
            </div>
          </div>
        )}

        {deliveryMethod === "pickup" && selectedSpot && (
          <div>
            <h2 className="mb-4 font-medium">
              {locale === "uz" && "Olib ketish joyi"}
              {locale === "ru" && "Место самовывоза"}
              {locale === "zh" && "自取地点"}
            </h2>

            <div className="flex items-start rounded-lg border border-gray-200 bg-gray-50 p-4">
              <MapPin className="mr-3 h-5 w-5 text-chaomi-red" />
              <div>
                <h3 className="font-medium">{selectedSpot.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedSpot.address}
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Order Notes */}
        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {locale === "uz" && "Qo'shimcha ma'lumotlar"}
            {locale === "ru" && "Дополнительная информация"}
            {locale === "zh" && "附加说明"}
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-chaomi-red focus:outline-none focus:ring-1 focus:ring-chaomi-red"
            placeholder={
              locale === "uz"
                ? "Buyurtmangiz haqida qo'shimcha ma'lumotlar"
                : locale === "ru"
                ? "Дополнительная информация о вашем заказе"
                : "关于您订单的其他信息"
            }
          />
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="mb-4 font-medium">
            {locale === "uz" && "Buyurtma tafsilotlari"}
            {locale === "ru" && "Детали заказа"}
            {locale === "zh" && "订单详情"}
          </h2>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            {/* Delivery Method */}
            <div className="mb-3 flex items-center">
              {deliveryMethod === "delivery" ? (
                <>
                  <Truck className="mr-2 h-5 w-5 text-chaomi-navy" />
                  <span className="text-sm">
                    {locale === "uz" && "Yetkazib berish"}
                    {locale === "ru" && "Доставка"}
                    {locale === "zh" && "送货上门"}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-5 w-5 text-chaomi-navy" />
                  <span className="text-sm">
                    {locale === "uz" && "Olib ketish"}
                    {locale === "ru" && "Самовывоз"}
                    {locale === "zh" && "自取"}
                  </span>
                </>
              )}
            </div>

            {/* Items Count */}
            <div className="mb-3 flex justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">
                {locale === "uz" && "Mahsulotlar"}
                {locale === "ru" && "Товары"}
                {locale === "zh" && "产品"}
              </span>
              <span className="text-sm">
                {products?.length}{" "}
                {locale === "uz" ? "ta" : locale === "ru" ? "шт" : "件"}
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {locale === "uz" && "Oraliq jami"}
                {locale === "ru" && "Промежуточный итог"}
                {locale === "zh" && "小计"}
              </span>
              <span className="text-sm">{formatPrice(getSubtotal())}</span>
            </div>

            {/* Delivery Fee */}
            {/* {deliveryMethod === "delivery" && (
              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-600">
                  {locale === "uz" && "Yetkazib berish narxi"}
                  {locale === "ru" && "Стоимость доставки"}
                  {locale === "zh" && "配送费"}
                </span>
                <span className="text-sm">{formatPrice(deliveryFee)}</span>
              </div>
            )} */}

            {/* Total */}
            <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
              <span className="font-medium">
                {locale === "uz" && "Jami"}
                {locale === "ru" && "Итого"}
                {locale === "zh" && "总计"}
              </span>
              <span className="font-bold text-chaomi-red">
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white p-4 shadow-lg">
          <Button
            type="submit"
            variant="chaomiRed"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {locale === "uz" && "Ishlov berilmoqda..."}
                {locale === "ru" && "Обработка..."}
                {locale === "zh" && "处理中..."}
              </>
            ) : (
              <>
                {locale === "uz" && "Buyurtma berish"}
                {locale === "ru" && "Оформить заказ"}
                {locale === "zh" && "提交订单"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
