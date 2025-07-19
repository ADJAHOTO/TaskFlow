'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '../components/ProtectedLayout';
import toast from 'react-hot-toast';
import {
  getTasks,
  deleteTask,
  Task,
  UpdateTaskData
} from '@/lib/api';
import {
  PlusCircle,
  Loader2,
  ListTodo,
  ClipboardList,
  CheckCircle,
  Edit,
  Trash2,
  CalendarDays,
  Tag,
  AlertTriangle,
  ClipboardCheck,
  XCircle,
  Filter,
  Search,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';
import TaskForm from './TaskForm/page';
import { updateTask } from '@/lib/api';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('authToken');
    setToken(userToken);

    const fetchTasks = async (authToken: string) => {
      setIsLoadingTasks(true);
      try {
        const response = await getTasks(authToken);
        const sortedTasks = response.tasks.sort((a, b) => {
          const statusOrder = { 'A_FAIRE': 1, 'EN_COURS': 2, 'EN_ATTENTE': 3, 'TERMINE': 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        setTasks(sortedTasks);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des tâches:', err);
        toast.error(err.message || 'Impossible de charger les tâches.');
        if (err.message && (err.message.includes('Token invalide') || err.message.includes('expiré'))) {
          localStorage.removeItem('authToken');
          console.clear()
          router.push('/Login');
        }
      } finally {
        setIsLoadingTasks(false);
      }
    };

    if (userToken) {
      fetchTasks(userToken);
    }
  }, [router]);

  // Filtrage des tâches
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistiques
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'TERMINE').length,
    inProgress: tasks.filter(t => t.status === 'EN_COURS').length,
    todo: tasks.filter(t => t.status === 'A_FAIRE').length,
    onHold: tasks.filter(t => t.status === 'EN_ATTENTE').length
  };

  const handleTaskCreated = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task].sort((a, b) => {
      const statusOrder = { 'A_FAIRE': 1, 'EN_COURS': 2, 'EN_ATTENTE': 3, 'TERMINE': 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    }));
    setShowForm(false);
  };

  const handleTaskUpdated = (task: Task) => {
    setTasks(prevTasks => prevTasks.map(t =>
      t.id === task.id ? task : t
    ).sort((a, b) => {
      const statusOrder = { 'A_FAIRE': 1, 'EN_COURS': 2, 'EN_ATTENTE': 3, 'TERMINE': 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    }));
    setEditingTask(null);
    setShowForm(false);
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const toggleTaskForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    setEditingTask(null);
    setShowForm(prev => !prev);
  };

  const handleChangeStatus = async (taskId: string, newStatus: Task['status']) => {
    if (!token) {
      toast.error('Token d\'authentification manquant.');
      router.push('/login');
      return;
    }

    try {
      const updatedTask = await updateTask(taskId, { status: newStatus }, token);
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ).sort((a, b) => {
        const statusOrder = { 'A_FAIRE': 1, 'EN_COURS': 2, 'EN_ATTENTE': 3, 'TERMINE': 4 };
        return statusOrder[a.status] - statusOrder[b.status];
      }));
      
      const statusMessages = {
        'A_FAIRE': 'À faire',
        'EN_COURS': 'En cours',
        'EN_ATTENTE': 'En attente',
        'TERMINE': 'Terminée'
      };
      
      toast.success(`Statut de la tâche mis à jour à "${statusMessages[newStatus]}" !`);
    } catch (err: any) {
      console.error('Erreur lors du changement de statut :', err);
      toast.error(err.message || 'Impossible de changer le statut.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    if (!token) {
      toast.error('Token d\'authentification manquant.');
      router.push('/login');
      return;
    }
    setIsDeletingTask(true);
    try {
      await deleteTask(taskId, token);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Tâche supprimée avec succès !');
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la tâche :', err);
      toast.error(err.message || 'Impossible de supprimer la tâche.');
    } finally {
      setIsDeletingTask(false);
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'A_FAIRE':
        return <ListTodo className="w-5 h-5 text-gray-500" />;
      case 'EN_COURS':
        return <ClipboardList className="w-5 h-5 text-blue-500" />;
      case 'EN_ATTENTE':
        return <ClipboardCheck className="w-5 h-5 text-yellow-500" />;
      case 'TERMINE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityTag = (priority: Task['priority']) => {
    let colorClass = '';
    let icon = null;
    switch (priority) {
      case 'FAIBLE':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        icon = <Tag className="w-3 h-3 mr-1" />;
        break;
      case 'MOYENNE':
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        icon = <Tag className="w-3 h-3 mr-1" />;
        break;
      case 'ELEVEE':
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        icon = <AlertTriangle className="w-3 h-3 mr-1" />;
        break;
      default:
        return null;
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {icon}{priority === 'FAIBLE' ? 'Faible' : priority === 'MOYENNE' ? 'Moyenne' : 'Élevée'}
      </span>
    );
  };

  const formatDueDate = (dateString?: string | null) => {
    if (!dateString) return 'Pas de date';
    try {
      const date = new Date(dateString);
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'En retard';
      if (diffDays === 0) return 'Aujourd\'hui';
      if (diffDays === 1) return 'Demain';
      return date.toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  return (
    <ProtectedLayout>
       <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E8EDF2] to-[#DDE5EB]">
        {/* Header avec gradient et statistiques */}
        <div className="bg-gradient-to-r from-[#101060] via-[#1a1580] to-[#B08C0A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                  🚀 Gestionnaire de Tâches
                </h1>
                <p className="text-xl text-gray-200">
                  Organisez, priorisez et accomplissez vos objectifs
                </p>
              </div>
              
              {/* Statistiques */}
              <div className="grid grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-[#B08C0A]">{stats.total}</div>
                  <div className="text-sm text-gray-200">Total</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-300">{stats.todo}</div>
                  <div className="text-sm text-gray-200">À faire</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-300">{stats.inProgress}</div>
                  <div className="text-sm text-gray-200">En cours</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-green-300">{stats.completed}</div>
                  <div className="text-sm text-gray-200">Terminées</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher une tâche..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent transition-all text-gray-900"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent text-gray-900"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="A_FAIRE">À faire</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="TERMINE">Terminées</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent text-gray-900"
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="ELEVEE">Élevée</option>
                  <option value="MOYENNE">Moyenne</option>
                  <option value="FAIBLE">Faible</option>
                </select>
                
                <button
                  onClick={toggleTaskForm}
                  className="flex items-center gap-2 px-4 py-2 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all"
                >
                  {showForm ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Annuler</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      <span>Ajouter une tâche</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Formulaire de Création/Édition */}
          {showForm && (
            <TaskForm
              token={token}
              editingTask={editingTask}
              onTaskCreated={handleTaskCreated}
              onTaskUpdated={handleTaskUpdated}
              onCancelEditing={cancelEditing}
            />
          )}

          {/* Liste des tâches */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <ClipboardCheck className="mr-3 text-[#101060]" /> 
              Mes Tâches ({filteredTasks.length})
            </h2>

            {isLoadingTasks ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin mx-auto h-12 w-12 text-[#101060] mb-4" />
                <p className="text-lg text-gray-600">Chargement de vos tâches...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg text-gray-600 mb-2">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                    ? 'Aucune tâche ne correspond à vos critères' 
                    : 'Vous n\'avez pas encore de tâches'}
                </p>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                    ? 'Essayez de modifier vos filtres' 
                    : 'Créez votre première tâche pour commencer !'}
                </p>
                {!showForm && (
                  <button
                    onClick={toggleTaskForm}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Ajouter une tâche</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-gradient-to-r ${
                      task.status === 'TERMINE' ? 'from-green-50 to-green-100 border-green-200' :
                      task.status === 'EN_COURS' ? 'from-blue-50 to-blue-100 border-blue-200' :
                      task.status === 'EN_ATTENTE' ? 'from-yellow-50 to-yellow-100 border-yellow-200' :
                      'from-gray-50 to-gray-100 border-gray-200'
                    } border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(task.status)}
                          </div>
                          <h3 className={`text-xl font-bold ${
                            task.status === 'TERMINE' ? 'text-green-800 line-through' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          {getPriorityTag(task.priority)}
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-600 mb-3 ml-8">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 ml-8">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {formatDueDate(task.dueDate)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {task.status === 'A_FAIRE' ? 'À faire' : 
                            task.status === 'EN_COURS' ? 'En cours' : 
                            task.status === 'EN_ATTENTE' ? 'En attente' : 'Terminée'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Boutons de changement de statut */}
                        {task.status === 'A_FAIRE' && (
                          <button
                            onClick={() => handleChangeStatus(task.id, 'EN_COURS')}
                            className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 disabled:opacity-50"
                            title="Commencer"
                          >
                            <ClipboardList className="w-5 h-5" />
                          </button>
                        )}
                        
                        {task.status === 'EN_COURS' && (
                          <>
                            <button
                              onClick={() => handleChangeStatus(task.id, 'TERMINE')}
                              className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200 disabled:opacity-50"
                              title="Terminer"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleChangeStatus(task.id, 'EN_ATTENTE')}
                              className="p-3 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all duration-200 disabled:opacity-50"
                              title="Mettre en attente"
                            >
                              <ClipboardCheck className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        
                        {task.status === 'EN_ATTENTE' && (
                          <button
                            onClick={() => handleChangeStatus(task.id, 'EN_COURS')}
                            className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 disabled:opacity-50"
                            title="Reprendre"
                          >
                            <ClipboardList className="w-5 h-5" />
                          </button>
                        )}
                        
                        {task.status !== 'A_FAIRE' && (
                          <button
                            onClick={() => handleChangeStatus(task.id, 'A_FAIRE')}
                            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                            title="Remettre à faire"
                          >
                            <ListTodo className="w-5 h-5" />
                          </button>
                        )}

                        {/* Bouton Modifier */}
                        <button
                          onClick={() => startEditing(task)}
                          className="p-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all duration-200 disabled:opacity-50"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        {/* Bouton Supprimer */}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={isDeletingTask}
                          className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}