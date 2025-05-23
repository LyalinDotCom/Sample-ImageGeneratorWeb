'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ImageHistory from '@/components/ImageHistory';
import { saveImageToHistory } from '@/utils/imageCache';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gemini');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (data.imageData) {
        const mimeType = data.mimeType || 'image/png';
        const generatedImageUrl = `data:${mimeType};base64,${data.imageData}`;
        setImageUrl(generatedImageUrl);
        
        // Save to history
        saveImageToHistory(generatedImageUrl, prompt, model);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Unleash your creativity with AI-powered image generation
            </h2>
            
            <div className="flex flex-col gap-4 px-4 py-3">
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 mx-auto w-full">
                <label className="flex flex-col min-w-40 flex-1">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="form-select mb-2 w-full rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] h-12 px-4 text-base font-normal leading-normal"
                  >
                    <option value="gemini">Gemini</option>
                    <option value="imagen">Imagen</option>
                  </select>
                  
                  <input
                    placeholder="Describe the image you want to create"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9cabba] p-4 text-base font-normal leading-normal"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex px-4 py-3 justify-center">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#0c7ff2] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a6dd4] transition-colors"
              >
                <span className="truncate">{loading ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>

            {error && (
              <div className="px-4 py-2">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col gap-3 p-4">
                <div className="flex gap-6 justify-between">
                  <p className="text-white text-base font-medium leading-normal">Generating image...</p>
                </div>
                <div className="rounded bg-[#3b4754]">
                  <div 
                    className="h-2 rounded bg-white transition-all duration-300 ease-out" 
                    style={{width: `${progress}%`}}
                  />
                </div>
                <p className="text-[#9cabba] text-sm font-normal leading-normal">This may take a few seconds</p>
              </div>
            )}

            {imageUrl && !loading && (
              <div className="flex w-full grow bg-[#111418] @container p-4">
                <div className="w-full gap-1 overflow-hidden bg-[#111418] @[480px]:gap-2 aspect-[3/2] rounded-xl flex">
                  <div
                    className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                    style={{backgroundImage: `url(${imageUrl})`}}
                  />
                </div>
              </div>
            )}

            <ImageHistory />
          </div>
        </div>
      </div>
    </div>
  );
}