/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Audio Utility using Web Audio API
const playBeep = (count: number) => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const beep = (delay: number) => {
    setTimeout(() => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    }, delay);
  };

  for (let i = 0; i < count; i++) {
    beep(i * 300);
  }
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSetup, setIsSetup] = useState<boolean>(true);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  
  // Chime settings (in minutes)
  const [chime1, setChime1] = useState<number>(() => {
    const saved = localStorage.getItem('chime1');
    return saved !== null ? parseInt(saved) : 3;
  });
  const [chime2, setChime2] = useState<number>(() => {
    const saved = localStorage.getItem('chime2');
    return saved !== null ? parseInt(saved) : 1;
  });
  const [chime3, setChime3] = useState<number>(() => {
    const saved = localStorage.getItem('chime3');
    return saved !== null ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('chime1', chime1.toString());
    localStorage.setItem('chime2', chime2.toString());
    localStorage.setItem('chime3', chime3.toString());
  }, [chime1, chime2, chime3]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastBeepedAt = useRef<number | null>(null);

  const startTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setIsActive(true);
    setIsSetup(false);
    lastBeepedAt.current = null;
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsSetup(true);
    setTimeLeft(0);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const togglePause = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playBeep(3); // End beep
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Audio Alerts Logic
  useEffect(() => {
    if (!isActive) return;

    // Chime 1 (Default 3m)
    const c1Seconds = chime1 * 60;
    if (timeLeft === c1Seconds && lastBeepedAt.current !== c1Seconds && c1Seconds > 0) {
      playBeep(1);
      lastBeepedAt.current = c1Seconds;
    }
    // Chime 2 (Default 1m)
    const c2Seconds = chime2 * 60;
    if (timeLeft === c2Seconds && lastBeepedAt.current !== c2Seconds && c2Seconds > 0) {
      playBeep(2);
      lastBeepedAt.current = c2Seconds;
    }
    // Chime 3 (Default 0m)
    const c3Seconds = chime3 * 60;
    if (timeLeft === c3Seconds && lastBeepedAt.current !== c3Seconds) {
      playBeep(3);
      lastBeepedAt.current = c3Seconds;
    }
  }, [timeLeft, isActive, chime1, chime2, chime3]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-600';
    if (timeLeft <= 60) return 'text-yellow-500';
    return 'text-white';
  };

  if (isSetup) {
    return (
      <div id="setup-container" className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono p-4">
        <h1 className="text-sm uppercase tracking-[0.5em] opacity-30 mb-12">Academic Timer</h1>
        
        <div className="flex flex-col sm:flex-row gap-8 mb-16">
          {[5, 10, 15, 20].map((m) => (
            <button
              key={m}
              id={`btn-${m}`}
              onClick={() => startTimer(m)}
              className="text-6xl font-bold hover:scale-110 transition-transform cursor-pointer border-b-2 border-transparent hover:border-white pb-2"
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity mb-16">
          <input
            id="custom-input"
            type="number"
            placeholder="Custom"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="bg-transparent border-b border-white/30 text-center w-20 focus:outline-none focus:border-white"
            onKeyDown={(e) => e.key === 'Enter' && customMinutes && startTimer(parseInt(customMinutes))}
          />
          <span className="text-xs uppercase">min</span>
        </div>

        {/* Chime Settings */}
        <div id="chime-settings" className="bg-white/5 p-6 rounded-2xl flex flex-col gap-4 w-full max-w-md border border-white/10">
          <h2 className="text-[10px] uppercase tracking-widest opacity-40 text-center mb-2">Chime Settings (Alert at min)</h2>
          <div className="flex justify-between items-center gap-4">
            {[
              { label: 'Chime 1 (1x)', value: chime1, setter: setChime1, id: 'chime-1' },
              { label: 'Chime 2 (2x)', value: chime2, setter: setChime2, id: 'chime-2' },
              { label: 'Chime 3 (3x)', value: chime3, setter: setChime3, id: 'chime-3' },
            ].map((chime) => (
              <div key={chime.id} className="flex flex-col items-center gap-2">
                <span className="text-[8px] opacity-50 uppercase">{chime.label}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => chime.setter(Math.max(0, chime.value - 1))}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold w-4 text-center">{chime.value}</span>
                  <button 
                    onClick={() => chime.setter(chime.value + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="timer-container"
      className="min-h-screen bg-black flex items-center justify-center select-none cursor-pointer overflow-hidden"
      onClick={togglePause}
      onDoubleClick={resetTimer}
    >
      <div 
        id="display"
        className={`font-mono font-bold text-[28vw] leading-none tracking-tighter tabular-nums transition-colors duration-500 ${getTimerColor()} ${!isActive ? 'opacity-50' : ''}`}
      >
        {formatTime(timeLeft)}
      </div>
      
      {!isActive && timeLeft > 0 && (
        <div className="absolute bottom-10 text-white/20 font-mono text-xs uppercase tracking-[1em]">
          Paused
        </div>
      )}
    </div>
  );
}
