import Link from 'next/link';
import { Home, List, QrCode, Settings, LogOut, Menu as MenuIcon } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      {/* Sidebar */}
      <aside className='w-64 glass hidden md:flex flex-col border-r border-white/5'>
        <div className='h-20 flex items-center px-6 border-b border-white/5'>
          <span className='text-2xl font-serif font-bold text-gradient-ember tracking-tight'>KartÃ¡</span>
        </div>
        
        <nav className='flex-1 py-6 px-4 space-y-2'>
          <Link href='/dashboard' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-foreground/80 hover:text-white'>
            <Home size={20} className='text-primary' /> Inicio
          </Link>
          <Link href='/dashboard/menu' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-foreground/80 hover:text-white'>
            <List size={20} className='text-primary' /> MenÃº Digital
          </Link>
          <Link href='/dashboard/qr-codes' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-foreground/80 hover:text-white'>
            <QrCode size={20} className='text-primary' /> Generador QR
          </Link>
          <Link href='/dashboard/settings' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-foreground/80 hover:text-white'>
            <Settings size={20} className='text-primary' /> Ajustes
          </Link>
        </nav>

        <div className='p-4 border-t border-white/5'>
          <form action={logout}>
            <button type='submit' className='w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300'>
              <LogOut size={20} /> Cerrar SesiÃ³n
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Mobile Header */}
        <header className='h-16 md:hidden glass flex items-center justify-between px-4 border-b border-white/5'>
          <span className='text-xl font-serif font-bold text-gradient-ember tracking-tight'>KartÃ¡</span>
          <button className='p-2 text-foreground/60 hover:text-white'>
            <MenuIcon size={24} />
          </button>
        </header>

        {/* Dynamic Content Area */}
        <main className='flex-1 overflow-auto bg-background/50 p-6'>
          <div className='max-w-6xl mx-auto'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
