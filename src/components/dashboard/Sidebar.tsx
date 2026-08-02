'use client';

import React from 'react';
import {
  LayoutDashboard,
  ChefHat,
  QrCode,
  UtensilsCrossed,
  Settings,
  ExternalLink,
  Store,
  LogOut,
} from 'lucide-react';

export type DashboardTab = 'overview' | 'orders' | 'qr' | 'menu' | 'settings';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  restaurantName: string;
  slug: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  restaurantName,
  slug,
  onLogout,
}) => {
  const menuItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Vista General',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'orders',
      label: 'Pedidos en Vivo (KDS)',
      icon: <ChefHat className="w-4 h-4" />,
      badge: '3',
    },
    {
      id: 'qr',
      label: 'Generador QR Mesas',
      icon: <QrCode className="w-4 h-4" />,
    },
    {
      id: 'menu',
      label: 'Gestor del Menú',
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between p-4 bg-slate-950/90">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg glow-accent font-black">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">Cartly</h2>
            <p className="text-[11px] text-cyan-400 font-medium truncate max-w-[130px]">
              {restaurantName}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-500/20 text-cyan-300 border border-indigo-500/40 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500 text-slate-950 font-extrabold shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Public Menu Link & Logout Footer */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <a
          href={`/menu/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all group"
        >
          <span className="font-semibold">Ver Menú Público</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </a>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
};
