
import { Flight, UserProfile, Booking, ABGroup, AutoReservation } from '../types';
import { MOCK_FLIGHTS, MOCK_USERS, MOCK_BOOKINGS, MOCK_AUTO_RESERVATIONS } from '../constants';

const KEYS = {
  FLIGHTS: 'thesis_flights',
  USERS: 'thesis_users',
  BOOKINGS: 'thesis_bookings',
  AUTO_RESERVATIONS: 'thesis_auto_reservations',
  CURRENT_USER: 'thesis_current_user',
  SETTINGS: 'thesis_settings'
};

export const initStorage = () => {
  // اگر دیتابیس پروازها خالی بود یا تعداد پروازها کم بود (نسخه قدیمی ۳ تایی)، بازنویسی کن
  const storedFlights = localStorage.getItem(KEYS.FLIGHTS);
  // حد آستانه را بالا بردیم (مثلا ۱۰۰) تا مطمئن شویم دیتابیس جدید ۵ تایی جایگزین می‌شود
  if (!storedFlights || JSON.parse(storedFlights).length < 100) {
    localStorage.setItem(KEYS.FLIGHTS, JSON.stringify(MOCK_FLIGHTS));
  }
  
  // تزریق ۱۰۰ کاربر آماده برای تحلیل ادمین
  const storedUsers = localStorage.getItem(KEYS.USERS);
  if (!storedUsers || JSON.parse(storedUsers).length < 80) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
  }

  // تزریق تاریخچه رزروها برای تحلیل آماری
  const storedBookings = localStorage.getItem(KEYS.BOOKINGS);
  if (!storedBookings || JSON.parse(storedBookings).length < 50) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(MOCK_BOOKINGS));
  }

  // تزریق درخواست های رزرو خودکار
  const storedAutoRes = localStorage.getItem(KEYS.AUTO_RESERVATIONS);
  if (!storedAutoRes || JSON.parse(storedAutoRes).length < 50) {
    localStorage.setItem(KEYS.AUTO_RESERVATIONS, JSON.stringify(MOCK_AUTO_RESERVATIONS));
  }

  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify({
      autoReservePrice: 1350000,
      autoReserveDesc: "این قابلیت از لایه ناظر هوشمند (AI Supervisor) استفاده می‌کند. سیستم با تحلیل رفتارهای قبلی شما و پایش مداوم ظرفیت ایرلاین‌ها، به محض یافتن پروازی که با پروفایل شخصیتی شما تطابق داشته باشد، رزرو را قطعی می‌کند."
    }));
  }
};

export const getSystemSettings = () => {
  return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
};

export const updateSystemSettings = (settings: any) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getFlights = (): Flight[] => {
  return JSON.parse(localStorage.getItem(KEYS.FLIGHTS) || '[]');
};

export const addFlight = (flight: Flight) => {
  const flights = getFlights();
  flights.unshift(flight);
  localStorage.setItem(KEYS.FLIGHTS, JSON.stringify(flights));
};

export const deleteFlight = (flightId: string) => {
  const flights = getFlights().filter(f => f.id !== flightId);
  localStorage.setItem(KEYS.FLIGHTS, JSON.stringify(flights));
};

export const getAllBookings = (): Booking[] => {
  return JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
};

export const getBookings = (userId: string): Booking[] => {
  return getAllBookings().filter(b => b.userId === userId);
};

export const createBooking = (booking: Booking) => {
  const all = getAllBookings();
  all.push(booking);
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(all));
};

export const getAllAutoReservations = (): AutoReservation[] => {
  return JSON.parse(localStorage.getItem(KEYS.AUTO_RESERVATIONS) || '[]');
};

export const getAutoReservations = (userId: string): AutoReservation[] => {
  return getAllAutoReservations().filter(ar => ar.userId === userId);
};

export const createAutoReservation = (ar: AutoReservation) => {
  const all = getAllAutoReservations();
  all.push(ar);
  localStorage.setItem(KEYS.AUTO_RESERVATIONS, JSON.stringify(all));
};

export const getAllUsers = (): UserProfile[] => {
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
};

export const saveUser = (user: UserProfile) => {
  const allUsers = getAllUsers();
  const index = allUsers.findIndex(u => u.id === user.id);
  if (index !== -1) {
    allUsers[index] = user;
  } else {
    allUsers.push(user);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(allUsers));
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
};

export const updateUserByAdmin = (user: UserProfile) => {
  const allUsers = getAllUsers();
  const index = allUsers.findIndex(u => u.id === user.id);
  if (index !== -1) {
    allUsers[index] = user;
    localStorage.setItem(KEYS.USERS, JSON.stringify(allUsers));
    
    const current = getCurrentUser();
    if (current && current.id === user.id) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }
};

export const getCurrentUser = (): UserProfile | null => {
  const u = localStorage.getItem(KEYS.CURRENT_USER);
  return u ? JSON.parse(u) : null;
};

export const logout = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};
