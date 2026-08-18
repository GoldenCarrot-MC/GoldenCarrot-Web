import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, User as UserIcon, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/auth';
import { toast } from '@/components/ui/Toast';
import md5 from 'md5';

export default function ProfileInfo() {
  const { user, checkAuth } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    discordId: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        discordId: user.discordId || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=128`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const avatarUrl = getGravatarUrl(formData.email);
      await authService.updateProfile({ ...formData, avatar: avatarUrl });
      await checkAuth(); // Refresh user data
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-slate-400 text-sm">Manage your personal details and public profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Card */}
        <div className="bg-gradient-to-br from-black/60 to-black/40 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden h-fit">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(217,255,114,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_linear_infinite]" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-2 border-golden-500/50 p-1 mb-4 shadow-[0_0_15px_rgba(217,255,114,0.22)]">
              <img 
                src={user?.avatar || getGravatarUrl(user?.email || '')} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold text-white">{user?.username}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-golden-500/10 border border-golden-500/20 text-golden-400 text-xs font-medium uppercase tracking-wider">
              {user?.role}
            </div>
            
            <div className="w-full mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Mail size={14} /> Email</span>
                <span className="text-slate-300 truncate max-w-[150px]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><MessageSquare size={14} /> Discord</span>
                <span className="text-slate-300">{user?.discordId || 'Not linked'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-6">Update Details</h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-golden-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-golden-500/50 focus:ring-1 focus:ring-golden-500/50 transition-all"
                  required
                />
                {/* Focus indicator line */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-golden-500 w-0 group-focus-within:w-full transition-all duration-300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-golden-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-golden-500/50 focus:ring-1 focus:ring-golden-500/50 transition-all"
                  required
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-golden-500 w-0 group-focus-within:w-full transition-all duration-300" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Your avatar is automatically generated from your email using Gravatar.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Discord ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-golden-500 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <input 
                  type="text" 
                  name="discordId"
                  value={formData.discordId}
                  onChange={handleChange}
                  placeholder="e.g. username#1234"
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-golden-500/50 focus:ring-1 focus:ring-golden-500/50 transition-all"
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-golden-500 w-0 group-focus-within:w-full transition-all duration-300" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-golden-500 hover:bg-golden-400 text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
