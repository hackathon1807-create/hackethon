import React, { useState, useEffect } from 'react';
import { ShieldAlert, TrendingUp, AlertCircle, ExternalLink, Hash, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_THREATS = [
    { id: 1, title: "Deepfake Political Leak", platform: "X", severity: "CRITICAL", type: "VIDEO", timestamp: "2m ago" },
    { id: 2, title: "AI Voice Clone Scam — Banking Sector", platform: "WhatsApp", severity: "HIGH", type: "AUDIO", timestamp: "15m ago" },
    { id: 3, title: "Non-consensual Synthetic Imagery Viral", platform: "Telegram", severity: "CRITICAL", type: "IMAGE", timestamp: "31m ago" },
    { id: 4, title: "Fake CEO Endorsement Video Circulating", platform: "LinkedIn", severity: "HIGH", type: "VIDEO", timestamp: "1h ago" },
    { id: 5, title: "Deepfake Courtroom Evidence Attempt", platform: "Email", severity: "CRITICAL", type: "VIDEO", timestamp: "2h ago" },
];

const CrimeFeed: React.FC = () => {
    const [threats, setThreats] = useState<any[]>([]);

    useEffect(() => {
        const fetchThreats = async () => {
            try {
                // Fetch real cybersecurity news feed
                const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
                const data = await res.json();
                
                if (data.status === 'ok' && data.items) {
                    const formattedThreats = data.items.slice(0, 15).map((item: any, index: number) => {
                        // Determine a simulated severity based on keywords
                        const title = item.title.toLowerCase();
                        let severity = 'MODERATE';
                        if (title.includes('breach') || title.includes('hack') || title.includes('critical') || title.includes('zero-day')) severity = 'CRITICAL';
                        else if (title.includes('flaw') || title.includes('vulnerability') || title.includes('leak') || title.includes('scam')) severity = 'HIGH';

                        // Format timestamp to a short string (e.g. "2h ago")
                        const pubDate = new Date(item.pubDate);
                        const diffMins = Math.floor((new Date().getTime() - pubDate.getTime()) / 60000);
                        let timestamp = `${diffMins}m ago`;
                        if (diffMins > 60) timestamp = `${Math.floor(diffMins/60)}h ago`;
                        if (diffMins > 1440) timestamp = `${Math.floor(diffMins/1440)}d ago`;

                        return {
                            id: index,
                            title: item.title,
                            platform: item.categories?.[0] || 'Cyber Sec',
                            severity: severity,
                            type: 'INTEL',
                            timestamp: timestamp,
                            link: item.link
                        };
                    });
                    setThreats(formattedThreats);
                } else {
                    setThreats(MOCK_THREATS);
                }
            } catch {
                setThreats(MOCK_THREATS);
            }
        };
        fetchThreats();
        const interval = setInterval(fetchThreats, 60000); // 1 minute refresh
        return () => clearInterval(interval);
    }, []);

    const getSeverityStyle = (severity: string) => {
        if (severity === 'CRITICAL') return 'bg-blood/20 text-red-400 border-blood/20';
        if (severity === 'HIGH') return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
        return 'bg-sky-500/20 text-sky-400 border-sky-500/20';
    };

    return (
        <div className="relative flex flex-col gap-5 h-full overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                    <TrendingUp size={12} className="text-blood animate-pulse" />
                    Live Threat Intel
                </h3>
                <div className="flex items-center gap-2">
                    <Radio size={10} className="text-blood animate-pulse" />
                    <span className="text-[8px] font-mono text-blood uppercase">Live</span>
                </div>
            </div>

            {/* Threats */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                    {threats.map((threat, i) => (
                        <a key={threat.id || i} href={threat.link || '#'} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-blood/10 transition-all group relative overflow-hidden h-full"
                            >
                                {/* Glow accent for critical */}
                                {threat.severity === 'CRITICAL' && (
                                    <div className="absolute inset-0 bg-blood/5 pointer-events-none" />
                                )}

                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className={`text-[7px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${getSeverityStyle(threat.severity)}`}>
                                        {threat.severity}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[8px] font-mono opacity-20">{threat.timestamp}</span>
                                        <ExternalLink size={10} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                <p className="text-[11px] font-bold mb-2 leading-tight group-hover:text-sky-300 transition-colors line-clamp-2">{threat.title}</p>

                                <div className="flex items-center gap-3">
                                    <span className="text-[8px] font-mono opacity-30 uppercase px-2 py-0.5 border border-white/5 rounded-full">{threat.platform}</span>
                                    <span className="text-[8px] font-mono opacity-20 uppercase">{threat.type}</span>
                                </div>
                            </motion.div>
                        </a>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CrimeFeed;
