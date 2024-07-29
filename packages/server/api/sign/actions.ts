"use server"

import { validateRequest, lucia } from '@/auth/lucia'
import { SignUpSchema, SignInSchema } from "@/database/zod"
import { db } from "@/database/client"
import { generateId } from "lucia"
import { cookies } from "next/headers"
import { Argon2id } from "oslo/password"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { sendEmail } from '@/email'
import { generateCodeVerifier, generateState } from 'arctic'
import { github, google } from '@/auth/oauth'

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const hashPassword = await new Argon2id().hash(values.password)
  const userId = generateId(15)

  try {
    await db.user.create({
      data: {
        id: userId,
        email: values.email,
        hashedPassword: hashPassword,
      }
    })

    // 生成 6 位随机英文字母验证码
    const code = Math.random().toString(36).substring(2,8)

    // 
    await db.emailVerification.create({
      data: {
        code,
        userId,
        id: generateId(15),
        sendAt: new Date()
      }
    })

    const token = jwt.sign(
      { email: values.email, userId, code },
      process.env.JWT_SECRET!,
      { expiresIn: "5m"}
    )

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`

    console.log('url', url)

    await sendEmail({
      to: values.email,
      subject: "Verify your email",
      html: `<a href="${url}">Verify your email</a>`
    })

    // const session = await lucia.createSession(userId, {
    //   expiresIn: 60 * 60 * 24 * 30 // 30 days
    // })

    // const sessionCookie = lucia.createSessionCookie(session.id)

    // cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return {
      success: true,
      data: userId
    }

  } catch (error: any) {
    return {
     error: error?.message
    }
  }
}

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const existingUser = await db.user.findUnique({
    where: {
      email: values.email
    }
  })

  if(!existingUser) {
    return {
      error: "User not found"
    }
  }

  if(!existingUser.hashedPassword) {
    return {
      error: "User not found"
    }
  }

  const isValidPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    values.password
  )

  if(!isValidPassword) {
    return {
      error: "Incorrect email or password"
    }
  }

  if(!existingUser.isEmailVerified) {
    return {
      error: "Email not verified",
      key: "email_not_verified"
    }
  }

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30 // 30 days
  })

  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return {
    success: "Logger successfully"
  }
}

export const signOut = async () => {
  try {
    const { session } = await validateRequest()

    if (!session) {
      return {
        error: "User not logged in"
      }
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  } catch (error: any) {
    return {
      error: error?.message
    }
  }
}

export const resendVerificationEmail= async (email: string) => {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email: email
      }
    })

    if(!existingUser) {
      return {
        error: "User not found"
      }
    }

    if(existingUser.isEmailVerified) {
      return {
        error: "Email already verified"
      }
    }

    const existingCode = await db.emailVerification.findFirst({
      where: {
        userId: existingUser.id
      }
    })

    if(!existingCode) {
      return {
        error: "Code not found"
      }
    }

    // 服务端，拦截验证码
    const sentAt = new Date(existingCode.sendAt)
    const isOneMinutedHasPassed = new Date().getTime() - sentAt.getTime() > 6000

    if(!isOneMinutedHasPassed) {
      return {
        error: "Email already sent, next email in " +
        (60 - Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)) +
        " seconds"
      }
    }

    const code = Math.random().toString(36).substring(2,8)

    await db.emailVerification.update({
      data: {
        code,
        sendAt: new Date()
      },
      where: {
        id: existingCode.id
      }
    })

    const token = jwt.sign(
      { email, userId: existingUser.id, code },
      process.env.JWT_SECRET!,
      { expiresIn: "5m"}
    )

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<a href="${url}">Verify your email</a>`
    })

    return {
      success: "Email sent"
    }
    
  } catch (error: any) {
    return {
      error: error?.message
    }
  }
}

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    
    cookies().set("state", state, {
      httpOnly: true
    })

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true
    })

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ['email', 'profile']
      }
    )

    // console.log('authorizationURL', authorizationURL)
    return {
      success: true,
      data: authorizationURL.toString()
    }
  } catch (error: any) {
    return {
      error: error?.message
    }
  }
}

export const createGithubAuthorizationURL = async () => {
  try {
    const state = generateState()
    
    cookies().set("state", state, {
      httpOnly: true
    })

    const authorizationURL = await github.createAuthorizationURL(
      state,
      {
        scopes: ['user:email']
      }
    )

    // console.log('authorizationURL', authorizationURL)
    return {
      success: true,
      data: authorizationURL.toString()
    }
  } catch (error: any) {
    return {
      error: error?.message
    }
  }
}