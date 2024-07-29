import { db } from "@repo/server/database/client";
import { lucia } from "@repo/server/auth/lucia";
import { google } from "@repo/server/auth/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    const code = searchParams.get("code")
    const state = searchParams.get("state")
  
    interface GoogleUser {
      id: string,
      email: string,
      verified_email: boolean,
      name: string,
      given_name: string,
      picture: string,
      locale: string
    }
  
    if(!code || !state) {
      return Response.json(
        {
          error: "Invalid request"
        },
        {
          status: 400
        }
      )
    }
  
    const codeVerifier = cookies().get("codeVerifier")?.value
    const savedState = cookies().get("state")?.value
  
    if(!codeVerifier || !savedState) {
      return Response.json(
        {
          error: "Invalid request 2"
        },
        {
          status: 400
        }
      )
    }
  
    if(savedState !== state) {
      return Response.json(
        {
          error: "State does not match"
        },
        {
          status: 400
        }
      )
    }
  
    const {accessToken, accessTokenExpiresAt, refreshToken} = await google.validateAuthorizationCode(
      code,
      codeVerifier
    )
  
    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        method: "GET"
      }
    )
  
    const googleData = (await googleRes.json()) as GoogleUser
  
    await db.$transaction(async (trx) => {
      const user = await trx.user.findFirst({
        where: {
          id: googleData.id
        }
      })

      console.log('user', user)
  
      if(!user) {
        try {
          await trx.user.create({
            data: {
              email: googleData.email,
              id: googleData.id,
              name: googleData.name,
              profilePictureUrl: googleData.picture
            }
          })
        } catch (error) {
          return Response.json(
            {
              error: "Failed to create user"
            },
            {
              status: 400
            }
          )
        }
  
        try {
          await trx.oauthAccount.create({
            data: {
              accessToken,
              expiresAt: accessTokenExpiresAt,
              id: googleData.id,
              provider: "google",
              providerUserId: googleData.id,
              userId: googleData.id,
              refreshToken
            }
          })
        } catch (error) {
          return Response.json(
            {
              error: "Failed to create OAuthAccountRes"
            },
            {
              status: 400
            }
          )
        }

      } else {
        try {
          await trx.oauthAccount.update({
            data: {
              accessToken,
              expiresAt: accessTokenExpiresAt,
              refreshToken
            },
            where: {
              id: googleData.id,
            }
          })
        } catch (error) {
          return Response.json(
            {
              error: "Failed to update OAuthAccountRes"
            },
            {
              status: 400
            }
          )
        }
      }
    })

    const session = await lucia.createSession(googleData.id, {
      expiresIn: 60 * 60 * 24 * 30,
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    cookies().set('state', '', {
      expires: new Date(0)
    })

    cookies().set('codeVerifier', '', {
      expires: new Date(0)
    })

    console.log('db.transaction 完成')

    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
      {
        status: 302
      }
    )
  } catch (error: any) {
    return Response.json({
      error: error.message
    },{
      status: 400
    })
  } 
}