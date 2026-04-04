'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';

export default function AnalyticsCharts({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className='h-64 flex items-center justify-center glass rounded-3xl opacity-40 italic'>
        <p>AÃºn no hay suficientes datos para las grÃ¡ficas.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full h-80 glass p-6 rounded-[32px] border border-white/5'
    >
      <h3 className='text-lg font-serif font-bold mb-6 text-foreground/60 px-2'>TrÃ¡fico del Restaurante (7 dÃ­as)</h3>
      <ResponsiveContainer width='100%' height='85%'>
        <AreaChart data={data}>
          <defs>
            <linearGradient id='colorViews' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#FF5F1F' stopOpacity={0.3}/>
              <stop offset='95%' stopColor='#FF5F1F' stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='rgba(255,255,255,0.05)' />
          <XAxis 
            dataKey='date' 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1C1C1E', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: '#fff'
            }}
            itemStyle={{ color: '#FF5F1F' }}
          />
          <Area 
            type='monotone' 
            dataKey='views' 
            stroke='#FF5F1F' 
            strokeWidth={3}
            fillOpacity={1} 
            fill='url(#colorViews)' 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
