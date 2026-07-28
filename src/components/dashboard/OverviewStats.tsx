'use client';

import React from 'react';
import { DollarSign, ShoppingCart, QrCode, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
  { hour: '12:00', ventas: 120, escaneos: 18 },
  { hour: '14:00', ventas: 240, escaneos: 35 },
  { hour: '16:00', ventas: 180, escaneos: 22 },
  { hour: '18:00', ventas: 310, escaneos: 48 },
  { hour: '20:00', ventas: 420, escaneos: 64 },
  { hour: '22:00', ventas: 290, escaneos: 30 },
];

export const OverviewStats: React.FC = () => {
  const stats = [
    {
      title: 'Ventas de Hoy',
      value: '$1,560.00',
      change: '+14.2%',
      isPositive: true,
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/5',
    },
    {
      title: 'Pedidos Activos',
      value: '3 En Cocina',
      change: '2 pendientes',
      isPositive: true,
      icon: <ShoppingCart className="w-5 h-5 text-orange-400" />,
      color: 'border-orange-500/30 bg-orange-500/5',
    },
    {
      title: 'Escaneos QR Hoy',
      value: '217 Vistas',
      change: '+28%',
      isPositive: true,
      icon: <QrCode className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/5',
    },
    {
      title: 'Platillo Estrella',
      value: 'Tacos Entraña',
      change: '42 ordenados',
      isPositive: true,
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`glass-panel p-5 rounded-2xl border ${stat.color} shadow-lg space-y-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                {stat.icon}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales & Scans Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>Actividad de Ventas y Escaneos QR de Hoy</span>
            </h3>
            <p className="text-xs text-slate-400">
              Distribución por horario pico de atención en el establecimiento
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-orange-500"></span>
              <span className="text-slate-300">Ventas ($)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-blue-500"></span>
              <span className="text-slate-300">Escaneos</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="ventas" fill="#f97316" radius={[6, 6, 0, 0]} />
              <Bar dataKey="escaneos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
