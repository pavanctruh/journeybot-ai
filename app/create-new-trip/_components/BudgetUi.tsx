"use client";

export default function BudgetUi({
  onSelectOption,
}: {
  onSelectOption: (value: string) => void;
}) {
  const options = ["Low", "Medium", "Luxury"];
  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelectOption(opt)}
          className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
