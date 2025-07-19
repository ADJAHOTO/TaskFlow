import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateUniqueShortId } from '@/lib/utils/idGenerator';

export async function POST(request: Request) {
    try {
        const { content, taskId, userId } = await request.json();

        if (!content || !taskId || !userId) {
        return NextResponse.json(
            { message: 'Contenu, ID de tâche et ID utilisateur sont requis pour un commentaire.' },
            { status: 400 }
        );
    }

    // Générer un ID unique de 5 caractères pour la tâche
    const newCommentId = await generateUniqueShortId(prisma.comment);

    const newComment = await prisma.comment.create({
        data: {
            id: newCommentId,
            content,
            taskId: taskId,
            userId: userId
        }
    })
    return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
       console.error('Erreur lors de l\'ajout du commentaire:', error);
        return NextResponse.json({ message: 'Échec de l\'ajout du commentaire', error }, { status: 500 });
    }
}