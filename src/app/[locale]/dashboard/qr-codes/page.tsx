import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import QRClient from '@/components/dashboard/QRClient';

export default async function QRCodesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .single();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, slug')
    .eq('id', profile?.restaurant_id)
    .single();

  if (!restaurant) {
    return (
      <div className='glass p-20 rounded-[40px] text-center'>
        <h2 className='text-2xl font-serif font-bold mb-3'>Restaurante no encontrado</h2>
        <p className='text-foreground/60'>Crea tu restaurante primero en la configuración.</p>
      </div>
    );
  }

  return <QRClient restaurant={restaurant} />;
}
