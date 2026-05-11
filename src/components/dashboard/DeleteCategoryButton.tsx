'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteCategory } from '@/app/actions/menu';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations('Dashboard');

  const handleDelete = async () => {
    const result = await deleteCategory(categoryId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t('category_deleted'));
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className='p-2 text-foreground/20 hover:text-red-400 transition-colors'
      >
        <Trash2 size={18} />
      </button>

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
