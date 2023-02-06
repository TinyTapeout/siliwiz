// SPDX-License-Identifier: Apache-2.0
// @refresh reload
import { lazy } from 'solid-js';
import { Body, Head, Html, Link, Meta, Scripts, Title } from 'solid-start';
import { AnalyticsScript } from './components/AnalyticsScript';
import { loadPreset } from './model/layout';
import './root.css';

export default function Root() {
  if (typeof location !== 'undefined') {
    const urlParams = new URLSearchParams(location.search);
    const preset = urlParams.get('preset');
    if (preset != null) {
      void import(`~/../presets/${preset}.json`).then((module) => {
        if (module?.rects != null) {
          loadPreset(module);
        }
      });
    }
  }

  const Siliwiz = lazy(() => import('~/components/Siliwiz'));

  return (
    <Html lang="en">
      <Head>
        <Title>SiliWiz</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
        <AnalyticsScript />
      </Head>
      <Body class="siliwiz-root">
        <Siliwiz />
        <Scripts />
      </Body>
    </Html>
  );
}
