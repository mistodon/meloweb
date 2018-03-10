extern crate base64;
extern crate melo;


use std::ffi::{CString, CStr};
use std::os::raw::{c_char, c_void};
use melo::Error;


fn compile_to_midi(input: &str) -> Result<Vec<u8>, Error>
{
    let options = &melo::MidiGenerationOptions::default();
    melo::compile_to_midi(input, None, options)
}


#[no_mangle]
pub extern "C" fn compile_to_base64(ptr: *mut c_char) -> *mut c_char
{
    let input = unsafe
    {
        CStr::from_ptr(ptr)
    };

    let output_cstring = match compile_to_midi(input.to_str().unwrap())
    {
        Ok(bytes) => {
            let midistring = base64::encode(&bytes);
            CString::new(midistring).unwrap()
        }
        Err(err) => {
            let error_message = format!("{}", err);
            CString::new(error_message).unwrap()
        }
    };

    output_cstring.into_raw()
}

#[no_mangle]
pub extern "C" fn alloc_cstring(len: usize) -> *mut c_void
{
    let mut buf: Vec<u8> = Vec::with_capacity(len);
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf);
    ptr as *mut c_void
}

#[no_mangle]
pub extern "C" fn dealloc_cstring(ptr: *mut c_char)
{
    unsafe
    {
        let _ = CString::from_raw(ptr);
    }
}
