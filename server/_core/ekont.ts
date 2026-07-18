/**
 * Ekont Shipping Integration
 * Provides methods to fetch cities and offices from Ekont API
 */

// Mock Ekont data - In production, integrate with real Ekont API
// For now, using hardcoded Bulgarian cities and offices

export interface EkontCity {
  id: string;
  name: string;
}

export interface EkontOffice {
  id: string;
  name: string;
  address: string;
  cityId: string;
}

// Hardcoded Bulgarian cities (top 20 by population)
const BULGARIAN_CITIES: EkontCity[] = [
  { id: "1", name: "София" },
  { id: "2", name: "Пловдив" },
  { id: "3", name: "Варна" },
  { id: "4", name: "Бургас" },
  { id: "5", name: "Русе" },
  { id: "6", name: "Стара Загора" },
  { id: "7", name: "Плевен" },
  { id: "8", name: "Сливен" },
  { id: "9", name: "Добрич" },
  { id: "10", name: "Шумен" },
  { id: "11", name: "Перник" },
  { id: "12", name: "Дупница" },
  { id: "13", name: "Сандански" },
  { id: "14", name: "Благоевград" },
  { id: "15", name: "Монтана" },
  { id: "16", name: "Видин" },
  { id: "17", name: "Кюстендил" },
  { id: "18", name: "Габрово" },
  { id: "19", name: "Велико Търново" },
  { id: "20", name: "Ямбол" },
];

// Hardcoded offices by city (mock data)
const OFFICES_BY_CITY: Record<string, EkontOffice[]> = {
  "1": [
    { id: "1-1", name: "Еконт - София Център", address: "бул. Витоша 2", cityId: "1" },
    { id: "1-2", name: "Еконт - София Север", address: "ул. Александър Батенберг 33", cityId: "1" },
    { id: "1-3", name: "Еконт - София Юг", address: "ул. Княз Александър 1", cityId: "1" },
  ],
  "2": [
    { id: "2-1", name: "Еконт - Пловдив Център", address: "ул. Александър Батенберг 1", cityId: "2" },
    { id: "2-2", name: "Еконт - Пловдив Север", address: "ул. Райна Княгиня 50", cityId: "2" },
  ],
  "3": [
    { id: "3-1", name: "Еконт - Варна Център", address: "ул. Княз Борис I 1", cityId: "3" },
    { id: "3-2", name: "Еконт - Варна Море", address: "ул. Морска 25", cityId: "3" },
  ],
  "4": [
    { id: "4-1", name: "Еконт - Бургас", address: "ул. Александър Батенберг 1", cityId: "4" },
  ],
  "5": [
    { id: "5-1", name: "Еконт - Русе", address: "ул. Александър Батенберг 1", cityId: "5" },
  ],
  "6": [
    { id: "6-1", name: "Еконт - Стара Загора", address: "ул. Александър Батенберг 1", cityId: "6" },
  ],
  "7": [
    { id: "7-1", name: "Еконт - Плевен", address: "ул. Александър Батенберг 1", cityId: "7" },
  ],
  "8": [
    { id: "8-1", name: "Еконт - Сливен", address: "ул. Александър Батенберг 1", cityId: "8" },
  ],
  "9": [
    { id: "9-1", name: "Еконт - Добрич", address: "ул. Александър Батенберг 1", cityId: "9" },
  ],
  "10": [
    { id: "10-1", name: "Еконт - Шумен", address: "ул. Александър Батенберг 1", cityId: "10" },
  ],
};

/**
 * Get all available Bulgarian cities
 */
export async function getCities(): Promise<EkontCity[]> {
  try {
    // In production, call real Ekont API
    // const response = await fetch('https://api.ekont.bg/cities', {
    //   headers: { 'Authorization': `Bearer ${EKONT_API_KEY}` }
    // });
    // return response.json();

    // For now, return mock data
    return BULGARIAN_CITIES;
  } catch (error) {
    console.error("[Ekont] Error fetching cities:", error);
    throw error;
  }
}

/**
 * Get offices for a specific city
 */
export async function getOfficesByCity(cityId: string): Promise<EkontOffice[]> {
  try {
    // In production, call real Ekont API
    // const response = await fetch(`https://api.ekont.bg/cities/${cityId}/offices`, {
    //   headers: { 'Authorization': `Bearer ${EKONT_API_KEY}` }
    // });
    // return response.json();

    // For now, return mock data
    return OFFICES_BY_CITY[cityId] || [];
  } catch (error) {
    console.error("[Ekont] Error fetching offices:", error);
    throw error;
  }
}

/**
 * Calculate shipping cost (mock implementation)
 */
export async function calculateShippingCost(
  cityId: string,
  weight: number = 1
): Promise<number> {
  try {
    // In production, call real Ekont API
    // const response = await fetch('https://api.ekont.bg/shipping/calculate', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${EKONT_API_KEY}` },
    //   body: JSON.stringify({ cityId, weight })
    // });
    // return response.json();

    // Mock pricing: 5.99 BGN base + 0.50 BGN per kg
    const baseCost = 5.99;
    const weightCost = weight * 0.5;
    return baseCost + weightCost;
  } catch (error) {
    console.error("[Ekont] Error calculating shipping:", error);
    throw error;
  }
}
