import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Generator Web",
  description: "AI-powered image generation web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}