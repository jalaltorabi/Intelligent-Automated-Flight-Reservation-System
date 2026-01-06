
export enum ABGroup {
  CONTROL = 'control',
  AUTO_BASIC = 'auto_basic',
  AUTO_SUPERVISED = 'auto_supervised'
}

export interface ABMetrics {
  conversionRate: number;
  aov: number;
  apri: number;
}

export interface Flight {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  delayHistory: { date: string; delayed: boolean }[];
  qualityScore: number;
  aircraftType: string;
  classType: 'Economy' | 'Business' | 'First';
  allowedLuggage: string;
  thesisDemoData?: {
    simulatedDelayMinutes: number;
    regretIndex: number; // 0 to 1
    supervisorNote: string;
    targetPersonality?: {
      openness: number;
      conscientiousness: number;
      extroversion: number;
      agreeableness: number;
      neuroticism: number;
    };
  };
}

export interface Booking {
  id: string;
  flightId: string;
  userId: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  flightDetails: Flight;
}

export interface AutoReservation {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  desiredDate: string;
  suggestedPrice: number;
  status: 'pending' | 'matched' | 'expired';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  abGroup: ABGroup;
  personality: {
    openness: number;
    conscientiousness: number;
    extroversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  history: {
    avgPrice: number;
    preferredAirlines: string[];
    travelFrequency: number;
  };
}

export interface SupervisorResult {
  finalScore: number;
  status: 'approved' | 'requires_confirmation' | 'rejected';
  explanation: string;
  scores: {
    price: number;
    delayRisk: number;
    airlineQuality: number;
    preferenceMatch: number;
  };
}
