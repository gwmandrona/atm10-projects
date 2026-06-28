#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;

use tauri::api::path::app_dir;

#[tauri::command]
fn fetch_url(url: String) -> Result<String, String> {
  // Simple caching: store responses in app dir/cache/<hex of url>
  let cache_dir = app_dir()
    .map(|p| p.join("atm10_explorer").join("cache"))
    .ok_or("failed to resolve app dir")?;

  let key = format!("{:x}", md5::compute(&url));
  let file_path = cache_dir.join(&key);

  // Try return from cache first
  if file_path.exists() {
    if let Ok(s) = fs::read_to_string(&file_path) {
      return Ok(s);
    }
  }

  // Fetch from network
  let resp = reqwest::blocking::get(&url).map_err(|e| e.to_string())?;
  let text = resp.text().map_err(|e| e.to_string())?;

  // Ensure cache dir exists
  if let Err(e) = fs::create_dir_all(&cache_dir) {
    eprintln!("failed to create cache dir: {}", e);
  } else {
    let _ = fs::write(&file_path, &text);
  }

  Ok(text)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![fetch_url])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
