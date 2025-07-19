'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api';
import toast from 'react-hot-toast'; 
import { Lock, Mail, Eye, EyeOff, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const router  = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Valide le formulaire côté client avant l'envoi à l'API
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    }

    setErrors(newErrors); 

    if (Object.keys(newErrors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      })

      if(response.token) {
        localStorage.setItem('authToken', response.token)
        console.log('Token sauvegardé dans localStorage:', response.token);
      } else {
        throw new Error("Token non reçu de l'API.")
      }

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('User sauvegardé dans localStorage:', response.user);
      }

      toast.success('Connexion réussie ! Redirection...');

      setTimeout(() => {
        router.push('/Dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err);
      toast.error(err.message || 'Une erreur inattendue est survenue lors de la connexion.');
    } finally {
      setIsLoading(false)
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2e2ec] to-[#e2e2f5] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-xl bg-[#B08C0A] flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Carte du formulaire */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-[#101060] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Connexion à votre compte</h1>
            <p className="text-white/80 mt-2">Gérez vos tâches en toute simplicité</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B08C0A] focus:border-transparent transition-all text-gray-900`}
                  placeholder="votre@email.com"
                />
              </div>
               {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Type bascule entre texte et mot de passe
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B08C0A] focus:border-transparent transition-all text-gray-900`}
                  placeholder="••••••••"
                />
                {/* Affiche l'icône de visibilité seulement si le champ n'est pas vide */}
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Bascule la visibilité
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                )}
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#B08C0A] focus:ring-[#B08C0A] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#B08C0A] hover:text-[#8a6b08]">
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[#B08C0A] hover:bg-[#8a6b08] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B08C0A] transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Pied de page */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte?{' '}
              <Link href="/Register" className="font-medium text-[#101060] hover:text-[#0a0a40]"> {/* <-- CORRIGÉ : '/register' en minuscules */}
                Créez-en un maintenant
              </Link>
            </p>
          </div>
        </div>

        {/* Version */}
        <p className="mt-6 text-center text-sm text-white/60">
          TaskFlow Pro v1.0.0
        </p>
      </div>
    </div>
  );
}