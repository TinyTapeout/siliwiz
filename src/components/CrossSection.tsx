import { For } from 'solid-js';
import { layerTypes } from '~/model/layerTypes';

export default function CrossSection() {
  return (
    <div>
      X Section
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 166">
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
        <For each={layerTypes}>
          {(layer, index) => (
            <rect
              x={25 * index()}
              y={25 * index()}
              height={150}
              width={150}
              fill={layer.color}
              mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
            />
          )}
        </For>
      </svg>
    </div>
  );
}
