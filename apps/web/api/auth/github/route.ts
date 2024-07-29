import { db } from "@repo/server/database/client";
import { lucia } from "@repo/server/auth/lucia";
import { github } from "@repo/server/auth/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    const code = searchParams.get("code")
    const state = searchParams.get("state")
  
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
  
    const savedState = cookies().get("state")?.value
  
    if(!savedState) {
      return Response.json(
        {
          error: "State not found"
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
  
    const {accessToken} = await github.validateAuthorizationCode(code)
  
    const githubRes = await fetch(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        method: "GET"
      }
    )
  
    const githubData = (await githubRes.json()) as any

    console.log('githubData', githubData)
  
    await db.$transaction(async (trx) => {
      const user = await trx.user.findFirst({
        where: {
          id: githubData.id
        }
      })

      console.log('user', user)
  
      if(!user) {
        try {
          await trx.user.create({
            data: {
              email: githubData.email,
              id: githubData.id,
              name: githubData.name,
              profilePictureUrl: githubData.avatar_url
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
              id: githubData.id,
              provider: "github",
              providerUserId: githubData.id,
              userId: githubData.id,
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
              accessToken
            },
            where: {
              id: githubData.id,
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

    const session = await lucia.createSession(githubData.id, {
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