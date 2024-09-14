// SPDX-License-Identifier: Apache-2.0

import { StartServer, createHandler } from '@solidjs/start/server';
import { AnalyticsScript } from './components/AnalyticsScript';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
            rel="stylesheet"
          />

          <title>SiliWiz - Learn Semiconductor Basics</title>
          <meta
            name="description"
            content="Free educational tool to help you learn the basics of how semiconductors work and manufactured at a fundamental level"
          />
          <meta property="og:image" content="https://app.siliwiz.com/images/social-preview.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:card" content="summary_large_image" />

          {assets}
          <AnalyticsScript />
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
