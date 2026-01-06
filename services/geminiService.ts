
import { GoogleGenAI, Type } from "@google/genai";
import { Flight, UserProfile, SupervisorResult } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSupervisoryAnalysis = async (flight: Flight, user: UserProfile): Promise<SupervisorResult> => {
  const ai = getAIClient();
  
  const thesisContext = flight.thesisDemoData ? `
    پارامترهای سناریوی شبیه‌سازی پایان‌نامه:
    - وضعیت تأخیر در لحظه تصمیم‌گیری: ${flight.thesisDemoData.simulatedDelayMinutes} دقیقه.
    - شاخص پشیمانی پیش‌بینی شده (Regret Index): ${flight.thesisDemoData.regretIndex}.
    - استراتژی لایه ناظر: ${flight.thesisDemoData.supervisorNote}.
  ` : "";

  const prompt = `
    شما هسته مرکزی لایه ناظر هوشمند (AI Supervisor) در یک سامانه رزرواسیون پرواز برای پایان‌نامه ارشد هستید.
    وظیفه شما: ارائه یک "تحلیل جامع عصبی-رفتاری" برای رزرو این پرواز.

    مشخصات سوژه (User Profile):
    - تیپ شخصیتی (Big Five): 
      - گشودگی (Openness): ${user.personality.openness}/5
      - وظیفه‌شناسی (Conscientiousness): ${user.personality.conscientiousness}/5
      - برون‌گرایی (Extroversion): ${user.personality.extroversion}/5
      - سازگاری (Agreeableness): ${user.personality.agreeableness}/5
      - روان‌رنجوری (Neuroticism): ${user.personality.neuroticism}/5
    - میانگین بودجه سوابق: ${user.history.avgPrice}.
    
    ${thesisContext}

    مشخصات پرواز:
    - ایرلاین: ${flight.airline}، قیمت: ${flight.price}، نمره کیفیت: ${flight.qualityScore}.
    - نوع هواپیما: ${flight.aircraftType}.

    خروجی مورد انتظار در قالب JSON:
    1. finalScore: نمره تطابق نهایی (بین 0 تا 1).
    2. explanation: یک تحلیل علمی و تخصصی به زبان فارسی (حداقل 3 جمله) که توضیح دهد چگونه ویژگی‌های شخصیتی کاربر با پارامترهای پرواز (به خصوص تأخیر و قیمت) تلاقی پیدا کرده و چرا این گزینه پیشنهاد می‌شود یا نمی‌شود. به شاخص پشیمانی (Regret Index) مستقیماً اشاره کنید.
    3. scores: نمرات تفکیکی (0 تا 1) برای: price (ارزش در برابر قیمت)، delayRisk (پایداری زمانی)، airlineQuality (کیفیت برند)، preferenceMatch (تطابق روان‌شناختی).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          finalScore: { type: Type.NUMBER },
          status: { type: Type.STRING },
          explanation: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              price: { type: Type.NUMBER },
              delayRisk: { type: Type.NUMBER },
              airlineQuality: { type: Type.NUMBER },
              preferenceMatch: { type: Type.NUMBER }
            },
            required: ["price", "delayRisk", "airlineQuality", "preferenceMatch"]
          }
        },
        required: ["finalScore", "status", "explanation", "scores"]
      }
    }
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr);
};

export const rankFlightsForUser = async (flights: Flight[], user: UserProfile): Promise<Flight[]> => {
  const ai = getAIClient();
  const prompt = `
    بر اساس اولویت‌های زیر، این لیست پرواز را برای کاربر رتبه‌بندی کن و فقط آرایه‌ای از IDها را برگردان.
    اولویت کاربر: قیمت نزدیک به ${user.history.avgPrice} و ایرلاین‌های ${user.history.preferredAirlines.join(', ')}.
    پروازها: ${JSON.stringify(flights)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  const jsonStr = response.text?.trim() || "[]";
  const rankedIds = JSON.parse(jsonStr);
  return rankedIds.map((id: string) => flights.find(f => f.id === id)).filter(Boolean) as Flight[];
};
