import { APIUser } from 'discord-api-types/v9'
import React from 'react'

export interface UserProfileProps {
  readonly user: APIUser
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const premiumPlans = ['None', 'Nitro Classic', 'Nitro']

  return (
    <div>
      <div>
        <h2>User Information</h2>
        <p>Show some of information fetched from Discord API.</p>
      </div>
      <div>
        <h3>Username</h3>
        <p>{user.username}</p>
        <h3>Discriminator</h3>
        <p>{user.discriminator}</p>
        <h3>Snowflake</h3>
        <p>{user.id}</p>
        <h3>Tow-Factor</h3>
        <p>{user.mfa_enabled ? 'Enabled' : 'Disabled'}</p>
        <h3>Premium Plan</h3>
        <p>{user.premium_type ? premiumPlans[user.premium_type] : 'Unknown'}</p>
      </div>
    </div>
  )
}
