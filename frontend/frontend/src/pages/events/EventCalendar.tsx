import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsService } from '@/services/events';
import { format, isPast, isFuture, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function EventCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await eventsService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event: any) => {
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : null;
    
    if (isFuture(start)) return { label: '即将开始', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (end && isPast(end)) return { label: '已结束', color: 'text-slate-400', bg: 'bg-slate-500/20' };
    return { label: '进行中', color: 'text-golden-400', bg: 'bg-golden-500/20', pulse: true };
  };

  const getCountdown = (event: any) => {
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : null;

    if (isFuture(start)) {
      return `距离开始还有 ${formatDistanceToNow(start, { locale: zhCN })}`;
    }
    if (end && isFuture(end)) {
      return `距离结束还有 ${formatDistanceToNow(end, { locale: zhCN })}`;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" />
      </div>
    );
  }

  const featuredEvents = events.filter(e => e.weight >= 5).slice(0, 3);
  const timelineEvents = events;

  return (
    <div className="min-h-screen bg-black text-slate-200 relative overflow-hidden">
      {/* Sci-fi Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-golden-900/10 via-black to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-golden-500/20 blur-[100px] pointer-events-none" />
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-golden-300 via-golden-500 to-golden-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(217,255,114,0.22)]">
            活动日历
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">追踪最新活动与重要时间节点，把握每一次参与机会</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Timeline (Left 70%) */}
          <div className="lg:w-[70%]">
            <div className="relative border-l-2 border-golden-500/20 ml-4 md:ml-8 space-y-16">
              {timelineEvents.map((event, index) => {
                const status = getEventStatus(event);
                const isFeatured = event.weight >= 5;
                const isSelected = selectedEventId === event.id;
                
                return (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="relative pl-10 md:pl-16 group"
                  >
                    {/* Node */}
                    <div className={`absolute top-4 rounded-full border-4 border-black transition-all duration-300 ${
                      isFeatured 
                        ? 'w-6 h-6 bg-gradient-to-br from-golden-400 to-golden-600 -left-[13px] shadow-[0_0_20px_rgba(217,255,114,0.4)] group-hover:scale-125' 
                        : 'w-4 h-4 bg-slate-700 -left-[9px] group-hover:bg-golden-500 group-hover:scale-125'
                    } ${status.pulse ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`} />
                    
                    {/* Connector Line Hover Effect */}
                    <div className="absolute top-7 left-0 w-8 h-[2px] bg-golden-500/0 group-hover:bg-golden-500/50 transition-colors duration-300" />
                    
                    <div 
                      className={`relative bg-slate-900/40 backdrop-blur-sm border ${
                        isFeatured 
                          ? 'border-golden-500/40 shadow-[0_0_30px_rgba(217,255,114,0.08)]' 
                          : 'border-white/5 hover:border-golden-500/30'
                      } rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-lg`}
                      onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
                        <h3 className={`text-2xl font-bold transition-colors ${
                          isFeatured ? 'text-transparent bg-clip-text bg-gradient-to-r from-golden-300 to-golden-600' : 'text-slate-200 group-hover:text-golden-400'
                        }`}>
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className={`px-3 py-1.5 rounded-full font-medium border border-current/10 ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="text-slate-400 font-mono bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                            {format(new Date(event.startDate), 'MM.dd')} 
                            {event.endDate && ` - ${format(new Date(event.endDate), 'MM.dd')}`}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden relative z-10"
                          >
                            <div className="pt-6 mt-6 border-t border-white/10 text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {event.description}
                            </div>
                            {event.imageUrl && (
                              <div className="mt-6 rounded-xl overflow-hidden border border-white/10 relative group/img">
                                <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors z-10 pointer-events-none" />
                                <img src={event.imageUrl} alt={event.title} className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-700" />
                              </div>
                            )}
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-golden-500/10 text-golden-400 border border-golden-500/20 rounded-lg text-sm font-mono font-medium">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {getCountdown(event)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Chevron Indicator */}
                      <div className={`absolute bottom-4 right-4 text-slate-500 transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Featured Events (Right 30%) */}
          <div className="lg:w-[30%] space-y-8">
            <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
              <span className="p-2 bg-golden-500/10 rounded-lg text-golden-500 border border-golden-500/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              焦点活动
            </h2>
            
            <div className="space-y-6 sticky top-32">
              {featuredEvents.map((event) => {
                const status = getEventStatus(event);
                return (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-slate-900/60 backdrop-blur-md border border-golden-500/30 rounded-2xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(217,255,114,0.12)] group transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-golden-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {event.imageUrl && (
                      <div className="h-40 w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-20" />
                      </div>
                    )}
                    
                    <div className={`p-6 relative z-30 ${!event.imageUrl ? 'pt-8' : '-mt-8'}`}>
                      <div className="flex items-center gap-2 text-xs mb-3">
                        <span className={`${status.bg} ${status.color} px-2.5 py-1 rounded-full font-medium border border-current/10 shadow-sm`}>{status.label}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-golden-400 transition-colors line-clamp-1 mb-3">{event.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="text-xs font-mono text-golden-500/80 bg-golden-500/5 px-3 py-2 rounded-lg border border-golden-500/10 inline-block">
                        {getCountdown(event)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
