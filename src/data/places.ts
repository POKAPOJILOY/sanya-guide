export const categories = [
  { id: "beaches", label: "Пляжи", emoji: "🏖️" },
  { id: "sights", label: "Достопримечательности", emoji: "🛕" },
  { id: "food", label: "Еда", emoji: "🦐" },
  { id: "shopping", label: "Шопинг", emoji: "🛍️" },
  { id: "spa", label: "Спа", emoji: "♨️" },
  { id: "entertainment", label: "Развлечения", emoji: "🎡" },
  { id: "parks", label: "Парки", emoji: "🌳" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const FOOD_SUBCATEGORIES = [
  { id: "cafe", label: "Кафе" },
  { id: "restaurants", label: "Рестораны" },
  { id: "markets", label: "Рынки" },
  { id: "streetfood", label: "Стритфуд" },
] as const;

export type FoodSubcategoryId = (typeof FOOD_SUBCATEGORIES)[number]["id"];

export type Place = {
  id: string;
  name: string;
  nameZh: string;
  category: CategoryId;
  lat: number;
  lng: number;
  isFree: boolean;
  emoji: string;
  shortDescription: string;
  subcategory?: string;
  gettingThere: string;
  prices: string;
  photoUrl: string;
};

export const categoryById = (id: CategoryId) =>
  categories.find((c) => c.id === id)!;

export const places: Place[] = [
  {
    id: "dadonghai",
    name: "Пляж Дадунхай",
    nameZh: "大东海",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "beaches",
    lat: 18.2187,
    lng: 109.5055,
    isFree: true,
    emoji: "🏖️",
    shortDescription:
      "Городской пляж, где живёт вся тусовка: пальмы, кафе у воды и море в пяти минутах от отеля. Приходи к закату — это магия!",
  },
  {
    id: "yalongwan",
    name: "Пляж Ялуньвань",
    nameZh: "亚龙湾",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "beaches",
    lat: 18.2106,
    lng: 109.6485,
    isFree: true,
    emoji: "🏖️",
    shortDescription:
      "Самый чистый пляж города: белый песок и вода как в рекламе Баунти. Езжай с утра, пока все спят.",
  },
  {
    id: "haitangwan",
    name: "Пляж Хайтанвань",
    nameZh: "海棠湾",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "beaches",
    lat: 18.3189,
    lng: 109.7389,
    isFree: false,
    emoji: "🏖️",
    shortDescription:
      "Тихий залив без толп — расскажу, где бесплатный вход на пляж и лучшие фотоспоты без единого туриста.",
  },
  {
    id: "wuzhizhou",
    name: "Остров Вузичжоу",
    nameZh: "蜈支洲岛",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "beaches",
    lat: 18.3097,
    lng: 109.7606,
    isFree: false,
    emoji: "🏝️",
    shortDescription:
      "«Мальдивы Китая»: как купить билет без очереди, что взять с собой и в какой бухте вода самая бирюзовая.",
  },
  {
    id: "xidao",
    name: "Остров Сидао",
    nameZh: "西岛",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "beaches",
    lat: 18.2381,
    lng: 109.3685,
    isFree: false,
    emoji: "🏝️",
    shortDescription:
      "Рыбацкие деревеньки вместо отелей: скутеры, кокосы и настоящая островная жизнь. Покажу маршрут на день.",
  },
  {
    id: "nanshan",
    name: "Статуя Гуаньинь в Наньшане",
    nameZh: "南山文化旅游区",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "sights",
    lat: 18.3024,
    lng: 109.1925,
    isFree: false,
    emoji: "🛕",
    shortDescription:
      "108-метровая богиня над морем: как добраться дешевле, что значат ритуалы и где смотровая без толпы.",
  },
  {
    id: "tianya",
    name: "Тянья Хайцзяо («Край неба и угол моря»)",
    nameZh: "天涯海角",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "sights",
    lat: 18.2939,
    lng: 109.3443,
    isFree: false,
    emoji: "🛕",
    shortDescription:
      "Самое романтичное место Хайнаня. Расскажу, когда ехать, чтобы не стоять в очереди к знаменитым камням.",
  },
  {
    id: "luhuitou",
    name: "Парк Лухуэйтоу",
    nameZh: "鹿回头公园",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "parks",
    lat: 18.2254,
    lng: 109.4893,
    isFree: true,
    emoji: "🌄",
    shortDescription:
      "Смотровая над городом с легендой про оленя. Поднимайся на закате — вся Санья как на ладони!",
  },
  {
    id: "cdf-mall",
    name: "CDF Mall (duty-free)",
    nameZh: "三亚国际免税城",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "shopping",
    lat: 18.3536,
    lng: 109.73,
    isFree: false,
    emoji: "🛍️",
    shortDescription:
      "Duty-free без аэропорта: как оформить покупки, что реально выгодно и где там нормальная еда.",
  },
  {
    id: "dici-market",
    name: "Рынок Дицы (первый рынок)",
    nameZh: "第一市场",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "food",
    subcategory: "markets",
    lat: 18.2415,
    lng: 109.501,
    isFree: true,
    emoji: "🦐",
    shortDescription:
      "Первый рынок города: выбираешь морепродукты внизу — наверху готовят за пару юаней. Торговаться — норма!",
  },
  {
    id: "houhai",
    name: "Сёрф-деревня Хоухай",
    nameZh: "后海村",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "entertainment",
    lat: 18.2994,
    lng: 109.7223,
    isFree: true,
    emoji: "🏄",
    shortDescription:
      "Деревня сёрферов у бухты: доска и инструктор за копейки, вечером — бары прямо на песке. Мой любимый вайб!",
  },
  {
    id: "yanoda",
    name: "Парк Янода (тропический лес)",
    nameZh: "呀诺达雨林文化旅游区",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "parks",
    lat: 18.563,
    lng: 109.632,
    isFree: false,
    emoji: "🌿",
    shortDescription:
      "Мосты над джунглями и водопады: маршрут на день, что надеть и как выжить во влажности 90%.",
  },
  {
    id: "nantian",
    name: "Горячие источники Наньтянь",
    nameZh: "南田温泉",
    gettingThere: "",
    prices: "",
    photoUrl: "",
    category: "spa",
    lat: 18.4481,
    lng: 109.6569,
    isFree: false,
    emoji: "♨️",
    shortDescription:
      "30+ бассейнов с горячей водой среди пальм. Когда ехать, какие чаны выбрать и где взять скидку.",
  },
];
