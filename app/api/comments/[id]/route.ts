import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Mettre a jour un commentaire par son ID 
export async function PUT(request: Request, {params} : {params : {id: string}}) {
    const commentId = parseInt(params.id)

    if (isNaN(commentId)) {
        return NextResponse.json({ message: 'ID de commentaire invalide.' }, { status: 400 });
    }

    try {
        const { content } = await request.json()

        if(!content) {
           return NextResponse.json({ message: 'Le contenu du commentaire est requis pour la mise à jour.' }, { status: 400 });
        }

        const updatedComment = await prisma.comment.update({
            wherer: {id:commentId},
            data: {
                content,
                updatedAt: new Date()
            }
        })
        return NextResponse.json(updatedComment, {status:200});    
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du commentaire ${commentId}:`, error);
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: 'Commentaire non trouvé pour la mise à jour.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Échec de la mise à jour du commentaire', error }, { status: 500 });
            
    }
}

// Supprimer un commentaire par son ID 

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const commentId = parseInt(params.id);
    if (isNaN(commentId)) {
        return NextResponse.json({ message: 'ID de commentaire invalide.' }, { status: 400 });
    }

    try {
        await prisma.comment.delete({
            where: {id: commentId}
        })
        return NextResponse.json({ message: 'Commentaire supprimé avec succès.' }, { status:200 });
    } catch (error) {
        console.error(`Erreur lors de la suppression du commentaire ${commentId}:`, error);
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: 'Commentaire non trouvé pour la suppression.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Échec de la suppression du commentaire', error }, { status: 500 });
        
    }
}