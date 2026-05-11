'use client';

import { Link } from '@/i18n/routing';
import { Utensils, Zap, BarChart3, QrCode, ArrowRight, Check, Sparkles, Users, ScanLine, ShoppingBag, Menu, X, Languages } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { usePathname } from '@/i18n/routing';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className='absolute rounded-full bg-primary/20 blur-sm'
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function LandingClient({ locale }: { locale: string }) {
  const t = useTranslations('Landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { value: '500+', label: t('stats_restaurants') },
    { value: '50K+', label: t('stats_scans') },
    { value: '12K+', label: t('stats_orders') },
  ];

  const features = [
    { icon: <Zap className='text-primary' size={28} />, title: t('feature_1_title'), desc: t('feature_1_desc') },
    { icon: <BarChart3 className='text-primary' size={28} />, title: t('feature_2_title'), desc: t('feature_2_desc') },
    { icon: <Utensils className='text-primary' size={28} />, title: t('feature_3_title'), desc: t('feature_3_desc') },
  ];

  const steps = [
    { num: '01', icon: <Users size={24} />, title: t('how_step1_title'), desc: t('how_step1_desc') },
    { num: '02', icon: <Utensils size={24} />, title: t('how_step2_title'), desc: t('how_step2_desc') },
    { num: '03', icon: <QrCode size={24} />, title: t('how_step3_title'), desc: t('how_step3_desc') },
    { num: '04', icon: <ShoppingBag size={24} />, title: t('how_step4_title'), desc: t('how_step4_desc') },
  ];

  const pricingPlans = [
    {
      name: t('plan_essential'),
      price: t('plan_price_free'),
      features: [t('plan_essential_f1'), t('plan_essential_f2'), t('plan_essential_f3'), t('plan_essential_f4')],
    },
    {
      name: t('plan_premium'),
      price: t('plan_price_premium'),
      highlighted: true,
      features: [t('plan_premium_f1'), t('plan_premium_f2'), t('plan_premium_f3'), t('plan_premium_f4')],
    },
    {
      name: t('plan_elite'),
      price: t('plan_price_elite'),
      features: [t('plan_elite_f1'), t('plan_elite_f2'), t('plan_elite_f3'), t('plan_elite_f4')],
    },
  ];

  return (
    <div className='flex-1 flex flex-col relative overflow-hidden'>
      {/* Floating Particles Background */}
      <div className='fixed inset-0 pointer-events-none -z-10'>
        <FloatingParticle delay={0} x='10%' y='20%' size={6} />
        <FloatingParticle delay={1} x='80%' y='15%' size={4} />
        <FloatingParticle delay={2} x='60%' y='60%' size={8} />
        <FloatingParticle delay={0.5} x='25%' y='70%' size={5} />
        <FloatingParticle delay={1.5} x='90%' y='45%' size={3} />
        <FloatingParticle delay={3} x='45%' y='85%' size={7} />
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className='fixed top-0 w-full z-50 glass border-b border-white/5'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl font-serif font-bold text-gradient-ember tracking-tight'>Kartá</span>
          </div>

          {/* Desktop Nav */}
          <div className='hidden md:flex items-center gap-6 text-sm font-medium'>
            <a href='#features' className='hover:text-primary transition-colors'>{t('nav_features')}</a>
            <a href='#pricing' className='hover:text-primary transition-colors'>{t('nav_pricing')}</a>
            <Link href={`/m/demo`} locale={locale === 'es' ? 'en' : 'es'} className='hover:text-primary transition-colors flex items-center gap-1.5'>
              <Languages size={14} />
              {locale === 'es' ? 'EN' : 'ES'}
            </Link>
            <ThemeToggle />
            <Link href='/login' className='hover:text-primary transition-colors'>{t('nav_login')}</Link>
            <Link href='/register' className='bg-gradient-ember text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20'>
              {t('nav_register')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className='flex items-center gap-2 md:hidden'>
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='p-2'>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='md:hidden glass border-t border-white/5 p-6 space-y-4'
          >
            <a href='#features' onClick={() => setMobileMenuOpen(false)} className='block py-2 font-medium'>{t('nav_features')}</a>
            <a href='#pricing' onClick={() => setMobileMenuOpen(false)} className='block py-2 font-medium'>{t('nav_pricing')}</a>
            <Link href='/login' className='block py-2 font-medium'>{t('nav_login')}</Link>
            <Link href='/register' className='block bg-gradient-ember text-white px-5 py-3 rounded-xl font-bold text-center'>
              {t('nav_register')}
            </Link>
          </motion.div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className='pt-40 pb-24 px-6 relative overflow-hidden'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px] -z-10' />
        <div className='absolute top-20 right-[10%] w-64 h-64 bg-accent-amber/5 rounded-full blur-[80px] -z-10 animate-float' />

        <div className='max-w-4xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className='inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-8'>
              <Sparkles size={14} />
              <span>Plataforma #1 en Guatemala</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className='text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.05]'
          >
            {t('hero_title_1')} <br />
            <span className='text-gradient-ember'>{t('hero_title_2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className='text-lg md:text-xl text-foreground/60 mb-12 max-w-2xl mx-auto font-sans leading-relaxed'
          >
            {t('hero_description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-4'
          >
            <Link href='/register' className='w-full sm:w-auto bg-gradient-ember text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-primary/25 animate-glow'>
              {t('hero_cta')} <ArrowRight size={20} />
            </Link>
            <Link href='/login' className='w-full sm:w-auto glass px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors'>
              {t('hero_demo')}
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className='mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto'
          >
            {stats.map((stat, i) => (
              <div key={i} className='text-center'>
                <p className='text-2xl md:text-3xl font-serif font-bold text-gradient-ember'>{stat.value}</p>
                <p className='text-[10px] font-bold uppercase tracking-widest text-foreground/30 mt-1'>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id='features' className='py-24 px-6 bg-gradient-mesh'>
        <div className='max-w-7xl mx-auto'>
          <AnimatedSection className='text-center mb-16'>
            <h2 className='text-3xl md:text-5xl font-serif font-bold mb-4'>{t('features_title')}</h2>
            <p className='text-foreground/50 max-w-md mx-auto'>{t('features_subtitle')}</p>
          </AnimatedSection>

          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className='glass p-8 rounded-3xl hover:border-primary/20 transition-all duration-300 group h-full'>
                  <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all'>
                    {feat.icon}
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{feat.title}</h3>
                  <p className='text-foreground/50 leading-relaxed'>{feat.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className='py-24 px-6'>
        <div className='max-w-4xl mx-auto'>
          <AnimatedSection className='text-center mb-16'>
            <h2 className='text-3xl md:text-5xl font-serif font-bold mb-4'>{t('how_title')}</h2>
            <p className='text-foreground/50'>{t('how_subtitle')}</p>
          </AnimatedSection>

          <div className='space-y-0'>
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className='flex gap-6 md:gap-10 items-start relative'>
                  {/* Timeline line */}
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-2xl bg-gradient-ember text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20'>
                      {step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div className='w-px h-16 bg-gradient-to-b from-primary/30 to-transparent mt-2' />
                    )}
                  </div>
                  {/* Content */}
                  <div className='pb-12'>
                    <h3 className='text-lg font-bold mb-1'>{step.title}</h3>
                    <p className='text-foreground/50 text-sm leading-relaxed'>{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id='pricing' className='py-24 px-6 bg-gradient-mesh'>
        <div className='max-w-7xl mx-auto'>
          <AnimatedSection className='text-center mb-16'>
            <h2 className='text-3xl md:text-5xl font-serif font-bold mb-4'>{t('pricing_title')}</h2>
          </AnimatedSection>

          <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            {pricingPlans.map((plan, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className={`p-8 rounded-3xl flex flex-col h-full transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-ember text-white shadow-2xl shadow-primary/20 md:scale-105 relative'
                    : 'glass hover:border-primary/20'
                }`}>
                  {plan.highlighted && (
                    <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg'>
                      Más Popular
                    </div>
                  )}
                  <h3 className='text-xl font-bold mb-2'>{plan.name}</h3>
                  <div className='flex items-baseline gap-1 mb-8'>
                    <span className='text-4xl font-serif font-bold'>Q{plan.price}</span>
                    <span className='text-sm opacity-60'>{t('plan_per_month')}</span>
                  </div>
                  <ul className='flex-1 space-y-4 mb-8'>
                    {plan.features.map((f, fi) => (
                      <li key={fi} className='flex items-center gap-2 text-sm'>
                        <Check size={16} className={plan.highlighted ? 'text-white' : 'text-primary'} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href='/register'
                    className={`w-full py-3.5 rounded-xl font-bold transition-all text-center hover:scale-[1.02] active:scale-[0.98] block ${
                      plan.highlighted
                        ? 'bg-white text-primary hover:bg-white/90'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {t('plan_cta')}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className='py-32 px-6 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-ember opacity-5 animate-gradient-shift' style={{ backgroundSize: '400% 400%' }} />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]' />

        <AnimatedSection className='relative max-w-2xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight'>
            {t('cta_title')}
          </h2>
          <p className='text-lg text-foreground/50 mb-10 max-w-lg mx-auto leading-relaxed'>
            {t('cta_desc')}
          </p>
          <Link href='/register' className='inline-flex items-center gap-3 bg-gradient-ember text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-primary/30 animate-glow'>
            {t('cta_button')} <ArrowRight size={20} />
          </Link>
        </AnimatedSection>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className='py-16 px-6 border-t border-white/5'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-4 gap-12 mb-12'>
            <div>
              <span className='text-2xl font-serif font-bold text-gradient-ember'>Kartá</span>
              <p className='mt-4 text-sm text-foreground/40 leading-relaxed'>
                {t('footer_tagline')}
              </p>
            </div>
            <div>
              <h4 className='font-bold text-sm uppercase tracking-widest text-foreground/30 mb-4'>{t('footer_product')}</h4>
              <div className='space-y-3'>
                <a href='#features' className='block text-sm text-foreground/50 hover:text-primary transition-colors'>{t('nav_features')}</a>
                <a href='#pricing' className='block text-sm text-foreground/50 hover:text-primary transition-colors'>{t('nav_pricing')}</a>
              </div>
            </div>
            <div>
              <h4 className='font-bold text-sm uppercase tracking-widest text-foreground/30 mb-4'>{t('footer_company')}</h4>
              <div className='space-y-3'>
                <a href='#' className='block text-sm text-foreground/50 hover:text-primary transition-colors'>{t('footer_about')}</a>
                <a href='#' className='block text-sm text-foreground/50 hover:text-primary transition-colors'>{t('footer_contact')}</a>
              </div>
            </div>
            <div>
              <h4 className='font-bold text-sm uppercase tracking-widest text-foreground/30 mb-4'>{t('footer_legal')}</h4>
              <div className='space-y-3'>
                <a href='#' className='block text-sm text-foreground/50 hover:text-primary transition-colors'>{t('footer_terms')}</a>
                <a href='#' className='block text-sm text-foreground/50 hover:text-primary transition-colors'>{t('footer_privacy')}</a>
              </div>
            </div>
          </div>
          <div className='pt-8 border-t border-white/5 text-center'>
            <p className='text-xs text-foreground/30'>© 2026 Kartá. {t('footer_tagline')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
