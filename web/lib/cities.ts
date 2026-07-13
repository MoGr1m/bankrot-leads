// Список городов и их типы вынесены в отдельный модуль БЕЗ node:fs,
// чтобы его можно было импортировать в клиентские компоненты (квиз и др.).
// organizations.ts (использует fs для чтения данных) реэкспортирует это.

export type City = {
  slug: string;
  title: string;
  // Название файла в data/, как его сохранил парсер (кириллица, без .json)
  dataFileName: string;
};

export const CITIES: City[] = [
  { slug: "moskva", title: "Москва", dataFileName: "Москва" },
  { slug: "sankt-peterburg", title: "Санкт-Петербург", dataFileName: "Санкт-Петербург" },
  { slug: "chelyabinsk", title: "Челябинск", dataFileName: "Челябинск" },
  { slug: "perm", title: "Пермь", dataFileName: "Пермь" },
  { slug: "voronezh", title: "Воронеж", dataFileName: "Воронеж" },
];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug);
}
