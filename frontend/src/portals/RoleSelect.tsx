import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Search, AlertCircle } from 'lucide-react';

interface RoleSelectProps {
    onSelect: (role: 'victim' | 'investigator') => void;
}

const RoleSelect = ({ onSelect }: RoleSelectProps) => {
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#050209] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Blood Moon Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,_rgba(180,0,30,0.15),_transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blood/60 to-transparent" />
            
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(180,0,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180,0,30,0.3) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            {/* Logo */}
            <motion.div 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 relative z-10"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-blood/20 border border-blood/40 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(180,0,30,0.6)]">
                        <div className="w-10 h-10 rounded-full bg-blood/40 border border-blood/60 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-blood shadow-[0_0_20px_rgba(180,0,30,0.8)]" />
                        </div>
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-white mb-3">
                    Meipporul <span className="text-blood">AI</span>
                </h1>
                <p className="text-[11px] md:text-xs font-mono text-slate-500 uppercase tracking-[0.5em] mb-2">
                    Team Blood Moon · Deepfake Detection
                </p>
                <div className="flex items-center justify-center gap-3 mt-4 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Fully Local — Zero Data Retention</span>
                </div>
                
                <div className="max-w-xl mx-auto border-t border-white/5 pt-6 mt-2">
                    <p className="text-sm md:text-base font-semibold text-slate-300 leading-relaxed italic">
                        "எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள்<br/>
                        மெய்ப்பொருள் காண்ப தறிவு."
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 mt-3">
                        — திருக்குறள் (௪௱௨௰௩ - 423)
                    </p>
                </div>
            </motion.div>

            {/* Role Cards */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl relative z-10"
            >
                {/* Victim Card */}
                <motion.button
                    onHoverStart={() => setHoveredRole('victim')}
                    onHoverEnd={() => setHoveredRole(null)}
                    onClick={() => onSelect('victim')}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative p-8 md:p-10 rounded-3xl border border-sky-500/20 bg-sky-950/30 backdrop-blur-sm text-left overflow-hidden transition-all duration-500 hover:border-sky-500/50 hover:bg-sky-950/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-sky-500/5 blur-2xl -translate-y-8 translate-x-8" />
                    
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_-5px_rgba(14,165,233,0.4)] transition-all">
                        <AlertCircle size={28} className="text-sky-400" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-3 text-sky-100">I'm a Victim</h2>
                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed mb-6">
                        My deepfake image or video has been created or leaked without my consent. I need to verify it, get legal evidence, and learn how to remove it.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {["Detect Real/Fake", "Legal Report", "DMCA Help"].map(tag => (
                            <span key={tag} className="text-[9px] px-3 py-1.5 rounded-full border border-sky-500/20 text-sky-400 font-mono uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Investigator Card */}
                <motion.button
                    onHoverStart={() => setHoveredRole('investigator')}
                    onHoverEnd={() => setHoveredRole(null)}
                    onClick={() => onSelect('investigator')}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative p-8 md:p-10 rounded-3xl border border-blood/20 bg-red-950/20 backdrop-blur-sm text-left overflow-hidden transition-all duration-500 hover:border-blood/50 hover:bg-red-950/40"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blood/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blood/5 blur-2xl -translate-y-8 translate-x-8" />

                    <div className="w-14 h-14 rounded-2xl bg-blood/15 border border-blood/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_-5px_rgba(180,0,30,0.5)] transition-all">
                        <ShieldAlert size={28} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-3 text-red-100">Investigator</h2>
                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed mb-6">
                        I am a cybersecurity officer or law enforcement agent. I need to trace the criminal source, gather OSINT, and generate an arrest report.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {["OSINT Trace", "Criminal Profile", "Arrest Report"].map(tag => (
                            <span key={tag} className="text-[9px] px-3 py-1.5 rounded-full border border-blood/20 text-red-400 font-mono uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blood/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 text-center relative z-10"
            >
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">
                    All analysis runs locally on your machine · No cloud upload · No tracking
                </p>
            </motion.div>
        </div>
    );
};

export default RoleSelect;
