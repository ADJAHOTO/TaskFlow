'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '../components/ProtectedLayout';
import toast from 'react-hot-toast';
import {
  getProjects,
  deleteProject,
  Project,
  UpdateProjectData
} from '@/lib/api';
import {
  PlusCircle,
  Loader2,
  FolderOpen,
  Folder,
  FolderCheck,
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
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  Pause,
  Play,
  Archive
} from 'lucide-react';
import ProjectForm from './ProjectForm/page';
import { updateProject } from '@/lib/api';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('authToken');
    setToken(userToken);

    const fetchProjects = async (authToken: string) => {
      setIsLoadingProjects(true);
      try {
        const response = await getProjects(authToken);
        const sortedProjects = response.projets.sort((a, b) => {
          const statusOrder = { 'EN_COURS': 1, 'EN_ATTENTE': 2, 'TERMINE': 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        setProjects(sortedProjects);
        toast.success('Projets récuperes avec succès')
      } catch (err: any) {
        console.error('Erreur lors de la récupération des projets:', err);
        toast.error(err.message || 'Impossible de charger les projets.');
        if (err.message && (err.message.includes('Token invalide') || err.message.includes('expiré'))) {
          localStorage.removeItem('authToken');
          console.clear()
          router.push('/Login');
        }
      } finally {
        setIsLoadingProjects(false);
      }
    };

    if (userToken) {
      fetchProjects(userToken);
    }
  }, [router]);

  // Filtrage des projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistiques
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'TERMINE').length,
    inProgress: projects.filter(p => p.status === 'EN_COURS').length,
    onHold: projects.filter(p => p.status === 'EN_ATTENTE').length
  };

  const handleProjectCreated = (project: Project) => {
    setProjects(prevProjects => [...prevProjects, project].sort((a, b) => {
      const statusOrder = { 'EN_COURS': 1, 'EN_ATTENTE': 2, 'TERMINE': 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    }));
    setShowForm(false);
  };

  const handleProjectUpdated = (project: Project) => {
    setProjects(prevProjects => prevProjects.map(p =>
      p.id === project.id ? project : p
    ).sort((a, b) => {
      const statusOrder = { 'EN_COURS': 1, 'EN_ATTENTE': 2, 'TERMINE': 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    }));
    setEditingProject(null);
    setShowForm(false);
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  const toggleProjectForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    setEditingProject(null);
    setShowForm(prev => !prev);
  };

  const handleChangeStatus = async (projectId: string, newStatus: Project['status']) => {
    if (!token) {
      toast.error('Token d\'authentification manquant.');
      router.push('/login');
      return;
    }

    try {
      const updatedProject = await updateProject(projectId, { status: newStatus }, token);
      setProjects(prevProjects => prevProjects.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      ).sort((a, b) => {
        const statusOrder = { 'EN_COURS': 1, 'EN_ATTENTE': 2, 'TERMINE': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }));
      toast.success(`Statut du projet mis à jour à "${getStatusLabel(newStatus)}" !`);
    } catch (err: any) {
      console.error('Erreur lors du changement de statut :', err);
      toast.error(err.message || 'Impossible de changer le statut.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Toutes les tâches associées seront également supprimées.')) return;
    if (!token) {
      toast.error('Token d\'authentification manquant.');
      router.push('/login');
      return;
    }
    setIsDeletingProject(true);
    try {
      await deleteProject(projectId, token);
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      toast.success('Projet supprimé avec succès !');
    } catch (err: any) {
      console.error('Erreur lors de la suppression du projet :', err);
      toast.error(err.message || 'Impossible de supprimer le projet.');
    } finally {
      setIsDeletingProject(false);
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'EN_COURS':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'EN_ATTENTE':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      case 'TERMINE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Project['status']) => {
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

  const getPriorityTag = (priority: Project['priority']) => {
    let colorClass = '';
    let icon = null;
    switch (priority) {
      case 'BASSE':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        icon = <Tag className="w-3 h-3 mr-1" />;
        break;
      case 'MOYENNE':
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        icon = <Tag className="w-3 h-3 mr-1" />;
        break;
      case 'HAUTE':
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        icon = <AlertTriangle className="w-3 h-3 mr-1" />;
        break;
      default:
        return null;
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {icon}{priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Non défini';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
                  📁 Gestionnaire de Projets
                </h1>
                <p className="text-xl text-gray-200">
                  Gérez et suivez vos projets de A à Z
                </p>
              </div>
              
              {/* Statistiques */}
              <div className="grid grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-[#B08C0A]">{stats.total}</div>
                  <div className="text-sm text-gray-200">Total</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-300">{stats.inProgress}</div>
                  <div className="text-sm text-gray-200">En cours</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-300">{stats.onHold}</div>
                  <div className="text-sm text-gray-200">En attente</div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-green-300">{stats.completed}</div>
                  <div className="text-sm text-gray-200">Terminés</div>
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
                    placeholder="Rechercher un projet..."
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
                  <option value="EN_COURS">En cours</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="TERMINE">Terminés</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent text-gray-900"
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="HAUTE">Haute</option>
                  <option value="MOYENNE">Moyenne</option>
                  <option value="BASSE">Basse</option>
                </select>
                
                <button
                  onClick={toggleProjectForm}
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
                      <span>Nouveau projet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Formulaire de Création/Édition */}
          {showForm && (
            <ProjectForm
              token={token}
              editingProject={editingProject}
              onProjectCreated={handleProjectCreated}
              onProjectUpdated={handleProjectUpdated}
              onCancelEditing={cancelEditing}
            />
          )}

          {/* Liste des projets */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FolderOpen className="mr-3 text-[#101060]" /> 
              Mes Projets ({filteredProjects.length})
            </h2>

            {isLoadingProjects ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin mx-auto h-12 w-12 text-[#101060] mb-4" />
                <p className="text-lg text-gray-600">Chargement de vos projets...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg text-gray-600 mb-2">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                    ? 'Aucun projet ne correspond à vos critères' 
                    : 'Vous n\'avez pas encore de projets'}
                </p>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                    ? 'Essayez de modifier vos filtres' 
                    : 'Créez votre premier projet pour commencer !'}
                </p>
                {!showForm && (
                  <button
                    onClick={toggleProjectForm}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all mx-auto"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Créer un projet</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`bg-gradient-to-br ${
                      project.status === 'TERMINE' ? 'from-green-50 to-green-100 border-green-200' :
                      project.status === 'EN_COURS' ? 'from-blue-50 to-blue-100 border-blue-200' :
                      'from-yellow-50 to-yellow-100 border-yellow-200'
                    } border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex flex-col h-full">
                      {/* En-tête du projet */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(project.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-bold truncate ${
                              project.status === 'TERMINE' ? 'text-green-800' : 'text-gray-900'
                            }`}>
                              {project.name}
                            </h3>
                          </div>
                        </div>
                        {getPriorityTag(project.priority)}
                      </div>
                      
                      {/* Description */}
                      {project.description && (
                        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                          {project.description}
                        </p>
                      )}
                      
                      {/* Informations du projet */}
                      <div className="flex-1 space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {getStatusLabel(project.status)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(project.createdAt)}
                          </span>
                        </div>
                        
                        {/* Compteur de tâches (si vous avez cette donnée) */}
                        {project.tasks && (
                          <div className="text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <ClipboardCheck className="w-4 h-4" />
                              {project.tasks.length} tâche{project.tasks.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          {/* Boutons de changement de statut */}
                          {project.status === 'EN_ATTENTE' && (
                            <button
                              onClick={() => handleChangeStatus(project.id, 'EN_COURS')}
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                              title="Commencer le projet"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          
                          {project.status === 'EN_COURS' && (
                            <>
                              <button
                                onClick={() => handleChangeStatus(project.id, 'TERMINE')}
                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                                title="Terminer le projet"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleChangeStatus(project.id, 'EN_ATTENTE')}
                                className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all duration-200"
                                title="Mettre en attente"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {project.status === 'TERMINE' && (
                            <button
                              onClick={() => handleChangeStatus(project.id, 'EN_COURS')}
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                              title="Reprendre le projet"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Bouton Modifier */}
                          <button
                            onClick={() => startEditing(project)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Bouton Supprimer */}
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={isDeletingProject}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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