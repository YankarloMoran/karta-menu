'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateRestaurantAction } from '@/app/actions/restaurant';
import { Camera, Save, Loader2, MapPin, Phone, Globe, Clock } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const supabase = createClient();
  const toast = useToast();
  const t = useTranslations('Dashboard');
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('restaurant_id')
        .eq('user_id', user.id)
        .single();

      const { data: res } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', profile?.restaurant_id)
        .single();

      setRestaurant(res);
      setLogoPreview(res?.logo_url || null);
    };
    fetchRestaurant();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updateRestaurantAction(formData);
    setIsPending(false);

    if (result.success) {
      toast.success(t('settings_success'));
    } else {
      toast.error(result.error || t('settings_error'));
    }
  }

  if (!restaurant) {
    return (
      <div className='max-w-4xl mx-auto space-y-10 animate-fade-in'>
        <div className='space-y-3'>
          <div className='h-10 w-72 skeleton rounded-xl' />
          <div className='h-4 w-48 skeleton rounded' />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          <div className='skeleton rounded-[40px] h-72' />
          <div className='lg:col-span-2 skeleton rounded-[40px] h-96' />
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-10 animate-fade-in'>
      <div>
        <h1 className='text-3xl md:text-4xl font-serif font-bold mb-2 text-gradient-ember'>{t('settings_title')}</h1>
        <p className='text-foreground/50'>{t('settings_subtitle')}</p>
      </div>

      <form action={handleSubmit} className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <input type='hidden' name='restaurantId' value={restaurant.id} />

        {/* Left: Logo */}
        <div className='space-y-6'>
          <div className='glass p-8 rounded-[40px] flex flex-col items-center text-center'>
            <div className='relative group h-40 w-40 rounded-full bg-surface-container-lowest border-4 border-primary/20 p-2 overflow-hidden mb-6'>
              {logoPreview ? (
                <img src={logoPreview} className='w-full h-full object-cover rounded-full' alt='Logo' />
              ) : (
                <div className='w-full h-full flex items-center justify-center opacity-10'><Globe size={48} /></div>
              )}
              <div
                className='absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={24} className='text-white mb-1' />
                <span className='text-[10px] text-white font-bold uppercase'>{t('settings_change')}</span>
              </div>
              <input type='file' name='logo' ref={fileInputRef} onChange={handleLogoChange} className='hidden' accept='image/*' />
            </div>
            <h3 className='font-bold text-lg mb-1'>{t('settings_logo_title')}</h3>
            <p className='text-xs text-foreground/40 leading-relaxed px-4'>{t('settings_logo_desc')}</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='glass p-10 rounded-[40px] space-y-8'>
            <div className='space-y-2'>
              <label className='text-sm font-bold uppercase tracking-widest text-foreground/40 px-1'>{t('settings_name')}</label>
              <input
                type='text' name='name' defaultValue={restaurant.name} required
                className='w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-bold'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-bold uppercase tracking-widest text-foreground/40 px-1 flex items-center gap-2'><MapPin size={14} /> {t('settings_address')}</label>
                <input
                  type='text' name='address' defaultValue={restaurant.address || ''}
                  placeholder='Zona 10, Ciudad de Guatemala'
                  className='w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary outline-none transition-all'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-bold uppercase tracking-widest text-foreground/40 px-1 flex items-center gap-2'><Phone size={14} /> {t('settings_phone')}</label>
                <input
                  type='text' name='phone' defaultValue={restaurant.phone || ''}
                  placeholder='+502 1234 5678'
                  className='w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary outline-none transition-all'
                />
              </div>
            </div>

            {/* Business Hours */}
            <div className='space-y-4 pt-4 border-t border-white/5'>
              <label className='text-sm font-bold uppercase tracking-widest text-foreground/40 px-1 flex items-center gap-2'>
                <Clock size={14} /> {t('settings_hours_title')}
              </label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {['Lun-Vie', 'Sáb-Dom'].map((label, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <span className='text-xs font-bold text-foreground/30 w-16'>{label}</span>
                    <input
                      type='text'
                      placeholder='8:00 AM - 10:00 PM'
                      className='flex-1 bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all text-sm'
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type='submit' disabled={isPending}
              className='w-full bg-gradient-ember text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50'
            >
              {isPending ? <Loader2 className='animate-spin' /> : <><Save size={20} /> {t('settings_save')}</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
