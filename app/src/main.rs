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
            .with_title("SubRadar Masaüstü — Yerel Kasa")
            .with_decorations(false)
            .with_resizable(true)
            .with_inner_size([1140.0, 650.0])
            .with_min_inner_size([960.0, 560.0]),
        ..Default::default()
    };

    eframe::run_native(
        "SubRadar Masaüstü — Yerel Kasa",
        native_options,
        Box::new(|cc| {
            theme::apply_theme(&cc.egui_ctx, true);
            Ok(Box::new(SubRadarApp::default()))
        }),
    )
}
