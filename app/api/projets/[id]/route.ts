import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/utils/auth'
import { ProjectPriority, ProjectStatus } from '@/lib/generated/prisma'

export async function GET(request: NextRequest, context: any) {
  const { params } = await context
  const projectId = params.id

  try {
    const authResult = authenticateRequest(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId: authenticatedUserId } = authResult;

    const projet = await prisma.project.findUnique({
      where: {
        id: projectId,
        ownerId: authenticatedUserId,
        deletedAt: null
      },
      include: {
        owner: {select: {id: true, name: true, email:true}}
      }
    })

    if(!projet) {
      return NextResponse.json({ message: "Tâche non trouvée." }, { status: 404 });
    }

    return NextResponse.json(projet)
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    return NextResponse.json(
      { message: "Échec de la récupération de la tâche", error },
      { status: 500 }
    );
    
  }
}


export async function PUT(request: NextRequest, context: any) {
  const { params } = context
  const projetId = params.id

  if (!projetId || typeof projetId !== 'string') {
    return NextResponse.json({ message: 'ID du projet invalide.' }, { status: 400 })
  }

  try {
    const authResult = authenticateRequest(request)
    if (authResult instanceof NextResponse) return authResult

    const { userId: authenticatedUserId } = authResult
    const { name, description, status, priority } = await request.json()

    const updateData: {
      name?: string
      description?: string | null
      status?: ProjectStatus
      priority?: ProjectPriority
      updatedAt: Date
    } = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description

    if (status !== undefined) {
      if (Object.values(ProjectStatus).includes(status)) {
        updateData.status = status as ProjectStatus
      } else {
        return NextResponse.json(
          { message: `Le statut "${status}" est invalide.` },
          { status: 400 }
        )
      }
    }

    if (priority !== undefined) {
      if (Object.values(ProjectPriority).includes(priority)) {
        updateData.priority = priority as ProjectPriority
      } else {
        return NextResponse.json(
          { message: `La priorité "${priority}" est invalide.` },
          { status: 400 }
        )
      }
    }

    const updatedProjet = await prisma.project.update({
      where: {
        id: projetId,
        ownerId: authenticatedUserId,
        deletedAt: null,
      },
      data: updateData,
    })

    return NextResponse.json(updatedProjet)
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour du projet ${projetId}:`, error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Projet non trouvé pour la mise à jour.' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Échec de la mise à jour du projet', error },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const { params } = await context
  const projetId = params.id

  if (!projetId || typeof projetId !== "string") {
    return NextResponse.json({ message: "ID de tâche invalide." }, { status: 400 });
  }

  try {
    const authResult = authenticateRequest(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId: authenticatedUserId } = authResult;

    const projet = await prisma.project.update({
      where: {
        id: projetId,
        ownerId: authenticatedUserId,
        deletedAt: null
      },
      data: { deletedAt: new Date()},
      select: { id: true, name:true, deletedAt:true}
    })
    return NextResponse.json({ message: `Tâche "${projet.name}" marquée comme supprimée.`, projet });
  } catch (error) {
      console.error(`Erreur lors de la suppression douce du projet ${projetId}:`, error);
    return NextResponse.json({ message: "Échec de la suppression douce du projet", error }, { status: 500 });
  }
}
