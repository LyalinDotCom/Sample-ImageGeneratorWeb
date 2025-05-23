'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gemini');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);
    setTextResponse(null);

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

      if (data.text && !data.imageData) {
        setTextResponse(data.text);
        if (data.error) {
          setError(data.error);
        }
      } else if (data.imageData) {
        const mimeType = data.mimeType || 'image/png';
        setImageUrl(`data:${mimeType};base64,${data.imageData}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          AI Image Generator
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Select Model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gemini">Gemini</option>
              <option value="imagen">Imagen</option>
            </select>
          </div>

          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe the image you want to generate
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="A beautiful sunset over mountains with a lake in the foreground..."
          />
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>

          {error && (
            <p className="mt-4 text-red-600 text-sm">{error}</p>
          )}
        </div>

        {imageUrl && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Image</h2>
            <img
              src={imageUrl}
              alt="Generated artwork"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {textResponse && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Response</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{textResponse}</p>
          </div>
        )}
      </div>
    </main>
  );
}