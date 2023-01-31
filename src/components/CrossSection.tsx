// SPDX-License-Identifier: Apache-2.0

import { Popover, Typography } from '@suid/material';
import { createSignal, For, Show } from 'solid-js';
import { layout, rectLayer } from '~/model/layout';
import { viewerState } from '~/model/viewerState';

export default function CrossSection() {
  const crossRects = () =>
    layout.rects.filter(
      (r) => r.y <= viewerState.crossSectionY && r.y + r.height >= viewerState.crossSectionY,
    );
  const polyRects = () => crossRects().filter((r) => r.layer === 'polysilicon');

  // Layer name tooltip
  const [anchorEl, setAnchorEl] = createSignal<Element | null>(null);
  const [currentLayerName, setCurrentLayerName] = createSignal('');
  const handlePopoverOpen = (event: { currentTarget: Element }) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentLayerName('');
  };

  const open = () => Boolean(anchorEl());

  return (
    <div>
      <h3>Cross Section View</h3>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open()}
        anchorEl={anchorEl()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{currentLayerName}</Typography>
      </Popover>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 120"
        width="400"
        height="120"
        style={{ outline: 'solid black 1px' }}
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
          <mask id="poly-mask">
            <rect x="0" y="0" width="1000" height="1000" fill="white" />
            <For each={polyRects()}>
              {(rect) => <rect x={rect.x} y={0} height={200} width={rect.width} fill="black" />}
            </For>
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
                  aria-owns={open() ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpen(e);
                    setCurrentLayerName(layer.name);
                  }}
                  onMouseLeave={handlePopoverClose}
                  x={rect.x}
                  y={layer.crossY - 10}
                  height={layer.crossHeight}
                  width={rect.width}
                  fill={layer.color}
                  mask={
                    layer.hatched
                      ? 'url(#hatch-mask)'
                      : layer.masked
                      ? 'url(#poly-mask)'
                      : undefined
                  }
                />
              </Show>
            );
          }}
        </For>
      </svg>
    </div>
  );
}
