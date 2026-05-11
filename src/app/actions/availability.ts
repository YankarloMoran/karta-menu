'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleItemAvailability(itemId: string, isAvailable: boolean) {
  const adminClient = createAdminClient();

  const { error } = await adminClient
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
