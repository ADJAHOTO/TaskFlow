import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthTokenPayload {
    userId: string
    email: string
    isAdmin: boolean
    isUser: boolean
    iat: number
    exp: number
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
    const secret = process.env.JWT_SECRET

    if(!secret) {
        console.error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
        return  null
    }

    try {
        const decoded = jwt.verify(token, secret) as AuthTokenPayload
        return decoded
    } catch (error) {
        console.error('Une erreur lors de la vérification du token JWT:', error)
        return null
    }
}

export function authenticateRequest(request: NextRequest): AuthTokenPayload | NextResponse {
    //  implementation: extract token from headers and verify
    const authHeader = request.headers.get('authorization');
    if(!authHeader  || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({
           message: 'Authentification requise: Token manquant ou format invalide.'
        },{
            status:401
        })
    }

    const token = authHeader.split(' ')[1]; // Extrait le token après 'Bearer '
    const decodedToken = verifyAuthToken(token);

    if(!decodedToken){
           return NextResponse.json(
      { message: 'Authentification requise: Token invalide ou expiré.' },
      { status: 401 }
    );
    }
    return decodedToken
}