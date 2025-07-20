'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '../components/ProtectedLayout';
import toast from 'react-hot-toast';
import { getTasks, deleteTask, Task } from '@/lib/api';
import {
  PlusCircle,
  Loader2,
  Edit,
  Trash2,
  Calendar,
  Tag,
  CheckCircle,
  ListChecks
} from 'lucide-react';

export default function TasksListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      router.push('/Login');
      return;
    }
    setToken(userToken);

    const fetchTasks = async (authToken: string) => {
      setIsLoading(true);
      try {
        const response = await getTasks(authToken);
        setTasks(response.tasks);
      } catch (err: any) {
        toast.error(err.message || 'Impossible de charger les tâches.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks(userToken);
  }, [router]);

  const navigateToTaskForm = (taskId?: string) => {
    const url = taskId ? `/Tasks/TaskForm?id=${taskId}` : '/Tasks/TaskForm';
    router.push(url);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    if (!token) return;

    try {
      await deleteTask(taskId, token);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Tâche supprimée avec succès !');
    } catch (err: any) {
      toast.error(err.message || 'Impossible de supprimer la tâche.');
    }
  };
  
  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'ELEVEE': return 'border-red-500';
      case 'MOYENNE': return 'border-yellow-500';
      case 'FAIBLE': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    const labels = {
      'A_FAIRE': 'À faire',
      'EN_COURS': 'En cours',
      'EN_ATTENTE': 'En attente',
      'TERMINE': 'Terminé'
    };
    return labels[status] || status;
  };

  return (
    <ProtectedLayout>
      <div className="p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center">
            <ListChecks className="mr-4 text-[#101060]" />
            Liste des Tâches
          </h1>
          <button
            onClick={() => navigateToTaskForm()}
            className="flex items-center gap-2 px-6 py-3 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nouvelle Tâche</span>
          </button>
        </header>

        {isLoading ? (
          <div className="text-center"><Loader2 className="animate-spin mx-auto h-12 w-12 text-[#101060]" /></div>
        ) : tasks.length === 0 ? (
          <p>Aucune tâche trouvée.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tasks.map(task => (
              <div key={task.id} className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${getPriorityClass(task.priority)} flex flex-col justify-between`}>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{task.description || 'Pas de description.'}</p>
                </div>
                <div className="text-sm space-y-2">
                  <p className="flex items-center gap-2"><Tag className="w-4 h-4 text-gray-500" /> Priorité: {task.priority}</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-500" /> Statut: {getStatusLabel(task.status)}</p>
                  {task.dueDate && <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /> Échéance: {new Date(task.dueDate).toLocaleDateString()}</p>}
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <button onClick={() => navigateToTaskForm(task.id)} className="p-2 rounded-lg hover:bg-gray-100"><Edit className="w-5 h-5 text-gray-600" /></button>
                  <button onClick={() => handleDeleteTask(task.id)} className="p-2 rounded-lg hover:bg-red-100"><Trash2 className="w-5 h-5 text-red-600" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}