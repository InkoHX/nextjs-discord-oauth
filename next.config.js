/**
 * @type {import('next').NextConfig}
 */
const config = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'default-src \'self\''
          }
        ]
      }
    ]
  }
}

module.exports = config
