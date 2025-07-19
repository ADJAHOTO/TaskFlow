import React from 'react';
import { CheckCircle, Users, Calendar, TrendingUp, ArrowRight, Star, Shield, Zap, Clock, Target, BarChart3, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    produit: [
      { label: 'Tableau de bord', icon: <BarChart3 className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Mes Tâches', icon: <CheckCircle className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Projets', icon: <Target className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Calendrier', icon: <Calendar className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Équipe', icon: <Users className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Rapports', icon: <TrendingUp className="w-5 h-5 text-[#B08C0A]" /> }
    ],
    entreprise: [
      { label: 'À propos', icon: <Shield className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Carrières', icon: <Zap className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Presse', icon: <Clock className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Partenaires', icon: <Users className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Investisseurs', icon: <TrendingUp className="w-5 h-5 text-[#B08C0A]" /> }
    ],
    ressources: [
      { label: 'Centre d\'aide', icon: <Shield className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Documentation', icon: <BarChart3 className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'API', icon: <Zap className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Communauté', icon: <Users className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Statut', icon: <CheckCircle className="w-5 h-5 text-[#B08C0A]" /> }
    ],
    legal: [
      { label: 'Conditions d\'utilisation', icon: <Shield className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Politique de confidentialité', icon: <Shield className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Cookies', icon: <Shield className="w-5 h-5 text-[#B08C0A]" /> },
      { label: 'Sécurité', icon: <Shield className="w-5 h-5 text-[#B08C0A]" /> }
    ]
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, label: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Youtube, label: 'YouTube', color: 'hover:bg-red-600' }
  ];

  return (
    <footer className="bg-[#101060] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI0IwOEMwQSIgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')]"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#B08C0A] to-white bg-clip-text text-transparent">
                Restez informé de nos nouveautés
              </h3>
              <p className="text-gray-300 text-lg">
                Recevez les dernières mises à jour, conseils de productivité et fonctionnalités exclusives.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B08C0A] focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-[#B08C0A] to-[#D4AF37] hover:from-[#8A6B08] hover:to-[#B08C0A] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center shadow-lg hover:shadow-[#B08C0A]/30">
                <span className="mr-3">S'abonner</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#B08C0A] to-[#D4AF37] flex items-center justify-center mr-4 transition-all duration-300 group-hover:rotate-6">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-3xl bg-gradient-to-r from-[#B08C0A] to-[#FFFFFF] bg-clip-text text-transparent">
                TaskFlow Pro
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              La solution de gestion de tâches qui révolutionne votre productivité. 
              Organisez, collaborez et atteignez vos objectifs avec efficacité.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 group">
                <div className="p-2 bg-white/5 rounded-lg mr-3 group-hover:bg-[#B08C0A]/20 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-[#B08C0A]" />
                </div>
                <span>contact@taskflowpro.com</span>
              </div>
              <div className="flex items-center text-gray-300 group">
                <div className="p-2 bg-white/5 rounded-lg mr-3 group-hover:bg-[#B08C0A]/20 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-[#B08C0A]" />
                </div>
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center text-gray-300 group">
                <div className="p-2 bg-white/5 rounded-lg mr-3 group-hover:bg-[#B08C0A]/20 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-[#B08C0A]" />
                </div>
                <span>Paris, France</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <span className="w-3 h-3 bg-[#B08C0A] rounded-full mr-2"></span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <ul className="space-y-4">
                {links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group"
                    >
                      <span className="mr-3 group-hover:translate-x-1 transition-transform duration-300">
                        {link.icon}
                      </span>
                      <span className="group-hover:text-[#B08C0A] transition-colors duration-300">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Awards */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 font-medium">Suivez-nous :</span>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href="#"
                        className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-300 hover:text-white ${social.color} transition-all duration-300 hover:scale-110`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-300 group">
                  <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-[#B08C0A]/20 transition-colors duration-300">
                    <Star className="w-5 h-5 text-[#B08C0A]" />
                  </div>
                  <span className="text-sm">4.9/5 sur 2,000+ avis</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 group">
                  <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-[#B08C0A]/20 transition-colors duration-300">
                    <Shield className="w-5 h-5 text-[#B08C0A]" />
                  </div>
                  <span className="text-sm">Certifié ISO 27001</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-300">
              <span>© 2024 TaskFlow Pro. Tous droits réservés.</span>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Statut : Opérationnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="h-2 bg-gradient-to-r from-[#101060] via-[#B08C0A] to-[#101060]"></div>
    </footer>
  );
};

export default Footer;