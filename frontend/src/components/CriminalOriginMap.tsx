import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Share2, ShieldAlert } from 'lucide-react';

interface SourceNodeProps {
    label: string;
    platform: string;
    isOrigin?: boolean;
    delay: number;
}

const SourceNode = ({ label, platform, isOrigin, delay }: SourceNodeProps) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border flex flex-col gap-1 md:gap-2 relative min-w-[120px] md:min-w-[180px] ${
            isOrigin ? 'bg-primary/20 border-primary shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/5'
        }`}
    >
        {isOrigin && (
            <div className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg">
                <ShieldAlert size={12} />
            </div>
        )}
        <div className="flex items-center gap-2 mb-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isOrigin ? 'bg-primary animate-pulse' : 'bg-white/40'}`} />
            <span className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase tracking-widest truncate">{platform}</span>
        </div>
        <span className="text-[10px] md:text-sm font-bold truncate leading-none">{label}</span>
        {isOrigin && <span className="text-[8px] font-mono text-primary opacity-60 mt-1 uppercase">Origin</span>}
    </motion.div>
);

interface CriminalOriginMapProps {
    path: string[];
}

export default function CriminalOriginMap({ path }: CriminalOriginMapProps) {
    const displayPath = path.length > 0 ? path : ["Telegram Node-7", "Web Relay", "Diffusion"];

    return (
        <div className="flex-1 glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col gap-6 md:gap-10 overflow-hidden relative min-h-[350px] md:min-h-[400px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                        <MapPin size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight">Origin Map</h3>
                        <p className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase">Tracing content to source</p>
                    </div>
                </div>
                <button className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                    <Share2 size={16} className="opacity-40" />
                </button>
            </div>

            <div className="flex-1 flex md:flex-row flex-col items-center justify-center gap-4 md:gap-8 relative py-8 overflow-y-auto custom-scrollbar no-scrollbar">
                {/* Desktop Connection lines */}
                <div className="absolute inset-0 hidden md:flex items-center justify-center -z-10 px-24">
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                </div>

                {displayPath.map((node, i) => (
                    <div key={node + i} className="flex md:flex-row flex-col items-center gap-4 md:gap-8">
                        <SourceNode 
                            label={node} 
                            platform={i === 0 ? "UPLOAD POINT" : "RELAY"} 
                            isOrigin={i === 0}
                            delay={i * 0.3}
                        />
                        {i < displayPath.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0, rotate: 0 }}
                                animate={{ opacity: 0.3, rotate: 90 }}
                                whileInView={{ opacity: 0.3, rotate: 0 }}
                                className="md:rotate-0"
                            >
                                <ArrowRight className="text-primary w-4 h-4 md:w-6 md:h-6 rotate-90 md:rotate-0" />
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-auto p-4 md:p-6 rounded-xl md:rounded-2xl bg-security-red/5 border border-white/5 flex items-center gap-4">
                <div className="p-2 md:p-3 bg-security-red/20 rounded-lg text-security-red">
                    <ShieldAlert size={16} />
                </div>
                <p className="text-[9px] md:text-[11px] opacity-60 leading-tight max-w-xl">
                    SourceChain confirms coordinated injection pattern. Digital Fingerprints match known manipulation hubs.
                </p>
            </div>
        </div>
    );
}
