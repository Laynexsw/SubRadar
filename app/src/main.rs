#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//! SubRadar v1.0 — %100 Saf Rust Native GUI Masaüstü Uygulaması (`main.rs`)

pub mod legal;
pub mod models;
pub mod parser;
pub mod presets;
pub mod theme;
pub mod ui;
pub mod vault;

use eframe::egui;
use ui::SubRadarApp;

fn main() -> eframe::Result<()> {
    let native_options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_title("SubRadar v1.0 — Çevrimdışı Abonelik Yöneticisi & Yerel Kasa")
            .with_inner_size([1180.0, 760.0])
            .with_min_inner_size([960.0, 620.0]),
        ..Default::default()
    };

    eframe::run_native(
        "SubRadar v1.0",
        native_options,
        Box::new(|cc| {
            theme::apply_theme(&cc.egui_ctx, true);
            Ok(Box::new(SubRadarApp::default()))
        }),
    )
}
