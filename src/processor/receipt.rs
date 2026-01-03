use image::Rgba;
use imageproc::drawing::draw_text_mut;
use napi_derive::napi;
use rusttype::{Font, Scale};
use std::path::Path;

#[napi]
pub fn generate_receipt(
  bg_path: String,
  font_path: String,
  output_path: String,
  store_name: String,
  total_price: String,
) -> String {
  let mut img = image::open(&Path::new(&bg_path)).expect("Failed to load background");
  let font_data = std::fs::read(font_path).expect("Failed to load font");
  let font = Font::try_from_vec(font_data).expect("Error parsing font");
  let color = Rgba([0u8, 0u8, 0u8, 255u8]);
  let scale = Scale { x: 40.0, y: 40.0 };

  draw_text_mut(&mut img, color, 100, 50, scale, &font, &store_name);
  draw_text_mut(
    &mut img,
    color,
    100,
    150,
    scale,
    &font,
    &format!("Total:{}", total_price),
  );
  img
    .save(&Path::new(&output_path))
    .expect("Failed to save receipt");
  format!("Receipt was successfully created in {}", output_path)
}
