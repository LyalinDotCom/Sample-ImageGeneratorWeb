export interface ImageHistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  timestamp: number;
}

const HISTORY_KEY = 'imageHistory';
const MAX_HISTORY_ITEMS = 50;

export const saveImageToHistory = (imageUrl: string, prompt: string, model: string) => {
  try {
    const history = getImageHistory();
    const newItem: ImageHistoryItem = {
      id: Date.now().toString(),
      imageUrl,
      prompt,
      model,
      timestamp: Date.now()
    };

    // Add new item to the beginning
    const updatedHistory = [newItem, ...history];

    // Keep only the latest MAX_HISTORY_ITEMS
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    
    // Trigger a custom event to notify components
    window.dispatchEvent(new CustomEvent('imageHistoryUpdated'));
    
    return newItem;
  } catch (error) {
    console.error('Error saving to history:', error);
    return null;
  }
};

export const getImageHistory = (): ImageHistoryItem[] => {
  try {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

export const deleteFromHistory = (id: string) => {
  try {
    const history = getImageHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    window.dispatchEvent(new CustomEvent('imageHistoryUpdated'));
  } catch (error) {
    console.error('Error deleting from history:', error);
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new CustomEvent('imageHistoryUpdated'));
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};