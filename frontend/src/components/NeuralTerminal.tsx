import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface NeuralTerminalProps {
    analysis: {
        authenticity_score: number;
        manipulation_score: number;
        is_manipulated: boolean;
        frame_results: number[];
        model_architecture: string;
    } | null;
    isAnalyzing: boolean;
}

const NeuralTerminal = ({ analysis, isAnalyzing }: NeuralTerminalProps) => {
    return (
        <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col gap-6 md:gap-8 h-full relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/20 flex items-center justify-center text-primary group">
                        <Cpu size={20} className="md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-500" />
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight leading-none">Neural Terminal</h3>
                        <p className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase mt-1">
                            {analysis?.model_architecture || "AWAITING ENGINE"}
                        </p>
                    </div>
                </div>
                {analysis && (
                    <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center ${
                        analysis.is_manipulated ? 'border-security-red/40 text-security-red' : 'border-security-green/40 text-security-green'
                    }`}>
                        {analysis.is_manipulated ? 'DEEPFAKE DETECTED' : 'BIOLOGICAL CONFIRMED'}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-6 md:gap-8">
                {isAnalyzing ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-40">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-primary/20 border-t-primary"
                        />
                        <div className="text-center">
                            <span className="text-[10px] md:text-xs font-mono uppercase animate-pulse">Running Neural Scan...</span>
                        </div>
                    </div>
                ) : analysis ? (
                    <div className="flex flex-col gap-6 md:gap-10">
                        {/* Score Visualization */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                            <div className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/5 relative overflow-hidden">
                                <span className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase mb-2 md:mb-4 block">Authentic</span>
                                <div className="text-3xl md:text-5xl font-black text-security-green font-mono">{analysis.authenticity_score}%</div>
                                <div className="absolute bottom-0 left-0 h-1 bg-security-green" style={{ width: `${analysis.authenticity_score}%` }}></div>
                            </div>
                            <div className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/5 relative overflow-hidden">
                                <span className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase mb-2 md:mb-4 block">Manipulated</span>
                                <div className="text-3xl md:text-5xl font-black text-security-red font-mono">{analysis.manipulation_score}%</div>
                                <div className="absolute bottom-0 left-0 h-1 bg-security-red" style={{ width: `${analysis.manipulation_score}%` }}></div>
                            </div>
                        </div>

                        {/* Frame Logic Grid */}
                        <div className="hidden sm:block">
                            <span className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase mb-4 block flex items-center gap-2">
                                <Activity size={12} />
                                Neural Frame Entropy (Sampled)
                            </span>
                            <div className="grid grid-cols-10 gap-1 md:gap-2 h-16 md:h-20">
                                {analysis.frame_results.map((score, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`rounded-sm md:rounded-md origin-bottom ${
                                            score > 0.6 ? 'bg-security-red' : 'bg-primary/40'
                                        }`}
                                        style={{ height: `${score * 100}%` }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-4">
                            <Zap size={18} className="text-primary shrink-0" />
                            <p className="text-[9px] md:text-[11px] opacity-70 leading-relaxed font-medium">
                                Neural signatures confirm pattern consistency with synthetic generation models. Forensic high-confidence.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-5">
                        <ShieldAlert size={48} className="md:w-16 md:h-16" />
                        <span className="text-[8px] md:text-xs font-mono uppercase tracking-[0.5em]">Neural Standby</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NeuralTerminal;
