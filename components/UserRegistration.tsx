
import React, { useState } from 'react';
import { UserProfile, ABGroup } from '../types';
import { TRAIT_LABELS } from '../constants';

interface Props {
  onRegister: (u: UserProfile) => void;
  onBack: () => void;
}

const TRAIT_DESCRIPTIONS: Record<string, string> = {
  openness: 'میزان تمایل شما به تجربیات جدید، هنر، ایده‌های انتزاعی و کنجکاوی فکری.',
  conscientiousness: 'نشان‌دهنده میزان نظم، مسئولیت‌پذیری، وظیفه‌شناسی و تمایل به برنامه‌ریزی.',
  extroversion: 'میزان اجتماعی بودن، پرانرژی بودن در جمع و تمایل به برقراری ارتباط با دیگران.',
  agreeableness: 'میزان مهربانی، اعتماد، نوع‌دوستی و تمایل به همکاری صمیمانه با دیگران.',
  neuroticism: 'میزان حساسیت عاطفی و تمایل به تجربه تنش، اضطراب یا نوسانات خلقی.'
};

const UserRegistration: React.FC<Props> = ({ onRegister, onBack }) => {
  const [step, setStep] = useState(1);
  const [touchedTraits, setTouchedTraits] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    openness: 3,
    conscientiousness: 3,
    extroversion: 3,
    agreeableness: 3,
    neuroticism: 3,
    avgPrice: 1500000,
  });

  const isStep1Valid = formData.name.trim().length > 2 && 
                      formData.email.includes('@') && 
                      formData.email.includes('.');

  const allTraitsTouched = Object.keys(TRAIT_DESCRIPTIONS).every(trait => touchedTraits[trait]);

  const handleSubmit = () => {
    // تخصیص تصادفی به یکی از سه گروه A/B
    const groups = [ABGroup.CONTROL, ABGroup.AUTO_BASIC, ABGroup.AUTO_SUPERVISED];
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];

    const newUser: UserProfile = {
      id: 'U' + Math.random().toString(36).substr(2, 5),
      name: formData.name,
      email: formData.email,
      abGroup: randomGroup,
      personality: {
        openness: formData.openness,
        conscientiousness: formData.conscientiousness,
        extroversion: formData.extroversion,
        agreeableness: formData.agreeableness,
        neuroticism: formData.neuroticism,
      },
      history: {
        avgPrice: formData.avgPrice,
        preferredAirlines: ['Mahan Air'],
        travelFrequency: 5
      }
    };
    onRegister(newUser);
  };

  const handleTraitChange = (trait: string, value: number) => {
    setFormData({ ...formData, [trait]: value });
    setTouchedTraits({ ...touchedTraits, [trait]: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-[Vazirmatn]">
       <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-indigo-600 p-8 text-white relative">
             <button 
                onClick={onBack}
                className="absolute top-8 left-8 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all text-xl"
                title="بازگشت به لندینگ"
             >
               ✕
             </button>
             <div className="text-center">
                <h2 className="text-2xl font-black">ورود به سامانه هوشمند</h2>
                <p className="text-indigo-200 text-sm mt-2 font-medium">پروژه پایان‌نامه: تحلیل رفتار و لایه ناظر هوشمند</p>
             </div>
          </div>
          
          <div className="p-8">
             {step === 1 ? (
               <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase">نام و نام خانوادگی <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="مثلاً: جلال ترابی" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase">ایمیل معتبر <span className="text-rose-500">*</span></label>
                    <input 
                      type="email" 
                      placeholder="email@example.com" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 text-left focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <button 
                    onClick={() => setStep(2)} 
                    disabled={!isStep1Valid}
                    className={`w-full py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      isStep1Valid 
                      ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span>مرحله بعد: تیپ‌سنجی شخصیتی</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={onBack} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600">انصراف و بازگشت</button>
               </div>
             ) : (
               <div className="space-y-8 animate-in slide-in-from-left duration-300">
                  <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                    <p className="text-xs font-black text-indigo-700 leading-relaxed text-center">
                      تحلیل لایه ناظر هوشمند (AI Supervisor) بر پایه این نمرات انجام می‌شود. لطفا با دقت و بر اساس ویژگی‌های واقعی خود اسلایدرها را تنظیم کنید.
                    </p>
                  </div>
                  
                  <div className="space-y-10">
                    {Object.keys(TRAIT_DESCRIPTIONS).map(trait => (
                      <div key={trait} className="relative group">
                         <div className="flex justify-between items-end mb-2">
                           <div>
                             <span className="text-sm font-black text-slate-800">{TRAIT_LABELS[trait]}</span>
                             {!touchedTraits[trait] && <span className="mr-2 text-[9px] font-black text-rose-400 animate-pulse">(تغییر دهید *)</span>}
                           </div>
                           <span className={`text-sm font-black px-3 py-1 rounded-lg ${touchedTraits[trait] ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                             {formData[trait as keyof typeof formData]}/۵
                           </span>
                         </div>
                         <p className="text-[10px] text-slate-500 leading-relaxed mb-4 font-medium">{TRAIT_DESCRIPTIONS[trait]}</p>
                         <input 
                          type="range" min="1" max="5" step="1" 
                          value={formData[trait as keyof typeof formData]} 
                          onChange={e => handleTraitChange(trait, Number(e.target.value))}
                          className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all ${
                            touchedTraits[trait] ? 'accent-indigo-600 bg-indigo-100' : 'accent-slate-400 bg-slate-100'
                          }`}
                         />
                         <div className="flex justify-between mt-1 px-1">
                            <span className="text-[9px] text-slate-300 font-black">کم</span>
                            <span className="text-[9px] text-slate-300 font-black">متوسط</span>
                            <span className="text-[9px] text-slate-300 font-black">زیاد</span>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all active:scale-95">بازگشت</button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={!allTraitsTouched}
                      className={`flex-[2] py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 ${
                        allTraitsTouched 
                        ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {allTraitsTouched ? 'تکمیل پروفایل و شروع جستجو' : 'لطفاً تمام موارد را تنظیم کنید'}
                    </button>
                  </div>
               </div>
             )}
          </div>
          <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master's Thesis Project © 1404</p>
          </div>
       </div>
    </div>
  );
};

export default UserRegistration;
