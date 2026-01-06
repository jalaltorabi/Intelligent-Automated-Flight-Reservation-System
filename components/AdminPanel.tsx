
import React, { useState, useEffect } from 'react';
import { Flight, UserProfile, ABGroup, Booking, AutoReservation } from '../types';
import { INITIAL_METRICS, IRAN_PROVINCES, TRAIT_LABELS } from '../constants';
import { getFlights, getAllUsers, getAllBookings, getAllAutoReservations, deleteFlight, updateUserByAdmin, getSystemSettings, updateSystemSettings } from '../services/storageService';
import { toPersianDigits, formatPrice } from '../utils';
import Dashboard from './Dashboard';
import ShamsiDatePicker from './ShamsiDatePicker';

interface Props {
  onAddFlight: (f: Flight) => void;
}

const FAMOUS_AIRLINES = [
  "Mahan Air (ماهان)", "Iran Air (ایران ایر)", "Aseman (آسمان)", "Qeshm Air (قشم ایر)", "Kish Air (کیش ایر)"
];

const AdminPanel: React.FC<Props> = ({ onAddFlight }) => {
  const [activeView, setActiveView] = useState<'charts' | 'data_entry' | 'system_logs' | 'users' | 'auto_reservations' | 'auto_reserve_settings'>('charts');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [allAutoRes, setAllAutoRes] = useState<AutoReservation[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  const [settings, setSettings] = useState(getSystemSettings());

  useEffect(() => {
    setAllUsers(getAllUsers());
    setAllBookings(getAllBookings());
    setAllFlights(getFlights());
    setAllAutoRes(getAllAutoReservations());
    setSettings(getSystemSettings());
  }, [activeView]);

  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    airline: FAMOUS_AIRLINES[0],
    classType: 'Economy',
    origin: 'تهران',
    destination: 'خراسان رضوی',
    price: 1200000,
    departureTime: '1404/10/15T14:00:00',
    arrivalTime: '1404/10/15T15:30:00',
    availableSeats: 40,
    aircraftType: 'Airbus A320',
    qualityScore: 0.8,
    thesisDemoData: {
      simulatedDelayMinutes: 0,
      regretIndex: 0.1,
      supervisorNote: 'سناریوی پیش‌فرض پایان‌نامه',
      targetPersonality: { openness: 3, conscientiousness: 3, extroversion: 3, agreeableness: 3, neuroticism: 3 }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const flight: Flight = {
      ...newFlight as Flight,
      id: 'F-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      delayHistory: [],
      allowedLuggage: '20kg'
    };
    onAddFlight(flight);
    setAllFlights(getFlights());
    alert('پرواز سناریو با موفقیت تزریق شد.');
  };

  const handleSaveSettings = () => {
    updateSystemSettings(settings);
    alert("تنظیمات رزرو خودکار بروزرسانی شد.");
  };

  const handleTargetPersonalityChange = (trait: string, val: number) => {
    setNewFlight({
      ...newFlight,
      thesisDemoData: {
        ...newFlight.thesisDemoData!,
        targetPersonality: {
          ...newFlight.thesisDemoData!.targetPersonality!,
          [trait]: val
        }
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 animate-in slide-in-from-bottom-6">
      <div className="flex-grow">
        {activeView === 'charts' && (
           <Dashboard users={allUsers} bookings={allBookings} autoReservations={allAutoRes} />
        )}

        {activeView === 'auto_reservations' && (
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-8">درخواست‌های رزرو خودکار هوشمند</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px]">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-5">کاربر</th>
                    <th className="p-5">مسیر</th>
                    <th className="p-5">تاریخ</th>
                    <th className="p-5">قیمت پیشنهادی</th>
                    <th className="p-5">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {allAutoRes.map(ar => (
                    <tr key={ar.id} className="border-b">
                      <td className="p-5 font-black">{allUsers.find(u => u.id === ar.userId)?.name || 'ناشناس'}</td>
                      <td className="p-5 font-black">{ar.origin} ➔ {ar.destination}</td>
                      <td className="p-5">{toPersianDigits(ar.desiredDate)}</td>
                      <td className="p-5 text-indigo-600 font-black">{formatPrice(ar.suggestedPrice)}</td>
                      <td className="p-5"><span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl animate-pulse">Pending AI Match</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'auto_reserve_settings' && (
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black text-slate-800 mb-10">تنظیمات سناریوی رزرو خودکار</h2>
             <div className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 mr-2 uppercase">مبلغ پیشنهادی سیستم (ریال)</label>
                   <input type="number" value={settings.autoReservePrice} onChange={e => setSettings({...settings, autoReservePrice: Number(e.target.value)})} className="w-full p-5 bg-slate-50 rounded-3xl border-none ring-1 ring-slate-100 font-black" />
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 mr-2 uppercase">توضیحات توجیهی برای کاربر</label>
                   <textarea value={settings.autoReserveDesc} onChange={e => setSettings({...settings, autoReserveDesc: e.target.value})} className="w-full p-5 bg-slate-50 rounded-3xl border-none ring-1 ring-slate-100 font-black h-40 italic" />
                </div>
                <button onClick={handleSaveSettings} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700">ذخیره تنظیمات</button>
             </div>
          </div>
        )}

        {activeView === 'data_entry' && (
          <div className="space-y-12">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black mb-10 text-slate-800">تزریق سناریوی پرواز</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">ایرلاین</label>
                  <select value={newFlight.airline} onChange={e => setNewFlight({...newFlight, airline: e.target.value})} className="w-full p-5 bg-slate-50 rounded-3xl ring-1 ring-slate-100 font-black appearance-none">
                    {FAMOUS_AIRLINES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[11px] font-black text-indigo-600 uppercase">تاریخ (شمسی)</label>
                  <input type="text" readOnly value={toPersianDigits(newFlight.departureTime?.split('T')[0] || '')} onClick={() => setShowDatePicker(!showDatePicker)} className="w-full p-5 bg-indigo-50/50 rounded-3xl ring-1 ring-indigo-200 font-black text-center" />
                  <ShamsiDatePicker value={newFlight.departureTime?.split('T')[0] || ''} onChange={(val) => setNewFlight({...newFlight, departureTime: `${val}T14:00:00`, arrivalTime: `${val}T15:30:00`})} isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase">مبدا</label>
                   <select value={newFlight.origin} onChange={e => setNewFlight({...newFlight, origin: e.target.value})} className="w-full p-5 bg-slate-50 rounded-3xl ring-1 ring-slate-100 font-black appearance-none">
                     {IRAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase">مقصد</label>
                   <select value={newFlight.destination} onChange={e => setNewFlight({...newFlight, destination: e.target.value})} className="w-full p-5 bg-slate-50 rounded-3xl ring-1 ring-slate-100 font-black appearance-none">
                     {IRAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">قیمت (ریال)</label>
                  <input type="number" value={newFlight.price} onChange={e => setNewFlight({...newFlight, price: Number(e.target.value)})} className="w-full p-5 bg-slate-50 rounded-3xl ring-1 ring-slate-100 font-black" />
                </div>
                <div className="col-span-full bg-slate-900 p-10 rounded-[3rem] text-white">
                   <h3 className="text-amber-400 font-black text-xs uppercase mb-6 tracking-widest border-b border-white/5 pb-4">تنظیمات ناظر هوشمند سناریو</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-2">تاخیر فرضی (دقیقه)</label>
                          <input type="number" value={newFlight.thesisDemoData?.simulatedDelayMinutes} onChange={e => setNewFlight({...newFlight, thesisDemoData: {...newFlight.thesisDemoData!, simulatedDelayMinutes: Number(e.target.value)}})} className="w-full p-4 bg-white/5 rounded-2xl font-black text-amber-300 ring-1 ring-white/10" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-2">شاخص پشیمانی (RI)</label>
                          <input type="number" step="0.1" value={newFlight.thesisDemoData?.regretIndex} onChange={e => setNewFlight({...newFlight, thesisDemoData: {...newFlight.thesisDemoData!, regretIndex: Number(e.target.value)}})} className="w-full p-4 bg-white/5 rounded-2xl font-black text-rose-400 ring-1 ring-white/10" />
                        </div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[10px] text-indigo-300 font-black mb-4">پروفایل هدف سناریو:</p>
                         {Object.keys(TRAIT_LABELS).map(trait => (
                            <div key={trait}>
                               <div className="flex justify-between text-[9px] mb-1">
                                 <span>{TRAIT_LABELS[trait]}</span>
                                 <span>{toPersianDigits(newFlight.thesisDemoData?.targetPersonality?.[trait as keyof typeof TRAIT_LABELS] || 3)}/۵</span>
                               </div>
                               <input type="range" min="1" max="5" value={newFlight.thesisDemoData?.targetPersonality?.[trait as keyof typeof TRAIT_LABELS] || 3} onChange={(e) => handleTargetPersonalityChange(trait, Number(e.target.value))} className="w-full accent-indigo-500" />
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
                <button type="submit" className="col-span-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-indigo-700">تزریق سناریوی جدید</button>
              </form>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
               <h2 className="text-xl font-black text-slate-800 mb-8">لیست پروازهای فعال در سناریو</h2>
               <div className="overflow-x-auto">
                 <table className="w-full text-right text-[11px]">
                    <thead className="bg-slate-50 border-b">
                       <tr><th>ایرلاین</th><th>مسیر</th><th>قیمت</th><th>ناظر</th><th>عملیات</th></tr>
                    </thead>
                    <tbody>
                       {allFlights.map(f => (
                          <tr key={f.id} className="border-b group hover:bg-slate-50">
                             <td className="p-5 font-black">{f.airline}</td>
                             <td className="p-5">{f.origin} ➔ {f.destination}</td>
                             <td className="p-5 font-black text-indigo-600">{formatPrice(f.price)}</td>
                             <td className="p-5">
                                {f.thesisDemoData && <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg border">RI: {toPersianDigits(f.thesisDemoData.regretIndex)}</span>}
                             </td>
                             <td className="p-5">
                                <button onClick={() => { deleteFlight(f.id); setAllFlights(getFlights()); }} className="text-rose-400 opacity-0 group-hover:opacity-100 font-black">حذف</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeView === 'users' && (
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-10">مدیریت کاربران (سوژه‌ها)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px]">
                <thead className="bg-slate-50 border-b">
                  <tr><th>نام کاربر</th><th>گروه</th><th>رزروها</th><th>عملیات</th></tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u.id} className="border-b group hover:bg-slate-50">
                      <td className="p-5 font-black">{u.name}</td>
                      <td className="p-5 uppercase">{u.abGroup}</td>
                      <td className="p-5 font-black text-emerald-600">{toPersianDigits(allBookings.filter(b => b.userId === u.id).length)}</td>
                      <td className="p-5"><button onClick={() => setEditingUser(u)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] opacity-0 group-hover:opacity-100">ویرایش</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {editingUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-xl rounded-[3rem] p-10">
               <h3 className="text-2xl font-black mb-8 border-b pb-4">ویرایش کاربر: {editingUser.name}</h3>
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase">گروه آزمایشی</label>
                    <select value={editingUser.abGroup} onChange={e => setEditingUser({...editingUser, abGroup: e.target.value as ABGroup})} className="w-full p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 font-black">
                       <option value={ABGroup.CONTROL}>کنترل (دستی)</option>
                       <option value={ABGroup.AUTO_BASIC}>خودکار ساده</option>
                       <option value={ABGroup.AUTO_SUPERVISED}>هوشمند با ناظر AI</option>
                    </select>
                  </div>
                  <div className="flex gap-4 mt-8">
                     <button onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">انصراف</button>
                     <button onClick={() => { updateUserByAdmin(editingUser); setAllUsers(getAllUsers()); setEditingUser(null); }} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">ذخیره تغییرات</button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <aside className="w-full md:w-80">
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 sticky top-28">
          <h3 className="text-xl font-black mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            مدیریت ادمین
          </h3>
          <nav className="space-y-4 font-black text-xs">
            {[
              { id: 'charts', label: 'آنالیز کلان', icon: '📊' },
              { id: 'auto_reservations', label: 'رزروهای خودکار', icon: '🤖' },
              { id: 'auto_reserve_settings', label: 'تنظیمات رزرو خودکار', icon: '⚙️' },
              { id: 'data_entry', label: 'مدیریت سناریوها', icon: '✈️' },
              { id: 'users', label: 'کاربران (سوژه‌ها)', icon: '👥' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveView(item.id as any)} className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-500'}`}>
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default AdminPanel;
