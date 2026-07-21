import { createClient } from '@/lib/supabase/server';
import { ensureUserRestaurant } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  Users,
  Menu as MenuIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  QrCode,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { subDays, format } from 'date-fns';
import { getTranslations } from 'next-intl/server';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Dashboard');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const restaurantId = await ensureUserRestaurant(user);

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, slug')
    .eq('id', restaurantId)
    .single();

  // Fetch metrics
  const { count: categoryCount } = await supabase
    .from('menu_categories')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId);


  const { count: itemCount } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId);

  // Analytics: Views last 14 days (for trend comparison)
  const fourteenDaysAgo = subDays(new Date(), 14).toISOString();
  const sevenDaysAgo = subDays(new Date(), 7).toISOString();

  const { data: allViewsData } = await supabase
    .from('analytics_views')
    .select('created_at')
    .eq('restaurant_id', restaurantId)
    .gt('created_at', fourteenDaysAgo);

  // Split into this week vs last week for trend calculation
  const thisWeekViews = allViewsData?.filter(v => new Date(v.created_at) > new Date(sevenDaysAgo)) || [];
  const lastWeekViews = allViewsData?.filter(v => new Date(v.created_at) <= new Date(sevenDaysAgo)) || [];

  const trendPercent = lastWeekViews.length > 0
    ? Math.round(((thisWeekViews.length - lastWeekViews.length) / lastWeekViews.length) * 100)
    : thisWeekViews.length > 0 ? 100 : 0;

  // Process chart data for 7-day chart
  const chartDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const dateKey = format(subDays(new Date(), i), 'dd/MM');
    chartDataMap[dateKey] = 0;
  }

  thisWeekViews.forEach(view => {
    const dateKey = format(new Date(view.created_at), 'dd/MM');
    if (chartDataMap[dateKey] !== undefined) {
      chartDataMap[dateKey]++;
    }
  });

  const chartData = Object.keys(chartDataMap).map(date => ({
    date,
    views: chartDataMap[date]
  }));

  const totalViews = thisWeekViews.length;
  const todayViews = chartData[chartData.length - 1]?.views || 0;

  // Dynamic greeting based on time
  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? 'greeting_morning' : hour < 18 ? 'greeting_afternoon' : 'greeting_evening';

  // Fetch top dishes for restaurant
  const { data: popularItems } = await supabase
    .from('menu_items')
    .select('id, name, price, image_url, is_recommended, is_vegetarian, is_spicy')
    .eq('restaurant_id', restaurantId)
    .limit(4);

  return (
    <div className='space-y-10 stagger-children'>
      <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-3xl md:text-4xl font-serif font-bold text-gradient-ember mb-2'>{t(greetingKey)} 👋</h1>
          <p className='text-foreground/50'>{t('subtitle')}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          icon={<Users className='text-primary' size={20} />}
          label={t('visits_7d')}
          value={totalViews.toString()}
          trend={`${trendPercent >= 0 ? '+' : ''}${trendPercent}%`}
          trendUp={trendPercent >= 0}
        />
        <StatCard
          icon={<MenuIcon className='text-accent-amber' size={20} />}
          label={t('active_dishes')}
          value={(itemCount || 0).toString()}
          trend={t('updated')}
        />
        <StatCard
          icon={<Star className='text-accent-amber' size={20} />}
          label={t('popular_dishes')}
          value={`${categoryCount || 0} ${t('items_count').toLowerCase()}`}
          trend={t('trending')}
        />
        <StatCard
          icon={<TrendingUp className='text-accent-emerald' size={20} />}
          label={t('scans_today')}
          value={todayViews.toString()}
          trend={t('realtime')}
          trendUp={true}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Chart Area */}
        <div className='lg:col-span-2 space-y-8'>
          <AnalyticsCharts data={chartData} />

          {/* Popular Dishes Highlight */}
          <div className='glass p-8 rounded-[32px] border border-white/5 space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-serif font-bold flex items-center gap-2'>
                <Star size={20} className='text-amber-400 fill-current' /> Platos Destacados del Menú
              </h3>
              <Link href='/dashboard/menu' className='text-xs font-bold text-primary hover:underline flex items-center gap-1'>
                Ver menú completo <ArrowUpRight size={14} />
              </Link>
            </div>

            {popularItems && popularItems.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {popularItems.map((item) => (
                  <div key={item.id} className='flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5'>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className='w-12 h-12 rounded-xl object-cover' />
                    ) : (
                      <div className='w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-xs text-foreground/30 font-bold'>
                        Kartá
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-bold text-sm truncate'>{item.name}</h4>
                      <p className='text-xs font-serif font-bold text-primary'>Q{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-xs text-foreground/40 italic'>Aún no has agregado platos a tu menú.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='space-y-6'>
          <div className='glass p-8 rounded-[32px] border border-white/5 h-full'>
            <h3 className='text-xl font-serif font-bold mb-6'>{t('quick_actions')}</h3>
            <div className='space-y-3'>
              <QuickActionButton
                icon={<QrCode size={18} />}
                label={t('download_qr')}
                href='/dashboard/qr-codes'
              />
              <QuickActionButton
                icon={<MenuIcon size={18} />}
                label={t('manage_menu')}
                href='/dashboard/menu'
              />
              <QuickActionButton
                icon={<ExternalLink size={18} />}
                label={t('view_public_menu')}
                href={restaurant?.slug ? `/${locale}/m/${restaurant.slug}` : '/dashboard/settings'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className='glass p-6 rounded-3xl border border-white/5 space-y-4 hover:border-primary/15 transition-all duration-300 group'>
      <div className='bg-surface-container-lowest w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
        {icon}
      </div>
      <div>
        <p className='text-[10px] text-foreground/35 font-bold uppercase tracking-widest'>{label}</p>
        <p className='text-3xl font-serif font-bold mt-1'>{value}</p>
      </div>
      <div className={`flex items-center gap-1.5 text-[10px] font-bold ${trendUp === true ? 'text-accent-emerald' : trendUp === false ? 'text-red-400' : 'text-foreground/30'}`}>
        {trendUp === true ? <ArrowUpRight size={12} /> : trendUp === false ? <TrendingDown size={12} /> : <Clock size={12} />}
        {trend}
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, href }: QuickActionProps) {
  return (
    <a href={href} className='flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-primary/10 text-foreground/80 hover:text-primary transition-all group'>
      <div className='p-2 bg-white/10 rounded-xl group-hover:bg-primary/20 transition-colors'>
        {icon}
      </div>
      <span className='font-bold text-sm'>{label}</span>
      <ArrowUpRight size={14} className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity' />
    </a>
  );
}
