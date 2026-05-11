'use client';

import { Link, usePathname } from '@/i18n/routing';
import { Home, List, QrCode, Settings, LogOut, Menu as MenuIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTranslations } from 'next-intl';

const navItems = [
  { href: '/dashboard', icon: Home, labelKey: 'home' },
  { href: '/dashboard/menu', icon: List, labelKey: 'menu' },
  { href: '/dashboard/qr-codes', icon: QrCode, labelKey: 'qr' },
  { href: '/dashboard/settings', icon: Settings, labelKey: 'settings' },
] as const;

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Dashboard');

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className={`h-20 flex items-center ${collapsed ? 'justify-center px-2' : 'px-6'} border-b border-white/5`}>
        {!collapsed && (
          <span className='text-2xl font-serif font-bold text-gradient-ember tracking-tight'>Kartá</span>
        )}
        {collapsed && (
          <span className='text-2xl font-serif font-bold text-gradient-ember'>K</span>
        )}
      </div>

      <nav className='flex-1 py-6 px-3 space-y-1.5'>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                active
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground/50 hover:bg-white/5 hover:text-foreground/80'
              }`}
            >
              {active && (
                <motion.div
                  layoutId='sidebar-active'
                  className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full'
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} className={active ? 'text-primary' : ''} />
              {!collapsed && <span className='text-sm'>{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      <div className='p-3 border-t border-white/5 space-y-2'>
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} items-center px-2`}>
          <ThemeToggle />
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className='p-2 text-foreground/30 hover:text-foreground/60 transition-colors hidden md:block'
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        <form action={logout}>
          <button type='submit' className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300`}>
            <LogOut size={20} />
            {!collapsed && <span className='text-sm font-medium'>{t('logout')}</span>}
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      {/* Desktop Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} glass hidden md:flex flex-col border-r border-white/5 transition-all duration-300 relative`}>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className='absolute -right-3 top-24 z-10 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform'
          >
            <ChevronRight size={12} />
          </button>
        )}
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden'
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='fixed left-0 top-0 bottom-0 w-72 glass z-50 flex flex-col md:hidden border-r border-white/5'
            >
              <button
                onClick={() => setMobileOpen(false)}
                className='absolute top-6 right-4 p-2 text-foreground/40 hover:text-foreground/80'
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Mobile Header */}
        <header className='h-16 md:hidden glass flex items-center justify-between px-4 border-b border-white/5'>
          <button onClick={() => setMobileOpen(true)} className='p-2 text-foreground/60 hover:text-foreground/80 transition-colors'>
            <MenuIcon size={24} />
          </button>
          <span className='text-xl font-serif font-bold text-gradient-ember tracking-tight'>Kartá</span>
          <ThemeToggle />
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
