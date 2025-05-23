import { GoogleGenAI, Modality } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

async function generateWithGemini(ai: GoogleGenAI, prompt: string, retryCount = 0): Promise<any> {
  console.log('Using Gemini model for generation', retryCount > 0 ? `(retry ${retryCount})` : '');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Process the response
    let imageData = null;
    let textResponse = '';

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            textResponse += part.text;
          } else if (part.inlineData) {
            imageData = part.inlineData.data;
            break; // We found an image, we can stop
          }
        }
      }
    }

    if (imageData) {
      return { 
        imageData: imageData,
        mimeType: 'image/png',
        text: textResponse
      };
    } else {
      return { 
        text: textResponse,
        error: 'No image was generated in the response'
      };
    }
  } catch (error: any) {
    // Check if it's a 500 error and we haven't retried yet
    if (error.status === 500 && retryCount === 0) {
      console.log('Received 500 error from Gemini API, retrying once...');
      // Wait a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateWithGemini(ai, prompt, 1);
    }
    // Re-throw the error if it's not a 500 or we've already retried
    throw error;
  }
}

async function generateWithImagen(ai: GoogleGenAI, prompt: string, retryCount = 0): Promise<any> {
  console.log('Using Imagen model for generation', retryCount > 0 ? `(retry ${retryCount})` : '');
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];
      if (generatedImage && generatedImage.image && generatedImage.image.imageBytes) {
        const imageData = generatedImage.image.imageBytes;
        return { 
          imageData: imageData,
          mimeType: 'image/png'
        };
      }
    }
    
    throw new Error('No image was generated');
  } catch (error: any) {
    // Check if it's a 500 error and we haven't retried yet
    if (error.status === 500 && retryCount === 0) {
      console.log('Received 500 error from Imagen API, retrying once...');
      // Wait a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateWithImagen(ai, prompt, 1);
    }
    // Re-throw the error if it's not a 500 or we've already retried
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!model || !['gemini', 'imagen'].includes(model)) {
      return NextResponse.json(
        { error: 'Invalid model selected' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    console.log('Generating image with model:', model, 'and prompt:', prompt);

    let result;
    
    if (model === 'imagen') {
      result = await generateWithImagen(ai, prompt);
    } else {
      result = await generateWithGemini(ai, prompt);
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}