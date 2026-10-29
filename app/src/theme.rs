//! SubRadar v1.0 — 3 Katmanlı Tasarım Token Mimarisi (`theme.rs`)
//! Layer 1: Primitive Tokens -> Layer 2: Semantic Tokens -> Layer 3: Component Tokens

use eframe::egui::{self, Color32, CornerRadius, Stroke, Visuals};

/// Layer 1: Primitive Color & Spacing Tokens
pub mod primitives {
    use eframe::egui::Color32;

    // Zinc Neutral Scale
    pub const ZINC_950: Color32 = Color32::from_rgb(9, 9, 11);     // #09090b
    pub const ZINC_925: Color32 = Color32::from_rgb(11, 11, 14);   // #0b0b0e
    pub const ZINC_900: Color32 = Color32::from_rgb(17, 17, 20);   // #111114
    pub const ZINC_850: Color32 = Color32::from_rgb(22, 22, 26);   // #16161a
    pub const ZINC_800: Color32 = Color32::from_rgb(31, 31, 36);   // #1f1f24
    pub const ZINC_700: Color32 = Color32::from_rgb(44, 44, 52);   // #2c2c34
    pub const ZINC_600: Color32 = Color32::from_rgb(63, 63, 70);   // #3f3f46
    pub const ZINC_500: Color32 = Color32::from_rgb(113, 113, 122);// #71717a
    pub const ZINC_400: Color32 = Color32::from_rgb(161, 161, 170);// #a1a1aa
    pub const ZINC_300: Color32 = Color32::from_rgb(212, 212, 216);// #d4d4d8
    pub const ZINC_200: Color32 = Color32::from_rgb(228, 228, 231);// #e4e4e7
    pub const ZINC_100: Color32 = Color32::from_rgb(244, 244, 245);// #f4f4f5
    pub const ZINC_50: Color32 = Color32::from_rgb(250, 250, 250); // #fafafa
    pub const WHITE: Color32 = Color32::from_rgb(255, 255, 255);

    // Brand & Semantic Status Primitives
    pub const EMERALD_500: Color32 = Color32::from_rgb(16, 185, 129); // #10b981
    pub const EMERALD_600: Color32 = Color32::from_rgb(5, 150, 105);  // #059669
    pub const AMBER_500: Color32 = Color32::from_rgb(245, 158, 11);   // #f59e0b
    pub const ROSE_500: Color32 = Color32::from_rgb(239, 68, 68);     // #ef4444
    pub const SKY_400: Color32 = Color32::from_rgb(56, 189, 248);    // #38bdf8
    pub const PURPLE_400: Color32 = Color32::from_rgb(192, 132, 252); // #c084fc

    // Consistent 4/8/12/16/24px Spacing Rhythm
    pub const SPACE_1: f32 = 4.0;
    pub const SPACE_2: f32 = 8.0;
    pub const SPACE_3: f32 = 12.0;
    pub const SPACE_4: f32 = 16.0;
    pub const SPACE_6: f32 = 24.0;
}

// Backward-compatible semantic aliases
pub const BG_MAIN: Color32 = primitives::ZINC_950;
pub const BG_HEADER: Color32 = primitives::ZINC_925;
pub const BG_SIDEBAR: Color32 = Color32::from_rgb(8, 8, 10);
pub const SURFACE_DARK: Color32 = primitives::ZINC_900;
pub const CARD_DARK: Color32 = primitives::ZINC_850;
pub const BORDER_SUBTLE: Color32 = primitives::ZINC_800;
pub const BORDER_DARK: Color32 = primitives::ZINC_700;

pub const LIGHT_BTN_BG: Color32 = primitives::ZINC_200;
pub const LIGHT_BTN_HOVER: Color32 = primitives::WHITE;
pub const DARK_TEXT: Color32 = primitives::ZINC_950;

