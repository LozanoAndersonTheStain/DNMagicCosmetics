"use client";

import { useState } from "react";
import { categoryItems } from "@/seed/category";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number } | null;
  inStock: boolean;
}

export const ProductFilters = ({ onFilterChange }: ProductFiltersProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);

  // Crear array de categorías con "Todos" al final
  const allCategories = [
    ...categoryItems.map(item => ({
      id: item.name.toLowerCase().replace(/\s+/g, "-"),
      name: item.name,
      originalId: item.id
    })),
    { id: "todos", name: "Todos", originalId: 999 }
  ];

  const handleCategoryChange = (categoryId: string) => {
    let newCategories: string[];
    
    if (categoryId === "todos") {
      newCategories = selectedCategories.includes("todos") ? [] : ["todos"];
    } else {
      if (selectedCategories.includes(categoryId)) {
        newCategories = selectedCategories.filter(id => id !== categoryId);
      } else {
        newCategories = [...selectedCategories.filter(id => id !== "todos"), categoryId];
      }
    }
    
    setSelectedCategories(newCategories);
    onFilterChange({
      categories: newCategories,
      priceRange: null,
      inStock: true
    });
  };

  const displayedCategories = showMore ? allCategories : allCategories.slice(0, 7);

  return (
    <div className="bg-pink-200 rounded-lg p-6 w-full max-w-sm">
      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Filtrar
      </h2>

      {/* Por categoría */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-dotted border-gray-400">
          Por categoría
        </h3>
        
        <div className="space-y-3">
          {displayedCategories.map((category) => (
            <label
              key={category.id}
              className="flex items-center cursor-pointer hover:bg-pink-100 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  selectedCategories.includes(category.id) 
                    ? 'bg-pink-600' 
                    : 'bg-pink-400'
                }`} />
                <span className={`text-gray-800 font-medium ${
                  category.id === "todos" ? "text-pink-600" : ""
                }`}>
                  {category.name}
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* Ver más button */}
        {allCategories.length > 7 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-4 text-gray-600 hover:text-gray-800 transition-colors underline text-sm"
          >
            {showMore ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>
    </div>
  );
};