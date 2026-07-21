'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, AlertCircle, Search, Star, Leaf, Flame, WheatOff, MapPin, Phone, X } from 'lucide-react';
import { CartProvider, useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import AddToCartButton from './AddToCartButton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useSearchParams } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  name_en?: string;
  description: string | null;
  description_en?: string | null;
  price: number;
  image_url: string | null;
  is_available?: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_recommended?: boolean;
  is_gluten_free?: boolean;
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
  phone?: string;
  address?: string;
  description?: string;
  currency?: string;
  logo_url: string | null;
  cover_image_url?: string | null;
  slug: string;
  schedule?: { weekday?: string; weekend?: string };
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
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table') || searchParams.get('mesa') || '';

  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories[0]?.id || null
  );
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currency = restaurant.currency || 'Q';

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

  const getName = (item: { name: string; name_en?: string }) => (locale === 'en' && item.name_en ? item.name_en : item.name);
  const getDesc = (item: { description?: string | null; description_en?: string | null }) => (locale === 'en' && item.description_en ? item.description_en : item.description);

  // Filter categories and menu items by search query
  const filteredCategories = categories.map((cat) => {
    const matchingItems = cat.menu_items.filter((item) => {
      const name = getName(item).toLowerCase();
      const desc = (getDesc(item) || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      return name.includes(query) || desc.includes(query);
    });
    return { ...cat, menu_items: matchingItems };
  }).filter((cat) => searchQuery.trim() === '' || cat.menu_items.length > 0);

  return (
    <div className='min-h-screen bg-background pb-32'>
      {/* Hero Header with Banner */}
      <div className='relative overflow-hidden'>
        <div className='h-64 relative bg-surface-container-lowest'>
          {restaurant.cover_image_url ? (
            <img src={restaurant.cover_image_url} alt={restaurant.name} className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full bg-gradient-ember' />
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent' />
        </div>

        {/* Restaurant Info Card */}
        <div className='max-w-xl mx-auto -mt-24 px-6 relative z-10'>
          <div className='glass p-8 rounded-[36px] text-center shadow-2xl border border-white/10'>
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className='w-24 h-24 rounded-full object-cover mx-auto -mt-20 mb-4 border-4 border-background shadow-2xl'
              />
            )}
            <h1 className='text-3xl font-serif font-bold mb-2 text-gradient-ember'>{restaurant.name}</h1>
            {restaurant.description && (
              <p className='text-sm text-foreground/60 leading-relaxed max-w-md mx-auto mb-4'>
                {restaurant.description}
              </p>
            )}

            <div className='flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-foreground/50 pt-2 border-t border-white/5'>
              {restaurant.address && (
                <span className='flex items-center gap-1.5'><MapPin size={14} className='text-primary' /> {restaurant.address}</span>
              )}
              {restaurant.phone && (
                <span className='flex items-center gap-1.5'><Phone size={14} className='text-accent-emerald' /> {restaurant.phone}</span>
              )}
              {tableParam && (
                <span className='bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs'>
                  📍 Mesa #{tableParam}
                </span>
              )}
            </div>

            <div className='flex items-center justify-center gap-3 mt-4'>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search & Category Bar */}
      <div className='sticky top-0 z-30 py-3 px-4 glass border-b border-white/5 mt-6 backdrop-blur-xl'>
        <div className='max-w-xl mx-auto space-y-3'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30' size={18} />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Buscar plato, ingrediente...'
              className='w-full bg-surface-container-lowest/80 border border-white/5 rounded-2xl py-3 pl-12 pr-10 focus:ring-2 focus:ring-primary outline-none transition-all text-sm'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground'
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && !searchQuery && (
            <div className='flex gap-2 overflow-x-auto hide-scrollbar py-1'>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white/5 text-foreground/50 hover:bg-white/10'
                  }`}
                >
                  {getName(cat)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className='max-w-xl mx-auto px-4 py-8 space-y-12'>
        {filteredCategories.length === 0 ? (
          <div className='glass p-12 rounded-3xl text-center text-foreground/40'>
            <Search size={36} className='mx-auto mb-3 opacity-30' />
            <p className='font-bold'>No encontramos platos que coincidan.</p>
            <p className='text-xs text-foreground/30 mt-1'>Intenta buscar con otros términos.</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              id={`cat-${category.id}`}
              ref={(el) => { categoryRefs.current[category.id] = el; }}
            >
              <h2 className='text-xl font-serif font-bold mb-6 flex items-center gap-3'>
                <span className='w-8 h-px bg-primary/40' />
                {getName(category)}
              </h2>

              <div className='space-y-4'>
                {category.menu_items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.03 }}
                    className={`flex gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                      item.is_available === false
                        ? 'opacity-50 bg-surface-container/30'
                        : 'glass hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={getName(item)}
                        className='w-24 h-24 rounded-xl object-cover flex-shrink-0 shadow-md'
                      />
                    ) : (
                      <div className='w-24 h-24 rounded-xl bg-surface-container-lowest flex items-center justify-center flex-shrink-0'>
                        <span className='text-xs text-foreground/20 font-bold'>Kartá</span>
                      </div>
                    )}
                    <div className='flex-1 min-w-0 flex flex-col justify-between'>
                      <div>
                        <div className='flex items-start justify-between gap-2'>
                          <h3 className='font-bold text-base leading-snug flex items-center gap-1.5'>
                            {getName(item)}
                          </h3>
                          <span className='text-primary font-serif font-bold whitespace-nowrap text-base'>
                            {currency}{item.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className='flex flex-wrap gap-1.5 mt-1'>
                          {item.is_recommended && (
                            <span className='text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5'>
                              <Star size={10} fill='currentColor' /> Rec.
                            </span>
                          )}
                          {item.is_vegetarian && (
                            <span className='text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5'>
                              <Leaf size={10} /> Veg
                            </span>
                          )}
                          {item.is_spicy && (
                            <span className='text-[10px] bg-red-500/10 text-red-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5'>
                              <Flame size={10} /> Picante
                            </span>
                          )}
                          {item.is_gluten_free && (
                            <span className='text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5'>
                              <WheatOff size={10} /> Sin Gluten
                            </span>
                          )}
                        </div>

                        {getDesc(item) && (
                          <p className='text-xs text-foreground/50 mt-1 line-clamp-2 leading-relaxed'>
                            {getDesc(item)}
                          </p>
                        )}
                      </div>

                      <div className='mt-3 flex items-center justify-between' onClick={(e) => e.stopPropagation()}>
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
            </div>
          ))
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 30 }}
            onClick={() => setIsCartOpen(true)}
            className='fixed bottom-6 right-6 bg-gradient-ember text-white px-6 py-4 rounded-full shadow-2xl shadow-primary/40 z-40 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold'
          >
            <ShoppingBag size={22} />
            <span>Ver Pedido</span>
            <span className='bg-white text-primary text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold'>
              {totalItems}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-6'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className='absolute inset-0 bg-black/70 backdrop-blur-md'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className='relative w-full max-w-lg glass p-6 rounded-3xl overflow-hidden shadow-2xl z-10 space-y-4'
            >
              <button
                onClick={() => setSelectedItem(null)}
                className='absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-10'
              >
                <X size={20} />
              </button>

              {selectedItem.image_url && (
                <div className='h-60 -mx-6 -mt-6 relative overflow-hidden'>
                  <img src={selectedItem.image_url} alt={getName(selectedItem)} className='w-full h-full object-cover' />
                </div>
              )}

              <div className='space-y-2'>
                <div className='flex justify-between items-start'>
                  <h3 className='text-2xl font-serif font-bold'>{getName(selectedItem)}</h3>
                  <span className='text-2xl font-serif font-bold text-primary'>
                    {currency}{selectedItem.price.toFixed(2)}
                  </span>
                </div>

                <div className='flex flex-wrap gap-2 pt-1'>
                  {selectedItem.is_recommended && (
                    <span className='text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full flex items-center gap-1'>
                      <Star size={12} fill='currentColor' /> Recomendado del Chef
                    </span>
                  )}
                  {selectedItem.is_vegetarian && (
                    <span className='text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full flex items-center gap-1'>
                      <Leaf size={12} /> Opción Vegetariana
                    </span>
                  )}
                  {selectedItem.is_spicy && (
                    <span className='text-xs bg-red-500/20 text-red-400 font-bold px-3 py-1 rounded-full flex items-center gap-1'>
                      <Flame size={12} /> Plato Picante
                    </span>
                  )}
                  {selectedItem.is_gluten_free && (
                    <span className='text-xs bg-blue-500/20 text-blue-400 font-bold px-3 py-1 rounded-full flex items-center gap-1'>
                      <WheatOff size={12} /> Libre de Gluten
                    </span>
                  )}
                </div>

                {getDesc(selectedItem) && (
                  <p className='text-sm text-foreground/60 leading-relaxed pt-2'>
                    {getDesc(selectedItem)}
                  </p>
                )}
              </div>

              <div className='pt-4 border-t border-white/5 flex items-center justify-between'>
                <AddToCartButton item={{ ...selectedItem, name: getName(selectedItem) }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurantName={restaurant.name}
        restaurantPhone={restaurant.phone || ''}
        currency={currency}
        initialTable={tableParam}
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

