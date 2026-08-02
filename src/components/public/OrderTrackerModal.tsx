'use client';

import React from 'react';
import { X, CheckCircle, Clock, Send, Sparkles, MapPin, ChefHat } from 'lucide-react';
import { OrderItem } from '@/lib/types/database';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  tableNumber: string | null;
  items: OrderItem[];
  totalAmount: number;
  whatsAppUrl: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orderId,
  tableNumber,
  items,
  totalAmount,
  whatsAppUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-[#0b0f19] space-y-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">¡Pedido Confirmado!</h3>
              <p className="text-[11px] text-slate-400 font-mono">#{orderId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Timeline Status */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Mesa #{tableNumber || '04'}
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              Tiempo est: 12-15 min
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Enviado por WhatsApp</p>
                <p className="text-[10px] text-slate-400">Comanda generada y entregada al negocio</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold shadow-md animate-pulse">
                <ChefHat className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-cyan-400">En Preparación (Cocina)</p>
                <p className="text-[10px] text-slate-400">El chef está preparando tus platillos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Resumen del Pedido
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto text-xs pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span>
                  <strong className="text-cyan-400">{item.quantity}x</strong> {item.item_name}
                </span>
                <span className="font-semibold text-slate-200">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-bold text-white">
            <span>Total:</span>
            <span className="text-cyan-400 font-extrabold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg glow-cyan"
          >
            <Send className="w-4 h-4" />
            <span>Reabrir WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
          >
            Seguir Viendo el Menú
          </button>
        </div>
      </div>
    </div>
  );
};
