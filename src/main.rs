#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod event_payload;
mod button_loop;


use button_loop::start_button_loop;

fn main() {
    tauri::Builder::default()
        .on_page_load(|app, _ev| {
            start_button_loop(app);
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}