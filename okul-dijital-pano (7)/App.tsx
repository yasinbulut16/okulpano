
import React, { useState, useEffect } from 'react';
import { AppSettings, ScreenMode, DaySession } from './types';
import { DEFAULT_SETTINGS } from './constants';
import Board from './components/Board';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('school_pano_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [mode, setMode] = useState<ScreenMode>('board');
  const [currentSession, setCurrentSession] = useState<DaySession>('morning');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('school_pano_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const [sh, sm] = settings.switchTime.split(':').map(Number);
      const switchMinutes = sh * 60 + sm;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      setCurrentSession(currentMinutes >= switchMinutes ? 'afternoon' : 'morning');
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.switchTime]);

  // Android TV Kumanda Desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 'm' tuşu veya kumanda menü tuşu
      if (e.key.toLowerCase() === 'm' || e.key === 'Menu' || e.key === 'Settings' || e.key === 'F1') {
        setMode(prev => prev === 'board' ? 'settings' : 'board');
      }
      // Geri tuşu (Back) ile ana ekrana dön
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'BrowserBack') {
        if (mode === 'settings') {
          setMode('board');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const handleSave = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setMode('board');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white overflow-hidden flex flex-col selection:bg-blue-500 selection:text-white">
      {mode === 'board' ? (
        <div className="relative flex-1">
          <Board 
            settings={settings} 
            session={currentSession} 
            time={currentTime} 
          />
          
          {/* AYARLAR MENÜSÜ TETİKLEYİCİSİ */}
          <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-2 group">
            <button 
              onClick={() => setMode('settings')}
              className="bg-white/5 hover:bg-blue-600 focus:bg-blue-600 border border-white/10 p-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 backdrop-blur-md group-hover:scale-110"
              title="Ayarlar Menüsünü Aç"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Ayarlar için 'M' Tuşu
            </span>
          </div>
        </div>
      ) : (
        <Settings 
          settings={settings} 
          onSave={handleSave} 
          onCancel={() => setMode('board')} 
        />
      )}
    </div>
  );
};

export default App;
