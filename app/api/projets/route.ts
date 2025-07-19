import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateUniqueShortId } from '@/lib/utils/idGenerator'
import { authenticateRequest } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request)
    if (authResult instanceof NextResponse) return authResult

    const { userId } = authResult

    const projets = await prisma.project.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
      },
      include: {
        owner: {
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
    })

    return NextResponse.json({projets})
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error)
    return NextResponse.json(
      { message: 'Échec lors de la récupération des projets', error },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request)
    if (authResult instanceof NextResponse) return authResult

    const { userId: authenticatedUserId } = authResult
    const { name, description, status, priority } = await request.json()

    if (!name || !status || !priority) {
      return NextResponse.json(
        { message: 'Les champs name, status et priority sont requis.' },
        { status: 400 }
      )
    }

    const newProjetId = await generateUniqueShortId(prisma.project)

    const newProjet = await prisma.project.create({
      data: {
        id: newProjetId,
        name,
        description,
        status,
        priority,
        ownerId: authenticatedUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(newProjet, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création du projet', error },
      { status: 500 }
    )
  }
}
