'use client';

import { useState } from 'react';

export interface ImagenSettings {
  // Basic
  subject: string;
  context: string;
  style: string;
  
  // Photography
  proximity: string;
  cameraAngle: string;
  lighting: string;
  focusEffect: string;
  lensType: string;
  filmStyle: string;
  
  // Art Style
  artMovement: string;
  
  // Material & Shape
  material: string;
  shape: string;
  useMaterialShape: boolean;
  
  // Text
  text: string;
  fontStyle: string;
  layoutTemplate: string;
  useText: boolean;
  
  // Quality
  aspectRatio: string;
  generalQuality: string[];
  photoQuality: string;
  
  // Specialized Modes
  photographyMode: string;
  specializedSettings: {
    portrait: {
      focalLength: string;
      effect: string;
      duotone: string[];
    };
    macro: {
      focalLength: string;
    };
    action: {
      shutterSpeed: string;
    };
    landscape: {
      focalLength: string;
      exposure: string;
    };
  };
}

const defaultSettings: ImagenSettings = {
  subject: '',
  context: '',
  style: 'photograph',
  proximity: 'normal',
  cameraAngle: 'eye-level',
  lighting: 'natural',
  focusEffect: 'sharp',
  lensType: '50mm',
  filmStyle: 'color',
  artMovement: '',
  material: '',
  shape: '',
  useMaterialShape: false,
  text: '',
  fontStyle: 'bold',
  layoutTemplate: 'poster',
  useText: false,
  aspectRatio: '1:1',
  generalQuality: [],
  photoQuality: '4k',
  photographyMode: 'general',
  specializedSettings: {
    portrait: {
      focalLength: '35mm',
      effect: 'normal',
      duotone: ['blue', 'grey']
    },
    macro: {
      focalLength: '60mm'
    },
    action: {
      shutterSpeed: 'fast'
    },
    landscape: {
      focalLength: '10mm',
      exposure: 'normal'
    }
  }
};

interface ImagenControlsProps {
  onSettingsChange: (settings: ImagenSettings) => void;
}

