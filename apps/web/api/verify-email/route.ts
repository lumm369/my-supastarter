import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { db } from "@repo/server/database/client";
import { lucia } from "@repo/server/auth/lucia";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    const token = searchParams.get('token')

    console.log('token', token)

    if(!token) {
      return Response.json(
        {
          error: 'Token is not existed'
        },
        {
          status: 404
        }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string,
      code: string,
      userId: string
    }
  
    console.log('decoded', decoded)

    const emailVerificationResult = await db.emailVerification.findFirst({
      where: {
        userId: decoded.userId,
        code: decoded.code,
      }
    })

    if(!emailVerificationResult) {
      return Response.json(
        {
          error: 'Token is invalid 1'
        },
        {
          status: 400
        }
      )
    }

    await db.emailVerification.delete({
      where: {
        id: decoded.userId
      }
    })

    await db.user.update({
      data: {
        isEmailVerified: true
      },
      where: {
        email: decoded.email
      }
    })


    const session = await lucia.createSession(decoded.userId, {
      expiresIn: 60 * 60 * 24 * 30 // 30 days
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  
    return Response.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}?emailVerified=${true}`), 302)
    
  } catch (error: any) {
    return Response.json(
      {
        error: 'Token is invalid 2'
      },
      {
        status: 400
      }
    )
  }
}