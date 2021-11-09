const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return defaultConfig
  }

  return {
    ...defaultConfig,
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
            },
          ],
        },
      ]
    },
  }
}
