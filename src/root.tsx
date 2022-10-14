// @refresh reload
import { Suspense, lazy } from 'solid-js';
import { Body, ErrorBoundary, Head, Html, Meta, Scripts, Title } from 'solid-start';
import Editor from './components/Editor';
import Palette from './components/Palette';
import './root.css';

export default function Root() {
  const Graph = lazy(() => import('./components/Graph'));

  return (
    <Html lang="en">
      <Head>
        <Title>SiliWiz Demo</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <ErrorBoundary>
          <h1>Siliwiz</h1>
          <Palette />
          <Editor />
          <Suspense fallback={<div>Loading graph...</div>}>
            <Graph />
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
