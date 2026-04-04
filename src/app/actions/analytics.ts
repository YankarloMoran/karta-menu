'use server';

import { createClient } from '@/lib/supabase/server';

export async function logRestaurantView(restaurantId: string, deviceData?: { deviceType?: string, browser?: string }) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('analytics_views')
    .insert({
      restaurant_id: restaurantId,
      device_type: deviceData?.deviceType || 'Desconocido',
      browser: deviceData?.browser || 'Desconocido'
    });

  if (error) {
    console.error('Error logging analytics:', error.message);
    return { success: false };
  }

  return { success: true };
}
