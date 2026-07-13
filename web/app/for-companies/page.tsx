import { Handshake } from "lucide-react";

export const metadata = {
  title: "Для юридических компаний — размещение и заявки",
  description:
    "Как получать обращения от клиентов по банкротству, что считается заявкой и как устроена проверка профиля компании.",
};

const BLOCKS = [
  {
    heading: "Как это работает",
    text: "Пользователь проходит подбор, выбирает до трёх компаний и передаёт им контакт вместе с ответами анкеты. Вы получаете обращение с описанием ситуации клиента.",
  },
  {
    heading: "Что получает компания",
    text: "Имя, телефон и ответы анкеты (город, сумма и виды долга, доход, имущество). Клиент выбирает вас осознанно — из объяснённого списка, а не вслепую.",
  },
  {
    heading: "Что нельзя купить",
    text: "Место в подборе, статус проверки и возможность скрыть, что сведения о компании не подтверждены. Порядок в каталоге зависит от достоверности данных, а не от оплаты.",
  },
  {
    heading: "Проверка профиля",
    text: "Мы сопоставляем реквизиты с ЕГРЮЛ. Расширенная проверка (договор, цены, судебная практика, отзывы с подтверждением) — в развитии. Добавить или уточнить данные компании можно, написав нам.",
  },
];

export default function ForCompaniesPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <Handshake size={22} />
          </span>
          <h1 className="text-3xl font-bold mb-3">Для юридических компаний</h1>
          <p className="text-blue-50 max-w-2xl">
            Получайте обращения от клиентов, которые осознанно выбрали вашу
            компанию, и развивайте проверенный профиль.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-14 space-y-8">
        {BLOCKS.map((b) => (
          <section key={b.heading}>
            <h2 className="text-xl font-bold mb-2">{b.heading}</h2>
            <p className="text-slate-700 leading-relaxed">{b.text}</p>
          </section>
        ))}
        <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
          Чтобы добавить компанию или уточнить данные, напишите нам — контакты в
          разделе «О нас».
        </div>
      </div>
    </div>
  );
}
