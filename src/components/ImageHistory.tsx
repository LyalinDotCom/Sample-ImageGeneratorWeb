'use client';

import { useEffect, useState } from 'react';
import { 
  ImageHistoryItem, 
  getImageHistory, 
  deleteFromHistory, 
  clearHistory as clearHistoryUtil 
} from '@/utils/imageCache';

export default function ImageHistory() {
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();

    // Listen for history updates
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    window.addEventListener('imageHistoryUpdated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('imageHistoryUpdated', handleHistoryUpdate);
    };
  }, []);

  const loadHistory = () => {
    setHistory(getImageHistory());
  };

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
  };

  const handleClearAll = () => {
    clearHistoryUtil();
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">History</h2>
        <button
          onClick={handleClearAll}
          className="text-[#9cabba] hover:text-white text-sm font-medium transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {history.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 group relative">
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
              style={{backgroundImage: `url(${item.imageUrl})`}}
              onClick={() => {
                // Optional: implement full-screen view or download
              }}
            />
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-1.5 rounded-lg hover:bg-black/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}