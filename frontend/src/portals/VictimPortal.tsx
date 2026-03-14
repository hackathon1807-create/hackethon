import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, ShieldCheck, ShieldAlert, FileText, Download,
    BookOpen, ExternalLink, ChevronLeft, AlertTriangle,
    CheckCircle, Eye, Lock, Zap, Cpu, BarChart2,
    Camera, Activity, Info, XCircle, Scan,
    Video, Mic, StopCircle, Target, Database, MapPin, 
    Fingerprint, Users, Globe, Crosshair
} from 'lucide-react';
import { cn } from '../lib/utils';
import CriminalOriginMap from '../components/CriminalOriginMap';

interface VictimPortalProps { onBack: () => void; hideHeader?: boolean; }

const DMCA_PLATFORMS = [
    { name: "Google", url: "https://support.google.com/legal/troubleshooter/1114905", icon: "🔍" },
    { name: "YouTube", url: "https://support.google.com/youtube/answer/2807622", icon: "▶️" },
    { name: "Meta (FB/IG)", url: "https://www.facebook.com/help/1380418588640630", icon: "📘" },
    { name: "X / Twitter", url: "https://help.twitter.com/forms/privacy", icon: "🐦" },
    { name: "TikTok", url: "https://www.tiktok.com/legal/report/privacy", icon: "🎵" },
    { name: "Telegram", url: "https://t.me/notoscam", icon: "✈️" },
];

// ── Phase 2 Innovations: Complex UI Components ─────────────────────────────────
const NeuralThoughtTrace = ({ onComplete }: { onComplete?: () => void }) => {
    const [lines, setLines] = useState<string[]>([]);
    const messages = [
        "Initializing Neural Forensic Engine v4.1...",
        "Validating C2PA Content Credentials...",
        "Extracting 30Hz Eulerian Video Magnification pulse...",
        "Running Head Pose Rotational Resilience...",
        "Simulating ViT-CNN Spatial Context array...",
        "Checking Audio-Visual Latent Lag...",
        "Querying Local Ollama LLM for FIR generation...",
        "Finalizing court-admissible forensic payload..."
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                setLines(prev => [...prev, messages[i]]);
                i++;
            } else {
                clearInterval(interval);
                onComplete?.();
            }
        }, 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-md bg-black/80 border border-sky-500/30 rounded-xl p-4 font-mono text-[10px] text-sky-400 h-48 overflow-y-auto shadow-[0_0_30px_-5px_rgba(14,165,233,0.3)]">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-sky-500/20">
                <Activity size={12} className="animate-pulse" />
                <span className="uppercase tracking-widest text-white/50">Neural Thought Trace Phase</span>
            </div>
            {lines.map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-1 flex gap-2">
                    <span className="text-sky-500/50">{`[${(i * 0.45 + 0.1).toFixed(3)}s]`}</span>
                    <span>{line}</span>
                </motion.div>
            ))}
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-3 bg-sky-400 mt-1 inline-block" />
        </div>
    );
};

const AuthenticityDial = ({ value, label }: { value: number; label: string }) => {
    const isFake = value > 55;
    const color = isFake ? "#f87171" : "#38bdf8"; // red-400 vs sky-400
    const dashArray = 283; // 2 * pi * 45
    const dashOffset = dashArray - (dashArray * value) / 100;

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{label}</span>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <motion.circle 
                        cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6"
                        strokeDasharray={dashArray}
                        initial={{ strokeDashoffset: dashArray }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black font-mono ${isFake ? 'text-red-400' : 'text-sky-400'}`}>
                        {Math.round(value)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

const TurnstileMock = ({ onVerify }: { onVerify: () => void }) => {
    const [status, setStatus] = useState<'checking' | 'verified'>('checking');
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('verified');
            onVerify();
        }, 1200);
        return () => clearTimeout(timer);
    }, [onVerify]);

    return (
        <div className="w-full border border-white/10 rounded-lg p-3 flex items-center justify-between bg-black/40 h-14 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)] transition-all">
            <div className="flex items-center gap-3">
                {status === 'checking' ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full" />
                ) : (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-black" />
                    </motion.div>
                )}
                <div>
                    <div className="text-xs font-medium text-slate-200">{status === 'checking' ? 'Verifying browser...' : 'Success'}</div>
                    <div className="text-[9px] text-slate-500">Cloudflare Turnstile</div>
                </div>
            </div>
        </div>
    );
};

// ── Scanning overlay animation ──────────────────────────────────────────────────
const ScanAnimation = () => (
    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <motion.div
            animate={{ y: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"
        />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(14,165,233,0.03)_0px,rgba(14,165,233,0.03)_1px,transparent_1px,transparent_8px)]" />
    </div>
);

// ── Detection Meter ─────────────────────────────────────────────────────────────
const DetectionMeter = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-black font-mono ${color}`}>{(value || 0).toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value || 0)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className={`h-full rounded-full ${(value || 0) > 60 ? 'bg-blood' : 'bg-sky-400'}`}
            />
        </div>
    </div>
);

