import React from 'react';
import { motion } from 'framer-motion';
import { Target, Search, Share2, Globe, Database, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface MissionControlProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const MissionControl = ({ activeTab, setActiveTab }: MissionControlProps) => {
    const tabs = [
        { id: 'lab', label: 'Lab', fullLabel: 'Investigation Lab', icon: Target },
        { id: 'map', label: 'Map', fullLabel: 'SourceChain Map', icon: Share2 },
        { id: 'neural', label: 'Neural', fullLabel: 'Neural Terminal', icon: Cpu },
        { id: 'vault', label: 'Vault', fullLabel: 'Evidence Vault', icon: Database },
    ];

    return (
        <div className="w-full md:flex-1 glass rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 flex flex-row md:flex-col gap-1 md:gap-2 relative overflow-hidden">
            <div className="hidden md:block px-6 py-4 border-b border-white/5 mb-2">
                <span className="text-[10px] font-mono opacity-30 uppercase tracking-[0.3em]">Operational Phase</span>
            </div>

            <div className="flex md:flex-col gap-1 md:gap-3 w-full px-1 md:px-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "group relative flex-1 md:w-full flex flex-col md:flex-row items-center gap-2 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-[2rem] transition-all duration-500",
                                isActive 
                                    ? "bg-primary text-white glow-blue shadow-lg scale-[1.02]" 
                                    : "hover:bg-white/5 text-slate-400"
                            )}
                        >
                            <Icon size={18} className={cn("transition-transform duration-500", isActive ? "scale-110" : "group-hover:scale-110")} />
                            <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-widest block md:hidden">{tab.label}</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest hidden md:block">{tab.fullLabel}</span>
                            
                            {isActive && (
                                <motion.div 
                                    layoutId="activeTabGlow"
                                    className="absolute inset-0 bg-white/20 blur-xl -z-10 rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="hidden md:flex mt-auto p-6 flex-col gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-security-green animate-pulse"></div>
                    <span className="text-[9px] font-mono opacity-40 uppercase">SatLink: STABLE</span>
                </div>
            </div>
        </div>
    );
};

export default MissionControl;
