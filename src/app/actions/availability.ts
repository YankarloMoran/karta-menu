'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleItemAvailability(itemId: string, isAvailable: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('menu_items')
    .update({ is_available: isAvailable })
    .eq('id', itemId);

  if (error) {
    console.error('Error toggling availability:', error);
    return { error: 'No se pudo actualizar la disponibilidad' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}
