const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
  frame-src giscus.app quantumcybersolutions.com; // Added quantumcybersolutions.com here
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app; style-src 'self' 'unsafe-inline'; img-src * blob: data:; media-src 'none'; connect-src *; font-src 'self'; frame-src *;", // Added frame-src *
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Removed the X-Frame-Options header to allow all websites to embed content
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
  },
  images: {
    domains: [
      'quantumcybersolutions.com',
      'www.quantumcybersolutions.com',
      'ericdequevedo.com',
      'www.ericdequevedo.com',
      'dione-murex.vercel.app',
      'introspective.vercel.app',
      'podhub-mu.vercel.app',
      'quantumlearn.vercel.app',
      'www.quantumlearn.vercel.app',
      'freel-one.vercel.app',
      'diamondback.vercel.app',
      'www.diamondback.vercel.app',
      'bmw-services.vercel.app',
      'www.bmw-services.vercel.app',
      'games-gold-nu.vercel.app',
      'www.games-gold-nu.vercel.app',
      'www.sportstips.org',
      'sportstips.org',
      'www.robotric.org',
      'robotric.org',
      'www.rics-notebook.com',
      'rics-notebook.com',
      'rikara.vercel.app',
      'www.rikara.vercel.app',
      'bev.cool',
      'www.bev.cool',
      'leopiolet.com',
      'www.leopiolet.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  pwa: {
    dest: 'public',
    skipWaiting: true,
    clientsClaim: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    return config
  },
})
