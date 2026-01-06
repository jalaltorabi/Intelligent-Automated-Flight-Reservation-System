
import React from 'react';
import { ABGroup, UserProfile, Booking, AutoReservation } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie
} from 'recharts';
import { toPersianDigits } from '../utils';

interface Props {
  users: UserProfile[];
  bookings: Booking[];
  autoReservations: AutoReservation[];
}

const Dashboard: React.FC<Props> = ({ users = [], bookings = [], autoReservations = [] }) => {
  const calculateConversion = (group: ABGroup) => {
    const groupUsers = users.filter(u => u.abGroup === group);
    if (groupUsers.length === 0) return 0;
    
    const usersWithBookings = groupUsers.filter(user => 
      bookings.some(booking => booking.userId === user.id)
    );
    
    return Number(((usersWithBookings.length / groupUsers.length) * 100).toFixed(1));
  };

  const abData = [
    { name: 'رزرو دستی (Control)', conversion: calculateConversion(ABGroup.CONTROL) },
    { name: 'رزرو خودکار ساده', conversion: calculateConversion(ABGroup.AUTO_BASIC) },
    { name: 'رزرو هوشمند با ناظر', conversion: calculateConversion(ABGroup.AUTO_SUPERVISED) },
  ];

  const pieData = [
    { name: 'رزرو قطعی', value: bookings.length },
    { name: 'رزرو خودکار هوشمند', value: autoReservations.length },
  ];

  const COLORS = ['#4f46e5', '#f59e0b'];

  const getAvgTrait = (trait: keyof UserProfile['personality']) => {
    if (users.length === 0) return 60;
    const sum = users.reduce((acc, u) => acc + (u.personality[trait] || 0), 0);
    return Math.round((sum / users.length) * 20);
  };

  const satisfactionData = [
    { trait: 'گشودگی', satisfaction: getAvgTrait('openness') },
    { trait: 'وظیفه‌شناسی', satisfaction: getAvgTrait('conscientiousness') },
    { trait: 'برون‌گرایی', satisfaction: getAvgTrait('extroversion') },
    { trait: 'سازگاری', satisfaction: getAvgTrait('agreeableness') },
    { trait: 'روان‌رنجوری', satisfaction: 100 - getAvgTrait('neuroticism') },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="تعداد کل سوژه‌ها" value={toPersianDigits(users.length)} icon="👥" color="text-indigo-600" />
        <StatCard title="رزروهای نهایی" value={toPersianDigits(bookings.length)} icon="🎫" color="text-emerald-600" />
        <StatCard title="رزروهای خودکار" value={toPersianDigits(autoReservations.length)} icon="🤖" color="text-amber-500" />
        <StatCard title="بهترین نرخ تبدیل" value={`${toPersianDigits(calculateConversion(ABGroup.AUTO_SUPERVISED))}%`} icon="📈" color="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-10 text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            تحلیل نرخ تبدیل واقعی گروه‌ها (%)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={abData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} unit="%" />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="conversion" radius={[10, 10, 0, 0]} name="نرخ تبدیل">
                  {abData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#4f46e5' : index === 1 ? '#94a3b8' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-10 text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
            سهم رزرو دستی در مقابل خودکار
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black mb-10 text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
          توزیع رضایت بر اساس ۵ عامل شخصیت
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={satisfactionData}>
              <defs>
                <linearGradient id="colorSat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="trait" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
              <Area type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSat)" name="میزان رضایت" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
