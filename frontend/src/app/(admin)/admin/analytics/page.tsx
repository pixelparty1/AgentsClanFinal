'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  Target,
  Calendar,
  ChevronDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface DailyMetrics {
  $id: string;
  date: string;
  new_users: number;
  orders_count: number;
  revenue: number;
  quests_completed: number;
  page_views?: number;
}

interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

type DateRange = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [metrics, setMetrics] = useState<DailyMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[dateRange];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ANALYTICS,
        [
          Query.greaterThanEqual('date', startDate.toISOString().split('T')[0]),
          Query.orderDesc('date'),
          Query.limit(days)
        ]
      );

      setMetrics(response.documents as unknown as DailyMetrics[]);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Generate mock data for demo
      setMetrics(generateMockData(dateRange));
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (range: DateRange): DailyMetrics[] => {
    const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[range];
    const data: DailyMetrics[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        $id: `mock-${i}`,
        date: date.toISOString().split('T')[0],
        new_users: Math.floor(Math.random() * 50) + 10,
        orders_count: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        quests_completed: Math.floor(Math.random() * 30) + 10,
        page_views: Math.floor(Math.random() * 1000) + 200,
      });
    }
    
    return data.reverse();
  };

  const calculateTotals = () => {
    const totals = metrics.reduce(
      (acc, day) => ({
        users: acc.users + day.new_users,
        orders: acc.orders + day.orders_count,
        revenue: acc.revenue + day.revenue,
        quests: acc.quests + day.quests_completed,
      }),
      { users: 0, orders: 0, revenue: 0, quests: 0 }
    );

    // Calculate previous period for comparison
    const halfLength = Math.floor(metrics.length / 2);
    const currentPeriod = metrics.slice(halfLength);
    const previousPeriod = metrics.slice(0, halfLength);

    const currentRevenue = currentPeriod.reduce((sum, d) => sum + d.revenue, 0);
    const previousRevenue = previousPeriod.reduce((sum, d) => sum + d.revenue, 0);
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const currentUsers = currentPeriod.reduce((sum, d) => sum + d.new_users, 0);
    const previousUsers = previousPeriod.reduce((sum, d) => sum + d.new_users, 0);
    const usersChange = previousUsers > 0 
      ? ((currentUsers - previousUsers) / previousUsers) * 100 
      : 0;

    const currentOrders = currentPeriod.reduce((sum, d) => sum + d.orders_count, 0);
    const previousOrders = previousPeriod.reduce((sum, d) => sum + d.orders_count, 0);
    const ordersChange = previousOrders > 0 
      ? ((currentOrders - previousOrders) / previousOrders) * 100 
      : 0;

    const currentQuests = currentPeriod.reduce((sum, d) => sum + d.quests_completed, 0);
    const previousQuests = previousPeriod.reduce((sum, d) => sum + d.quests_completed, 0);
    const questsChange = previousQuests > 0 
      ? ((currentQuests - previousQuests) / previousQuests) * 100 
      : 0;

    return {
      totals,
      changes: {
        revenue: revenueChange,
        users: usersChange,
        orders: ordersChange,
        quests: questsChange,
      },
    };
  };

  const { totals, changes } = calculateTotals();

  const metricCards: MetricCard[] = [
    {
      label: 'Total Revenue',
      value: `₹${totals.revenue.toLocaleString('en-IN')}`,
      change: changes.revenue,
      icon: <IndianRupee className="w-5 h-5" />,
      color: 'emerald',
    },
    {
      label: 'New Users',
      value: totals.users,
      change: changes.users,
      icon: <Users className="w-5 h-5" />,
      color: 'blue',
    },
    {
      label: 'Orders',
      value: totals.orders,
      change: changes.orders,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'purple',
    },
    {
      label: 'Quests Completed',
      value: totals.quests,
      change: changes.quests,
      icon: <Target className="w-5 h-5" />,
      color: 'amber',
    },
  ];

  const dateRangeLabels: Record<DateRange, string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '1y': 'Last year',
  };

  // Calculate chart data
  const chartData = metrics.slice(-30); // Last 30 days max for chart
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const maxUsers = Math.max(...chartData.map((d) => d.new_users), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-400 mt-1">Track your community growth and revenue</p>
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRangeDropdown(!showRangeDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{dateRangeLabels[dateRange]}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showRangeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-40 rounded-xl border border-emerald-900/30 bg-[#0a0f0d] shadow-xl overflow-hidden z-10"
            >
              {(Object.keys(dateRangeLabels) as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setShowRangeDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-emerald-950/40 transition-colors ${
                    range === dateRange ? 'bg-emerald-950/20 text-emerald-400' : ''
                  }`}
                >
                  {dateRangeLabels[range]}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border border-${card.color}-900/30 bg-gradient-to-br from-${card.color}-950/20 to-transparent`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-${card.color}-500/10 text-${card.color}-400`}>
                {card.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  card.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {card.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(card.change).toFixed(1)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-gray-400 text-sm mt-1">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-emerald-900/30 bg-gradient-to-br from-emerald-950/10 to-transparent"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold">Revenue Trend</h3>
            </div>
          </div>
          
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            <div className="h-48 flex items-end gap-1">
              {chartData.map((day, index) => (
                <div
                  key={day.$id}
                  className="flex-1 group relative"
                  title={`${day.date}: ₹${day.revenue.toLocaleString('en-IN')}`}
                >
                  <div
                    className="w-full bg-emerald-500/60 rounded-t hover:bg-emerald-400/80 transition-colors"
                    style={{
                      height: `${(day.revenue / maxRevenue) * 100}%`,
                      minHeight: '4px',
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    ₹{day.revenue.toLocaleString('en-IN')}
                    <br />
                    <span className="text-gray-400">{day.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Users Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-blue-900/30 bg-gradient-to-br from-blue-950/10 to-transparent"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">User Growth</h3>
            </div>
          </div>
          
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <div className="h-48 flex items-end gap-1">
              {chartData.map((day) => (
                <div
                  key={day.$id}
                  className="flex-1 group relative"
                  title={`${day.date}: ${day.new_users} users`}
                >
                  <div
                    className="w-full bg-blue-500/60 rounded-t hover:bg-blue-400/80 transition-colors"
                    style={{
                      height: `${(day.new_users / maxUsers) * 100}%`,
                      minHeight: '4px',
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {day.new_users} users
                    <br />
                    <span className="text-gray-400">{day.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-emerald-900/30 bg-emerald-950/10"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Best Revenue Days
          </h3>
          <div className="space-y-3">
            {[...metrics]
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((day, index) => (
                <div
                  key={day.$id}
                  className="flex items-center justify-between py-2 border-b border-emerald-900/10 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                        index === 0
                          ? 'bg-amber-500/20 text-amber-400'
                          : index === 1
                          ? 'bg-gray-400/20 text-gray-300'
                          : index === 2
                          ? 'bg-amber-700/20 text-amber-600'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm">{new Date(day.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}</span>
                  </div>
                  <span className="text-emerald-400 font-medium">
                    ₹{day.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Membership Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-2xl border border-purple-900/30 bg-purple-950/10"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Membership Distribution
          </h3>
          <div className="space-y-4">
            {[
              { tier: 'Platinum', count: 12, color: 'bg-purple-500' },
              { tier: 'Gold', count: 45, color: 'bg-amber-500' },
              { tier: 'Silver', count: 128, color: 'bg-gray-400' },
              { tier: 'Bronze', count: 256, color: 'bg-amber-700' },
              { tier: 'Free', count: 1024, color: 'bg-emerald-600' },
            ].map((tier) => {
              const total = 12 + 45 + 128 + 256 + 1024;
              const percentage = (tier.count / total) * 100;
              return (
                <div key={tier.tier}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{tier.tier}</span>
                    <span className="text-sm text-gray-400">{tier.count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${tier.color} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quest Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl border border-amber-900/30 bg-amber-950/10"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Quest Performance
          </h3>
          <div className="space-y-4">
            {[
              { type: 'Social', completed: 342, total: 400 },
              { type: 'Content', completed: 189, total: 250 },
              { type: 'Referral', completed: 78, total: 150 },
              { type: 'Community', completed: 456, total: 500 },
              { type: 'Special', completed: 23, total: 50 },
            ].map((quest) => {
              const percentage = (quest.completed / quest.total) * 100;
              return (
                <div key={quest.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{quest.type}</span>
                    <span className="text-sm text-gray-400">
                      {quest.completed}/{quest.total}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
