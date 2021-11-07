import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { getEnvironment } from '../../../lib/env'
import {
  OAuth2Routes,
  RESTPostOAuth2AccessTokenResult,
} from 'discord-api-types/v9'

export default async function callback(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const { code, state } = request.query
    const { oauth_state } = request.cookies

    if (typeof code !== 'string') {
      response.status(400).send({ message: 'Parameter "code" is required.' })

      return
    }

    if (typeof state !== 'string') {
      response.status(400).send({ message: 'Parameter "state" is required.' })

      return
    }

    if (oauth_state !== state) {
      response.status(403).send({ message: 'state is invalid.' })

      return
    }

    const body = new URLSearchParams()

    body.append('client_id', getEnvironment('OAUTH_CLIENT_ID'))
    body.append('client_secret', getEnvironment('OAUTH_CLIENT_SECRET'))
    body.append('grant_type', 'authorization_code')
    body.append('code', code)
    body.append('state', oauth_state)
    body.append('redirect_uri', getEnvironment('OAUTH_REDIRECT_URL'))

    const tokenRequest = await fetch(OAuth2Routes.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!tokenRequest.ok) {
      response
        .status(500)
        .send({
          message:
            'There was a problem fetching the access token from Discord.',
        })

      console.error(await tokenRequest.text())

      return
    }

    const tokenResponse =
      (await tokenRequest.json()) as RESTPostOAuth2AccessTokenResult

    response.setHeader(
      'Set-Cookie',
      process.env.NODE_ENV === 'development'
        ? `accessToken=${tokenResponse.access_token}; Max-Age=${tokenResponse.expires_in}; Path=/; SameSite=Lax; HttpOnly`
        : `accessToken=${tokenResponse.access_token}; Max-Age=${tokenResponse.expires_in}; Path=/; SameSite=Lax; Secure; HttpOnly`
    )
    response.redirect('/')
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' })
    console.error(error)
  }
}
