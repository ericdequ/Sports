import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" sizes="76x76" href="/static/favicons/apple-touch-icon.webp" />
          <link rel="apple-touch-icon" href="/static/favicons/favicon-32x32.webp" />
          <link rel="icon" href="/favicon.ico" />

          <link rel="preconnect" href="https://www.quantumcybersolutions.com/" />
          <link rel="dns-prefetch" href="https://www.quantumcybersolutions.com/" />

          <link rel="preconnect" href="https://www.plantheath.com/" />
          <link rel="dns-prefetch" href="https://www.plantheath.com/" />


          <link rel="preconnect" href="https://www.govcon.me/" />
          <link rel="dns-prefetch" href="https://www.govcon.me/" />

          <link rel="preconnect" href="https://www.elontusk.org/" />
          <link rel="dns-prefetch" href="https://www.elontusk.org/" />

          <link rel="preconnect" href="https://www.robotric.org/" />
          <link rel="dns-prefetch" href="https://www.robotric.org/" />

          <link
            rel="icon"
            type="image/webp"
            sizes="32x32"
            href="/static/favicons/favicon-32x32.webp"
          />
          <link
            rel="icon"
            type="image/webp"
            sizes="16x16"
            href="/static/favicons/favicon-16x16.webp"
          />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
          <meta
            name="google-site-verification"
            content="At3RZ4YGQtXrtPbI2UKNk1aKwGJ5P7goMttGiLMTaT4"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
