'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createMenuItem } from '@/app/actions/menu';
import { useToast } from '@/context/ToastContext';
import { useTranslations } from 'next-intl';

export default function ItemModal({
  restaurantId,
  categories,
  onSuccess
}: {
  restaurantId: string;
  categories: any[];
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations('Dashboard');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createMenuItem(formData);
    setIsPending(false);

    if (result.success) {
      setIsOpen(false);
      setImagePreview(null);
      toast.success(t('item_created'));
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } else {
      toast.error(result.error || t('item_error'));
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20'
      >
        <Plus size={18} /> {t('add_item')}
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
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='relative w-full max-w-xl glass p-8 rounded-3xl shadow-2xl border border-white/10 overflow-y-auto max-h-[90vh]'
            >
              <button
                onClick={() => setIsOpen(false)}
                className='absolute top-6 right-6 p-2 text-foreground/40 hover:text-white transition-colors'
              >
                <X size={24} />
              </button>

              <h2 className='text-3xl font-serif font-bold mb-2'>{t('new_item')}</h2>
              <p className='text-sm text-foreground/50 mb-8'>{t('new_item_desc')}</p>

              <form action={handleSubmit} className='space-y-6'>
                <input type='hidden' name='restaurantId' value={restaurantId} />

                {/* Image Upload */}
                <div className='relative group h-48 rounded-2xl bg-surface-container-lowest border border-dashed border-white/10 flex items-center justify-center overflow-hidden cursor-pointer'
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} className='w-full h-full object-cover' alt='Preview' />
                      <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Camera size={24} className='text-white' />
                      </div>
                    </>
                  ) : (
                    <div className='text-center space-y-2 flex flex-col items-center'>
                      <Camera size={32} className='text-foreground/30' />
                      <p className='text-xs text-foreground/40'>{t('upload_photo')}</p>
                    </div>
                  )}
                  <input type='file' name='image' ref={fileInputRef} onChange={handleImageChange} className='hidden' accept='image/*' />
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium ml-1'>{t('name_es')}</label>
                    <input
                      type='text' name='name' required placeholder='Ej. Hamburguesa Ember'
                      className='w-full bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium ml-1 text-primary/60 italic'>{t('name_en')}</label>
                    <input
                      type='text' name='name_en' placeholder='e.g. Ember Burger'
                      className='w-full bg-surface-container-lowest border border-primary/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground italic'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium ml-1'>{t('price')}</label>
                    <input
                      type='number' step='0.01' name='price' required placeholder='45.00'
                      className='w-full bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium ml-1'>{t('category')}</label>
                  <select
                    name='categoryId' required defaultValue=''
                    className='w-full bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground appearance-none cursor-pointer'
                  >
                    <option value='' disabled>{t('select_category')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className='space-y-4 pt-2 border-t border-white/5'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-foreground/30'>{t('translations')}</p>
                  <div className='space-y-2'>
                    <label className='text-xs font-bold text-foreground/40 ml-1'>{t('desc_es')}</label>
                    <textarea
                      name='description' rows={2} placeholder={t('desc_placeholder_es')}
                      className='w-full bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground resize-none text-sm'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-xs font-bold text-primary/40 ml-1 italic'>{t('desc_en')}</label>
                    <textarea
                      name='description_en' rows={2} placeholder={t('desc_placeholder_en')}
                      className='w-full bg-surface-container-lowest border border-primary/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground resize-none italic text-sm'
                    />
                  </div>
                </div>

                <div className='flex gap-3 pt-2'>
                  <button type='button' onClick={() => setIsOpen(false)}
                    className='flex-1 py-3 px-4 rounded-xl font-bold text-foreground/60 hover:bg-white/5 transition-all'
                  >
                    {t('items_count') === 'ITEMS' ? 'Cancel' : 'Cancelar'}
                  </button>
                  <button type='submit' disabled={isPending}
                    className='flex-1 bg-gradient-ember text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 shadow-lg'
                  >
                    {isPending ? <Loader2 className='animate-spin' size={20} /> : t('save_item')}
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
