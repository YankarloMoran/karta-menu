'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus, CheckCircle2, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getWhatsAppUrl } from '@/lib/utils/whatsapp';

export default function CartDrawer({ 
  isOpen, 
  onClose,
  restaurantName,
  restaurantPhone
}: { 
  isOpen: boolean; 
  onClose: () => void;
  restaurantName: string;
  restaurantPhone: string;
}) {
  const t = useTranslations('Menu');
  const { items, totalPrice, updateQuantity, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);
  const [tableNumber, setTableNumber] = useState('');

  const handleOrder = () => {
    if (!tableNumber) {
      alert(t('table') + '?');
      return;
    }

    const whatsappUrl = getWhatsAppUrl({
      items,
      total: totalPrice,
      restaurantName,
      restaurantPhone,
      tableNumber,
      template: t('whatsappTemplate')
    });

    // 1. Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // 2. Show success overlay
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      clearCart();
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-[100] flex items-end justify-center'>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
          />

          {/* Drawer Content */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='relative w-full max-w-xl glass rounded-t-[40px] shadow-[0_-32px_64px_rgba(0,0,0,0.5)] border-none flex flex-col max-h-[90vh]'
          >
            {/* Header */}
            <div className='p-8 pb-4 flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-serif font-bold'>{t('viewOrder')}</h2>
                <p className='text-sm text-foreground/40'>{restaurantName}</p>
              </div>
              <button 
                onClick={onClose}
                className='p-2 bg-white/5 rounded-full text-foreground/40 hover:text-white'
              >
                <X size={24} />
              </button>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
              {isOrdered && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-0 z-10 glass rounded-t-[40px] flex flex-col items-center justify-center p-8 text-center bg-background/95'
                >
                  <motion.div 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className='bg-green-500/20 p-6 rounded-full mb-6'
                  >
                    <CheckCircle2 className='text-green-400' size={64} />
                  </motion.div>
                  <h3 className='text-3xl font-serif font-bold mb-2'>{t('ordered')}</h3>
                  <p className='text-foreground/60'>{t('orderedDesc')}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List */}
            <div className='flex-1 overflow-y-auto px-8 py-4 space-y-6'>
              {items.length === 0 ? (
                <div className='py-20 text-center opacity-40 flex flex-col items-center'>
                  <ShoppingBag size={48} className='mb-4' />
                  <p>{t('emptyCart')}</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className='flex items-center gap-4'>
                    <div className='w-16 h-16 rounded-xl bg-surface-container-lowest overflow-hidden border border-white/5'>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center opacity-10'><ShoppingBag size={24} /></div>
                      )}
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-sm'>{item.name}</h4>
                      <p className='text-xs text-primary font-serif font-bold'>${item.price.toFixed(2)} / ud</p>
                    </div>
                    <div className='flex items-center bg-white/5 rounded-lg p-1'>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='p-1 text-foreground/40'><Minus size={14} /></button>
                      <span className='w-6 text-center text-xs font-bold'>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='p-1 text-foreground/40'><Plus size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className='p-8 pb-10 bg-surface-container-high/80 backdrop-blur-xl space-y-6 shadow-[0_-16px_32px_rgba(0,0,0,0.2)]'>
                {/* Table Identification */}
                <div className='space-y-3'>
                  <label className='text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 ml-2'>
                    {t('table')}
                  </label>
                  <input 
                    type='text'
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder={t('tablePlaceholder')}
                    className='w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-center text-lg placeholder:opacity-20'
                  />
                </div>

                <div className='flex items-center justify-between mb-2 px-2'>
                  <span className='text-[10px] font-bold uppercase tracking-[0.2em] opacity-20 italic'>KartÃ¡ Order System</span>
                  <button 
                    onClick={clearCart}
                    className='text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 flex items-center gap-2 transition-colors'
                  >
                    <Trash2 size={12} /> {t('clear')}
                  </button>
                </div>
                
                <div className='flex items-center justify-between text-3xl font-serif font-black px-2'>
                  <span>{t('total')}</span>
                  <span className='text-gradient-ember'>${totalPrice.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleOrder}
                  className='w-full bg-gradient-ember text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_20px_40px_rgba(255,95,31,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all hover:brightness-110'
                >
                  <MessageCircle size={24} /> {t('confirmOrder')}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
