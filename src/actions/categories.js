"use server";

import { getData } from "./get";

// Get all categories
export async function getCategories() {
  try {
    const data = await getData("menu.getCategories");
    
    if (data && data.response) {
      return data.response;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Get products for a specific category
export async function getCategoryProducts(categoryId = "") {
  try {
    // Make sure we're not adding double question marks in the URL
    const endpoint = categoryId ? `menu.getProducts?category_id=${categoryId}` : 'menu.getProducts';
    const data = await getData(endpoint);
    
    if (data && data.response) {
      return data.response;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}