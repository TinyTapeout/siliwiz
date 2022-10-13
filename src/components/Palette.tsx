import { createSignal, For } from 'solid-js';
import { layerTypes } from '~/model/layerTypes';
import styles from './Palette.module.css';

export default function Palette() {
  const [active, setActive] = createSignal(layerTypes[0].name);
  return (
    <div class={styles.palette}>
      <For each={layerTypes}>
        {(layer) => (
          <div
            classList={{ [styles.item]: true, [styles.active]: active() == layer.name }}
            onClick={() => {
              setActive(layer.name);
            }}
          >
            <input type="checkbox" />
            <span class={styles.color} style={{ background: layer.color }} />
            <span>{layer.name}</span>
          </div>
        )}
      </For>
    </div>
  );
}
