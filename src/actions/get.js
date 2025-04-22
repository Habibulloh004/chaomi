"use server";

const API_TOKEN = "793859:9440751eda66da20c74f559a28043d2a";
const BASE_URL = "https://joinposter.com/api";

export async function getData(endpoint) {
  // Make sure we don't duplicate the ? character in the URL
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${BASE_URL}/${endpoint}${separator}token=${API_TOKEN}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store", // Don't cache the requests
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const text = await response.text();
    
    // Check if the response is valid JSON before parsing
    try {
      return text ? JSON.parse(text) : null;
    } catch (parseError) {
      console.error(`Invalid JSON response from ${url}:`, text);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
}