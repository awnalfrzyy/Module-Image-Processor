use image::{io::Reader as ImageReader, ImageFormat};
use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::io::Cursor;

#[napi]
pub fn compress_image(buffer: Uint8Array, width: u32, height: u32, grayscale: bool) -> Buffer {
  let img = ImageReader::new(Cursor::new(buffer.as_ref()))
    .with_guessed_format()
    .unwrap()
    .decode()
    .expect("Gagal decode");

  let mut processed = img.thumbnail(width, height);
  if grayscale {
    processed = processed.grayscale();
  }

  let mut result = Vec::new();
  processed
    .write_to(&mut Cursor::new(&mut result), ImageFormat::Png)
    .unwrap();

  result.into()
}