pub const ACCENT_EMERALD: Color32 = primitives::EMERALD_500;
pub const ACCENT_AMBER: Color32 = primitives::AMBER_500;
pub const ACCENT_ROSE: Color32 = primitives::ROSE_500;
pub const ACCENT_BLUE: Color32 = primitives::SKY_400;
pub const ACCENT_PURPLE: Color32 = primitives::PURPLE_400;

pub const TEXT_WHITE: Color32 = primitives::ZINC_100;
pub const TEXT_SECONDARY: Color32 = primitives::ZINC_400;
pub const TEXT_MUTED_DARK: Color32 = primitives::ZINC_500;
pub const TEXT_DIM: Color32 = Color32::from_rgb(82, 82, 91);

/// Layer 2 & 3: Semantic & Component Token Palette (Dark & Light Mode)
#[derive(Debug, Clone, Copy)]
pub struct ThemePalette {
    // Semantic Surface Tokens
    pub bg_canvas: Color32,
    pub bg_header: Color32,
    pub bg_sidebar: Color32,
    pub bg_surface: Color32,
    pub bg_elevated: Color32,
    pub border_subtle: Color32,
    pub border_default: Color32,

    // Semantic Typography Tokens
    pub text_primary: Color32,
    pub text_secondary: Color32,
    pub text_muted: Color32,
    pub text_dim: Color32,

    // Semantic Status Tokens
    pub accent_emerald: Color32,
    pub accent_amber: Color32,
    pub accent_rose: Color32,
    pub accent_sky: Color32,

    // Component Tokens
    pub cta_bg: Color32,
    pub cta_hover: Color32,
    pub cta_fg: Color32,
    pub nav_active_bg: Color32,
    pub nav_active_border: Color32,
    pub nav_hover_bg: Color32,
    pub badge_passive_bg: Color32,
    pub badge_passive_border: Color32,
    pub badge_active_bg: Color32,
    pub badge_active_border: Color32,
    pub search_bg: Color32,
    pub search_border: Color32,
}

impl ThemePalette {
    pub fn for_mode(dark_mode: bool) -> Self {
        if dark_mode {
            Self::dark()
        } else {
            Self::light()
        }
    }

    pub fn dark() -> Self {
        use primitives::*;
        Self {
            bg_canvas: ZINC_950,
            bg_header: ZINC_925,
            bg_sidebar: Color32::from_rgb(8, 8, 10),
            bg_surface: ZINC_900,
            bg_elevated: ZINC_850,
            border_subtle: ZINC_800,
            border_default: ZINC_700,
            text_primary: ZINC_100,
            text_secondary: ZINC_400,
            text_muted: ZINC_500,
            text_dim: Color32::from_rgb(82, 82, 91),
            accent_emerald: EMERALD_500,
            accent_amber: AMBER_500,
            accent_rose: ROSE_500,
            accent_sky: SKY_400,
            cta_bg: ZINC_200,
            cta_hover: WHITE,
            cta_fg: ZINC_950,
            nav_active_bg: Color32::from_rgb(26, 26, 31),
            nav_active_border: Color32::from_rgb(42, 42, 50),
            nav_hover_bg: Color32::from_rgb(18, 18, 22),
            badge_passive_bg: Color32::from_rgb(28, 28, 35),
            badge_passive_border: Color32::from_rgb(44, 44, 54),
            badge_active_bg: Color32::from_rgb(15, 15, 19),
            badge_active_border: Color32::from_rgb(36, 36, 44),
            search_bg: Color32::from_rgb(16, 16, 20),
            search_border: Color32::from_rgb(34, 34, 42),
        }
    }

