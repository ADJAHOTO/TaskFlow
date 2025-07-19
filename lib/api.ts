const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

async function apiFetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`; // Construire l'URL complète de l'API

  // En-têtes par défaut pour les requêtes JSON
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Les tokens d'authentification seront ajoutés spécifiquement par les fonctions qui les nécessitent
  };

  try {
    const response = await fetch(url, {
      ...options, // Étendre les options passées (ex: method, body)
      headers: {
        ...defaultHeaders,    // Appliquer les en-têtes JSON par défaut
        ...options?.headers,  // Les en-têtes spécifiques (comme "Authorization") écrasent les défauts
      },
    });

    // Vérifier si la réponse HTTP est un succès (statut 2xx)
    if (!response.ok) {
      let errorMessage = `Erreur API: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json(); // Essayer de lire le message d'erreur du body JSON
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          // Pour les erreurs de validation qui peuvent renvoyer un tableau d'erreurs
          errorMessage = errorData.errors.map((err: any) => err.msg || err.message || err).join('; ');
        }
      } catch (jsonError) {
        // Ignorer l'erreur si le corps n'est pas un JSON valide (ex: pour 500 interne sans JSON valide)
        console.warn('Impossible de parser le JSON de la réponse d\'erreur:', jsonError);
      }
      throw new Error(errorMessage); // Lancer une erreur avec un message clair
    }

    // Tenter de parser la réponse JSON. Si la réponse est vide (ex: 204 No Content), retourner un objet vide.
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T; // Assurer le typage même pour une réponse vide

  } catch (error) {
    // Gérer les erreurs réseau ou les erreurs lancées par la fonction (si non instance d'Error)
    if (error instanceof Error) {
      console.error(`Erreur lors de la requête à ${url}:`, error.message);
      throw error; // Relancer l'erreur pour que le composant appelant la gère
    } else {
      console.error(`Une erreur inconnue est survenue lors de la requête à ${url}`, error);
      throw new Error('Une erreur réseau ou inconnue est survenue.');
    }
  }
}

export interface RegisterData {
    name: string,
    email: string,
    password: string
}

// Type pour les données de connexion
export interface LoginData {
  email: string;
  password: string;
}

// Type pour la réponse d'utilisateur après inscription/connexion (sans le mot de passe)
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isUser: boolean;
  createdAt?: string;
}

// Type pour la réponse complète de l'API de connexion/inscription
export interface AuthResponse {
  message: string;
  token: string;
  user: UserResponse;
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
    return apiFetcher<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
    return apiFetcher<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

// --- Interfaces pour les Tâches ---

export interface TaskUser {
  id: string
  name: string
  email: string
}


export interface Task {
  id: string;
  title: string;
  description: string | null; 
  status: 'A_FAIRE'| 'EN_COURS' | 'EN_ATTENTE' | 'TERMINE' ;
  priority: 'FAIBLE' | 'MOYENNE' | 'ELEVEE';
  dueDate: string | null; 
  userId: string;
  user?: TaskUser; 
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Pour créer une tâche: on omet les champs générés par le backend (id, dates, user/comments)
export interface CreateTaskData extends Omit<Task, 'id' | 'user'  | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  // dueDate hérite du type 'string | null' de Task
}

// Pour mettre à jour une tâche: tous les champs sont optionnels (Partial) et on omet les mêmes
export type UpdateTaskData = Partial<Omit<Task, 'id' | 'user' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;

export interface GetTasksResponse {
  tasks: Task[]
  total?: number;
}

export async function getTasks(token: string): Promise<GetTasksResponse> {
  return apiFetcher<GetTasksResponse>('/tasks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // <-- ENVOI DU TOKEN ICI
    },
  });
}

export async function createTask(taskData: CreateTaskData, token: string): Promise<Task> {
  return apiFetcher<Task>('/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // <-- ENVOI DU TOKEN ICI
    },
    body: JSON.stringify(taskData), // Convertir les données en JSON
  });
}

export async function updateTask(taskId: string, updatedData: UpdateTaskData, token: string): Promise<Task> {
  return apiFetcher<Task>(`/tasks/${taskId}`, { // URL de la tâche spécifique
    method: 'PUT', // Ou 'PATCH' si votre API gère les mises à jour partielles avec PATCH
    headers: {
      'Authorization': `Bearer ${token}`, // <-- ENVOI DU TOKEN ICI
    },
    body: JSON.stringify(updatedData),
  });
}

export async function deleteTask(taskId: string, token: string): Promise<{ message: string }> {
  return apiFetcher<{ message: string }>(`/tasks/${taskId}`, { // URL de la tâche spécifique
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, // <-- ENVOI DU TOKEN ICI
    },
  });
}

// --- Interfaces pour les Projets ---

// L'interface de base pour un Projet tel que retourné par l'API
export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE';
  priority: 'BASSE' | 'MOYENNE' | 'HAUTE'; 
  ownerId: string;
  owner?: UserResponse; 
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Pour créer un projet : on omet les champs générés par le backend (id, dates, owner)
export interface CreateProjectData extends Omit<Project, 'id' | 'owner' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  
}

// Pour mettre à jour un projet : tous les champs sont optionnels (Partial) et on omet les mêmes
export type UpdateProjectData = Partial<Omit<Project, 'id' | 'owner' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;

// Interface pour la réponse de la liste des projets
export interface GetProjectsResponse {
  projets: Project[];
  total?: number;
}

// --- Fonctions CRUD pour les Projets ---

// Récupérer tous les projets de l'utilisateur
export async function getProjects(token: string): Promise<GetProjectsResponse> {
  return apiFetcher<GetProjectsResponse>('/projets', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// Récupérer un projet spécifique par son ID
export async function getProjectById(projectId: string, token: string): Promise<Project> {
  return apiFetcher<Project>(`/projets/${projectId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// Créer un nouveau projet
export async function createProject(projectData: CreateProjectData, token: string): Promise<Project> {
  return apiFetcher<Project>('/projets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });
}

// Mettre à jour un projet existant
export async function updateProject(projectId: string, updatedData: UpdateProjectData, token: string): Promise<Project> {
  return apiFetcher<Project>(`/projets/${projectId}`, {
    method: 'PUT', 
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
}

// Supprimer (ou "soft-delete") un projet
export async function deleteProject(projectId: string, token: string): Promise<{ message: string }> {
  return apiFetcher<{ message: string }>(`/projets/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}