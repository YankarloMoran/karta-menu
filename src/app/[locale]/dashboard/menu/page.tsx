import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import CategoryModal from '@/components/dashboard/CategoryModal';
import ItemModal from '@/components/dashboard/ItemModal';
import { deleteCategory, deleteMenuItem } from '@/app/actions/menu';

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch restaurant and menu data
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .single();

  const restaurantId = profile?.restaurant_id;

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*, menu_items(*)')
    .eq('restaurant_id', restaurantId)
    .order('order_index', { ascending: true });

  return (
    <div className='space-y-10 pb-20'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-4xl font-serif font-bold mb-2'>Menú Digital</h1>
          <p className='text-foreground/60'>Gestiona tus categorías y platos en tiempo real.</p>
        </div>
        <div className='flex items-center gap-3'>
          <CategoryModal restaurantId={restaurantId} onSuccess={() => {}} />
          <ItemModal 
            restaurantId={restaurantId} 
            categories={categories || []} 
            onSuccess={() => {}} 
          />
        </div>
      </div>

      {categories?.length === 0 ? (
        <div className='glass p-20 rounded-[40px] text-center'>
          <div className='bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6'>
            <ImageIcon className='text-primary' size={32} />
          </div>
          <h2 className='text-2xl font-serif font-bold mb-3'>Tu menú está vacío</h2>
          <p className='text-foreground/60 mb-8 max-w-sm mx-auto'>Empieza creando una categoría como "Entradas" o "Bebidas" para organizar tus platos.</p>
        </div>
      ) : (
        <div className='space-y-12'>
           {categories?.map((category) => (
            <div key={category.id} className='space-y-8 bg-surface-container-low/30 p-8 rounded-[2.5rem]'>
              <div className='flex items-center justify-between pb-2'>
                <h3 className='text-2xl font-serif font-bold flex items-center gap-3'>
                  {category.name}
                  <span className='text-xs font-sans font-medium px-2 py-1 rounded bg-white/5 text-foreground/40 uppercase tracking-widest'>
                    {category.menu_items?.length || 0} ITEMS
                  </span>
                </h3>
                <form action={async () => {
                  'use server';
                  await deleteCategory(category.id);
                }}>
                  <button type='submit' className='p-2 text-foreground/20 hover:text-red-400 transition-colors'>
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {category.menu_items?.map((item: any) => (
                  <div key={item.id} className='bg-surface-container-high rounded-[2rem] overflow-hidden group hover:bg-surface-bright transition-all shadow-xl'>
                    <div className='h-48 overflow-hidden relative'>
                      {item.image_url ? (
                        <img src={item.image_url} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt={item.name} />
                      ) : (
                        <div className='w-full h-full bg-surface-container-lowest flex items-center justify-center'>
                          <ImageIcon size={32} className='text-foreground/10' />
                        </div>
                      )}
                      
                      <div className='absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all'>
                        <form action={async () => {
                          'use server';
                          await deleteMenuItem(item.id, item.image_url);
                        }}>
                          <button type='submit' className='bg-red-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-red-600 transition-colors'>
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className='p-6'>
                      <div className='flex items-start justify-between mb-2'>
                        <h4 className='text-xl font-bold'>{item.name}</h4>
                        <span className='text-lg font-serif font-bold text-primary'>
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className='text-sm text-foreground/60 line-clamp-2 leading-relaxed'>
                        {item.description || 'Sin descripción.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
