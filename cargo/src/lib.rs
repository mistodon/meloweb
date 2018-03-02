#![feature(proc_macro)]


#[macro_use] extern crate stdweb;
extern crate base64;
extern crate melo;


use stdweb::js_export;


#[js_export]
pub fn compile_to_midi(input: &str) -> Vec<u8>
{
    let options = &melo::MidiGenerationOptions::default();
    let output = melo::compile_to_midi(input, None, options).unwrap();
    output
}

#[js_export]
pub fn compile_to_base64(input: &str) -> String
{
    let midi = compile_to_midi(input);
    base64::encode(&midi)
}
