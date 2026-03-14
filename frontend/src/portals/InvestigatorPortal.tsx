import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Target, Upload, Search, Radio, Lock,
    Activity, Database, FileText, Download, ShieldAlert,
    MapPin, Share2, Cpu, AlertTriangle, ExternalLink,
    Fingerprint, Users, Globe, Crosshair, Zap, CheckCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import CriminalOriginMap from '../components/CriminalOriginMap';
import NeuralTerminal from '../components/NeuralTerminal';
import CrimeFeed from '../components/CrimeFeed';

interface InvestigatorPortalProps { onBack: () => void; hideHeader?: boolean; }

const TAKEDOWN_PLATFORMS = [
    { name: "Telegram", type: "Message @notoscam", url: "https://t.me/notoscam", severity: "HIGH" },
    { name: "YouTube", type: "Content ID Removal", url: "https://support.google.com/youtube/answer/2807622", severity: "CRITICAL" },
    { name: "Meta (FB/IG)", type: "Non-Consensual Imagery", url: "https://www.facebook.com/help/1380418588640630", severity: "HIGH" },
    { name: "X/Twitter", type: "Privacy Violation", url: "https://help.twitter.com/forms/privacy", severity: "MEDIUM" },
    { name: "TikTok", type: "Report Deepfake", url: "https://www.tiktok.com/legal/report/privacy", severity: "HIGH" },
];

