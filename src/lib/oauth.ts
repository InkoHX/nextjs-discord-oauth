import {
  RESTPostOAuth2AccessTokenResult,
  OAuth2Routes,
} from 'discord-api-types/v9'
import { getEnvironment } from './env'

export const fetchAccessToken = async (
  exchangeCode: string
): Promise<RESTPostOAuth2AccessTokenResult> => {
  const response = await fetch(OAuth2Routes.tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: getEnvironment('OAUTH_CLIENT_ID'),
      client_secret: getEnvironment('OAUTH_CLIENT_SECRET'),
      redirect_uri: getEnvironment('OAUTH_REDIRECT_URL'),
      grant_type: 'authorization_code',
      code: exchangeCode,
    }),
  })

  if (!response.ok)
    throw new Error(
      `Discord API (${response.statusText}): Failed to fetch Access Token using Exchange Code.`
    )

  return response.json() as Promise<RESTPostOAuth2AccessTokenResult>
}

export const revokeAccessToken = async (accessToken: string) => {
  const response = await fetch(OAuth2Routes.tokenRevocationURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      token: accessToken,
      client_id: getEnvironment('OAUTH_CLIENT_ID'),
      client_secret: getEnvironment('OAUTH_CLIENT_SECRET'),
    }),
  })

  if (!response.ok)
    throw new Error('Failed to revoke Access Token successfully.')
}
