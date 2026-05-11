'use client';

import { useState } from 'react';
import { toggleItemAvailability } from '@/app/actions/availability';
import { useRouter } from 'next/navigation';

export default function AvailabilityToggle({
  itemId,
  initialAvailable,
}: {
  itemId: string;
  initialAvailable: boolean;
}) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsPending(true);
    const newValue = !isAvailable;
    setIsAvailable(newValue); // Optimistic update

    const result = await toggleItemAvailability(itemId, newValue);

    if (result.error) {
      setIsAvailable(!newValue); // Revert on error
    } else {
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleToggle(); }}
      disabled={isPending}
      className={`
        relative w-11 h-6 rounded-full transition-all duration-300 focus-ring
        ${isAvailable ? 'bg-accent-emerald' : 'bg-foreground/20'}
        ${isPending ? 'opacity-50' : ''}
      `}
      title={isAvailable ? 'Disponible — clic para desactivar' : 'Agotado — clic para activar'}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-lg
          transition-transform duration-300 ease-out
          ${isAvailable ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