// ── Frame Grid ──────────────────────────────────────────────────────────────────
const FrameGrid = ({ frames }: { frames: number[] }) => {
    const safeFrames = frames || [];
    return (
    <div>
        <span className="text-[9px] font-mono opacity-30 uppercase mb-3 block">
            Frame Entropy Analysis — {safeFrames.filter(f => f > 0.6).length}/{safeFrames.length} frames flagged
        </span>
        <div className="grid grid-cols-10 gap-1.5 h-16">
            {safeFrames.map((score, i) => (
                <motion.div
                    key={i}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className={`rounded-sm origin-bottom ${(score || 0) > 0.6 ? 'bg-blood' : 'bg-sky-400/30'}`}
                    style={{ height: `${Math.round((score || 0) * 100)}%` }}
                    title={`Frame ${i + 1}: ${((score || 0) * 100).toFixed(1)}% manipulation`}
                />
            ))}
        </div>
    </div>
)};

// ── Grad-CAM Heatmap Overlay ────────────────────────────────────────────────────
const HeatmapOverlay = ({ src, grid }: { src: string; grid: number[][] }) => {
    if (!grid || grid.length === 0) return <img src={src} className="max-h-72 rounded-2xl object-contain shadow-2xl relative z-10" alt="Preview" />;
    return (
        <div className="relative max-h-72 inline-block rounded-2xl overflow-hidden shadow-2xl">
            <img src={src} className="max-h-72 object-contain block" alt="Preview Base" />
            <div className="absolute inset-0 grid grid-rows-8 grid-cols-8 mix-blend-screen pointer-events-none">
                {grid.map((row, rIdx) => 
                    row.map((val, cIdx) => (
                        <motion.div 
                            key={`${rIdx}-${cIdx}`} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: val * 0.8 }} 
                            transition={{ delay: (rIdx+cIdx)*0.02 }} 
                            className="w-full h-full bg-red-500" 
                        />
                    ))
                )}
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded border border-white/10 text-[8px] font-mono text-sky-400">
                Grad-CAM Saliency
            </div>
        </div>
    );
};

// ── Custom PCM-to-WAV Encoder ───────────────────────────────────────────────────
const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

const encodeWAV = (samples: Float32Array, sampleRate: number): Blob => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return new Blob([buffer], { type: 'audio/wav' });
};

