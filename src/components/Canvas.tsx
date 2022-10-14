import { For } from 'solid-js';
import { layerTypes } from '~/model/layerTypes';
import { layout } from '~/model/layout';

export default function Canvas() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="250" height="250">
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
          return (
            <rect
              x={rect.x}
              y={rect.y}
              height={rect.height}
              width={rect.width}
              fill={layer.color}
              mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
            />
          );
        }}
      </For>
    </svg>
  );
}