    pub fn light() -> Self {
        use primitives::*;
        Self {
            bg_canvas: ZINC_50,
            bg_header: WHITE,
            bg_sidebar: Color32::from_rgb(244, 244, 246),
            bg_surface: WHITE,
            bg_elevated: Color32::from_rgb(240, 240, 243),
            border_subtle: Color32::from_rgb(224, 224, 230),
            border_default: Color32::from_rgb(200, 200, 210),
            text_primary: ZINC_950,
            text_secondary: Color32::from_rgb(63, 63, 70),
            text_muted: Color32::from_rgb(100, 100, 110),
            text_dim: Color32::from_rgb(130, 130, 140),
            accent_emerald: EMERALD_600,
            accent_amber: AMBER_500,
            accent_rose: ROSE_500,
            accent_sky: Color32::from_rgb(14, 165, 233),
            cta_bg: ZINC_950,
            cta_hover: ZINC_800,
            cta_fg: WHITE,
            nav_active_bg: WHITE,
            nav_active_border: Color32::from_rgb(205, 205, 215),
            nav_hover_bg: Color32::from_rgb(234, 234, 240),
            badge_passive_bg: Color32::from_rgb(236, 236, 242),
            badge_passive_border: Color32::from_rgb(208, 208, 216),
            badge_active_bg: Color32::from_rgb(245, 245, 248),
            badge_active_border: Color32::from_rgb(218, 218, 224),
            search_bg: Color32::from_rgb(242, 242, 245),
            search_border: Color32::from_rgb(212, 212, 220),
        }
    }
}

pub fn apply_theme(ctx: &egui::Context, dark_mode: bool) {
    let pal = ThemePalette::for_mode(dark_mode);
    let mut style = (*ctx.style()).clone();
    style.spacing.item_spacing = egui::vec2(primitives::SPACE_2, primitives::SPACE_2);
    style.spacing.button_padding = egui::vec2(primitives::SPACE_3, 6.0);
    style.spacing.window_margin = egui::Margin::same(0);

    let mut visuals = if dark_mode {
        Visuals::dark()
    } else {
        Visuals::light()
    };
    let radius = CornerRadius::same(8);

    visuals.window_corner_radius = CornerRadius::same(12);
    visuals.menu_corner_radius = radius;
    visuals.panel_fill = pal.bg_canvas;
    visuals.window_fill = pal.bg_canvas;
    visuals.extreme_bg_color = pal.bg_sidebar;
    visuals.faint_bg_color = pal.bg_surface;
    visuals.override_text_color = Some(pal.text_primary);

    visuals.widgets.noninteractive.bg_fill = pal.bg_elevated;
    visuals.widgets.noninteractive.weak_bg_fill = pal.bg_elevated;
    visuals.widgets.noninteractive.bg_stroke = Stroke::new(1.0_f32, pal.border_subtle);
    visuals.widgets.noninteractive.fg_stroke = Stroke::new(1.0_f32, pal.text_primary);
    visuals.widgets.noninteractive.corner_radius = radius;

    visuals.widgets.inactive.bg_fill = pal.bg_elevated;
    visuals.widgets.inactive.weak_bg_fill = pal.bg_elevated;
    visuals.widgets.inactive.bg_stroke = Stroke::new(1.0_f32, pal.border_default);
    visuals.widgets.inactive.fg_stroke = Stroke::new(1.0_f32, pal.text_primary);
    visuals.widgets.inactive.corner_radius = radius;

    visuals.widgets.hovered.bg_fill = pal.nav_hover_bg;
    visuals.widgets.hovered.weak_bg_fill = pal.nav_hover_bg;
    visuals.widgets.hovered.bg_stroke = Stroke::new(1.0_f32, pal.text_muted);
    visuals.widgets.hovered.fg_stroke = Stroke::new(1.0_f32, pal.text_primary);
    visuals.widgets.hovered.corner_radius = radius;

    visuals.widgets.active.bg_fill = pal.cta_bg;
    visuals.widgets.active.weak_bg_fill = pal.cta_bg;
    visuals.widgets.active.bg_stroke = Stroke::new(1.0_f32, pal.cta_bg);
    visuals.widgets.active.fg_stroke = Stroke::new(1.0_f32, pal.cta_fg);
    visuals.widgets.active.corner_radius = radius;

    visuals.selection.bg_fill = pal.nav_active_bg;
    visuals.selection.stroke = Stroke::new(1.0_f32, pal.accent_emerald);

    style.visuals = visuals;
    ctx.set_style(style);
}
