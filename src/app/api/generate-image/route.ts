import { GoogleGenAI, Modality } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

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

    if (model === 'imagen') {
      // Use Imagen model with generateImages method
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
          return NextResponse.json({ 
            imageData: imageData,
            mimeType: 'image/png'
          });
        }
      }
      
      return NextResponse.json({ 
        error: 'No image was generated'
      }, { status: 500 });
    } else {
      // Use Gemini model with generateContent method
      const response = await ai.models.generateContent({
        model: 'imagen-3.0-generate-002',
        contents: prompt,
        config: {
          responseModalities: [Modality.IMAGE],
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
        return NextResponse.json({ 
          imageData: imageData,
          mimeType: 'image/png',
          text: textResponse
        });
      } else {
        return NextResponse.json({ 
          text: textResponse,
          error: 'No image was generated in the response'
        });
      }
    }

  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}