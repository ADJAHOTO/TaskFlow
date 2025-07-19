// components/ToastProvider.tsx
'use client'; 

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000, 
        style: {
          background: '#363636', // Couleur de fond du toast (noir/gris foncé)
          color: '#fff',        // Couleur du texte du toast (blanc)
        },
        // Styles pour les toasts de succès
        success: {
          duration: 3000,
          iconTheme: { 
            primary: '#28a745', // Un vert plus standard (vous pouvez ajuster cette couleur)
            secondary: '#fff',  // Couleur secondaire pour l'icône (ex: le cercle derrière le ✓)
          },
        },
        // Styles pour les toasts d'erreur
        error: {
          duration: 5000,
          iconTheme: { 
            primary: '#dc3545', // Un rouge plus standard
            secondary: '#fff',
          },
        },
      }}
    />
  );
}