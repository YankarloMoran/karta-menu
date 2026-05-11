'use client';

import { useState } from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { deleteMenuItem } from '@/app/actions/menu';
import AvailabilityToggle from './AvailabilityToggle';
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
}

export default function MenuItemCard({ item }: { item: MenuItem }) {
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
      <div className={`bg-surface-container-high rounded-[2rem] overflow-hidden group hover:bg-surface-bright transition-all duration-300 shadow-xl relative ${!item.is_available ? 'opacity-60' : ''}`}>
        {/* Sold out badge */}
        {!item.is_available && (
          <div className='absolute top-4 left-4 z-10 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full'>
            {t('items_count') === 'ITEMS' ? 'Sold Out' : 'Agotado'}
          </div>
        )}

        <div className='h-48 overflow-hidden relative'>
          {item.image_url ? (
            <img src={item.image_url} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt={item.name} />
          ) : (
            <div className='w-full h-full bg-surface-container-lowest flex items-center justify-center'>
              <ImageIcon size={32} className='text-foreground/10' />
            </div>
          )}

          <div className='absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'>
            <button
              onClick={() => setConfirmOpen(true)}
              className='bg-red-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-red-600 transition-colors'
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
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-foreground/30'>
              {item.is_available ? '● Disponible' : '○ Agotado'}
            </span>
            <AvailabilityToggle itemId={item.id} initialAvailable={item.is_available ?? true} />
          </div>
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
