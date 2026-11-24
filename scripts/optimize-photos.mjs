// Разовая оптимизация фото Сабины: jpg -> webp (~80) в public/images/photos/
// Запуск: node scripts/optimize-photos.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SRC = "C:/tmp/panda-hero/фото-сабины";
const OUT = fileURLToPath(new URL("../public/images/photos/", import.meta.url));

// осмысленные имена вместо санья-XX (по содержимому кадра)
const names = {
  "01": "strawberry-fabric", // клубничная ткань (крафт-декор)
  "02": "vichy-tape", // скотч в розовую клетку
  "03": "craft-cookies", // крафтовое печенье
  "04": "polka-note", // рамка-записка в горошек
  "05": "star-button", // пуговица-звезда
  "06": "craft-envelope", // крафтовый конверт
  "07": "pink-cocktail", // розовый коктейль
  "08": "itasha-car", // itasha-авто с аниме-наклейками
  "09": "cafe-cakes", // витрина кафе с тортами
  "10": "bay-mascots", // набережная залива с фигурами Чиикавы
  "11": "maneki-neko", // полки с манэки-нэко
  "12": "sea-sunset", // закат над морем
  "13": "flower-button", // пуговица-цветок
  "14": "angel-cookie", // печенье «Angel»
  "15": "gingham-frame", // рамка в красную клетку
  "16": "itasha-hotel", // itasha у розового отеля
  "17": "coconut-beach", // кокос с гибискусом на пляже
  "18": "night-carousel", // ночная карусель с лентами
  "19": "strawberry-cake", // клубничный торт
  "20": "guanyin-statue", // статуя Гуаньинь в Наньшане
};

await mkdir(OUT, { recursive: true });

for (const [num, name] of Object.entries(names)) {
  const input = path.join(SRC, `санья-${num}.jpg`);
  const output = path.join(OUT, `${name}.webp`);
  const info = await sharp(input)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  console.log(
    `${name}.webp ${(info.size / 1024).toFixed(0)} KB ${info.width}x${info.height}`
  );
}
