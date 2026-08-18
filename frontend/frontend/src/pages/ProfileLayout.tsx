import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileLayout() {
  const { user } = useAuthStore();

  const navItems = [
    { path: '/profile/info', label: 'Information', icon: User },
    { path: '/profile/security', label: 'Security', icon: Shield },
    { path: '/profile/messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-6"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-golden-400 to-golden-600 p-[2px] shadow-[0_0_30px_rgba(217,255,114,0.22)]">
            <div className="w-full h-full bg-[#1a1c23] rounded-2xl overflow-hidden relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'GG'}&backgroundColor=transparent`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              {user?.username || 'Commander'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-golden-500/10 border border-golden-500/30 rounded-full text-golden-400 text-xs font-mono tracking-widest uppercase">
                {user?.role || 'Player'}
              </span>
              <span className="text-slate-500 text-sm font-mono">
                ID: {user?.id?.substring(0, 8) || '00000000'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-64 flex-shrink-0 space-y-2"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? 'bg-golden-500/10 text-golden-400 border border-golden-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-golden-500"
                      />
                    )}
                    <item.icon size={18} className={isActive ? 'text-golden-400' : 'group-hover:text-white'} />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-gradient-to-br from-[#101513] to-[#070908] rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-golden-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
