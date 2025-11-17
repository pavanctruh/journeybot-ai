"use client";

export default function GroupSizeUi({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  const options = ["Solo", "Couple", "Family", "Friends"];
  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
