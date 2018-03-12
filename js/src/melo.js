import meloweb from "../wasm/meloweb.wasm";
import { TextEncoder, TextDecoder } from "text-encoding";
// TODO(claire): Default to the browser native Text{Encoder, Decoder} as the above is gigantic.


var loadedModule = null;

async function loadModule() {
  if (loadedModule !== null) {
    return loadedModule;
  }
  loadedModule = await meloweb();
  return loadedModule;
}


export async function compile_melo_to_base64(source) {
  const module = await loadModule();

  // Create the input string
  const utf8Encoder = new TextEncoder("utf-8");
  const buffer = utf8Encoder.encode(source);
  const len = buffer.length;
  const ptr = module.instance.exports.alloc_cstring(len+1);

  const memory = new Uint8Array(module.instance.exports.memory.buffer);
  for (let i = 0; i < len; i++) {
    memory[ptr+i] = buffer[i];
  }
  memory[ptr+len] = 0;

  // Compile it
  const resultPtr = module.instance.exports.compile_to_base64(ptr);

  // Extract the output string
  const collectCString = function* () {
    let cursor = resultPtr;
    const memory = new Uint8Array(module.instance.exports.memory.buffer);
    while (memory[cursor] !== 0) {
      if (memory[cursor] === undefined) {
        throw new Error("Tried to read undef mem");
      }
      yield memory[cursor];
      cursor += 1;
    }
  };

  const resultBytes = new Uint8Array(collectCString());
  const utf8Decoder = new TextDecoder("utf-8");
  const base64 = utf8Decoder.decode(resultBytes);
  module.instance.exports.dealloc_cstring(resultPtr);

  return base64;
}
