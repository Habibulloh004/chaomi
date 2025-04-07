// Base URL for images from Poster API
export const POSTER_IMAGE_BASE_URL = "https://joinposter.com";

// Supported languages
export const LANGUAGES = [
  { id: "uz", name: "O'zbekcha", flag: "🇺🇿" },
  { id: "ru", name: "Русский", flag: "🇷🇺" },
  { id: "zh", name: "中文", flag: "🇨🇳" },
];

// Product size options
export const PRODUCT_SIZES = {
  S: { label: "S", value: "S" },
  M: { label: "M", value: "M" },
  L: { label: "L", value: "L" },
};

// Temperature options
export const TEMPERATURE_OPTIONS = {
  HOT: {
    value: "hot",
    labels: {
      uz: "Issiq",
      ru: "Горячий",
      zh: "热的",
    },
  },
  COLD: {
    value: "cold",
    labels: {
      uz: "Sovuq",
      ru: "Холодный",
      zh: "冷的",
    },
  },
};

// Sugar level options
export const SUGAR_LEVELS = [
  { value: 0, label: "0%" },
  { value: 30, label: "30%" },
  { value: 60, label: "60%" },
  { value: 100, label: "100%" },
  { value: 130, label: "130%" },
];

// Delivery options
export const DELIVERY_OPTIONS = {
  DELIVERY: {
    value: "delivery",
    labels: {
      uz: "Yetkazib berish",
      ru: "Доставка",
      zh: "送货",
    },
  },
  PICKUP: {
    value: "pickup",
    labels: {
      uz: "O'zim olib ketaman",
      ru: "Самовывоз",
      zh: "自提",
    },
  },
};

// Default store locations
export const STORE_LOCATIONS = [
  {
    id: 1,
    name: "Compass Mall",
    address: "Toshkent Xalqa Avtomobil Yo'li 17, Toshkent",
    coordinates: {
      lat: 41.2995,
      lng: 69.2401,
    },
  },
  {
    id: 2,
    name: "Samarqand Darvoza",
    address: "Koʻcha Qoʻyliq 2, Toshkent",
    coordinates: {
      lat: 41.2542,
      lng: 69.3232,
    },
  },
];

// App text translations
export const TRANSLATIONS = {
  foo_welcome: {
    uz: "Ortga",
    ru: "Назад",
    zh: "返回",
  },
  welcome: {
    uz: "CHAOMI <br/> ga xush kelibsiz",
    ru: "Добро пожаловать в <br/> CHAOMI",
    zh: "欢迎来到 <br/> CHAOMI",
  },
  order: {
    uz: "Buyurtma berish",
    ru: "Заказать",
    zh: "下单",
  },
  locations: {
    uz: "Manzillar",
    ru: "Заведения",
    zh: "餐厅位置",
  },
  categories: {
    uz: "Kategoriyalar",
    ru: "Категории",
    zh: "类别",
  },
  cart: {
    uz: "Savat",
    ru: "Корзина",
    zh: "购物车",
  },
  profile: {
    uz: "Profil",
    ru: "Профиль",
    zh: "个人资料",
  },
  orderHistory: {
    uz: "Buyurtmalar tarixi",
    ru: "История заказов",
    zh: "订单历史",
  },
  addToCart: {
    uz: "Savatga qo'shish",
    ru: "Добавить в корзину",
    zh: "加入购物车",
  },
  buyNow: {
    uz: "Hozir sotib olish",
    ru: "Купить сейчас",
    zh: "立即购买",
  },
  size: {
    uz: "Hajmi",
    ru: "Размер",
    zh: "大小",
  },
  temperature: {
    uz: "Harorat",
    ru: "Температура",
    zh: "温度",
  },
  sugar: {
    uz: "Shakar",
    ru: "Сахар",
    zh: "糖",
  },
  confirm: {
    uz: "Tasdiqlash",
    ru: "Подтвердить",
    zh: "确认",
  },
  cancel: {
    uz: "Bekor qilish",
    ru: "Отменить",
    zh: "取消",
  },
  total: {
    uz: "Jami",
    ru: "Итого",
    zh: "总计",
  },
  deliveryFee: {
    uz: "Yetkazib berish narxi",
    ru: "Стоимость доставки",
    zh: "配送费",
  },
  checkout: {
    uz: "Rasmiylashtirish",
    ru: "Оформить заказ",
    zh: "结账",
  },
};
