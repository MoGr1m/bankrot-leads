import Link from "next/link";

export const metadata = {
  title: "Как это работает — Списание долгов",
};

const STEPS = [
  {
    title: "1. Заполняете форму на сайте",
    text: "Указываете примерную сумму долга, наличие официального дохода и телефон для связи. Это займёт меньше минуты и ни к чему не обязывает.",
  },
  {
    title: "2. Юрист перезванивает",
    text: "С вами связывается юрист из выбранного города (или конкретной юрфирмы, если вы оставили заявку с её страницы) и проводит бесплатную консультацию.",
  },
  {
    title: "3. Вы получаете оценку ситуации",
    text: "Юрист объясняет, подходит ли вам судебная или внесудебная процедура, какие документы понадобятся и сколько это будет стоить.",
  },
  {
    title: "4. Решаете, продолжать ли",
    text: "Вы ничего не должны сайту и не обязаны заключать договор — решение остаётся за вами.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <h1 className="text-2xl font-bold">Как это работает</h1>
      <p className="text-slate-600 text-sm">
        Сайт помогает быстро выйти на юриста по банкротству физлиц в вашем
        городе. Вот что происходит после того, как вы оставляете заявку.
      </p>

      <div className="space-y-6">
        {STEPS.map((step) => (
          <div key={step.title}>
            <h2 className="font-semibold mb-1">{step.title}</h2>
            <p className="text-slate-600 text-sm">{step.text}</p>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="inline-block rounded-md bg-slate-900 text-white px-5 py-2.5 font-medium"
      >
        Выбрать город и начать
      </Link>
    </div>
  );
}
