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

const data = [
  { name: 'Seg', xp: 400 },
  { name: 'Ter', xp: 700 },
  { name: 'Qua', xp: 900 },
  { name: 'Qui', xp: 1200 },
  { name: 'Sex', xp: 1500 },
  { name: 'Sáb', xp: 1800 },
  { name: 'Dom', xp: 2100 },
];

export function XpChart() {
  return (
    <div className="h-[300px] w-full bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        Progresso de XP
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #1e293b',
              borderRadius: '12px',
              color: '#fff'
            }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area 
            type="monotone" 
            dataKey="xp" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorXp)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
