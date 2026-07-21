import { createClient } from '@/lib/supabase/server';
import { ensureUserRestaurant } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { Image as ImageIcon } from 'lucide-react';
import CategoryModal from '@/components/dashboard/CategoryModal';
import ItemModal from '@/components/dashboard/ItemModal';
import MenuItemCard from '@/components/dashboard/MenuItemCard';
import DeleteCategoryButton from '@/components/dashboard/DeleteCategoryButton';
import { getTranslations } from 'next-intl/server';

export default async function MenuPage() {
  const t = await getTranslations('Dashboard');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const restaurantId = await ensureUserRestaurant(user);

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*, menu_items(*)')
    .eq('restaurant_id', restaurantId)
    .order('order_index', { ascending: true });

  return (
    <div className='space-y-10 pb-20'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-3xl md:text-4xl font-serif font-bold mb-2'>{t('menu_title')}</h1>
          <p className='text-foreground/50'>{t('menu_subtitle')}</p>
        </div>
        <div className='flex items-center gap-3'>
          <CategoryModal restaurantId={restaurantId} />
          <ItemModal
            restaurantId={restaurantId}
            categories={categories || []}
          />
        </div>
      </div>

      {categories?.length === 0 ? (
        <div className='glass p-20 rounded-[40px] text-center animate-fade-in'>
          <div className='bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6'>
            <ImageIcon className='text-primary' size={32} />
          </div>
          <h2 className='text-2xl font-serif font-bold mb-3'>{t('empty_menu_title')}</h2>
          <p className='text-foreground/50 mb-8 max-w-sm mx-auto'>{t('empty_menu_desc')}</p>
        </div>
      ) : (
        <div className='space-y-12 stagger-children'>
          {categories?.map((category) => (
            <div key={category.id} className='space-y-8 bg-surface-container-low/30 p-8 rounded-[2.5rem]'>
              <div className='flex items-center justify-between pb-2'>
                <h3 className='text-2xl font-serif font-bold flex items-center gap-3'>
                  {category.name}
                  <span className='text-xs font-sans font-medium px-2.5 py-1 rounded-lg bg-white/5 text-foreground/35 uppercase tracking-widest'>
                    {category.menu_items?.length || 0} {t('items_count')}
                  </span>
                </h3>
                <DeleteCategoryButton categoryId={category.id} />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {category.menu_items?.map((item: { id: string; name: string; description: string | null; price: number; image_url: string | null; is_available: boolean; is_vegetarian?: boolean; is_spicy?: boolean; is_recommended?: boolean; is_gluten_free?: boolean; category_id?: string }) => (
                  <MenuItemCard key={item.id} item={{ ...item, restaurant_id: restaurantId }} categories={categories || []} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

