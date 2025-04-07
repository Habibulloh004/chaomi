import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      products: [],
      deliveryMethod: "delivery",
      phone: 30000, // Default delivery fee
      spot_id: null,

      add: (product, count = 1) => {
        const { products } = get();
        const existingProductsIndex = products.findIndex(
          (item) => item.product_id === product
        );
        if (products.length > 0 && existingProductsIndex >= 0) {
          const updatedItems = [...products];
          updatedItems[existingProductsIndex].count += count;
          set({ products: updatedItems });
        } else {
          set({
            products: [
              ...products,
              {
                product_id: product,
                count,
              },
            ],
          });
        }
      },

      removeItem: (itemId) => {
        set({
          products: get().products.filter((item) => item.product_id !== itemId),
        });
      },

      updateQuantity: (itemId, count = 1) => {
        const updatedItems = get()
          .products.map((item) => {
            if (item.product_id == itemId) {
              const newCount = item.count - count;
              if (newCount <= 0) return null; // 0 yoki undan kichik bo‘lsa o‘chirish
              return { ...item, count: newCount };
            }
            return item;
          })
          .filter((item) => item !== null); // null elementlarni olib tashlash

        set({ products: updatedItems });
      },

      clearCart: () => {
        set({ products: [] }); // "items" o‘rniga "products" ga o‘zgartirdim
      },

      setDeliveryMethod: (method) => {
        set({ deliveryMethod: method });
      },

      setSelectedSpot: (spot) => {
        set({ spot_id: spot }); // "selectedSpot" o‘rniga "spot_id" ga o‘zgartirdim
      },

      getSubtotal: () => {
        return get().products.reduce((sum, item) => {
          return sum + (item.price || 0) * item.count; // "items" o‘rniga "products"
        }, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const { deliveryMethod, phone: deliveryFee } = get();
        return deliveryMethod === "delivery"
          ? subtotal + deliveryFee
          : subtotal;
      },

      getItemCount: () => {
        return get().products.reduce((count, item) => count + item.count, 0); // "items" o‘rniga "products"
      },
    }),
    {
      name: "chaomi-cart",
    }
  )
);
