import AsyncStorage from '@react-native-async-storage/async-storage';

export type EventType = 'decathlon' | 'menHeptathlon' | 'womenHeptathlon' | 'womenPentathlon';

export interface SavedScore {
  id: string;
  title: string;
  eventType: EventType;
  results: string[]; // Individual event performances
  points: number[]; // Individual event points
  totalScore: number;
  resultScore: string; // World Athletics ranking score
  dateSaved: string; // ISO date string
}

const STORAGE_KEY = '@saved_scores';

export const saveScore = async (score: Omit<SavedScore, 'id' | 'dateSaved'>): Promise<void> => {
  try {
    const existingScores = await getSavedScores();
    const newScore: SavedScore = {
      ...score,
      id: Date.now().toString(),
      dateSaved: new Date().toISOString(),
    };
    const updatedScores = [newScore, ...existingScores];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
};

export const getSavedScores = async (): Promise<SavedScore[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading scores:', error);
    return [];
  }
};

export const deleteScore = async (id: string): Promise<void> => {
  try {
    const existingScores = await getSavedScores();
    const updatedScores = existingScores.filter(score => score.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error('Error deleting score:', error);
    throw error;
  }
};

export const getEventTypeDisplayName = (eventType: EventType): string => {
  switch (eventType) {
    case 'decathlon':
      return "Men's Decathlon";
    case 'menHeptathlon':
      return "Men's Heptathlon";
    case 'womenHeptathlon':
      return "Women's Heptathlon";
    case 'womenPentathlon':
      return "Women's Pentathlon";
    default:
      return eventType;
  }
};

export const getEventNames = (eventType: EventType): string[] => {
  switch (eventType) {
    case 'decathlon':
      return [
        "100m",
        "Long Jump",
        "Shot Put",
        "High Jump",
        "400m",
        "110m Hurdles",
        "Discus",
        "Pole Vault",
        "Javelin",
        "1500m",
      ];
    case 'menHeptathlon':
      return [
        "60m",
        "Long Jump",
        "Shot Put",
        "High Jump",
        "60m Hurdles",
        "Pole Vault",
        "1000m",
      ];
    case 'womenHeptathlon':
      return [
        "100m Hurdles",
        "High Jump",
        "Shot Put",
        "200m",
        "Long Jump",
        "Javelin Throw",
        "800m",
      ];
    case 'womenPentathlon':
      return [
        "60m Hurdles",
        "High Jump",
        "Shot Put",
        "Long Jump",
        "800m",
      ];
    default:
      return [];
  }
};

