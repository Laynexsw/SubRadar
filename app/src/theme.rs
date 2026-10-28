//! SubRadar v1.0 — Sitedeki Önizleme ile 1:1 Birebir Koyu Tema (`theme.rs`)

use eframe::egui::{self, Color32, CornerRadius, Stroke, Visuals};

pub const BG_MAIN: Color32 = Color32::from_rgb(9, 9, 11);           // #09090b
pub const BG_HEADER: Color32 = Color32::from_rgb(11, 11, 14);       // #0b0b0e
pub const BG_SIDEBAR: Color32 = Color32::from_rgb(8, 8, 10);        // #08080a
pub const SURFACE_DARK: Color32 = Color32::from_rgb(18, 18, 22);    // #121216
pub const CARD_DARK: Color32 = Color32::from_rgb(24, 24, 29);       // #18181d
pub const BORDER_SUBTLE: Color32 = Color32::from_rgb(28, 28, 34);   // #1c1c22
pub const BORDER_DARK: Color32 = Color32::from_rgb(39, 39, 46);     // #27272e

pub const LIGHT_BTN_BG: Color32 = Color32::from_rgb(228, 228, 231); // #e4e4e7
pub const LIGHT_BTN_HOVER: Color32 = Color32::from_rgb(255, 255, 255);
pub const DARK_TEXT: Color32 = Color32::from_rgb(9, 9, 11);

pub const ACCENT_EMERALD: Color32 = Color32::from_rgb(16, 185, 129); // #10b981
pub const ACCENT_AMBER: Color32 = Color32::from_rgb(245, 158, 11);   // #f59e0b
pub const ACCENT_ROSE: Color32 = Color32::from_rgb(239, 68, 68);     // #ef4444
pub const ACCENT_BLUE: Color32 = Color32::from_rgb(56, 189, 248);    // #38bdf8

pub const TEXT_WHITE: Color32 = Color32::from_rgb(244, 244, 245);    // #f4f4f5
pub const TEXT_SECONDARY: Color32 = Color32::from_rgb(161, 161, 170);// #a1a1aa
pub const TEXT_MUTED_DARK: Color32 = Color32::from_rgb(113, 113, 122);// #71717a
pub const TEXT_DIM: Color32 = Color32::from_rgb(82, 82, 91);         // #52525b

pub fn apply_theme(ctx: &egui::Context, _dark_mode: bool) {
    let mut style = (*ctx.style()).clone();
    style.spacing.item_spacing = egui::vec2(8.0, 8.0);
    style.spacing.button_padding = egui::vec2(12.0, 6.0);
    style.spacing.window_margin = egui::Margin::same(0);

    let mut visuals = Visuals::dark();
    let radius = CornerRadius::same(8);

    visuals.window_corner_radius = CornerRadius::same(12);
    visuals.menu_corner_radius = radius;
    visuals.panel_fill = BG_MAIN;
    visuals.window_fill = BG_MAIN;
    visuals.extreme_bg_color = Color32::from_rgb(6, 6, 8);
    visuals.faint_bg_color = SURFACE_DARK;
    visuals.override_text_color = Some(TEXT_WHITE);

    visuals.widgets.noninteractive.bg_fill = CARD_DARK;
    visuals.widgets.noninteractive.weak_bg_fill = CARD_DARK;
    visuals.widgets.noninteractive.bg_stroke = Stroke::new(1.0_f32, BORDER_SUBTLE);
    visuals.widgets.noninteractive.fg_stroke = Stroke::new(1.0_f32, TEXT_WHITE);
    visuals.widgets.noninteractive.corner_radius = radius;

    visuals.widgets.inactive.bg_fill = CARD_DARK;
    visuals.widgets.inactive.weak_bg_fill = CARD_DARK;
    visuals.widgets.inactive.bg_stroke = Stroke::new(1.0_f32, BORDER_DARK);
    visuals.widgets.inactive.fg_stroke = Stroke::new(1.0_f32, TEXT_WHITE);
    visuals.widgets.inactive.corner_radius = radius;

    visuals.widgets.hovered.bg_fill = Color32::from_rgb(32, 32, 38);
    visuals.widgets.hovered.weak_bg_fill = Color32::from_rgb(32, 32, 38);
    visuals.widgets.hovered.bg_stroke = Stroke::new(1.0_f32, Color32::from_rgb(63, 63, 70));
    visuals.widgets.hovered.fg_stroke = Stroke::new(1.0_f32, Color32::WHITE);
    visuals.widgets.hovered.corner_radius = radius;

    visuals.widgets.active.bg_fill = LIGHT_BTN_BG;
    visuals.widgets.active.weak_bg_fill = LIGHT_BTN_BG;
    visuals.widgets.active.bg_stroke = Stroke::new(1.0_f32, LIGHT_BTN_BG);
    visuals.widgets.active.fg_stroke = Stroke::new(1.0_f32, DARK_TEXT);
    visuals.widgets.active.corner_radius = radius;

    visuals.selection.bg_fill = Color32::from_rgb(28, 28, 34);
    visuals.selection.stroke = Stroke::new(1.0_f32, Color32::from_rgb(63, 63, 70));

    style.visuals = visuals;
    ctx.set_style(style);
}
