'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { createTask, updateTask, Task, CreateTaskData, UpdateTaskData } from '@/lib/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import {
  PlusCircle,
  Loader2,
  Edit,
  XCircle,
  CalendarDays,
  Tag,
  AlertTriangle
} from 'lucide-react';

 

interface FormTaskProps {
  token: string | null;
  editingTask: Task | null;
  onTaskCreated: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onCancelEditing: () => void;
}

export default function FormTask({
  token,
  editingTask,
  onTaskCreated,
  onTaskUpdated,
  onCancelEditing
}: FormTaskProps) {
  const [newTaskTitle, setNewTaskTitle] = useState(editingTask?.title || '');
  const [newTaskDescription, setNewTaskDescription] = useState(editingTask?.description || '');
  const [newTaskStatus, setNewTaskStatus] = useState<'A_FAIRE' | 'EN_COURS' | 'EN_ATTENTE' | 'TERMINE' >(editingTask?.status || 'A_FAIRE');
  const [newTaskDueDate, setNewTaskDueDate] = useState(editingTask?.dueDate?.split('T')[0] || '');
  const [newTaskPriority, setNewTaskPriority] = useState<'FAIBLE' | 'MOYENNE' | 'ELEVEE'>(editingTask?.priority || 'FAIBLE');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const userToken = localStorage.getItem('authToken');
    if (!userToken) {
      toast.error('Vous devez être connecté pour accéder à cette page.');
      setTimeout(() => {
        router.push('/Login')
      }, 1500)
      return;
    }
    // If you want to set the token in state, you need to add setToken to your state hooks.
    // setToken(userToken);
  }, [router]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      toast.error('Le titre de la tâche ne peut pas être vide.');
      return;
    }
    if (!token) {
      toast.error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      return;
    }

    if (editingTask) {
      await handleUpdateTask();
    } else {
      await handleCreateTask();
    }
  };

  const handleCreateTask = async () => {
    setIsCreatingTask(true);
    try {
      const taskData: CreateTaskData = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || null,
        status: 'A_FAIRE',
        priority: newTaskPriority,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
        userId: 'temp'
      };

      const createdTask = await createTask(taskData, token as string);
      onTaskCreated(createdTask);
      resetForm();
      toast.success('Tâche ajoutée avec succès !');
    } catch (err: any) {
      console.error('Erreur lors de la création de la tâche :', err);
      toast.error(err.message || 'Impossible d\'ajouter la tâche.');
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    setIsUpdatingTask(true);
    
    try {
      const updatedData: UpdateTaskData = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || null,
        status: newTaskStatus,
        priority: newTaskPriority,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
      };

      const updatedTask = await updateTask(editingTask.id, updatedData, token as string);
      onTaskUpdated(updatedTask);
      resetForm();
      toast.success('Tâche mise à jour avec succès !');
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la tâche :', err);
      toast.error(err.message || 'Impossible de mettre à jour la tâche.');
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskStatus('A_FAIRE')
    setNewTaskPriority('FAIBLE');
    setNewTaskDueDate('');
    
    if (editingTask) {
      onCancelEditing();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
          {editingTask ? (
            <>
              <Edit className="mr-3 text-[#B08C0A]" /> Modifier la tâche
            </>
          ) : (
            <>
              <PlusCircle className="mr-3 text-[#101060]" /> Créer une nouvelle tâche
            </>
          )}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="taskTitle" className="block text-sm font-semibold text-black mb-2">
                Titre de la tâche
              </label>
              <input
                id="taskTitle"
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Ex: Préparer la présentation client"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-black"
                required
              />
            </div>
            
            <div className="lg:col-span-2">
              <label htmlFor="taskDescription" className="block text-sm font-semibold text-black mb-2">
                Description (optionnel)
              </label>
              <textarea
                id="taskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Détails, notes ou sous-tâches..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-black"
              />
            </div>

            <div>
              <label htmlFor="taskPriority" className="block text-sm font-semibold text-black mb-2">
                Status
              </label>
              <select
                id="taskStatus"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as 'A_FAIRE' | 'EN_COURS' | 'EN_ATTENTE' )}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-black"
              >
                <option value="A_FAIRE">A faire</option>
                <option value="EN_COURS">En cours</option>
                <option value="EN_ATTENTE" >Terminé</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="taskDueDate" className="block text-sm font-semibold text-black mb-2">
                Date d'échéance
              </label>
              <input
                id="taskDueDate"
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-black"
              />
            </div>
            
            <div>
              <label htmlFor="taskPriority" className="block text-sm font-semibold text-black mb-2">
                Priorité
              </label>
              <select
                id="taskPriority"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'FAIBLE' | 'MOYENNE' | 'ELEVEE')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-black"
              >
                <option value="FAIBLE">Basse</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="ELEVEE">Haute</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isCreatingTask || isUpdatingTask}
              className="flex-1 flex justify-center items-center py-3 px-6 bg-gradient-to-r from-[#101060] to-[#1a1580] text-white font-semibold rounded-lg hover:from-[#0c0c50] hover:to-[#151470] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#101060] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-alFAIBLEed shadow-lg"
            >
              {(isCreatingTask || isUpdatingTask) ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  <span className="text-white">{editingTask ? 'Mise à jour...' : 'Création...'}</span>
                </>
              ) : (
                <span className="text-white">{editingTask ? 'Mettre à jour' : 'Créer la tâche'}</span>
              )}
            </button>
            
            {editingTask && (
              <button
                type="button"
                onClick={onCancelEditing}
                className="flex justify-center items-center py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
              >
                <XCircle className="mr-2 h-5 w-5" />
                <span className="text-black">Annuler</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}