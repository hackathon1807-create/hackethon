import React from 'react';
import { motion } from 'framer-motion';

interface AuthenticityDialProps {
    score: number; // 0 to 100
}

const AuthenticityDial: React.FC<AuthenticityDialProps> = ({ score }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score > 80) return "#00FF41"; // Verified (Green)
        if (score > 50) return "#FFD700"; // Suspicious (Gold)
        return "#FF3131"; // Deepfake (Red)
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-6 bg-black/40 rounded-3xl border border-white/5 glow-green">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-6 opacity-60">Authenticity Levels</h2>

            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background Track */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Progress Ring */}
                    <motion.circle
                        cx="96"
                        cy="96"
                        r={radius}
                        stroke={getColor()}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-5xl font-bold font-mono"
                        style={{ color: getColor() }}
                    >
                        {Math.round(score)}%
                    </motion.span>
                    <span className="text-[10px] uppercase tracking-tighter opacity-40">Legitimate</span>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                    <span className="text-[9px] uppercase opacity-40">Status</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: getColor() }}>
                        {score > 80 ? 'VERIFIED' : score > 50 ? 'SUSPICIOUS' : 'DEEPFAKE'}
                    </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase opacity-40">Audit ID</span>
                    <span className="text-[11px] font-mono">OC-1111</span>
                </div>
            </div>
        </div>
    );
};

export default AuthenticityDial;
