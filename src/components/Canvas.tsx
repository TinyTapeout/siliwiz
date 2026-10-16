// SPDX-License-Identifier: Apache-2.0

import { Delete, Edit, OpenWith, SwapHoriz, SwapVert } from '@suid/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@suid/material';
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from 'solid-js';
import { activeDRCItem } from '~/model/drc';
import {
  type ILayoutRect,
  lambdaToMicrons,
  layout,
  layoutUndo,
  rectLayer,
  selectedRectIndex,
  setLayout,
  setSelectedRectIndex,
  sortRects,
} from '~/model/layout';
import { spiceIdentifierRegexp, spiceIdentifierReservedNames } from '~/model/spiceFile';
import { isLayerVisible, viewerState } from '~/model/viewerState';
import { domRectFromPoints, type Point2D } from '~/utils/geometry';
import { ctrlCmdPressed } from '~/utils/keyboard';
import styles from './Canvas.module.css';
import Scale from './Scale';

interface INewRect {
  layer: string;
  start: Point2D;
  end: Point2D;
}

interface IMovingRect {
  index: number;
  /** Offset of the cursor from the rect's top-left corner */
  grab: Point2D;
  /** Previewed top-left corner, committed to the layout on drop */
  pos: Point2D;
}

const keyboardShortcuts = {
  Delete: 'D',
  Move: 'M',
  EditWidth: 'F',
  EditLength: 'R',
  SetLabel: 'S',
};

const arrowKeyOffsets: Record<string, Point2D> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};

