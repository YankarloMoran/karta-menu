'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?message=Correo+o+contraseña+incorrectos');
  }

  // Ensure user profile has a linked restaurant
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await ensureUserRestaurant(user);
  }

  return redirect('/dashboard');
}

export async function register(formData: FormData) {
  const restaurantName = formData.get('restaurantName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!restaurantName || !email || !password) {
    return redirect('/register?message=Todos+los+campos+son+requeridos');
  }

  const supabase = await createClient();

  // Create auth user
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: restaurantName,
      },
    },
  });

  if (authError || !data.user) {
    console.error('Error in signUp:', authError);
    const msg = authError?.message?.includes('already registered')
      ? 'Este+correo+ya+está+registrado'
      : 'Error+al+crear+la+cuenta';
    return redirect(`/register?message=${msg}`);
  }

  // Create an admin client to bypass RLS for system operations
  const adminClient = createAdminClient();

  // Create restaurant profile
  const slug = restaurantName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const uniqueSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

  let { data: restaurant, error: restError } = await adminClient
    .from('restaurants')
    .insert({
      name: restaurantName,
      owner_name: restaurantName,
      slug: uniqueSlug,
      email: email,
      currency: 'Q',
    })
    .select()
    .single();

  if (restError || !restaurant) {
    console.error('Admin client restaurant insert failed, trying user client fallback...', restError);
    const { data: fallbackRest, error: fallbackError } = await supabase
      .from('restaurants')
      .insert({
        name: restaurantName,
        owner_name: restaurantName,
        slug: uniqueSlug,
        email: email,
        currency: 'Q',
      })
      .select()
      .single();

    if (fallbackRest) {
      restaurant = fallbackRest;
      restError = null;
    } else {
      console.error('Both admin and fallback restaurant insert failed:', restError, fallbackError);
    }
  }

  if (restaurant) {
    // Link restaurant to user profile using upsert
    await adminClient
      .from('profiles')
      .upsert(
        {
          user_id: data.user.id,
          restaurant_id: restaurant.id,
          full_name: restaurantName,
          role: 'owner',
        },
        { onConflict: 'user_id' }
      );
  }

  return redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/login');
}

/**
 * Helper to ensure a logged-in user always has a linked restaurant.
 */
export async function ensureUserRestaurant(user: { id: string; user_metadata?: Record<string, unknown>; email?: string }) {
  const adminClient = createAdminClient();

  const { data: profile } = await adminClient
    .from('profiles')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile?.restaurant_id) {
    return profile.restaurant_id;
  }

  // Check if restaurant with user's email exists
  const { data: existingRest } = await adminClient
    .from('restaurants')
    .select('id')
    .eq('email', user.email || '')
    .maybeSingle();

  let restaurantId = existingRest?.id;

  if (!restaurantId) {
    const rawName = user.user_metadata?.full_name;
    const name = typeof rawName === 'string' ? rawName : 'Mi Restaurante';
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const { data: newRest } = await adminClient
      .from('restaurants')
      .insert({
        name,
        owner_name: name,
        slug,
        email: user.email,
        currency: 'Q',
      })
      .select('id')
      .single();

    restaurantId = newRest?.id;
  }

  if (restaurantId) {
    await adminClient
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          restaurant_id: restaurantId,
          full_name: typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : 'Propietario',
          role: 'owner',
        },
        { onConflict: 'user_id' }
      );
  }

  return restaurantId;
}

