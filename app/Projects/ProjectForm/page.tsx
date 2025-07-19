// app/Projects/ProjectForm/page.tsx
'use client'; // Indique que c'est un client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProjectForm from '@/app/components/ProjectForm'; 
import { Project } from '@/lib/api'; 

export default function ProjectFormPage() {
  const router = useRouter();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  // Il faudrait idéalement récupérer le token d'authentification ici
  // par exemple via un contexte d'authentification ou une session NextAuth
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Exemple simplifié

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

  // Si tu veux gérer l'édition, tu devrais probablement récupérer le project ID depuis les params de l'URL
  // et le fetcher ici pour initialiser editingProject.
  // Par exemple, si ta route était /Projects/ProjectForm/[id]

  return (
    <div className="container mx-auto p-4">
      <ProjectForm
        token={token}
        editingProject={editingProject} // Passer le projet à éditer si besoin
        onProjectCreated={handleProjectCreated}
        onProjectUpdated={handleProjectUpdated}
        onCancelEditing={handleCancelEditing}
      />
    </div>
  );
}