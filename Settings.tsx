
import React, { useState } from 'react';
import { AppSettings, SessionData, DutyTeacher, ClassSchedule, StudentBirthday, LessonTime } from '../types';
import ExcelImport from './ExcelImport'; // Excel bileşeni

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onCancel: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onCancel }) => {
  const [form, setForm] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'general'>('morning');
  const [bulkScheduleText, setBulkScheduleText] = useState('');
  const [bulkTeacherText, setBulkTeacherText] = useState('');
  const [bulkBirthdayText, setBulkBirthdayText] = useState('');
  
  const [newDuty, setNewDuty] = useState({ name: '', location: 'Bahçe', day: 'Pazartesi' });

  const locations = ["Bahçe", "Zemin Kat", "1. Kat", "2. Kat", "3. Kat", "Kantin", "Yemekhane", "Spor Salonu"];
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

  const updateSession = (key: 'morning' | 'afternoon', data: Partial<SessionData>) => {
    setForm(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
  };

  // --- EXCEL IMPORT FONKSİYONU ---
  const handleExcelImport = (data: any[]) => {
    if (activeTab === 'general') return;
    
    const newSchedules: ClassSchedule[] = data.map((item, idx) => ({
      id: `excel-${Date.now()}-${idx}`,
      className: item.className || '?',
      subject: item.subject || '?',
      teacher: item.teacherName || '?',
      lessonNumber: parseInt(item.lessonNo) || 1
    }));

    updateSession(activeTab, { schedules: [...form[activeTab].schedules, ...newSchedules] });
  };

  const addLesson = (session: 'morning' | 'afternoon') => {
    const nextNum = form[session].lessons.length + 1;
    const newLesson: LessonTime = {
      id: Date.now().toString(),
      label: `${nextNum}. Ders`,
      startTime: '08:00',
      endTime: '08:40'
    };
    updateSession(session, { lessons: [...form[session].lessons, newLesson] });
  };

  const updateLessonField = (session: 'morning' | 'afternoon', id: string, field: keyof LessonTime, value: string) => {
    const updated = form[session].lessons.map(l => l.id === id ? { ...l, [field]: value } : l);
    updateSession(session, { lessons: updated });
  };

  const removeLesson = (session: 'morning' | 'afternoon', id: string) => {
    updateSession(session, { lessons: form[session].lessons.filter(l => l.id !== id) });
  };

  const handleBulkScheduleImport = () => {
    if (activeTab === 'general') return;
    const lines = bulkScheduleText.split('\n').filter(l => l.trim().length > 0);
    const newSchedules: ClassSchedule[] = lines.map((line, idx) => {
      const [className, subject, teacher, lessonNumber] = line.split(';').map(s => s.trim());
      return { id: `bulk-sch-${Date.now()}-${idx}`, className: className || '?', subject: subject || '?', teacher: teacher || '?', lessonNumber: parseInt(lessonNumber) || 1 };
    });
    if (newSchedules.length > 0) {
      updateSession(activeTab, { schedules: [...form[activeTab].schedules, ...newSchedules] });
      setBulkScheduleText('');
    }
  };

  const inputClass = "w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-lg font-bold outline-none focus:ring-4 focus:ring-blue-500 focus:bg-slate-900 transition-all";
  const btnClass = "px-6 py-4 bg-blue-600 rounded-xl font-black text-sm hover:bg-blue-500 focus:ring-4 focus:ring-white transition-all shadow-lg";

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-white overflow-hidden">
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-8 flex justify-between items-center z-50">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">PANO YÖNETİMİ</h1>
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest italic">Kumanda Ok Tuşları ile gezinebilirsiniz</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-8 py-4 bg-slate-800 rounded-2xl font-black hover:bg-slate-700 transition-all">İPTAL</button>
          <button onClick={() => onSave(form)} className="px-10 py-4 bg-blue-600 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all">KAYDET VE ÇIK</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
        <div className="max-w-6xl mx-auto w-full">
          {/* Tablar */}
          <div className="flex gap-4 mb-12 bg-slate-900/50 p-2 rounded-3xl border border-white/5">
            {(['morning', 'afternoon', 'general'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-5 rounded-2xl font-black uppercase text-lg transition-all ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}>
                {tab === 'morning' ? '☀️ SABAH' : tab === 'afternoon' ? '🌙 ÖĞLE' : '⚙️ GENEL'}
              </button>
            ))}
          </div>

          {activeTab === 'general' ? (
            <div className="space-y-8">
              <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5">
                <label className="text-xs font-black text-blue-400 tracking-widest uppercase mb-4 block">KAYAN DUYURU METNİ</label>
                <textarea value={form.announcement} onChange={e => setForm({...form, announcement: e.target.value})} className={`${inputClass} min-h-[150px]`} />
              </div>
              <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5">
                <label className="text-xs font-black text-blue-400 tracking-widest uppercase mb-4 block">GRUPLAR ARASI GEÇİŞ SAATİ</label>
                <input type="time" value={form.switchTime} onChange={e => setForm({...form, switchTime: e.target.value})} className={`${inputClass} text-3xl`} />
              </div>
            </div>
          ) : (
            <div className="space-y-12 pb-20">
              {/* DERS PROGRAMI & EXCEL IMPORT */}
              <div className="bg-indigo-900/10 p-8 rounded-[2.5rem] border border-indigo-500/20">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-indigo-400 uppercase">🚀 DERS PROGRAMI (EXCEL & CSV)</h3>
                  <ExcelImport 
                    label={`${activeTab === 'morning' ? 'SABAH' : 'ÖĞLE'} EXCEL YÜKLE`} 
                    onImport={handleExcelImport} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <textarea value={bulkScheduleText} onChange={e => setBulkScheduleText(e.target.value)} placeholder="5A;Matematik;Aylin Hoca;1" className={`${inputClass} min-h-[200px] font-mono text-sm`} />
                    <button onClick={handleBulkScheduleImport} className={`${btnClass} w-full bg-indigo-600`}>CSV METNİ AKTAR</button>
                  </div>
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 max-h-[300px] overflow-y-auto space-y-2">
                    {form[activeTab].schedules.map(s => (
                      <div key={s.id} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-white/5">
                        <span className="text-sm font-bold">{s.className} - {s.subject} ({s.lessonNumber}. Ders)</span>
                        <button onClick={() => updateSession(activeTab, { schedules: form[activeTab].schedules.filter(x => x.id !== s.id) })} className="text-red-500">🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DERS SAATLERİ */}
              <div className="bg-blue-900/10 p-8 rounded-[2.5rem] border border-blue-500/20">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-blue-400 uppercase">🕒 DERS SAATLERİ</h3>
                  <button onClick={() => addLesson(activeTab)} className={btnClass}>+ YENİ SAAT EKLE</button>
                </div>
                <div className="space-y-3">
                  {form[activeTab].lessons.map((lesson) => (
                    <div key={lesson.id} className="grid grid-cols-4 gap-4 items-center bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                      <input value={lesson.label} onChange={e => updateLessonField(activeTab, lesson.id, 'label', e.target.value)} className={inputClass.replace('p-4', 'p-3 text-sm')} />
                      <input type="time" value={lesson.startTime} onChange={e => updateLessonField(activeTab, lesson.id, 'startTime', e.target.value)} className={inputClass.replace('p-4', 'p-3 text-sm')} />
                      <input type="time" value={lesson.endTime} onChange={e => updateLessonField(activeTab, lesson.id, 'endTime', e.target.value)} className={inputClass.replace('p-4', 'p-3 text-sm')} />
                      <button onClick={() => removeLesson(activeTab, lesson.id)} className="text-red-500">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mevcut Nöbetçi ve Doğum günü bölümleri buraya devam eder... */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
