import {
  type City,
  type Organization,
  getConfidence,
  getOrganizations,
} from "@/lib/organizations";

// Ответы квиза подбора. Собираются на клиенте, кодируются в URL и читаются
// на странице результата (server component), где по ним идёт подбор.
export type QuizAnswers = {
  city: string; // slug города
  debtAmount: string; // диапазон суммы долга
  debtTypes: string[]; // виды долгов
  overdue: string; // стадия взыскания
  income: string; // есть ли официальный доход
  property: string[]; // имущество
  deals: string; // сделки с имуществом за последние годы
};

export type MatchedCompany = {
  org: Organization;
  // Почему компания в подборке — только честные, проверяемые сигналы.
  // Специализацию под ситуацию мы не выдумываем: данных о ней нет.
  reasons: string[];
};

// ВАЖНО про метод подбора (честность — разделы 6.4 и 20.5 ТЗ):
// у нас нет данных о специализации компаний (работа с ипотекой, суммы и т.п.),
// поэтому нельзя утверждать, что фирма «подходит по сумме долга». Единственный
// достоверный сигнал соответствия из ответов — город. Внутри города компании
// ранжируются по достоверности данных (найдены реквизиты → выше уверенность →
// выше рейтинг). Сама ситуация пользователя передаётся в заявку для консультации.
export function matchCompanies(
  answers: QuizAnswers,
  city: City
): MatchedCompany[] {
  const orgs = getOrganizations(city);

  const ranked = [...orgs].sort((a, b) => {
    // 1. Приоритет тем, у кого установлены реквизиты юрлица
    const reqDiff = Number(Boolean(b.inn)) - Number(Boolean(a.inn));
    if (reqDiff !== 0) return reqDiff;
    // 2. По количеству отзывов (прокси достоверности, раздел 11.4)
    const reviewDiff = b.reviewCount - a.reviewCount;
    if (reviewDiff !== 0) return reviewDiff;
    // 3. По рейтингу 2ГИС
    return (b.rating ?? 0) - (a.rating ?? 0);
  });

  // По ТЗ (раздел 1.6, 10.14) показываем 3–5 компаний
  const top = ranked.slice(0, 5);

  return top.map((org) => ({ org, reasons: buildReasons(org, city) }));
}

function buildReasons(org: Organization, city: City): string[] {
  const reasons: string[] = [`Работает в вашем городе — ${city.title}`];

  if (org.inn) {
    reasons.push(`Реквизиты юрлица установлены (ИНН ${org.inn})`);
  }

  const confidence = getConfidence(org);
  if (confidence.level === "high" && org.rating !== null) {
    reasons.push(
      `${org.reviewCount} отзывов, рейтинг ${org.rating} — по данным 2ГИС`
    );
  } else if (confidence.level === "medium") {
    reasons.push(`${org.reviewCount} отзывов — по данным 2ГИС`);
  }

  if (org.address) {
    reasons.push(`Офис: ${org.address}`);
  }

  return reasons;
}
