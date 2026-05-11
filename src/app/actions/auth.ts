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
    return redirect('/login?message=No+se+pudo+iniciar+sesión');
  }

  // Redirect to dashboard on success
  return redirect('/dashboard');
}

export async function register(formData: FormData) {
  const restaurantName = formData.get('restaurantName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  // Create auth user
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: restaurantName,
      },
      // In a real app we would want email confirmation, but for immediate testing we can skip it or auto-confirm in Supabase dashboard
    },
  });

  if (authError || !data.user) {
    console.error('Error in signUp:', authError); // Añadimos este log
    return redirect('/register?message=Error+al+crear+cuenta');
  }

  // Create an admin client to bypass RLS for system operations
  const adminClient = createAdminClient();

  // Create restaurant profile
  const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  // Note: Handle new user trigger is already in DB, but we explicitly create the restaurant side
  const { data: restaurant, error: restError } = await adminClient
    .from('restaurants')
    .insert({
      name: restaurantName,
      owner_name: restaurantName, // Could be changed later
      slug: slug + '-' + Math.floor(Math.random() * 1000), // Ensure uniqueness
      email: email,
    })
    .select()
    .single();

  if (restError || !restaurant) {
    console.error('Error creating restaurant with admin client:', restError);
    // If restaurant creation failed, we should handle it gracefully
    return redirect('/register?message=Error+al+crear+el+restaurante');
  }

  // Link restaurant to profile
  await adminClient
    .from('profiles')
    .update({ restaurant_id: restaurant.id })
    .match({ user_id: data.user.id });

  return redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/login');
}
