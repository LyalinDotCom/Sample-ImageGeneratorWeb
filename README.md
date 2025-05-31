# ImageGeneratorWeb

A modern web application for AI-powered image generation using Google's Imagen API, built with Next.js and TypeScript.

## Key Capabilities

- **AI Image Generation**: Generate high-quality images using Google's Imagen 3 API
- **Advanced Controls**: Fine-tune image generation with:
  - Adjustable aspect ratios (1:1, 16:9, 9:16, 4:3, 3:4)
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

This application leverages:
- **Imagen 3.0** (`imagen-3.0-generate-002`): Google's most advanced image generation model
- **Vertex AI**: For secure API access and model deployment

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **API**: Google Vertex AI SDK
- **Storage**: Browser LocalStorage for image history

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Google Cloud credentials:
   - Set up a Google Cloud project with Vertex AI enabled
   - Configure authentication (service account or application default credentials)
   - Set your project ID in the environment

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with:
```
GOOGLE_CLOUD_PROJECT=your-project-id
```

## Usage

1. Enter a descriptive prompt for the image you want to generate
2. Optionally adjust settings:
   - Select aspect ratio
   - Add negative prompts
   - Adjust safety filters
   - Toggle person generation
3. Click "Generate" to create your image
4. View generated images in the history panel
5. Download or delete images as needed

---

*This project was built using AI models including Google's Gemini and Anthropic's Claude for code generation and assistance.*