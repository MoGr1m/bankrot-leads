"""
Обогащение карточек юрфирм реквизитами (ИНН/ОГРН) через DaData «Подсказки».

Зачем: данные из 2ГИС содержат только вывеску/бренд, адрес и рейтинг. Для
карточки компании по ТЗ нужны реквизиты юрлица (ИНН, ОГРН, статус). DaData
suggest/party ищет организацию в ЕГРЮЛ по названию.

ВАЖНО про надёжность сопоставления:
Вывеска в 2ГИС часто НЕ совпадает с юридическим названием в ЕГРЮЛ (например,
бренд «Ваше право» зарегистрирован под другим ООО). Поэтому сопоставление
делается КОНСЕРВАТИВНО: реквизиты засчитываются, только если адрес найденной
в ЕГРЮЛ организации содержит нужный город И организация действующая. Это
снижает покрытие, но защищает от показа чужого ИНН — что критично для
юридического продукта. Всё найденное помечается как «предположительное,
требует ручной проверки» (уровень верификации в UI остаётся низким).

Ключ: DADATA_API_KEY в .env (тариф «Бесплатный» отдаёт ИНН/ОГРН из ЕГРЮЛ;
телефоны на бесплатном тарифе не отдаются — их здесь и не запрашиваем).
"""

from __future__ import annotations

import json
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("DADATA_API_KEY")
SUGGEST_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party"

# Города, чьи файлы data/{город}.json обогащаем. Имя файла = название города,
# оно же используется для сверки адреса из ЕГРЮЛ.
CITIES = ["Челябинск", "Пермь", "Воронеж"]


def query_dadata(name: str, count: int = 5) -> list[dict]:
    """Запрашивает у DaData кандидатов-организаций по названию."""
    if not API_KEY:
        raise RuntimeError("Не найден DADATA_API_KEY — заполни .env")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Token {API_KEY}",
    }
    body = {"query": name, "count": count}
    response = requests.post(SUGGEST_URL, headers=headers, json=body, timeout=15)
    response.raise_for_status()
    return response.json().get("suggestions", [])


def pick_match(suggestions: list[dict], city_name: str) -> dict | None:
    """
    Выбирает подходящего кандидата по консервативному правилу:
    адрес организации содержит нужный город И статус ACTIVE (действующая).
    Возвращает нормализованные поля реквизитов или None, если совпадения нет.
    """
    city_lower = city_name.lower()
    for item in suggestions:
        data = item.get("data", {})
        state = data.get("state", {})
        status = state.get("status")
        # Только действующие организации — ликвидированные не показываем
        if status != "ACTIVE":
            continue

        # Сверяем город: адрес из ЕГРЮЛ должен содержать название города.
        # address.value — полный адрес одной строкой.
        address = (data.get("address") or {}).get("value", "") or ""
        if city_lower not in address.lower():
            continue

        inn = data.get("inn")
        ogrn = data.get("ogrn")
        if not inn:
            continue

        # registration_date приходит как timestamp в миллисекундах
        reg_ts = state.get("registration_date")
        reg_date = None
        if reg_ts:
            reg_date = time.strftime("%Y-%m-%d", time.gmtime(reg_ts / 1000))

        return {
            "legal_name": (data.get("name") or {}).get("full_with_opf"),
            "inn": inn,
            "ogrn": ogrn,
            "registration_date": reg_date,
            "org_status": status,
            # Флаг: сопоставление автоматическое, не подтверждено вручную
            "dadata_matched": True,
        }
    return None


def enrich_city(city_name: str) -> tuple[int, int]:
    """Обогащает файл data/{город}.json. Возвращает (всего, сопоставлено)."""
    path = f"data/{city_name}.json"
    with open(path, encoding="utf-8") as f:
        items = json.load(f)

    matched = 0
    for org in items:
        name = org.get("name")
        if not name:
            continue
        # Вывеска 2ГИС часто содержит описание после запятой
        # («Астрея, фирма по банкротству...») — в ЕГРЮЛ такого нет.
        # Для поиска берём значимую часть до первой запятой.
        query_name = name.split(",")[0].strip()
        try:
            suggestions = query_dadata(query_name)
        except requests.HTTPError as error:
            print(f"  Ошибка запроса DaData для «{name}»: {error}")
            continue

        match = pick_match(suggestions, city_name)
        if match:
            org.update(match)
            matched += 1
        else:
            org["dadata_matched"] = False

        time.sleep(0.05)  # мягкая пауза между запросами

    with open(path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    return len(items), matched


if __name__ == "__main__":
    total_all = 0
    total_matched = 0
    for city in CITIES:
        total, matched = enrich_city(city)
        total_all += total
        total_matched += matched
        pct = round(matched / total * 100) if total else 0
        print(f"{city}: сопоставлено {matched} из {total} ({pct}%)")

    pct_all = round(total_matched / total_all * 100) if total_all else 0
    print(f"\nИТОГО: {total_matched} из {total_all} ({pct_all}%) юрфирм получили реквизиты")
