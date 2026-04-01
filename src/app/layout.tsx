import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Crack!t | Real-Time AI Interview Support",
  description:
    "The world's most advanced AI interview preparation platform. Ace every interview with real-time AI guidance and performance analytics.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <AuthProvider>
          <div className="fixed inset-0 z-[-1] bg-stars opacity-40 pointer-events-none" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
