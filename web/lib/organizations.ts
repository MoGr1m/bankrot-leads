import fs from "node:fs";
import path from "node:path";

// Данные лежат в data/ в корне проекта (на уровень выше папки web/) —
// туда их кладёт python-парсер src/parsers/parse_2gis.py
const DATA_DIR = path.join(process.cwd(), "..", "data");

export type Organization = {
  id: string;
  name: string;
  address: string | null;
  rating: number | null;
  reviewCount: number;
};

export type City = {
  slug: string;
  title: string;
  // Название файла в data/, как его сохранил парсер (кириллица, без .json)
  dataFileName: string;
};

// Список пилотных городов — совпадает с PILOT_CITIES в parse_2gis.py
export const CITIES: City[] = [
  { slug: "chelyabinsk", title: "Челябинск", dataFileName: "Челябинск" },
  { slug: "perm", title: "Пермь", dataFileName: "Пермь" },
  { slug: "voronezh", title: "Воронеж", dataFileName: "Воронеж" },
];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug);
}

type RawOrganization = {
  id?: unknown;
  name?: unknown;
  address_name?: unknown;
  reviews?: {
    general_rating?: unknown;
    general_review_count?: unknown;
  };
};

export function getOrganizations(city: City): Organization[] {
  const filePath = path.join(DATA_DIR, `${city.dataFileName}.json`);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const items = JSON.parse(raw) as RawOrganization[];

  return items
    .filter((item): item is RawOrganization & { id: string; name: string } =>
      typeof item.id === "string" && typeof item.name === "string"
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      address: typeof item.address_name === "string" ? item.address_name : null,
      rating:
        typeof item.reviews?.general_rating === "number"
          ? item.reviews.general_rating
          : null,
      reviewCount:
        typeof item.reviews?.general_review_count === "number"
          ? item.reviews.general_review_count
          : 0,
    }));
}
