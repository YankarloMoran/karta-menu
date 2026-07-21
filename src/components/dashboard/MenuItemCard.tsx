'use client';

import { useState } from 'react';
import { Trash2, Image as ImageIcon, Pencil, Star, Leaf, Flame } from 'lucide-react';
import { deleteMenuItem } from '@/app/actions/menu';
import AvailabilityToggle from './AvailabilityToggle';
import ItemModal from './ItemModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_recommended?: boolean;
  is_gluten_free?: boolean;
  category_id?: string;
  restaurant_id?: string;
}

export default function MenuItemCard({
  item,
  categories = []
}: {
  item: MenuItem;
  categories?: Array<{ id: string; name: string }>;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations('Dashboard');

  const handleDelete = async () => {
    const result = await deleteMenuItem(item.id, item.image_url);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t('item_deleted'));
      router.refresh();
    }
  };

  return (
    <>
      <div
        className={`bg-surface-container-high rounded-[2rem] overflow-hidden group hover:bg-surface-bright transition-all duration-300 shadow-xl relative flex flex-col justify-between ${
          !item.is_available ? 'opacity-60' : ''
        }`}
      >
        {/* Badges on top left */}
        <div className='absolute top-4 left-4 z-10 flex flex-wrap gap-1.5'>
          {!item.is_available && (
            <span className='bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md shadow-md'>
              Agotado
            </span>
          )}
          {item.is_recommended && (
            <span className='bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1'>
              <Star size={10} fill='currentColor' /> Rec.
            </span>
          )}
          {item.is_vegetarian && (
            <span className='bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1'>
              <Leaf size={10} /> Veg
            </span>
          )}
          {item.is_spicy && (
            <span className='bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1'>
              <Flame size={10} /> Picante
            </span>
          )}
        </div>

        <div>
          <div className='h-48 overflow-hidden relative'>
            {item.image_url ? (
              <img
                src={item.image_url}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                alt={item.name}
              />
            ) : (
              <div className='w-full h-full bg-surface-container-lowest flex items-center justify-center'>
                <ImageIcon size={32} className='text-foreground/10' />
              </div>
            )}

            <div className='absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10'>
              <ItemModal
                restaurantId={item.restaurant_id || ''}
                categories={categories}
                initialItem={item}
                trigger={
                  <button className='bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg transition-colors cursor-pointer'>
                    <Pencil size={16} />
                  </button>
                }
              />
              <button
                onClick={() => setConfirmOpen(true)}
                className='bg-red-500/80 hover:bg-red-600 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg transition-colors cursor-pointer'
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className='p-6'>
            <div className='flex items-start justify-between mb-2'>
              <h4 className='text-lg font-bold leading-tight'>{item.name}</h4>
              <span className='text-lg font-serif font-bold text-primary whitespace-nowrap ml-2'>
                Q{item.price.toFixed(2)}
              </span>
            </div>
            <p className='text-sm text-foreground/50 line-clamp-2 leading-relaxed mb-4'>
              {item.description || t('no_description')}
            </p>
          </div>
        </div>

        <div className='px-6 pb-6 pt-0 flex items-center justify-between border-t border-white/5 mt-auto'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-foreground/30'>
            {item.is_available ? '● Disponible' : '○ Agotado'}
          </span>
          <AvailabilityToggle itemId={item.id} initialAvailable={item.is_available ?? true} />
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title={t('delete_confirm_title')}
        description={t('delete_confirm_desc')}
        confirmLabel={t('delete_confirm_button')}
      />
    </>
  );
}

