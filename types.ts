
export interface LessonTime {
  id: string;
  label: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface DutyTeacher {
  id: string;
  name: string;
  location: string;
  day: string; // Pazartesi, Salı, vb.
}

export interface ClassSchedule {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  lessonNumber: number;
}

export interface StudentBirthday {
  id: string;
  name: string;
  birthDate: string; // DD.MM formatında
}

export interface SessionData {
  schoolName: string;
  lessons: LessonTime[];
  dutyTeachers: DutyTeacher[];
  schedules: ClassSchedule[];
  birthdays: StudentBirthday[];
}

export interface AppSettings {
  morning: SessionData;
  afternoon: SessionData;
  announcement: string;
  switchTime: string; // Time to switch from morning to afternoon (e.g., 13:00)
}

export type ScreenMode = 'board' | 'settings';
export type DaySession = 'morning' | 'afternoon';
