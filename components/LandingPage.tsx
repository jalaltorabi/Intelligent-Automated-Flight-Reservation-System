
import React from 'react';
import { IRAN_PROVINCES } from '../constants';
import { toPersianDigits } from '../utils';
import ShamsiDatePicker from './ShamsiDatePicker';

interface Props {
  searchParams: any;
  setSearchParams: any;
  showDatePicker: boolean;
  setShowDatePicker: any;
  handleSearch: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<Props> = ({ 
  searchParams, 
  setSearchParams, 
  showDatePicker, 
  setShowDatePicker, 
  handleSearch,
  onLoginClick
}) => {
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.43c-.16.09-.33.14-.5.14s-.34-.05-.5-.14l-7.97-4.43c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.43c.16-.09.34-.14.5-.14s.34.05.5.14l7.97 4.43c.32.17.53.5.53.88v9z"/></svg>
             </div>
             <span className="font-black text-2xl text-slate-800 tracking-tight">هوش‌پرواز</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-black text-slate-500">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-indigo-600 transition-all">صفحه اصلی</a>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-indigo-600 transition-all">درباره ما</a>
            <a href="#research" onClick={(e) => scrollToSection(e, 'research')} className="hover:text-indigo-600 transition-all">آمارها</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-indigo-600 transition-all">تماس با ما</a>
          </div>

          <button 
            onClick={onLoginClick}
            className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-600 shadow-2xl shadow-slate-200 transition-all active:scale-95"
          >
            ورود به سامانه
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent"></div>
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-indigo-100 rounded-full blur-[150px] opacity-40"></div>
        
        <div className="container mx-auto px-6 text-center md:text-right flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-10 animate-in slide-in-from-right duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
              <span className="animate-pulse">●</span> پلتفرم آزمایشی رزرواسیون با ناظر هوشمند
            </div>
            <h1 className="text-6xl md:text-[5.5rem] font-black text-slate-900 leading-[1.1] tracking-tighter">
              آینده‌ی سفر، <br/>
              <span className="text-indigo-600">هوشمندتر</span> از همیشه
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-[1.8] max-w-2xl">
              این سامانه به عنوان بخشی از پروژه پایان‌نامه ارشد، با استفاده از لایه ناظر هوشمند (AI Supervisor) و تحلیل ویژگی‌های شخصیتی، بهینه‌ترین پرواز را پیشنهاد می‌دهد.
            </p>
          </div>

          <div className="flex-1 relative animate-in zoom-in duration-1000 w-full">
             <div className="bg-white/50 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/50 shadow-2xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h4 className="text-base font-black text-slate-800 tracking-tight">تحلیل مقایسه‌ای عملکرد</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Thesis Experimental Metrics</p>
                   </div>
                   <span className="text-[11px] bg-green-100 text-green-600 px-3 py-1.5 rounded-xl font-black shadow-sm">Live Analysis</span>
                </div>
                
                <div className="space-y-8">
                   <MetricBar label="میزان رضایت کاربر (هوشمند)" percent={94} color="bg-indigo-600" />
                   <MetricBar label="میزان رضایت کاربر (سنتی)" percent={62} color="bg-slate-300" />
                   <div className="pt-6 border-t border-slate-100">
                     <MetricBar label="کاهش نرخ پشیمانی (Regret Index)" percent={65} color="bg-emerald-500" />
                   </div>
                   <MetricBar label="بهبود سرعت تصمیم‌گیری" percent={42} color="bg-amber-500" />
                   <p className="text-[10px] text-slate-400 font-black text-center mt-6 italic uppercase tracking-widest opacity-60">Automated A/B Test Validation Environment</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 glass-card">
           <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
             <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
             برنامه‌ریزی هوشمند سفر
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-[0.2em]">مبدا</label>
              <select 
                value={searchParams.origin} 
                onChange={e => setSearchParams({...searchParams, origin: e.target.value})} 
                className="w-full bg-slate-50 p-5 rounded-[1.8rem] border-none ring-1 ring-slate-100 font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
              >
                {IRAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-[0.2em]">مقصد</label>
              <select 
                value={searchParams.destination} 
                onChange={e => setSearchParams({...searchParams, destination: e.target.value})} 
                className="w-full bg-slate-50 p-5 rounded-[1.8rem] border-none ring-1 ring-slate-100 font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
              >
                {IRAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2 relative">
              <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-[0.2em]">تاریخ سفر</label>
              <div className="relative group">
                <input 
                  type="text" 
                  readOnly
                  value={toPersianDigits(searchParams.date)}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full bg-slate-50 p-5 rounded-[1.8rem] border-none ring-1 ring-slate-100 text-center font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">📅</div>
                
                <ShamsiDatePicker 
                  value={searchParams.date} 
                  onChange={(val) => setSearchParams({...searchParams, date: val})} 
                  isOpen={showDatePicker} 
                  onClose={() => setShowDatePicker(false)} 
                />
              </div>
            </div>
            <button 
              onClick={handleSearch} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.8rem] p-5 font-black text-xl shadow-2xl shadow-indigo-100 transition-all transform active:scale-95"
            >
              تحلیل هوشمند و جستجو
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 container mx-auto px-6 scroll-mt-24">
        <div className="flex flex-col gap-24 items-center">
          <div className="w-full space-y-12 text-center md:text-right">
             <div className="space-y-6">
                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight">چرا هوش‌پرواز؟</h3>
                <p className="text-xl text-slate-500 font-medium leading-[2] max-w-5xl mx-auto md:mx-0 opacity-80">
                  این سیستم برخلاف پلتفرم‌های معمولی، از یک لایه ناظر مبتنی بر هوش مصنوعی استفاده می‌کند. هدف اصلی این پژوهش، بررسی تأثیر "شخصی‌سازی خودکار" بر کاهش نرخ پشیمانی کاربران پس از خرید است.
                </p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <FeatureBox icon="🧠" title="تحلیل روان‌شناختی" desc="تطبیق پرواز با مدل پنج عاملی شخصیت (Big Five) برای رضایت حداکثری." />
                <FeatureBox icon="🛡️" title="ناظر هوشمند" desc="جلوگیری از رزروهای پرخطر و پیشنهاد جایگزین‌های ایمن به صورت خودکار." />
                <FeatureBox icon="📉" title="مدیریت ریسک" desc="کاهش شاخص پشیمانی (Regret Index) با تحلیل داده‌های تاخیر زنده." />
                <FeatureBox icon="⚖️" title="اعتبارسنجی A/B" desc="بررسی علمی تفاوت گروه‌های کنترل و آزمایش برای تایید کارایی سیستم." />
             </div>
          </div>

          {/* Research Stats Section */}
          <section id="research" className="w-full bg-indigo-950 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl scroll-mt-24">
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-16">
                <div className="md:w-1/3 text-center md:text-right">
                   <h4 className="text-3xl font-black mb-6 tracking-tight">یافته‌های آماری پایان‌نامه</h4>
                   <p className="text-indigo-200 text-base font-medium leading-[1.8] opacity-80">این آمارها حاصل تحلیل رفتار {toPersianDigits(200)} کاربر در محیط شبیه‌سازی شده است که کارایی لایه ناظر را اثبات می‌کند.</p>
                </div>
                <div className="md:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-10 w-full">
                   <StatCircle label="دقت پیش‌بینی تاخیر" percent={88} />
                   <StatCircle label="رضایت روان‌شناختی" percent={92} />
                   <StatCircle label="کاهش زمان تصمیم" percent={45} />
                   <StatCircle label="نرخ رزرو هوشمند" percent={74} />
                </div>
             </div>
             <div className="absolute top-0 right-0 p-12 opacity-5 text-[10rem] font-black italic uppercase select-none pointer-events-none">DATA</div>
          </section>

          {/* Mechanism Text Section */}
          <div className="w-full bg-slate-50 p-16 rounded-[4rem] border border-slate-100 text-right space-y-10 shadow-sm">
             <h4 className="text-3xl font-black text-indigo-900 tracking-tight">مکانیزم عملکرد لایه ناظر هوشمند</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-6">
                   <p className="text-slate-600 text-lg leading-[2] font-medium">
                      سامانه «هوش‌پرواز» بر پایه مدل علمی <span className="text-indigo-600 font-black">Big Five Personality Traits</span> طراحی شده است. در بدو ورود، کاربر تحت یک پرسشنامه تیپ‌شناسی قرار می‌گیرد تا ویژگی‌هایی نظیر «وظیفه‌شناسی» و «ریسک‌پذیری» استخراج شود. این داده‌ها به عنوان ورودی اولیه به موتور تحلیل AI ارسال می‌گردد.
                   </p>
                   <p className="text-slate-600 text-lg leading-[2] font-medium">
                      لایه ناظر (Supervisory Layer) در زمان جستجو، داده‌های حجیم پروازها را فیلتر کرده و با استفاده از شاخص <span className="text-rose-600 font-black">Regret Index</span>، احتمال پشیمانی کاربر از انتخاب را پیش‌بینی می‌کند.
                   </p>
                </div>
                <div className="space-y-6 border-r md:pr-16 border-slate-200">
                   <div className="flex gap-6 items-start">
                      <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 font-black shadow-lg shadow-indigo-100">{toPersianDigits(1)}</div>
                      <p className="text-sm text-slate-500 font-bold leading-[1.8] mt-2">تحلیل لحظه‌ای ریسک‌های محیطی توسط مدل {toPersianDigits('Gemini-3 Flash')}.</p>
                   </div>
                   <div className="flex gap-6 items-start">
                      <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 font-black shadow-lg shadow-indigo-100">{toPersianDigits(2)}</div>
                      <p className="text-sm text-slate-500 font-bold leading-[1.8] mt-2">تطبیق ویژگی‌های روان‌شناختی برای یافتن بهینه‌ترین «ارزش خرید» اختصاصی.</p>
                   </div>
                   <div className="flex gap-6 items-start">
                      <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 font-black shadow-lg shadow-indigo-100">{toPersianDigits(3)}</div>
                      <p className="text-sm text-slate-500 font-bold leading-[1.8] mt-2">ارائه شفاف دلایل رد یا پیشنهاد پرواز بر اساس داده‌های سناریو.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 bg-slate-900 text-white scroll-mt-24">
        <div className="container mx-auto px-6 text-center space-y-16">
           <div className="space-y-6">
              <h3 className="text-5xl font-black tracking-tight">تماس با تیم پژوهش</h3>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
                 این یک سامانه تحقیقاتی است. اگر پیشنهادی برای بهبود مدل‌های هوشمند ما دارید، با ما در میان بگذارید.
              </p>
           </div>
           
           <div className="flex flex-col md:flex-row justify-center gap-10">
              <ContactCard icon="📧" label="ایمیل مستقیم" val="mrjalaltorabi@gmail.com" color="bg-indigo-600" />
              <ContactCard icon="📞" label="پشتیبانی تلفنی" val="۰۹۹۰۰۰۸۵۴۷۸" color="bg-green-600" />
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-100">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-sm font-bold text-slate-400">© {toPersianDigits(1404)} - تمامی حقوق معنوی متعلق به جلال ترابی (پایان‌نامه کارشناسی ارشد) است.</p>
            <div className="flex gap-10 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
               <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-indigo-600 transition-colors">درباره ما</a>
               <a href="#research" onClick={(e) => scrollToSection(e, 'research')} className="hover:text-indigo-600 transition-colors">آمارها</a>
               <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-indigo-600 transition-colors">تماس با ما</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

// مولفه نوار پیشرفت برای Thesis Metrics
const MetricBar = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className={color.replace('bg-', 'text-')}>{toPersianDigits(percent)}٪</span>
    </div>
    <div className="h-3 bg-slate-100/50 rounded-full overflow-hidden shadow-inner">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-[2000ms] shadow-lg`} 
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

// مولفه ویژگی‌ها
const FeatureBox = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all text-center">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
      <span className="text-3xl">{icon}</span>
    </div>
    <h4 className="font-black text-slate-800 text-lg mb-4">{title}</h4>
    <p className="text-xs text-slate-400 font-bold leading-relaxed">{desc}</p>
  </div>
);

// مولفه آمار دایره‌ای
const StatCircle = ({ label, percent }: { label: string, percent: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 group">
       <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
             <circle 
                cx="50" cy="50" r={radius} fill="transparent" stroke="white" strokeWidth="8" 
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" className="transition-all duration-[2000ms] group-hover:stroke-indigo-400 shadow-xl" 
             />
          </svg>
          <span className="absolute text-3xl font-black text-white drop-shadow-md">{toPersianDigits(percent)}٪</span>
       </div>
       <p className="text-[12px] font-black text-center text-indigo-100 uppercase tracking-widest opacity-80">{label}</p>
    </div>
  );
};

// مولفه کارت تماس
const ContactCard = ({ icon, label, val, color }: { icon: string, label: string, val: string, color: string }) => (
  <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10 w-full md:w-96 hover:bg-white/10 transition-all group hover:-translate-y-2">
     <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl`}>{icon}</div>
     <p className="text-[11px] font-black text-indigo-400 uppercase mb-3 tracking-[0.3em]">{label}</p>
     <p className="font-black text-2xl tracking-tight" dir={val.includes('@') ? 'ltr' : 'rtl'}>
       {val.includes('@') ? val : toPersianDigits(val)}
     </p>
  </div>
);

export default LandingPage;
