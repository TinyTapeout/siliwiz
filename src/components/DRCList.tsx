// SPDX-License-Identifier: Apache-2.0

import { Show } from 'solid-js';
import { IDRCItem, setActiveDRCItem } from '~/model/drc';
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
            {drc.map((item) => (
              <li
                class={styles.drcItem}
                onmouseover={() => setActiveDRCItem(item)}
                onmouseout={() => setActiveDRCItem(null)}
              >
                {item.message}
              </li>
            ))}
          </ul>
        </>
      )}
    </Show>
  );
}
