'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateRestaurantAction } from '@/app/actions/restaurant';
import { Camera, Save, Loader2, MapPin, Phone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const supabase = createClient();
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
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updateRestaurantAction(formData);
    setIsPending(false);

    if (result.success) {
      alert('Â¡Perfil actualizado con Ã©xito!');
    } else {
      alert(result.error);
    }
  }

  if (!restaurant) return null;

  return (
    <div className='max-w-4xl mx-auto space-y-10'>
      <div>
        <h1 className='text-4xl font-serif font-bold mb-2 text-gradient-ember'>Perfil del Restaurante</h1>
        <p className='text-foreground/60'>Define el alma y la identidad de tu negocio en KartÃ¡.</p>
      </div>

      <form action={handleSubmit} className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <input type='hidden' name='restaurantId' value={restaurant.id} />

        {/* Left Side: Logo Upload */}
        <div className='space-y-6'>
          <div className='glass p-8 rounded-[40px] flex flex-col items-center border-shadow text-center'>
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
                <span className='text-[10px] text-white font-bold uppercase'>Cambiar</span>
              </div>
              <input type='file' name='logo' ref={fileInputRef} onChange={handleLogoChange} className='hidden' accept='image/*' />
            </div>
            <h3 className='font-bold text-lg mb-1'>Logo del Local</h3>
            <p className='text-xs text-foreground/40 leading-relaxed px-4'>Recomendado: 500x500px fondo transparente.</p>
          </div>
        </div>

        {/* Right Side: Identity Form */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='glass p-10 rounded-[40px] space-y-8 border-shadow'>
            <div className='space-y-2'>
              <label className='text-sm font-bold uppercase tracking-widest text-foreground/40 px-1'>Nombre Comercial</label>
              <input 
                type='text' name='name' defaultValue={restaurant.name} required
                className='w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-bold'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-bold uppercase tracking-widest text-foreground/40 px-1 flex items-center gap-2'><MapPin size={14} /> DirecciÃ³n</label>
                <input 
                  type='text' name='address' defaultValue={restaurant.address || ''} 
                  placeholder='Calle Falsa 123, Ciudad'
                  className='w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary outline-none transition-all'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-bold uppercase tracking-widest text-foreground/40 px-1 flex items-center gap-2'><Phone size={14} /> TelÃ©fono</label>
                <input 
                  type='text' name='phone' defaultValue={restaurant.phone || ''} 
                  placeholder='+52 123 456 7890'
                  className='w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary outline-none transition-all'
                />
              </div>
            </div>

            <button 
              type='submit' disabled={isPending}
              className='w-full bg-gradient-ember text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50'
            >
              {isPending ? <Loader2 className='animate-spin' /> : <><Save size={20} /> Guardar Cambios</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
