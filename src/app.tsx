// SPDX-License-Identifier: Apache-2.0
// @refresh reload
import { clientOnly } from '@solidjs/start';
import './app.css';
import { loadPreset } from './model/layout';

export default function App() {
  if (typeof location !== 'undefined') {
    const urlParams = new URLSearchParams(location.search);
    const preset = urlParams.get('preset');
    if (preset != null) {
      void import(`~/../presets/${preset}.json`).then((module) => {
        if (module?.rects != null) {
          loadPreset(module);
        }
      });
    }
  }

  const Siliwiz = clientOnly(() => import('~/components/Siliwiz'));

  return <Siliwiz />;
}
