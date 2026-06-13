import AsyncStorage from '@react-native-async-storage/async-storage';

export type EventType = 'decathlon' | 'menHeptathlon' | 'womenHeptathlon' | 'womenPentathlon';

export interface SavedScore {
  id: string;
  title: string;
  eventType: EventType;
  results: string[];
  points: number[];
  totalScore: number;
  resultScore: string;
  dateSaved: string;
}

const STORAGE_KEY = '@saved_scores';

export class SavedScoresStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SavedScoresStorageError';
  }
}

let saveQueue: Promise<void> = Promise.resolve();

function generateScoreId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidSavedScore(value: unknown): value is SavedScore {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const score = value as SavedScore;
  return (
    typeof score.id === 'string' &&
    typeof score.title === 'string' &&
    typeof score.eventType === 'string' &&
    Array.isArray(score.results) &&
    Array.isArray(score.points) &&
    typeof score.totalScore === 'number' &&
    typeof score.resultScore === 'string' &&
    typeof score.dateSaved === 'string'
  );
}

export const getSavedScores = async (): Promise<SavedScore[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      throw new SavedScoresStorageError('Saved scores data is corrupted.');
    }

    return parsed.filter(isValidSavedScore);
  } catch (error) {
    if (error instanceof SavedScoresStorageError) {
      throw error;
    }
    console.error('Error loading scores:', error);
    throw new SavedScoresStorageError('Failed to load saved scores.');
  }
};

export const getSavedScoreById = async (id: string): Promise<SavedScore | null> => {
  const scores = await getSavedScores();
  return scores.find((score) => score.id === id) ?? null;
};

export const saveScore = async (score: Omit<SavedScore, 'id' | 'dateSaved'>): Promise<void> => {
  const task = async () => {
    try {
      const existingScores = await getSavedScores();
      const newScore: SavedScore = {
        ...score,
        id: generateScoreId(),
        dateSaved: new Date().toISOString(),
      };
      const updatedScores = [newScore, ...existingScores];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
      const { trackScoreSaved } = await import("./reviewPrompt");
      void trackScoreSaved();
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  };

  saveQueue = saveQueue.then(task, task);
  return saveQueue;
};

export const deleteScore = async (id: string): Promise<void> => {
  const task = async () => {
    try {
      const existingScores = await getSavedScores();
      const updatedScores = existingScores.filter((score) => score.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
    } catch (error) {
      console.error('Error deleting score:', error);
      throw error;
    }
  };

  saveQueue = saveQueue.then(task, task);
  return saveQueue;
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

/** Abbreviated labels for bar charts — matches calculator EVENT_LABELS */
export const getEventChartLabels = (eventType: EventType): string[] => {
  switch (eventType) {
    case 'decathlon':
      return ["100m", "LJ", "SP", "HJ", "400m", "110H", "DT", "PV", "JT", "1500m"];
    case 'menHeptathlon':
      return ["60m", "LJ", "SP", "HJ", "60H", "PV", "1000m"];
    case 'womenHeptathlon':
      return ["100H", "HJ", "SP", "200m", "LJ", "JT", "800m"];
    case 'womenPentathlon':
      return ["60H", "HJ", "SP", "LJ", "800m"];
    default:
      return [];
  }
};
