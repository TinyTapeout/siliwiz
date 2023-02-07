import { createSignal, Show } from 'solid-js';
import SpiceDebugView from '~/components/SpiceDebugView';

export function ExpertOptions() {
  const [showSpice, setShowSpice] = createSignal(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          onClick={(e) => setShowSpice((e.target as HTMLInputElement).checked)}
        />
        Show SPICE
      </label>
      <br />
      <Show when={showSpice()}>
        <SpiceDebugView />
      </Show>
    </>
  );
}
