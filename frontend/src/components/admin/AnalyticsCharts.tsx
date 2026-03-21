'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { GlowCard } from '@/components/ui/glow-card';

// Mock data generators - in production these would come from API
const generateUserGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  return months.slice(0, currentMonth + 1).map((month, i) => ({
    name: month,
    users: Math.floor(50 + i * 35 + Math.random() * 50),
    nftHolders: Math.floor(10 + i * 15 + Math.random() * 20),
  }));
};

const generateRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, i) => ({
    name: month,
    memberships: Math.floor(2000 + i * 1500 + Math.random() * 1000),
    store: Math.floor(1000 + i * 800 + Math.random() * 500),
    nft: Math.floor(500 + i * 1200 + Math.random() * 800),
  }));
};

const generateQuestActivityData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    name: day,
    completed: Math.floor(20 + Math.random() * 80),
    started: Math.floor(40 + Math.random() * 100),
  }));
};

const generateMembershipDistribution = () => [
  { name: 'Free', value: 1247, color: '#6b7280' },
  { name: 'Basic', value: 342, color: '#10b981' },
  { name: 'Pro', value: 89, color: '#8b5cf6' },
  { name: 'Elite', value: 23, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  
  return (
    <div className="bg-[#0a0f0d] border border-emerald-900/50 rounded-lg p-3 shadow-xl">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' && entry.value > 100 
            ? `₹${entry.value.toLocaleString()}` 
            : entry.value}
        </p>
      ))}
    </div>
  );
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <GlowCard>
      <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </GlowCard>
  );
}

export function UserGrowthChart() {
  const data = useMemo(() => generateUserGrowthData(), []);

  return (
    <ChartCard title="User Growth" subtitle="Monthly user acquisition">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="nftGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#1f2937' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#1f2937' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#10b981"
              fill="url(#userGradient)"
              strokeWidth={2}
              name="Total Users"
            />
            <Area
              type="monotone"
              dataKey="nftHolders"
              stroke="#8b5cf6"
              fill="url(#nftGradient)"
              strokeWidth={2}
              name="NFT Holders"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-400">Total Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-400">NFT Holders</span>
        </div>
      </div>
    </ChartCard>
  );
}

export function RevenueChart() {
  const data = useMemo(() => generateRevenueData(), []);

  return (
    <ChartCard title="Revenue Breakdown" subtitle="Monthly revenue by category">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#1f2937' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#1f2937' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="memberships" fill="#10b981" radius={[4, 4, 0, 0]} name="Memberships" />
            <Bar dataKey="store" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Store" />
            <Bar dataKey="nft" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="NFT Sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-400">Memberships</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-400">Store</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-400">NFT Sales</span>
        </div>
      </div>
    </ChartCard>
  );
}

export function QuestActivityChart() {
  const data = useMemo(() => generateQuestActivityData(), []);

  return (
    <ChartCard title="Quest Activity" subtitle="Weekly quest engagement">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#1f2937' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#1f2937' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2 }}
              name="Completed"
            />
            <Line
              type="monotone"
              dataKey="started"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2 }}
              name="Started"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-gray-400">Started</span>
        </div>
      </div>
    </ChartCard>
  );
}

export function MembershipDistributionChart() {
  const data = useMemo(() => generateMembershipDistribution(), []);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard title="Membership Distribution" subtitle="Current member breakdown">
      <div className="h-[300px] flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-400">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{item.value}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <RevenueChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestActivityChart />
        <MembershipDistributionChart />
      </div>
    </div>
  );
}