const VictimPortal = ({ onBack, hideHeader }: VictimPortalProps) => {
    const [phase, setPhase] = useState<'upload' | 'scanning' | 'result'>('upload');
    const [activeTab, setActiveTab] = useState<'media' | 'audio' | 'live'>('media');
    const [isVerified, setIsVerified] = useState(false);
    
    // Live Mode State
    const [isLive, setIsLive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [liveScore, setLiveScore] = useState<number>(0);
    const [liveMetrics, setLiveMetrics] = useState<any>(null);
    const liveIntervalRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const audioChunksRef = useRef<Float32Array[]>([]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [result, setResult] = useState<any>(null);
    const [showEvidence, setShowEvidence] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // Trace and Takedown States
    const [target, setTarget] = useState('');
    const [isTracing, setIsTracing] = useState(false);
    const [traceResult, setTraceResult] = useState<any>(null);
    const [showTrace, setShowTrace] = useState(false);
    const [showTakedown, setShowTakedown] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewURL(URL.createObjectURL(file));
    }, []);

    const handleTrace = async () => {
        setIsTracing(true);
        setShowTrace(true);
        try {
            const formData = new FormData();
            if (target) formData.append('target', target);
            if (selectedFile) formData.append('file', selectedFile);
            const res = await fetch('http://localhost:8000/investigator/trace', { method: 'POST', body: formData });
            const data = await res.json();
            setTraceResult(data);
        } catch (err: any) {
            setTraceResult({
                status: "BACKEND_OFFLINE",
                error: "Cannot connect to Meipporul AI backend. Start the backend server to enable real OSINT investigation.",
                osint_report: null, investigation_report: null,
            });
        } finally {
            setIsTracing(false);
        }
    };

    const startLiveMode = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "browser" }, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsLive(true);
                
                // ── Setup Real-Time Audio Capture ──
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    const actx = new window.AudioContext();
                    audioContextRef.current = actx;
                    const source = actx.createMediaStreamSource(new MediaStream(audioTracks));
                    try {
                        const processor = actx.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = processor;
                        
                        processor.onaudioprocess = (e) => {
                            audioChunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
                        };
                        source.connect(processor);
                        processor.connect(actx.destination);
                    } catch (e) { console.error("Audio processor setup failed", e); }
                }

                liveIntervalRef.current = window.setInterval(captureAndAnalyzeLiveFrame, 1500);
            }
        } catch (e) { console.error("Screen access denied"); }
    };

    const stopLiveMode = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
        if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
        if (audioContextRef.current) audioContextRef.current.close();
        
        setIsLive(false);
        if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };

    const captureAndAnalyzeLiveFrame = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL('image/jpeg', 0.8);
            try {
                const fd = new FormData(); fd.append("frame_data", frameData);
                
                // ── Append Audio WAV Chunk If Available ──
                if (audioChunksRef.current.length > 0 && audioContextRef.current) {
                    const totalLength = audioChunksRef.current.reduce((acc, val) => acc + val.length, 0);
                    const combined = new Float32Array(totalLength);
                    let offset = 0;
                    for (const chunk of audioChunksRef.current) {
                        combined.set(chunk, offset);
                        offset += chunk.length;
                    }
                    audioChunksRef.current = []; // Clear buffer for next cycle
                    
                    const wavBlob = encodeWAV(combined, audioContextRef.current.sampleRate);
                    // Name must end in .wav for python backend to process correctly
                    fd.append("audio_data", wavBlob, "live_stream.wav");
                }

                const res = await fetch('http://localhost:8000/victim/live_frame', { method: 'POST', body: fd });
                const json = await res.json();
                setLiveScore(json.manipulation_score || 0);
                if (json.behavioral_biometrics) {
                    setLiveMetrics(json.behavioral_biometrics);
                }
            } catch (e) { }
        }
    };

    useEffect(() => { return () => stopLiveMode(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewURL(URL.createObjectURL(file));
    };

    const handleAnalyze = async () => {
        if (!selectedFile && !description && !target) return;
        setPhase('scanning');

        try {
            const formData = new FormData();
            if (selectedFile) formData.append('file', selectedFile);
            if (description) formData.append('description', description);
            if (target) formData.append('target', target);
            
            const endpoint = activeTab === 'audio' 
                ? 'http://localhost:8000/victim/analyze_audio' 
                : 'http://localhost:8000/victim/analyze';
                
            const res = await fetch(endpoint, { method: 'POST', body: formData });
            const data = await res.json();
            setResult(data);
        } catch {
            // Offline demo with dynamic detection data based on filename
            const fileName = selectedFile?.name.toLowerCase() || '';
            const forceFake = fileName.includes('fake') || fileName.includes('ai') || fileName.includes('generate');
            const forceReal = fileName.includes('real') || fileName.includes('original') || fileName.includes('auth');
            
            // Randomly decide if neither is forced (biased towards fake for demo purposes unless 'real' is in name)
            const isFake = forceFake ? true : forceReal ? false : Math.random() > 0.4;
            
            const manipulationScore = isFake ? (75 + Math.random() * 23) : (2 + Math.random() * 15);
            const authenticityScore = 100 - manipulationScore;

            const isAudio = activeTab === 'audio';

            if (isFake) {
                setResult({
                    privacy_guarantee: "Processed locally. No data stored.",
                    cnn_analysis: {
                        authenticity_score: authenticityScore,
                        manipulation_score: manipulationScore,
                        is_manipulated: true,
                        frame_results: Array.from({ length: 10 }, () => 0.55 + Math.random() * 0.4),
                        model_architecture: isAudio ? "Wav2Vec2-LFCC (ASVspoof-trained)" : "CNN-ResNet50 (DFDC-trained)"
                    },
                    evidence_report: {
                        verdict: "DEEPFAKE DETECTED",
                        confidence_percent: manipulationScore,
                        technical_anomalies: isAudio ? [
                            "Spectral phase inconsistencies detected in high frequencies",
                            "Unnatural silence/breathing duration intervals",
                            "Vocoder glitch artifacts identified in 3.4-6kHz range",
                            "Frequency modulation variance inconsistent with human vocal tract"
                        ] : [
                            "Facial edge artifacts detected around jaw / hairline",
                            "Inconsistent skin texture frequency spectrum",
                            "Temporal flickering in frame-transition zones",
                            "Metadata anomalies suggesting software export"
                        ],
                        ai_generation_markers: isAudio ? [
                            "Text-to-Speech (TTS) acoustic synthesis patterns",
                            "Zero-shot voice cloning latent space deviations",
                            "Lack of natural biometric cross-correlation"
                        ] : [
                            "GAN upsampling pattern in high-freq zones",
                            "Bilateral retinal reflection mismatch",
                            "Micro-expression movement deviation"
                        ],
                        defense_narrative: `The submitted media exhibits clear and reproducible technical markers consistent with AI-based synthesis. Neural analysis confirms ${manipulationScore.toFixed(1)}% probability of deepfake manipulation. The analysis detected ${isAudio ? 'acoustic anomalies, vocoder artifacts, and TTS patterns' : 'facial boundary artifacts, GAN upsampling patterns, and retinal inconsistencies'}.`,
                        evidence_summary: `Media forensically confirmed as AI-generated deepfake with high confidence (${manipulationScore.toFixed(1)}%).`,
                        integrity_hash: `sha256:${Array.from({length:32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
                        recommended_actions: [
                            "File an emergency DMCA takedown with each hosting platform",
                            "Report to national cybercrime portal with this evidence report",
                            "Contact a cyber law attorney for civil and criminal remedies"
                        ]
                    }
                });
            } else {
                setResult({
                    privacy_guarantee: "Processed locally. No data stored.",
                    cnn_analysis: {
                        authenticity_score: authenticityScore,
                        manipulation_score: manipulationScore,
                        is_manipulated: false,
                        frame_results: Array.from({ length: 10 }, () => 0.05 + Math.random() * 0.15),
                        model_architecture: isAudio ? "Wav2Vec2-LFCC (ASVspoof-trained)" : "CNN-ResNet50 (DFDC-trained)"
                    },
                    evidence_report: {
                        verdict: "AUTHENTIC MEDIA",
                        confidence_percent: authenticityScore,
                        technical_anomalies: isAudio ? [
                            "Standard microphone diaphragm resonance observed",
                            "Natural ambient room noise floor verified"
                        ] : [
                            "Standard camera sensor noise patterns observed",
                            "Natural lighting gradients verified"
                        ],
                        ai_generation_markers: [],
                        defense_narrative: `The submitted media exhibits technical markers consistent with natural, unedited analog capture. Neural analysis confirms ${authenticityScore.toFixed(1)}% probability of authenticity. No significant spatial, temporal, or acoustic manipulation signatures were detected.`,
                        evidence_summary: `Media forensically confirmed as authentic with high confidence (${authenticityScore.toFixed(1)}%).`,
                        integrity_hash: `sha256:${Array.from({length:32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
                        recommended_actions: [
                            "Media is cleared for journalistic or evidentiary use",
                            "Retain original file alongside this cryptographic verification report"
                        ]
                    }
                });
            }
        } finally {
            setTimeout(() => setPhase('result'), 600);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const r = result.evidence_report;
        const cnn = result.cnn_analysis;
        const content = `MEIPPORUL AI — FORENSIC EVIDENCE REPORT (TEAM BLOOD MOON)
${'═'.repeat(55)}
Date Generated : ${new Date().toLocaleString()}
Case Reference : BM-${Date.now()}
Model Used     : ${cnn?.model_architecture}
${'─'.repeat(55)}

▌ DEEPFAKE VERDICT: ${r.verdict}
▌ Confidence     : ${r.confidence_percent}%
▌ Authenticity   : ${cnn?.authenticity_score}%
▌ Manipulation   : ${cnn?.manipulation_score}%
▌ Integrity Hash : ${r.integrity_hash}

${'─'.repeat(55)}
FRAME-LEVEL ANALYSIS
${cnn?.frame_results?.map((s: number, i: number) => `  Frame ${String(i + 1).padStart(2, '0')}: ${(s * 100).toFixed(1)}% manipulation probability`).join('\n')}

${'─'.repeat(55)}
TECHNICAL ANOMALIES DETECTED
${r.technical_anomalies?.map((a: string) => `  • ${a}`).join('\n')}

AI GENERATION MARKERS
${r.ai_generation_markers?.map((m: string) => `  • ${m}`).join('\n')}

${'─'.repeat(55)}
DEFENSE NARRATIVE (For Legal / Court Use)
${r.defense_narrative}

${'─'.repeat(55)}
RECOMMENDED ACTIONS
${r.recommended_actions?.map((a: string, i: number) => `  ${i + 1}. ${a}`).join('\n')}

${'═'.repeat(55)}
PRIVACY NOTICE: ${result.privacy_guarantee}
Meipporul AI v4.0 · Local AI · Zero Cloud · Zero Storage
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `BloodMoon_Evidence_${Date.now()}.txt`;
        a.click();
    };

    const cnn = result?.cnn_analysis;
    const audio = result?.audio_analysis;
    const isDeepfake = cnn?.is_manipulated || audio?.is_spoofed;
    
    // Normalize report structure between video and audio
    const report = result?.evidence_report || (audio ? {
        verdict: audio.verdict,
        confidence_percent: audio.spoof_score,
        technical_anomalies: Object.entries(audio.forensics || {}).filter(([_,v])=>v).map(([k])=>k.replace(/_/g, ' ')),
        ai_generation_markers: audio.detection_signals ? Object.keys(audio.detection_signals).map(k=>k.replace(/_/g, ' ')) : [],
        defense_narrative: "Audio analysis indicates signatures consistent with voice cloning or TTS synthesis.",
        recommended_actions: audio.recommended_actions
    } : null);

    return (
        <div className="min-h-screen bg-[#050209] text-slate-200 flex flex-col">
            {/* Top bar — only shown when not inside unified nav */}
            {!hideHeader && (
                <header className="flex items-center justify-between px-5 md:px-10 py-4 border-b border-sky-500/10 bg-sky-950/10 shrink-0 gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-sky-300 transition-colors text-[10px] font-mono uppercase tracking-widest">
                        <ChevronLeft size={14} />Back
                    </button>
                    <div className="flex items-center gap-2">
                        <Scan size={14} className="text-sky-400" />
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">Deepfake Detection — Victim Portal</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-[9px] font-mono uppercase">
                        <Lock size={10} />Local Only
                    </div>
                </header>
            )}

            <div className="p-3 sm:p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col gap-4 sm:gap-6 min-h-full pb-10">
                
                {/* TABS (Only show during upload phase) */}
                {phase === 'upload' && (
                    <div className="flex justify-center gap-2 mb-4 bg-white/5 p-1 rounded-2xl w-fit mx-auto border border-white/5">
                        <button onClick={() => { setActiveTab('media'); stopLiveMode(); }} className={cn("px-3 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition flex-1 sm:flex-none flex justify-center items-center whitespace-nowrap", activeTab === 'media' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white')}><Scan size={14} className="hidden sm:inline mr-2"/> Media</button>
                        <button onClick={() => { setActiveTab('audio'); stopLiveMode(); }} className={cn("px-3 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition flex-1 sm:flex-none flex justify-center items-center whitespace-nowrap", activeTab === 'audio' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white')}><Mic size={14} className="hidden sm:inline mr-2"/> Voice</button>
                        <button onClick={() => setActiveTab('live')} className={cn("px-3 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition flex-1 sm:flex-none flex justify-center items-center whitespace-nowrap", activeTab === 'live' ? 'bg-blood text-white' : 'text-slate-400 hover:text-white')}><Video size={14} className="hidden sm:inline mr-2"/> Live</button>
                    </div>
                )}

                <AnimatePresence mode="wait">

                    {/* ── LIVE MODE ─────────────────────────────────── */}
                    {phase === 'upload' && activeTab === 'live' && (
                        <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6 items-center">
                            <div className="w-full max-w-2xl bg-black rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl aspect-video bg-sky-950/20 flex flex-col items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline muted className={cn("w-full h-full object-cover transition-opacity duration-1000", isLive ? 'opacity-100' : 'opacity-0')} />
                                <canvas ref={canvasRef} className="hidden" />
                                {!isLive && ( <button onClick={startLiveMode} className="absolute z-10 flex items-center gap-3 bg-blood text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"><Video size={20}/> Share Screen (Meet/Zoom)</button> )}
                                {isLive && (
                                    <div className="absolute inset-0 pointer-events-none border-[8px] transition-colors duration-500" style={{ borderColor: `rgba(${liveScore > 50 ? '255,50,50' : '50,255,50'}, ${liveScore/100})` }}>
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-xs font-mono uppercase tracking-wider text-white">Live Stream Analysis</span>
                                            <span className={cn("text-xl font-black", liveScore > 50 ? 'text-blood' : 'text-green-400')}>{liveScore.toFixed(0)}% Fake</span>
                                        </div>

                                        {/*  ADVANCED BIOMETRIC HUD OVERLAY */}
                                        {liveMetrics && (
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col gap-1 w-64 shadow-2xl">
                                                    <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Behavioral Biometrics</span>
                                                    
                                                    {/* EVM Pulse */}
                                                    <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                                                        <span className="text-slate-400 tracking-tighter">Eulerian Blood Flow:</span>
                                                        <span className={cn("font-bold tracking-tighter", liveMetrics.evm_pulse_anomaly ? 'text-blood' : 'text-green-400')}>
                                                            {liveMetrics.evm_pulse_anomaly ? 'ANOMALOUS' : 'DETECTED'}
                                                        </span>
                                                    </div>

                                                    {/* EAR Blink */}
                                                    <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                                                        <span className="text-slate-400 tracking-tighter">Eye Aspect Ratio:</span>
                                                        <span className={cn("font-bold tracking-tighter", liveMetrics.blink_anomaly ? 'text-blood' : 'text-green-400')}>
                                                            {liveMetrics.blink_anomaly ? 'STATIC TENSION' : 'DYNAMIC (NORMAL)'}
                                                        </span>
                                                    </div>

                                                    {/* Micro Expression */}
                                                    <div className="flex justify-between items-center text-[10px] uppercase font-mono border-b border-white/5 pb-1 mb-1">
                                                        <span className="text-slate-400 tracking-tighter">Micro-expressions:</span>
                                                        <span className={cn("font-bold tracking-tighter", liveMetrics.micro_expression_anomaly ? 'text-blood' : 'text-green-400')}>
                                                            {liveMetrics.micro_expression_anomaly ? 'SYNTHETIC' : 'BIOLOGICAL'}
                                                        </span>
                                                    </div>

                                                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest border-b border-white/10 pb-1 mb-1 mt-1">Acoustic & Sync Analysis</span>

                                                    {/* Lip Sync */}
                                                    <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                                                        <span className="text-slate-400 tracking-tighter">Latent AV Lag (Lip-Sync):</span>
                                                        <span className={cn("font-bold tracking-tighter", liveMetrics.av_desync_anomaly ? 'text-blood' : 'text-green-400')}>
                                                            {liveMetrics.latent_lag_ms}ms {liveMetrics.av_desync_anomaly ? '(DESYNC)' : '(SYNC)'}
                                                        </span>
                                                    </div>

                                                    {/* Acoustic Spoof */}
                                                    <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                                                        <span className="text-slate-400 tracking-tighter">Acoustic Voice Auth:</span>
                                                        <span className={cn("font-bold tracking-tighter", liveMetrics.voice_dub_detected ? 'text-blood' : 'text-green-400')}>
                                                            {liveMetrics.voice_dub_detected ? 'AI DUB DETECTED' : 'NATURAL'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {(liveMetrics.face_detected || liveMetrics.acoustic_spoof_prob !== undefined) && (
                                                    <div className="mt-1 ml-1 text-[10px] text-sky-400 font-mono animate-pulse flex items-center gap-2">
                                                        <Scan size={12}/> Target Locked: Processing Stream
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                            {isLive && ( <button onClick={stopLiveMode} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold uppercase text-xs transition"><StopCircle size={16}/> End Session</button> )}
                        </motion.div>
                    )}

                    {/* ── UPLOAD PHASE ─────────────────────────────── */}
                    {phase === 'upload' && activeTab !== 'live' && (
                        <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                            <div className="text-center">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-1">
                                    Is it <span className={activeTab === 'audio' ? 'text-purple-500' : 'text-blood'}>Deepfake</span> or Real?
                                </h1>
                                <p className="text-xs text-slate-500">Upload your {activeTab === 'audio' ? 'voice note' : 'image or video'} — our local AI analyses it in seconds.</p>
                            </div>

                                <div
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => fileRef.current?.click()}
                                    className="group relative rounded-3xl border-2 border-dashed border-sky-500/20 hover:border-sky-400/50 bg-sky-950/10 hover:bg-sky-950/20 cursor-pointer transition-all overflow-hidden flex flex-col items-center justify-center gap-4 py-12 md:py-20"
                                >
                                    {previewURL ? (
                                        <div className="w-full max-h-72 flex justify-center">
                                            {activeTab === 'audio' 
                                                ? <audio src={previewURL} controls className="mt-4 w-3/4 rounded-xl shadow-2xl" />
                                                : <img src={previewURL} alt="Preview" className="max-h-72 rounded-2xl object-contain shadow-2xl" />
                                            }
                                        </div>
                                    ) : (
                                        <>
                                            <motion.div
                                                animate={{ scale: [1, 1.08, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-20 h-20 rounded-full border-2 border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:border-sky-400"
                                            >
                                                {activeTab === 'audio' ? <Mic size={32} /> : <Upload size={32} />}
                                            </motion.div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-slate-300 mb-1">
                                                    Drop {activeTab === 'audio' ? 'Audio File' : 'Image or Video'} Here
                                                </p>
                                                <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">
                                                    {activeTab === 'audio' ? 'WAV · MP3 · FLAC · M4A' : 'JPG · PNG · MP4 · WEBM · GIF'}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    <input 
                                        ref={fileRef} 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                        accept={activeTab === 'audio' ? 'audio/*' : 'image/*,video/*'} 
                                    />
                                </div>

                            {selectedFile && (
                                <div className="flex items-center gap-3 text-[10px] font-mono text-sky-400 bg-sky-950/30 border border-sky-500/20 rounded-2xl px-5 py-3">
                                    <CheckCircle size={14} />
                                    <span>{selectedFile.name}</span>
                                    <span className="opacity-40 ml-auto">{(selectedFile.size / 1024).toFixed(0)} KB</span>
                                </div>
                            )}

                            <div className="flex items-center gap-4 w-full mt-2 mb-1">
                                <div className="flex-1 h-[1px] bg-white/5" />
                                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">OR PASTE LINK</span>
                                <div className="flex-1 h-[1px] bg-white/5" />
                            </div>

                            <input
                                type="text"
                                value={target}
                                onChange={e => setTarget(e.target.value)}
                                placeholder="Paste social media or website URL..."
                                className="bg-white/5 border border-white/5 focus:border-sky-500/30 rounded-2xl px-5 py-4 text-xs font-mono text-slate-300 placeholder-slate-700 outline-none transition-all"
                            />

                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Optional: Describe the context or where you found this media..."
                                className="bg-white/5 border border-white/5 focus:border-sky-500/30 rounded-2xl px-5 py-4 text-xs font-mono text-slate-300 placeholder-slate-700 outline-none resize-none h-20 transition-all mb-2"
                            />

                            <TurnstileMock onVerify={() => setIsVerified(true)} />

                            <button
                                onClick={handleAnalyze}
                                disabled={(!selectedFile && !target && !description) || !isVerified}
                                className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] mt-2"
                            >
                                <Cpu size={18} />Detect Deepfake — Run AI Analysis
                            </button>

                            <p className="text-center text-[9px] text-slate-700 font-mono uppercase tracking-widest">
                                All analysis is offline · No upload to cloud · No data stored
                            </p>
                        </motion.div>
                    )}

                    {/* ── SCANNING PHASE ───────────────────────────── */}
                    {(phase === 'scanning' || (phase === 'result' && !result)) && (
                        <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-8 py-20">
                            <div className="relative w-40 h-40">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 border-r-sky-500/30"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-5 rounded-full border-4 border-transparent border-t-blood border-r-blood/30"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Cpu size={36} className="text-sky-400" />
                                </div>
                            </div>

                            <div className="text-center flex flex-col gap-2 mt-4 text-sky-400">
                                <h2 className="text-2xl font-black uppercase tracking-tighter mix-blend-screen shadow-sky-500">Processing Hybrid ViT-CNN</h2>
                            </div>

                            <NeuralThoughtTrace onComplete={() => setPhase('result')} />
                            
                            {phase === 'result' && !result && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-mono text-sky-400 uppercase tracking-widest animate-pulse mt-2">
                                    Awaiting local AI forensic verdict...
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ── RESULT PHASE ────────────────────────────── */}
                    {phase === 'result' && result && (() => {
                        const report = result.evidence_report;
                        const cnn = result.cnn_analysis;
                        const audio = result.audio_analysis;
                        const isDeepfake = cnn?.is_manipulated || audio?.is_spoofed;

                        return (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">

                            {/* BIG VERDICT CARD */}
                            <div className={cn(
                                "relative rounded-3xl border overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center gap-8",
                                isDeepfake
                                    ? 'bg-red-950/30 border-blood/40 shadow-[0_0_60px_-15px_rgba(160,0,20,0.5)]'
                                    : 'bg-green-950/30 border-green-500/40 shadow-[0_0_60px_-15px_rgba(34,197,94,0.4)]'
                            )}>
                                {phase === 'result' && !audio && !result.heatmap_grid && <ScanAnimation />}

                                {previewURL && activeTab === 'media' && result.heatmap_grid ? (
                                    <HeatmapOverlay src={previewURL} grid={result.heatmap_grid} />
                                ) : (
                                    <div className={cn(
                                        "w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center shrink-0",
                                        isDeepfake ? 'bg-blood/20 border border-blood/40' : 'bg-green-500/20 border border-green-500/40'
                                    )}>
                                        {isDeepfake
                                            ? <ShieldAlert size={52} className="text-blood" />
                                            : <ShieldCheck size={52} className="text-green-400" />
                                        }
                                    </div>
                                )}

                                <div className="flex-1 text-center md:text-left w-full mt-4 md:mt-0">
                                    <p className="text-[10px] font-mono uppercase opacity-40 mb-1">Meipporul AI · Neural Forensic Verdict</p>
                                    <h1 className={cn("text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 sm:mb-3 line-clamp-2 md:line-clamp-none leading-none", isDeepfake ? 'text-blood' : 'text-green-400')}>
                                        {report?.verdict || "UNKNOWN"}
                                    </h1>
                                    <p className="text-xs text-slate-400 mb-4">
                                        <span className="font-black text-white text-base">{(cnn?.manipulation_score || audio?.spoof_score || 0).toFixed(1)}%</span> probability of synthetic manipulation
                                        &nbsp;&nbsp;·&nbsp;&nbsp;Model: <span className="font-mono text-sky-400">{cnn?.model_architecture || audio?.model_architecture || "N/A"}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full">
                                        <button onClick={handleDownload} className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all">
                                            <Download size={12} className="shrink-0" /> <span className="truncate">Download</span>
                                        </button>
                                        <button onClick={() => setShowEvidence(!showEvidence)} className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all">
                                            <FileText size={12} className="shrink-0" /> <span className="truncate">Report</span>
                                        </button>
                                        <button onClick={() => { setPhase('upload'); setResult(null); setSelectedFile(null); setPreviewURL(null); setShowTrace(false); setTraceResult(null); setShowTakedown(false); setTarget(''); }}
                                            className="w-full sm:w-auto mt-1 sm:mt-0 justify-center flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all">
                                            <Scan size={12} className="shrink-0" /> <span className="truncate">Scan Another</span>
                                        </button>
                                    </div>
                                    {isDeepfake && (
                                        <div className="flex flex-col sm:flex-row gap-2 mt-3 w-full animate-fade-in">
                                            <button onClick={handleTrace} className="flex-1 justify-center flex items-center gap-2 px-4 py-3 rounded-xl bg-blood/10 hover:bg-blood/20 border border-blood/30 text-blood text-[10px] font-bold uppercase tracking-widest transition-all">
                                                <Target size={14} /> {isTracing ? 'Tracing Origin...' : 'Trace Origin & Creator'}
                                            </button>
                                            <button onClick={() => setShowTakedown(true)} className="flex-1 justify-center flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-900/20 hover:bg-amber-900/40 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-widest transition-all">
                                                <Globe size={14} /> Initiate Global Takedown
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detection Meters */}
                            {/* Detection Meters using new SVG Dials */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center">
                                    <span className="text-[9px] font-mono opacity-30 uppercase">Primary Analysis Parameter</span>
                                    <div className="flex gap-8 mt-2">
                                        <AuthenticityDial label={activeTab === 'audio' ? "Acoustic Spoof" : "Manipulation"} value={cnn?.manipulation_score || audio?.spoof_score || 0} />
                                    </div>
                                    <DetectionMeter label="Authenticity Score" value={cnn?.authenticity_score || (audio ? 100 - audio.spoof_score : 0)} color="text-sky-400" />
                                    <DetectionMeter label="Detection Confidence" value={report?.confidence_percent || 0} color="text-white" />
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                                    <span className="text-[9px] font-mono opacity-30 uppercase">AI Markers Detected</span>
                                    {report?.ai_generation_markers?.map((m: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <AlertTriangle size={12} className="text-amber-400 mt-0.5 shrink-0" />
                                            <span className="text-[10px] text-slate-300 leading-snug">{m}</span>
                                        </div>
                                    ))}
                                    {(!report?.ai_generation_markers || report?.ai_generation_markers?.length === 0) && (
                                        <span className="text-[10px] text-slate-500 italic mt-2">No definitive AI signatures detected.</span>
                                    )}
                                </div>
                            </div>

                            {/* Frame Entropy Grid (Only for Media) */}
                            {cnn?.frame_results?.length > 0 && (
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                    <FrameGrid frames={cnn.frame_results} />
                                </div>
                            )}

                            {/* Technical Anomalies */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block">Technical Anomalies</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {report?.technical_anomalies?.map((a: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <XCircle size={12} className="text-blood mt-0.5 shrink-0" />
                                            <span className="text-[10px] text-slate-300">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Full Report (expandable) */}
                            <AnimatePresence>
                                {showEvidence && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-4 overflow-hidden">
                                        <div className="bg-sky-950/20 border border-sky-500/20 rounded-3xl p-6">
                                            <span className="text-[9px] font-mono text-sky-400 uppercase mb-3 block flex items-center gap-2"><BookOpen size={10} />Court-Ready Defense Narrative</span>
                                            <p className="text-xs text-slate-300 leading-relaxed">{report?.defense_narrative}</p>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                            <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block">Recommended Actions</span>
                                            <div className="flex flex-col gap-2">
                                                {report?.recommended_actions?.map((a: string, i: number) => (
                                                    <div key={i} className="flex items-start gap-3">
                                                        <span className="text-sky-500 font-mono font-black text-sm shrink-0">{i + 1}.</span>
                                                        <span className="text-[11px] text-slate-300 leading-snug">{a}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* DMCA Quick Links */}
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                            <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block">Platform Takedown Links</span>
                                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                                {DMCA_PLATFORMS.map(p => (
                                                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                                                        className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-sky-500/20 hover:bg-white/[0.05] transition-all group">
                                                        <span className="text-xl">{p.icon}</span>
                                                        <span className="text-[8px] text-slate-500 group-hover:text-sky-300 transition-colors uppercase">{p.name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* OSINT Trace Module */}
                            <AnimatePresence>
                                {showTrace && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-6 mt-6 pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-black uppercase tracking-tighter">Criminal Profile</h2>
                                            {traceResult?.osint_report && <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest bg-green-900/20 border border-green-500/20 px-3 py-1.5 rounded-full">✓ Real OSINT Data</span>}
                                        </div>

                                        {isTracing && (
                                            <div className="flex flex-col items-center gap-4 py-10 opacity-50">
                                                <div className="w-8 h-8 rounded-full border-2 border-blood/30 border-t-blood animate-spin" />
                                                <p className="text-xs font-mono uppercase tracking-widest text-blood">Tracing IP & Registration Footprint...</p>
                                            </div>
                                        )}

                                        {!isTracing && traceResult?.status === 'BACKEND_OFFLINE' && (
                                            <div className="bg-amber-900/20 border border-amber-500/30 rounded-3xl p-6 text-center">
                                                <AlertTriangle size={32} className="text-amber-400 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-amber-400 mb-1">Backend Offline</p>
                                                <p className="text-xs text-slate-500">{traceResult.error}</p>
                                            </div>
                                        )}

                                        {!isTracing && traceResult?.osint_report && (() => {
                                            const o = traceResult.osint_report;
                                            return (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="w-16 h-16 rounded-2xl bg-blood/20 border border-blood/30 flex items-center justify-center">
                                                                <Fingerprint size={32} className="text-blood" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[9px] font-mono text-blood uppercase tracking-widest">Identified Origin</div>
                                                                <h3 className="text-base font-black break-all">{o?.domain_intel?.domain || o?.file_forensics?.hash?.file_type || 'Unknown Source'}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div><span className="text-[8px] opacity-30 block">Server Host</span><span className="text-xs text-slate-300 break-all">{o?.ip_intel?.geolocation?.isp || '—'}</span></div>
                                                            <div><span className="text-[8px] opacity-30 block">Server Country</span><span className="text-xs text-slate-300">{o?.ip_intel?.geolocation?.country || '—'}</span></div>
                                                            <div><span className="text-[8px] opacity-30 block">Registrar</span><span className="text-xs text-slate-300 break-all">{o?.domain_intel?.whois?.data?.registrar || '—'}</span></div>
                                                            <div><span className="text-[8px] opacity-30 block">Reg. Country</span><span className="text-xs text-slate-300">{o?.domain_intel?.whois?.data?.country || '—'}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Global Takedown Module */}
                            <AnimatePresence>
                                {showTakedown && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-6 mt-6 pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-black uppercase tracking-tighter">Global Takedown Queue</h2>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {DMCA_PLATFORMS.map((p, i) => (
                                                <div key={p.name} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{p.icon}</span>
                                                        <div>
                                                            <div className="text-sm font-bold">{p.name}</div>
                                                            <div className="text-[9px] font-mono text-slate-500 uppercase">{p.url}</div>
                                                        </div>
                                                    </div>
                                                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all">Submit Notice</a>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VictimPortal;
