import { Link } from '@/i18n/routing';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { login } from '@/app/actions/auth';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;
  const t = await getTranslations('Auth');
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10' />
      <div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-amber/5 rounded-full blur-[100px] -z-10' />

      <div className='absolute top-0 left-0 p-8'>
        <Link href='/' className='flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors'>
          <ArrowLeft size={16} /> {t('back_home')}
        </Link>
      </div>

      <div className='w-full max-w-md animate-slide-up'>
        <div className='text-center mb-10'>
          <span className='text-3xl font-serif font-bold text-gradient-ember'>Kartá</span>
          <h1 className='text-3xl md:text-4xl font-serif font-bold mb-3 mt-4'>{t('login_title')}</h1>
          <p className='text-foreground/50'>{t('login_subtitle')}</p>
        </div>

        <div className='glass p-8 rounded-3xl'>
          <form action={login} className='space-y-6'>
            {message && (
              <p className='text-center text-sm font-medium text-red-400 bg-red-500/10 py-3 rounded-xl'>
                {message}
              </p>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium ml-1'>{t('email')}</label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30' size={18} />
                <input
                  type='email' name='email' required placeholder={t('email_placeholder')}
                  className='w-full bg-surface-container-lowest border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium ml-1'>{t('password')}</label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30' size={18} />
                <input
                  type='password' name='password' required placeholder={t('password_placeholder')}
                  className='w-full bg-surface-container-lowest border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none text-foreground'
                />
              </div>
            </div>

            <button type='submit' className='w-full bg-gradient-ember text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform active:scale-[0.98] cursor-pointer shadow-lg shadow-primary/20'>
              {t('login_button')}
            </button>
          </form>

          <p className='text-center mt-8 text-sm text-foreground/50'>
            {t('login_no_account')} <Link href='/register' className='text-primary font-bold hover:underline'>{t('login_register_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
