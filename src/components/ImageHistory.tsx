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
    if (confirm('Are you sure you want to delete this image?')) {
      deleteFromHistory(id);
    }
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `imagegen-${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div key={item.id} className="flex flex-col gap-2">
            <div className="group relative">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                style={{backgroundImage: `url(${item.imageUrl})`}}
                onClick={() => handleDownload(item.imageUrl, item.prompt)}
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(item.imageUrl, item.prompt)}
                  className="bg-black/50 text-white p-1.5 rounded-lg hover:bg-black/70"
                  title="Download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-black/50 text-white p-1.5 rounded-lg hover:bg-black/70"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[#9cabba] text-xs font-medium uppercase tracking-wider">
                {item.model === 'gemini' ? 'Gemini' : 'Imagen'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}