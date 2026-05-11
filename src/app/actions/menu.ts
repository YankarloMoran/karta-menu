'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * --- CATEGORIES ---
 */

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const restaurantId = formData.get('restaurantId') as string;

  if (!name || !restaurantId) {
    return { error: 'Nombre de categoría o ID de restaurante faltante' };
  }

  // Use admin client to bypass RLS if policies are not set
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('menu_categories')
    .insert({
      name,
      restaurant_id: restaurantId,
      order_index: 0,
    });

  if (error) {
    console.error('Error creating category:', error);
    return { error: `Error DB: ${error.message}` };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('menu_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return { error: 'No se pudo eliminar la categoría' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

/**
 * --- MENU ITEMS ---
 */

export async function createMenuItem(formData: FormData) {
  const adminClient = createAdminClient();
  const supabase = await createClient(); // For storage upload context if needed, though admin works better for storage too
  const adminStorage = adminClient.storage;
  
  const name = formData.get('name') as string;
  const name_en = formData.get('name_en') as string;
  const description = formData.get('description') as string;
  const description_en = formData.get('description_en') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const restaurantId = formData.get('restaurantId') as string;
  const imageFile = formData.get('image') as File;

  if (!name || !restaurantId || !categoryId) {
    return { error: 'Faltan campos obligatorios' };
  }

  let imageUrl = null;

  // Upload image if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${restaurantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await adminStorage
      .from('menu-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
    } else {
      const { data } = adminStorage.from('menu-images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }
  }

  const { error } = await adminClient
    .from('menu_items')
    .insert({
      name,
      name_en,
      description,
      description_en,
      price,
      image_url: imageUrl,
      category_id: categoryId,
      restaurant_id: restaurantId,
      is_available: true,
      order_index: 0,
    });

  if (error) {
    console.error('Error creating menu item:', error);
    return { error: `Error DB: ${error.message}` };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

export async function deleteMenuItem(id: string, imageUrl: string | null) {
  const adminClient = createAdminClient();

  // If there's an image, delete it from storage first
  if (imageUrl) {
    try {
      const path = imageUrl.split('/menu-images/').pop();
      if (path) {
        await adminClient.storage.from('menu-images').remove([path]);
      }
    } catch (e) {
      console.error('Error deleting image:', e);
    }
  }

  const { error } = await adminClient
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting item:', error);
    return { error: 'No se pudo eliminar el plato' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}
