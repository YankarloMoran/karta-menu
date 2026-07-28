'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/lib/types/database';
import { SAMPLE_ORDERS } from '@/lib/data/mockData';
import { Clock, MapPin, CheckCircle, Flame, AlertCircle, ArrowRight, User } from 'lucide-react';

export const LiveOrdersKanban: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const columns: { status: OrderStatus; label: string; color: string; badgeBg: string }[] = [
    { status: 'pending', label: 'Pendientes', color: 'border-amber-500/40', badgeBg: 'bg-amber-500' },
    { status: 'in_preparation', label: 'En Cocina', color: 'border-blue-500/40', badgeBg: 'bg-blue-500' },
    { status: 'ready', label: 'Listos para Servir', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500' },
    { status: 'completed', label: 'Entregados', color: 'border-slate-700', badgeBg: 'bg-slate-600' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span>Comandero en Vivo (KDS)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Control de comensales, tiempos de preparación y entrega en tiempo real
          </p>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className={`glass-panel p-4 rounded-2xl border ${col.color} flex flex-col justify-between min-h-[500px] bg-slate-950/70`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.badgeBg} animate-pulse`} />
                    <span className="text-xs font-extrabold uppercase text-white tracking-wider">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                    {colOrders.length}
                  </span>
                </div>

                {/* Orders Stack */}
                <div className="space-y-3">
                  {colOrders.length === 0 ? (
                    <div className="text-center py-12 text-slate-600 text-xs font-medium">
                      Sin pedidos en esta fase
                    </div>
                  ) : (
                    colOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3 hover:border-slate-700 transition-all"
                      >
                        {/* Order Header info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              Mesa #{ord.table_number || 'N/A'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              #{ord.id}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-400">
                            ${ord.total_amount.toFixed(2)}
                          </span>
                        </div>

                        {/* Customer & Time */}
                        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-500" />
                            {ord.customer_name || 'Comensal'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-400" />
                            hace 5 min
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1 text-xs">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-slate-200">
                              <span>
                                <strong className="text-orange-400">{item.quantity}x</strong>{' '}
                                {item.item_name}
                              </span>
                            </div>
                          ))}
                        </div>

                        {ord.notes && (
                          <div className="text-[11px] p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span>{ord.notes}</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-1.5">
                          {ord.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'in_preparation')}
                              className="w-full flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow"
                            >
                              <span>Aceptar a Cocina</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {ord.status === 'in_preparation' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'ready')}
                              className="w-full flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow"
                            >
                              <span>Marcar Listo</span>
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {ord.status === 'ready' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'completed')}
                              className="w-full flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all shadow"
                            >
                              <span>Entregado / Cerrar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
