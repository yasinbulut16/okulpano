import React, { useState } from 'react';
import { AppSettings, SessionData, DutyTeacher, ClassSchedule, StudentBirthday, LessonTime } from'./types';
// 1. HATA DÜZELTİLDİ: Dosya adın ExcelImport.tsx olduğu için burayı çift "L" yaptık.
import ExcelImport from './ExcelImport'; 

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onCancel: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onCancel }) => {
  const [form, setForm] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'general'>('morning');
  const [bulkScheduleText, setBulkScheduleText] = useState('');
  
  const updateSession = (key: 'morning' | 'afternoon', data: Partial<SessionData>) => {
    setForm(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
  };

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

  // 2. HATA DÜZELTİLDİ: Fonksiyon ve parantezler tamamlandı.
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
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-8 py-4 bg-slate-800 rounded-2xl font-black hover:bg-slate-700 transition-all">İPTAL</button>
          <button onClick={() => onSave(form)} className="px-10 py-4 bg-blue-600 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all">KAYDET VE ÇIK</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
        <div className="max-w-6xl mx-auto w-full">
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

          {activeTab !== 'general' && (
            <div className="bg-indigo-900/10 p-8 rounded-[2.5rem] border border-indigo-500/20">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-indigo-400 uppercase">🚀 EXCEL YÜKLE</h3>
                <ExcelImport 
                  label={`${activeTab === 'morning' ? 'SABAH' : 'ÖĞLE'} EXCEL YÜKLE`} 
                  onImport={handleExcelImport} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;