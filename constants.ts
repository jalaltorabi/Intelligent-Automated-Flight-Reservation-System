
import { Flight, ABGroup, UserProfile, Booking, AutoReservation } from './types';

export const IRAN_PROVINCES = [
  "تهران", "خراسان رضوی", "فارس", "هرمزگان", "آذربایجان شرقی", "اصفهان", "خوزستان", "مازندران", "گیلان", "یزد"
];

export const SHAMSI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

export const TRAIT_LABELS: Record<string, string> = {
  openness: 'گشودگی به تجربه',
  conscientiousness: 'وظیفه‌شناسی',
  extroversion: 'برون‌گرایی',
  agreeableness: 'سازگاری/توافق‌پذیری',
  neuroticism: 'روان‌رنجوری'
};

const AIRLINES = [
  { name: 'Mahan Air', quality: 0.95, aircraft: 'Airbus A340' },
  { name: 'Iran Air', quality: 0.85, aircraft: 'Airbus A320' },
  { name: 'Aseman', quality: 0.65, aircraft: 'Fokker 100' },
  { name: 'Qeshm Air', quality: 0.88, aircraft: 'RJ-100' },
  { name: 'Kish Air', quality: 0.75, aircraft: 'MD-82' },
  { name: 'Zagros', quality: 0.70, aircraft: 'MD-83' },
  { name: 'Varesh', quality: 0.80, aircraft: 'Boeing 737' },
  { name: 'ATA', quality: 0.60, aircraft: 'MD-80' }
];

// --- 1. FLIGHT GENERATION ---
const generateMockFlights = (): Flight[] => {
  const flights: Flight[] = [];
  // مسیرهایی که باید پرواز داشته باشند (اصفهان را اینجا فیلتر نمی‌کنیم، در حلقه شرط می‌گذاریم)
  const activeProvinces = ["تهران", "خراسان رضوی", "فارس", "هرمزگان", "آذربایجان شرقی", "خوزستان", "اصفهان"];

  activeProvinces.forEach(origin => {
    activeProvinces.forEach(destination => {
      if (origin === destination) return;

      // *** SCENARIO EXCEPTION: Empty Flights for Isfahan <-> Tehran ***
      // این شرط باعث می‌شود دکمه "رزرو خودکار" در این مسیرها فعال شود
      if ((origin === 'اصفهان' && destination === 'تهران') || (origin === 'تهران' && destination === 'اصفهان')) {
        return; 
      }

      // Generate 5 flights per route
      for (let i = 1; i <= 5; i++) {
        const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
        
        // سناریوهای مختلف بر اساس اندیس حلقه
        // 1: صبح زود - لوکس و مطمئن
        // 2: ظهر - استاندارد و با کیفیت
        // 3: عصر - معمولی و متعادل
        // 4: غروب - اقتصادی با کمی ریسک
        // 5: آخر شب - ارزان و پرریسک (چارتر)
        
        const isPremium = i === 1;
        const isStandard = i === 2 || i === 3;
        const isBudget = i === 4;
        const isRisky = i === 5;

        const basePrice = 1000000 + (Math.random() * 2000000);
        let finalPrice = basePrice;
        
        if (isPremium) finalPrice = basePrice * 1.6;
        else if (isStandard) finalPrice = basePrice * 1.1;
        else if (isBudget) finalPrice = basePrice * 0.8;
        else if (isRisky) finalPrice = basePrice * 0.6; // خیلی ارزان

        // زمان‌بندی پخش شده در طول روز
        const hour = 6 + (i * 3); // 9, 12, 15, 18, 21
        
        let simulatedDelay = 0;
        let regretIdx = 0.1;
        let note = "";

        if (isPremium) {
           simulatedDelay = 0;
           regretIdx = 0.05;
           note = "گزینه ایمن (Safe Bet)؛ ایده‌آل برای افراد با وظیفه‌شناسی بالا.";
        } else if (isStandard) {
           simulatedDelay = 10;
           regretIdx = 0.15;
           note = "گزینه متعادل؛ توازن مناسب بین قیمت و کیفیت.";
        } else if (isBudget) {
           simulatedDelay = 35;
           regretIdx = 0.45;
           note = "گزینه اقتصادی؛ مناسب برای بودجه‌های محدود اما با ریسک تأخیر متوسط.";
        } else if (isRisky) {
           simulatedDelay = 90;
           regretIdx = 0.85;
           note = "ریسک بسیار بالا (High Risk)؛ فقط برای کاربران با گشودگی بسیار بالا پیشنهاد می‌شود.";
        }

        flights.push({
          id: `FL-${origin.substr(0,2)}-${destination.substr(0,2)}-${Math.floor(Math.random()*100000)}`,
          airline: airline.name,
          origin,
          destination,
          departureTime: `1404/10/15T${hour < 10 ? '0'+hour : hour}:00:00`,
          arrivalTime: `1404/10/15T${hour+1 < 10 ? '0'+(hour+1) : hour+1}:30:00`,
          price: Math.floor(finalPrice / 10000) * 10000,
          availableSeats: Math.floor(Math.random() * 50) + 1,
          delayHistory: [],
          qualityScore: isPremium ? 0.98 : isRisky ? 0.5 : airline.quality,
          aircraftType: airline.aircraft,
          classType: isPremium ? 'Business' : 'Economy',
          allowedLuggage: isPremium ? '30kg' : '20kg',
          thesisDemoData: {
            simulatedDelayMinutes: simulatedDelay,
            regretIndex: regretIdx,
            supervisorNote: note
          }
        });
      }
    });
  });
  return flights;
};

