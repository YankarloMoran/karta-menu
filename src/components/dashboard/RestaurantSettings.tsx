'use client';

import React, { useState } from 'react';
import { Restaurant } from '@/lib/types/database';
import { Settings, Save, Check, Phone } from 'lucide-react';

interface RestaurantSettingsProps {
  restaurant: Restaurant;
  onUpdate: (updated: Restaurant) => void;
}

export const RestaurantSettings: React.FC<RestaurantSettingsProps> = ({
  restaurant,
  onUpdate,
}) => {
  const [form, setForm] = useState<Restaurant>(restaurant);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Configuración del Establecimiento</span>
        </h2>
        <p className="text-xs text-slate-400">
          Personaliza la información pública de tu restaurante, logo, banner y contacto para pedidos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 bg-slate-950/70">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Nombre del Restaurante</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Slug (URL amigable)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Descripción / Eslogan</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              Teléfono WhatsApp (con clave de país)
            </label>
            <input
              type="text"
              value={form.phone_whatsapp}
              onChange={(e) => setForm({ ...form, phone_whatsapp: e.target.value })}
              placeholder="+5215512345678"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Moneda Principal</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="USD">USD ($)</option>
              <option value="MXN">MXN ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="COP">COP ($)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300">URL del Logo</label>
            <input
              type="url"
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">URL de Banner Hero</label>
            <input
              type="url"
              value={form.banner_url}
              onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs shadow-lg glow-accent active:scale-95 transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? '¡Guardado Correctamente!' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
