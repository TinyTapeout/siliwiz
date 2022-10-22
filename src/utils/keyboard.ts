import { isMac } from './user-agent';

export function ctrlCmdPressed(e: KeyboardEvent) {
  return isMac() ? e.metaKey : e.ctrlKey;
}

export function getCtrlCmdKeyName() {
  return isMac() ? '⌘' : 'Ctrl';
}
