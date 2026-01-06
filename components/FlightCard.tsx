
import React from 'react';
import { Flight, UserProfile, ABGroup } from '../types';
import { toPersianDigits, formatPrice } from '../utils';

interface Props {
  flight: Flight;
  onSelect: () => void;
  isSelected: boolean;
  user: UserProfile | null;
}

const FlightCard: React.FC<Props> = ({ flight, onSelect, isSelected, user }) => {
  const baseScore = Math.round(flight.qualityScore * 100);
  
  const calculateMatchScore = () => {
    if (!user) return baseScore;
    
    let bonus = 0;
    const p = user.personality;
    
    if (p.conscientiousness > 3 && flight.qualityScore > 0.8) bonus += 10;
    if (p.extroversion > 3 && flight.airline.includes('Mahan')) bonus += 5;
    if (flight.thesisDemoData) {
        bonus -= (flight.thesisDemoData.regretIndex * 20);
    }
    
    return Math.min(100, Math.max(0, baseScore + bonus));
  };

  const matchScore = Math.round(calculateMatchScore());
  const isRecommended = matchScore > 80;

  const getPersonalityGroupName = (personality: UserProfile['personality']) => {
    const sum = personality.openness + personality.conscientiousness + personality.extroversion + personality.agreeableness + personality.neuroticism;
    if (sum <= 5) return 'ملاحظه کار';
    if (sum <= 10) return 'کمی ریسک پذیر';
    if (sum <= 15) return 'علاقه مند به سفر';
    if (sum <= 20) return 'سفیر سامانه';
    return 'عاشق سفر';
  };

  return (
    <div 
      onClick={onSelect}
      className={`bg-white rounded-[2.5rem] p-7 border-2 transition-all cursor-pointer hover:shadow-2xl group relative overflow-hidden ${
        isSelected ? 'border-indigo-600 bg-indigo-50/20' : 
        isRecommended ? 'border-emerald-200 shadow-emerald-50 shadow-xl' : 'border-transparent shadow-sm'
      }`}
    >
      {isRecommended && (
        <div className="absolute top-0 left-10 bg-emerald-500 text-white px-6 py-1.5 rounded-b-2xl text-[9px] font-black uppercase tracking-widest shadow-lg z-20 animate-bounce">
          پیشنهاد ویژه سیستم هوشمند
        </div>
      )}

      <div className={`absolute top-5 right-5 px-3 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-2 shadow-sm z-10 ${
        flight.qualityScore > 0.85 ? 'bg-green-50 text-green-600 border-green-100' : 
        flight.qualityScore > 0.75 ? 'bg-blue-50 text-blue-600 border-blue-100' : 
        'bg-red-50 text-red-600 border-red-100'
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {flight.qualityScore > 0.85 ? 'بسیار مطمئن' : flight.qualityScore > 0.75 ? 'پایداری متوسط' : 'احتمال تأخیر'}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-8 mt-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-3xl font-black text-indigo-600 shadow-inner group-hover:rotate-6 transition-transform">
            {flight.airline[0]}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{flight.airline}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
               <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-xl uppercase tracking-tighter">{flight.aircraftType}</span>
               <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-xl uppercase">{flight.classType === 'Economy' ? 'اقتصادی' : 'بیزنس'}</span>
            </div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-between px-0 md:px-10">
           <div className="text-center">
             <p className="text-2xl font-black text-slate-800">{toPersianDigits(flight.departureTime.split('T')[1].substr(0, 5))}</p>
             <p className="text-[10px] text-slate-400 font-black mt-1 uppercase">{flight.origin}</p>
           </div>
           
           <div className="flex-grow mx-6 relative h-10 flex items-center">
              <div className="h-[2px] bg-slate-100 w-full relative">
                <div className="absolute inset-0 bg-indigo-500/20 h-full w-full" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-indigo-600 group-hover:scale-125 transition-all">
                <span className="text-xl">✈</span>
              </div>
           </div>

           <div className="text-center">
             <p className="text-2xl font-black text-slate-800">{toPersianDigits(flight.arrivalTime.split('T')[1].substr(0, 5))}</p>
             <p className="text-[10px] text-slate-400 font-black mt-1 uppercase">{flight.destination}</p>
           </div>
        </div>

        <div className="flex flex-col items-end justify-center min-w-[200px] border-r border-slate-50 pr-8">
           <div className="flex items-baseline gap-1.5">
             <p className="text-3xl font-black text-indigo-700">{formatPrice(flight.price)}</p>
             <span className="text-[10px] font-black text-slate-400 uppercase">ریال</span>
           </div>
           
           <div className="mt-3 flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase">تطابق هوشمند:</span>
                <span className={`text-sm font-black ${matchScore > 80 ? 'text-emerald-600' : 'text-indigo-600'}`}>{toPersianDigits(matchScore)}٪</span>
              </div>
              <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className={`w-3.5 h-1.5 rounded-full ${i <= (matchScore/20) ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.3)]' : 'bg-slate-200'}`} />
                 ))}
              </div>
           </div>

           <button className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 group-hover:-translate-y-1">
             آنالیز و رزرو نهایی
           </button>
        </div>
      </div>

      {/* پیش‌نمایش تحلیل لایه ناظر هوشمند (نمایش همگانی) */}
      {flight.thesisDemoData && (
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-start gap-4 animate-in slide-in-from-right duration-500">
           <div className="bg-indigo-900 text-white p-2.5 rounded-xl text-sm shadow-lg flex-shrink-0">🤖</div>
           <div className="flex-grow">
              <p className="text-[10px] font-black text-indigo-600 mb-1 uppercase tracking-widest">تحلیل اولیه لایه ناظر:</p>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">"{flight.thesisDemoData.supervisorNote}"</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
