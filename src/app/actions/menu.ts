'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * --- CATEGORIES ---
 */

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const restaurantId = formData.get('restaurantId') as string;

  const supabase = await createClient();

  const { error } = await supabase
    .from('menu_categories')
    .insert({
      name,
      restaurant_id: restaurantId,
      order_index: 0, // Simplified for now
    });

  if (error) {
    console.error('Error creating category:', error);
    return { error: 'No se pudo crear la categoría' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: 'No se pudo eliminar la categoría' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

/**
 * --- MENU ITEMS ---
 */

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const name_en = formData.get('name_en') as string;
  const description = formData.get('description') as string;
  const description_en = formData.get('description_en') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const restaurantId = formData.get('restaurantId') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl = null;

  // Upload image if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${restaurantId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
    } else {
      const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }
  }

  const { error } = await supabase
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
    return { error: 'No se pudo crear el plato' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

export async function deleteMenuItem(id: string, imageUrl: string | null) {
  const supabase = await createClient();

  // If there's an image, delete it from storage first
  if (imageUrl) {
    try {
      const path = imageUrl.split('/menu-images/').pop();
      if (path) {
        await supabase.storage.from('menu-images').remove([path]);
      }
    } catch (e) {
      console.error('Error deleting image:', e);
    }
  }

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: 'No se pudo eliminar el plato' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}
