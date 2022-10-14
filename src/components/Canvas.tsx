import { createSignal, For, Show } from 'solid-js';
import { layerTypes } from '~/model/layerTypes';
import { layout, setLayout } from '~/model/layout';
import { viewerState } from '~/model/viewerState';

export default function Canvas() {
  const [selectedRectIndex, setSelectedRectIndex] = createSignal<number | null>(null);

  const selectedRect = () => {
    const index = selectedRectIndex();
    return index != null ? layout.rects[index] : null;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete') {
      setLayout('rects', (rects) => rects.filter((r, index) => index !== selectedRectIndex()));
      setSelectedRectIndex(null);
    }
  };

  return (
    <svg
      tabIndex={0}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="200"
      height="200"
      onkeydown={handleKeyDown}
    >
      <defs>
        <pattern
          id="hatch-pattern"
          patternUnits="userSpaceOnUse"
          width="20"
          height="20"
          patternTransform="rotate(-45 0 0)"
        >
          <line x1="0" y1="0" x2="0" y2="20" stroke="white" stroke-width="20" />
        </pattern>
        <mask id="hatch-mask" x="0" y="0" width="1" height="1">
          <rect x="0" y="0" width="1000" height="1000" fill="url(#hatch-pattern)" />
        </mask>
      </defs>
      <For each={layout.rects}>
        {(rect, index) => {
          const layer = layerTypes.find((l) => l.name === rect.layer);
          if (!layer) {
            return;
          }

          const hidden = () => viewerState.hiddenLayers.includes(layer.name);
          return (
            <Show when={!hidden()}>
              <rect
                x={rect.x}
                y={rect.y}
                height={rect.height}
                width={rect.width}
                fill={layer.color}
                mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
                onClick={() => setSelectedRectIndex(index)}
              />
            </Show>
          );
        }}
      </For>
      {selectedRect() && (
        <rect
          x={selectedRect()!.x}
          y={selectedRect()!.y}
          height={selectedRect()!.height}
          width={selectedRect()!.width}
          fill="none"
          stroke="red"
        />
      )}
      <line
        x1={0}
        y1={viewerState.crossSectionY}
        x2={200}
        y2={viewerState.crossSectionY}
        stroke="black"
        stroke-width="1"
      />
    </svg>
  );
}
