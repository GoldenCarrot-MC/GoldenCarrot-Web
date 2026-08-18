import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/components/ui/Toast';

export default function ProfileSecurity() {
  const { logout } = useAuthStore();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  const checkStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    setStrength(score);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'newPassword') {
      checkStrength(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (strength < 4) {
      toast.error('New password does not meet requirements');
      return;
    }

    setIsLoading(true);
    try {
      await authService.updatePassword(formData);
      toast.success('Password updated successfully. Please login again.');
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update password');
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
        <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
        <p className="text-slate-400 text-sm">Protect your account and manage authentication methods.</p>
      </div>

      <div className="space-y-6">
        {/* Change Password Section */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-golden-500/10 rounded-lg text-golden-500">
              <Key size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Change Password</h3>
              <p className="text-sm text-slate-400 mt-1">Ensure your account is using a strong, random password.</p>
            </div>
          </div>
          
          <form className="space-y-5 max-w-md" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-golden-500/50 transition-all"
                  required
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-golden-500 w-0 group-focus-within:w-full transition-all duration-300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-golden-500/50 transition-all"
                  required
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-golden-500 w-0 group-focus-within:w-full transition-all duration-300" />
              </div>
              {formData.newPassword && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strength >= level 
                          ? strength < 3 ? 'bg-orange-500' : 'bg-green-500' 
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">Requires 8+ chars, uppercase, lowercase, and numbers.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Confirm New Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-golden-500/50 transition-all"
                  required
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-golden-500 w-0 group-focus-within:w-full transition-all duration-300" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || strength < 4 || formData.newPassword !== formData.confirmPassword}
              className="bg-golden-500 hover:bg-golden-400 text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </motion.div>
  );
}