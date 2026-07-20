import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "რეალურ დროში ქუიზი",
  description: "Express + Socket.IO + Mongoose + Next.js ქუიზის აპლიკაცია",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
