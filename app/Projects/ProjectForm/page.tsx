// app/Projects/ProjectForm/page.tsx
'use client';

import React, { JSX } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import MyProjectForm from '@/app/components/ProjectForm'; 
import { Project } from '@/lib/api'; 

// Interface pour les props du composant (optionnel mais recommandé)
interface ProjectFormPageProps {
  // Vous pouvez ajouter des props ici si nécessaire
}

// Le composant page doit être exporté par défaut et doit être un composant React
export default function ProjectFormPage(): JSX.Element {
  const router = useRouter();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Récupération du token côté client uniquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  // Fonctions de rappel pour les événements du formulaire
  const handleProjectCreated = (project: Project) => {
    toast.success(`Projet "${project.name}" créé !`);
    router.push('/Projects'); // Redirige vers la liste des projets après création
  };

  const handleProjectUpdated = (project: Project) => {
    toast.success(`Projet "${project.name}" mis à jour !`);
    setEditingProject(null); // Quitte le mode édition
    router.push('/Projects'); // Redirige ou rafraîchit la liste
  };

  const handleCancelEditing = () => {
    setEditingProject(null); // Quitte le mode édition
    router.push('/Projects'); // Redirige si nécessaire
  };

  // Affichage d'un loader pendant que le token se charge
  if (typeof window !== 'undefined' && token === null) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <MyProjectForm
        token={token}
        editingProject={editingProject}
        onProjectCreated={handleProjectCreated}
        onProjectUpdated={handleProjectUpdated}
        onCancelEditing={handleCancelEditing}
      />
    </div>
  );
}