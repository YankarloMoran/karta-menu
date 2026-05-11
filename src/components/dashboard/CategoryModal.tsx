'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCategory } from '@/app/actions/menu';
import { useToast } from '@/context/ToastContext';
import { useTranslations } from 'next-intl';

export default function CategoryModal({
  restaurantId,
  onSuccess
}: {
  restaurantId: string;
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations('Dashboard');

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createCategory(formData);
    setIsPending(false);

    if (result.success) {
      setIsOpen(false);
      toast.success(t('category_created'));
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } else {
      toast.error(result.error || t('category_error'));
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl font-bold hover:bg-primary/20 transition-all border border-primary/20'
      >
        <Plus size={18} /> {t('add_category')}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className='fixed inset-0 z-[60] flex items-center justify-center p-6'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className='absolute inset-0 bg-black/60 backdrop-blur-sm'
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='relative w-full max-w-md glass p-8 rounded-3xl shadow-2xl border border-white/10'
            >
              <button
                onClick={() => setIsOpen(false)}
                className='absolute top-6 right-6 p-2 text-foreground/40 hover:text-white transition-colors'
              >
                <X size={20} />
              </button>

              <h2 className='text-2xl font-serif font-bold mb-2'>{t('new_category')}</h2>
              <p className='text-sm text-foreground/50 mb-8'>{t('new_category_desc')}</p>

              <form action={handleSubmit} className='space-y-6'>
                <input type='hidden' name='restaurantId' value={restaurantId} />

                <div className='space-y-2'>
                  <label className='text-sm font-medium ml-1'>{t('category_name')}</label>
                  <input
                    type='text'
                    name='name'
                    required
                    autoFocus
                    placeholder={t('category_placeholder')}
                    className='w-full bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground'
                  />
                </div>

                <div className='flex gap-3 pt-2'>
                  <button
                    type='button'
                    onClick={() => setIsOpen(false)}
                    className='flex-1 py-3 px-4 rounded-xl font-bold text-foreground/60 hover:bg-white/5 transition-all'
                  >
                    {t('items_count') === 'ITEMS' ? 'Cancel' : 'Cancelar'}
                  </button>
                  <button
                    type='submit'
                    disabled={isPending}
                    className='flex-1 bg-gradient-ember text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100'
                  >
                    {isPending ? <Loader2 className='animate-spin' size={20} /> : t('create_category')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
