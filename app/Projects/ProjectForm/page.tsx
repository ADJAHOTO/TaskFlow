'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/app/components/ProjectForm'; // Adjust import path as needed
import { Project } from '@/lib/api';

export default function ProjectFormPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // You'll need to implement these based on your app's logic
  const handleProjectCreated = (project: Project) => {
    console.log('Project created:', project);
    // Navigate to projects list or show success message
    router.push('/projects');
  };

  const handleProjectUpdated = (project: Project) => {
    console.log('Project updated:', project);
    // Navigate back or show success message
    router.push('/projects');
  };

  const handleCancelEditing = () => {
    // Navigate back to projects list
    router.push('/projects');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectForm
        token={token}
        editingProject={editingProject}
        onProjectCreated={handleProjectCreated}
        onProjectUpdated={handleProjectUpdated}
        onCancelEditing={handleCancelEditing}
      />
    </div>
  );
}