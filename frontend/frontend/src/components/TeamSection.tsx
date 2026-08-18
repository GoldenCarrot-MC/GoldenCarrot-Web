import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Fingerprint, Users } from 'lucide-react';
import axios from 'axios';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  mcId: string | null;
  qq: string | null;
  github: string | null;
  order: number;
}

const getMinecraftAvatarUrl = (mcId?: string | null) => {
  if (!mcId) {
    return null;
  }

  // 使用 Minotar API 获取头像，相对稳定
  return `https://minotar.net/helm/${encodeURIComponent(mcId)}/128.png`;
};

export function TeamSection() {
  const { t } = useTranslation();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/team');
        setTeam(data);
      } catch (error) {
        console.error('Failed to fetch team members', error);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section id="team" className="py-16 relative z-10 bg-black/90">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="relative group cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              {/* Card Container - 名片比例 (约 1.6:1) */}
              <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-[#101513] to-[#070908] rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_-15px_rgba(217,255,114,0.2)] group-hover:border-golden-500/40 flex flex-col justify-between p-6 md:p-8">
                
                {/* Background Noise/Texture 纹理层 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(217,255,114,0.08), transparent 50%)' }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" style={{ background: 'radial-gradient(circle at 0% 100%, rgba(255,255,255,0.03), transparent 40%)' }} />
                
                {/* Top Gold Edge 顶部金属边缘 */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-golden-500/70 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Shimmer Effect 金属扫光效果 */}
                <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out z-20 pointer-events-none" />

                {/* Top Section: Logo & Role */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-golden-400 to-golden-600 p-[1px] shadow-lg">
                      <div className="w-full h-full bg-[#1a1c23] rounded-lg flex items-center justify-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-golden-400 to-golden-600 font-bold text-sm font-display tracking-wider">GG</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-semibold">Golden Carrot</p>
                      <p className="text-[9px] tracking-[0.3em] text-golden-500/50 uppercase mt-0.5">{t('nav.team')}</p>
                    </div>
                  </div>
                  
                  {/* Role Label */}
                  <div className="bg-black/40 border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-md">
                    <Users size={12} className="text-golden-400" />
                    <span className="text-[10px] font-medium tracking-widest uppercase text-golden-100">{member.role}</span>
                  </div>
                </div>

                {/* Watermark Icon 水印图标 */}
                <div className="absolute -right-6 -bottom-6 opacity-5 transform -rotate-12 transition-all duration-700 group-hover:scale-110 group-hover:opacity-10 group-hover:rotate-0 pointer-events-none">
                  <Users size={160} />
                </div>

                {/* Bottom Section: Avatar & Details */}
                <div className="relative z-10 flex items-end justify-between mt-auto">
                  <div className="flex flex-col">
                    {/* 指纹芯片图标增强科技感 */}
                    <Fingerprint size={24} className="text-white/10 mb-3 group-hover:text-golden-500/40 transition-colors duration-500" />
                    <h3 className="text-3xl font-display font-bold text-white mb-1 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-golden-200 group-hover:to-golden-500 transition-all duration-300">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-golden-500/50 animate-pulse" />
                      <p className="text-[11px] text-white/40 tracking-[0.3em] uppercase font-mono">
                        ID: {member.mcId || member.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Avatar (Photo ID 风格) */}
                  <div className="w-16 h-16 rounded-xl border border-white/10 bg-[#0a0a0c] overflow-hidden relative group-hover:border-golden-500/50 transition-colors duration-500 shadow-xl p-1 z-20">
                    <div className="w-full h-full bg-black/50 rounded-lg overflow-hidden relative">
                      <img 
                        src={member.avatar || getMinecraftAvatarUrl(member.mcId) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}&backgroundColor=transparent`} 
                        alt={member.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // 防止无限循环
                          target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}&backgroundColor=transparent`;
                        }}
                      />
                      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none" />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
