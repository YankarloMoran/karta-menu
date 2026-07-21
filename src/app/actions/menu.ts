'use server';

import { createAdminClient } from '@/lib/supabase/server';
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

export async function updateCategory(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;

  if (!id || !name) {
    return { error: 'ID o nombre de categoría faltante' };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('menu_categories')
    .update({ name })
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    return { error: 'No se pudo actualizar la categoría' };
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
  const adminStorage = adminClient.storage;
  
  const name = formData.get('name') as string;
  const name_en = formData.get('name_en') as string;
  const description = formData.get('description') as string;
  const description_en = formData.get('description_en') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const restaurantId = formData.get('restaurantId') as string;
  const imageFile = formData.get('image') as File | null;

  const is_vegetarian = formData.get('is_vegetarian') === 'true';
  const is_spicy = formData.get('is_spicy') === 'true';
  const is_recommended = formData.get('is_recommended') === 'true';
  const is_gluten_free = formData.get('is_gluten_free') === 'true';

  if (!name || !restaurantId || !categoryId || isNaN(price)) {
    return { error: 'Faltan campos obligatorios o el precio es inválido' };
  }

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${restaurantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await adminStorage
      .from('menu-images')
      .upload(fileName, imageFile, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
    } else {
      const { data } = adminStorage.from('menu-images').getPublicUrl(fileName);
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
      is_vegetarian,
      is_spicy,
      is_recommended,
      is_gluten_free,
      order_index: 0,
    });

  if (error) {
    console.error('Error creating menu item:', error);
    return { error: `Error DB: ${error.message}` };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

export async function updateMenuItem(formData: FormData) {
  const adminClient = createAdminClient();
  const adminStorage = adminClient.storage;

  const itemId = formData.get('id') as string;
  const name = formData.get('name') as string;
  const name_en = formData.get('name_en') as string;
  const description = formData.get('description') as string;
  const description_en = formData.get('description_en') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const restaurantId = formData.get('restaurantId') as string;
  const imageFile = formData.get('image') as File | null;

  const is_vegetarian = formData.get('is_vegetarian') === 'true';
  const is_spicy = formData.get('is_spicy') === 'true';
  const is_recommended = formData.get('is_recommended') === 'true';
  const is_gluten_free = formData.get('is_gluten_free') === 'true';

  if (!itemId || !name || isNaN(price)) {
    return { error: 'ID, nombre de plato o precio faltante' };
  }

  // Get current item to preserve image if not uploaded
  const { data: current } = await adminClient
    .from('menu_items')
    .select('image_url')
    .eq('id', itemId)
    .single();

  let imageUrl = current?.image_url || null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${restaurantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await adminStorage
      .from('menu-images')
      .upload(fileName, imageFile, { upsert: true });

    if (!uploadError) {
      const { data } = adminStorage.from('menu-images').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }
  }

  const { error } = await adminClient
    .from('menu_items')
    .update({
      name,
      name_en,
      description,
      description_en,
      price,
      image_url: imageUrl,
      category_id: categoryId,
      is_vegetarian,
      is_spicy,
      is_recommended,
      is_gluten_free,
    })
    .eq('id', itemId);

  if (error) {
    console.error('Error updating menu item:', error);
    return { error: `Error DB: ${error.message}` };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

export async function deleteMenuItem(id: string, imageUrl: string | null) {
  const adminClient = createAdminClient();

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

