// SPDX-License-Identifier: Apache-2.0

import { Delete, Edit, SwapHoriz, SwapVert } from '@suid/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@suid/material';
import { createSignal, For, Show } from 'solid-js';
import { activeDRCItem } from '~/model/drc';
import {
  lambdaToMicrons,
  layout,
  layoutUndo,
  rectLayer,
  selectedRectIndex,
  setLayout,
  setSelectedRectIndex,
  sortRects,
} from '~/model/layout';
import { viewerState } from '~/model/viewerState';
import { domRectFromPoints, Point2D } from '~/utils/geometry';
import { ctrlCmdPressed } from '~/utils/keyboard';
import styles from './Canvas.module.css';
import Scale from './Scale';

interface INewRect {
  layer: string;
  start: Point2D;
  end: Point2D;
}

const keyboardShortcuts = {
  Delete: 'D',
  EditWidth: 'F',
  EditLength: 'R',
  SetLabel: 'S',
};

export default function Canvas(props: { size: number }) {
  const [svgRef, setSVGRef] = createSignal<SVGSVGElement | null>(null);
  const [newRect, setNewRect] = createSignal<INewRect | null>(null);

  // Context menu
  const [contextMenu, setContextMenu] = createSignal<{
    left: number;
    top: number;
  } | null>(null);
  const open = () => Boolean(contextMenu());
  const handleClose = () => {
    setContextMenu(null);
  };

  const selectedRect = () => {
    const index = selectedRectIndex();
    return index != null ? layout.rects[index] : null;
  };

  const handleDelete = () => {
    setLayout('rects', (rects) => rects.filter((r, index) => index !== selectedRectIndex()));
    setSelectedRectIndex(null);
  };

  const handleSetLabel = () => {
    const selection = selectedRect();
    const selectionIndex = selectedRectIndex();
    if (selection == null || selectionIndex == null) {
      return;
    }
    const label = prompt('Enter new label (or an empty string to delete label)', selection.label);
    if (label != null) {
      setLayout('rects', selectionIndex, { ...selection, label });
    }
  };

  const handleEditWidth = () => {
    const selection = selectedRect();
    if (!selection) {
      return;
    }
    const currentValue = (selection.width * lambdaToMicrons).toFixed(2).replace(/\.?0+$/, '');
    const newWidth = prompt('Enter new width in µm', currentValue);
    if (newWidth) {
      setLayout('rects', selectedRectIndex()!, { width: parseFloat(newWidth) / lambdaToMicrons });
    }
  };

  const handleEditLength = () => {
    const selection = selectedRect();
    if (!selection) {
      return;
    }
    const currentValue = (selection.height * lambdaToMicrons).toFixed(2).replace(/\.?0+$/, '');
    const newLength = prompt('Enter new length in µm', currentValue);
    if (newLength) {
      setLayout('rects', selectedRectIndex()!, { height: parseFloat(newLength) / lambdaToMicrons });
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    const cmdCtrl = ctrlCmdPressed(e);
    const upperKey = e.key.toUpperCase();
    if (e.key === 'Delete' || upperKey === keyboardShortcuts.Delete) {
      handleDelete();
      return true;
    }
    if (upperKey === 'Z' && cmdCtrl) {
      layoutUndo.undo();
      return true;
    }
    if (upperKey === 'Y' && cmdCtrl) {
      layoutUndo.redo();
      return true;
    }

    if (upperKey === keyboardShortcuts.SetLabel) {
      handleSetLabel();
      return true;
    }
    if (upperKey === keyboardShortcuts.EditWidth) {
      handleEditWidth();
      return true;
    }
    if (upperKey === keyboardShortcuts.EditLength) {
      handleEditLength();
      return true;
    }
    return false; /* not handled */
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
      setNewRect(null);

      const domRect = domRectFromPoints(rect.start, rect.end);
      if (domRect.width < 3 || domRect.height < 3) {
        // Don't create a rect that's too small, see https://github.com/wokwi/siliwiz/issues/10
        return;
      }

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
    }
  };

  return (
    <>
      <Menu
        open={open()}
        onClose={handleClose}
        onClick={handleClose}
        onKeyDown={(e) => {
          if (handleKeyDown(e)) {
            e.preventDefault();
            svgRef()?.focus({ preventScroll: true });
            setContextMenu(null);
          }
        }}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu() ?? undefined}
        sx={{
          '& .MuiMenu-list': { width: 180, maxWidth: '100%' },
        }}
      >
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            {keyboardShortcuts.Delete}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleSetLabel}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Set Label</ListItemText>
          <Typography variant="body2" color="text.secondary">
            {keyboardShortcuts.SetLabel}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleEditWidth}>
          <ListItemIcon>
            <SwapHoriz fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Width</ListItemText>
          <Typography variant="body2" color="text.secondary">
            {keyboardShortcuts.EditWidth}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleEditLength}>
          <ListItemIcon>
            <SwapVert fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Length</ListItemText>
          <Typography variant="body2" color="text.secondary">
            {keyboardShortcuts.EditLength}
          </Typography>
        </MenuItem>
      </Menu>
      <svg
        tabIndex={0}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${props.size} ${props.size}`}
        width={props.size}
        height={props.size}
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
            const layer = rectLayer(rect);
            if (!layer) {
              return;
            }

            const hidden = () => viewerState.hiddenLayers.includes(layer.name);
            return (
              <Show when={!hidden()}>
                <g
                  onClick={(event) => {
                    setSelectedRectIndex(index);
                    event.preventDefault();
                    setContextMenu(
                      contextMenu() === null
                        ? {
                            left: event.clientX + 2,
                            top: event.clientY,
                          }
                        : null,
                    );
                  }}
                  onMouseDown={(e) => {
                    if (e.detail > 1) {
                      // Prevent text selection on double click
                      e.preventDefault();
                    }
                  }}
                >
                  <rect
                    x={rect.x}
                    y={rect.y}
                    height={rect.height}
                    width={rect.width}
                    fill={layer.color}
                    class={styles.rect}
                    mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
                  />
                </g>
              </Show>
            );
          }}
        </For>

        <For each={layout.rects}>
          {(rect, index) => (
            <Show when={rect.label}>
              <text
                style={{ 'user-select': 'none', 'pointer-events': 'none' }}
                x={rect.x + rect.width / 2}
                y={rect.y}
                text-anchor="middle"
                alignment-baseline="before-edge"
              >
                {rect.label}
              </text>
            </Show>
          )}
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
            const layer = rectLayer(rect);
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
          x2={props.size}
          y2={viewerState.crossSectionY}
          stroke="black"
          stroke-width="1"
        />

        <Scale y={props.size} />
      </svg>
    </>
  );
}
