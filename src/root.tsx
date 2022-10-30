// @refresh reload
import { createSignal, lazy, Show, Suspense } from 'solid-js';
import { Body, ErrorBoundary, Head, Html, Meta, Scripts, Title } from 'solid-start';
import LayoutView from './components/LayoutView';
import SimulationParams from './components/SimulationParams';
import './root.css';
import { spiceFile } from './model/spiceFile';

export default function Root() {
  const Graph = lazy(() => import('./components/Graph'));
  const [showSpice, setShowSpice] = createSignal(false);

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
          <LayoutView />
          <hr style={{ margin: '1em 0' }} />
          <SimulationParams />
          <Suspense fallback={<div>Loading graph...</div>}>
            <Graph />
          </Suspense>
          <label>
            <input
              type="checkbox"
              onclick={(e) => setShowSpice((e.target as HTMLInputElement).checked)}
            />
            Show SPICE
          </label><br />
          <Show when={showSpice()}>
            <textarea value={spiceFile()} cols="100" rows="15" readonly />
          </Show>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
