import fs from "node:fs";
import path from "node:path";
import { type City, CITIES, getCityBySlug } from "@/lib/cities";

// Реэкспорт для обратной совместимости — многие модули импортируют город
// из organizations.ts. Сами данные городов живут в cities.ts (без fs).
export { type City, CITIES, getCityBySlug };

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
  // Реквизиты из ЕГРЮЛ (через DaData). Заполнены не у всех — сопоставление
  // вывески 2ГИС с юрлицом удаётся примерно у 40% компаний. Где нет — null.
  legalName: string | null;
  inn: string | null;
  ogrn: string | null;
  registrationDate: string | null; // ISO-дата регистрации юрлица
  orgStatus: string | null; // ACTIVE и т.п.
  // Реквизиты сопоставлены автоматически (по названию + сверка города),
  // не подтверждены вручную. Влияет на честный «уровень проверки» в UI.
  requisitesAutoMatched: boolean;
  // Поля под будущее наполнение (цены/услуги пока не собираются) — заведены
  // заранее, чтобы модель и UI не переписывать при появлении данных.
  priceFrom: number | null;
  priceTo: number | null;
  services: string[];
};

// Уровень проверки компании — честно отражает, что мы реально знаем.
// Не завышаем: автоматически найденные реквизиты ≠ ручная проверка.
export type VerificationInfo = {
  level: number; // 0 — не проверено, 1 — реквизиты найдены автоматически
  label: string;
  note: string;
};

export function getVerification(org: Organization): VerificationInfo {
  if (org.inn) {
    return {
      level: 1,
      label: "Реквизиты найдены",
      note: "ИНН и ОГРН сопоставлены с ЕГРЮЛ автоматически по названию. Не подтверждены вручную — проверьте перед заключением договора.",
    };
  }
  return {
    level: 0,
    label: "Не проверено",
    note: "Данные только из открытого справочника 2ГИС. Реквизиты юрлица не установлены.",
  };
}

// Показатель уверенности в данных о компании (раздел 11.4 ТЗ) — не даёт
// малому числу отзывов выглядеть весомее большого. Свежести отзывов у нас
// нет, поэтому опираемся на их количество как доступный прокси.
export type ConfidenceLevel = {
  level: "high" | "medium" | "low";
  label: string;
};

export function getConfidence(org: Organization): ConfidenceLevel {
  if (org.rating !== null && org.reviewCount >= 30) {
    return { level: "high", label: "Высокая уверенность" };
  }
  if (org.reviewCount >= 5) {
    return { level: "medium", label: "Средняя уверенность" };
  }
  return { level: "low", label: "Мало данных" };
}

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

type RawOrganization = {
  id?: unknown;
  name?: unknown;
  address_name?: unknown;
  reviews?: {
    general_rating?: unknown;
    general_review_count?: unknown;
  };
  // Поля из DaData-обогащения (src/parsers/enrich_dadata.py)
  legal_name?: unknown;
  inn?: unknown;
  ogrn?: unknown;
  registration_date?: unknown;
  org_status?: unknown;
  dadata_matched?: unknown;
};

// Возвращает строку, если значение — непустая строка, иначе null.
function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

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
    address: asString(item.address_name),
    rating:
      typeof item.reviews?.general_rating === "number"
        ? item.reviews.general_rating
        : null,
    reviewCount:
      typeof item.reviews?.general_review_count === "number"
        ? item.reviews.general_review_count
        : 0,
    legalName: asString(item.legal_name),
    inn: asString(item.inn),
    ogrn: asString(item.ogrn),
    registrationDate: asString(item.registration_date),
    orgStatus: asString(item.org_status),
    requisitesAutoMatched: item.dadata_matched === true,
    priceFrom: null,
    priceTo: null,
    services: [],
  }));
}

// Находит юрфирму по слагу для страницы профиля /{city}/{company}/
export function getOrganizationBySlug(
  city: City,
  slug: string
): Organization | undefined {
  return getOrganizations(city).find((org) => org.slug === slug);
}
