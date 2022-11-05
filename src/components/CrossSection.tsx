import { For, Show } from 'solid-js';
import { layout, rectLayer } from '~/model/layout';
import { viewerState } from '~/model/viewerState';

export default function CrossSection() {
  const crossRects = () =>
    layout.rects.filter(
      (r) => r.y <= viewerState.crossSectionY && r.y + r.height >= viewerState.crossSectionY,
    );
  return (
    <div>
      <h3>Cross Section View</h3>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100" style={{outline: 'solid black 1px'}}>
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
        <For each={crossRects()}>
          {(rect) => {
            const layer = rectLayer(rect);
            if (!layer) {
              return;
            }

            const hidden = () => viewerState.hiddenLayers.includes(layer.name);

            return (
              <Show when={!hidden()}>
                <rect
                  x={rect.x}
                  y={layer.crossY - 50}
                  height={layer.crossHeight}
                  width={rect.width}
                  fill={layer.color}
                  mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
                />
              </Show>
            );
          }}
        </For>
      </svg>
    </div>
  );
}
