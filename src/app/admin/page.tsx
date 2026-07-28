'use client';

import React, { useState } from 'react';
import { Sidebar, DashboardTab } from '@/components/dashboard/Sidebar';
import { OverviewStats } from '@/components/dashboard/OverviewStats';
import { LiveOrdersKanban } from '@/components/dashboard/LiveOrdersKanban';
import { QRGenerator } from '@/components/dashboard/QRGenerator';
import { MenuManager } from '@/components/dashboard/MenuManager';
import { RestaurantSettings } from '@/components/dashboard/RestaurantSettings';
import { SAMPLE_RESTAURANT } from '@/lib/data/mockData';
import { Restaurant } from '@/lib/types/database';
import { Bell, Search, UserCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [restaurant, setRestaurant] = useState<Restaurant>(SAMPLE_RESTAURANT);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        restaurantName={restaurant.name}
        slug={restaurant.slug}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight">
              {activeTab === 'overview' && 'Vista General & Analíticas'}
              {activeTab === 'orders' && 'Comandero en Vivo (KDS)'}
              {activeTab === 'qr' && 'Generador QR para Mesas'}
              {activeTab === 'menu' && 'Gestión del Menú & Platillos'}
              {activeTab === 'settings' && 'Configuración del Negocio'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              <Bell className="w-4 h-4 text-orange-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-white leading-none">Admin Chef</p>
                <p className="text-[10px] text-slate-400">Gerente de Turno</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="p-6 overflow-y-auto flex-1">
          {activeTab === 'overview' && <OverviewStats />}
          {activeTab === 'orders' && <LiveOrdersKanban />}
          {activeTab === 'qr' && <QRGenerator slug={restaurant.slug} />}
          {activeTab === 'menu' && <MenuManager />}
          {activeTab === 'settings' && (
            <RestaurantSettings restaurant={restaurant} onUpdate={setRestaurant} />
          )}
        </main>
      </div>
    </div>
  );
}
