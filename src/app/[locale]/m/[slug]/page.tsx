import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PublicMenuClient from '@/components/public/PublicMenuClient';
import { logRestaurantView } from '@/app/actions/analytics';

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();

  // Fetch restaurant by slug
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !restaurant) {
    notFound();
  }

  // Fetch categories with items
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*, menu_items(*)')
    .eq('restaurant_id', restaurant.id)
    .order('order_index', { ascending: true });

  // Track view (async, non-blocking)
  logRestaurantView(restaurant.id);

  return (
    <PublicMenuClient
      restaurant={restaurant}
      categories={categories || []}
      locale={locale}
    />
  );
}
