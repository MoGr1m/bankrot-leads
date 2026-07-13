import { Calculator as CalcIcon } from "lucide-react";
import { CostCalculator } from "@/components/CostCalculator";

export const metadata = {
  title: "Калькулятор стоимости банкротства — ориентировочный разбор",
  description:
    "Ориентировочный разбор вашей ситуации: вероятный маршрут процедуры, из чего складывается стоимость банкротства и что требует анализа юриста.",
};

export default function CalculatorCostPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-2xl px-4 py-14">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <CalcIcon size={22} />
          </span>
          <h1 className="text-3xl font-bold mb-3">
            Ориентировочный разбор стоимости
          </h1>
          <p className="text-blue-50">
            Не показываем точную цену — она зависит от многих факторов. Покажем
            вероятный маршрут процедуры и из чего складывается стоимость.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <CostCalculator />
      </div>
    </div>
  );
}
