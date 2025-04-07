"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, LogOut, Package } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";

// Mock data for order history
const mockOrders = [
  {
    id: "ORD-1711283456-289",
    date: new Date(2025, 3, 1, 14, 30),
    total: 90000,
    status: "completed",
    items: [
      { name: "Chai Bubble Tea", quantity: 1, price: 30000 },
      { name: "Milk Tea", quantity: 2, price: 30000 },
    ],
  },
];

export default function ProfilePage({ params }) {
  const { locale } = use(params);
  const { language } = useLanguageStore();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  // Mock user data
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    setUser({
      name: "Guest User",
      phone: "+998 90 123 45 67",
      orders: mockOrders,
    });

    setOrders(mockOrders);
  }, []);

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-chaomi-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* User Info */}
      <div className="border-b bg-white p-4">
        <h1 className="text-lg font-medium">{user.name}</h1>
        <p className="text-sm text-gray-500">{user.phone}</p>
      </div>

      {/* Order History */}
      <div className="p-4">
        <h2 className="mb-4 font-medium">
          {TRANSLATIONS.orderHistory[language]}
        </h2>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <p className="text-gray-500">
              {language === "uz" && "Sizda hali buyurtmalar yo'q"}
              {language === "ru" && "У вас пока нет заказов"}
              {language === "zh" && "您还没有订单"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-gray-100 p-3">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    {language === "uz" && "Bajarildi"}
                    {language === "ru" && "Выполнен"}
                    {language === "zh" && "已完成"}
                  </div>
                </div>

                <div className="p-3">
                  <div className="mb-2 space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <span className="font-medium">
                      {TRANSLATIONS.total[language]}
                    </span>
                    <span className="font-bold text-chaomi-red">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Language Settings */}
      <div className="mt-4 p-4">
        <h2 className="mb-4 font-medium">
          {language === "uz" && "Sozlamalar"}
          {language === "ru" && "Настройки"}
          {language === "zh" && "设置"}
        </h2>

        <Link
          href="#"
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center">
            <span className="text-lg mr-2">
              {language === "uz" ? "🇺🇿" : language === "ru" ? "🇷🇺" : "🇨🇳"}
            </span>
            <span>
              {language === "uz" && "Til: O'zbekcha"}
              {language === "ru" && "Язык: Русский"}
              {language === "zh" && "语言: 中文"}
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>

      {/* About and Support */}
      <div className="mt-4 p-4">
        <h2 className="mb-4 font-medium">
          {language === "uz" && "Biz haqimizda"}
          {language === "ru" && "О нас"}
          {language === "zh" && "关于我们"}
        </h2>

        <div className="space-y-3">
          <Link
            href="#"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <span>
              {language === "uz" && "Foydalanish shartlari"}
              {language === "ru" && "Условия использования"}
              {language === "zh" && "使用条款"}
            </span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            href="#"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <span>
              {language === "uz" && "Maxfiylik siyosati"}
              {language === "ru" && "Политика конфиденциальности"}
              {language === "zh" && "隐私政策"}
            </span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            href="#"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <span>
              {language === "uz" && "Yordam markazi"}
              {language === "ru" && "Центр поддержки"}
              {language === "zh" && "帮助中心"}
            </span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-8 px-4">
        <Button
          variant="outline"
          className="w-full border-gray-300 text-gray-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {language === "uz" && "Chiqish"}
          {language === "ru" && "Выйти"}
          {language === "zh" && "退出登录"}
        </Button>
      </div>

      {/* App Version */}
      <div className="mt-8 text-center text-xs text-gray-400">
        {language === "uz" && "CHAOMI Toshkent - Versiya"}
        {language === "ru" && "CHAOMI Ташкент - Версия"}
        {language === "zh" && "CHAOMI 塔什干 - 版本"}
        {" 1.0.0"}
      </div>
    </div>
  );
}
