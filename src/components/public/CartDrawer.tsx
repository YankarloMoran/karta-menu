'use client';

import React, { useState } from 'react';
import { OrderItem, Restaurant } from '@/lib/types/database';
import { generateWhatsAppOrderUrl } from '@/lib/utils/whatsapp';
import { ShoppingBag, X, Trash2, Send, Plus, Minus, MapPin, User, MessageSquare } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  items: OrderItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  restaurant: Restaurant;
  tableNumber: string | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  restaurant,
  tableNumber,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [currentTable, setCurrentTable] = useState(tableNumber || '04');

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = items.reduce((acc, i) => acc + i.subtotal, 0);

  const handleSendOrder = () => {
    if (items.length === 0) return;

    const url = generateWhatsAppOrderUrl({
      phone: restaurant.phone_whatsapp,
      restaurantName: restaurant.name,
      tableNumber: currentTable,
      customerName: customerName || undefined,
      items,
      totalAmount,
      currency: restaurant.currency,
      notes: notes || undefined,
    });

    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating Bottom Bar (Visible when cart has items and drawer is closed) */}
      {!isOpen && items.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-bounce-short">
          <button
            onClick={onOpen}
            className="w-full glass-panel p-3.5 rounded-2xl flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xl glow-accent border border-orange-400/40 hover:brightness-110 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center font-black text-sm">
                {totalItemsCount}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold opacity-90">Ver Tu Pedido</p>
                <p className="text-sm font-black">${totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-black/25 px-3.5 py-2 rounded-xl text-xs font-bold">
              <span>Ordenar</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Drawer Backdrop & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md transition-opacity">
          <div className="glass-panel w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-800 bg-[#090d16]/95">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Tu Pedido</h3>
                  <p className="text-xs text-slate-400">
                    {totalItemsCount} platillos seleccionados
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors text-xs flex items-center gap-1"
                    title="Vaciar carrito"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-slate-600 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-300">Tu carrito está vacío</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explora el menú y agrega tus platillos favoritos para enviar el pedido.
                  </p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white">{item.item_name}</h4>
                      <span className="text-sm font-extrabold text-orange-400">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>

                    {item.selected_options && item.selected_options.length > 0 && (
                      <div className="space-y-0.5 text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                        {item.selected_options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex justify-between">
                            <span>
                              {opt.option_title}: {opt.value_name}
                            </span>
                            {opt.extra_price > 0 && (
                              <span className="text-orange-400 font-medium">
                                +${opt.extra_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="p-1 text-slate-300 hover:text-white rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="p-1 text-slate-300 hover:text-white rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Quitar
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Order Form Settings */}
              {items.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-orange-400" />
                      Número de Mesa
                    </label>
                    <input
                      type="text"
                      value={currentTable}
                      onChange={(e) => setCurrentTable(e.target.value)}
                      placeholder="Ej. 04"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <User className="w-3 h-3 text-orange-400" />
                      Tu Nombre (Opcional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <MessageSquare className="w-3 h-3 text-orange-400" />
                      Notas o Alergias
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Sin cebolla, aderezo aparte..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Submit */}
            {items.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span>Total:</span>
                  <span className="text-lg text-orange-400 font-extrabold">
                    ${totalAmount.toFixed(2)} {restaurant.currency}
                  </span>
                </div>

                <button
                  onClick={handleSendOrder}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg glow-accent active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido por WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
