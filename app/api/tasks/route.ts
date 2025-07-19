import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import { generateUniqueShortId } from '@/lib/utils/idGenerator';
import { authenticateRequest } from "@/lib/utils/auth";

export async function GET(request: NextRequest) {
  try {
    //  AUTHENTIFICATION : Vérifier que l'utilisateur est connecté et obtenir son ID
    const authResult = authenticateRequest(request)
    // Si authResult est une réponse NextResponse, cela signifie qu'il y a eu une erreur d'authentification.
    if(authResult instanceof NextResponse) {
      return authResult
    }

    const { userId } = authResult

    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({tasks})
  } catch (error) {
    console.error('Erreur lors de la récuperation des taches:', error)
    return NextResponse.json(
      {
        message: 'Echec lors de la récuperation des taches:', error
      },
      {
        status: 500
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {

    // 1. Authentifier la requête
    const authResult = authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Retourne la réponse d'erreur si l'authentification échoue
    }

    // Si l'authentification réussit, authResult est le payload du token
    const { userId: authenticatedUserId } = authResult; // Renommez pour éviter la confusion avec userId du body
    
    const {title, description, status, priority, dueDate } = await request.json()
    
      if (!title || !status || !priority) {
      return NextResponse.json(
        {message: 'Titre, statut, priorité et ID utilisateur sont requis.'},
        {status: 400}
      )}

      // Générer un ID unique de 5 caractères pour la tâche
      const newTaskId = await generateUniqueShortId(prisma.task);

      const newTask = await prisma.task.create({
      data: {
        id: newTaskId,
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: authenticatedUserId, // <-- Utilisez l'ID de l'utilisateur AUTHENTIFIÉ par le token
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newTask, {status: 201})
  } catch (error) {
    console.log('Error lors de la création de la tache:', error)
    return NextResponse.json(
      {
        message: 'Erreur lors de la création de la tache:', error
      },
      {
        status: 500
      }
    )
  }
}