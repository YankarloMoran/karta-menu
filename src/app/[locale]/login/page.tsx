import Link from 'next/link';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { login } from '@/app/actions/auth';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12'>
      <div className='absolute top-0 left-0 p-8'>
        <Link href='/' className='flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors'>
          <ArrowLeft size={16} /> Volver al Inicio
        </Link>
      </div>

      <div className='w-full max-w-md'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-serif font-bold mb-3'>Bienvenido de Nuevo</h1>
          <p className='text-foreground/60'>Gestiona tu menú digital en tiempo real.</p>
        </div>

        <div className='glass p-8 rounded-3xl'>
          <form action={login} className='space-y-6'>
            {message && (
              <p className='text-center text-sm font-medium text-red-500 bg-red-500/10 py-3 rounded-lg'>
                {message}
              </p>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium ml-1'>Correo Electrónico</label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40' size={18} />
                <input 
                  type='email'
                  name='email'
                  required
                  placeholder='tu@restaurante.com'
                  className='w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium ml-1'>Contraseña</label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40' size={18} />
                <input 
                  type='password'
                  name='password'
                  required
                  placeholder='••••••••'
                  className='w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground'
                />
              </div>
            </div>

            <button type='submit' className='w-full bg-gradient-ember text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform active:scale-[0.98] cursor-pointer'>
              Iniciar Sesión
            </button>
          </form>

          <p className='text-center mt-8 text-sm text-foreground/60'>
            ¿No tienes cuenta? <Link href='/register' className='text-primary font-bold hover:underline'>Regístrate Ahora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
