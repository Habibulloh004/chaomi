"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, LogOut, Package, ChevronDown } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function ProfilePage({ params }) {
  const { locale } = use(params);
  const { language, setLanguage } = useLanguageStore();
  const { myOrders } = useCartStore();
  const [user, setUser] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const router = useRouter();

  const changeLanguage = (lang) => {
    setLanguage(lang);
    const currentPath = window.location.pathname;
    const segments = currentPath.split("/");
    segments[1] = lang;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  useEffect(() => {
    setUser({
      name: "Guest User",
      phone: "+998 90 123 45 67",
      orders: myOrders,
    });
  }, [myOrders]);

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-chaomi-red border-t-transparent"></div>
      </div>
    );
  }

  const displayedOrders = showAllOrders ? myOrders : myOrders?.slice(0, 2);

  return (
    <div className="pb-8">
      {/* User Info */}
      <div className="border-b bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">{user.name}</h1>
        <p className="text-sm text-gray-600">{user.phone}</p>
      </div>

      {/* Order History */}
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {TRANSLATIONS.orderHistory[language]}
        </h2>

        {myOrders?.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <p className="text-gray-500">
              {language === "uz" && "Sizda hali buyurtmalar yo'q"}
              {language === "ru" && "У вас пока нет заказов"}
              {language === "zh" && "您还没有订单"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders?.map((order, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {formatDate(order?.date)}
                    </span>
                  </div>
                  <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    {language === "uz" && "Bajarildi"}
                    {language === "ru" && "Выполнен"}
                    {language === "zh" && "已完成"}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="mb-2 space-y-1">
                    {order?.products?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item?.product_name} x{item?.count}
                        </span>
                        <span className="text-gray-800">
                          {formatPrice((+item.price["1"] / 100) * +item?.count)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {order?.service_mode == 3 && (
                    <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                      <span className="font-semibold text-gray-700">
                        {TRANSLATIONS.service[language]}
                      </span>
                      <span className="text-gray-800">
                        {TRANSLATIONS.delivery[language]}
                      </span>
                    </div>
                  )}
                  {order?.service_mode == 2 && (
                    <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                      <span className="font-semibold text-gray-700">
                        {TRANSLATIONS.service[language]}
                      </span>
                      <span className="text-gray-800">
                        {TRANSLATIONS.pickup[language]}
                      </span>
                    </div>
                  )}
                  {order?.delivery_price && order?.service_mode == 3 && (
                    <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                      <span className="font-semibold text-gray-700">
                        {TRANSLATIONS.deliveryFee[language]}
                      </span>
                      <span className="font-bold text-chaomi-red">
                        {formatPrice(order?.delivery_price)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                    <span className="font-semibold text-gray-700">
                      {TRANSLATIONS.total[language]}
                    </span>
                    <span className="font-bold text-chaomi-red">
                      {formatPrice(order?.all_price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {myOrders?.length > 2 && (
              <Button
                variant="outline"
                className="mt-4 w-full text-gray-700"
                onClick={() => setShowAllOrders(!showAllOrders)}
              >
                {showAllOrders ? (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    {language === "uz" && "Kamroq ko'rsatish"}
                    {language === "ru" && "Показать меньше"}
                    {language === "zh" && "显示更少"}
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    {language === "uz" && "Barchasini ko'rish"}
                    {language === "ru" && "Показать все"}
                    {language === "zh" && "查看全部"}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="mt-6 p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {language === "uz" && "Sozlamalar"}
          {language === "ru" && "Настройки"}
          {language === "zh" && "设置"}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-between border-gray-200 bg-white text-left shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">
                  {language === "uz" ? "🇺🇿" : language === "ru" ? "🇷🇺" : "🇨🇳"}
                </span>
                <span className="text-gray-700">
                  {language === "uz" && "Til: O'zbekcha"}
                  {language === "ru" && "Язык: Русский"}
                  {language === "zh" && "语言: 中文"}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem onClick={() => changeLanguage("uz")}>
              🇺🇿 O&apos;zbekcha
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("ru")}>
              🇷🇺 Русский
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("zh")}>
              🇨🇳 中文
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* About and Support */}
      <div className="mt-6 p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {language === "uz" && "Biz haqimizda"}
          {language === "ru" && "О нас"}
          {language === "zh" && "关于我们"}
        </h2>
        <div className="space-y-3">
          {[
            {
              text: {
                uz: "Foydalanish shartlari",
                ru: "Условия использования",
                zh: "使用条款",
              },
              href: "#",
            },
            {
              text: {
                uz: "Maxfiylik siyosati",
                ru: "Политика конфиденциальности",
                zh: "隐私政策",
              },
              href: "#",
            },
            {
              text: {
                uz: "Yordam markazi",
                ru: "Центр поддержки",
                zh: "帮助中心",
              },
              href: "#",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700">{item.text[language]}</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-8 px-4">
        <Button
          variant="outline"
          className="h-12 w-full border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50"
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
        {language === "zh" && "CHAOMI 塔什干 - 版本"} 1.0.0
      </div>
    </div>
  );
}