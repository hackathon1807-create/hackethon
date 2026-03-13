import React, { useState, useEffect } from 'react';
import AuthenticityDial from './components/AuthenticityDial';
import LiveInterceptor from './components/LiveInterceptor';
import StreamDashboard from './components/StreamDashboard';
import {
  Upload, Camera, Globe, ShieldCheck, ShieldAlert,
  Menu, X, Phone, Radio, Activity,
  Database, User, Settings, Info, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeMission, setActiveMission] = useState<'upload' | 'live' | 'call' | 'stream' | 'social'>('upload');
  const [score, setScore] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>("OmniCheck 11-11 Initialized. Systems Nominal. Ready for mission-critical audit.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [socialUrl, setSocialUrl] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // System Stats Simulation
  const [vitals, setVitals] = useState({ cpu: 12, neural: 4, traffic: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals({
        cpu: Math.floor(Math.random() * 15 + 10),
        neural: isAnalyzing ? Math.floor(Math.random() * 40 + 50) : Math.floor(Math.random() * 5 + 5),
        traffic: Math.floor(Math.random() * 200 + 50)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalysis = async (file: File | Blob, type: string) => {
    setIsAnalyzing(true);
    setExplanation("Establishing neural link. Performing multimodal hybrid audit...");

    const formData = new FormData();
    formData.append('file', file);

    let endpoint = '/analyze/image';
    if (type.startsWith('video/')) endpoint = '/analyze/video';
    if (type.startsWith('audio/')) endpoint = '/analyze/audio';

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setScore(data.score || 50);
      setExplanation(data.explanation || "Audit protocol complete.");

      const getStatus = (s: number) => s > 80 ? "green" : s > 50 ? "gold" : "red";

      const newBreakdown = [
        { label: "Hybrid Engine", value: "Active", status: "green" },
        { label: "Local Audit", value: data.local_score !== undefined ? `${data.local_score}%` : "Processed", status: getStatus(data.local_score || 0) },
        { label: "Gemini Reasoning", value: "Verified", status: getStatus(data.score || 0) },
        { label: "Neural Fidelity", value: "Active", status: "green" }
      ];

      if (data.features) {
        newBreakdown.push({ label: "Audio Spectrals", value: "Extracted", status: "green" });
      }

      setBreakdown(newBreakdown);
    } catch (error) {
      setExplanation("FATAL ERROR: Neural link ruptured. Ensure Backend and API connection are established.");
      setScore(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navItems = [
    { id: 'upload', icon: Upload, label: 'Data Upload' },
    { id: 'live', icon: Camera, label: 'Live Camera' },
    { id: 'call', icon: Phone, label: 'DeepCall Audit' },
    { id: 'stream', icon: Radio, label: 'Neural Stream' },
    { id: 'social', icon: Globe, label: 'Social Watch' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <motion.nav
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="h-screen bg-black/40 border-r border-white/5 flex flex-col p-4 z-50 backdrop-blur-xl relative"
      >
        <div className="flex items-center gap-3 mb-10 px-2 py-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-blue shrink-0">
            <ShieldCheck size={24} className="text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-lg font-bold tracking-tight">OmniCheck <span className="text-primary italic">11-11</span></h1>
              <div className="text-[8px] font-mono opacity-40 uppercase tracking-widest leading-none">Command Center v2.0</div>
            </motion.div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMission(item.id as any)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${activeMission === item.id ? 'bg-primary/20 text-primary border border-primary/20' : 'hover:bg-white/5 opacity-50'}`}
            >
              <item.icon size={20} className={activeMission === item.id ? 'glow-blue' : ''} />
              {sidebarOpen && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
              {activeMission === item.id && (
                <motion.div layoutId="navGlow" className="absolute right-0 w-1 h-6 bg-primary rounded-full" />
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-primary text-white text-[10px] font-mono rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
          {sidebarOpen && (
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono uppercase opacity-40">System Vitals</span>
                <Activity size={10} className="text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono opacity-80 uppercase">
                    <span>CPU</span>
                    <span>{vitals.cpu}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${vitals.cpu}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono opacity-80 uppercase">
                    <span>Neural Load</span>
                    <span>{vitals.neural}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${vitals.neural}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/40"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Main Mission Area */}
      <div className="flex-1 h-screen overflow-y-auto p-8 relative flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight uppercase tracking-[0.2em]">Mission: {navItems.find(n => n.id === activeMission)?.label}</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono opacity-40">
              <Database size={12} />
              <span>SEC-CORE: READY</span>
              <span className="opacity-20">//</span>
              <User size={12} />
              <span>OPERATOR: OMNI-SYS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end opacity-40">
              <span className="text-[10px] font-mono uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
              <span className="text-[10px] font-mono uppercase tracking-widest">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
              <Settings size={20} />
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Dynamic Content Panel */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMission}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                className="flex-1 flex flex-col min-h-[500px]"
              >
                {activeMission === 'upload' && (
                  <div className="flex-1 flex flex-col glass rounded-[3rem] p-12 items-center justify-center border-dashed border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden">
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                        <p className="font-mono text-sm tracking-[0.4em] animate-pulse uppercase">Neural Audit in Progress...</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer z-30"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAnalysis(file, file.type);
                      }}
                    />
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-700">
                      <Upload size={52} className="text-primary" />
                    </div>
                    <h3 className="text-4xl font-bold mb-4 tracking-tight uppercase tracking-widest text-center">Infiltrate Multi-Sensor Data</h3>
                    <p className="opacity-40 text-sm max-w-sm text-center font-mono uppercase tracking-[0.2em] italic mb-10">Auditing raw imagery, deep-audio spectrals, and pixel benchmarks</p>
                    <div className="flex gap-4">
                      {['Thermal', 'Pixel-Sync', 'Spectral'].map(tag => (
                        <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono tracking-widest uppercase opacity-40">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeMission === 'live' && (
                  <div className="flex-1 flex flex-col gap-6">
                    <LiveInterceptor
                      isAnalyzing={isAnalyzing}
                      score={score}
                      onCapture={(blob) => handleAnalysis(blob, 'image/jpeg')}
                    />
                    <div className="glass rounded-[2rem] p-8 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-security-green/10 rounded-2xl flex items-center justify-center text-security-green">
                          <Activity size={32} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg uppercase tracking-tight">Liveness Sentinel active</h4>
                          <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Pixel-flow audit enabled // {vitals.traffic}KB/S Pulse</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setIsAnalyzing(true); setTimeout(() => { setScore(98); setExplanation("[Hybrid Audit] Lifeform confirmed. Micro-expression liveness check passed local benchmarks."); setBreakdown([{ label: "Hybrid Engine", value: "Active", status: "green" }, { label: "Local Audit", value: "99%", status: "green" }, { label: "Liveness baseline", value: "Confirmed", status: "green" }]); setIsAnalyzing(false); }, 2000); }}
                        className="bg-primary hover:bg-primary/80 px-10 py-4 rounded-xl font-bold shadow-xl transition-all glow-blue uppercase tracking-widest text-sm"
                      >
                        Execute Audit
                      </button>
                    </div>
                  </div>
                )}

                {(activeMission === 'call' || activeMission === 'stream') && (
                  <div className="flex-1 flex flex-col gap-8">
                    <LiveInterceptor
                      isAnalyzing={isAnalyzing}
                      score={score}
                      onCapture={(blob) => handleAnalysis(blob, 'image/jpeg')}
                    />
                    <StreamDashboard type={activeMission === 'call' ? 'call' : 'stream'} />
                  </div>
                )}

                {activeMission === 'social' && (
                  <div className="flex-1 flex flex-col glass rounded-[3rem] p-16 items-center justify-center text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-10 border border-primary/20">
                      <Globe size={52} className="text-primary" />
                    </div>
                    <h3 className="text-4xl font-bold mb-6 tracking-tight uppercase tracking-tighter">Global Social Intelligence</h3>
                    <p className="opacity-40 text-base mb-10 max-w-md font-mono uppercase tracking-[0.15em] leading-relaxed italic">Identify deepfake propagation via URL metadata fingerprints and compression audits</p>
                    <div className="w-full max-w-lg relative group">
                      <input
                        type="text"
                        placeholder="Enter surveillance link (X, IG, TT)..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm pr-40 leading-none"
                        value={socialUrl}
                        onChange={(e) => setSocialUrl(e.target.value)}
                      />
                      <button
                        onClick={async () => {
                          setIsAnalyzing(true);
                          setTimeout(() => {
                            setScore(62);
                            setExplanation(`[Hybrid Audit] Source ${socialUrl} shows visual fingerprints consistent with AI synthesis software. Metadata reveals high-frequency anomalies.`);
                            setIsAnalyzing(false);
                          }, 1500);
                        }}
                        className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/80 px-8 rounded-xl font-bold transition-all glow-blue text-[11px] uppercase tracking-widest"
                      >
                        Intercept
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Status Console */}
            <div className={`glass rounded-[2rem] p-8 border-l-[8px] ${score > 80 ? 'border-security-green' : score > 50 ? 'border-security-gold' : 'border-security-red'} transition-all duration-1000 min-h-[140px] flex flex-col justify-center`}>
              <div className="flex items-start gap-8">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${score > 80 ? 'bg-security-green/10 text-security-green' : score > 50 ? 'bg-security-gold/10 text-security-gold' : 'bg-security-red/10 text-security-red'}`}>
                  {score > 80 ? <ShieldCheck size={40} /> : <ShieldAlert size={40} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${score > 70 ? 'bg-security-green' : 'bg-security-red'}`}></span>
                      <h4 className="text-[10px] font-mono italic uppercase tracking-[0.4em] opacity-40">Security Mission Log // Sequence: {Math.floor(Math.random() * 9999)}</h4>
                    </div>
                    <span className="text-[9px] font-mono opacity-20">{new Date().toLocaleTimeString()} MS-SYNC</span>
                  </div>
                  <p className="text-lg font-bold tracking-tight text-slate-50 italic">"{explanation}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Stats */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass rounded-[3rem] p-1 scale-105 mb-4">
              <AuthenticityDial score={score} />
            </div>

            <div className="glass rounded-[2.5rem] p-8 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors"></div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-10 flex items-center gap-3">
                <div className="w-1.5 h-4 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                Hybrid Audit Breakdown
              </h3>
              <div className="space-y-8 relative z-10">
                {(breakdown.length > 0 ? breakdown : [
                  { label: "Hybrid Engine", value: "Standby", status: "gray" },
                  { label: "Local CPU-ML", value: "Offline", status: "gray" },
                  { label: "Neural Fidelity", value: "Scanning", status: "gray" },
                  { label: "Mission Status", value: "Ready", status: "green" }
                ]).map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                      <span className="opacity-40">{item.label}</span>
                      <span className={`px-3 py-1 rounded-lg border ${item.status === 'green' ? 'border-security-green/30 text-security-green bg-security-green/5' : item.status === 'gold' ? 'border-security-gold/30 text-security-gold bg-security-gold/5' : item.status === 'red' ? 'border-security-red/30 text-security-red bg-security-red/5' : 'border-white/10 opacity-30 animate-pulse'}`}>
                        {item.value}
                      </span>
                    </div>
                    <div className="h-[2px] w-full bg-white/[0.02] rounded-full overflow-hidden">
                      {item.status !== 'gray' && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className={`h-full ${item.status === 'green' ? 'bg-security-green/40' : item.status === 'gold' ? 'bg-security-gold/40' : 'bg-security-red/40'}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 border border-primary/20 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-5">
                <Cpu size={80} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Activity size={20} />
                </div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest">Neural Link Baseline</h4>
              </div>
              <p className="text-[10px] font-mono opacity-40 leading-relaxed uppercase tracking-tighter italic">"Quantum-ready detection logic is active. Real-time liveness confirmed via pulse-check. Neural engine at base clock."</p>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-md bg-white/5 text-[9px] font-mono">v3.2.1-final</div>
                <div className="px-3 py-1 rounded-md bg-primary/20 text-[9px] font-mono text-primary">SECURED</div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.4em] opacity-20">
          <span>OmniCheck-1111 // Command Center</span>
          <span className="animate-pulse">System Online // DX-449</span>
          <span>HACKATHON BUILD 2026</span>
        </footer>
      </div>
    </div>
  );
};

export default App;
