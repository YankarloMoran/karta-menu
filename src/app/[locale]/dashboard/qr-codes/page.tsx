import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import QRClient from '@/components/dashboard/QRClient';
import { getTranslations } from 'next-intl/server';

export default async function QRCodesPage() {
  const supabase = await createClient();
  const t = await getTranslations('Dashboard');
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
      <div className='glass p-20 rounded-[40px] text-center animate-fade-in'>
        <h2 className='text-2xl font-serif font-bold mb-3'>{t('qr_not_found')}</h2>
        <p className='text-foreground/50'>{t('qr_not_found_desc')}</p>
      </div>
    );
  }

  return <QRClient restaurant={restaurant} />;
}
