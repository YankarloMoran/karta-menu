'use client';

import { useCart, CartItem } from '@/context/CartContext';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslations } from 'next-intl';

export default function AddToCartButton({ 
  item 
}: { 
  item: { id: string; name: string; price: number; image_url?: string } 
}) {
  const t = useTranslations('Common');
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...item, quantity: 1 } as CartItem);
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(item.id, quantity + 1);
  };

  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <div className='flex items-center gap-2 h-10'>
      <AnimatePresence mode='wait'>
        {quantity === 0 ? (
          <motion.button 
            key='add'
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            onClick={handleAdd}
            className='h-full px-4 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all'
          >
            {t('add')} <Plus size={14} />
          </motion.button>
        ) : (
          <motion.div 
            key='counter'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='h-full flex items-center bg-primary text-white rounded-xl overflow-hidden shadow-lg shadow-primary/20 p-1'
          >
            <button 
              onClick={handleMinus}
              className='p-1.5 hover:bg-white/20 rounded-lg transition-colors'
            >
              <Minus size={14} />
            </button>
            <span className='w-8 text-center font-bold text-sm'>{quantity}</span>
            <button 
              onClick={handlePlus}
              className='p-1.5 hover:bg-white/20 rounded-lg transition-colors'
            >
              <Plus size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
