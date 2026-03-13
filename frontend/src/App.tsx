import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ShieldAlert, Lock } from 'lucide-react';
import VictimPortal from './portals/VictimPortal';
import InvestigatorPortal from './portals/InvestigatorPortal';
import { cn } from './lib/utils';

type Mode = 'victim' | 'investigator';

const App = () => {
    const [mode, setMode] = useState<Mode>('victim');

    return (
        <div className="min-h-screen bg-[#050209] flex flex-col">
            {/* ── Unified Top Nav ─────────────────────────────────────── */}
            <header className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/5 bg-white/[0.01] backdrop-blur-md sticky top-0 z-50">
                {/* Brand */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blood/20 border border-blood/40 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(160,0,20,0.6)]">
                        <div className="w-3 h-3 rounded-full bg-blood" />
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-sm font-black uppercase tracking-wider text-white">Blood <span className="text-blood">Moon</span></span>
                        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest -mt-0.5">Deepfake Forensics</p>
                    </div>
                </div>

                {/* Mode Toggle Pill */}
                <div className="flex bg-white/5 border border-white/5 rounded-2xl p-1 gap-1">
                    <button
                        onClick={() => setMode('victim')}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
                            mode === 'victim'
                                ? 'bg-sky-600 text-white shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)]'
                                : 'text-slate-400 hover:text-slate-200'
                        )}>
                        <Scan size={13} />
                        <span className="hidden sm:block">Deepfake Detection</span>
                        <span className="sm:hidden">Detection</span>
                    </button>
                    <button
                        onClick={() => setMode('investigator')}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
                            mode === 'investigator'
                                ? 'bg-blood text-white shadow-[0_0_20px_-5px_rgba(160,0,20,0.5)]'
                                : 'text-slate-400 hover:text-slate-200'
                        )}>
                        <ShieldAlert size={13} />
                        <span className="hidden sm:block">Investigator</span>
                        <span className="sm:hidden">Investigate</span>
                    </button>
                </div>

                {/* Privacy indicator */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="hidden md:block text-[9px] font-mono text-green-400 uppercase tracking-widest">Local · Private</span>
                    <Lock size={12} className="text-green-400 md:hidden" />
                </div>
            </header>

            {/* ── Portal Content ───────────────────────────────────────── */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {mode === 'victim' ? (
                        <motion.div
                            key="victim"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            className="h-full"
                        >
                            <VictimPortal onBack={() => {}} hideHeader />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="investigator"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.25 }}
                            className="h-full"
                        >
                            <InvestigatorPortal onBack={() => {}} hideHeader />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default App;
