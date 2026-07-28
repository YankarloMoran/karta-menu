'use client';

import React from 'react';
import { Category } from '@/lib/types/database';
import { Sparkles, UtensilsCrossed, Flame, Wine, Cake, Utensils, Search, Filter } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles className="w-4 h-4" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-4 h-4" />;
    case 'Flame':
      return <Flame className="w-4 h-4" />;
    case 'Wine':
      return <Wine className="w-4 h-4" />;
    case 'Cake':
      return <Cake className="w-4 h-4" />;
    default:
      return <Utensils className="w-4 h-4" />;
  }
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
}) => {
  const dietaryTags = [
    { key: 'Sin Gluten', label: 'Sin Gluten' },
    { key: 'Vegetariano', label: 'Vegetariano' },
    { key: 'Especial del Chef', label: 'Especial del Chef' },
  ];

  return (
    <div className="sticky top-0 z-30 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 py-3 px-4 shadow-xl">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar platillos, bebidas, ingredientes..."
            className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-md"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === null
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg glow-accent scale-105'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Todo el Menú</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg glow-accent scale-105'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dietary Tag Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mr-1 flex-shrink-0">
            <Filter className="w-3 h-3 text-orange-400" />
            <span>Filtros:</span>
          </div>

          {dietaryTags.map((tag) => {
            const isSelected = selectedTag === tag.key;
            return (
              <button
                key={tag.key}
                onClick={() => onSelectTag(isSelected ? null : tag.key)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
