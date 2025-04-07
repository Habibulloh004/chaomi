"use server";

const API_TOKEN = "793859:9440751eda66da20c74f559a28043d2a";
const BASE_URL = "https://joinposter.com/api";
export async function getData(endpoint) {
  const url = `${BASE_URL}/${endpoint}?token=${API_TOKEN}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok)
      throw new Error(`Error: ${response.status} - ${response.statusText}`);

    return await response?.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // Xatolik bo'lsa, `null` qaytariladi
  }
}
