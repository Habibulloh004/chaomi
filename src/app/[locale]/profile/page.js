"use client";

import { useState, use } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ChevronRight,
  Package,
  ChevronDown,
} from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";

import { useCartStore } from "@/store/cartStore";
import LanguageSwitcher from "@/components/shared/changeLanguage";

export default function ProfilePage({ params }) {
  const { locale } = use(params);
  const { myOrders } = useCartStore();
  const [showAllOrders, setShowAllOrders] = useState(false);

  const displayedOrders = showAllOrders ? myOrders : myOrders?.slice(0, 2);

  return (
    <div className="pb-8">
      {/* Order History */}
      <div className="p-4 space-y-4">
        <div className="bg-chaomi-navy/90 border-chaomi-cream text-chaomi-cream rounded-md">
          <p className="p-4 text-2xl text-center">
            {TRANSLATIONS.orderHistory[locale]}
          </p>
        </div>
        <LanguageSwitcher currentLocale={locale} />

        {myOrders?.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <p className="text-gray-500">
              {locale === "uz" && "Sizda hali buyurtmalar yo'q"}
              {locale === "ru" && "У вас пока нет заказов"}
              {locale === "zh" && "您还没有订单"}
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
                    {locale === "uz" && "Bajarildi"}
                    {locale === "ru" && "Выполнен"}
                    {locale === "zh" && "已完成"}
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
                        {TRANSLATIONS.service[locale]}
                      </span>
                      <span className="text-gray-800">
                        {TRANSLATIONS.delivery[locale]}
                      </span>
                    </div>
                  )}
                  {order?.service_mode == 2 && (
                    <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                      <span className="font-semibold text-gray-700">
                        {TRANSLATIONS.service[locale]}
                      </span>
                      <span className="text-gray-800">
                        {TRANSLATIONS.pickup[locale]}
                      </span>
                    </div>
                  )}
                  {order?.delivery_price && order?.service_mode == 3 && (
                    <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                      <span className="font-semibold text-gray-700">
                        {TRANSLATIONS.deliveryFee[locale]}
                      </span>
                      <span className="font-bold text-chaomi-red">
                        {formatPrice(order?.delivery_price)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                    <span className="font-semibold text-gray-700">
                      {TRANSLATIONS.total[locale]}
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
                    {locale === "uz" && "Kamroq ko'rsatish"}
                    {locale === "ru" && "Показать меньше"}
                    {locale === "zh" && "显示更少"}
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    {locale === "uz" && "Barchasini ko'rish"}
                    {locale === "ru" && "Показать все"}
                    {locale === "zh" && "查看全部"}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
