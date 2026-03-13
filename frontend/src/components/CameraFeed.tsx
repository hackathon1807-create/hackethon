import React, { useRef, useEffect, useState } from 'react';
import { Camera, ShieldAlert, Cpu, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraFeedProps {
    onCapture: (blob: Blob) => void;
    isAnalyzing: boolean;
    score: number;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onCapture, isAnalyzing, score }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function startCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                setError("Camera access denied. Enable permissions for live mission.");
            }
        }
        startCamera();
        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
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
        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden glass border border-white/10">
            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-6 text-center">
                    <ShieldAlert size={48} className="mb-4" />
                    <p className="font-mono text-xs uppercase tracking-widest">{error}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover grayscale brightness-75 contrast-125"
                    />

                    {/* HUD Overlays */}
                    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-primary">
                                    <Activity size={14} className="animate-pulse" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Live Mission Alpha</span>
                                </div>
                                <div className="text-[8px] font-mono opacity-40 uppercase tracking-tighter">
                                    REC // {new Date().toISOString().split('T')[1].slice(0, 8)}
                                </div>
                            </div>
                            <div className="glass px-3 py-1 rounded-lg flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-orange-500 animate-ping' : 'bg-green-500'}`}></div>
                                <span className="text-[9px] font-mono uppercase tracking-[0.2em]">{isAnalyzing ? 'Analyzing' : 'Monitoring'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4">
                            {/* Scanning Line Effect */}
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
                                <span className="text-[9px] font-mono opacity-40 uppercase">Authenticity Confidence</span>
                            </div>
                            <button
                                onClick={captureFrame}
                                disabled={isAnalyzing}
                                className="bg-primary/20 hover:bg-primary/40 p-4 rounded-2xl border border-primary/30 transition-all pointer-events-auto active:scale-95"
                            >
                                <RefreshCw size={24} className={`text-primary ${isAnalyzing ? 'animate-spin' : ''}`} />
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

export default CameraFeed;
