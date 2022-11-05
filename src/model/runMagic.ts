import { parseMagicDRC } from './drc';
import { ILayout } from './layout';
import { toMagic, defaultTech } from './magic';
import { setSpiceInput } from './spiceFile';

const serverUrl = 'https://siliwiz-server-73miufol2q-uc.a.run.app/magic';
// const serverUrl = 'http://localhost:8086/magic';

interface IMagicResponse {
  spiceFile: string;
  magicOutput: string;
}

export async function runMagic(layout: ILayout) {
  const start = new Date().getTime();
  const magicInput = toMagic(layout, defaultTech);
  const res = await fetch(serverUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ magicFile: magicInput, tech: defaultTech }),
  });
  const data: IMagicResponse = await res.json();
  setSpiceInput(data.spiceFile);
  console.log('Download time:', new Date().getTime() - start, 'ms');
  return parseMagicDRC(data.magicOutput);
}
