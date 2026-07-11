import fs from "node:fs";
import path from "node:path";

// Данные лежат в data/ в корне проекта (на уровень выше папки web/) —
// туда их кладёт python-парсер src/parsers/parse_2gis.py
const DATA_DIR = path.join(process.cwd(), "..", "data");

export type Organization = {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  rating: number | null;
  reviewCount: number;
};

// Таблица транслитерации кириллицы в латиницу для человекочитаемых URL
// (/{city}/{slug}/ вместо /{city}/{id}/ — так и SEO лучше, и ссылка понятнее)
const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((char) => TRANSLIT_MAP[char] ?? char)
    .join("");
}

// Превращает название компании в URL-слаг: транслитерация + замена всего,
// что не буква/цифра, на дефис
function slugify(name: string): string {
  return transliterate(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Некоторые названия юрфирм повторяются в пределах города (например,
// франшиза "Бизнес-Юрист" встречается по нескольку раз с разными адресами) —
// добавляем короткий суффикс из id, чтобы слаги внутри города были уникальными
function makeUniqueSlugs<T extends { id: string; name: string }>(
  items: T[]
): Map<string, string> {
  const baseSlugCounts = new Map<string, number>();
  const idToSlug = new Map<string, string>();

  for (const item of items) {
    const base = slugify(item.name) || "kompaniya";
    const seenCount = baseSlugCounts.get(base) ?? 0;
    baseSlugCounts.set(base, seenCount + 1);

    const slug = seenCount === 0 ? base : `${base}-${item.id.slice(-5)}`;
    idToSlug.set(item.id, slug);
  }

  return idToSlug;
}

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

  const validItems = items.filter(
    (item): item is RawOrganization & { id: string; name: string } =>
      typeof item.id === "string" && typeof item.name === "string"
  );
  const slugs = makeUniqueSlugs(validItems);

  return validItems.map((item) => ({
    id: item.id,
    slug: slugs.get(item.id)!,
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

// Находит юрфирму по слагу для страницы профиля /{city}/{company}/
export function getOrganizationBySlug(
  city: City,
  slug: string
): Organization | undefined {
  return getOrganizations(city).find((org) => org.slug === slug);
}
