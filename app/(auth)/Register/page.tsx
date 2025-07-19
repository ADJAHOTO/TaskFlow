'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { registerUser } from '@/lib/api'; 
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react'; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const router = useRouter(); 
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  // Pour les erreurs de validation de champ de formulaire
  const [errors, setErrors] = useState<Record<string, string>>({}); 
 

  // Met à jour les données du formulaire lorsque les champs changent
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

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

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

    // Validation du champ de confirmation du mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors); // Met à jour l'état des erreurs de validation
    // Si validation échoue, on peut aussi afficher un toast général
    if (Object.keys(newErrors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
    }
    return Object.keys(newErrors).length === 0;
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Arrête la soumission si la validation côté client échoue
    if (!validateForm()) {
      return;
    }

    // Active l'état de chargement pour le bouton
    setIsLoading(true); 

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      console.log('Inscription réussie:', response);
      toast.success('Votre compte a été créé avec succès !');

      // Redirige vers la page de connexion après un court délai pour que l'utilisateur voie le message de succès
      setTimeout(() => {
        router.push('/Login'); 
      }, 1500);

    } catch (err: any) {
      console.error('Erreur lors de l\'inscription:', err);
      // Capture et affiche le message d'erreur de l'API ou un message générique
      toast.error((err as { message?: string }).message || 'Une erreur inattendue est survenue lors de l\'inscription.');
    } finally {
      setIsLoading(false); // Désactive l'état de chargement
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2e2ec] to-[#e2e2f5] p-4">
      <div className="w-full max-w-md">
        {/* Logo de l'application */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-xl bg-[#B08C0A] flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Carte du formulaire d'inscription */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête de la carte */}
          <div className="bg-[#101060] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Créer un compte</h1>
            <p className="text-white/80 mt-2">Rejoignez notre plateforme de gestion de tâches</p>
          </div>

          {/* Formulaire de saisie des informations */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Champ Nom Complet */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom Complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B08C0A] focus:border-transparent transition-all text-gray-900`}
                  placeholder="Jean Dupont"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Champ Adresse Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              <p className="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
            </div>

            {/* Champ Confirmation Mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmez le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"} // Réutilise le même état de visibilité
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B08C0A] focus:border-transparent transition-all text-gray-900`}
                  placeholder="••••••••"
                />
                {/* Affiche l'icône de visibilité seulement si le champ n'est pas vide */}
                {formData.confirmPassword && (
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
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Case à cocher pour les conditions d'utilisation */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required // Le champ est requis
                  className="focus:ring-[#B08C0A] h-4 w-4 text-[#B08C0A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  J'accepte les <Link href="/terms" className="text-[#101060] hover:underline">conditions d'utilisation</Link>
                </label>
              </div>
            </div>

            {/* Bouton de soumission du formulaire */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading} // Désactive le bouton pendant le chargement
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[#B08C0A] hover:bg-[#8a6b08] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B08C0A] transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span>Création du compte...</span>
                ) : (
                  <>
                    <span>S'inscrire</span>
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Pied de page de la carte avec lien vers la page de connexion */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte?{' '}
              <Link href="Login" className="font-medium text-[#101060] hover:text-[#0a0a40]">
                Connectez-vous
              </Link> {/* Lien vers '/login' (tout en minuscules) */}
            </p>
          </div>
        </div>

        {/* Version de l'application affichée en bas */}
        <p className="mt-6 text-center text-sm text-white/60">
          TaskFlow Pro v1.0.0
        </p>
      </div>
    </div>
  );
}