export const MOCK_FLIGHTS = generateMockFlights();


// --- 2. USER GENERATION ---
const MALE_NAMES = ["علی", "رضا", "محمد", "حسین", "امیر", "آرش", "بابک", "سهراب", "کامران", "نیما", "احسان", "محسن", "جلال", "مهدی", "فرهاد", "سعید", "حمید", "پژمان", "کیان", "اشکان"];
const FEMALE_NAMES = ["سارا", "مریم", "زهرا", "نازنین", "الناز", "مینا", "پریسا", "رویا", "شیوا", "بهار", "نگین", "لیلا", "سمیرا", "هانیه", "فاطمه", "آرزو", "مهسا", "کتایون", "نیلوفر", "سپیده"];
const LAST_NAMES = ["تهرانی", "رضایی", "محمدی", "امیری", "کریمی", "حسینی", "موسوی", "جعفری", "صادقی", "باقری", "رحیمی", "کاظمی", "ابراهیمی", "نوری", "مقدم", "حیدری", "فراهانی", "شریفی", "قاسمی", "راد"];

const generateMockData = () => {
  const users: UserProfile[] = [];
  const bookings: Booking[] = [];
  const autoReservations: AutoReservation[] = [];
  const groups = [ABGroup.CONTROL, ABGroup.AUTO_BASIC, ABGroup.AUTO_SUPERVISED];

  for (let i = 1; i <= 100; i++) {
    const isMale = i <= 50;
    const fn = isMale ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    // Personality Generation (Random but biased for variety)
    const p = {
      openness: Math.floor(Math.random() * 5) + 1,
      conscientiousness: Math.floor(Math.random() * 5) + 1,
      extroversion: Math.floor(Math.random() * 5) + 1,
      agreeableness: Math.floor(Math.random() * 5) + 1,
      neuroticism: Math.floor(Math.random() * 5) + 1,
    };

    const user: UserProfile = {
      id: `USR-${1000 + i}`,
      name: `${fn} ${ln}`,
      email: `user${i}@thesis.ac.ir`,
      abGroup: groups[i % 3],
      personality: p,
      history: {
        avgPrice: 1500000 + (Math.random() * 1000000),
        preferredAirlines: i % 2 === 0 ? ['Mahan Air', 'Iran Air'] : ['Aseman', 'Zagros'],
        travelFrequency: Math.floor(Math.random() * 12) + 1
      }
    };
    users.push(user);

    // Generate 3 Random Confirmed Bookings per user
    for (let b = 0; b < 3; b++) {
      const randomFlight = MOCK_FLIGHTS[Math.floor(Math.random() * MOCK_FLIGHTS.length)];
      bookings.push({
        id: `BK-${user.id}-${b}`,
        flightId: randomFlight.id,
        userId: user.id,
        bookingDate: `1404/0${Math.floor(Math.random()*9)+1}/${Math.floor(Math.random()*28)+1}T10:00:00`,
        status: 'confirmed',
        flightDetails: randomFlight
      });
    }

    // Generate 3 Random Auto Reservations per user
    const autoRoutes = [
      {o: 'اصفهان', d: 'تهران'}, // The empty route
      {o: 'تهران', d: 'مشهد'},
      {o: 'شیراز', d: 'کیش'}
    ];
    
    for (let ar = 0; ar < 3; ar++) {
      const route = autoRoutes[ar % autoRoutes.length];
      autoReservations.push({
        id: `AR-${user.id}-${ar}`,
        userId: user.id,
        origin: route.o,
        destination: route.d,
        desiredDate: `1404/10/${15 + ar}`,
        suggestedPrice: user.history.avgPrice * 0.9,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }
  }

  return { users, bookings, autoReservations };
};

const generatedData = generateMockData();
export const MOCK_USERS = generatedData.users;
export const MOCK_BOOKINGS = generatedData.bookings;
export const MOCK_AUTO_RESERVATIONS = generatedData.autoReservations;

export const INITIAL_METRICS = {
  [ABGroup.CONTROL]: { conversionRate: 12.5, aov: 1450000, apri: 0.42 },
  [ABGroup.AUTO_BASIC]: { conversionRate: 15.2, aov: 1620000, apri: 0.58 },
  [ABGroup.AUTO_SUPERVISED]: { conversionRate: 18.9, aov: 1750000, apri: 0.21 }
};
