import { APIUser, RouteBases, Routes } from 'discord-api-types/v9'
import { GetServerSideProps, NextPage } from 'next'
import { ErrorMessage } from '../components/ErrorMessage'
import { UserProfile } from '../components/UserProfile'
import { fetchAccessToken, revokeAccessToken } from '../lib/oauth'

interface PageProps {
  readonly user?: APIUser
  readonly errorMessage?: string
}

const Page: NextPage<PageProps> = ({ user, errorMessage }) => {
  return (
    <div className="container">
      <div className="content">
        <h1 className="title">nextjs-discord-oauth</h1>
        <p>
          Using Next.js and Serverless Function to connect with Discord API via
          OAuth2
        </p>
        {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
        {user ? (
          <UserProfile user={user} />
        ) : (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a href="/api/oauth" className="authorization-button">
            Authorization via Discord
          </a>
        )}
      </div>
      <style jsx>{`
        .container {
          height: 100vh;
          width: 100%;
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          align-items: center;
        }

        .content {
          background-color: #fff;
          padding: 16px;
          border-radius: 25px;
        }

        .title {
          margin-top: 0;
        }

        .authorization-button {
          display: inline-block;
          color: #fff;
          background-color: #2979ff;
          font-weight: 600;
          border: 1px solid #2979ff;
          text-align: center;
          text-decoration: none;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .authorization-button:hover {
          color: #2979ff;
          background-color: #fff;
        }
      `}</style>
      <style jsx global>{`
        body {
          background-color: #f5f5f5;
          margin: 0;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> =
  async context => {
    try {
      const { req } = context
      const exchangeCode = context.query.code
      const queryState = context.query.state

      if (!queryState || !exchangeCode)
        return {
          props: {},
        }

      if (req.cookies.oauth_state !== queryState)
        throw new Error('Invalid state.')
      if (typeof exchangeCode !== 'string')
        throw new Error('Invalid exchange code.')

      const { access_token, token_type } = await fetchAccessToken(exchangeCode)
      const response = await fetch(RouteBases.api + Routes.user(), {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      })

      await revokeAccessToken(access_token)

      if (!response.ok) throw new Error('Failed to fetch user information.')

      return {
        props: {
          user: (await response.json()) as APIUser,
        },
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)

        return {
          props: {
            errorMessage: error.message,
          },
        }
      }

      throw error
    }
  }

export default Page
