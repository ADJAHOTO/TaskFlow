'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '../components/ProtectedLayout';
import toast from 'react-hot-toast';
import {
  getProjects,
  deleteProject,
  Project,
  updateProject
} from '@/lib/api';
import {
  PlusCircle,
  Loader2,
  FolderOpen,
  Folder,
  Edit,
  Trash2,
  CalendarDays,
  Tag,
  AlertTriangle,
  Search,
  Clock,
  CheckCircle,
  Pause,
  Play
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      router.push('/Login');
      return;
    }
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
      } catch (err: any) {
        console.error('Erreur lors de la récupération des projets:', err);
        toast.error(err.message || 'Impossible de charger les projets.');
        if (err.message?.includes('Token invalide') || err.message?.includes('expiré')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/Login');
        }
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects(userToken);
  }, [router]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'TERMINE').length,
    inProgress: projects.filter(p => p.status === 'EN_COURS').length,
    onHold: projects.filter(p => p.status === 'EN_ATTENTE').length
  };

  const navigateToProjectForm = (projectId?: string) => {
    const url = projectId ? `/Projects/ProjectForm?id=${projectId}` : '/Projects/ProjectForm';
    router.push(url);
  };

  const handleChangeStatus = async (projectId: string, newStatus: Project['status']) => {
    if (!token) {
      toast.error('Token d\'authentification manquant.');
      router.push('/Login');
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
      toast.success(`Statut du projet mis à jour !`);
    } catch (err: any) {
      console.error('Erreur lors du changement de statut :', err);
      toast.error(err.message || 'Impossible de changer le statut.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    if (!token) {
      toast.error('Token d\'authentification manquant.');
      router.push('/Login');
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
      case 'EN_COURS': return <Play className="w-5 h-5 text-blue-500" />;
      case 'EN_ATTENTE': return <Pause className="w-5 h-5 text-yellow-500" />;
      case 'TERMINE': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'EN_COURS': return 'En cours';
      case 'EN_ATTENTE': return 'En attente';
      case 'TERMINE': return 'Terminé';
      default: return status;
    }
  };

  const getPriorityTag = (priority: Project['priority']) => {
    let colorClass = '';
    switch (priority) {
      case 'BASSE': colorClass = 'bg-green-100 text-green-800 border-green-200'; break;
      case 'MOYENNE': colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200'; break;
      case 'HAUTE': colorClass = 'bg-red-100 text-red-800 border-red-200'; break;
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        <Tag className="w-3 h-3 mr-1" />
        {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#101060] to-[#1a1580] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">Gestionnaire de Projets</h1>
                <p className="text-xl text-gray-200">Suivez vos projets de A à Z</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center bg-white/10 rounded-lg p-3"><div className="text-3xl font-bold">{stats.total}</div><div className="text-sm">Total</div></div>
                <div className="text-center bg-white/10 rounded-lg p-3"><div className="text-3xl font-bold">{stats.inProgress}</div><div className="text-sm">En cours</div></div>
                <div className="text-center bg-white/10 rounded-lg p-3"><div className="text-3xl font-bold">{stats.onHold}</div><div className="text-sm">En attente</div></div>
                <div className="text-center bg-white/10 rounded-lg p-3"><div className="text-3xl font-bold">{stats.completed}</div><div className="text-sm">Terminés</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060]">
                  <option value="all">Tous les statuts</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="TERMINE">Terminés</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101060]">
                  <option value="all">Toutes les priorités</option>
                  <option value="HAUTE">Haute</option>
                  <option value="MOYENNE">Moyenne</option>
                  <option value="BASSE">Basse</option>
                </select>
                <button onClick={() => navigateToProjectForm()} className="flex items-center gap-2 px-4 py-2 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all">
                  <PlusCircle className="w-5 h-5" />
                  <span>Nouveau projet</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FolderOpen className="mr-3 text-[#101060]" /> 
              Mes Projets ({filteredProjects.length})
            </h2>
            {isLoadingProjects ? (
              <div className="text-center py-12"><Loader2 className="animate-spin mx-auto h-12 w-12 text-[#101060]" /></div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' ? 'Aucun projet ne correspond à vos critères' : 'Vous n\'avez pas encore de projets'}
                </p>
                <button onClick={() => navigateToProjectForm()} className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#101060] text-white rounded-lg hover:bg-[#0c0c50] transition-all mx-auto">
                  <PlusCircle className="w-5 h-5" />
                  <span>Créer un projet</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(project.status)}
                        <h3 className="text-lg font-bold text-gray-900 truncate">{project.name}</h3>
                      </div>
                      {getPriorityTag(project.priority)}
                    </div>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{project.description || 'Aucune description.'}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDate(project.createdAt)}</span>
                      <span className="font-semibold">{getStatusLabel(project.status)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {project.status === 'EN_ATTENTE' && <button onClick={() => handleChangeStatus(project.id, 'EN_COURS')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200" title="Commencer"><Play className="w-4 h-4" /></button>}
                        {project.status === 'EN_COURS' && (
                          <>
                            <button onClick={() => handleChangeStatus(project.id, 'TERMINE')} className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200" title="Terminer"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleChangeStatus(project.id, 'EN_ATTENTE')} className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200" title="Mettre en attente"><Pause className="w-4 h-4" /></button>
                          </>
                        )}
                        {project.status === 'TERMINE' && <button onClick={() => handleChangeStatus(project.id, 'EN_COURS')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200" title="Reprendre"><Play className="w-4 h-4" /></button>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigateToProjectForm(project.id)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200" title="Modifier"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProject(project.id)} disabled={isDeletingProject} className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
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