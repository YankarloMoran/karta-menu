'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

import { useTranslations } from 'next-intl';

export default function CartButton({ 
  restaurantName,
  restaurantPhone 
}: { 
  restaurantName: string;
  restaurantPhone: string;
}) {
  const { totalItems, totalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Menu');

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className='fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[70]'
          >
            <button 
              onClick={() => setIsOpen(true)}
              className='w-full bg-gradient-ember text-white py-5 rounded-[24px] font-bold text-lg flex items-center justify-between px-8 shadow-2xl shadow-primary/30 group hover:scale-[1.02] active:scale-[0.98] transition-all relative'
            >
              {/* Badge dot counter */}
              <motion.span 
                key={totalItems}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className='absolute -top-2 -right-2 bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-xl border-4 border-background'
              >
                {totalItems}
              </motion.span>

              <div className='flex items-center gap-3'>
                <ShoppingBag size={24} />
                <span>{t('viewOrder')}</span>
              </div>
              <span className='bg-white/20 px-3 py-1 rounded-full text-sm font-mono tracking-tighter'>
                ${totalPrice.toFixed(2)}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        restaurantName={restaurantName}
        restaurantPhone={restaurantPhone}
      />
    </>
  );
}
