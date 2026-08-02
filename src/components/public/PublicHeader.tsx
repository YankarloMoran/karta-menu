'use client';

import React from 'react';
import { Restaurant } from '@/lib/types/database';
import { MapPin, Clock, Sparkles } from 'lucide-react';

interface PublicHeaderProps {
  restaurant: Restaurant;
  tableNumber: string | null;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  restaurant,
  tableNumber,
}) => {
  return (
    <header className="relative w-full overflow-hidden">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <img
          src={restaurant.banner_url}
          alt={restaurant.name}
          className="w-full h-full object-cover object-center filter brightness-90 transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
        
        {/* Top Floating Table Indicator */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          {tableNumber ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-bold text-xs shadow-lg">
              <MapPin className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
              <span>Mesa #{tableNumber}</span>
            </div>
          ) : <div />}
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 mb-6">
        <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 shadow-2xl border border-indigo-500/20 bg-slate-950/80">
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl glow-accent flex-shrink-0"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {restaurant.name}
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Abierto Ahora
              </span>
            </div>

            <p className="text-slate-300 text-xs md:text-sm line-clamp-2 leading-relaxed">
              {restaurant.description}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Prep. promedio: 12-20 min
              </span>
              <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                4.9 ★ (340+ opiniones)
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
