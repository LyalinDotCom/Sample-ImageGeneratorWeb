# ImageGeneratorWeb

A modern web application for AI-powered image generation using Google's Imagen API, built with Next.js and TypeScript.

> ⚠️ **Note**: This application is a proof of concept and has not been fully tested. Some image generation options and parameter combinations may result in API errors or unexpected behavior. Please use with appropriate expectations.

## Key Capabilities

- **AI Image Generation**: Generate high-quality images using Google's Imagen 3 or Gemini 2.0 Flash models
- **Model Selection**: Choose between:
  - Imagen 3.0 for high-quality image generation with aspect ratio control
  - Gemini 2.0 Flash for multimodal generation with conversational capabilities
- **Advanced Controls**: Fine-tune image generation with:
  - Adjustable aspect ratios (1:1, 16:9, 9:16, 4:3, 3:4) - Imagen only
  - Safety filtering levels
  - Negative prompts to exclude unwanted elements
  - Person generation toggle
- **Image History**: Automatic local storage of generated images with:
  - Persistent history across sessions
  - Download functionality for saved images
  - Delete with confirmation dialog
- **Automatic Error Handling**: Built-in retry mechanism for API errors
- **Responsive Design**: Clean, modern UI that works on desktop and mobile

## Models

This application leverages two powerful image generation models:
- **Imagen 3.0** (`imagen-3.0-generate-002`): Google's most advanced image generation model with support for custom aspect ratios
- **Gemini 2.0 Flash** (`gemini-2.0-flash-preview-image-generation`): A multimodal model capable of generating both images and text, optimized for conversational image generation and editing
- **Google AI Studio**: For API access to Google's generative AI models

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **API**: Google GenAI SDK (`@google/genai`)
- **Storage**: Browser LocalStorage for image history

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Google AI API key:
   - Get an API key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Create a `.env.local` file in the project root
   - Add your API key to the environment variables

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with:
```
GEMINI_API_KEY=your-google-ai-api-key
```

## Usage

1. Enter a descriptive prompt for the image you want to generate
2. Select your preferred model:
   - **Imagen 3.0**: Best for high-quality images with aspect ratio control
   - **Gemini 2.0 Flash**: Best for quick generation with multimodal capabilities
3. Optionally adjust settings:
   - Select aspect ratio (Imagen only)
   - Add negative prompts
   - Adjust safety filters
   - Toggle person generation
4. Click "Generate" to create your image
5. View generated images in the history panel
6. Download or delete images as needed

---

*This project was built using AI models including Google's Gemini and Anthropic's Claude for code generation and assistance.*