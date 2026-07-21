'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateRestaurantAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'No autorizado' };

  const adminClient = createAdminClient();

  const restaurantId = formData.get('restaurantId') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const phone = formData.get('phone') as string;
  const description = formData.get('description') as string;
  const currency = (formData.get('currency') as string) || 'Q';
  const weekdayHours = formData.get('weekdayHours') as string;
  const weekendHours = formData.get('weekendHours') as string;
  const instagram = formData.get('instagram') as string;
  const whatsapp = formData.get('whatsapp') as string;

  const logoFile = formData.get('logo') as File | null;
  const coverFile = formData.get('coverImage') as File | null;

  // 1. Get current restaurant data
  const { data: current } = await adminClient
    .from('restaurants')
    .select('logo_url, cover_image_url')
    .eq('id', restaurantId)
    .single();

  let logoUrl = current?.logo_url || null;
  let coverUrl = current?.cover_image_url || null;

  // Ensure storage bucket exists or use admin client
  const adminStorage = adminClient.storage;

  // 2. Handle Logo Upload
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${restaurantId}-logo-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await adminStorage
      .from('restaurant-assets')
      .upload(fileName, logoFile, { upsert: true });

    if (!uploadError) {
      const { data: publicUrlData } = adminStorage
        .from('restaurant-assets')
        .getPublicUrl(fileName);
      logoUrl = publicUrlData.publicUrl;
    }
  }

  // 3. Handle Cover Image Upload
  if (coverFile && coverFile.size > 0) {
    const fileExt = coverFile.name.split('.').pop();
    const fileName = `${restaurantId}-cover-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await adminStorage
      .from('restaurant-assets')
      .upload(fileName, coverFile, { upsert: true });

    if (!uploadError) {
      const { data: publicUrlData } = adminStorage
        .from('restaurant-assets')
        .getPublicUrl(fileName);
      coverUrl = publicUrlData.publicUrl;
    }
  }

  const schedule = {
    weekday: weekdayHours || '8:00 AM - 10:00 PM',
    weekend: weekendHours || '9:00 AM - 11:00 PM',
  };

  const social_links = {
    instagram: instagram || '',
    whatsapp: whatsapp || '',
  };

  // 4. Update Database
  const { error: updateError } = await adminClient
    .from('restaurants')
    .update({
      name,
      address,
      phone,
      description,
      currency,
      logo_url: logoUrl,
      cover_image_url: coverUrl,
      schedule,
      social_links,
    })
    .eq('id', restaurantId);

  if (updateError) {
    console.error('Error updating restaurant:', updateError);
    return { success: false, error: 'Error al actualizar perfil' };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  revalidatePath('/[locale]/m/[slug]', 'layout');
  return { success: true };
}

