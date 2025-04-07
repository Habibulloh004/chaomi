import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      products: [],
      myOrders: [],
      deliveryMethod: "delivery",
      deliveryFee: 30000, // Default delivery fee
      selectedSpot: null,
      addOrder: (order) => {
        set({ myOrders: [...get().myOrders, order] });
      },
      add: (product, count = 1) => {
        const { products } = get();
        console.log(product);

        const existingProductsIndex = products.findIndex(
          (item) => item.product_id == product?.product_id
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
                ...product,
                count,
              },
            ],
          });
        }
      },
      setTotal: (total) => {
        set({ total });
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
        set({ products: [], selectedSpot: null });
      },

      setDeliveryMethod: (method) => {
        set({ deliveryMethod: method });
      },

      setSelectedSpot: (spot) => {
        set({ selectedSpot: spot }); // "selectedSpot" o‘rniga "spot_id" ga o‘zgartirdim
      },

      getSubtotal: () => {
        const roundToTwoDecimals = (value) => {
          return Number((Math.round(value * 100) / 100).toFixed(2));
        };
        return get().products.reduce((sum, item) => {
          return roundToTwoDecimals(
            +sum + +(+item?.price["1"] / 100 || 0) * item.count
          ); // "items" o‘rniga "products"
        }, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const { deliveryMethod, deliveryFee } = get();
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
