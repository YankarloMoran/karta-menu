'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateRestaurantAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'No autorizado' };

  const restaurantId = formData.get('restaurantId') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const phone = formData.get('phone') as string;
  const imageFile = formData.get('logo') as File | null;

  // 1. Get current restaurant data
  const { data: current } = await supabase
    .from('restaurants')
    .select('logo_url')
    .eq('id', restaurantId)
    .single();

  let logoUrl = current?.logo_url || null;

  // 2. Handle Logo Upload
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${restaurantId}-logo-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('restaurant-assets')
      .upload(fileName, imageFile);

    if (uploadError) return { success: false, error: 'Error al subir el logo' };

    const { data: publicUrlData } = supabase.storage
      .from('restaurant-assets')
      .getPublicUrl(fileName);

    logoUrl = publicUrlData.publicUrl;

    // Optional: Delete old logo if exists
    if (current?.logo_url) {
      const oldFileName = current.logo_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('restaurant-assets').remove([oldFileName]);
      }
    }
  }

  // 3. Update Text Fields
  const { error: updateError } = await supabase
    .from('restaurants')
    .update({
      name,
      address,
      phone,
      logo_url: logoUrl,
    })
    .eq('id', restaurantId);

  if (updateError) return { success: false, error: 'Error al actualizar perfil' };

  revalidatePath('/dashboard/settings');
  revalidatePath(`/m/[slug]`);
  return { success: true };
}