export default function Canvas(props: { size: number }) {
  const [svgRef, setSVGRef] = createSignal<SVGSVGElement | null>(null);
  const [newRect, setNewRect] = createSignal<INewRect | null>(null);
  const [moving, setMoving] = createSignal<IMovingRect | null>(null);
  const [popMenu, setPopMenu] = createSignal(false);
  let lastPointer: Point2D | null = null;

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

  const selectedRectLayer = () => {
    const rect = selectedRect();
    return rect != null ? rectLayer(rect) : null;
  };

  const handleDelete = () => {
    setLayout('rects', (rects) => rects.filter((r, index) => index !== selectedRectIndex()));
    setSelectedRectIndex(null);
  };

  const handleSetLabel = () => {
    const selection = selectedRect();
    const selectionIndex = selectedRectIndex();
    if (selection == null || selectionIndex == null || !selectedRectLayer()?.hasLabels) {
      return;
    }
    const label = prompt('Enter new label (or an empty string to delete label)', selection.label);
    if (label != null) {
      const trimmedLabel = label.trim();
      if (trimmedLabel === '') {
        setLayout('rects', selectionIndex, { ...selection, label: undefined });
        return;
      }
      if (!spiceIdentifierRegexp.test(trimmedLabel)) {
        alert(
          'Label must begin with an alphabetic character and contain only alphanumeric characters and underscores',
        );
        return;
      }
      if (spiceIdentifierReservedNames.includes(trimmedLabel.toLowerCase())) {
        alert(`${trimmedLabel} is a reserved word in ngspice. Please choose a different label.`);
        return;
      }
      setLayout('rects', selectionIndex, { ...selection, label: trimmedLabel });
    }
  };

  const handleEditWidth = () => {
    const selection = selectedRect();
    const selectionIndex = selectedRectIndex();
    if (selection == null || selectionIndex == null) {
      return;
    }
    const currentValue = (selection.width * lambdaToMicrons).toFixed(2).replace(/\.?0+$/, '');
    const newWidth = prompt('Enter new width in µm', currentValue);
    if (newWidth != null) {
      setLayout('rects', selectionIndex, { width: parseFloat(newWidth) / lambdaToMicrons });
    }
  };

  const handleEditLength = () => {
    const selection = selectedRect();
    const selectionIndex = selectedRectIndex();
    if (selection == null || selectionIndex == null) {
      return;
    }
    const currentValue = (selection.height * lambdaToMicrons).toFixed(2).replace(/\.?0+$/, '');
    const newLength = prompt('Enter new length in µm', currentValue);
    if (newLength != null) {
      setLayout('rects', selectionIndex, { height: parseFloat(newLength) / lambdaToMicrons });
    }
  };

  const clampPos = (rect: ILayoutRect, { x, y }: Point2D) => ({
    x: Math.min(Math.max(x, 0), props.size - rect.width),
    y: Math.min(Math.max(y, 0), props.size - rect.height),
  });

  const displayPos = (rect: ILayoutRect, index: number): Point2D => {
    const move = moving();
    return move?.index === index ? move.pos : { x: rect.x, y: rect.y };
  };

  const handleStartMove = (cursor?: Point2D) => {
    const selection = selectedRect();
    const selectionIndex = selectedRectIndex();
    if (selection == null || selectionIndex == null) {
      return;
    }
    const point = cursor ??
      lastPointer ?? {
        x: selection.x + selection.width / 2,
        y: selection.y + selection.height / 2,
      };
    setMoving({
      index: selectionIndex,
      grab: { x: point.x - selection.x, y: point.y - selection.y },
      pos: { x: selection.x, y: selection.y },
    });
  };

  const handleNudge = (offset: Point2D, step: number) => {
    const selection = selectedRect();
    const selectionIndex = selectedRectIndex();
    if (selection == null || selectionIndex == null) {
      return;
    }
    const pos = clampPos(selection, {
      x: selection.x + offset.x * step,
      y: selection.y + offset.y * step,
    });
    if (pos.x !== selection.x || pos.y !== selection.y) {
      setLayout('rects', selectionIndex, pos);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const cmdCtrl = ctrlCmdPressed(e);
    const upperKey = e.key.toUpperCase();
    if (moving() != null) {
      // Ignore other shortcuts while a rect is being moved
      if (e.key === 'Escape') {
        setMoving(null);
      }
      return true;
    }
    if (e.key in arrowKeyOffsets && selectedRect() != null) {
      e.preventDefault(); // Don't scroll the page
      handleNudge(arrowKeyOffsets[e.key], e.shiftKey ? 10 : 1);
      return true;
    }
    if (upperKey === keyboardShortcuts.Move && !cmdCtrl) {
      handleStartMove();
      return true;
    }
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
    if (matrix == null) {
      return { x, y };
    }
    const transformedPoint = new DOMPoint(x, y).matrixTransform(matrix.inverse());
    return { x: transformedPoint.x, y: transformedPoint.y };
  };

  const commitMove = () => {
    const move = moving();
    if (move == null) {
      return;
    }
    const rect = layout.rects[move.index];
    if (rect.x !== move.pos.x || rect.y !== move.pos.y) {
      setLayout('rects', move.index, move.pos);
    }
    setMoving(null);
  };

  // Drop the rect when clicking outside the canvas, too
  const isMoving = createMemo(() => moving() != null);
  createEffect(() => {
    if (!isMoving()) {
      return;
    }
    const handleWindowMouseDown = (e: MouseEvent) => {
      if (!(e.target instanceof Node && svgRef()?.contains(e.target))) {
        commitMove();
      }
    };
    window.addEventListener('mousedown', handleWindowMouseDown);
    onCleanup(() => window.removeEventListener('mousedown', handleWindowMouseDown));
  });

  const handleMouseDown = (e: MouseEvent) => {
    if (moving() != null) {
      commitMove();
      setPopMenu(false); // Ensures the context menu won't pop after dropping the rect
      return;
    }
    const layer = viewerState.activeLayer;
    const point = translatePoint({ x: e.clientX, y: e.clientY });
    if (layer != null) {
      setNewRect({ start: point, end: point, layer });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const point = translatePoint({ x: e.clientX, y: e.clientY });
    lastPointer = point;
    const move = moving();
    if (move != null) {
      const rect = layout.rects[move.index];
      setMoving({
        ...move,
        pos: clampPos(rect, { x: point.x - move.grab.x, y: point.y - move.grab.y }),
      });
      return;
    }
    setNewRect((rect) => (rect != null ? { ...rect, end: point } : null));
  };

  const handleMouseUp = (e: MouseEvent) => {
    const rect = newRect();
    if (rect != null) {
      setNewRect(null);

      const domRect = domRectFromPoints(rect.start, rect.end);
      if (domRect.width < 3 || domRect.height < 3) {
        // Don't create a rect that's too small, see https://github.com/TinyTapeout/siliwiz/issues/10
        return;
      }

      setPopMenu(false); // Ensures the context menu won't pop after drawing a rect

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
        // eslint-disable-next-line solid/reactivity
        onKeyDown={(e) => {
          // Arrow keys navigate the menu rather than nudging the rect
          if (!(e.key in arrowKeyOffsets) && handleKeyDown(e)) {
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
        <MenuItem
          onClick={() => {
            const menuPos = contextMenu();
            handleStartMove(
              menuPos != null ? translatePoint({ x: menuPos.left - 2, y: menuPos.top }) : undefined,
            );
          }}
        >
          <ListItemIcon>
            <OpenWith fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move</ListItemText>
          <Typography variant="body2" color="text.secondary">
            {keyboardShortcuts.Move}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleSetLabel} disabled={!selectedRectLayer()?.hasLabels}>
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
        style={{ cursor: moving() != null ? 'move' : undefined }}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
            if (layer == null) {
              return;
            }

            return (
              <Show when={isLayerVisible(layer.name)}>
                <g
                  onClick={(event) => {
                    if (!popMenu()) {
                      return;
                    }
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
                    setPopMenu(true);
                    if (e.detail > 1) {
                      // Prevent text selection on double click
                      e.preventDefault();
                    }
                  }}
                >
                  <rect
                    x={displayPos(rect, index()).x}
                    y={displayPos(rect, index()).y}
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
          {(rect, index) => {
            return (
              <Show when={rect.label != null && isLayerVisible(rect.layer)}>
                <text
                  style={{ 'user-select': 'none', 'pointer-events': 'none' }}
                  x={displayPos(rect, index()).x + rect.width / 2}
                  y={displayPos(rect, index()).y}
                  text-anchor="middle"
                  alignment-baseline="before-edge"
                >
                  {rect.label}
                </text>
              </Show>
            );
          }}
        </For>

        <Show when={selectedRect()} keyed>
          {(rect) => (
            <rect
              x={displayPos(rect, selectedRectIndex() ?? -1).x}
              y={displayPos(rect, selectedRectIndex() ?? -1).y}
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
            if (layer == null) {
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

        <For each={activeDRCItem()?.coords}>
          {(rect) => (
            <rect
              x={rect.x0}
              y={rect.y0}
              width={rect.x1 - rect.x0}
              height={rect.y1 - rect.y0}
              fill="red"
              fill-opacity="0.5"
              stroke="red"
            />
          )}
        </For>
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
