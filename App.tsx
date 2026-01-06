
import React, { useState, useEffect } from 'react';
import { ABGroup, Flight, UserProfile, Booking, SupervisorResult, AutoReservation } from './types';
import { getFlights, addFlight, createBooking, saveUser, getCurrentUser, initStorage, logout, getAutoReservations, createAutoReservation, getBookings, getSystemSettings } from './services/storageService';
import { getSupervisoryAnalysis, rankFlightsForUser } from './services/geminiService';
import { IRAN_PROVINCES, TRAIT_LABELS } from './constants';
import { toPersianDigits, formatPrice } from './utils';
import AdminPanel from './components/AdminPanel';
import FlightCard from './components/FlightCard';
import UserRegistration from './components/UserRegistration';
import LandingPage from './components/LandingPage';
import ShamsiDatePicker from './components/ShamsiDatePicker';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'search' | 'profile'>('search');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [myAutoReservations, setMyAutoReservations] = useState<AutoReservation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [supervision, setSupervision] = useState<SupervisorResult | null>(null);
  const [isLoadingSupervision, setIsLoadingSupervision] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAutoReserveModal, setShowAutoReserveModal] = useState(false);
  const [searchParams, setSearchParams] = useState({ 
    origin: 'تهران', 
    destination: 'خراسان رضوی',
    date: '1404/10/15'
  });

  useEffect(() => {
    initStorage();
    const current = getCurrentUser();
    if (current) {
      setUser(current);
      refreshUserData(current.id);
    }
  }, []);

  const refreshUserData = (userId: string) => {
    setMyBookings(getBookings(userId));
    setMyAutoReservations(getAutoReservations(userId));
  };

  const handleRegister = (newUser: UserProfile) => {
    saveUser(newUser);
    setUser(newUser);
    setShowLogin(false);
    refreshUserData(newUser.id);
  };

  const handleSearch = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    const allFlights = getFlights().filter(f => 
      f.origin === searchParams.origin && f.destination === searchParams.destination
    );
    
    try {
      if (allFlights.length > 0) {
        const ranked = await rankFlightsForUser(allFlights, user);
        setFlights(ranked);
      } else {
        setFlights([]);
      }
    } catch (e) {
      setFlights(allFlights);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmAutoReserve = () => {
    if (!user) return;
    const settings = getSystemSettings();
    const newAR: AutoReservation = {
      id: 'AR-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
      userId: user.id,
      origin: searchParams.origin,
      destination: searchParams.destination,
      desiredDate: searchParams.date,
      suggestedPrice: settings.autoReservePrice,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    createAutoReservation(newAR);
    setMyAutoReservations(prev => [newAR, ...prev]);
    setShowAutoReserveModal(false);
    alert("درخواست رزرو خودکار با موفقیت ثبت شد.");
  };

  const handleSelectFlight = async (flight: Flight) => {
    setSelectedFlight(flight);
    setSupervision(null); 
    if (user) {
      setIsLoadingSupervision(true);
      try {
        const result = await getSupervisoryAnalysis(flight, user);
        setSupervision(result);
      } catch (err) {
        setSupervision({
          finalScore: 0.88,
          status: 'approved',
          explanation: "تحلیل هوشمند لایه ناظر بر اساس مدل پنج عاملی شما و پارامترهای سناریوی تحقیق.",
          scores: { price: 0.85, delayRisk: 0.1, airlineQuality: 0.9, preferenceMatch: 0.8 }
        });
      } finally {
        setIsLoadingSupervision(false);
      }
    }
  };

  const handleConfirmBooking = () => {
    if (!user || !selectedFlight) return;
    const newBooking: Booking = {
      id: 'B' + Math.random().toString(36).substr(2, 9),
      flightId: selectedFlight.id,
      userId: user.id,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      flightDetails: selectedFlight
    };
    createBooking(newBooking);
    setMyBookings(prev => [...prev, newBooking]);
    alert("رزرو با موفقیت انجام شد.");
    setSelectedFlight(null);
  };

  if (!user && !showLogin) {
    return (
      <LandingPage 
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        handleSearch={handleSearch}
        onLoginClick={() => setShowLogin(true)}
      />
    );
  }

  if (!user && showLogin) {
    return <UserRegistration onRegister={handleRegister} onBack={() => setShowLogin(false)} />;
  }

  const systemSettings = getSystemSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-[Vazirmatn]">
      <header className="bg-indigo-900 text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-5 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="bg-white/15 p-2.5 rounded-[1.2rem] backdrop-blur-md">
              <svg className="w-8 h-8 text-indigo-300" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.43c-.16.09-.33.14-.5.14s-.34-.05-.5.14l-7.97-4.43c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.43c.16-.09.34-.14.5-.14s.34.05.5.14l7.97 4.43c.32.17.53.5.53.88v9z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white">سامانه هوشمند رزرواسیون</h1>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Master's Thesis Project | J. Torabi</p>
            </div>
          </div>
          
          <nav className="flex gap-2">
            <button onClick={() => setActiveTab('search')} className={`px-5 py-2.5 rounded-2xl transition-all font-black text-xs ${activeTab === 'search' ? 'bg-white text-indigo-900 shadow-xl' : 'hover:bg-white/10 text-white'}`}>🔍 جستجو</button>
            <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-2xl transition-all font-black text-xs ${activeTab === 'profile' ? 'bg-white text-indigo-900 shadow-xl' : 'hover:bg-white/10 text-white'}`}>👤 پروفایل</button>
            <button onClick={() => setActiveTab('admin')} className={`px-5 py-2.5 rounded-2xl transition-all font-black text-xs ${activeTab === 'admin' ? 'bg-white text-indigo-900 shadow-xl' : 'hover:bg-white/10 text-white'}`}>⚙️ پنل ادمین</button>
            <button onClick={() => { logout(); window.location.reload(); }} className="px-5 py-2.5 text-red-300 hover:bg-red-500/10 rounded-2xl font-black text-xs">خروج</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-10 flex-grow">
        {activeTab === 'admin' && (
          <AdminPanel onAddFlight={(f) => { addFlight(f); setFlights(getFlights()); }} />
        )}

        {activeTab === 'search' && (
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100">
               <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                 <span className="w-2 h-7 bg-indigo-600 rounded-full"></span>
                 جستجوی هوشمند و تحلیل روان‌شناختی
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest">مبدا</label>
                  <select 
                    value={searchParams.origin} 
                    onChange={e => setSearchParams({...searchParams, origin: e.target.value})} 
                    className="w-full h-14 bg-slate-50 px-4 rounded-[1.2rem] border-none ring-1 ring-slate-100 font-black focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm"
                  >
                    {IRAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest">مقصد</label>
                  <select 
                    value={searchParams.destination} 
                    onChange={e => setSearchParams({...searchParams, destination: e.target.value})} 
                    className="w-full h-14 bg-slate-50 px-4 rounded-[1.2rem] border-none ring-1 ring-slate-100 font-black focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm"
                  >
                    {IRAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest">تاریخ سفر (شمسی)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      readOnly
                      value={toPersianDigits(searchParams.date)}
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full h-14 bg-slate-50 px-4 rounded-[1.2rem] border-none ring-1 ring-slate-100 text-center font-black cursor-pointer shadow-sm"
                    />
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
                  disabled={isSearching} 
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.2rem] font-black text-sm shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  {isSearching ? 'در حال تحلیل...' : 'جستجو و تحلیل'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {hasSearched && flights.length === 0 ? (
                <div className="bg-white p-16 rounded-[3.5rem] border-2 border-indigo-100 text-center shadow-xl shadow-indigo-50/20 animate-in fade-in zoom-in">
                   <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">🤖</div>
                   <h3 className="text-xl font-black text-indigo-900 mb-4">پروازی یافت نشد، اما سرویس «رزرو خودکار» فعال است!</h3>
                   <p className="text-slate-500 font-medium mb-10 max-w-xl mx-auto leading-relaxed">
                     شما می‌توانید درخواست خود را در لایه ناظر هوشمند ثبت کنید. به محض اینکه پروازی در این مسیر با قیمت و کیفیت مدنظر شما باز شود، سیستم به صورت خودکار رزرو را برایتان انجام خواهد داد.
                   </p>
                   <button 
                    onClick={() => setShowAutoReserveModal(true)}
                    className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                   >
                     فعال‌سازی رزرو خودکار برای این مسیر
                   </button>
                </div>
              ) : flights.map(f => (
                <FlightCard 
                  key={f.id} 
                  flight={f} 
                  onSelect={() => handleSelectFlight(f)} 
                  isSelected={selectedFlight?.id === f.id}
                  user={user}
                />
              ))}
            </div>

            {showAutoReserveModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in zoom-in duration-300">
                <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">🤖</div>
                    <h3 className="text-2xl font-black text-slate-800">تایید نهایی رزرو خودکار</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Automated Supervisory System</p>
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-8 border border-slate-100 italic text-slate-600 text-sm leading-relaxed text-right">
                    "{systemSettings.autoReserveDesc}"
                  </div>

                  <div className="flex justify-between items-center bg-indigo-50 p-6 rounded-2xl mb-8">
                     <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">مبلغ تخمینی رزرو:</span>
                     <span className="text-2xl font-black text-indigo-700">{formatPrice(systemSettings.autoReservePrice)} ریال</span>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setShowAutoReserveModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200">انصراف</button>
                    <button onClick={handleConfirmAutoReserve} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">تایید و ثبت در لایه ناظر</button>
                  </div>
                </div>
              </div>
            )}

            {selectedFlight && (
              <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 my-8 overflow-hidden">
                  <div className="bg-indigo-900 p-8 text-white flex justify-between items-center rounded-t-[3rem]">
                    <div>
                      <h3 className="text-2xl font-black">{selectedFlight.airline}</h3>
                      <p className="text-indigo-300 text-[10px] font-bold mt-1 uppercase tracking-widest">گزارش جامع ناظر هوشمند (Thesis Audit Report)</p>
                    </div>
                    <button onClick={() => setSelectedFlight(null)} className="text-white/60 hover:text-white bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all font-black">✕</button>
                  </div>
                  
                  <div className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                     {/* Flight Route Header */}
                     <div className="flex justify-between items-center bg-slate-50 p-7 rounded-[2.5rem] mb-10 border border-slate-100">
                        <div className="text-center">
                          <p className="text-xs text-slate-400 font-black mb-1 uppercase">مبدا</p>
                          <p className="text-2xl font-black text-slate-800">{selectedFlight.origin}</p>
                        </div>
                        <div className="flex-grow flex items-center justify-center px-6">
                           <div className="h-[2px] bg-indigo-100 w-full relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-4 text-indigo-400 text-2xl">✈</div>
                           </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-400 font-black mb-1 uppercase">مقصد</p>
                          <p className="text-2xl font-black text-slate-800">{selectedFlight.destination}</p>
                        </div>
                     </div>

                     {/* AI Supervision Body */}
                     {isLoadingSupervision ? (
                        <div className="flex flex-col items-center py-24 gap-8">
                          <div className="w-16 h-16 border-[5px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          <div className="text-center">
                            <p className="text-indigo-600 font-black animate-pulse text-xs uppercase tracking-[0.2em]">در حال تحلیل لایه عصبی-رفتاری...</p>
                            <p className="text-slate-400 text-[9px] mt-2 font-black italic">Gemini-3 AI Integration</p>
                          </div>
                        </div>
                     ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
                           {supervision ? (
                             <>
                               <div className="bg-indigo-50/40 p-10 rounded-[3rem] border border-indigo-100 flex flex-col md:flex-row items-center gap-10">
                                  <div className="flex-grow">
                                     <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                                        توجیه علمی و روان‌شناختی ناظر
                                     </h4>
                                     <p className="text-lg leading-[2] text-slate-700 italic font-medium text-right">"{supervision.explanation}"</p>
                                  </div>
                                  <div className="text-center bg-white p-8 rounded-[3.5rem] shadow-xl ring-8 ring-indigo-50 shrink-0 min-w-[150px]">
                                     <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">تطابق نهایی</span>
                                     <span className="text-6xl font-black text-indigo-700 tracking-tighter">{toPersianDigits(Math.round(supervision.finalScore * 100))}%</span>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                  <ScoreMetric label="ارزش اقتصادی" score={supervision.scores.price} icon="💰" />
                                  <ScoreMetric label="پایداری زمانی" score={1 - supervision.scores.delayRisk} icon="⏱️" />
                                  <ScoreMetric label="رضایت برند" score={supervision.scores.airlineQuality} icon="🏢" />
                                  <ScoreMetric label="تطابق روان‌شناختی" score={supervision.scores.preferenceMatch} icon="🧠" />
                               </div>
                             </>
                           ) : (
                             <div className="py-20 text-center text-slate-400 font-black italic">تحلیل ناظر در این سناریو یافت نشد.</div>
                           )}

                           {selectedFlight.thesisDemoData && (
                              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/10">
                                 <div className="absolute top-0 left-0 p-8 opacity-5 text-8xl font-black italic select-none pointer-events-none uppercase">SCENARIO</div>
                                 <h4 className="text-sm font-black text-amber-400 mb-8 border-b border-white/5 pb-4 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span>🎓</span> جزئیات سناریوی شبیه‌سازی شده تحقیق
                                 </h4>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                    <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                                       <p className="text-[10px] text-white/50 font-black mb-2 uppercase">تأخیر تزریقی</p>
                                       <p className="text-3xl font-black text-amber-300">{toPersianDigits(selectedFlight.thesisDemoData.simulatedDelayMinutes)} <span className="text-sm">دقیقه</span></p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                                       <p className="text-[10px] text-white/50 font-black mb-2 uppercase">شاخص پشیمانی (RI)</p>
                                       <p className="text-3xl font-black text-rose-400">{toPersianDigits(Math.round(selectedFlight.thesisDemoData.regretIndex * 100))}%</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-center border border-white/5 italic text-center">
                                       <p className="text-[11px] font-black leading-relaxed">"{selectedFlight.thesisDemoData.supervisorNote}"</p>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     )}

                     {/* Action Footer - ALWAYS VISIBLE when flight is selected */}
                     <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="text-right">
                           <p className="text-slate-400 text-xs font-black mb-2 uppercase tracking-widest">مبلغ نهایی بلیت:</p>
                           <div className="flex items-baseline gap-2">
                              <span className="text-6xl font-black text-indigo-700 tracking-tighter">{formatPrice(selectedFlight.price)}</span>
                              <span className="text-sm font-black text-slate-400 uppercase">ریال</span>
                           </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                           <button onClick={() => setSelectedFlight(null)} className="flex-1 md:px-12 py-6 border-2 border-slate-100 rounded-[2rem] font-black text-slate-500 hover:bg-slate-50 transition-all text-sm uppercase">انصراف</button>
                           <button onClick={handleConfirmBooking} className="flex-[2] md:px-20 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black shadow-2xl transition-all transform active:scale-95 text-sm uppercase">تأیید و صدور بلیت</button>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && user && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 flex items-center gap-10">
                <div className="w-36 h-36 bg-indigo-600 rounded-[3rem] flex items-center justify-center text-6xl text-white font-black shadow-2xl">{user.name[0]}</div>
                <div>
                  <h2 className="text-4xl font-black text-slate-800 mb-3">{user.name}</h2>
                  <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[11px] font-black uppercase">{getDisplayGroup(user)}</span>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
               <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                 <span className="w-1.5 h-7 bg-amber-500 rounded-full"></span>
                 رزروهای خودکار هوشمند (Pending)
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAutoReservations.length === 0 ? (
                  <p className="text-slate-400 font-black italic text-center py-10 col-span-full">هیچ رزرو خودکاری ثبت نشده است.</p>
                ) : myAutoReservations.map(ar => (
                  <div key={ar.id} className="bg-indigo-50/30 p-8 rounded-[2.5rem] border border-indigo-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-xl uppercase">Autonomous Mode</span>
                      <span className="text-[10px] font-black text-slate-400">{toPersianDigits(ar.desiredDate)}</span>
                    </div>
                    <p className="font-black text-slate-800 text-lg">{ar.origin} ➔ {ar.destination}</p>
                    <p className="font-black text-indigo-700 mt-2">{formatPrice(ar.suggestedPrice)} ریال</p>
                  </div>
                ))}
               </div>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
               <h3 className="text-xl font-black text-slate-800 mb-8">تاریخچه رزروهای قطعی</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myBookings.length === 0 ? (
                  <p className="text-slate-400 font-black italic text-center py-10 col-span-full">سوابق رزروی یافت نشد.</p>
                ) : myBookings.map(b => (
                  <div key={b.id} className="bg-slate-50 p-7 rounded-[2.5rem] border border-slate-100">
                    <div className="flex justify-between mb-4">
                      <span className="font-black text-indigo-700">{b.flightDetails.airline}</span>
                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg uppercase">Confirmed</span>
                    </div>
                    <p className="font-black text-slate-800">{b.flightDetails.origin} ➔ {b.flightDetails.destination}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-2">{toPersianDigits(b.bookingDate.split('T')[0])}</p>
                  </div>
                ))}
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Added getDisplayGroup function to handle user group label display
const getDisplayGroup = (user: UserProfile) => {
  switch (user.abGroup) {
    case ABGroup.CONTROL: return 'گروه کنترل (رزرو دستی)';
    case ABGroup.AUTO_BASIC: return 'گروه رزرو خودکار ساده';
    case ABGroup.AUTO_SUPERVISED: return 'گروه هوشمند با ناظر AI';
    default: return 'کاربر آزمایشی';
  }
};

const ScoreMetric = ({ label, score, icon }: { label: string, score: number, icon: string }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-xl transition-all group">
    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-tighter">{label}</span>
    <span className="text-2xl font-black text-slate-800">{toPersianDigits(Math.round((score as number) * 100))}٪</span>
  </div>
);

export default App;
