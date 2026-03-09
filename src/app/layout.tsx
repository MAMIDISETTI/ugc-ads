import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdsGen – AI UGC Ads for Meta & Google",
  description:
    "Create AI-generated product ad images and short-form videos. Launch UGC ads on Meta and Google in minutes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster
          position="top-center"
          toastOptions={{ duration: 4000 }}
          containerStyle={{ top: "env(safe-area-inset-top, 0)" }}
        />
        </AuthProvider>
      </body>
    </html>
  );
}
