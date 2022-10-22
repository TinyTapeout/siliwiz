import { createSignal, For, Show } from 'solid-js';
import { activeDRCItem } from '~/model/drc';
import { layerTypes } from '~/model/layerTypes';
import { layout, layoutUndo, setLayout, sortRects } from '~/model/layout';
import { viewerState } from '~/model/viewerState';
import { domRectFromPoints, Point2D } from '~/utils/geometry';
import { ctrlCmdPressed } from '~/utils/keyboard';

interface INewRect {
  layer: string;
  start: Point2D;
  end: Point2D;
}

export default function Canvas() {
  const [selectedRectIndex, setSelectedRectIndex] = createSignal<number | null>(null);
  const [svgRef, setSVGRef] = createSignal<SVGSVGElement | null>(null);
  const [newRect, setNewRect] = createSignal<INewRect | null>(null);

  const selectedRect = () => {
    const index = selectedRectIndex();
    return index != null ? layout.rects[index] : null;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const cmdCtrl = ctrlCmdPressed(e);
    const upperKey = e.key.toUpperCase();
    if (e.key === 'Delete') {
      setLayout('rects', (rects) => rects.filter((r, index) => index !== selectedRectIndex()));
      setSelectedRectIndex(null);
    }
    if (upperKey === 'Z' && cmdCtrl) {
      layoutUndo.undo();
    }
    if (upperKey === 'Y' && cmdCtrl) {
      layoutUndo.redo();
    }
  };

  const translatePoint = ({ x, y }: Point2D) => {
    const matrix = svgRef()?.getScreenCTM();
    if (!matrix) {
      return { x, y };
    }
    const transformedPoint = new DOMPoint(x, y).matrixTransform(matrix.inverse());
    return { x: transformedPoint.x, y: transformedPoint.y };
  };

  const handleMouseDown = (e: MouseEvent) => {
    const layer = viewerState.activeLayer;
    const point = translatePoint({ x: e.clientX, y: e.clientY });
    if (layer) {
      setNewRect({ start: point, end: point, layer });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const point = translatePoint({ x: e.clientX, y: e.clientY });
    setNewRect((rect) => (rect ? { ...rect, end: point } : null));
  };

  const handleMouseUp = (e: MouseEvent) => {
    const rect = newRect();
    if (rect) {
      const domRect = domRectFromPoints(rect.start, rect.end);
      setLayout('rects', (rects) =>
        sortRects([
          ...rects,
          {
            x: domRect.x,
            y: domRect.y,
            height: domRect.height,
            width: domRect.width,
            layer: rect.layer,
          },
        ]),
      );
      setNewRect(null);
    }
  };

  return (
    <svg
      tabIndex={0}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="200"
      height="200"
      ref={setSVGRef}
      onkeydown={handleKeyDown}
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
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
              <g onClick={() => setSelectedRectIndex(index)}>
                <rect
                  x={rect.x}
                  y={rect.y}
                  height={rect.height}
                  width={rect.width}
                  fill={layer.color}
                  mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
                />
                <Show when={rect.label}>
                  <text
                    style={{ 'user-select': 'none' }}
                    x={rect.x + rect.width / 2}
                    y={rect.y}
                    text-anchor="middle"
                    alignment-baseline="before-edge"
                  >
                    {rect.label}
                  </text>
                </Show>
              </g>
            </Show>
          );
        }}
      </For>
      <Show when={selectedRect()} keyed>
        {(rect) => (
          <rect
            x={rect.x}
            y={rect.y}
            height={rect.height}
            width={rect.width}
            fill="none"
            stroke="blue"
          />
        )}
      </Show>

      <Show when={newRect()} keyed>
        {(rect) => {
          const layer = layerTypes.find((l) => l.name === rect.layer);
          if (!layer) {
            return;
          }

          const domRect = domRectFromPoints(rect.start, rect.end);
          return (
            <rect
              x={domRect.x}
              y={domRect.y}
              height={domRect.height}
              width={domRect.width}
              fill={layer.color}
              mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
            />
          );
        }}
      </Show>

      {activeDRCItem()?.coords.map((rect) => (
        <rect
          x={rect.x0}
          y={rect.y0}
          width={rect.x1 - rect.x0}
          height={rect.y1 - rect.y0}
          fill="red"
          fill-opacity="0.5"
          stroke="red"
        />
      ))}
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
