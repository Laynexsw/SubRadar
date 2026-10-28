//! SubRadar v1.0 — Minimalist Apple / Raycast / Linear Tema Sistemi (`theme.rs`)

use eframe::egui::{self, Color32, CornerRadius, Stroke, Visuals};

pub const BG_DARK: Color32 = Color32::from_rgb(9, 9, 11);       // #09090b
pub const SURFACE_DARK: Color32 = Color32::from_rgb(18, 18, 21); // #121215
pub const CARD_DARK: Color32 = Color32::from_rgb(24, 24, 27);    // #18181b
pub const BORDER_DARK: Color32 = Color32::from_rgb(39, 39, 42);  // #27272a

pub const ACCENT_EMERALD: Color32 = Color32::from_rgb(16, 185, 129); // #10b981
pub const ACCENT_AMBER: Color32 = Color32::from_rgb(245, 158, 11);   // #f59e0b
pub const ACCENT_ROSE: Color32 = Color32::from_rgb(244, 63, 94);     // #f43f5e
pub const ACCENT_BLUE: Color32 = Color32::from_rgb(56, 189, 248);    // #38bdf8

pub const TEXT_PRIMARY_DARK: Color32 = Color32::from_rgb(244, 244, 245);
pub const TEXT_MUTED_DARK: Color32 = Color32::from_rgb(161, 161, 170);

pub fn apply_theme(ctx: &egui::Context, dark_mode: bool) {
    let mut style = (*ctx.style()).clone();
    style.spacing.item_spacing = egui::vec2(10.0, 10.0);
    style.spacing.button_padding = egui::vec2(12.0, 7.0);
    style.spacing.window_margin = egui::Margin::same(16);

    let mut visuals = if dark_mode {
        Visuals::dark()
    } else {
        Visuals::light()
    };

    let radius = CornerRadius::same(10);
    let btn_radius = CornerRadius::same(8);

    visuals.window_corner_radius = radius;
    visuals.menu_corner_radius = btn_radius;

    if dark_mode {
        visuals.panel_fill = BG_DARK;
        visuals.window_fill = SURFACE_DARK;
        visuals.extreme_bg_color = Color32::from_rgb(6, 6, 8);
        visuals.faint_bg_color = SURFACE_DARK;
        visuals.override_text_color = Some(TEXT_PRIMARY_DARK);

        visuals.widgets.noninteractive.bg_fill = CARD_DARK;
        visuals.widgets.noninteractive.weak_bg_fill = CARD_DARK;
        visuals.widgets.noninteractive.bg_stroke = Stroke::new(1.0_f32, BORDER_DARK);
        visuals.widgets.noninteractive.fg_stroke = Stroke::new(1.0_f32, TEXT_PRIMARY_DARK);
        visuals.widgets.noninteractive.corner_radius = radius;

        visuals.widgets.inactive.bg_fill = CARD_DARK;
        visuals.widgets.inactive.weak_bg_fill = CARD_DARK;
        visuals.widgets.inactive.bg_stroke = Stroke::new(1.0_f32, BORDER_DARK);
        visuals.widgets.inactive.fg_stroke = Stroke::new(1.0_f32, TEXT_PRIMARY_DARK);
        visuals.widgets.inactive.corner_radius = btn_radius;

        visuals.widgets.hovered.bg_fill = Color32::from_rgb(32, 32, 38);
        visuals.widgets.hovered.weak_bg_fill = Color32::from_rgb(32, 32, 38);
        visuals.widgets.hovered.bg_stroke = Stroke::new(1.0_f32, ACCENT_EMERALD);
        visuals.widgets.hovered.fg_stroke = Stroke::new(1.0_f32, Color32::WHITE);
        visuals.widgets.hovered.corner_radius = btn_radius;

        visuals.widgets.active.bg_fill = ACCENT_EMERALD;
        visuals.widgets.active.weak_bg_fill = ACCENT_EMERALD;
        visuals.widgets.active.bg_stroke = Stroke::new(1.0_f32, ACCENT_EMERALD);
        visuals.widgets.active.fg_stroke = Stroke::new(1.0_f32, Color32::BLACK);
        visuals.widgets.active.corner_radius = btn_radius;

        visuals.selection.bg_fill = Color32::from_rgba_unmultiplied(16, 185, 129, 55);
        visuals.selection.stroke = Stroke::new(1.0_f32, ACCENT_EMERALD);
    } else {
        visuals.panel_fill = Color32::from_rgb(248, 250, 252);
        visuals.window_fill = Color32::WHITE;
        visuals.widgets.noninteractive.corner_radius = radius;
        visuals.widgets.inactive.corner_radius = btn_radius;
        visuals.widgets.hovered.corner_radius = btn_radius;
        visuals.widgets.active.corner_radius = btn_radius;
        visuals.selection.bg_fill = Color32::from_rgba_unmultiplied(16, 185, 129, 45);
        visuals.selection.stroke = Stroke::new(1.0_f32, ACCENT_EMERALD);
    }

    style.visuals = visuals;
    ctx.set_style(style);
}
