use std::time::Duration;

use tauri::{Window, Manager};

use crate::event_payload::Payload;

pub fn start_button_loop(app: Window) {

    if let Ok(button_events) = ir_sensor::button_events() {
        std::thread::spawn(move || {
            for button in button_events {
                app.emit_all("button", Payload { button: format!("{:?}", button) }).unwrap();


                std::thread::sleep(Duration::from_millis(200));
            }
        });
    }
}