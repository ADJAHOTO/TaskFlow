import React from 'react';
import Footer from './components/Footer'
import { CheckCircle, Users, Calendar, TrendingUp, ArrowRight, Star, Shield, Zap, Clock, Target, BarChart3 } from 'lucide-react';

const TaskManagerHomepage = () => {
  return (
    <>
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#101060] via-[#1a1580] to-[#B08C0A] text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 mt-8">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mt-8">
                  Gérez vos tâches avec
                  <span className="block text-[#B08C0A]">efficacité</span>
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Organisez votre vie professionnelle et personnelle avec notre gestionnaire de tâches intuitif. 
                  Collaborez en équipe, suivez vos progrès et atteignez vos objectifs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-[#B08C0A] text-white font-semibold rounded-lg hover:bg-[#8A6B08] transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Commencer gratuitement
                  </button>
                  <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#101060] transition-all duration-300 flex items-center justify-center">
                    <span>Voir la démo</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#B08C0A] mr-2" />
                    <span>Gratuit pour toujours</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#B08C0A] mr-2" />
                    <span>Pas de carte de crédit</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#101060] font-semibold">Mes tâches aujourd'hui</h3>
                      <span className="text-[#B08C0A] text-sm">3/5 terminées</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 line-through">Finaliser la présentation</span>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 line-through">Réviser le code</span>
                      </div>
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Réunion équipe - 14h</span>
                      </div>
                      <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Planifier le sprint</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#B08C0A] mb-2">50k+</div>
                <div className="text-gray-600">Utilisateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#B08C0A] mb-2">1M+</div>
                <div className="text-gray-600">Tâches accomplies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#B08C0A] mb-2">99.9%</div>
                <div className="text-gray-600">Temps de disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#B08C0A] mb-2">4.9/5</div>
                <div className="text-gray-600">Note utilisateurs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#101060] mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des fonctionnalités puissantes pour vous aider à rester organisé et productif
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#B08C0A] rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#101060] mb-4">Gestion des priorités</h3>
                <p className="text-gray-600">
                  Organisez vos tâches par priorité et concentrez-vous sur ce qui compte vraiment.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#B08C0A] rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#101060] mb-4">Collaboration d'équipe</h3>
                <p className="text-gray-600">
                  Travaillez en équipe avec des commentaires et un suivi des contributions.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#B08C0A] rounded-lg flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#101060] mb-4">Planification intelligente</h3>
                <p className="text-gray-600">
                  Planifiez vos tâches avec des dates d'échéance et des rappels automatiques.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#B08C0A] rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#101060] mb-4">Analyse des performances</h3>
                <p className="text-gray-600">
                  Suivez vos progrès avec des statistiques détaillées et des rapports.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#B08C0A] rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#101060] mb-4">Sécurité garantie</h3>
                <p className="text-gray-600">
                  Vos données sont protégées par un cryptage de niveau entreprise.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#B08C0A] rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#101060] mb-4">Performance optimale</h3>
                <p className="text-gray-600">
                  Interface rapide et fluide pour une expérience utilisateur exceptionnelle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#101060] to-[#B08C0A] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à transformer votre productivité ?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Rejoignez des milliers d'utilisateurs qui ont déjà optimisé leur gestion des tâches
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-[#101060] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Commencer maintenant
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#101060] transition-all duration-300">
                Planifier une démo
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#101060] mb-4">
                Ce que disent nos utilisateurs
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#B08C0A] fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "TaskManager a révolutionné ma façon de travailler. Je suis maintenant plus organisé et productif que jamais."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B08C0A] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold text-[#101060]">Jean Dupont</div>
                    <div className="text-sm text-gray-500">Chef de projet</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#B08C0A] fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "L'interface est intuitive et les fonctionnalités de collaboration sont parfaites pour notre équipe."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B08C0A] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    ML
                  </div>
                  <div>
                    <div className="font-semibold text-[#101060]">Marie Laurent</div>
                    <div className="text-sm text-gray-500">Directrice marketing</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#B08C0A] fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Grâce à TaskManager, notre équipe a gagné 40% de productivité. Un outil indispensable !"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B08C0A] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    PM
                  </div>
                  <div>
                    <div className="font-semibold text-[#101060]">Pierre Martin</div>
                    <div className="text-sm text-gray-500">Développeur senior</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>  
  );
};

export default TaskManagerHomepage;