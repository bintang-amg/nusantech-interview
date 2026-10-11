export interface CategoryOption<T extends string = string> {
  value: T;
  label: string;
}

interface CategoryTabsProps<T extends string> {
  categories: CategoryOption<T>[];
  active: T;
  onChange: (value: T) => void;
}

export function CategoryTabs<T extends string>({
  categories,
  active,
  onChange,
}: CategoryTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Movie categories"
      className="flex flex-wrap gap-2"
    >
      {categories.map((category) => {
        const isActive = category.value === active;
        return (
          <button
            key={category.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
