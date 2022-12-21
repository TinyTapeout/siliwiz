/* tslint:disable */
/* eslint-disable */
/**
* Handler for `console.log` invocations.
*
* If a test is currently running it takes the `args` array and stringifies
* it and appends it to the current output of the test. Otherwise it passes
* the arguments to the original `console.log` function, psased as
* `original`.
* @param {Array<any>} args
*/
export function __wbgtest_console_log(args: Array<any>): void;
/**
* Handler for `console.debug` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_debug(args: Array<any>): void;
/**
* Handler for `console.info` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_info(args: Array<any>): void;
/**
* Handler for `console.warn` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_warn(args: Array<any>): void;
/**
* Handler for `console.error` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_error(args: Array<any>): void;
/**
* Runtime test harness support instantiated in JS.
*
* The node.js entry script instantiates a `Context` here which is used to
* drive test execution.
*/
export class WasmBindgenTestContext {
  free(): void;
/**
* Creates a new context ready to run tests.
*
* A `Context` is the main structure through which test execution is
* coordinated, and this will collect output and results for all executed
* tests.
*/
  constructor();
/**
* Inform this context about runtime arguments passed to the test
* harness.
*
* Eventually this will be used to support flags, but for now it's just
* used to support test filters.
* @param {any[]} args
*/
  args(args: any[]): void;
/**
* Executes a list of tests, returning a promise representing their
* eventual completion.
*
* This is the main entry point for executing tests. All the tests passed
* in are the JS `Function` object that was plucked off the
* `WebAssembly.Instance` exports list.
*
* The promise returned resolves to either `true` if all tests passed or
* `false` if at least one test failed.
* @param {any[]} tests
* @returns {Promise<any>}
*/
  run(tests: any[]): Promise<any>;
}
/**
*/
export class XenaUi {
  free(): void;
/**
* @returns {XenaUi}
*/
  static new(): XenaUi;
/**
* @param {string} filedata
* @param {number} effort
* @param {number} strict
* @returns {string}
*/
  parse_cir(filedata: string, effort: number, strict: number): string;
/**
* @param {string} cir_name
* @param {string} dco_name
* @param {string} cir_dir
* @param {number} effort
* @param {number} strict
* @returns {string}
*/
  read_cir(cir_name: string, dco_name: string, cir_dir: string, effort: number, strict: number): string;
/**
* @param {Uint32Array} nodes
* @returns {string}
*/
  save_nodes(nodes: Uint32Array): string;
/**
* @param {string} src_name
* @param {number} val
* @returns {string}
*/
  set_source(src_name: string, val: number): string;
/**
* @param {number} step
* @param {number} endtime
*/
  set_tr_time(step: number, endtime: number): void;
/**
* @returns {string}
*/
  solve(): string;
/**
* @param {number} tstep
* @returns {string}
*/
  step(tstep: number): string;
/**
* @param {string} device_name
* @param {string} param_name
* @param {number} val
* @returns {string}
*/
  set_val(device_name: string, param_name: string, val: number): string;
/**
* @param {string} param_name
* @param {Int32Array} val
* @returns {string}
*/
  sweep(param_name: string, val: Int32Array): string;
/**
* @param {string} device_name
* @param {string} model_name
* @param {string} geo_name
* @param {Int32Array} nodes
* @returns {string}
*/
  add_device(device_name: string, model_name: string, geo_name: string, nodes: Int32Array): string;
/**
* @param {string} model_name
* @param {string} model_data
* @returns {string}
*/
  add_model(model_name: string, model_data: string): string;
/**
* @param {string} geo_name
* @param {string} geo_data
* @returns {string}
*/
  add_geometry(geo_name: string, geo_data: string): string;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @returns {string}
*/
  render(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_xenaui_free: (a: number) => void;
  readonly xenaui_new: () => number;
  readonly xenaui_parse_cir: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly xenaui_read_cir: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly xenaui_save_nodes: (a: number, b: number, c: number, d: number) => void;
  readonly xenaui_set_source: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly xenaui_set_tr_time: (a: number, b: number, c: number) => void;
  readonly xenaui_solve: (a: number, b: number) => void;
  readonly xenaui_step: (a: number, b: number, c: number) => void;
  readonly xenaui_set_val: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly xenaui_sweep: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly xenaui_add_device: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly xenaui_add_model: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly xenaui_add_geometry: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly xenaui_width: (a: number) => number;
  readonly xenaui_height: (a: number) => number;
  readonly xenaui_render: (a: number, b: number) => void;
  readonly __wbgt_run_rendering_0: (a: number) => void;
  readonly __wbg_wasmbindgentestcontext_free: (a: number) => void;
  readonly wasmbindgentestcontext_new: () => number;
  readonly wasmbindgentestcontext_args: (a: number, b: number, c: number) => void;
  readonly wasmbindgentestcontext_run: (a: number, b: number, c: number) => number;
  readonly __wbgtest_console_log: (a: number) => void;
  readonly __wbgtest_console_debug: (a: number) => void;
  readonly __wbgtest_console_info: (a: number) => void;
  readonly __wbgtest_console_warn: (a: number) => void;
  readonly __wbgtest_console_error: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h5936b393a5590405: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures__invoke0_mut__h50e4f9626559145c: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke3_mut__h44b872ba63f20078: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h14165df31733bf64: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
