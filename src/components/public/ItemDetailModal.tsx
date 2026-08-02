'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem, ItemOptionValue } from '@/lib/types/database';
import { X, Plus, Minus, Check, ShoppingBag } from 'lucide-react';

interface SelectedOptionChoice {
  option_title: string;
  value_name: string;
  extra_price: number;
}

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedOptions: SelectedOptionChoice[],
    totalPrice: number
  ) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedValues, setSelectedValues] = useState<Record<string, ItemOptionValue>>({});

  useEffect(() => {
    if (item && item.options) {
      const initial: Record<string, ItemOptionValue> = {};
      item.options.forEach((opt) => {
        const defaultVal = opt.values?.find((v) => v.is_default) || opt.values?.[0];
        if (defaultVal) {
          initial[opt.id] = defaultVal;
        }
      });
      setSelectedValues(initial);
      setQuantity(1);
    }
  }, [item]);

  // Calculate total extra price per unit
  const extraPriceSum = Object.values(selectedValues).reduce(
    (acc, val) => acc + (val.extra_price || 0),
    0
  );
  const unitPrice = item.price + extraPriceSum;
  const totalPrice = unitPrice * quantity;

  const handleValueSelect = (optionId: string, value: ItemOptionValue) => {
    setSelectedValues((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const handleConfirm = () => {
    const optionsPayload: SelectedOptionChoice[] = Object.entries(selectedValues).map(
      ([optId, val]) => {
        const parentOpt = item.options?.find((o) => o.id === optId);
        return {
          option_title: parentOpt?.title || '',
          value_name: val.name,
          extra_price: val.extra_price || 0,
        };
      }
    );

    onAddToCart(item, quantity, optionsPayload, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 flex flex-col max-h-[90vh] bg-[#0b0f19]">
        {/* Header Image */}
        <div className="relative h-56 w-full bg-slate-950 flex-shrink-0">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-xl font-extrabold text-white">{item.name}</h2>
              <span className="text-xl font-black text-cyan-400">
                ${unitPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
          </div>

          {/* Options & Modifiers */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-5 pt-4 border-t border-slate-800">
              {item.options.map((opt) => (
                <div key={opt.id} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {opt.title}
                    </h4>
                    {opt.is_required && (
                      <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        Requerido
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {opt.values?.map((val) => {
                      const isSelected = selectedValues[opt.id]?.id === val.id;

                      return (
                        <button
                          key={val.id}
                          type="button"
                          onClick={() => handleValueSelect(opt.id, val)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? 'bg-indigo-500/20 border-indigo-500/60 text-white font-semibold shadow-md'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-indigo-500 bg-indigo-500 text-white'
                                  : 'border-slate-600 bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{val.name}</span>
                          </div>
                          {val.extra_price > 0 && (
                            <span className="text-cyan-400 font-semibold">
                              +${val.extra_price.toFixed(2)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Quantity Counter & Submit */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-sm transition-all shadow-lg glow-accent active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar al Pedido (${totalPrice.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
