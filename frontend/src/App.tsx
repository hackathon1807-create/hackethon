import React from 'react';
import { Scan } from 'lucide-react';
import VictimPortal from './portals/VictimPortal';

const App = () => {
    return (
        <div className="h-screen bg-[#050209] flex flex-col overflow-hidden">
            {/* ── Unified Top Nav ─────────────────────────────────────── */}
            <header className="flex flex-wrap items-center justify-between gap-y-3 px-3 sm:px-4 md:px-8 py-3 border-b border-white/5 bg-white/[0.01] backdrop-blur-md sticky top-0 z-50 shrink-0">
                {/* Brand */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blood/20 border border-blood/40 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(160,0,20,0.6)] shrink-0">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blood" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">Meipporul <span className="text-blood">AI</span></span>
                        <p className="text-[7px] sm:text-[8px] font-mono text-slate-600 uppercase tracking-widest sm:-mt-0.5">Team Blood Moon</p>
                    </div>
                </div>

                {/* Privacy indicator */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[8px] sm:text-[9px] font-mono text-green-400 uppercase tracking-widest whitespace-nowrap">Local · Private</span>
                </div>
            </header>

            {/* ── Main Unified Dashboard ───────────────────────────────── */}
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 h-full w-full overflow-y-auto overflow-x-hidden">
                    <VictimPortal onBack={() => {}} hideHeader />
                </div>
            </div>

            {/* ── Global Slogan / Footer ───────────────────────────────── */}
            <footer className="w-full border-t border-white/5 bg-black/60 backdrop-blur-md py-3 px-4 sm:px-6 text-center shrink-0 z-50 relative">
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-300 leading-snug sm:leading-relaxed italic mb-1 sm:mb-1.5">
                    "எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள்<br className="sm:hidden" />
                    <span className="hidden sm:inline"> </span>மெய்ப்பொருள் காண்ப தறிவு."
                </p>
                <p className="text-[9px] sm:text-xs font-medium text-slate-400 leading-snug italic mb-1.5 sm:mb-2 max-w-2xl mx-auto">
                    "Whatever be the subject, whoever be the speaker, to find the truth is wisdom."
                </p>
                <p className="text-[8px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    — திருக்குறள் (௪௱௨௰௩ - Kural 423)
                </p>
            </footer>
        </div>
    );
};

export default App;
