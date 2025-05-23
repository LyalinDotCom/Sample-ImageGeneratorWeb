import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '700']
});

const notoSans = Noto_Sans({ 
  subsets: ["latin"],
  variable: '--font-noto-sans',
  weight: ['400', '500', '700', '900']
});

export const metadata: Metadata = {
  title: "ImageGen - AI Image Generator",
  description: "Unleash your creativity with AI-powered image generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${notoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}