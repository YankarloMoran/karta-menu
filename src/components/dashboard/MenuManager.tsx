'use client';

import React, { useState } from 'react';
import { Category, MenuItem } from '@/lib/types/database';
import { SAMPLE_CATEGORIES, SAMPLE_MENU_ITEMS } from '@/lib/data/mockData';
import { UtensilsCrossed, Plus, Edit2, Eye, EyeOff } from 'lucide-react';

export const MenuManager: React.FC = () => {
  const [categories] = useState<Category[]>(SAMPLE_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  // New Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImg, setNewItemImg] = useState('');

  const toggleAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, is_available: !item.is_available } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const created: MenuItem = {
      id: `item-${Date.now()}`,
      restaurant_id: 'rest-001',
      category_id: selectedCatId || categories[0]?.id || 'cat-entradas',
      name: newItemName,
      description: newItemDesc,
      price: parseFloat(newItemPrice) || 12.00,
      image_url: newItemImg || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      allergens: [],
      dietary_tags: ['Nuevo'],
      is_available: true,
      is_featured: false,
      preparation_time_mins: 15,
      sort_order: menuItems.length + 1,
    };

    setMenuItems([created, ...menuItems]);
    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemImg('');
  };

  const filteredItems = selectedCatId
    ? menuItems.filter((i) => i.category_id === selectedCatId)
    : menuItems;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-400" />
            <span>Gestor de Categorías y Platillos</span>
          </h2>
          <p className="text-xs text-slate-400">
            Administra los precios, disponibilidad, imágenes y modificadores de tu menú.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg glow-accent active:scale-95 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Platillo</span>
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCatId(null)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCatId === null
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todos ({menuItems.length})
        </button>
        {categories.map((cat) => {
          const count = menuItems.filter((i) => i.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCatId === cat.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`glass-panel p-4 rounded-2xl border ${
              item.is_available ? 'border-slate-800' : 'border-slate-800 opacity-60'
            } flex flex-col justify-between space-y-4`}
          >
            <div className="flex items-start gap-3">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-800"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <span className="text-sm font-black text-orange-400">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  item.is_available
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.is_available ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Disponible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Agotado</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-2 hover:text-white rounded-lg hover:bg-slate-900">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Agregar Nuevo Platillo</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300">Nombre del Platillo</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ej. Ribeye a la mantequilla de ajo"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300">Descripción</label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Descripción jugosa del platillo..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300">Precio ($ USD)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="22.50"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300">URL de Imagen</label>
                <input
                  type="url"
                  value={newItemImg}
                  onChange={(e) => setNewItemImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-lg"
                >
                  Guardar Platillo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
