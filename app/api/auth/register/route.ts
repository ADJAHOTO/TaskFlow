import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma'
import { generateUniqueShortId } from "@/lib/utils/idGenerator";

export async function POST(request: Request) {
    try {
        const {email, name, password} = await request.json()

     if (!email || !name || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe sont requis.' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà enregistré.' },
        { status: 409 } // Conflict
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUserId = await generateUniqueShortId(prisma.user);

    const newUser = await prisma.user.create({
        data: {
          id: newUserId,
          email,
          password: hashedPassword,
          name,
          isAdmin: false,
          isUser: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isUser: true,
        createdAt: true,
      },
    })
    return NextResponse.json(
        { message: 'Inscription réussie', user: newUser },
        { status: 201 }
    )
    
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return NextResponse.json(
        { message: 'Une erreur est survenue lors de l\'inscription.' },
        { status: 500 }
        );
    }
}