import { ImagenSettings } from '@/components/ImagenControls';

export function buildImagenPrompt(basePrompt: string, settings: ImagenSettings): string {
  const promptParts: string[] = [];

  // Start with photography mode specific settings
  if (settings.photographyMode !== 'general') {
    switch (settings.photographyMode) {
      case 'portrait':
        promptParts.push(`${settings.specializedSettings.portrait.focalLength} portrait`);
        if (settings.specializedSettings.portrait.effect === 'film-noir') {
          promptParts.push('film noir style');
        } else if (settings.specializedSettings.portrait.effect === 'duotone') {
          const [color1, color2] = settings.specializedSettings.portrait.duotone;
          promptParts.push(`${color1} and ${color2} duotones`);
        }
        break;
      case 'macro':
        promptParts.push(`macro lens, ${settings.specializedSettings.macro.focalLength}`);
        promptParts.push('high detail, controlled lighting');
        break;
      case 'action':
        promptParts.push(`${settings.specializedSettings.action.shutterSpeed} shutter speed`);
        promptParts.push('100-400mm lens');
        break;
      case 'landscape':
        promptParts.push(`wide angle ${settings.specializedSettings.landscape.focalLength}`);
        if (settings.specializedSettings.landscape.exposure === 'long') {
          promptParts.push('long exposure');
        }
        promptParts.push('sharp focus');
        break;
    }
  }

  // Add proximity
  if (settings.proximity !== 'normal') {
    if (settings.proximity === 'close-up') {
      promptParts.push('A close-up photo of');
    } else if (settings.proximity === 'zoomed-out') {
      promptParts.push('A zoomed out photo of');
    } else if (settings.proximity === 'far') {
      promptParts.push('A distant view of');
    }
  } else {
    // Add style prefix
    if (settings.style && settings.style !== 'photograph') {
      promptParts.push(`A ${settings.style} of`);
    } else {
      promptParts.push('A photo of');
    }
  }

  // Material & Shape effect
  if (settings.useMaterialShape && settings.material && settings.shape) {
    promptParts.push(`${settings.subject || basePrompt} made of ${settings.material}`);
    promptParts.push(`in the shape of ${settings.shape}`);
  } else {
    // Add the main subject
    promptParts.push(settings.subject || basePrompt);
  }

  // Add context/background
  if (settings.context) {
    if (settings.context === 'studio') {
      promptParts.push('in a studio setting');
    } else if (settings.context === 'park') {
      promptParts.push('in a park');
    } else if (settings.context === 'urban') {
      promptParts.push('in an urban environment');
    } else {
      promptParts.push(`${settings.context} background`);
    }
  }

  // Camera angle
  if (settings.cameraAngle !== 'eye-level') {
    if (settings.cameraAngle === 'aerial') {
      promptParts.push('aerial view');
    } else if (settings.cameraAngle === 'from-below') {
      promptParts.push('shot from below');
    } else if (settings.cameraAngle === 'ground-level') {
      promptParts.push('ground level perspective');
    } else if (settings.cameraAngle === 'dutch-angle') {
      promptParts.push('dutch angle');
    }
  }

  // Lighting
  if (settings.lighting !== 'natural') {
    if (settings.lighting === 'golden-hour') {
      promptParts.push('golden hour lighting');
    } else {
      promptParts.push(`${settings.lighting} lighting`);
    }
  }

  // Lens type (if not default)
  if (settings.lensType && settings.lensType !== '50mm' && settings.photographyMode === 'general') {
    if (settings.lensType === 'fisheye') {
      promptParts.push('fisheye lens');
    } else if (settings.lensType === 'wide-angle') {
      promptParts.push('wide angle lens');
    } else if (settings.lensType === 'macro') {
      promptParts.push('macro lens');
    } else if (settings.lensType === 'telephoto') {
      promptParts.push('telephoto lens');
    } else {
      promptParts.push(`${settings.lensType} lens`);
    }
  }

  // Focus effects
  if (settings.focusEffect !== 'sharp') {
    if (settings.focusEffect === 'motion-blur') {
      promptParts.push('with motion blur');
    } else if (settings.focusEffect === 'soft-focus') {
      promptParts.push('soft focus');
    } else if (settings.focusEffect === 'bokeh') {
      promptParts.push('with bokeh effect');
    }
  }

  // Film style
  if (settings.filmStyle !== 'color') {
    if (settings.filmStyle === 'black-and-white') {
      promptParts.push('black and white photo');
    } else if (settings.filmStyle === 'polaroid') {
      promptParts.push('polaroid style');
    } else if (settings.filmStyle === 'vintage') {
      promptParts.push('vintage film style');
    } else if (settings.filmStyle === 'film-noir') {
      promptParts.push('film noir style');
    }
  }

  // Art movement
  if (settings.artMovement) {
    promptParts.push(`in the style of ${settings.artMovement} painting`);
  }

  // Text integration
  if (settings.useText && settings.text) {
    promptParts.push(`with the text "${settings.text}" in ${settings.fontStyle} font`);
    if (settings.layoutTemplate) {
      promptParts.push(`as a ${settings.layoutTemplate}`);
    }
  }

  // Quality modifiers
  if (settings.generalQuality.length > 0) {
    promptParts.push(...settings.generalQuality);
  }

  if (settings.photoQuality !== 'standard') {
    if (settings.photoQuality === '4k') {
      promptParts.push('4k');
    } else if (settings.photoQuality === '4k-hdr') {
      promptParts.push('4k HDR');
    } else if (settings.photoQuality === 'studio') {
      promptParts.push('studio photo');
    } else if (settings.photoQuality === 'professional') {
      promptParts.push('professional photographer');
    }
  }

  // Join all parts
  return promptParts.join(', ');
}

// Get aspect ratio for Imagen - returns the simple ratio string
export function getAspectRatioDimensions(aspectRatio: string): string {
  // Imagen API expects simple aspect ratio strings like "1:1", "16:9", etc.
  return aspectRatio;
}