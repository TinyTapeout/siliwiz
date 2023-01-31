// SPDX-License-Identifier: Apache-2.0

import { getTechFileURL } from '../../src/model/runMagic';

export function onRequest() {
  return fetch(getTechFileURL().toString());
}
