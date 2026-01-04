use image::{GenericImage, GenericImageView, Rgba};
use imageproc::drawing::{draw_text_mut, text_size};
use napi_derive::napi;
use rusttype::{Font, Scale};
use std::fs;

#[napi]
pub fn generate_receipt(
  bg_path: String,
  font_path: String,
  output_path: String,
  store_name: String,
  store_address: String,
  items: Vec<String>,
  total_price: String,
) -> napi::Result<String> {
  let mut img = image::open(&bg_path)
    .map_err(|e| napi::Error::from_reason(format!("Failed to load background: {}", e)))?;

  let (img_width, _) = img.dimensions();
  let font_data = fs::read(&font_path)
    .map_err(|e| napi::Error::from_reason(format!("Failed to read font: {}", e)))?;
  let font = Font::try_from_vec(font_data)
    .ok_or_else(|| napi::Error::from_reason("Error parsing font data"))?;

  let black = Rgba([0, 0, 0, 255]);

  let scale_title = Scale { x: 80.0, y: 80.0 };
  let (tw, _) = text_size(scale_title, &font, &store_name);
  draw_text_mut(
    &mut img,
    black,
    (img_width as i32 - tw) / 2,
    40,
    scale_title,
    &font,
    &store_name,
  );

  let scale_address = Scale { x: 28.0, y: 28.0 };
  let (aw, _) = text_size(scale_address, &font, &store_address);
  draw_text_mut(
    &mut img,
    black,
    (img_width as i32 - aw) / 2,
    130,
    scale_address,
    &font,
    &store_address,
  );

  // ===== ITEMS =====
  let scale_item = Scale { x: 42.0, y: 42.0 };
  let mut current_y = 280;
  let max_text_width = (img_width as i32) - 300;

  for item in items.iter().take(8) {
    let parts: Vec<&str> = item.split(':').collect();

    if parts.len() == 2 {
      let product_name = parts[0].trim();
      let product_price = parts[1].trim();
      let start_y_for_this_item = current_y;

      let mut words = product_name.split_whitespace();
      let mut current_line = String::new();

      while let Some(word) = words.next() {
        let test_line = if current_line.is_empty() {
          word.to_string()
        } else {
          format!("{} {}", current_line, word)
        };
        let (w, _) = text_size(scale_item, &font, &test_line);

        if w > max_text_width {
          draw_text_mut(
            &mut img,
            black,
            60,
            current_y,
            scale_item,
            &font,
            &current_line,
          );
          current_line = word.to_string();
          current_y += 45;
        } else {
          current_line = test_line;
        }
      }
      draw_text_mut(
        &mut img,
        black,
        60,
        current_y,
        scale_item,
        &font,
        &current_line,
      );

      let (pw, _) = text_size(scale_item, &font, product_price);
      draw_text_mut(
        &mut img,
        black,
        img_width as i32 - pw - 60,
        start_y_for_this_item,
        scale_item,
        &font,
        product_price,
      );
    } else {
      draw_text_mut(&mut img, black, 60, current_y, scale_item, &font, item);
    }

    current_y += 85;
  }

  // ===== GARIS PEMBATAS =====
  let line_y = current_y + 20;
  for x in 50..(img_width - 50) {
    img.put_pixel(x, line_y as u32, black);
  }

  // ===== TOTAL =====
  let scale_total = Scale { x: 52.0, y: 52.0 };
  let total_y = line_y + 40;
  draw_text_mut(&mut img, black, 60, total_y, scale_total, &font, "TOTAL");

  let (total_w, _) = text_size(scale_total, &font, &total_price);
  draw_text_mut(
    &mut img,
    black,
    img_width as i32 - total_w - 60,
    total_y,
    scale_total,
    &font,
    &total_price,
  );

  img
    .save(&output_path)
    .map_err(|e| napi::Error::from_reason(format!("Failed to save image: {}", e)))?;

  Ok(format!("Receipt created at {}", output_path))
}
