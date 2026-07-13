// Общий шаблон для коротких страниц-политик (проверка, отзывы, реклама).
export function PolicyPage({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; text: string }[];
}) {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-14 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold mb-2">{s.heading}</h2>
            <p className="text-slate-700 leading-relaxed">{s.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