const InvestigatorPortal = ({ onBack, hideHeader }: InvestigatorPortalProps) => {
    const [activePanel, setActivePanel] = useState<'trace' | 'profile' | 'neural' | 'takedown' | 'report'>('neural');
    const [target, setTarget] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isTracing, setIsTracing] = useState(false);
    const [traceResult, setTraceResult] = useState<any>(null);
    const [reportGenerated, setReportGenerated] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleTrace = async () => {
        if (!target && !selectedFile) return;
        setIsTracing(true);
        try {
            const formData = new FormData();
            if (target) formData.append('target', target);
            if (selectedFile) formData.append('file', selectedFile);
            const res = await fetch('http://localhost:8000/investigator/trace', { method: 'POST', body: formData });
            const data = await res.json();
            setTraceResult(data);
        } catch (err: any) {
            // Backend offline — show connection error, no fake data
            setTraceResult({
                status: "BACKEND_OFFLINE",
                error: "Cannot connect to Meipporul AI backend at http://localhost:8000. Start the backend server to enable real OSINT investigation.",
                cnn_analysis: null,
                osint_report: null,
                investigation_report: null,
            });
        } finally {
            setIsTracing(false);
            setActivePanel('profile');
        }
    };

    const handleDownloadFIR = () => {
        if (!traceResult) return;
        const ir = traceResult.investigation_report || {};
        const o = traceResult.osint_report || {};
        const now = new Date().toISOString();

        // Build real FIR from actual OSINT + LLM data
        const domain = o.domain_intel?.domain || 'Unknown';
        const ip = o.ip_intel?.primary_ip || 'Unknown';
        const city = o.ip_intel?.geolocation?.city || 'Unknown';
        const country = o.ip_intel?.geolocation?.country || 'Unknown';
        const isp = o.ip_intel?.geolocation?.isp || 'Unknown';
        const registrar = o.domain_intel?.whois?.data?.registrar || 'Unknown';
        const regCountry = o.domain_intel?.whois?.data?.country || 'Unknown';
        const platform = o.platform_detection?.name || 'Unknown Platform';
        const riskFlags = (o.risk_summary || []).join('\n  • ');
        const ports = o.ip_intel?.shodan?.open_ports?.join(', ') || 'N/A';

        const content = `MEIPPORUL AI CLASSIFIED INTELLIGENCE PLATFORM (TEAM BLOOD MOON)
${'═'.repeat(60)}
FIRST INFORMATION REPORT (FIR) — CYBERCRIME INVESTIGATION
Document Class: LAW ENFORCEMENT RESTRICTED
Generated: ${now}
Investigation ID: BM-${Date.now().toString(36).toUpperCase()}
${'═'.repeat(60)}

1. NATURE OF OFFENCE
   Deepfake content — Non-consensual AI-generated media publication
   Platform: ${platform}

2. TECHNICAL EVIDENCE SUMMARY
   Target Domain  : ${domain}
   Server IP      : ${ip}
   Server Location: ${city}, ${country}
   ISP / Host     : ${isp}
   Registrar      : ${registrar} (${regCountry})
   Open Ports     : ${ports}
   URLScan Status : ${o.urlscan?.malicious ? 'MALICIOUS ⚠' : o.urlscan?.found ? 'Found — Clean' : 'No record'}

3. RISK FLAGS IDENTIFIED
  • ${riskFlags || 'See OSINT report for details'}

4. BEHAVIORAL ANALYSIS (AI Intelligence Assessment)
   ${ir.behavioral_analysis || 'Analysis pending — run OSINT trace with valid target'}

5. MODUS OPERANDI
   ${ir.modus_operandi || 'Review OSINT trace data'}

6. TECHNICAL CAPABILITY ASSESSMENT
   ${ir.technical_capability_assessment || 'Unknown'}

7. MOTIVATION HYPOTHESIS
   ${ir.motivation_hypothesis || 'Under investigation'}

8. FIR NARRATIVE
${'-'.repeat(60)}
   ${ir.fir_narrative || (o.risk_summary?.length > 0 ? `OSINT investigation identified ${o.risk_summary.length} risk flag(s) on target ${domain}. Server located in ${city}, ${country}. Immediate platform cooperation and IP log preservation requested.` : 'Investigation data pending. Run OSINT trace to generate narrative.')}
${'-'.repeat(60)}

9. INVESTIGATIVE LEADS
${(ir.investigative_leads || []).map((l: string, i: number) => `   ${i+1}. ${l}`).join('\n') || '   Run OSINT trace to generate investigative leads'}

10. RECOMMENDED INTERVENTIONS
${(ir.recommended_interventions || []).map((r: string, i: number) => `    ${i+1}. ${r}`).join('\n') || '    See OSINT report for platform-specific actions'}

11. EVIDENCE STRENGTH ASSESSMENT
    ${ir.evidence_strength || 'MODERATE'}

12. APPLICABLE LEGAL SECTIONS
    • IT Act §66E — Violation of privacy
    • IT Act §67 — Obscene electronic content
    • IPC §509 — Insulting modesty via digital medium
    • IT Act §43 — Unauthorized access / data tampering

${'═'.repeat(60)}
FORENSIC INTEGRITY: This report was generated by Meipporul AI v4.0 (Team Blood Moon)
AI Engine: Ollama (local, offline) — No external data transmission
Data Retention: NONE. Session purged after report generation.
${'═'.repeat(60)}
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BloodMoon_FIR_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        setReportGenerated(true);
        setTimeout(() => setReportGenerated(false), 5000);
    };

    const panels = [

        { id: 'neural', label: 'Neural Scan', icon: Cpu },
        { id: 'trace', label: 'OSINT Trace', icon: Target },
        { id: 'profile', label: 'Criminal Profile', icon: Users },
        { id: 'takedown', label: 'Takedown Queue', icon: ShieldAlert },
        { id: 'report', label: 'Arrest Report', icon: FileText },
    ];

    const ir = traceResult?.investigation_report;

    return (
        <div className="min-h-screen h-screen bg-[#050209] text-slate-200 flex flex-col overflow-hidden">
            {/* Tactical Header — suppressed inside unified nav */}
            {!hideHeader && (
            <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-blood/10 bg-red-950/10 backdrop-blur-sm shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-xs font-mono uppercase tracking-widest">
                    <ChevronLeft size={16} />Exit
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blood animate-pulse" />
                    <span className="text-[9px] font-mono text-blood uppercase tracking-widest">Classified Intelligence Mode — Investigator Only</span>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <div>
                        <span className="text-[8px] opacity-30 font-mono uppercase block">Priority</span>
                        <span className={cn("text-xs font-black", ir?.arrest_priority === 'HIGH' || ir?.arrest_priority === 'CRITICAL' ? 'text-blood' : 'text-amber-400')}>
                            {ir?.arrest_priority || '—'}
                        </span>
                    </div>
                    <div>
                        <span className="text-[8px] opacity-30 font-mono uppercase block">Status</span>
                        <span className="text-xs font-black text-green-400">{traceResult ? 'TRACE COMPLETE' : 'STANDBY'}</span>
                    </div>
                </div>
            </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Side Panels Navigation (Desktop) */}
                <div className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-white/[0.01] p-4 gap-2 shrink-0">
                    {panels.map(p => {
                        const Icon = p.icon;
                        return (
                            <button key={p.id} onClick={() => setActivePanel(p.id as any)}
                                className={cn("flex items-center gap-3 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all text-left",
                                    activePanel === p.id ? 'bg-blood/20 text-blood border border-blood/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                )}>
                                <Icon size={16} />{p.label}
                            </button>
                        );
                    })}
                    <div className="mt-auto p-4 border border-white/5 rounded-2xl bg-white/[0.02]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[9px] font-mono text-green-400 uppercase">SatLink: Stable</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock size={10} className="text-blue-400" />
                            <span className="text-[9px] font-mono text-blue-400 uppercase">Local LLM: Active</span>
                        </div>
                    </div>
                </div>

                {/* Main Panel */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 no-scrollbar pb-10">
                    {/* Mobile Tab Scroll */}
                    <div className="flex lg:hidden gap-2 mb-4 sm:mb-6 overflow-x-auto no-scrollbar pb-2 pt-1 mx-[-12px] px-3 sm:mx-0 sm:px-0 scroll-smooth">
                        {panels.map(p => {
                            const Icon = p.icon;
                            return (
                                <button key={p.id} onClick={() => setActivePanel(p.id as any)}
                                    className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest whitespace-nowrap shrink-0 transition-all",
                                        activePanel === p.id ? 'bg-blood/20 text-blood border border-blood/30' : 'bg-white/5 text-slate-500'
                                    )}>
                                    <Icon size={12} />{p.label}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* OSINT Trace */}
                        {activePanel === 'trace' && (
                            <motion.div key="trace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">OSINT Trace Module</h2>
                                    <p className="text-[10px] text-slate-500">Real-time intelligence: WHOIS · DNS · IP Geo · Shodan · URLScan · File Forensics · News</p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                    <input type="text" value={target} onChange={e => setTarget(e.target.value)}
                                        placeholder="Target URL (e.g. https://tiktok.com/@user/...)"
                                        className="flex-1 bg-white/5 border border-white/5 focus:border-blood/40 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs font-mono outline-none text-slate-300 placeholder-slate-600 transition-all min-w-0"
                                    />
                                    <button onClick={() => fileRef.current?.click()} className="flex justify-center items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all flex-shrink-0">
                                        <Upload size={14} className="shrink-0" />{selectedFile ? selectedFile.name.slice(0, 15) + '...' : 'Inject Media'}
                                    </button>
                                    <input ref={fileRef} type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
                                </div>

                                <button onClick={handleTrace} disabled={isTracing || (!target && !selectedFile)}
                                    className="w-full bg-blood hover:bg-red-700 disabled:opacity-40 text-white py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_30px_-10px_rgba(180,0,30,0.5)] transition-all">
                                    {isTracing ? (
                                        <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full shrink-0" /><span className="truncate">Tracing...</span></>
                                    ) : <><Crosshair size={14} className="sm:w-[16px] sm:h-[16px] shrink-0" /><span className="truncate">Initiate Real-Time OSINT Trace</span></>}
                                </button>

                                {/* REAL OSINT RESULTS */}
                                {traceResult?.osint_report && (() => {
                                    const o = traceResult.osint_report;
                                    return (
                                        <div className="flex flex-col gap-4">
                                            {/* Risk Summary Banner */}
                                            {o.risk_summary?.length > 0 && (
                                                <div className="bg-blood/10 border border-blood/30 rounded-3xl p-5 flex flex-col gap-2">
                                                    <span className="text-[9px] font-mono text-blood uppercase tracking-widest mb-1">⚡ Risk Intelligence Flags</span>
                                                    {o.risk_summary.map((flag: string, i: number) => (
                                                        <div key={i} className="flex items-start gap-2 text-[11px] text-red-300">{flag}</div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Platform Detection */}
                                            {o.platform_detection && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[8px] font-mono opacity-30 uppercase block mb-1">Platform Identified</span>
                                                        <span className="text-lg font-black">{o.platform_detection.name}</span>
                                                        <span className="text-[9px] text-slate-500 ml-3">{o.platform_detection.type}</span>
                                                    </div>
                                                    <span className={`text-[9px] font-bold px-3 py-1.5 rounded-full border uppercase ${o.platform_detection.risk === 'CRITICAL' ? 'border-blood/50 text-blood bg-blood/10' : 'border-amber-500/40 text-amber-400 bg-amber-900/10'}`}>{o.platform_detection.risk}</span>
                                                </div>
                                            )}

                                            {/* Domain + WHOIS */}
                                            {o.domain_intel && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block flex items-center gap-2"><Globe size={10} />Domain Intelligence — WHOIS</span>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {[
                                                            ["Domain", o.domain_intel.domain],
                                                            ["Registrar", o.domain_intel.whois?.data?.registrar],
                                                            ["Country", o.domain_intel.whois?.data?.country],
                                                            ["Created", o.domain_intel.whois?.data?.creation_date?.split('T')[0]],
                                                            ["Expires", o.domain_intel.whois?.data?.expiration_date?.split('T')[0]],
                                                            ["Status", o.domain_intel.whois?.data?.status?.[0]],
                                                            ["Registrant", o.domain_intel.whois?.data?.registrant],
                                                            ["Org", o.domain_intel.whois?.data?.org],
                                                        ].filter(([, v]) => v).map(([k, v]) => (
                                                            <div key={k}>
                                                                <span className="text-[8px] opacity-30 font-mono uppercase block">{k}</span>
                                                                <span className="text-[11px] text-slate-200 break-all">{v}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {o.domain_intel.dns?.ips?.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-white/5">
                                                            <span className="text-[8px] opacity-30 font-mono uppercase block mb-2">Resolved IPs</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {o.domain_intel.dns.ips.map((ip: string) => (
                                                                    <span key={ip} className="text-[10px] font-mono bg-white/5 border border-white/5 px-3 py-1 rounded-full">{ip}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {o.domain_intel.whois?.data?.emails?.length > 0 && (
                                                        <div className="mt-3">
                                                            <span className="text-[8px] opacity-30 font-mono uppercase block mb-2">Contact Emails in WHOIS</span>
                                                            {o.domain_intel.whois.data.emails.map((e: string) => (
                                                                <span key={e} className="text-[10px] font-mono text-sky-400 block">{e}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* IP Geolocation + Shodan */}
                                            {o.ip_intel && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                        <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block flex items-center gap-2"><MapPin size={10} />IP Geolocation</span>
                                                        <div className="flex flex-col gap-2">
                                                            {[
                                                                ["IP Address", o.ip_intel.primary_ip],
                                                                ["City", o.ip_intel.geolocation?.city],
                                                                ["Country", o.ip_intel.geolocation?.country],
                                                                ["ISP / AS", o.ip_intel.geolocation?.isp],
                                                                ["ASN", o.ip_intel.geolocation?.asn],
                                                                ["Timezone", o.ip_intel.geolocation?.timezone],
                                                            ].filter(([, v]) => v).map(([k, v]) => (
                                                                <div key={k} className="flex items-center justify-between">
                                                                    <span className="text-[8px] opacity-30 font-mono uppercase">{k}</span>
                                                                    <span className="text-[10px] font-mono text-right max-w-[55%] break-all">{v}</span>
                                                                </div>
                                                            ))}
                                                            {o.ip_intel.geolocation?.is_vpn_indicator && (
                                                                <div className="mt-2 text-[9px] font-mono text-amber-400 bg-amber-900/20 border border-amber-500/20 rounded-xl px-3 py-2">
                                                                    ⚠ VPN / Datacenter IP detected
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                        <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block flex items-center gap-2"><Database size={10} />Shodan InternetDB</span>
                                                        {o.ip_intel.shodan?.open_ports?.length > 0 ? (
                                                            <div className="flex flex-col gap-3">
                                                                <div>
                                                                    <span className="text-[8px] opacity-30 font-mono uppercase block mb-2">Open Ports</span>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {o.ip_intel.shodan.open_ports.slice(0, 12).map((p: number) => (
                                                                            <span key={p} className="text-[9px] font-mono px-2 py-1 bg-white/5 border border-white/5 rounded-lg">{p}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                {o.ip_intel.shodan.tags?.length > 0 && (
                                                                    <div>
                                                                        <span className="text-[8px] opacity-30 font-mono uppercase block mb-1">Tags</span>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {o.ip_intel.shodan.tags.map((t: string) => (
                                                                                <span key={t} className="text-[8px] px-2 py-0.5 rounded-full bg-sky-900/30 border border-sky-500/20 text-sky-300">{t}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {o.ip_intel.shodan.vulns?.length > 0 && (
                                                                    <div className="text-[9px] text-blood font-mono">
                                                                        🚨 {o.ip_intel.shodan.vulns.length} CVE vulnerability/ies found
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-[10px] text-slate-600 font-mono">{o.ip_intel.shodan?.note || "No Shodan data"}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* File Forensics */}
                                            {o.file_forensics && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block">File Forensics</span>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <span className="text-[8px] opacity-30 font-mono uppercase block mb-3">Cryptographic Hash</span>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[8px] text-slate-600 font-mono">SHA256</span>
                                                                <span className="text-[9px] font-mono text-sky-400 break-all">{o.file_forensics.hash?.sha256}</span>
                                                                <span className="text-[8px] text-slate-600 font-mono mt-1">MD5</span>
                                                                <span className="text-[9px] font-mono text-sky-400 break-all">{o.file_forensics.hash?.md5}</span>
                                                                <div className="flex gap-4 mt-2">
                                                                    <div><span className="text-[8px] opacity-30 block">File Type</span><span className="text-[10px]">{o.file_forensics.hash?.file_type}</span></div>
                                                                    <div><span className="text-[8px] opacity-30 block">Size</span><span className="text-[10px]">{o.file_forensics.hash?.size_bytes ? (o.file_forensics.hash.size_bytes / 1024).toFixed(1) + ' KB' : '—'}</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-[8px] opacity-30 font-mono uppercase block mb-3">EXIF Metadata</span>
                                                            {o.file_forensics.exif?.available ? (
                                                                <div className="flex flex-col gap-1.5">
                                                                    {[
                                                                        ["Camera", o.file_forensics.exif.camera],
                                                                        ["Software", o.file_forensics.exif.software],
                                                                        ["Captured", o.file_forensics.exif.timestamp],
                                                                        ["GPS", o.file_forensics.exif.gps ? `${o.file_forensics.exif.gps.lat}, ${o.file_forensics.exif.gps.lon}` : null],
                                                                    ].filter(([, v]) => v).map(([k, v]) => (
                                                                        <div key={k} className="flex justify-between">
                                                                            <span className="text-[8px] opacity-30 font-mono uppercase">{k}</span>
                                                                            <span className="text-[10px] text-right max-w-[60%]">{v}</span>
                                                                        </div>
                                                                    ))}
                                                                    {o.file_forensics.exif.warnings?.map((w: string, i: number) => (
                                                                        <div key={i} className="text-[9px] text-amber-400 mt-1">{w}</div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-[10px] text-slate-600 font-mono">
                                                                    {o.file_forensics.exif?.warnings?.[0] || "No EXIF data available"}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* URLScan.io */}
                                            {o.urlscan?.found && (
                                                <div className={`rounded-3xl border p-6 ${o.urlscan.malicious ? 'bg-blood/10 border-blood/30' : 'bg-white/[0.02] border-white/5'}`}>
                                                    <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block">URLScan.io Intelligence</span>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                        <div><span className="text-[8px] opacity-30 block">Scans Found</span><span className="text-xl font-black">{o.urlscan.scan_count}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Server Country</span><span className="text-sm font-bold">{o.urlscan.country || '—'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Server</span><span className="text-sm font-bold">{o.urlscan.server || '—'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Malicious</span><span className={`text-sm font-black ${o.urlscan.malicious ? 'text-blood' : 'text-green-400'}`}>{o.urlscan.malicious ? 'YES' : 'NO'}</span></div>
                                                    </div>
                                                    {o.urlscan.report_link && (
                                                        <a href={o.urlscan.report_link} target="_blank" rel="noopener noreferrer"
                                                            className="text-[9px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">
                                                            <ExternalLink size={10} />View Full URLScan Report
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            {/* Related News */}
                                            {o.related_news?.length > 0 && !o.related_news[0]?.error && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <span className="text-[9px] font-mono opacity-30 uppercase mb-4 block">Related News (Google News)</span>
                                                    <div className="flex flex-col gap-3">
                                                        {o.related_news.slice(0, 4).map((n: any, i: number) => (
                                                            <a key={i} href={n.link} target="_blank" rel="noopener noreferrer"
                                                                className="flex items-start gap-3 group hover:bg-white/[0.03] rounded-2xl p-2 -mx-2 transition-all">
                                                                <span className="text-[9px] font-mono text-blood mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[11px] font-bold leading-tight group-hover:text-sky-300 transition-colors truncate">{n.title}</p>
                                                                    <p className="text-[8px] opacity-30 font-mono mt-0.5">{n.published}</p>
                                                                </div>
                                                                <ExternalLink size={10} className="text-slate-700 group-hover:text-sky-400 transition-colors shrink-0 mt-0.5" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Empty state with live threat feed */}
                                {!traceResult?.osint_report && (
                                    <div className="h-96 overflow-hidden">
                                        <CrimeFeed />
                                    </div>
                                )}
                            </motion.div>
                        )}


                        {/* Criminal Profile — built entirely from real OSINT data */}
                        {activePanel === 'profile' && (() => {
                            const o = traceResult?.osint_report;
                            const hasData = o && (o.domain_intel || o.ip_intel || o.file_forensics || o.risk_summary?.length > 0);

                            // Build real footprint from OSINT findings
                            const realFootprint: string[] = [];
                            if (o?.ip_intel?.geolocation?.is_vpn_indicator)
                                realFootprint.push(`Server IP ${o.ip_intel.primary_ip} resolves to VPN/Datacenter (${o.ip_intel.geolocation?.isp || 'Unknown ISP'})`);
                            if (o?.ip_intel?.geolocation)
                                realFootprint.push(`IP Geolocation: ${o.ip_intel.geolocation.city || '—'}, ${o.ip_intel.geolocation.country || '—'} (ASN: ${o.ip_intel.geolocation.asn || '—'})`);
                            if (o?.domain_intel?.whois?.data?.creation_date)
                                realFootprint.push(`Domain created: ${o.domain_intel.whois.data.creation_date?.split?.('T')[0] || o.domain_intel.whois.data.creation_date} via ${o.domain_intel.whois.data.registrar || 'Unknown registrar'}`);
                            if (o?.domain_intel?.whois?.data?.country)
                                realFootprint.push(`Domain registered in: ${o.domain_intel.whois?.data?.country} — ${o.domain_intel.whois?.data?.org || ''}`);
                            if (o?.file_forensics?.exif?.available === false)
                                realFootprint.push('EXIF metadata absent — potential deliberate counter-forensic stripping');
                            if (o?.file_forensics?.exif?.software)
                                realFootprint.push(`Editing/AI software detected in file metadata: ${o.file_forensics.exif.software}`);
                            if (o?.file_forensics?.exif?.gps)
                                realFootprint.push(`GPS coordinates embedded in file: ${o.file_forensics.exif.gps.lat}, ${o.file_forensics.exif.gps.lon}`);
                            if (o?.urlscan?.malicious)
                                realFootprint.push('URLScan.io flagged URL as MALICIOUS');
                            if (o?.ip_intel?.shodan?.vulns?.length > 0)
                                realFootprint.push(`${o.ip_intel.shodan.vulns.length} CVE vulnerabilities on server (Shodan)`);
                            if (o?.ip_intel?.shodan?.open_ports?.length > 0)
                                realFootprint.push(`Open ports on server: ${o.ip_intel.shodan.open_ports.slice(0, 8).join(', ')}`);
                            realFootprint.push(...(o?.risk_summary || []));

                            const riskLevel = o?.risk_summary?.length > 2 ? 'CRITICAL' :
                                              o?.risk_summary?.length > 0 ? 'HIGH' :
                                              o?.urlscan?.malicious ? 'CRITICAL' : 'MEDIUM';

                            return (
                                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black uppercase tracking-tighter">Criminal Profile</h2>
                                        {hasData && <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest bg-green-900/20 border border-green-500/20 px-3 py-1.5 rounded-full">✓ Real OSINT Data</span>}
                                    </div>

                                    {/* Backend offline notice */}
                                    {traceResult?.status === 'BACKEND_OFFLINE' && (
                                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-3xl p-6 text-center">
                                            <AlertTriangle size={32} className="text-amber-400 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-amber-400 mb-1">Backend Offline</p>
                                            <p className="text-xs text-slate-500">{traceResult.error}</p>
                                        </div>
                                    )}

                                    {!hasData && traceResult?.status !== 'BACKEND_OFFLINE' && (
                                        <div className="flex flex-col items-center gap-4 py-20 opacity-30">
                                            <Users size={48} />
                                            <p className="text-xs font-mono uppercase tracking-widest">Run OSINT Trace to build real criminal profile</p>
                                        </div>
                                    )}

                                    {hasData && (
                                        <>
                                            {/* Identity block from WHOIS */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-blood/20 border border-blood/30 flex items-center justify-center">
                                                            <Fingerprint size={32} className="text-blood" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[9px] font-mono text-blood uppercase tracking-widest">Identified Origin</div>
                                                            <h3 className="text-base font-black break-all">
                                                                {o?.domain_intel?.domain || o?.file_forensics?.hash?.file_type || 'Unknown'}
                                                            </h3>
                                                            {o?.platform_detection?.name && (
                                                                <span className="text-[9px] text-slate-500">{o.platform_detection.name} · {o.platform_detection.type}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div><span className="text-[8px] opacity-30 block">Server Host</span><span className="text-xs text-slate-300 break-all">{o?.ip_intel?.geolocation?.isp || '—'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Server Country</span><span className="text-xs text-slate-300">{o?.ip_intel?.geolocation?.country || o?.domain_intel?.whois?.data?.country || '—'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Registrar</span><span className="text-xs text-slate-300 break-all">{o?.domain_intel?.whois?.data?.registrar || '—'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Reg. Country</span><span className="text-xs text-slate-300">{o?.domain_intel?.whois?.data?.country || '—'}</span></div>
                                                        {o?.domain_intel?.whois?.data?.registrant && (
                                                            <div className="col-span-2"><span className="text-[8px] opacity-30 block mb-1">Registrant</span><p className="text-[11px] text-slate-400">{o.domain_intel.whois.data.registrant}</p></div>
                                                        )}
                                                        {o?.domain_intel?.whois?.data?.org && (
                                                            <div className="col-span-2"><span className="text-[8px] opacity-30 block mb-1">Organisation</span><p className="text-[11px] text-slate-400">{o.domain_intel.whois.data.org}</p></div>
                                                        )}
                                                        {o?.domain_intel?.whois?.data?.emails?.length > 0 && (
                                                            <div className="col-span-2">
                                                                <span className="text-[8px] opacity-30 block mb-1">Contact Emails (WHOIS)</span>
                                                                {o.domain_intel.whois.data.emails.map((e: string) => (
                                                                    <p key={e} className="text-[11px] font-mono text-sky-400">{e}</p>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Risk level card */}
                                                <div className={cn('rounded-3xl p-8 border flex flex-col items-center justify-center text-center gap-4',
                                                    riskLevel === 'CRITICAL' ? 'bg-blood/10 border-blood/30' :
                                                    riskLevel === 'HIGH' ? 'bg-blood/5 border-blood/20' :
                                                    'bg-amber-900/20 border-amber-500/20')}>
                                                    <span className="text-[9px] font-mono opacity-40 uppercase">Intelligence Risk Level</span>
                                                    <span className={cn("text-5xl font-black",
                                                        riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'text-blood' : 'text-amber-400')}>{riskLevel}</span>
                                                    <div className="text-[9px] font-mono opacity-40 text-center">
                                                        {o?.risk_summary?.length || 0} flags · {realFootprint.length} evidence points
                                                    </div>
                                                    {o?.urlscan?.malicious && (
                                                        <span className="text-[8px] bg-blood/20 border border-blood/30 text-blood px-2 py-1 rounded-full font-bold uppercase">URLScan: MALICIOUS</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* File forensics summary */}
                                            {o?.file_forensics && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <h4 className="text-[9px] font-mono uppercase opacity-40 mb-4">Media Forensics</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div><span className="text-[8px] opacity-30 block">File Type</span><span className="text-xs">{o.file_forensics.hash?.file_type || '—'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Camera</span><span className="text-xs">{o.file_forensics.exif?.camera || 'Unknown'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">Captured</span><span className="text-xs">{o.file_forensics.exif?.timestamp || '—'}</span></div>
                                                        <div><span className="text-[8px] opacity-30 block">EXIF Present</span><span className={cn('text-xs font-bold', o.file_forensics.exif?.available ? 'text-amber-400' : 'text-blood')}>{o.file_forensics.exif?.available ? 'YES' : 'STRIPPED'}</span></div>
                                                        {o.file_forensics.exif?.software && (
                                                            <div className="col-span-2 md:col-span-4">
                                                                <span className="text-[8px] opacity-30 block">AI/Editing Software in Metadata</span>
                                                                <span className="text-xs text-amber-400 font-mono">{o.file_forensics.exif.software}</span>
                                                            </div>
                                                        )}
                                                        {o.file_forensics.exif?.gps && (
                                                            <div className="col-span-2 md:col-span-4">
                                                                <span className="text-[8px] opacity-30 block">GPS Coordinates Embedded</span>
                                                                <span className="text-xs font-mono text-sky-400">{o.file_forensics.exif.gps.lat}, {o.file_forensics.exif.gps.lon}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Real Digital Footprint */}
                                            {realFootprint.length > 0 && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <h4 className="text-[9px] font-mono uppercase opacity-40 mb-4">Digital Footprint — Evidence Trail</h4>
                                                    <ul className="flex flex-col gap-2">
                                                        {realFootprint.map((f, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-[11px] text-slate-300">
                                                                <Activity size={12} className="text-blood mt-0.5 shrink-0" />{f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Server Infrastructure */}
                                            {o?.ip_intel?.shodan?.open_ports?.length > 0 && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <h4 className="text-[9px] font-mono uppercase opacity-40 mb-4">Server Infrastructure (Shodan)</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {o.ip_intel.shodan.open_ports.map((p: number) => (
                                                            <span key={p} className="text-[9px] font-mono px-3 py-1.5 rounded-full border border-white/10 bg-white/5">{p}</span>
                                                        ))}
                                                    </div>
                                                    {o.ip_intel.shodan.vulns?.length > 0 && (
                                                        <p className="text-[10px] text-blood font-mono mt-3">🚨 {o.ip_intel.shodan.vulns.length} CVE vulnerabilities: {o.ip_intel.shodan.vulns.slice(0,3).join(', ')}</p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Default charges based on OSINT */}
                                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                <h4 className="text-[9px] font-mono uppercase opacity-40 mb-4">Applicable Legal Sections</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {['IT Act §66E — Privacy violation', 'IT Act §67 — Obscene content', 'IPC §509 — Insulting modesty', 'IT Act §43 — Unauthorized access'].map((c, i) => (
                                                        <span key={i} className="text-[9px] px-3 py-1.5 rounded-full border border-blood/20 text-red-300 bg-blood/5">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            );
                        })()}

                        {/* Neural Scan */}
                        {activePanel === 'neural' && (
                            <motion.div key="neural" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Neural Scan</h2>
                                <div className="h-[500px]">
                                    <NeuralTerminal analysis={traceResult?.cnn_analysis || null} isAnalyzing={isTracing} />
                                </div>
                            </motion.div>
                        )}

                        {/* Takedown Queue */}
                        {activePanel === 'takedown' && (
                            <motion.div key="takedown" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Takedown Queue</h2>
                                    <p className="text-[10px] text-slate-500">Submit official removal requests directly to each platform's Trust & Safety teams.</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {TAKEDOWN_PLATFORMS.map(p => (
                                        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-between gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blood/20 transition-all group"
                                        >
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-widest block mb-1">{p.name}</span>
                                                <span className="text-[9px] text-slate-500">{p.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto mt-3 sm:mt-0 justify-between sm:justify-end border-t sm:border-none border-white/5 pt-3 sm:pt-0">
                                                <span className={cn("text-[8px] px-2 sm:px-3 py-1 rounded-full border font-bold uppercase", p.severity === 'CRITICAL' ? 'border-blood/40 text-blood' : p.severity === 'HIGH' ? 'border-amber-500/40 text-amber-400' : 'border-slate-500/40 text-slate-400')}>{p.severity}</span>
                                                <ExternalLink size={14} className="text-slate-600 group-hover:text-blood transition-colors" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Arrest Report — Real LLM Data */}
                        {activePanel === 'report' && (() => {
                            const ir = traceResult?.investigation_report;
                            const o = traceResult?.osint_report;
                            const hasTrace = ir || o;
                            return (
                                <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black uppercase tracking-tighter">Arrest Report</h2>
                                        {ir?.fir_narrative && <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest bg-green-900/20 border border-green-500/20 px-3 py-1.5 rounded-full">✓ AI-Generated Narrative</span>}
                                    </div>

                                    {!hasTrace ? (
                                        <div className="flex flex-col items-center gap-4 py-20 opacity-30 text-center">
                                            <FileText size={48} />
                                            <p className="text-xs font-mono uppercase tracking-widest">Run OSINT Trace first to generate FIR</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* FIR Narrative from LLM */}
                                            <div className="bg-red-950/20 border border-blood/20 rounded-3xl p-8">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <ShieldAlert size={20} className="text-blood" />
                                                    <span className="text-[10px] font-mono uppercase text-blood">FIR Narrative — Law Enforcement Use Only</span>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-blood/30 pl-4 italic">
                                                    {ir?.fir_narrative || `OSINT investigation completed on target ${o?.domain_intel?.domain || 'submitted media'}. ${o?.risk_summary?.length > 0 ? o.risk_summary[0] : ''} Immediate platform cooperation and data preservation requested.`}
                                                </p>
                                            </div>

                                            {/* Investigation Stats */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { label: "Evidence Strength", value: ir?.evidence_strength || 'MODERATE', highlight: ir?.evidence_strength === 'STRONG' || ir?.evidence_strength === 'CONCLUSIVE' },
                                                    { label: "Server Country", value: o?.ip_intel?.geolocation?.country || '—' },
                                                    { label: "Risk Flags", value: `${o?.risk_summary?.length || 0} Flags` },
                                                    { label: "Platform", value: o?.platform_detection?.name || 'Unknown' },
                                                ].map(item => (
                                                    <div key={item.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                                                        <span className="text-[8px] opacity-30 uppercase block mb-1">{item.label}</span>
                                                        <span className={cn("text-sm font-black", item.highlight ? 'text-blood' : '')}>{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Behavioral Analysis */}
                                            {ir?.behavioral_analysis && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <h4 className="text-[9px] font-mono uppercase opacity-40 mb-3">AI Behavioral Analysis</h4>
                                                    <p className="text-[12px] text-slate-300 leading-relaxed">{ir.behavioral_analysis}</p>
                                                </div>
                                            )}

                                            {/* Modus Operandi */}
                                            {ir?.modus_operandi && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <h4 className="text-[9px] font-mono uppercase opacity-40 mb-3">Modus Operandi</h4>
                                                    <p className="text-[12px] text-slate-300 leading-relaxed">{ir.modus_operandi}</p>
                                                    {ir.motivation_hypothesis && (
                                                        <div className="mt-3 pt-3 border-t border-white/5">
                                                            <span className="text-[8px] opacity-30 block mb-1">Motivation</span>
                                                            <p className="text-[11px] text-amber-300">{ir.motivation_hypothesis}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Investigative Leads */}
                                            {ir?.investigative_leads?.length > 0 && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <h4 className="text-[9px] font-mono uppercase opacity-40 mb-4">Investigative Leads (AI-Generated)</h4>
                                                    <ul className="flex flex-col gap-2">
                                                        {ir.investigative_leads.map((lead: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-[11px] text-slate-300">
                                                                <span className="text-[9px] font-mono text-blood mt-0.5 shrink-0">{String(i+1).padStart(2,'0')}</span>{lead}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Recommended Interventions */}
                                            {ir?.recommended_interventions?.length > 0 && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                    <h4 className="text-[9px] font-mono uppercase opacity-40 mb-4">Recommended Law Enforcement Actions</h4>
                                                    <ul className="flex flex-col gap-2">
                                                        {ir.recommended_interventions.map((r: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-[11px] text-slate-300">
                                                                <ShieldAlert size={12} className="text-blood mt-0.5 shrink-0" />{r}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <button onClick={handleDownloadFIR}
                                                className="w-full bg-blood hover:bg-red-700 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_-10px_rgba(180,0,30,0.5)] transition-all">
                                                <Download size={16} />Download Official FIR Report
                                            </button>
                                            {reportGenerated && (
                                                <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-mono">
                                                    <CheckCircle size={14} />FIR report generated with real investigation data.
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default InvestigatorPortal;
