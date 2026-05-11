import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Users,
  Menu as MenuIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  QrCode,
  ExternalLink,
  MessageCircle,
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

  // Fetch restaurant profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .single();

  const restaurantId = profile?.restaurant_id;

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
        <div className='lg:col-span-2'>
          <AnalyticsCharts data={chartData} />
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
                href='/dashboard/settings'
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
