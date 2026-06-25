import React, { useState, useEffect, useRef } from 'react';
import DentalDashboard from './components/DentalDashboard';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  Settings, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  Tv, 
  RefreshCw, 
  Sliders, 
  Code, 
  Copy, 
  Download, 
  LayoutDashboard, 
  LogOut, 
  Clock, 
  Cpu, 
  Database, 
  Activity, 
  Terminal, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  Laptop,
  Check,
  Sun,
  Moon
} from 'lucide-react';

// Sample background videos for users to choose from
const SAMPLE_VIDEOS = [
  {
    id: 'laser',
    name: 'Cyber Abstract Laser',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32124-large.mp4',
    category: 'Cyberpunk'
  },
  {
    id: 'digital',
    name: 'Digital Nodes Grid',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-particles-in-blue-background-34305-large.mp4',
    category: 'Data Tech'
  },
  {
    id: 'circuit',
    name: 'Abstract Connection Lines',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-tech-digital-connection-circuit-background-42174-large.mp4',
    category: 'Hardware'
  },
  {
    id: 'coding',
    name: 'Matrix Code Stream',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-green-code-lines-background-34281-large.mp4',
    category: 'Terminal'
  }
];

export default function App() {
  // App Phase State
  // 'intro' -> playing the 10s video
  // 'locked' -> screen blurred, password prompt active
  // 'unlocked' -> dashboard fully revealed
  const [phase, setPhase] = useState<'intro' | 'locked' | 'unlocked'>('intro');

  // Video and gate configurations
  const [videoUrl, setVideoUrl] = useState<string>(SAMPLE_VIDEOS[0].url);
  const [customPassword, setCustomPassword] = useState<string>('admin');
  const [videoDuration, setVideoDuration] = useState<number>(10); // in seconds
  const [blurIntensity, setBlurIntensity] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('xl');
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Active status / playback states
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Clock
  const [currentTime, setCurrentTime] = useState<string>('');

  // Dashboard configuration / tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'sandbox' | 'config'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Theme support
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('arka-dental-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('arka-dental-theme', next);
    addLog(`Changed aesthetic appearance to: ${next.toUpperCase()} theme mode.`);
  };

  // Sandbox user custom HTML
  const [pastedHtml, setPastedHtml] = useState<string>(`<!-- YOUR CUSTOM DASHBOARD HTML HERE -->
<div class="p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md max-w-4xl mx-auto my-12 text-center">
  <div class="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
    <svg class="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </div>
  <h1 class="text-4xl font-extrabold text-white tracking-tight mb-4">
    My Beautiful Dashboard
  </h1>
  <p class="text-zinc-400 max-w-md mx-auto mb-8">
    This custom HTML panel is active! Paste your own HTML layout inside the sandbox tab to render it instantly inside the secure wrapper.
  </p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
    <div class="p-6 bg-zinc-950/50 border border-zinc-800 rounded-xl">
      <div class="text-xs text-zinc-500 uppercase font-bold tracking-wider">Active Users</div>
      <div class="text-3xl font-extrabold text-zinc-100 mt-2">1,248</div>
      <div class="text-xs text-green-400 mt-1">↑ 12% vs yesterday</div>
    </div>
    <div class="p-6 bg-zinc-950/50 border border-zinc-800 rounded-xl">
      <div class="text-xs text-zinc-500 uppercase font-bold tracking-wider">Storage Load</div>
      <div class="text-3xl font-extrabold text-zinc-100 mt-2">42.8 GB</div>
      <div class="text-xs text-zinc-400 mt-1">68% capacity filled</div>
    </div>
    <div class="p-6 bg-zinc-950/50 border border-zinc-800 rounded-xl">
      <div class="text-xs text-zinc-500 uppercase font-bold tracking-wider">API Requests</div>
      <div class="text-3xl font-extrabold text-zinc-100 mt-2">99.98%</div>
      <div class="text-xs text-indigo-400 mt-1">Healthy gateway</div>
    </div>
  </div>

  <div class="flex flex-wrap items-center justify-center gap-4">
    <button onclick="alert('Action triggered from custom HTML!')" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-medium rounded-lg text-sm cursor-pointer shadow-lg shadow-indigo-600/20">
      Interactive Action
    </button>
    <a href="#" class="text-indigo-400 hover:text-indigo-300 font-semibold text-sm inline-flex items-center gap-1">
      Learn more statistics &rarr;
    </a>
  </div>
</div>`);

  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);

  // Interactive logs output inside locked and dashboard phases
  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev.slice(-30), `[${timestamp}] ${msg}`]);
  };

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Sync Timer with Configured Video Duration
  useEffect(() => {
    if (phase === 'intro') {
      setTimeLeft(videoDuration);
    }
  }, [videoDuration, phase]);

  // Autoplay intro video timer loop
  useEffect(() => {
    if (phase !== 'intro') return;

    addLog(`Autoplay initiated: Loading intro video (${videoDuration}s)...`);
    addLog(`Mute state: ${isMuted ? 'Muted (Standard browser auto-play policy)' : 'Unmuted'}`);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => {
        addLog(`Autoplay warning: Browser blocked default audio. Playing muted.`);
        setIsMuted(true);
      });
    }

    // Failsafe timer (ticks down every 1 second)
    timerRef.current = setInterval(() => {
      if (isPaused) return;
      
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          triggerTransitionToLock();
          return 0;
        }
        
        // Dynamic logs as the video plays
        if (next === 7) addLog("Authenticating secure sandbox handshake...");
        if (next === 4) addLog("Handshake verified. Establishing secure viewport bounds...");
        if (next === 2) addLog("Pre-blur transition buffer armed...");
        
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isPaused, videoDuration, videoUrl]);

  // Handle video element time update to align time remaining with real video time
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || isPaused) return;
    const duration = videoRef.current.duration || videoDuration;
    const current = videoRef.current.currentTime;
    
    // Calculate fractional time left if the video is loaded
    if (duration > 0) {
      const calcTimeLeft = Math.max(0, videoDuration - Math.floor(current));
      if (calcTimeLeft !== timeLeft && calcTimeLeft >= 0) {
        setTimeLeft(calcTimeLeft);
      }
    }
  };

  const handleVideoEnded = () => {
    addLog("Intro video playback finished natively.");
    triggerTransitionToLock();
  };

  const triggerTransitionToLock = () => {
    addLog("Video completed. Engaging hardware-enforced backdrop blur gate.");
    setPhase('locked');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Toggle Play/Pause during intro
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
        addLog("Resumed video playback.");
      } else {
        videoRef.current.pause();
        addLog("Paused video playback.");
      }
    }
    setIsPaused(!isPaused);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
    addLog(`Sound ${!isMuted ? 'muted' : 'unmuted'}.`);
  };

  // Handle Password verification
  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (enteredPassword === customPassword) {
      setIsSuccessUnlocked(true);
      setPasswordError(false);
      addLog("ACCESS GRANTED: User authenticated successfully.");
      
      // Delay transition for gorgeous unlock anim
      setTimeout(() => {
        setPhase('unlocked');
        setIsSuccessUnlocked(false);
        setEnteredPassword('');
      }, 800);
    } else {
      setPasswordError(true);
      addLog("ACCESS DENIED: Invalid password attempt recorded.");
      setEnteredPassword('');
      
      // Reset shake animation after 500ms
      setTimeout(() => {
        setPasswordError(false);
      }, 600);
    }
  };

  // Keypad helper
  const handleKeypadPress = (val: string) => {
    if (val === 'CLEAR') {
      setEnteredPassword('');
    } else if (val === 'ENTER') {
      handlePasswordSubmit();
    } else {
      if (enteredPassword.length < 20) {
        setEnteredPassword(prev => prev + val);
      }
    }
  };

  // Export full React wrapper code with user state configured
  const getFullCodeToCopy = () => {
    return `import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Eye, EyeOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function SecureDashboard() {
  const [phase, setPhase] = useState<'intro' | 'locked' | 'unlocked'>('intro');
  const [timeLeft, setTimeLeft] = useState(${videoDuration});
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isMuted, setIsMuted] = useState(${isMuted});
  
  const videoRef = useRef(null);

  useEffect(() => {
    if (phase !== 'intro') return;

    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsMuted(true);
      });
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('locked');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const handlePasswordSubmit = (e) => {
    if (e) e.preventDefault();
    if (enteredPassword === '${customPassword}') {
      setPhase('unlocked');
    } else {
      setPasswordError(true);
      setEnteredPassword('');
      setTimeout(() => setPasswordError(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden font-sans relative">
      {/* 1. INTRO VIDEO PHASE */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-all duration-1000">
          <video 
            ref={videoRef}
            src="${videoUrl}"
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={() => setPhase('locked')}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
          
          {/* HUD Content Overlay */}
          <div className="relative z-10 text-center px-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs tracking-widest text-indigo-300 uppercase mb-4 animate-pulse">
              System Loading Setup
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Initializing Workspace...</h2>
            
            {/* Dynamic Countdown */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center rounded-full border-4 border-indigo-500/20 bg-black/60 backdrop-blur-md mb-8">
              <span className="text-4xl font-extrabold text-white font-mono">{timeLeft}s</span>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (videoRef.current) videoRef.current.muted = !isMuted;
                }}
                className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur border border-zinc-700 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-2"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button 
                onClick={() => setPhase('locked')}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                Skip Intro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECURITY PASSWORD GATE (BLURRED SCREEN) */}
      {phase === 'locked' && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          {/* Blurred Background Preview */}
          <div className="absolute inset-0 -z-10 filter blur-[32px] scale-105 opacity-30">
            <video src="${videoUrl}" autoPlay muted loop className="w-full h-full object-cover" />
          </div>

          <div className={\`w-full max-w-md bg-[#141419]/90 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl transition-all duration-300 \${passwordError ? 'animate-shake' : ''}\`}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Workspace Locked</h2>
              <p className="text-sm text-zinc-400 mb-8">Password verification is required to reveal custom indicators.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="Enter Passcode..."
                  className="w-full px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center font-mono text-lg tracking-widest text-white outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs text-red-400 text-center font-semibold animate-pulse">
                  Authentication failed. Please check password configuration.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all rounded-xl font-bold text-white cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                Authenticate Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. UNLOCKED STATE (REVEALS CUSTOM HTML) */}
      {phase === 'unlocked' && (
        <div className="animate-fade-in">
          {/* YOUR CUSTOM HTML DIRECTLY RENDERED */}
          <div dangerouslySetInnerHTML={{ __html: \`${pastedHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
        </div>
      )}
    </div>
  );
}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Blur Class conversion helper
  const getBlurClass = () => {
    switch (blurIntensity) {
      case 'sm': return 'backdrop-blur-sm';
      case 'md': return 'backdrop-blur-md';
      case 'lg': return 'backdrop-blur-lg';
      case 'xl': return 'backdrop-blur-xl';
      case '2xl': return 'backdrop-blur-3xl';
      default: return 'backdrop-blur-xl';
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden font-sans relative">
      
      {/* ========================================================= */}
      {/* 1. INTRO AUTOPLAYING VIDEO LAYER                         */}
      {/* ========================================================= */}
      {phase === 'intro' && (
        <div id="intro-layer" className="fixed inset-0 z-50 bg-[#09090b] flex flex-col justify-between p-6 md:p-12 transition-all duration-1000">
          
          {/* Subtle background placeholder grid to avoid full dark screen if network slow */}
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          {/* The actual MP4 Autoplaying holder */}
          <video 
            ref={videoRef}
            src={videoUrl}
            autoPlay
            muted={isMuted}
            playsInline
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnded}
            className="absolute inset-0 w-full h-full object-cover opacity-75 -z-10 transition-opacity duration-1000"
          />

          {/* Deep dark vignetting overlays to make text content completely high contrast and readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-transparent to-[#09090b]/95 -z-10" />

          {/* HUD Header */}
          <div className="w-full flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 animate-ping" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white uppercase tracking-widest font-display">System Autoplay Node</span>
                <span className="text-[10px] text-zinc-400 font-mono">ID: SECURE_CORE_0x892A</span>
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <span className="text-xs font-mono px-2 py-1 bg-white/5 border border-white/10 rounded text-zinc-300 hidden sm:inline">
                {currentTime || "00:00:00"}
              </span>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider">
                10s Video Gate
              </span>
            </div>
          </div>

          {/* HUD Mid-Section: Focus Countdown Display */}
          <div className="max-w-2xl mx-auto text-center my-auto py-12 relative z-10 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 backdrop-blur-md rounded-full border border-indigo-500/20 text-xs tracking-widest text-indigo-300 uppercase mb-4 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Initializing Premium Dashboard
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 font-display">
              Elevating Digital State
            </h1>

            <p className="text-sm md:text-base text-zinc-300 max-w-lg mx-auto mb-10 leading-relaxed font-sans">
              Watch the 10-second visualization of our secure stack load. The dashboard will automatically lock with backdrop blurs once initialized.
            </p>

            {/* Circular Countdown Tracker */}
            <div className="relative w-36 h-36 mx-auto mb-10 flex items-center justify-center">
              {/* Spinning decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 animate-[spin_20s_linear_infinite]" />
              
              {/* Dynamic countdown count */}
              <div className="w-28 h-28 rounded-full bg-zinc-950/90 border border-zinc-800 flex flex-col items-center justify-center shadow-2xl relative">
                <span className="text-4xl font-extrabold text-indigo-400 font-mono leading-none">{timeLeft}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">seconds</span>
              </div>
            </div>

            {/* Autoplay Warning if Muted */}
            {isMuted && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs mx-auto mb-6">
                <span>🔊 Autoplay is muted for browser policy compatibility.</span>
                <button 
                  onClick={toggleMute}
                  className="underline font-bold hover:text-white cursor-pointer active:scale-95"
                >
                  Click to Unmute
                </button>
              </div>
            )}
          </div>

          {/* HUD Footer: Playback Status Bar & Controls */}
          <div className="w-full space-y-6 relative z-10">
            {/* Custom progress linear track */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>STAGE: COGNITIVE_INITIALIZATION_LOOP</span>
                <span>{Math.round(((videoDuration - timeLeft) / videoDuration) * 100)}% COMPLETE</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${((videoDuration - timeLeft) / videoDuration) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                  id="btn-toggle-play"
                  onClick={togglePlayPause}
                  className="p-3 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/10 rounded-full text-white transition-all cursor-pointer shadow-lg"
                  title={isPaused ? "Resume video timer" : "Pause video timer"}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                </button>

                {/* Mute Button */}
                <button
                  id="btn-toggle-mute"
                  onClick={toggleMute}
                  className="p-3 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/10 rounded-full text-white transition-all cursor-pointer shadow-lg"
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="text-left">
                  <div className="text-xs text-zinc-400">Current MP4 Source:</div>
                  <div className="text-[11px] text-zinc-300 font-mono max-w-[200px] md:max-w-xs truncate" title={videoUrl}>
                    {videoUrl.split('/').pop() || videoUrl}
                  </div>
                </div>
              </div>

              {/* Skip Intro Trigger */}
              <button
                id="btn-skip-intro"
                onClick={triggerTransitionToLock}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                Skip Video &amp; Lock Screen
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SECURITY GATE (PASSWORD REQUEST AND BACKDROP BLUR)    */}
      {/* ========================================================= */}
      {phase === 'locked' && (
        <div id="locked-layer" className="fixed inset-0 z-40 frosted-gradient flex flex-col items-center justify-center p-4">
          
          {/* Blurred Background Preview of the active video or dashboard */}
          <div className="absolute inset-0 -z-10 filter blur-[40px] scale-110 opacity-30 transition-all duration-1000">
            {/* Run background video silently to give beautiful responsive visual depth behind the blur */}
            <video 
              src={videoUrl} 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
            />
          </div>

          {/* The Passcode Container Box with Shake Animation on Error */}
          <div 
            id="passcode-card"
            className={`w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-[40px] shadow-2xl rounded-[40px] p-8 md:p-10 text-center transition-all duration-300 ${
              passwordError ? 'animate-shake border-red-500/50' : ''
            } ${isSuccessUnlocked ? 'scale-95 opacity-50 border-green-500/50' : ''}`}
          >
            {/* Success Shield Glow */}
            {isSuccessUnlocked ? (
              <div className="w-16 h-16 bg-white/25 text-white rounded-full flex items-center justify-center mx-auto mb-8 border border-white/40 animate-pulse">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30">
                <Lock className="w-8 h-8" />
              </div>
            )}

            <h2 className="text-2xl font-light text-white tracking-tight mb-2">
              {isSuccessUnlocked ? "ACCESS PERMITTED" : "Access Required"}
            </h2>
            
            <p className="text-white/50 text-sm mb-8 text-center px-4">
              {isSuccessUnlocked 
                ? "Decrypting system core files..." 
                : "The dashboard is locked. Enter your administrative password to proceed."}
            </p>

            {/* Input Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
              <label className="block text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium font-mono">
                System Passcode
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4.5 text-white/30">
                  <KeyRound className="w-5 h-5" />
                </span>
                <input
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border ${
                    passwordError ? 'border-red-500/50 text-red-200' : 'border-white/10'
                  } rounded-2xl text-center font-mono text-xl tracking-widest text-white placeholder-white/20 outline-none focus:border-white/40 focus:ring-0 transition-all`}
                  disabled={isSuccessUnlocked}
                  autoFocus
                />
                <button
                  type="button"
                  id="btn-toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-white/30 hover:text-white cursor-pointer p-1 rounded hover:bg-white/5"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Validation helper line */}
              <div className="flex items-center justify-between min-h-[1.5rem] px-1 text-xs">
                {passwordError ? (
                  <span className="text-red-400 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Incorrect Passcode. Retry.
                  </span>
                ) : (
                  <span className="text-white/30 font-mono">
                    Hint: Default is <strong className="text-white/60 font-mono">{customPassword}</strong>
                  </span>
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPassword(customPassword);
                    addLog("Autofilled correct credential from hint.");
                  }}
                  className="text-white/40 hover:text-white/70 font-semibold cursor-pointer text-[11px]"
                >
                  Autofill Hint
                </button>
              </div>

              {/* Premium Visual Keypad for futuristic touch controls */}
              <div className="grid grid-cols-3 gap-2 pt-2 pb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypadPress(num)}
                    className="py-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-white/80 font-mono font-bold rounded-xl transition-all text-sm cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleKeypadPress('CLEAR')}
                  className="py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono font-semibold rounded-xl transition-all text-xs cursor-pointer"
                >
                  CLR
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="py-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-white/80 font-mono font-bold rounded-xl transition-all text-sm cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('ENTER')}
                  className="py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-mono font-bold rounded-xl transition-all text-xs cursor-pointer"
                >
                  ENT
                </button>
              </div>

              <div className="flex gap-3">
                {/* Reset Intro Option */}
                <button
                  type="button"
                  onClick={() => {
                    addLog("Replaying video sequences.");
                    setPhase('intro');
                    setTimeLeft(videoDuration);
                    setEnteredPassword('');
                  }}
                  className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 text-xs font-semibold rounded-2xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-white/60" />
                  Replay Intro
                </button>

                {/* Primary Unlock */}
                <button
                  type="submit"
                  id="btn-unlock-dashboard"
                  disabled={isSuccessUnlocked}
                  className="flex-1 py-4 bg-white text-black hover:bg-opacity-90 active:scale-[0.98] transition-all disabled:bg-white/10 disabled:text-white/30 font-semibold text-xs rounded-2xl cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5 text-black" />
                  Unlock
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Status Bar matching design spec exactly */}
          <div className="absolute bottom-0 w-full p-6 flex justify-between items-center z-30">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">Secure Session Inactive</span>
            </div>
            <div className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium">
              Internal System v4.12.0
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CORE SECURE DASHBOARD & PLAYGROUND SANDBOX STATE       */}
      {/* ========================================================= */}
      {phase === 'unlocked' && (
        <div id="unlocked-layer" className="min-h-screen flex flex-col md:flex-row animate-fade-in frosted-gradient">
          
          {/* Sidebar Navigation */}
          {isSidebarOpen && (
            <aside id="sidebar" className="w-full md:w-64 bg-white/5 border-r border-white/10 backdrop-blur-[30px] flex flex-col justify-between shrink-0">
              <div>
                {/* Brand / Title */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/10">
                      <Tv className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold tracking-tight text-white">Secure Gate</h1>
                      <p className="text-[9px] text-white/40 uppercase font-mono font-bold">Unveiled Core</p>
                    </div>
                  </div>
                  
                  {/* Lock back button */}
                  <button
                    onClick={() => {
                      addLog("Dashboard locked manually by operator.");
                      setPhase('locked');
                    }}
                    className="p-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Lock Dashboard"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="p-4 space-y-1">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'overview' 
                        ? 'bg-white text-black shadow-lg shadow-black/10' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview Metrics
                  </button>

                  <button
                    onClick={() => setActiveTab('sandbox')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'sandbox' 
                        ? 'bg-white text-black shadow-lg shadow-black/10' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Code className="w-4 h-4 text-teal-300" />
                    My HTML Sandbox
                    <span className="ml-auto text-[8px] bg-teal-500/15 border border-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-mono uppercase">
                      New
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('config')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'config' 
                        ? 'bg-white text-black shadow-lg shadow-black/10' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-pink-300" />
                    Video &amp; Gate Config
                  </button>
                </nav>
              </div>

              {/* Status footer inside sidebar */}
              <div className="p-4 border-t border-white/10 bg-black/10">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-white/40">Security Guard</span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Active
                  </span>
                </div>
                
                {/* Rapid configuration overview info */}
                <div className="space-y-1.5 text-[10px] font-mono text-white/50 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/30">Password:</span>
                    <span className="text-white/70 font-bold">{customPassword}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Timer:</span>
                    <span className="text-white/70 font-bold">{videoDuration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Blur:</span>
                    <span className="text-white/70 font-bold uppercase">{blurIntensity}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addLog("Operator session terminated.");
                    setPhase('intro');
                    setTimeLeft(videoDuration);
                  }}
                  className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-red-400 border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Lock &amp; Replay Intro
                </button>
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-h-0 bg-transparent">
            
            {/* Main Header */}
            <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-[30px] px-6 flex items-center justify-between relative z-10 shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Toggle Sidebar"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-green-500/15 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase">
                    Unlocked
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                  title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-sky-400" />
                      <span className="hidden sm:inline">Dark Mode</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5 text-white/50 text-xs border-l border-white/10 pl-4 h-6">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="font-mono text-white/80 font-semibold">{currentTime || "00:00:00"}</span>
                </div>
                
                {/* Floating link to configure */}
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs rounded-lg font-bold cursor-pointer transition-all"
                >
                  <Code className="w-3.5 h-3.5" />
                  Paste HTML Here
                </button>
              </div>
            </header>

            {/* Content Switcher */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* TAB 1: OVERVIEW METRICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <DentalDashboard theme={theme} />

                  {/* Collapsible Admin & System Telemetry Logs */}
                  <details className="group border border-white/10 rounded-2xl bg-white/5 backdrop-blur-[20px] overflow-hidden">
                    <summary className="p-5 flex items-center justify-between cursor-pointer select-none list-none text-white/80 hover:text-white transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-white/60" />
                        <span className="text-xs font-semibold uppercase tracking-wider font-display">🔑 Operator System Telemetry &amp; Gate Logs</span>
                      </div>
                      <span className="text-xs text-white/40 transition-transform group-open:rotate-180">&darr;</span>
                    </summary>
                    <div className="p-5 border-t border-white/5 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                          <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">CPU Core Load</div>
                          <div className="text-xl font-light text-white font-mono mt-1">18.4%</div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                          <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Network Ingress</div>
                          <div className="text-xl font-light text-white font-mono mt-1">142.6 Mb/s</div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                          <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">System Memory</div>
                          <div className="text-xl font-light text-white font-mono mt-1">3.8 GB / 8.0</div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                          <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Gate Status</div>
                          <div className="text-xl font-light text-white font-mono mt-1">{videoDuration}s Locked</div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                          <span className="text-[10px] font-semibold uppercase text-white/60 font-mono">Decryption Activity Stream</span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setLogMessages([]);
                            }} 
                            className="text-[9px] text-white/40 hover:text-white cursor-pointer font-bold uppercase transition-colors"
                          >
                            Clear Output
                          </button>
                        </div>
                        <div 
                          ref={logsContainerRef}
                          className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs text-white/70 h-48 overflow-y-auto space-y-2 mt-3 select-text"
                        >
                          {logMessages.length === 0 ? (
                            <div className="text-white/30 italic text-center py-8">No event logs recorded.</div>
                          ) : (
                            logMessages.map((log, idx) => (
                              <div key={idx} className="leading-relaxed">
                                <span className="text-white/40">&gt;</span> {log}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              )}

              {/* TAB 2: MY HTML SANDBOX PLAYGROUND */}
              {activeTab === 'sandbox' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Code className="w-6 h-6 text-white/80" />
                        <h2 className="text-2xl font-light text-white tracking-tight">My HTML Sandbox</h2>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        Paste your custom HTML dashboard code directly in the code editor, and see how the 10-second MP4 player and blur lock gate protects it.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => copyToClipboard(getFullCodeToCopy())}
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white/80 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copiedCode ? 'Copied React Code!' : 'Copy React Wrapper Code'}
                      </button>

                      <button
                        onClick={() => {
                          const code = getFullCodeToCopy();
                          const blob = new Blob([code], { type: 'text/plain' });
                          const element = document.createElement('a');
                          element.href = URL.createObjectURL(blob);
                          element.download = 'SecureDashboard.tsx';
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                          addLog("Downloaded React implementation file.");
                        }}
                        className="px-4 py-2 bg-white text-black hover:bg-opacity-90 text-xs font-semibold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Left Panel: HTML Code Input Editor */}
                    <div className="flex flex-col p-5 bg-white/5 border border-white/10 backdrop-blur-[20px] rounded-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-white/60" />
                          <span className="text-xs font-semibold text-white uppercase tracking-widest font-mono">Paste Your Ready HTML</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setPastedHtml(`<!-- YOUR CUSTOM DASHBOARD HTML HERE -->
<div class="p-8 bg-white/5 border border-white/10 rounded-2xl text-center backdrop-blur-md">
  <h1 class="text-3xl font-light text-white mb-2">Simulated Secure Terminal</h1>
  <p class="text-xs text-white/40">Time Unlocked: ${new Date().toLocaleTimeString()}</p>
  <div class="my-6 p-4 bg-white/5 rounded-xl border border-white/10 text-left font-mono text-xs text-white/70">
    <span class="text-white/40">system@dashboard:~$</span> fetch-telemetry --auth-success<br/>
    <span class="text-white/40">Decrypting telemetry package... OK</span><br/>
    <span class="text-white/40 font-bold">Secure handshakes verified inside Frosted Glass interface.</span>
  </div>
</div>`);
                              addLog("Loaded alternate custom HTML template.");
                            }}
                            className="text-[10px] text-white/40 hover:text-white cursor-pointer hover:underline font-semibold font-mono"
                          >
                            Load Alt Template
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex-1 flex flex-col space-y-2">
                        <span className="text-[10px] text-white/40 font-mono">
                          Supports standard Tailwind utility classes, inline event handlers, and responsive CSS wrappers.
                        </span>
                        
                        <textarea
                          id="html-sandbox-textarea"
                          value={pastedHtml}
                          onChange={(e) => {
                            setPastedHtml(e.target.value);
                          }}
                          placeholder="<!-- Paste your custom dashboard HTML layout here... -->"
                          className="w-full flex-1 min-h-[350px] p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-white placeholder-white/20 outline-none focus:border-white/30 focus:ring-0 transition-all select-text"
                        />
                      </div>
                    </div>

                    {/* Right Panel: Live Sandboxed Sandbox Render */}
                    <div className="flex flex-col p-5 bg-white/5 border border-white/10 backdrop-blur-[20px] rounded-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-white/60" />
                          <span className="text-xs font-semibold text-white uppercase tracking-widest font-mono">Live Sandbox Render</span>
                        </div>
                        <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" /> Real-time Sync
                        </span>
                      </div>

                      {/* Rendering container */}
                      <div className="mt-4 flex-1 bg-white/5 border border-white/10 rounded-xl p-4 overflow-y-auto max-h-[500px]">
                        {pastedHtml.trim() ? (
                          <div 
                            id="sandbox-rendered-content"
                            className="w-full animate-fade-in text-white"
                            dangerouslySetInnerHTML={{ __html: pastedHtml }} 
                          />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-12 text-white/30">
                            <Code className="w-12 h-12 mb-4 text-white/20 animate-pulse" />
                            <h4 className="text-sm font-semibold text-white/50">Sandbox Empty</h4>
                            <p className="text-xs text-white/40 max-w-xs mt-1">Paste your dashboard HTML layout in the left text editor to see it appear right here instantly.</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Flow guide cards */}
                  <div className="p-5 bg-white/5 border border-white/10 backdrop-blur-[10px] rounded-2xl">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">How does this 10s video and password lock work?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-white/50">
                      <div className="space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center font-mono text-[10px]">1</span>
                          Autoplay Sequence
                        </div>
                        <p>When someone loads this page, the video plays muted automatically. A circular countdown ticks from 10 seconds. You can unmute or pause the sequence at any time.</p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center font-mono text-[10px]">2</span>
                          Smooth Blur Gate
                        </div>
                        <p>At 10 seconds, the screen transitions smoothly with a backdrop-blur. A custom security dialog appears in the center, prompting for your passcode.</p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center font-mono text-[10px]">3</span>
                          Dashboard Revealed
                        </div>
                        <p>Typing the correct passcode fades the gate away completely, revealing your pasted HTML dashboard safely! Try re-locking with the padlock icon anytime to test it.</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: VIDEO & GATE CONFIGURATION */}
              {activeTab === 'config' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div>
                    <h2 className="text-2xl font-light text-white tracking-tight">Video &amp; Gate Configuration</h2>
                    <p className="text-xs text-white/40 mt-1">
                      Customize credentials, blur amount, video duration, and media sources in real-time.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 backdrop-blur-[20px] rounded-2xl p-6 space-y-6">
                    
                    {/* Security Passcode */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-white uppercase tracking-widest font-mono">
                        Secure Dashboard Passcode
                      </label>
                      <input
                        id="config-password-input"
                        type="text"
                        value={customPassword}
                        onChange={(e) => {
                          setCustomPassword(e.target.value);
                          addLog(`Passcode modified to: "${e.target.value}"`);
                        }}
                        placeholder="admin"
                        className="w-full max-w-sm px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm tracking-wider focus:border-white/30 outline-none transition-all"
                      />
                      <span className="block text-[11px] text-white/40">
                        Default password is <strong className="text-white/60">"admin"</strong>. Change this to secure your dashboard view.
                      </span>
                    </div>

                    <hr className="border-white/10" />

                    {/* Timer Duration */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-white uppercase tracking-widest font-mono">
                        Intro Video Playback Duration
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          id="config-duration-slider"
                          type="range"
                          min="3"
                          max="30"
                          value={videoDuration}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setVideoDuration(val);
                            addLog(`Intro playback time adjusted to: ${val}s`);
                          }}
                          className="w-full max-w-xs accent-white"
                        />
                        <span className="text-sm font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                          {videoDuration} Seconds
                        </span>
                      </div>
                      <span className="block text-[11px] text-white/40">
                        The video plays for this duration before automatically locking. Adjust to test short (e.g. 3s) or long sequences.
                      </span>
                    </div>

                    <hr className="border-white/10" />

                    {/* Backdrop Blur Intensity */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-white uppercase tracking-widest font-mono">
                        Backdrop Blur Intensity
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              setBlurIntensity(lvl);
                              addLog(`Blur filter set to: ${lvl}`);
                            }}
                            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                              blurIntensity === lvl 
                                ? 'bg-white text-black font-semibold' 
                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                            }`}
                          >
                            {lvl === 'sm' && 'Light (sm)'}
                            {lvl === 'md' && 'Medium (md)'}
                            {lvl === 'lg' && 'Dense (lg)'}
                            {lvl === 'xl' && 'Ultra (xl)'}
                            {lvl === '2xl' && 'Total (2xl)'}
                          </button>
                        ))}
                      </div>
                      <span className="block text-[11px] text-white/40">
                        Specifies the CSS filter strength applied to the dashboard view behind the password screen.
                      </span>
                    </div>

                    <hr className="border-white/10" />

                    {/* MP4 Background Selector */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-white uppercase tracking-widest font-mono">
                        Autoplay MP4 Background Video Source
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SAMPLE_VIDEOS.map((vid) => (
                          <button
                            key={vid.id}
                            type="button; "
                            onClick={() => {
                              setVideoUrl(vid.url);
                              addLog(`Swapped default video theme to: ${vid.name}`);
                            }}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-center group ${
                              videoUrl === vid.url 
                                ? 'bg-white/10 border-white/30 text-white' 
                                : 'bg-white/5 border-white/10 text-white/55 hover:text-white hover:border-white/20'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-semibold">{vid.name}</div>
                              <span className="text-[9px] font-mono font-semibold text-white/30 uppercase tracking-wider block mt-1">
                                {vid.category} Source
                              </span>
                            </div>
                            {videoUrl === vid.url && <Check className="w-4 h-4 text-white shrink-0" />}
                          </button>
                        ))}
                      </div>

                      {/* Custom Video input */}
                      <div className="space-y-2 pt-2">
                        <span className="block text-[11px] text-white/40 font-bold font-mono uppercase">
                          Or input custom MP4 Link:
                        </span>
                        <div className="flex gap-2">
                          <input
                            id="custom-video-input"
                            type="url"
                            value={videoUrl}
                            onChange={(e) => {
                              setVideoUrl(e.target.value);
                              addLog(`Configured custom video URL: "${e.target.value}"`);
                            }}
                            placeholder="https://example.com/video.mp4"
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-white/30 transition-all"
                          />
                        </div>
                        <span className="block text-[11px] text-white/40">
                          Provide any valid public direct MP4 video link.
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Reset Flow Preview trigger */}
                  <div className="p-5 bg-white/10 border border-white/20 backdrop-blur-[20px] text-white rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Test Your Changes</h4>
                      <p className="text-xs text-white/60">Replay the full sequence now to test your configured password and video.</p>
                    </div>

                    <button
                      onClick={() => {
                        addLog("Initiating testing sequence with active config...");
                        setPhase('intro');
                        setTimeLeft(videoDuration);
                      }}
                      className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap hover:bg-opacity-90"
                    >
                      Replay &amp; Lock Now
                    </button>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      )}

    </div>
  );
}