export default function ImagenControls({ onSettingsChange }: ImagenControlsProps) {
  const [settings, setSettings] = useState<ImagenSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('basic');

  const updateSettings = (updates: Partial<ImagenSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const updateSpecializedSettings = (mode: string, updates: any) => {
    const newSettings = {
      ...settings,
      specializedSettings: {
        ...settings.specializedSettings,
        [mode]: {
          ...settings.specializedSettings[mode as keyof typeof settings.specializedSettings],
          ...updates
        }
      }
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="bg-[#1a1d23] rounded-xl p-4 mb-4">
      <h3 className="text-white text-lg font-bold mb-4">Imagen Advanced Controls</h3>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['basic', 'photography', 'art', 'effects', 'quality'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-[#0c7ff2] text-white' 
                : 'bg-[#283039] text-[#9cabba] hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Subject</label>
            <input
              type="text"
              value={settings.subject}
              onChange={(e) => updateSettings({ subject: e.target.value })}
              placeholder="e.g., cat, building, landscape"
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Context/Background</label>
            <select
              value={settings.context}
              onChange={(e) => updateSettings({ context: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="">None</option>
              <option value="studio">Studio</option>
              <option value="outdoors">Outdoors</option>
              <option value="indoor">Indoor</option>
              <option value="park">Park</option>
              <option value="urban">Urban</option>
              <option value="nature">Nature</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Base Style</label>
            <select
              value={settings.style}
              onChange={(e) => updateSettings({ style: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="photograph">Photograph</option>
              <option value="painting">Painting</option>
              <option value="sketch">Sketch</option>
              <option value="digital art">Digital Art</option>
              <option value="3d render">3D Render</option>
              <option value="watercolor">Watercolor</option>
              <option value="oil painting">Oil Painting</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '1:1', label: 'Square' },
                { value: '4:3', label: '4:3' },
                { value: '3:4', label: '3:4' },
                { value: '16:9', label: '16:9' },
                { value: '9:16', label: '9:16' }
              ].map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => updateSettings({ aspectRatio: ratio.value })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    settings.aspectRatio === ratio.value
                      ? 'bg-[#0c7ff2] text-white'
                      : 'bg-[#283039] text-[#9cabba] hover:text-white'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photography Tab */}
      {activeTab === 'photography' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Photography Mode</label>
            <select
              value={settings.photographyMode}
              onChange={(e) => updateSettings({ photographyMode: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="general">General</option>
              <option value="portrait">Portrait</option>
              <option value="macro">Macro</option>
              <option value="action">Action</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Proximity</label>
            <input
              type="range"
              min="0"
              max="4"
              value={['close-up', 'near', 'normal', 'far', 'zoomed-out'].indexOf(settings.proximity)}
              onChange={(e) => updateSettings({ 
                proximity: ['close-up', 'near', 'normal', 'far', 'zoomed-out'][parseInt(e.target.value)] 
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#9cabba] mt-1">
              <span>Close-up</span>
              <span>Far away</span>
            </div>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Camera Angle</label>
            <select
              value={settings.cameraAngle}
              onChange={(e) => updateSettings({ cameraAngle: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="eye-level">Eye Level</option>
              <option value="aerial">Aerial</option>
              <option value="ground-level">Ground Level</option>
              <option value="from-below">From Below</option>
              <option value="dutch-angle">Dutch Angle</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Lighting</label>
            <select
              value={settings.lighting}
              onChange={(e) => updateSettings({ lighting: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="natural">Natural</option>
              <option value="dramatic">Dramatic</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
              <option value="golden-hour">Golden Hour</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Lens Type</label>
            <select
              value={settings.lensType}
              onChange={(e) => updateSettings({ lensType: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="35mm">35mm</option>
              <option value="50mm">50mm</option>
              <option value="85mm">85mm</option>
              <option value="fisheye">Fisheye</option>
              <option value="wide-angle">Wide Angle</option>
              <option value="macro">Macro</option>
              <option value="telephoto">Telephoto</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Focus Effect</label>
            <select
              value={settings.focusEffect}
              onChange={(e) => updateSettings({ focusEffect: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="sharp">Sharp</option>
              <option value="soft-focus">Soft Focus</option>
              <option value="bokeh">Bokeh</option>
              <option value="motion-blur">Motion Blur</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Film Style</label>
            <select
              value={settings.filmStyle}
              onChange={(e) => updateSettings({ filmStyle: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="color">Color</option>
              <option value="black-and-white">Black & White</option>
              <option value="polaroid">Polaroid</option>
              <option value="vintage">Vintage</option>
              <option value="film-noir">Film Noir</option>
            </select>
          </div>
        </div>
      )}

      {/* Art Tab */}
      {activeTab === 'art' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Art Movement</label>
            <select
              value={settings.artMovement}
              onChange={(e) => updateSettings({ artMovement: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="">None</option>
              <option value="renaissance">Renaissance</option>
              <option value="impressionist">Impressionist</option>
              <option value="pop-art">Pop Art</option>
              <option value="art-deco">Art Deco</option>
              <option value="baroque">Baroque</option>
              <option value="surrealism">Surrealism</option>
              <option value="cubism">Cubism</option>
              <option value="abstract">Abstract</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Art Medium</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'pencil sketch', 'charcoal', 'pastel', 'watercolor',
                'oil painting', 'acrylic', 'digital art', 'vector art',
                'pixel art', 'ink drawing'
              ].map((medium) => (
                <button
                  key={medium}
                  onClick={() => updateSettings({ style: medium })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    settings.style === medium
                      ? 'bg-[#0c7ff2] text-white'
                      : 'bg-[#283039] text-[#9cabba] hover:text-white'
                  }`}
                >
                  {medium.charAt(0).toUpperCase() + medium.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {activeTab === 'effects' && (
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-[#9cabba] text-sm mb-2">
              <input
                type="checkbox"
                checked={settings.useMaterialShape}
                onChange={(e) => updateSettings({ useMaterialShape: e.target.checked })}
                className="rounded"
              />
              Use Material & Shape Effect
            </label>
            {settings.useMaterialShape && (
              <div className="space-y-2 ml-6">
                <input
                  type="text"
                  value={settings.shape}
                  onChange={(e) => updateSettings({ shape: e.target.value })}
                  placeholder="Shape (e.g., bird, heart)"
                  className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
                />
                <select
                  value={settings.material}
                  onChange={(e) => updateSettings({ material: e.target.value })}
                  className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
                >
                  <option value="">Select Material</option>
                  <option value="paper">Paper</option>
                  <option value="metal">Metal</option>
                  <option value="wood">Wood</option>
                  <option value="glass">Glass</option>
                  <option value="fabric">Fabric</option>
                  <option value="cheese">Cheese</option>
                  <option value="neon">Neon</option>
                  <option value="ice">Ice</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-[#9cabba] text-sm mb-2">
              <input
                type="checkbox"
                checked={settings.useText}
                onChange={(e) => updateSettings({ useText: e.target.checked })}
                className="rounded"
              />
              Add Text
            </label>
            {settings.useText && (
              <div className="space-y-2 ml-6">
                <input
                  type="text"
                  value={settings.text}
                  onChange={(e) => updateSettings({ text: e.target.value.slice(0, 25) })}
                  placeholder="Text (max 25 characters)"
                  maxLength={25}
                  className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
                />
                <select
                  value={settings.fontStyle}
                  onChange={(e) => updateSettings({ fontStyle: e.target.value })}
                  className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
                >
                  <option value="bold">Bold</option>
                  <option value="script">Script</option>
                  <option value="sans-serif">Sans-serif</option>
                  <option value="decorative">Decorative</option>
                </select>
                <select
                  value={settings.layoutTemplate}
                  onChange={(e) => updateSettings({ layoutTemplate: e.target.value })}
                  className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
                >
                  <option value="poster">Poster</option>
                  <option value="logo">Logo</option>
                  <option value="sign">Sign</option>
                  <option value="banner">Banner</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quality Tab */}
      {activeTab === 'quality' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[#9cabba] text-sm mb-1">General Quality</label>
            <div className="space-y-2">
              {['high-quality', 'beautiful', 'stylized', 'detailed', 'professional'].map((quality) => (
                <label key={quality} className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={settings.generalQuality.includes(quality)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateSettings({ generalQuality: [...settings.generalQuality, quality] });
                      } else {
                        updateSettings({ 
                          generalQuality: settings.generalQuality.filter(q => q !== quality) 
                        });
                      }
                    }}
                    className="rounded"
                  />
                  {quality.charAt(0).toUpperCase() + quality.slice(1).replace('-', ' ')}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#9cabba] text-sm mb-1">Photo Quality</label>
            <select
              value={settings.photoQuality}
              onChange={(e) => updateSettings({ photoQuality: e.target.value })}
              className="w-full rounded-lg bg-[#283039] text-white px-3 py-2 text-sm"
            >
              <option value="standard">Standard</option>
              <option value="4k">4K</option>
              <option value="4k-hdr">4K HDR</option>
              <option value="studio">Studio Quality</option>
              <option value="professional">Professional</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}