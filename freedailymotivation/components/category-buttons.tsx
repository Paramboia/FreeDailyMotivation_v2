"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryButtonsProps {
  categories: string[];
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export default function CategoryButtons({ categories, onCategorySelect, selectedCategory }: CategoryButtonsProps) {
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      onCategorySelect(null);
    } else {
      onCategorySelect(category);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {categories.map((category) => (
        <Button 
          key={category} 
          variant="secondary"
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "transition-colors font-bold",
            selectedCategory === category
              ? "bg-primary text-primary-foreground dark:bg-white dark:text-black"
              : "bg-secondary text-secondary-foreground dark:bg-[#333] dark:text-white dark:hover:bg-[#444]"
          )}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)} {/* Capitalize the first letter */}
        </Button>
      ))}
    </div>
  );
}
