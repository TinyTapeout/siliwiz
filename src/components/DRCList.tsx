import { Show } from 'solid-js';
import { IDRCItem, setActiveDRCItem } from '~/model/drc';
import styles from './DRCList.module.css';

export interface IDRCListProps {
  drc: IDRCItem[];
}

export default function DRCList(props: IDRCListProps) {
  return (
    <Show when={props.drc.length > 0}>
      <h3>DRC Errors</h3>
      <ul class={styles.drcList}>
        {props.drc.map((item) => (
          <li
            class={styles.drcItem}
            onmouseover={() => setActiveDRCItem(item)}
            onmouseout={() => setActiveDRCItem(null)}
          >
            {item.message}
          </li>
        ))}
      </ul>
    </Show>
  );
}
