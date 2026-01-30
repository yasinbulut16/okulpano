
import { AppSettings } from './types';

const generateMockSchedules = (lessonCount: number, prefix: string) => {
  const subjects = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce', 'Görsel Sanatlar', 'Beden Eğitimi'];
  const teachers = ['Ahmet Hoca', 'Ayşe Hanım', 'Mehmet Bey', 'Fatma Hoca', 'Can Bey', 'Zeynep Hanım'];
  const schedules = [];
  
  for (let l = 1; l <= lessonCount; l++) {
    for (let s = 1; s <= 10; s++) { // Her ders saati için 10 örnek şube
      schedules.push({
        id: `${prefix}-${l}-${s}`,
        className: `${prefix}-${s}A`,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        teacher: teachers[Math.floor(Math.random() * teachers.length)],
        lessonNumber: l
      });
    }
  }
  return schedules;
};

export const DEFAULT_SETTINGS: AppSettings = {
  morning: {
    schoolName: "Sabah Ortaokulu",
    lessons: [
      { id: '1', label: '1. Ders', startTime: '08:30', endTime: '09:10' },
      { id: '2', label: '2. Ders', startTime: '09:20', endTime: '10:00' },
      { id: '3', label: '3. Ders', startTime: '10:10', endTime: '10:50' },
      { id: '4', label: '4. Ders', startTime: '11:00', endTime: '11:40' },
      { id: '5', label: '5. Ders', startTime: '11:50', endTime: '12:30' },
      { id: '6', label: '6. Ders', startTime: '12:40', endTime: '13:20' },
      { id: '7', label: '7. Ders', startTime: '13:30', endTime: '14:10' },
    ],
    dutyTeachers: [
      { id: '1', name: 'Ahmet Yılmaz', location: 'Bahçe', day: 'Pazartesi' },
      { id: '2', name: 'Fatma Demir', location: '1. Kat', day: 'Salı' },
      { id: '3', name: 'Mustafa Kaya', location: 'Zemin Kat', day: 'Çarşamba' },
    ],
    schedules: generateMockSchedules(7, 'S'),
    birthdays: []
  },
  afternoon: {
    schoolName: "Öğle Anadolu Lisesi",
    lessons: [
      { id: '1', label: '1. Ders', startTime: '14:20', endTime: '15:00' },
      { id: '2', label: '2. Ders', startTime: '15:10', endTime: '15:50' },
      { id: '3', label: '3. Ders', startTime: '16:00', endTime: '16:40' },
      { id: '4', label: '4. Ders', startTime: '16:50', endTime: '17:30' },
      { id: '5', label: '5. Ders', startTime: '17:40', endTime: '18:20' },
      { id: '6', label: '6. Ders', startTime: '18:30', endTime: '19:10' },
      { id: '7', label: '7. Ders', startTime: '19:20', endTime: '20:00' },
      { id: '8', label: '8. Ders', startTime: '20:10', endTime: '20:50' },
    ],
    dutyTeachers: [
      { id: '4', name: 'Canan Öz', location: 'Kantin', day: 'Pazartesi' },
    ],
    schedules: generateMockSchedules(8, 'O'),
    birthdays: []
  },
  announcement: "2024-2025 Eğitim Öğretim Yılı tüm öğrencilerimize hayırlı olsun!",
  switchTime: "14:15"
};
