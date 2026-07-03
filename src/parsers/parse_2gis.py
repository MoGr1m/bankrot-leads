"""
Парсер юрфирм по банкротству физлиц через Каталог API 2ГИС.

Как получить ключ API:
1. Зарегистрироваться на https://dev.2gis.com/
2. Оформить доступ к Каталог API (для теста подходит пробный ключ,
   для коммерческого использования нужен партнёрский договор)
3. Вписать ключ в .env (переменная GIS_2GIS_API_KEY)

ВАЖНО: перед запуском проверь актуальные параметры запроса в документации
https://docs.2gis.com/ru/api/search/places/overview — структура API могла
измениться с момента написания скрипта, здесь взяты параметры на дату написания.
"""

import json
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GIS_2GIS_API_KEY")
BASE_URL = "https://catalog.api.2gis.com/3.0/items"

# Поисковый запрос: рубрика "юридические услуги" + ключевое слово "банкротство"
SEARCH_QUERY = "банкротство физических лиц"


def fetch_organizations(city_name: str, page_size: int = 20) -> list[dict]:
    """
    Получает список организаций по поисковому запросу в указанном городе.

    Название города передаётся прямо в тексте запроса (q) — так проще всего
    для старта. Если 2ГИС даст менее релевантную выдачу, можно будет перейти
    на фильтрацию по region_id конкретного города (см. документацию).
    """
    if not API_KEY:
        raise RuntimeError("Не найден GIS_2GIS_API_KEY — заполни .env")

    results: list[dict] = []
    page = 1

    while True:
        params = {
            "q": f"{SEARCH_QUERY} {city_name}",
            "key": API_KEY,
            "page": page,
            "page_size": page_size,
            "fields": "items.point,items.contact_groups,items.reviews",
        }
        response = requests.get(BASE_URL, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        items = data.get("result", {}).get("items", [])
        if not items:
            break

        results.extend(items)

        # Если организаций на странице меньше размера страницы — это последняя страница
        if len(items) < page_size:
            break

        page += 1
        time.sleep(1)  # пауза, чтобы не долбить API слишком часто

    return results


def save_to_json(data: list[dict], city_name: str) -> None:
    """Сохраняет сырые данные в data/{город}.json для дальнейшей обработки."""
    output_path = f"data/{city_name}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Сохранено {len(data)} организаций в {output_path}")


if __name__ == "__main__":
    # Пилотный город для первого теста — поменяй на нужный из списка недели 1-2
    pilot_city = "Казань"
    orgs = fetch_organizations(pilot_city)
    save_to_json(orgs, pilot_city)
