import React from 'react';
import * as XLSX from 'xlsx';

interface ExcelImportProps {
  onImport: (data: any[]) => void;
  label: string;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onImport, label }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      const formattedData = data.map((item: any) => ({
        className: item["Sınıf"] || item["Sube"] || "",
        teacherName: item["Öğretmen"] || item["Ogretmen"] || "",
        subject: item["Ders"] || item["Ders Adi"] || "",
        lessonNo: Number(item["Ders No"] || 1)
      }));

      onImport(formattedData);
      alert(`${label} başarıyla yüklendi!`);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-col gap-2 p-4 border border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
      <label className="text-sm font-bold text-blue-400 uppercase tracking-wider">{label}</label>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileChange}
        className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
      />
    </div>
  );
};

export default ExcelImport;
