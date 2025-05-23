export interface ImageHistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  timestamp: number;
}

const HISTORY_KEY = 'imageHistory';
const MAX_HISTORY_ITEMS = 20; // Reduced from 50
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit for safety

// Helper to estimate size of data in bytes
const getDataSize = (data: any): number => {
  return new Blob([JSON.stringify(data)]).size;
};

// Helper to clean up old items if storage is getting full
const cleanupOldItems = (history: ImageHistoryItem[]): ImageHistoryItem[] => {
  let cleaned = [...history];
  let currentSize = getDataSize(cleaned);
  
  // Remove oldest items until we're under the limit
  while (currentSize > MAX_STORAGE_SIZE && cleaned.length > 1) {
    cleaned.pop(); // Remove oldest item
    currentSize = getDataSize(cleaned);
  }
  
  return cleaned;
};

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
    let updatedHistory = [newItem, ...history];

    // Keep only the latest MAX_HISTORY_ITEMS
    updatedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    
    // Clean up if storage is getting full
    updatedHistory = cleanupOldItems(updatedHistory);

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (storageError) {
      // If still failing, try more aggressive cleanup
      console.warn('Storage quota exceeded, removing older items...');
      updatedHistory = updatedHistory.slice(0, Math.floor(updatedHistory.length / 2));
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (finalError) {
        // Last resort: clear history and save only new item
        console.error('Storage critically full, clearing history...');
        localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem]));
      }
    }
    
    // Trigger a custom event to notify components
    window.dispatchEvent(new CustomEvent('imageHistoryUpdated'));
    
    return newItem;
  } catch (error) {
    console.error('Error saving to history:', error);
    // Try to clear corrupted data
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear corrupted history');
    }
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

// Get storage usage info
export const getStorageInfo = () => {
  try {
    const history = getImageHistory();
    const dataSize = getDataSize(history);
    const itemCount = history.length;
    
    return {
      itemCount,
      dataSizeBytes: dataSize,
      dataSizeMB: (dataSize / (1024 * 1024)).toFixed(2),
      percentUsed: ((dataSize / MAX_STORAGE_SIZE) * 100).toFixed(1)
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};