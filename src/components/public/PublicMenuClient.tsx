'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { CartProvider, useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import AddToCartButton from './AddToCartButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface MenuItem {
  id: string;
  name: string;
  name_en?: string;
  description: string | null;
  description_en?: string | null;
  price: number;
  image_url: string | null;
  is_available?: boolean;
}

interface Category {
  id: string;
  name: string;
  name_en?: string;
  menu_items: MenuItem[];
}

interface Restaurant {
  id: string;
  name: string;
  phone: string;
  logo_url: string | null;
  slug: string;
}

function MenuContent({
  restaurant,
  categories,
  locale,
}: {
  restaurant: Restaurant;
  categories: Category[];
  locale: string;
}) {
  const t = useTranslations('Menu');
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories[0]?.id || null
  );
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // IntersectionObserver for active category detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace('cat-', ''));
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    categoryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getName = (item: any) => locale === 'en' && item.name_en ? item.name_en : item.name;
  const getDesc = (item: any) => locale === 'en' && item.description_en ? item.description_en : item.description;

  return (
    <div className='min-h-screen bg-background pb-28'>
      {/* Hero Header */}
      <div className='relative overflow-hidden'>
        <div className='h-56 bg-gradient-ember relative'>
          <div className='absolute inset-0 bg-gradient-mesh opacity-50' />
          <div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent' />
        </div>

        {/* Restaurant Info Card */}
        <div className='max-w-lg mx-auto -mt-20 px-6 relative z-10'>
          <div className='glass p-8 rounded-3xl text-center'>
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className='w-20 h-20 rounded-full object-cover mx-auto -mt-18 mb-4 border-4 border-background shadow-2xl'
              />
            )}
            <h1 className='text-2xl font-serif font-bold mb-1'>{restaurant.name}</h1>
            <p className='text-sm text-foreground/50'>{t('description')}</p>

            <div className='flex items-center justify-center gap-2 mt-4'>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      {categories.length > 0 && (
        <div className='sticky top-0 z-30 py-4 px-4 glass border-b border-white/5 mt-6'>
          <div className='max-w-lg mx-auto'>
            <div className='flex gap-2 overflow-x-auto hide-scrollbar'>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white/5 text-foreground/50 hover:bg-white/10'
                  }`}
                >
                  {getName(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className='max-w-lg mx-auto px-4 py-8 space-y-12'>
        {categories.map((category) => (
          <div
            key={category.id}
            id={`cat-${category.id}`}
            ref={(el) => { categoryRefs.current[category.id] = el; }}
          >
            <h2 className='text-xl font-serif font-bold mb-6 flex items-center gap-3'>
              <span className='w-8 h-px bg-primary/30' />
              {getName(category)}
            </h2>

            {category.menu_items.length === 0 ? (
              <p className='text-foreground/30 text-sm py-6 text-center'>{t('noItems')}</p>
            ) : (
              <div className='space-y-4'>
                {category.menu_items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex gap-4 p-4 rounded-2xl transition-all ${
                      item.is_available === false
                        ? 'opacity-50 bg-surface-container/30'
                        : 'glass hover:bg-white/5'
                    }`}
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={getName(item)}
                        className='w-24 h-24 rounded-xl object-cover flex-shrink-0'
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2'>
                        <h3 className='font-bold text-sm leading-snug'>{getName(item)}</h3>
                        <span className='text-primary font-serif font-bold whitespace-nowrap text-sm'>
                          Q{item.price.toFixed(2)}
                        </span>
                      </div>
                      {getDesc(item) && (
                        <p className='text-xs text-foreground/40 mt-1 line-clamp-2 leading-relaxed'>
                          {getDesc(item)}
                        </p>
                      )}

                      <div className='mt-3 flex items-center justify-between'>
                        {item.is_available === false ? (
                          <span className='flex items-center gap-1 text-[10px] font-bold text-red-400'>
                            <AlertCircle size={12} /> {t('soldOut')}
                          </span>
                        ) : (
                          <AddToCartButton item={{ ...item, name: getName(item) }} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 30 }}
            onClick={() => setIsCartOpen(true)}
            className='fixed bottom-6 right-6 bg-gradient-ember text-white p-5 rounded-full shadow-2xl shadow-primary/30 z-40 flex items-center gap-2 hover:scale-110 transition-transform'
          >
            <ShoppingBag size={22} />
            <span className='font-bold text-lg'>{totalItems}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurantName={restaurant.name}
        restaurantPhone={restaurant.phone}
      />
    </div>
  );
}

export default function PublicMenuClient(props: {
  restaurant: Restaurant;
  categories: Category[];
  locale: string;
}) {
  return (
    <CartProvider>
      <MenuContent {...props} />
    </CartProvider>
  );
}
