// API token for the Poster API

const API_TOKEN = "793859:9440751eda66da20c74f559a28043d2a";
const BASE_URL = "https://joinposter.com/api";

// Cache durations
const CATEGORIES_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const PRODUCTS_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
// const CATEGORIES_CACHE_DURATION = 0; // 1 hour in milliseconds
// const PRODUCTS_CACHE_DURATION = 0; // 30 minutes in milliseconds

// Cache storage
let cachedCategories = null;
let categoriesCacheTime = 0;
let cachedProducts = null;
let productsCacheTime = 0;

/**
 * Fetch data from the Poster API
 */
export const fetchFromPoster = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);

  // Add token to params
  url.searchParams.append("token", API_TOKEN);

  // Add other params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

/**
 * Get all product categories
 */
export const getCategories = async () => {
  const now = Date.now();

  // Return cached categories if they're still valid
  if (
    cachedCategories &&
    now - categoriesCacheTime < CATEGORIES_CACHE_DURATION
  ) {
    return cachedCategories;
  }

  try {
    const data = await fetchFromPoster("menu.getCategories");

    if (data && data.response) {
      // Update cache
      cachedCategories = data.response;
      categoriesCacheTime = now;

      return data.response;
    }

    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * Get all products or products by category
 */
export const getProducts = async (categoryId = "") => {
  const now = Date.now();

  // Return cached products if they're still valid
  if (cachedProducts && now - productsCacheTime < PRODUCTS_CACHE_DURATION) {
    // If category ID is provided, filter the cached products
    if (categoryId) {
      return cachedProducts.filter(
        (product) => product.menu_category_id === categoryId
      );
    }

    return cachedProducts;
  }

  try {
    const data = await fetchFromPoster(
      `menu.getProducts?category_id=${categoryId}`
    );
    if (data && data.response) {
      // Update cache
      cachedProducts = data.response;
      productsCacheTime = now;

      // If category ID is provided, filter the products
      if (categoryId) {
        return data.response.filter(
          (product) => product.menu_category_id === categoryId
        );
      }

      return data.response;
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (productId) => {
  const now = Date.now();

  // If we have cached products, try to find the product there
  if (cachedProducts && now - productsCacheTime < PRODUCTS_CACHE_DURATION) {
    const product = cachedProducts.find((p) => p.product_id === productId);

    if (product) {
      return product;
    }
  }

  // If not found in cache, fetch all products and find the requested one
  try {
    const products = await getProducts();
    return products.find((p) => p.product_id === productId) || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

/**
 * Extract language-specific data from product_production_description
 */
export const parseProductDescription = (product) => {
  if (!product || !product.product_production_description) {
    return {
      names: {},
      descriptions: {},
    };
  }

  let desc = product.product_production_description;

  // 🛠️ Fix broken or malformed tags
  desc = desc.replace(
    /<\/description_ru>(.*?)<\/description_ru>/s,
    "<description_ru>$1</description_ru>"
  );
  desc = desc.replace(/description_hz/g, "description_zh");
  desc = desc.replace(/<description_uz>>/g, "<description_uz>");

  const extract = (tag) => {
    const match = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i").exec(desc);
    return match ? match[1].trim() : null;
  };

  return {
    names: {
      uz: extract("name_uz"),
      ru: extract("name_ru"),
      zh: extract("name_zh"),
    },
    descriptions: {
      uz: extract("description_uz"),
      ru: extract("description_ru"),
      zh: extract("description_zh"),
    },
  };
};

/**
 * Parse category name for different languages
 */
export const parseCategoryName = (category) => {
  if (!category || !category.category_name) {
    return { uz: "", ru: "", zh: "" };
  }

  const nameParts = category.category_name.split("***");

  if (nameParts.length === 3) {
    return {
      uz: nameParts[0].trim(),
      ru: nameParts[1].trim(),
      zh: nameParts[2].trim(),
    };
  }

  // If no language separation, use the same name for all languages
  return {
    uz: category.category_name,
    ru: category.category_name,
    zh: category.category_name,
  };
};
