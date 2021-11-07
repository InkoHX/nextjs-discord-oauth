import { randomBytes } from 'crypto'
import { OAuth2Routes } from 'discord-api-types/v9'
import { NextApiRequest, NextApiResponse } from 'next'
import { URL } from 'url'
import { getEnvironment } from '../../../lib/env'

export default async function oauth(
  _request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    const redirectUrl = getEnvironment('OAUTH_REDIRECT_URL')
    const clientId = getEnvironment('OAUTH_CLIENT_ID')
    const state = randomBytes(32)
      .toString('base64')
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '')
      .trim()
    const scope = ['identify']

    const authorizeUrl = new URL(OAuth2Routes.authorizationURL)
    const authorizeParams = authorizeUrl.searchParams

    authorizeParams.append('client_id', clientId)
    authorizeParams.append('redirect_url', redirectUrl)
    authorizeParams.append('state', state)
    authorizeParams.append('scope', scope.join(' '))
    authorizeParams.append('response_type', 'code')

    response.setHeader(
      'Set-Cookie',
      process.env.NODE_ENV === 'development'
        ? `oauth_state=${state}; Path=/; SameSite=Lax; Expires; HttpOnly`
        : `__Host-oauth_state=${state}; Path=/; SameSite=Lax; Secure; Expires; HttpOnly`
    )
    response.redirect(authorizeUrl.toString())
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' })
    console.error(error)
  }
}
