import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Star, Info, Languages } from 'lucide-react';
import { CartProvider } from '@/context/CartContext';
import AddToCartButton from '@/components/public/AddToCartButton';
import CartButton from '@/components/public/CartButton';
import AnalyticsTracker from '@/components/public/AnalyticsTracker';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('Menu');
  const supabase = await createClient();

  // Fetch restaurant by slug
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*, menu_categories(*, menu_items(*))')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    return notFound();
  }

  const categories = restaurant.menu_categories || [];

  return (
    <CartProvider>
      <div className='min-h-screen bg-background text-foreground pb-32 flex flex-col'>
        {/* Header / Hero */}
        <div className='relative h-[45vh] overflow-hidden flex items-end pb-12 px-8'>
          <div className='absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent' />
          <div className='absolute inset-0 bg-surface-container-lowest -z-10 bg-[url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200")] bg-cover bg-center scale-105' />
          
          {/* Language Switcher Link */}
          <div className='absolute top-8 right-8 z-50'>
             <Link 
               href={`/m/${slug}`} 
               locale={locale === 'es' ? 'en' : 'es'}
               className='glass px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 border border-white/5 hover:bg-white/20 transition-all shadow-2xl'
             >
               <Languages size={14} /> {locale === 'es' ? 'English' : 'Español'}
             </Link>
          </div>

          <div className='relative z-10 flex flex-col md:flex-row md:items-end gap-8 w-full max-w-5xl mx-auto'>
            {restaurant.logo_url && (
              <div className='w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden bg-white shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex-shrink-0 -mb-20 md:-mb-12 border-4 border-background/20'>
                <img src={restaurant.logo_url} className='w-full h-full object-cover' alt='Logo' />
              </div>
            )}
            <div className='flex flex-col gap-2 pt-20 md:pt-0'>
              <h1 className='text-4xl md:text-6xl font-serif font-black text-white tracking-tighter drop-shadow-2xl leading-[0.9] max-w-lg'>
                {restaurant.name}
              </h1>
              <div className='flex items-center gap-4 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]'>
                <span className='flex items-center gap-1.5 bg-primary/20 text-primary-fixed px-3 py-1 rounded-full'><Star size={12} className='fill-primary' /> 4.9</span>
                {restaurant.phone && <span className='opacity-60'>{restaurant.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Nav */}
        <nav className='sticky top-0 z-[60] glass backdrop-blur-[32px] px-4 overflow-x-auto whitespace-nowrap hide-scrollbar py-5 mb-8 flex gap-8 items-center justify-center border-none shadow-2xl'>
          {categories.map((cat: any) => {
             const catName = locale === 'en' && cat.name_en ? cat.name_en : cat.name;
             return (
               <a 
                 key={cat.id} 
                 href={`#cat-${cat.id}`}
                 className='text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/30 hover:text-primary transition-all hover:scale-110 active:scale-95'
               >
                 {catName}
               </a>
             );
          })}
        </nav>

        {/* Menu Items List */}
        <div className='px-6 space-y-12 max-w-xl mx-auto w-full mt-8'>
          {categories.map((category: any) => {
            const catName = locale === 'en' && category.name_en ? category.name_en : category.name;
            return (
              <section key={category.id} id={`cat-${category.id}`} className='space-y-6'>
                <h2 className='text-2xl font-serif font-bold border-l-4 border-primary pl-4'>
                  {catName}
                </h2>

                <div className='flex flex-col gap-8'>
                  {category.menu_items?.map((item: any) => {
                    const itemName = locale === 'en' && item.name_en ? item.name_en : item.name;
                    const itemDesc = locale === 'en' && item.description_en ? item.description_en : item.description;

                    return (
                      <div key={item.id} className='flex items-start gap-4 group'>
                        {item.image_url && (
                          <div className='w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg shadow-black/20'>
                            <img 
                              src={item.image_url} 
                              alt={itemName} 
                              className='w-full h-full object-cover transition-transform group-hover:scale-110 duration-500' 
                            />
                          </div>
                        )}
                        <div className='flex-1 flex flex-col justify-between py-1'>
                          <div>
                            <div className='flex items-start justify-between'>
                              <h4 className='font-bold text-lg leading-tight'>{itemName}</h4>
                              <span className='font-serif font-bold text-primary'>${item.price.toFixed(2)}</span>
                            </div>
                            <p className='text-sm text-foreground/40 line-clamp-2 mt-1 leading-relaxed'>{itemDesc}</p>
                          </div>
                          <div className='mt-3'>
                            <AddToCartButton item={{...item, name: itemName, description: itemDesc}} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Persistent Floating Cart Button */}
        <CartButton 
          restaurantName={restaurant.name} 
          restaurantPhone={restaurant.phone} 
        />

        <AnalyticsTracker restaurantId={restaurant.id} />

        <footer className='py-28 px-8 text-center space-y-8 bg-surface-container-lowest'>
          {(restaurant.address || restaurant.phone) && (
            <div className='space-y-4 max-w-sm mx-auto'>
              <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40'>{t('categories')}</p>
              {restaurant.address && <p className='text-sm opacity-60 font-medium leading-relaxed'>{restaurant.address}</p>}
              {restaurant.phone && <p className='text-lg font-serif font-bold tracking-tight'>{restaurant.phone}</p>}
            </div>
          )}
          <div className='pt-12 opacity-10 flex flex-col items-center gap-2'>
            <p className='text-[10px] font-serif italic tracking-[0.2em]'>Kartá — Luxury Dining Space</p>
            <div className='w-12 h-[1px] bg-white' />
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
