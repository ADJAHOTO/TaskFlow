// lib/utils/idGenerator.ts
import prisma from '@/lib/prisma'; // Assurez-vous que le chemin est correct

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 5;

/**
 * Génère une chaîne alphanumérique aléatoire d'une longueur spécifiée.
 * @param length La longueur de la chaîne à générer.
 * @returns Une chaîne alphanumérique aléatoire.
 */
function generateRandomString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Génère un ID unique de 5 caractères pour un modèle Prisma donné.
 * Il essaie de générer un ID, puis vérifie son unicité dans la base de données.
 * Si l'ID existe déjà, il réessaie jusqu'à ce qu'un ID unique soit trouvé.
 * @param model Le modèle Prisma (ex: prisma.user, prisma.task, prisma.comment).
 * @returns Un ID unique de 5 caractères.
 */
export async function generateUniqueShortId(model: any): Promise<string> {
  let id: string;
  let exists: any | null;

  do {
    id = generateRandomString(ID_LENGTH);
    // Vérifier si l'ID existe déjà dans la base de données pour le modèle donné
    exists = await model.findUnique({
      where: { id: id },
      select: { id: true } // Ne sélectionner que l'ID pour optimiser
    });
  } while (exists); // Tant que l'ID existe, on réessaie

  return id;
}