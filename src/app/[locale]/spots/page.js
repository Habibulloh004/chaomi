"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { STORE_LOCATIONS, TRANSLATIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Check, MapPin } from "lucide-react";
import { use } from "react";

export default function SpotsPage({ params }) {
  const { locale } = use(params);
  const router = useRouter();
  const { selectedSpot, setSelectedSpot, setDeliveryMethod } = useCartStore();

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
    setDeliveryMethod("pickup");
    router.push(`/${locale}/cart`);
  };

  return (
    <div className="p-4">
      <div className="bg-chaomi-navy/90 my-4 border-chaomi-cream text-chaomi-cream rounded-md">
        <p className="p-4 text-2xl text-center">
          {TRANSLATIONS.locations[locale]}
        </p>
      </div>

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
          {locale === "uz" && "Yetkazib berishni tanlash"}
          {locale === "ru" && "Выбрать доставку"}
          {locale === "zh" && "选择送货上门"}
        </Button>
      </div>
    </div>
  );
}
