// SPDX-License-Identifier: Apache-2.0

import { For, Show } from 'solid-js';
import { setActiveDRCItem, type IDRCItem } from '~/model/drc';
import styles from './DRCList.module.css';

export interface IDRCListProps {
  drc?: IDRCItem[];
}

export default function DRCList(props: IDRCListProps) {
  return (
    <Show when={props.drc} keyed>
      {(drc) => (
        <>
          <h3>DRC Errors</h3>
          <Show when={drc.length === 0}>✅ DRC OK</Show>
          <ul class={styles.drcList}>
            <For each={drc}>
              {(item) => (
                <li
                  class={styles.drcItem}
                  onMouseOver={() => setActiveDRCItem(item)}
                  onMouseOut={() => setActiveDRCItem(null)}
                >
                  {item.message}
                </li>
              )}
            </For>
          </ul>
        </>
      )}
    </Show>
  );
}
