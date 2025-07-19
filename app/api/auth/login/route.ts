import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()


        if (!email || !password) {
        return NextResponse.json(
            { message: 'Email et mot de passe sont requis.' },
            { status: 400 }
        );
        }

        // Rechercher l'utilisateur par email
        const user = await prisma.user.findUnique({
        where: { email },
        });

        if (!user || user.deletedAt !== null) {
        return NextResponse.json(
            { message: 'Identifiants invalides.' },
            { status: 401 } // Unauthorized
        );
        }

        // Comparer le mot de passe fourni avec le mot de passe haché dans la DB
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
        return NextResponse.json(
            { message: 'Identifiants invalides.' },
            { status: 401 }
        );
        }

        // Générer un JSON Web Token (JWT)
        // IMPORTANT: Stockez cette clé secrète dans vos variables d'environnement (.env)
        const secret = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Utilisez une clé forte en production
        const expiresIn = '30min';

        const token = jwt.sign(
        { userId: user.id, userEmail: user.email, isAdmin: user.isAdmin, isUser: user.isUser },
        secret,
        { expiresIn }
        );

        return NextResponse.json(
        {
            message: 'Connexion réussie',
            token,
            user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            isUser: user.isUser,
            },
        },
        { status: 200 }
        );  
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return NextResponse.json(
        { message: 'Une erreur est survenue lors de la connexion.' },
        { status: 500 }
        );
    }
}