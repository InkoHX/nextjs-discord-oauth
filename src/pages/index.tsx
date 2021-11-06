import { APIUser } from 'discord-api-types/v9'
import { GetServerSideProps, NextPage } from 'next'
import fetch from 'node-fetch'
import { UserProfile } from '../components/UserProfile'
import styles from '../styles/pages/index.module.css'

interface PageProps {
  readonly user?: APIUser
}

const Page: NextPage<PageProps> = ({ user }) => {
  return (
    <div className={styles.container}>
      <div>
        <h1>nextjs-discord-oauth</h1>
        <p>
          Using Next.js and Serverless Function to connect with Discord API via
          OAuth2
        </p>
        <div>
          {user ? (
            <UserProfile user={user} />
          ) : (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/api/oauth">Authorization via Discord</a>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> =
  async context => {
    const { req } = context
    const accessToken = req.cookies.accessToken

    if (!accessToken || accessToken === 'null')
      return {
        props: {},
      }

    const response = await fetch('https://discord.com/api/v9/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok)
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }

    return {
      props: {
        user: (await response.json()) as APIUser,
      },
    }
  }

export default Page
