#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use ir_sensor::button_events;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            app.emit_all("button", Payload { message: "Tauri is awesome!".into() }).unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}