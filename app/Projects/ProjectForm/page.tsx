'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { createProject, updateProject, Project } from '@/lib/api';
import {
  Save,
  X,
  Loader2,
  FolderPlus,
  Edit,
  AlertCircle,
  Target,
  Flag,
  FileText
} from 'lucide-react';

interface ProjectFormProps {
  token?: string | null;
  editingProject?: Project | null;
  onProjectCreated?: (project: Project) => void;
  onProjectUpdated?: (project: Project) => void;
  onCancelEditing?: () => void;
}

export default function ProjectForm({
  token: propToken,
  editingProject: propEditingProject,
  onProjectCreated,
  onProjectUpdated,
  onCancelEditing
}: ProjectFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get token from props, localStorage, or cookies
  const [token, setToken] = useState<string | null>(propToken || null);
  const [editingProject, setEditingProject] = useState<Project | null>(propEditingProject || null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'EN_COURS' as Project['status'],
    priority: 'MOYENNE' as Project['priority']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // If no token provided, try to get it from localStorage or redirect to login
    if (!token) {
      const storedToken = localStorage.getItem('authToken'); // Adjust key as needed
      if (storedToken) {
        setToken(storedToken);
      } else {
        router.push('/login');
        return;
      }
    }

    // Check if we're editing (could be from URL params)
    const projectId = searchParams.get('id');
    if (projectId && !editingProject) {
      // Fetch project details if editing
      // You'll need to implement fetchProject function
      // const project = await fetchProject(projectId, token);
      // setEditingProject(project);
    }

    if (editingProject) {
      setFormData({
        name: editingProject.name,
        description: editingProject.description || '',
        status: editingProject.status,
        priority: editingProject.priority
      });
    }
  }, [editingProject, token, searchParams, router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!token) {
      toast.error('Token d\'authentification manquant.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingProject) {
        const updatedProject = await updateProject(editingProject.id, formData, token);
        if (onProjectUpdated) {
          onProjectUpdated(updatedProject);
        } else {
          router.push('/projects'); // Default navigation
        }
        toast.success('Projet mis à jour avec succès !');
      } else {
        const newProject = await createProject(formData, token);
        if (onProjectCreated) {
          onProjectCreated(newProject);
        } else {
          router.push('/projects'); // Default navigation
        }
        toast.success('Projet créé avec succès !');
      }
      
      setFormData({
        name: '',
        description: '',
        status: 'EN_COURS',
        priority: 'MOYENNE'
      });
      setErrors({});
      
    } catch (err: any) {
      console.error('Erreur lors de la soumission:', err);
      toast.error(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      status: 'EN_COURS',
      priority: 'MOYENNE'
    });
    setErrors({});
    
    if (onCancelEditing) {
      onCancelEditing();
    } else {
      router.push('/projects'); // Default navigation
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EN_COURS':
        return 'En cours';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'TERMINE':
        return 'Terminé';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'BASSE':
        return 'Basse';
      case 'MOYENNE':
        return 'Moyenne';
      case 'HAUTE':
        return 'Haute';
      default:
        return priority;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            {editingProject ? (
              <>
                <Edit className="mr-3 text-[#101060]" />
                Modifier le projet
              </>
            ) : (
              <>
                <FolderPlus className="mr-3 text-[#101060]" />
                Créer un nouveau projet
              </>
            )}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nom du projet */}
            <div className="lg:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline w-4 h-4 mr-1" />
                Nom du projet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } text-gray-800 placeholder-gray-400`}
                placeholder="Saisissez le nom du projet..."
                maxLength={100}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Statut */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="inline w-4 h-4 mr-1" />
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-gray-800"
                disabled={isSubmitting}
              >
                <option value="EN_COURS">En cours</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Priorité
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-gray-800"
                disabled={isSubmitting}
              >
                <option value="BASSE">Basse</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="HAUTE">Haute</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } text-gray-800 placeholder-gray-400`}
              placeholder="Décrivez votre projet en détail..."
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.description.length}/500 caractères
              </p>
            </div>
          </div>

          {/* Aperçu des données */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu :</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Nom :</strong> {formData.name || 'Non défini'}</p>
              <p><strong>Statut :</strong> {getStatusLabel(formData.status)}</p>
              <p><strong>Priorité :</strong> {getPriorityLabel(formData.priority)}</p>
              {formData.description && (
                <p><strong>Description :</strong> {formData.description.substring(0, 100)}{formData.description.length > 100 ? '...' : ''}</p>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{editingProject ? 'Mise à jour...' : 'Création...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{editingProject ? 'Mettre à jour' : 'Créer le projet'}</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5" />
              <span>Annuler</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}