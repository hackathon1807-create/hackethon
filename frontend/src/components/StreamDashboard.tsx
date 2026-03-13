import React from 'react';
import { Phone, Radio, AlertTriangle, Waves, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreamDashboardProps {
    type: 'call' | 'stream';
}

const StreamDashboard: React.FC<StreamDashboardProps> = ({ type }) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Signal Visualizer */}
                <div className="glass rounded-[2rem] p-8 min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                            <div className="w-1 h-3 bg-primary rounded-full"></div>
                            {type === 'call' ? 'Signal Frequency Audit' : 'Bitrate Spectral Pulse'}
                        </h4>
                        <div className="text-security-green text-[10px] font-mono animate-pulse uppercase">Linked // Encrypted</div>
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-1 h-32 overflow-hidden">
                        {[...Array(40)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 20 }}
                                animate={{ height: Math.random() * 80 + 20 }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.02 }}
                                className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-primary/40' : 'bg-primary/20'}`}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between border-t border-white/5 pt-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono opacity-40 uppercase">Latency</span>
                            <span className="text-xs font-mono">14ms</span>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-[9px] font-mono opacity-40 uppercase">Sample Rate</span>
                            <span className="text-xs font-mono">48 kHz</span>
                        </div>
                    </div>
                </div>

                {/* Threat Level & Alerts */}
                <div className="glass rounded-[2rem] p-8 flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold tracking-tight">Real-time Perimeter Scan</h4>
                            <p className="text-[10px] opacity-40 font-mono italic">SOURCE: OMNI-RECV-V3</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[160px] pr-2 scrollbar-hide">
                        {[
                            { time: "15:44:02", msg: "Spectral shift detected in mid-range", threat: "low" },
                            { time: "15:44:09", msg: "Robotic delivery artifact found at 2400Hz", threat: "med" },
                            { time: "15:44:15", msg: "Liveness baseline confirmed", threat: "none" },
                            { time: "15:44:22", msg: "Checking for neural cloning artifacts...", threat: "none" },
                        ].map((alert, i) => (
                            <div key={i} className="flex gap-4 items-start border-l border-white/5 pl-4">
                                <span className="text-[9px] font-mono opacity-20 whitespace-nowrap">{alert.time}</span>
                                <div className="flex flex-col gap-1">
                                    <p className="text-[10px] leading-tight opacity-70">{alert.msg}</p>
                                    <div className={`text-[8px] font-mono uppercase ${alert.threat === 'red' ? 'text-red-500' : alert.threat === 'med' ? 'text-orange-500' : 'text-security-green'}`}>
                                        [{alert.threat === 'none' ? 'Info' : alert.threat === 'med' ? 'Warning' : 'Critical'}]
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Control Strip */}
            <div className="glass rounded-[2rem] p-6 flex flex-wrap gap-4 items-center justify-between bg-primary/5 border-primary/20">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary text-white rounded-2xl glow-blue">
                        {type === 'call' ? <Phone size={24} /> : <Radio size={24} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{type === 'call' ? 'Secure DeepCall Relay' : 'Neural Stream Audit'}</h3>
                        <p className="text-[10px] opacity-40 font-mono uppercase tracking-widest">Awaiting Active Connection...</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-6 py-3 rounded-xl border border-white/10 text-[11px] font-bold hover:bg-white/5 transition-all uppercase tracking-widest">Bypass Engine</button>
                    <button className="px-8 py-3 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary/80 transition-all glow-blue uppercase tracking-widest">Connect Hub</button>
                </div>
            </div>
        </div>
    );
};

export default StreamDashboard;
