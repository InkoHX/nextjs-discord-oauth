import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { OAuth2Routes } from 'discord-api-types/v9'
import { getEnvironment } from '../../../lib/env'

export default async function revoke(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const { accessToken } = request.cookies

    if (!accessToken) {
      response.status(400).send({ message: 'accessToken is undefined.' })

      return
    }

    const body = new URLSearchParams()

    body.append('client_id', getEnvironment('OAUTH_CLIENT_ID'))
    body.append('client_secret', getEnvironment('OAUTH_CLIENT_SECRET'))
    body.append('token', accessToken)

    const revokeResponse = await fetch(OAuth2Routes.tokenRevocationURL, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!revokeResponse.ok) {
      response.status(400).send({ message: 'Could not revoke access token.' })

      console.error(await revokeResponse.text())

      return
    }

    response.setHeader(
      'Set-Cookie',
      process.env.NODE_ENV === 'development'
        ? 'accessToken=null; Path=/; SameSite=Lax; Expires; HttpOnly'
        : 'accessToken=null; Path=/; SameSite=Lax; Secure; Expires; HttpOnly'
    )
    response.redirect('/')
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' })
    console.error(error)
  }
}
