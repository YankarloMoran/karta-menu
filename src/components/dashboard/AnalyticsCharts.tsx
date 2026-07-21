'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ChartDataPoint {
  date: string;
  views: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className='glass p-4 rounded-xl border border-white/10 shadow-2xl'>
        <p className='text-xs text-foreground/40 font-bold uppercase tracking-widest mb-1'>{label}</p>
        <p className='text-2xl font-serif font-bold text-primary'>{payload[0].value}</p>
        <p className='text-[10px] text-foreground/30 mt-0.5'>visitas</p>
      </div>
    );
  }
  return null;
}

export default function AnalyticsCharts({ data }: { data: ChartDataPoint[] }) {
  const t = useTranslations('Dashboard');
  const hasData = data.some(d => d.views > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='glass p-8 rounded-[32px] border border-white/5'
    >
      <h3 className='text-xl font-serif font-bold mb-6 flex items-center gap-3'>
        <BarChart3 className='text-primary' size={20} />
        {t('traffic_chart')}
      </h3>

      {hasData ? (
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id='viewsGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#FF5F1F' stopOpacity={0.3} />
                  <stop offset='100%' stopColor='#FF5F1F' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.04)' />
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type='monotone'
                dataKey='views'
                stroke='#FF5F1F'
                strokeWidth={2.5}
                fill='url(#viewsGradient)'
                animationDuration={1500}
                animationEasing='ease-out'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className='h-64 flex flex-col items-center justify-center text-center'>
          <BarChart3 size={48} className='text-foreground/10 mb-4' />
          <p className='text-foreground/30 text-sm font-medium'>{t('no_chart_data')}</p>
        </div>
      )}
    </motion.div>
  );
}
