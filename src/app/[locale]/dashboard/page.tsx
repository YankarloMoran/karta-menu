import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { 
  Users, 
  Menu as MenuIcon, 
  TrendingUp, 
  Clock, 
  Star,
  QrCode
} from 'lucide-react';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { startOfDay, subDays, format } from 'date-fns';

export default async function DashboardPage() {
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

  // Fetch metrics: Total Categories & Items
  const { count: categoryCount } = await supabase
    .from('menu_categories')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId);

  const { count: itemCount } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId);

  // Fetch Analytics: Views in the last 7 days
  const sevenDaysAgo = subDays(new Date(), 7).toISOString();
  const { data: viewsData } = await supabase
    .from('analytics_views')
    .select('created_at')
    .eq('restaurant_id', restaurantId)
    .gt('created_at', sevenDaysAgo);

  // Process data for charts
  const chartDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const dateKey = format(subDays(new Date(), i), 'dd/MM');
    chartDataMap[dateKey] = 0;
  }

  viewsData?.forEach(view => {
    const dateKey = format(new Date(view.created_at), 'dd/MM');
    if (chartDataMap[dateKey] !== undefined) {
      chartDataMap[dateKey]++;
    }
  });

  const chartData = Object.keys(chartDataMap).map(date => ({
    date,
    views: chartDataMap[date]
  }));

  const totalViews = viewsData?.length || 0;

  return (
    <div className='space-y-10'>
      <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-4XL font-serif font-bold text-gradient-ember mb-2'>Bienvenido a Kartá</h1>
          <p className='text-foreground/60'>Tus analíticas y gestión en un solo lugar.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard 
          icon={<Users className='text-primary' />} 
          label='Visitas (7d)' 
          value={totalViews.toString()} 
          trend='+12%' 
        />
        <StatCard 
          icon={<MenuIcon className='text-accent-blue' />} 
          label='Platos Activos' 
          value={(itemCount || 0).toString()} 
          trend='Actualizado' 
        />
        <StatCard 
          icon={<Star className='text-yellow-400' />} 
          label='Populares' 
          value='5 Platos' 
          trend='En tendencia' 
        />
        <StatCard 
          icon={<TrendingUp className='text-green-400' />} 
          label='Escaneos Hoy' 
          value={chartData[chartData.length - 1].views.toString()} 
          trend='Tiempo Real' 
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Chart Area */}
        <div className='lg:col-span-2'>
          <AnalyticsCharts data={chartData} />
        </div>

        {/* Quick Actions / Activity */}
        <div className='space-y-6'>
          <div className='glass p-8 rounded-[32px] border border-white/5 h-full'>
            <h3 className='text-xl font-serif font-bold mb-6'>Acciones Rápidas</h3>
            <div className='space-y-4'>
              <QuickActionButton 
                icon={<QrCode size={18} />} 
                label='Descargar mi QR QR' 
                href='/dashboard/qr-codes'
              />
              <QuickActionButton 
                icon={<MenuIcon size={18} />} 
                label='Gestionar Menú' 
                href='/dashboard/menu'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className='glass p-6 rounded-3xl border border-white/5 space-y-4 hover:bg-white/5 transition-all group'>
      <div className='bg-surface-container-lowest w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
        {icon}
      </div>
      <div>
        <p className='text-xs text-foreground/40 font-bold uppercase tracking-widest'>{label}</p>
        <p className='text-3xl font-serif font-bold mt-1'>{value}</p>
      </div>
      <div className='flex items-center gap-2 text-[10px] text-primary font-bold'>
        <Clock size={12} /> {trend}
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, href }: any) {
  return (
    <a href={href} className='flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-primary text-white transition-all group'>
      <div className='p-2 bg-white/10 rounded-xl group-hover:bg-white/20'>
        {icon}
      </div>
      <span className='font-bold text-sm'>{label}</span>
    </a>
  );
}
