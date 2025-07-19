'use client'
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "./components/ToastProvider";
import Navbar from "./components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtenir le chemin de l'URL actuelle
  const pathname = usePathname()
  // Definir les routes ou le navbar ne s'affiche pas 
  const noNavbarRoutes = ['/Login', '/Register', '/forgot-password', '/Tasks/TaskForm']; 
  // Vérifier si la Navbar doit être affichée
  const shouldShowNavbar = !noNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {shouldShowNavbar && <Navbar />} 
        
        <div 
          // Appliquer un padding-top si la Navbar est affichée pour éviter le chevauchement
          // Ajustez '80px' à la hauteur réelle de votre Navbar si elle est fixe.
          className={shouldShowNavbar ? "pt-[80px]" : ""} 
        >
          {children} 
        </div>

        <ToastProvider /> 
      </body>
    </html>
  );
}
