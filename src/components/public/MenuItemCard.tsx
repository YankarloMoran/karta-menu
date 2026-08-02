'use client';

import React from 'react';
import { MenuItem } from '@/lib/types/database';
import { Plus, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  currency?: string;
  onSelectItem: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  currency = 'USD',
  onSelectItem,
}) => {
  const hasOptions = item.options && item.options.length > 0;

  return (
    <div
      onClick={() => onSelectItem(item)}
      className="glass-panel-interactive rounded-2xl overflow-hidden cursor-pointer flex flex-col md:flex-row group border border-indigo-500/15"
    >
      {/* Dish Image */}
      <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0 overflow-hidden bg-slate-950">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.is_featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Destacado
          </span>
        )}
        <div className="absolute bottom-2 right-2 md:hidden bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] text-slate-300 flex items-center gap-1">
          <Clock className="w-3 h-3 text-cyan-400" />
          {item.preparation_time_mins}m
        </div>
      </div>

      {/* Dish Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
              {item.name}
            </h3>
            <span className="text-base font-extrabold text-cyan-400 whitespace-nowrap">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>

          {/* Badges & Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {item.dietary_tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                {tag}
              </span>
            ))}
            {item.allergens?.map((allergen) => (
              <span
                key={allergen}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60 flex items-center gap-1"
              >
                <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                {allergen}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button & Metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="hidden md:flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {item.preparation_time_mins} min aprox.
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(item);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 group/btn"
          >
            <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
            <span>{hasOptions ? 'Personalizar' : 'Agregar al Carrito'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
