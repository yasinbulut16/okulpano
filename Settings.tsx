import React, { useState } from 'react';
import { AppSettings, SessionData, DutyTeacher, ClassSchedule, StudentBirthday, LessonTime } from '../types';
// DİKKAT: Dosya adınla birebir aynı (Çift L) yaptık
import ExcelImport from './ExcellImport'; 

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

  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
       <h2 className="text-2xl font-bold mb-4">Ayarlar</h2>
       <div className="mb-8">
         <ExcelImport 
           label={`${activeTab === 'morning' ? 'SABAH' : 'ÖĞLE'} EXCEL YÜKLE`} 
           onImport={handleExcelImport} 
         />
       </div>
       <div className="flex gap-4">
         <button onClick={onCancel} className="p-2 bg-slate-700 rounded">İptal</button>
         <button onClick={() => onSave(form)} className="p-2 bg-blue-600 rounded">Kaydet</button>
       </div>
    </div>
  );
};

export default Settings;