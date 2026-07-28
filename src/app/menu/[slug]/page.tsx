'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuItem, OrderItem } from '@/lib/types/database';
import { SAMPLE_RESTAURANT, SAMPLE_CATEGORIES, SAMPLE_MENU_ITEMS } from '@/lib/data/mockData';
import { PublicHeader } from '@/components/public/PublicHeader';
import { CategoryBar } from '@/components/public/CategoryBar';
import { MenuItemCard } from '@/components/public/MenuItemCard';
import { ItemDetailModal } from '@/components/public/ItemDetailModal';
import { CartDrawer } from '@/components/public/CartDrawer';
import { Utensils } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table');

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Item customization modal
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItemForModal(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedOptions: Array<{ option_title: string; value_name: string; extra_price: number }>,
    totalPrice: number
  ) => {
    const newItem: OrderItem = {
      menu_item_id: item.id,
      item_name: item.name,
      unit_price: item.price,
      quantity,
      selected_options: selectedOptions,
      subtotal: totalPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    setCartItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const unitTotal = item.subtotal / item.quantity;
        return {
          ...item,
          quantity: newQty,
          subtotal: unitTotal * newQty,
        };
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Filter items
  const filteredItems = SAMPLE_MENU_ITEMS.filter((item) => {
    if (selectedCategoryId && item.category_id !== selectedCategoryId) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      if (!nameMatch) return false;
    }

    if (selectedTag) {
      const hasTag = item.dietary_tags?.some(
        (t) => t.toLowerCase() === selectedTag.toLowerCase()
      );
      if (!hasTag) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-28">
      {/* Restaurant Public Header */}
      <PublicHeader restaurant={SAMPLE_RESTAURANT} tableNumber={tableParam} />

      {/* Sticky Category & Search Navigation */}
      <CategoryBar
        categories={SAMPLE_CATEGORIES}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />

      {/* Menu Items List Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <Utensils className="w-10 h-10 mx-auto stroke-1 text-slate-600 animate-bounce" />
            <p className="text-sm font-semibold text-slate-300">No se encontraron platillos</p>
            <p className="text-xs text-slate-500">Prueba cambiando los filtros o la búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currency={SAMPLE_RESTAURANT.currency}
                onSelectItem={handleSelectItem}
              />
            ))}
          </div>
        )}
      </main>

      {/* Customization Modal */}
      <ItemDetailModal
        item={selectedItemForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & WhatsApp Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onOpen={() => setIsCartOpen(true)}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        restaurant={SAMPLE_RESTAURANT}
        tableNumber={tableParam}
      />
    </div>
  );
}

export default function PublicMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 text-xs">
          Cargando menú de Cartly...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
