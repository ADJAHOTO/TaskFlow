'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, CheckSquare, Folder, Calendar, Users, LogOut, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fonction pour vérifier et mettre à jour l'état d'authentification
  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user?.isAdmin || false);
        // console.log('Admin status:', user?.isAdmin); // Debug
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    setIsMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // Écouter les changements du localStorage (autres onglets)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuthStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Écouter l'event custom 'authChanged' (même onglet)
    const onAuthChange = () => {
      checkAuthStatus();
    };
    window.addEventListener('authChanged', onAuthChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', onAuthChange);
    };
  }, []);

  // Vérifier à nouveau l'état d'authentification quand le pathname change
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
    toast.success('Vous avez été déconnecté avec succès !');
    console.clear();
    router.push('/Login'); 
    window.dispatchEvent(new Event('authChanged')); 
  };

  // Liens de base
  const baseNavLinks = [
    { href: '/Dashboard', label: 'Tableau', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/Tasks', label: 'Tâches', icon: <CheckSquare className="w-5 h-5" /> },
    { href: '/Projects', label: 'Projets', icon: <Folder className="w-5 h-5" /> },
    { href: '/history', label: 'Historique', icon: <Calendar className="w-5 h-5" /> },
  ];

  // Ajouter le lien Admin si l'utilisateur est admin
  const navLinks = isAdmin
    ? [...baseNavLinks, { href: '/admin', label: 'Admin', icon: <Users className="w-5 h-5" /> }]
    : baseNavLinks;

  // console.log('isAdmin:', isAdmin, 'navLinks:', navLinks.length); // Debug

  return (
    <header 
      className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white py-4'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group relative"
          >
            <div className={`relative z-10 w-12 h-12 rounded-xl bg-[#101060] flex items-center justify-center mr-3 transition-all duration-500 ${scrolled ? 'scale-90' : 'scale-100'} group-hover:rotate-6`}>
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className={`relative z-10 font-bold text-2xl text-[#101060] transition-all duration-500 ${scrolled ? 'text-xl' : 'text-2xl'} group-hover:translate-x-1`}>
              TaskFlow Pro
            </span>
            <div className="absolute -bottom-1 left-0 h-1 bg-[#B08C0A] rounded-full transition-all duration-500 transform origin-left scale-x-0 group-hover:scale-x-100" />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-1 relative">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-3 rounded-xl flex items-center transition-all duration-300 group ${pathname.includes(link.href) ? 'text-[#101060]' : 'text-gray-600 hover:text-[#101060]'}`}
              >
                <span className={`mr-2 transition-transform duration-300 group-hover:scale-110 ${pathname.includes(link.href) ? 'text-[#B08C0A]' : ''}`}>
                  {link.icon}
                </span>
                <span className="font-medium">{link.label}</span>
                <div className={`absolute -bottom-1 left-1/2 w-4/5 h-0.5 bg-[#B08C0A] rounded-full transform -translate-x-1/2 transition-all duration-300 ${pathname.includes(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}

            {/* Bouton Connexion / Déconnexion */}
            {isMounted && (
              <div className="ml-4 pl-4 border-l border-gray-200">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 bg-[#101060] hover:bg-[#B08C0A] text-white rounded-xl flex items-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-[#101060]/40"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Déconnexion
                  </button>
                ) : (
                  <Link
                    href="/Login"
                    className="px-5 py-2.5 bg-[#101060] hover:bg-[#B08C0A] text-white rounded-xl flex items-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-[#101060]/40"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Connexion
                  </Link>
                )}
              </div>
            )}
          </nav>

          {/* Bouton menu mobile */}
          <button 
            className={`md:hidden p-3 rounded-xl focus:outline-none transition-all duration-300 ${mobileMenuOpen ? 'bg-[#101060]/10' : 'bg-transparent'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute block w-6 h-0.5 bg-[#101060] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 top-3' : 'top-2'}`} />
              <span className={`absolute block w-6 h-0.5 bg-[#101060] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'top-3'}`} />
              <span className={`absolute block w-6 h-0.5 bg-[#101060] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 top-3' : 'top-4'}`} />
            </div>
          </button>
        </div>

        {/* Menu mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-screen pt-4' : 'max-h-0'}`}>
          <nav className="flex flex-col space-y-2 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-4 rounded-xl flex items-center transition-all duration-300 ${pathname.includes(link.href) ? 'bg-[#101060]/10 text-[#101060]' : 'text-gray-600 hover:bg-[#101060]/5 hover:text-[#101060]'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={`mr-3 ${pathname.includes(link.href) ? 'text-[#B08C0A]' : ''}`}>
                  {link.icon}
                </span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {isMounted && (
              <div className="pt-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-4 bg-[#101060] text-white rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Déconnexion
                  </button>
                ) : (
                  <Link
                    href="/Login"
                    className="w-full px-5 py-4 bg-[#101060] text-white rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Connexion
                  </Link>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
