'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { getWhatsAppUrl } from '@/lib/utils/whatsapp';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantPhone: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  restaurantName,
  restaurantPhone,
}: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const t = useTranslations('Menu');
  const [tableNumber, setTableNumber] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleOrder = () => {
    const url = getWhatsAppUrl({
      items,
      total: totalPrice,
      restaurantName,
      restaurantPhone,
      tableNumber,
      template: t('whatsappTemplate'),
    });
    window.open(url, '_blank');
    setIsConfirmed(true);
    clearCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex justify-end'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='relative w-full max-w-md h-full glass flex flex-col border-l border-white/5'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-white/5'>
              <h2 className='text-xl font-serif font-bold flex items-center gap-2'>
                <ShoppingBag size={20} className='text-primary' />
                {t('viewOrder')}
                {totalItems > 0 && (
                  <span className='text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-lg font-bold'>{totalItems}</span>
                )}
              </h2>
              <button onClick={onClose} className='p-2 text-foreground/40 hover:text-foreground/80 transition-colors'>
                <X size={24} />
              </button>
            </div>

            {/* Confirmed state */}
            {isConfirmed ? (
              <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className='w-20 h-20 rounded-full bg-accent-emerald/10 flex items-center justify-center mb-6'
                >
                  <MessageCircle size={32} className='text-accent-emerald' />
                </motion.div>
                <h3 className='text-2xl font-serif font-bold mb-2'>{t('ordered')}</h3>
                <p className='text-foreground/50 text-sm'>{t('orderedDesc')}</p>
                <button
                  onClick={() => { setIsConfirmed(false); onClose(); }}
                  className='mt-8 px-6 py-3 rounded-xl bg-white/5 text-foreground/60 font-bold hover:bg-white/10 transition-colors'
                >
                  {t('viewOrder') === 'Tu Pedido' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            ) : items.length === 0 ? (
              /* Empty state */
              <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                <ShoppingBag size={48} className='text-foreground/10 mb-4' />
                <p className='text-foreground/40 font-medium'>{t('emptyCart')}</p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className='flex-1 overflow-y-auto p-6 space-y-3'>
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                        className='flex gap-4 p-4 bg-white/5 rounded-2xl items-center'
                      >
                        {item.image_url && (
                          <img src={item.image_url} className='w-14 h-14 rounded-xl object-cover flex-shrink-0' alt={item.name} />
                        )}
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-bold text-sm leading-snug truncate'>{item.name}</h4>
                          <p className='text-primary font-serif font-bold text-sm mt-0.5'>
                            Q{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-white/10 transition-colors'
                          >
                            <Minus size={14} />
                          </button>
                          <span className='w-8 text-center font-bold text-sm'>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-white/10 transition-colors'
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className='p-2 text-foreground/20 hover:text-red-400 transition-colors'
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className='p-6 border-t border-white/5 space-y-4'>
                  <div className='flex items-center gap-3'>
                    <input
                      type='text'
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder={t('tablePlaceholder')}
                      className='flex-1 bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all'
                    />
                    <button
                      onClick={clearCart}
                      className='text-xs font-bold text-red-400 hover:text-red-300 transition-colors'
                    >
                      {t('clear')}
                    </button>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-foreground/50'>{t('total')}</span>
                    <span className='text-2xl font-serif font-bold text-primary'>Q{totalPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleOrder}
                    className='w-full bg-gradient-ember text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-lg shadow-primary/20'
                  >
                    <MessageCircle size={20} /> {t('confirmOrder')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
