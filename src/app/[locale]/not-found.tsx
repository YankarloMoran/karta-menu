import { Link } from '@/i18n/routing';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-6'>
      <div className='text-center animate-slide-up max-w-md'>
        <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6'>
          <MapPin size={32} className='text-primary' />
        </div>

        <h1 className='text-6xl font-serif font-bold text-gradient-ember mb-4'>404</h1>
        <h2 className='text-xl font-bold mb-3'>Página no encontrada</h2>
        <p className='text-foreground/50 mb-8 leading-relaxed'>
          Lo sentimos, esta página no existe o ha sido movida.
        </p>

        <Link
          href='/'
          className='inline-flex items-center gap-2 bg-gradient-ember text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20'
        >
          <ArrowLeft size={18} /> Volver al inicio
        </Link>
      </div>
    </div>
  );
}
