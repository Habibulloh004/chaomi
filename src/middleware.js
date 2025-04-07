import { NextResponse } from "next/server";

// Supported languages
const supportedLanguages = ["uz", "ru", "zh"];
const defaultLanguage = "uz";

/**
 * Middleware to handle language routing
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already includes a locale
  const pathnameHasLocale = supportedLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If the path already has a valid locale, no need to redirect
  if (pathnameHasLocale) return;

  // Get the preferred language from cookie, or use browser language, or default
  let language = defaultLanguage;

  if (request.cookies.has("chaomi-language")) {
    const cookieValue = request.cookies.get("chaomi-language")?.value;
    if (cookieValue && supportedLanguages.includes(cookieValue)) {
      language = cookieValue;
    }
  } else {
    // Get from Accept-Language header if no cookie is set
    const acceptLanguage = request.headers.get("Accept-Language") || "";

    // Check if any supported language matches the Accept-Language header
    for (const lang of supportedLanguages) {
      if (acceptLanguage.includes(lang)) {
        language = lang;
        break;
      }
    }
  }

  // Create the redirect URL with the language prefix
  const url = new URL(
    `/${language}${pathname === "/" ? "" : pathname}`,
    request.url
  );

  // Preserve query parameters
  url.search = request.nextUrl.search;

  return NextResponse.redirect(url);
}

/**
 * Define which paths this middleware should run on
 */
export const config = {
  matcher: [
    // Match all paths except:
    // - Files with extensions (e.g., images, CSS, JavaScript)
    // - API routes
    // - Static files in the public directory
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
