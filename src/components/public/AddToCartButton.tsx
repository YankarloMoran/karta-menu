'use client';

import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
    is_available?: boolean;
  };
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const disabled = item.is_available === false;

  return (
    <motion.button
      whileTap={disabled ? { x: [-4, 4, -4, 4, 0] } : { scale: 0.9 }}
      transition={{ duration: 0.3 }}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image_url: item.image_url || undefined,
        });
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        disabled
          ? 'bg-white/5 text-foreground/20 cursor-not-allowed'
          : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
      }`}
    >
      <Plus size={14} />
      {disabled ? 'Agotado' : 'Añadir'}
    </motion.button>
  );
}
