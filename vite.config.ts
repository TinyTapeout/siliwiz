import solid from "solid-start/vite";
import { defineConfig } from "vite";
import wasmPack from 'vite-plugin-wasm-pack';

export default defineConfig({
  plugins: [solid({ ssr: false }), wasmPack('./public/wasm_xena_lite')]
});
