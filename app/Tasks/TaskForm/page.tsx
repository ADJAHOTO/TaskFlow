'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { createTask, updateTask, getTaskById, CreateTaskData, UpdateTaskData } from '@/lib/api';
import {
  Save,
  X,
  Loader2,
  Edit,
  PlusCircle,
  AlertCircle,
  Calendar,
  Flag,
  FileText
} from 'lucide-react';

function TaskFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [formData, setFormData] = useState<Omit<CreateTaskData, 'userId'>>({
    title: '',
    description: '',
    status: 'A_FAIRE',
    priority: 'MOYENNE',
    dueDate: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchTask = async () => {
      if (taskId) {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Session expirée. Veuillez vous reconnecter.");
          router.push('/Login');
          return;
        }
        try {
          const task = await getTaskById(taskId, token);
          setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : null
          });
        } catch (error: any) {
          toast.error(error.message || "Erreur lors de la récupération de la tâche.");
          router.push('/Tasks');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId, router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre de la tâche est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user?.id) {
      toast.error('Session invalide. Veuillez vous reconnecter.');
      router.push('/Login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataPayload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      if (taskId) {
        const updatedData: UpdateTaskData = dataPayload;
        await updateTask(taskId, updatedData, token);
        toast.success('Tâche mise à jour avec succès !');
      } else {
        const taskData: CreateTaskData = { ...dataPayload, userId: user.id };
        await createTask(taskData, token);
        toast.success('Tâche créée avec succès !');
      }
      
      router.push('/Tasks');
      
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
    router.push('/Tasks');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#101060]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          {taskId ? (
            <>
              <Edit className="mr-3 text-[#101060]" />
              Modifier la tâche
            </>
          ) : (
            <>
              <PlusCircle className="mr-3 text-[#101060]" />
              Créer une nouvelle tâche
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
        <div className="lg:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de la tâche *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } text-gray-800 placeholder-gray-400`}
            placeholder="Ex: Préparer la présentation client"
            disabled={isSubmitting}
            required
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline w-4 h-4 mr-1" />
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all resize-none border-gray-300 text-gray-800 placeholder-gray-400"
            placeholder="Détails, notes ou sous-tâches..."
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <option value="A_FAIRE">À faire</option>
              <option value="EN_COURS">En cours</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="TERMINE">Terminé</option>
            </select>
          </div>

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
              <option value="FAIBLE">Basse</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="ELEVEE">Haute</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Échéance
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-gray-800"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{taskId ? 'Mise à jour...' : 'Création...'}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{taskId ? 'Mettre à jour' : 'Créer la tâche'}</span>
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
  );
}

export default function TaskFormPageWithSuspense() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#101060]" /></div>}>
      <TaskFormPage />
    </Suspense>
  );
}
