import { getTechFileURL } from '../../src/model/runMagic';

export function onRequest() {
  return fetch(getTechFileURL().toString());
}
