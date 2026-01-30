
import React, { useState, useEffect, useMemo } from 'react';
import { AppSettings, DaySession } from './types';

interface BoardProps {
  settings: AppSettings;
  session: DaySession;
  time: Date;
}

const Board: React.FC<BoardProps> = ({ settings, session, time }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 12; // Ekranda aynı anda görünecek şube sayısı

  // 1. Mevcut Seansın (Sabah/Öğle) Ders Programını Al
  const fullSchedule = useMemo(() => {
    return session === 'morning' ? settings.morningSchedule : settings.afternoonSchedule;
  }, [session, settings]);

  // 2. Şu an Kaçıncı Dersteyiz? (Otomatik Tespit)
  const activeLessonNo = useMemo(() => {
    const nowMinutes = time.getHours() * 60 + time.getMinutes();
    const periods = session === 'morning' ? settings.morningPeriods : settings.afternoonPeriods;

    const currentPeriod = periods.find(p => {
      const [sh, sm] = p.start.split(':').map(Number);
      const [eh, em] = p.end.split(':').map(Number);
      return nowMinutes >= (sh * 60 + sm) && nowMinutes <= (eh * 60 + em);
    });

    return currentPeriod ? currentPeriod.number : null;
  }, [time, session, settings]);

  // 3. 41 Şube İçin Otomatik Kaydırma Döngüsü
  useEffect(() => {
    if (fullSchedule.length <= itemsPerPage) return;
    
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % Math.ceil(fullSchedule.length / itemsPerPage));
    }, 10000); // 10 saniyede bir değişir

    return () => clearInterval(interval);
  }, [fullSchedule]);

  // Ekranda gösterilecek dilim
  const visibleItems = fullSchedule.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="grid grid-cols-12 gap-6 p-8 h-screen overflow-hidden bg-slate-950">
      {/* SOL PANEL: DERS DAĞILIMI */}
      <div className="col-span-4 flex flex-col gap-4">
        <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/20">
          <h2 className="text-2xl font-bold text-white flex justify-between items-center">
            {activeLessonNo ? `${activeLessonNo}. Ders Dağılımı` : "Teneffüs / Ara"}
            <span className="text-sm bg-blue-500 px-3 py-1 rounded-full uppercase">
              {session === 'morning' ? 'Sabah' : 'Öğle'}
            </span>
          </h2>
        </div>
        
        <div className="flex flex-col gap-3 transition-all duration-500">
          {visibleItems.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center backdrop-blur-sm animate-in fade-in slide-in-from-left-4">
              <div>
                <div className="text-blue-400 font-bold text-lg">{item.className}</div>
                <div className="text-white/60 text-sm">{item.teacherName}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{item.subject}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sayfalandırma Noktaları */}
        <div className="flex gap-2 justify-center mt-auto pb-4">
          {Array.from({ length: Math.ceil(fullSchedule.length / itemsPerPage) }).map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-all ${page === i ? 'bg-blue-500 w-6' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* ORTA PANEL: SAAT VE SAYAÇ */}
      <div className="col-span-8 flex flex-col items-center justify-center text-center">
        <div className="text-[18vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
          {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-4xl font-light text-white/40 tracking-[1em] uppercase mt-[-2rem]">
          {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(time)}
        </div>
      </div>
    </div>
  );
};

export default Board;
