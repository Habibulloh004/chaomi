"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useLanguageStore } from "@/store/languageStore";
import { STORE_LOCATIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Check, MapPin } from "lucide-react";
import { use } from "react";

export default function SpotsPage({ params }) {
  const { locale } = use(params);
  const router = useRouter();
  const { language } = useLanguageStore();
  const { selectedSpot, setSelectedSpot, setDeliveryMethod } = useCartStore();

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
    setDeliveryMethod("pickup");
    router.push(`/${locale}/cart`);
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-center text-lg font-medium">
        {language === "uz" && "Chayhonani tanlang"}
        {language === "ru" && "Выберите чайхану"}
        {language === "zh" && "选择茶馆位置"}
      </h1>

      <div className="space-y-4">
        {STORE_LOCATIONS.map((spot) => (
          <button
            key={spot.id}
            className={`flex w-full items-start rounded-lg border p-4 text-left ${
              selectedSpot?.id === spot.id
                ? "border-chaomi-red bg-red-50"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => handleSelectSpot(spot)}
          >
            <div className="mr-3 mt-1">
              {selectedSpot?.id === spot.id ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-chaomi-red text-white">
                  <Check className="h-4 w-4" />
                </div>
              ) : (
                <MapPin className="h-6 w-6 text-gray-400" />
              )}
            </div>

            <div>
              <h3 className="font-medium">{spot.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{spot.address}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setDeliveryMethod("delivery");
            router.push(`/${locale}/cart`);
          }}
        >
          {language === "uz" && "Yetkazib berishni tanlash"}
          {language === "ru" && "Выбрать доставку"}
          {language === "zh" && "选择送货上门"}
        </Button>
      </div>
    </div>
  );
}
