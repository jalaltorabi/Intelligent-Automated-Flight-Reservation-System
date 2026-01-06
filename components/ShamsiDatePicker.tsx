
import React, { useState } from 'react';
import { toPersianDigits } from '../utils';
import { SHAMSI_MONTHS } from '../constants';

interface Props {
  value: string; // format: YYYY/MM/DD
  onChange: (val: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ShamsiDatePicker: React.FC<Props> = ({ value, onChange, isOpen, onClose }) => {
  const parts = value.split('/');
  const [viewYear, setViewYear] = useState(parseInt(parts[0]) || 1404);
  const [viewMonth, setViewMonth] = useState(parseInt(parts[1]) || 10); // پیش‌فرض دی ماه

  if (!isOpen) return null;

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const daysInMonth = viewMonth <= 6 ? 31 : viewMonth <= 11 ? 30 : 29; // اسفند را ۲۹ در نظر می‌گیریم برای سادگی
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const currentSelectedDay = parts[0] === String(viewYear) && parts[1] === (viewMonth < 10 ? '0' + viewMonth : String(viewMonth)) 
    ? parseInt(parts[2]) 
    : null;

  return (
    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 z-[110] animate-in zoom-in duration-200 origin-top w-72 md:w-80 mx-auto md:mx-0">
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 transition-colors">{'<'}</button>
        <div className="flex flex-col items-center">
          <span className="font-black text-indigo-700 text-sm">{SHAMSI_MONTHS[viewMonth - 1]}</span>
          <span className="text-[10px] font-bold text-slate-400">{toPersianDigits(viewYear)}</span>
        </div>
        <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 transition-colors">{'>'}</button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-400 font-black text-center mb-4">
        {weekDays.map(d => <span key={d} className="py-1">{d}</span>)}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const isSelected = day === currentSelectedDay;
          const fullDate = `${viewYear}/${viewMonth < 10 ? '0' + viewMonth : viewMonth}/${day < 10 ? '0' + day : day}`;

          return (
            <button
              key={day}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(fullDate);
                onClose();
              }}
              className={`aspect-square flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                isSelected 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                : 'hover:bg-indigo-50 text-slate-700 active:scale-95'
              }`}
            >
              {toPersianDigits(day)}
            </button>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            const now = "1404/10/15"; // شبیه‌سازی تاریخ امروز
            onChange(now);
            const p = now.split('/');
            setViewYear(parseInt(p[0]));
            setViewMonth(parseInt(p[1]));
            onClose(); 
          }}
          className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          امروز
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          انصراف
        </button>
      </div>
    </div>
  );
};

export default ShamsiDatePicker;
