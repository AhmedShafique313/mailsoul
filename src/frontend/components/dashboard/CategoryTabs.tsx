"use client";

import { categoryMeta, type CategoryKey } from "@/frontend/components/dashboard/data";

type Props = {
  activeCategory: CategoryKey | "all";
  onSelectCategory: (category: CategoryKey | "all") => void;
};

export default function CategoryTabs({ activeCategory, onSelectCategory }: Props) {
  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      <button
        type="button"
        onClick={() => onSelectCategory("all")}
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          activeCategory === "all"
            ? "bg-white/10 text-white"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        All
      </button>
      {categoryMeta.map((category) => (
        <button
          key={category.key}
          type="button"
          onClick={() => onSelectCategory(category.key)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeCategory === category.key
              ? "bg-white/10 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
