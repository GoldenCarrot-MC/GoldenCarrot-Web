import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { motion } from 'framer-motion';
import { Users, UserPlus, Server, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

// Mock data for the chart, since we don't have historical data in backend stats yet
const mockChartData = Array.from({ length: 7 }).map((_, i) => ({
  day: i + 1,
  users: Math.floor(Math.random() * 50) + 10,
}));

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalNews: 0,
    onlinePlayers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: t('admin.dashboard.totalUsers'), value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: t('admin.dashboard.newToday'), value: stats.newUsersToday, icon: UserPlus, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: t('admin.dashboard.onlinePlayers'), value: stats.onlinePlayers, icon: Server, color: 'text-golden-500', bg: 'bg-golden-500/10' },
    { label: t('admin.dashboard.totalNews'), value: stats.totalNews, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-[#1e1e2e] rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-[#1e1e2e] rounded-xl"></div>)}
      </div>
      <div className="h-96 bg-[#1e1e2e] rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('admin.dashboard.title')}</h1>
        <Link 
          to="/admin/news" 
          className="flex items-center gap-2 px-4 py-2 bg-golden-500 text-black rounded-lg font-medium hover:bg-golden-400 transition-colors"
        >
          <span>{t('admin.dashboard.publishNews')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#12121a] p-6 rounded-xl border border-[#1e1e2e] flex items-start gap-4"
          >
            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">{card.label}</div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-white"
              >
                {card.value}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#12121a] p-6 rounded-xl border border-[#1e1e2e]">
        <h2 className="text-lg font-bold text-white mb-6">{t('admin.dashboard.registrationsLast7Days')}</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="day" stroke="#64748b" tickFormatter={(value) => t('admin.dashboard.day', { day: value })} />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#12121a', borderColor: '#1e1e2e', color: '#fff' }}
                itemStyle={{ color: '#fbbf24' }}
              />
              <Line type="monotone" dataKey="users" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
