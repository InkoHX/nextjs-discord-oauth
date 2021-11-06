export type Environment =
  | 'OAUTH_CLIENT_ID'
  | 'OAUTH_CLIENT_SECRET'
  | 'OAUTH_REDIRECT_URL'

export const getEnvironment = (key: Environment) => {
  const value = process.env[key]

  if (!value) throw new Error(`Environment variable "${key}" is undefined.`)

  return value
}
