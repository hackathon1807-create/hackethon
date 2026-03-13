import React, { useRef, useEffect, useState } from 'react';
import { Camera, ShieldAlert, Cpu, Activity, RefreshCw, Monitor, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveInterceptorProps {
    onCapture: (blob: Blob) => void;
    isAnalyzing: boolean;
    score: number;
}

const LiveInterceptor: React.FC<LiveInterceptorProps> = ({ onCapture, isAnalyzing, score }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'camera' | 'screen'>('camera');

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startCamera = async () => {
        stopStream();
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setMode('camera');
            setError(null);
        } catch (err) {
            setError("Camera access denied.");
        }
    };

    const startScreenCapture = async () => {
        stopStream();
        try {
            // @ts-ignore
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setMode('screen');
            setError(null);

            // Listener for when user stops sharing via browser UI
            mediaStream.getVideoTracks()[0].onended = () => {
                setStream(null);
            };
        } catch (err) {
            setError("Screen capture cancelled or denied.");
        }
    };

    useEffect(() => {
        startCamera();
        return () => stopStream();
    }, []);

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                canvasRef.current.toBlob((blob) => {
                    if (blob) onCapture(blob);
                }, 'image/jpeg');
            }
        }
    };

    return (
        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden glass border border-white/10 group">
            {/* Mode Selector Overlay - NOW ALWAYS VISIBLE & SEPARATE */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
                <button
                    onClick={startCamera}
                    className={`px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] border transition-all ${mode === 'camera' ? 'bg-primary border-primary text-white glow-blue' : 'bg-black/60 backdrop-blur-md border-white/10 text-white/40 hover:text-white'}`}
                >
                    <Camera size={14} /> Mission Camera
                </button>
                <button
                    onClick={startScreenCapture}
                    className={`px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] border transition-all ${mode === 'screen' ? 'bg-primary border-primary text-white glow-blue' : 'bg-black/60 backdrop-blur-md border-white/10 text-white/40 hover:text-white'}`}
                >
                    <Monitor size={14} /> Intercept Live Call
                </button>
            </div>

            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 bg-[#020617]/80 backdrop-blur-xl p-6 text-center z-20">
                    <ShieldAlert size={48} className="mb-4" />
                    <p className="font-mono text-xs uppercase tracking-widest">{error}</p>
                    <div className="mt-6 flex flex-col items-center gap-2">
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-tighter italic">SWITCH TO 'INTERCEPT LIVE CALL' IF CAMERA FAILS</p>
                    </div>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${mode === 'camera' ? 'grayscale brightness-75 contrast-125' : ''}`}
                    />

                    {/* HUD Overlays */}
                    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
                        <div className="flex justify-between items-start mt-16"> {/* Pushed down for selector */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-primary">
                                    <Activity size={14} className="animate-pulse" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">
                                        {mode === 'camera' ? 'Live Mission Alpha' : 'Neural Stream Intercept'}
                                    </span>
                                </div>
                                <div className="text-[8px] font-mono opacity-40 uppercase tracking-tighter">
                                    SOURCE // {mode.toUpperCase()} // SCAN {new Date().toISOString().split('T')[1].slice(0, 8)}
                                </div>
                            </div>
                            <div className="glass px-3 py-1 rounded-lg flex items-center gap-2 pointer-events-auto cursor-help" title="Active baseline monitoring">
                                <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-orange-500 animate-ping' : 'bg-green-500'}`}></div>
                                <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{isAnalyzing ? 'Analyzing' : 'Monitoring'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4">
                            {isAnalyzing && (
                                <motion.div
                                    initial={{ top: 0 }}
                                    animate={{ top: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="absolute left-0 right-0 h-0.5 bg-primary/40 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                                />
                            )}
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-6 h-1 rounded-full ${i < (score / 20) ? 'bg-primary shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`}></div>
                                    ))}
                                </div>
                                <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Neural Fidelity Match</span>
                            </div>
                            <button
                                onClick={captureFrame}
                                disabled={isAnalyzing}
                                className="bg-primary/20 hover:bg-primary/40 p-4 rounded-2xl border border-primary/30 transition-all pointer-events-auto active:scale-95 group/btn shadow-xl"
                                title="Run Neural Audit on current frame"
                            >
                                <RefreshCw size={24} className={`text-primary ${isAnalyzing ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Corner Decals */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-xl m-4 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-xl m-4 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-xl m-4 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-xl m-4 pointer-events-none"></div>
                </>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default LiveInterceptor;
