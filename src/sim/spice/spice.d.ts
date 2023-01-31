// SPDX-License-Identifier: MIT

interface ModuleConfig {
  arguments?: string;
  noInitialRun: boolean;
  FS?: FSType;
  Asyncify?: AsyncifyType;
  print: (e?: any) => void;
  printErr: (e?: any) => void;
}

interface ModuleType {
  FS?: FSType;
  Asyncify?: AsyncifyType;
  setHandleThings: (handleThings: () => void) => void;
  setGetInput: (getInput: () => string) => void;
  runThings: () => void;
}

/**
 * File System
 */
interface FSType {
  mkdir(path: string): void;
  writeFile(path: string, data: string): void;
  readFile(path: string): Uint8Array;
}

interface AsyncifyType {
  handleSleep(callback: (wakeup: () => void) => void): void;
  handleAsync(handle: () => void): void;
}

export default function Module(m: ModuleConfig): Promise<ModuleType>;
