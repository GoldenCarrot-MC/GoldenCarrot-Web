import { motion } from 'framer-motion';
import { Mail, Bell, CheckCircle2 } from 'lucide-react';

export default function ProfileMessages() {
  const messages = [
    {
      id: 1,
      title: 'Welcome to Golden Carrot',
      content: 'Thank you for joining our platform. Get ready for an incredible journey.',
      date: '2024-01-01',
      read: true,
      type: 'system',
    },
    {
      id: 2,
      title: 'Security Alert: New Login',
      content: 'A new login was detected from your account on a new device.',
      date: '2024-02-15',
      read: false,
      type: 'alert',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Inbox & Notifications</h2>
          <p className="text-slate-400 text-sm">Stay updated with the latest alerts and messages.</p>
        </div>
        <button className="text-sm text-golden-400 hover:text-golden-300 flex items-center gap-2 transition-colors">
          <CheckCircle2 size={16} />
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-black/40 border border-white/5 rounded-xl">
            <Mail size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-slate-400">No messages found.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              whileHover={{ scale: 1.01 }}
              className={`p-5 rounded-xl border transition-colors ${
                msg.read 
                  ? 'bg-black/40 border-white/5' 
                  : 'bg-golden-500/5 border-golden-500/30 shadow-[0_0_15px_rgba(217,255,114,0.05)]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  msg.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-golden-500/10 text-golden-400'
                }`}>
                  {msg.type === 'alert' ? <Bell size={20} /> : <Mail size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${msg.read ? 'text-slate-300' : 'text-white font-bold'}`}>
                      {msg.title}
                    </h3>
                    <span className="text-xs text-slate-500">{msg.date}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {msg.content}
                  </p>
                </div>
                {!msg.read && (
                  <div className="w-2 h-2 rounded-full bg-golden-500 mt-2" />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
