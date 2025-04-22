"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { parseProductDescription } from "@/lib/api";
import {
  capitalizeMultiLanguageText,
  parseMultiLanguageText,
  formatPrice,
} from "@/lib/utils";
import { TRANSLATIONS } from "@/lib/constants";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { getCategories, getCategoryProducts } from "@/actions/categories";

export default function CategoriesPage() {
  const params = useParams();
  const { locale } = params;
  const router = useRouter();
  const {
    products: cartProducts,
    add,
    updateQuantity,
    removeItem,
  } = useCartStore();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Use the server action to fetch categories
        const categoriesData = await getCategories();

        // Filter out hidden categories
        const visibleCategories = categoriesData.filter(
          (cat) => cat.category_hidden === "0"
        );

        setCategories(visibleCategories);

        // If categories exist, select the first one and load its products
        if (visibleCategories.length > 0) {
          const firstCategory = visibleCategories[0];
          setSelectedCategory(firstCategory);

          // Use the server action to fetch products for the selected category
          const productsData = await getCategoryProducts(
            firstCategory.category_id
          );
          const visibleProducts = productsData.filter(
            (prod) =>
              prod.menu_category_id === firstCategory.category_id &&
              prod.hidden === "0"
          );

          setProducts(visibleProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      // Use the server action to fetch products for the selected category
      const productsData = await getCategoryProducts(category.category_id);
      const visibleProducts = productsData.filter(
        (prod) =>
          prod.menu_category_id === category.category_id && prod.hidden === "0"
      );

      console.log(productsData);
      console.log(products);
      setProducts(visibleProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get quantity from cart
  const getQuantityInCart = (productId) => {
    const product = cartProducts.find((p) => p.product_id === productId);
    return product ? product.count : 0;
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    add(product);
  };

  // Handle updating quantity
  const handleUpdateQuantity = (productId, change) => {
    updateQuantity(productId, change);
  };

  // Handle removing product
  const handleRemoveFromCart = (productId) => {
    removeItem(productId);
  };

  return (
    <div className="relative h-full">
      {/* Fixed sidebar for categories */}
      <div className="fixed top-0 bottom-0 left-0 w-1/3 overflow-y-auto bg-chaomi-navy/90 pt-20 pb-16 z-10">
        <div className="py-2">
          {categories.map((category) => (
            <div
              key={category.category_id}
              className={`cursor-pointer py-3 px-2 w-11/12 mx-auto mb-1 rounded-md transition-colors ${
                selectedCategory?.category_id === category.category_id
                  ? "bg-chaomi-red text-white"
                  : "text-chaomi-cream hover:bg-chaomi-navy"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <span className="text-sm font-medium">
                {capitalizeMultiLanguageText(
                  parseMultiLanguageText(category.category_name, locale),
                  locale
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="ml-1/3 pl-[33%] pt-4 pb-16 min-h-screen">
        {/* Header */}
        <div className="bg-chaomi-navy/90 mb-4 border-chaomi-cream text-chaomi-cream rounded-md w-10/12 mx-auto">
          <p className="py-4 px-1 text-xl text-center">
            {selectedCategory
              ? capitalizeMultiLanguageText(
                  parseMultiLanguageText(
                    selectedCategory.category_name,
                    locale
                  ),
                  locale
                )
              : TRANSLATIONS.categories[locale]}
          </p>
        </div>

        {/* Products */}
        <div className="space-y-4 p-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chaomi-red"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {locale === "uz" && "Bu kategoriyada mahsulotlar topilmadi"}
                {locale === "ru" && "В этой категории нет товаров"}
                {locale === "zh" && "此类别中没有找到产品"}
              </p>
            </div>
          ) : (
            products.map((product) => {
              const quantity = getQuantityInCart(product.product_id);

              // Extract proper product name based on the locale
              let productName = product.product_name;
              const { names } = parseProductDescription(product);
              if (names[locale]) {
                productName = names[locale];
              } else if (productName.includes("***")) {
                productName = parseMultiLanguageText(productName, locale);
              }

              // Determine price
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

              return (
                <div
                  key={product.product_id}
                  className="overflow-hidden rounded-lg flex items-center bg-chaomi-navy/90 border-chaomi-cream text-chaomi-cream shadow-md transition-all hover:shadow-lg p-3 relative"
                  onClick={() =>
                    router.push(`/${locale}/product/${product.product_id}`)
                  }
                >
                  <div className="relative aspect-square w-28">
                    {product.photo ? (
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
                    ) : (
                      <Image
                        src={`https://static-00.iconduck.com/assets.00/no-image-icon-2048x2048-2t5cx953.png`}
                        alt={"no-image"}
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
                    <div className="mt-auto flex flex-col gap-2 justify-between">
                      <p className="text-sm font-semibold text-chaomi-red">
                        {formatPrice(Number(price) / 100)}{" "}
                        {locale == "uz" && "so'm"}
                        {locale == "ru" && "сум"}
                        {locale == "zh" && "索姆"}
                      </p>

                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {quantity === 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="bg-chaomi-red hover:bg-chaomi-red/90 text-white rounded-md px-2 py-1 text-sm transition-colors"
                          >
                            {locale == "uz" && "Qo'shish"}
                            {locale == "ru" && "Добавить"}
                            {locale == "zh" && "添加"}
                          </button>
                        ) : (
                          <>
                            <div className="flex items-center bg-chaomi-cream/20 rounded-md">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateQuantity(product.product_id, 1);
                                }}
                                className="p-1 hover:bg-chaomi-cream/30 text-chaomi-cream"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {quantity < 10 ? `0${quantity}` : quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateQuantity(product.product_id, -1);
                                }}
                                className="p-1 hover:bg-chaomi-cream/30 text-chaomi-cream"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromCart(product.product_id);
                              }}
                              className="p-1 text-chaomi-red hover:bg-chaomi-red/20 hover:text-chaomi-red transition-colors"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
