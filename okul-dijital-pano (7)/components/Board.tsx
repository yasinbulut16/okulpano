
import React from 'react';
import { AppSettings, DaySession, LessonTime, DutyTeacher, ClassSchedule, StudentBirthday } from '../types';

interface BoardProps {
  settings: AppSettings;
  session: DaySession;
  time: Date;
}

const Board: React.FC<BoardProps> = ({ settings, session, time }) => {
  const activeData = settings[session];
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { weekday: 'long' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getCurrentState = () => {
    const nowMinutes = time.getHours() * 60 + time.getMinutes();
    const nowSeconds = nowMinutes * 60 + time.getSeconds();

    let currentLesson: LessonTime | null = null;
    let nextLesson: LessonTime | null = null;
    let isBreak = false;
    let remaining = 0;
    let activeLessonNumber = 1;

    for (let i = 0; i < activeData.lessons.length; i++) {
      const lesson = activeData.lessons[i];
      const [sh, sm] = lesson.startTime.split(':').map(Number);
      const [eh, em] = lesson.endTime.split(':').map(Number);
      const startSec = (sh * 60 + sm) * 60;
      const endSec = (eh * 60 + em) * 60;

      if (nowSeconds >= startSec && nowSeconds < endSec) {
        currentLesson = lesson;
        remaining = endSec - nowSeconds;
        activeLessonNumber = i + 1;
        break;
      }

      if (nowSeconds < startSec) {
        nextLesson = lesson;
        isBreak = true;
        remaining = startSec - nowSeconds;
        activeLessonNumber = i + 1;
        break;
      }
    }

    return { currentLesson, nextLesson, isBreak, remaining, activeLessonNumber };
  };

  const { currentLesson, nextLesson, isBreak, remaining, activeLessonNumber } = getCurrentState();
  const currentDay = getDayName(time);

  const filteredDutyTeachers = activeData.dutyTeachers.filter(dt => dt.day === currentDay);
  const filteredSchedules = activeData.schedules.filter(s => s.lessonNumber === activeLessonNumber);

  // BUGÜN DOĞANLARI BUL
  const todayDDMM = `${time.getDate().toString().padStart(2, '0')}.${(time.getMonth() + 1).toString().padStart(2, '0')}`;
  const birthdayKids = (activeData.birthdays || []).filter(b => b.birthDate === todayDDMM);
  
  const birthdayMessage = birthdayKids.length > 0 
    ? `🎂 İYİ Kİ DOĞDUN: ${birthdayKids.map(b => b.name).join(', ')}! 🎂 • ` 
    : '';

  function getScrollingItems<T>(items: T[], minCount: number = 4): T[] {
    if (items.length === 0) return [];
    if (items.length < minCount) return items;
    return [...items, ...items];
  }

  return (
    <div className="h-screen flex flex-col p-6 gap-6 bg-slate-950 text-white overflow-hidden">
      {/* Üst Bilgi */}
      <div className="flex justify-between items-center bg-blue-900/20 border border-blue-500/30 p-8 rounded-[3rem] backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col">
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-2">
            {activeData.schoolName}
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-4 py-1 bg-blue-600 rounded-full text-sm font-black uppercase tracking-widest">
              {session === 'morning' ? 'SABAH GRUBU' : 'ÖĞLE GRUBU'}
            </span>
            <p className="text-xl text-blue-300 font-bold uppercase tracking-tight italic">
              {formatDate(time)}
            </p>
          </div>
        </div>
        <div className="text-8xl font-mono font-black tabular-nums bg-slate-900/80 px-12 py-6 rounded-[2rem] border border-white/5 shadow-inner">
          {formatTime(time).split(' ')[0]}
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sol Kolon (Daraltıldı: %25) */}
        <div className="w-1/4 flex flex-col gap-6">
          
          {/* Nöbetçi Alanı - Kayar Yapı */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 h-1/3 overflow-hidden flex flex-col">
            <h2 className="text-2xl font-black mb-6 flex items-center justify-between text-amber-500 border-b border-amber-500/20 pb-4">
               <span>🛡️ NÖBETÇİLER</span>
               <span className="text-xs bg-amber-500/20 px-3 py-1 rounded-full">{currentDay}</span>
            </h2>
            <div className="flex-1 relative overflow-hidden">
              <div className={`absolute w-full space-y-3 ${filteredDutyTeachers.length > 3 ? 'scroll-vertical' : ''}`}>
                {filteredDutyTeachers.length > 0 ? (
                  getScrollingItems(filteredDutyTeachers, 4).map((dt: DutyTeacher, idx) => (
                    <div key={`${dt.id}-${idx}`} className="bg-slate-800/40 p-5 rounded-2xl border border-amber-500/10 flex flex-col">
                      <span className="text-2xl font-black leading-tight">{dt.name}</span>
                      <span className="text-sm font-black text-amber-500/60 uppercase tracking-widest">{dt.location}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-10 italic">Nöbetçi girilmemiş.</div>
                )}
              </div>
            </div>
          </div>

          {/* Ders Akışı - Fontlar Büyütüldü */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 flex-1 overflow-hidden flex flex-col">
            <h2 className="text-2xl font-black mb-6 text-indigo-400 border-b border-indigo-400/20 pb-4 uppercase tracking-tighter">
               📋 {activeLessonNumber}. DERS DAĞILIMI
            </h2>
            <div className="flex-1 relative overflow-hidden">
              <div className="scroll-vertical absolute w-full space-y-4">
                {filteredSchedules.length > 0 ? (
                  getScrollingItems(filteredSchedules, 5).map((s: ClassSchedule, idx) => (
                    <div key={`${s.id}-${idx}`} className="bg-slate-800/20 p-5 rounded-2xl border border-slate-700/30 flex justify-between items-center transition-colors hover:bg-slate-700/30">
                      <div className="flex items-center gap-5">
                        <span className="w-20 h-14 flex items-center justify-center bg-indigo-600 rounded-xl font-black text-2xl italic shadow-lg shadow-indigo-900/40">{s.className}</span>
                        <div className="flex flex-col">
                          <span className="text-2xl font-extrabold text-white leading-tight mb-1">{s.subject}</span>
                          <span className="text-lg font-bold text-slate-400">{s.teacher}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-10 italic">Veri bulunamadı.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Orta Alan (Genişletildi) */}
        <div className="flex-1 flex flex-col justify-center items-center bg-blue-600/5 border border-blue-500/10 rounded-[4rem] p-12 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[180px] -mr-64 -mt-64"></div>
          
          <div className="text-center z-10">
            <div className="mb-6">
              {currentLesson ? (
                <span className="px-10 py-3 bg-green-500/20 text-green-400 rounded-full text-3xl font-black border border-green-500/30 animate-pulse shadow-lg shadow-green-500/10">
                   DERS DEVAM EDİYOR
                </span>
              ) : (
                <span className="px-10 py-3 bg-amber-500/20 text-amber-400 rounded-full text-3xl font-black border border-amber-500/30 shadow-lg shadow-amber-500/10">
                   TENEFFÜS ARASI
                </span>
              )}
            </div>
            
            <h2 className="text-[7rem] font-black tracking-tighter text-white mb-2 leading-none uppercase">
              {currentLesson?.label || nextLesson?.label || "MESAİ DIŞI"}
            </h2>
            <p className="text-4xl font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">
              {isBreak ? "DERSİN BAŞLAMASINA" : "DERSİN BİTMESİNE"}
            </p>

            <div className="text-[25rem] leading-[0.7] font-black font-mono tracking-tighter text-white drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)] mb-12">
              {remaining > 0 ? (
                <>{Math.floor(remaining / 60)}<span className="text-blue-500 opacity-40">:</span>{(remaining % 60).toString().padStart(2, '0')}</>
              ) : "00:00"}
            </div>

            <div className="h-2 w-96 bg-slate-800 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(remaining / 2400) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bant */}
      <div className="h-28 bg-slate-900/90 backdrop-blur-md border border-white/5 flex items-center overflow-hidden rounded-[3rem] shadow-2xl">
        <div className="bg-blue-600 px-16 h-full flex items-center justify-center font-black text-5xl italic tracking-tighter z-10 shadow-2xl">
          DUYURU
        </div>
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div className="marquee text-5xl font-bold text-white flex items-center gap-48">
            <span className="flex items-center gap-12">
               {birthdayMessage && <span className="text-amber-400 animate-pulse">{birthdayMessage}</span>}
               <span>{settings.announcement}</span>
            </span>
            <span className="text-blue-500">•</span>
            <span className="flex items-center gap-12">
               {birthdayMessage && <span className="text-amber-400 animate-pulse">{birthdayMessage}</span>}
               <span>{settings.announcement}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
