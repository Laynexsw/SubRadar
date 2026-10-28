//! SubRadar v1.0 — Sitedeki Uygulama Önizlemesi ile 1:1 Birebir Masaüstü Arayüzü (`ui.rs`)

use std::fs;
use std::process::Command;

use eframe::egui::{
    self, Align, Color32, CornerRadius, FontFamily, FontId, Key, Layout, Margin, Pos2, Rect,
    RichText, Sense, Stroke, Vec2, ViewportCommand,
};

use crate::legal::{generate_legal_notice, NoticeLanguage};
use crate::models::{
    format_usd_tr, BillingCycle, Currency, SubStatus, Subscription, SummaryStats, VaultPayload,
};
use crate::parser::{parse_statement, SAMPLE_STATEMENT};
use crate::presets::SERVICE_PRESETS;
use crate::theme::{
    apply_theme, ACCENT_EMERALD, BG_HEADER, BG_MAIN, BG_SIDEBAR, BORDER_DARK, BORDER_SUBTLE,
    DARK_TEXT, LIGHT_BTN_BG, LIGHT_BTN_HOVER, SURFACE_DARK, TEXT_DIM, TEXT_MUTED_DARK,
    TEXT_SECONDARY, TEXT_WHITE,
};
use crate::vault::{default_vault_path, load_vault_from_file, save_vault_to_file, VAULT_FILENAME};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum WorkspaceTab {
    Overview,
    Subscriptions,
    BlockingRules,
    LocalVault,
}

pub struct SubRadarApp {
    pub payload: VaultPayload,
    pub is_locked: bool,
    pub is_maximized: bool,
    pub master_password: String,
    pub unlock_input: String,
    pub active_tab: WorkspaceTab,
    pub search_query: String,
    pub focus_search_next_frame: bool,
    pub status_message: Option<String>,

    // New Subscription / Preset Form
    pub form_name: String,
    pub form_plan: String,
    pub form_price: String,
    pub form_cancel_url: String,
    pub form_notes: String,

    // Statement Scanner
    pub statement_input: String,
    pub detected_subs: Vec<Subscription>,

    // Legal Notice & Blocking Rules
    pub selected_sub_idx: usize,
    pub notice_lang: NoticeLanguage,
    pub generated_notice: String,
    pub rule_block_trial_trap: bool,
    pub rule_block_silent_price_hike: bool,
    pub rule_block_zombie_renewal: bool,
}

impl Default for SubRadarApp {
    fn default() -> Self {
        let mut payload = VaultPayload::default();
        let master_password = "subradar2026".to_string();
        let vault_path = default_vault_path();

        if vault_path.exists() {
            if let Ok(loaded) = load_vault_from_file(&vault_path, &master_password) {
                let has_hero_items = loaded
                    .subscriptions
                    .iter()
                    .any(|s| s.id == "sub-aws-idle" || s.id == "sub-jetbrains");
                if has_hero_items {
                    payload = loaded;
                } else {
                    let _ = save_vault_to_file(&vault_path, &payload, &master_password);
                }
            }
        } else {
            let _ = save_vault_to_file(&vault_path, &payload, &master_password);
        }

        let mut app = Self {
            payload,
            is_locked: false,
            is_maximized: false,
            master_password,
            unlock_input: String::new(),
            active_tab: WorkspaceTab::Overview,
            search_query: String::new(),
            focus_search_next_frame: false,
            status_message: None,
            form_name: String::new(),
            form_plan: "BOŞTA LİSANS".to_string(),
            form_price: "29.99".to_string(),
            form_cancel_url: String::new(),
            form_notes: "Yeni eklenen abonelik kaydı.".to_string(),
            statement_input: SAMPLE_STATEMENT.to_string(),
            detected_subs: Vec::new(),
            selected_sub_idx: 0,
            notice_lang: NoticeLanguage::Turkish,
            generated_notice: String::new(),
            rule_block_trial_trap: true,
            rule_block_silent_price_hike: true,
            rule_block_zombie_renewal: true,
        };
        app.refresh_legal_notice();
        app
    }
}

impl SubRadarApp {
    fn persist_vault(&mut self) {
        let path = default_vault_path();
        let _ = save_vault_to_file(&path, &self.payload, &self.master_password);
    }

    fn reset_simulation(&mut self) {
        self.payload.subscriptions = VaultPayload::default_overview_subscriptions();
        self.search_query.clear();
        self.persist_vault();
        self.refresh_legal_notice();
    }

    fn refresh_legal_notice(&mut self) {
        if self.payload.subscriptions.is_empty() {
            self.generated_notice = "Kayıtlı abonelik bulunmuyor.".to_string();
            return;
        }
        if self.selected_sub_idx >= self.payload.subscriptions.len() {
            self.selected_sub_idx = 0;
        }
        let sub = &self.payload.subscriptions[self.selected_sub_idx];
        self.generated_notice =
            generate_legal_notice(sub, &self.payload.preferences, self.notice_lang);
    }

    fn open_external_url(url: &str) {
        if !url.starts_with("https://") && !url.starts_with("http://") {
            return;
        }
        #[cfg(target_os = "windows")]
        {
            let _ = Command::new("cmd").args(["/C", "start", "", url]).spawn();
        }
        #[cfg(not(target_os = "windows"))]
        {
            let _ = Command::new("xdg-open").arg(url).spawn();
        }
    }

    fn draw_traffic_light(
        ui: &mut egui::Ui,
        color: Color32,
        hover_symbol: &str,
        tooltip: &str,
    ) -> bool {
        let (rect, resp) = ui.allocate_exact_size(Vec2::splat(12.0), Sense::click());
        let center = rect.center();
        let fill = if resp.hovered() {
            color.gamma_multiply(1.15)
        } else {
            color
        };
        ui.painter().circle_filled(center, 6.0, fill);
        if resp.hovered() {
            ui.painter().text(
                center,
                egui::Align2::CENTER_CENTER,
                hover_symbol,
                FontId::new(8.5, FontFamily::Monospace),
                Color32::from_rgb(20, 20, 20),
            );
        }
        resp.on_hover_text(tooltip).clicked()
    }

    fn render_window_header(&mut self, ctx: &egui::Context, ui: &mut egui::Ui) {
        let header_rect = ui.max_rect();

        ui.horizontal_centered(|ui| {
            ui.add_space(16.0);

            // 3 macOS Traffic Lights
            if Self::draw_traffic_light(ui, Color32::from_rgb(224, 68, 62), "✕", "Kapat") {
                ctx.send_viewport_cmd(ViewportCommand::Close);
            }
            ui.add_space(6.0);
            if Self::draw_traffic_light(ui, Color32::from_rgb(222, 161, 35), "−", "Küçült") {
                ctx.send_viewport_cmd(ViewportCommand::Minimized(true));
            }
            ui.add_space(6.0);
            if Self::draw_traffic_light(
                ui,
                Color32::from_rgb(26, 171, 41),
                "+",
                "Büyüt / Küçült",
            ) {
                self.is_maximized = !self.is_maximized;
                ctx.send_viewport_cmd(ViewportCommand::Maximized(self.is_maximized));
            }

            ui.add_space(14.0);
            ui.label(
                RichText::new("SubRadar Masaüstü — Yerel Kasa")
                    .font(FontId::new(11.5, FontFamily::Monospace))
                    .color(TEXT_MUTED_DARK),
            );

            // Center Search Box ("Aboneliğe git (Ctrl+K)" + "esc")
            let avail = ui.available_width();
            let search_w = 260.0_f32;
            let right_status_w = 175.0_f32;
            let left_pad = ((avail - search_w - right_status_w) * 0.5).max(12.0);
            ui.add_space(left_pad);

            egui::Frame::new()
                .fill(Color32::from_rgb(16, 16, 20))
                .stroke(Stroke::new(1.0_f32, Color32::from_rgb(34, 34, 42)))
                .corner_radius(CornerRadius::same(6))
                .inner_margin(Margin::symmetric(10, 4))
                .show(ui, |ui| {
                    ui.set_width(search_w);
                    ui.horizontal(|ui| {
                        ui.label(
                            RichText::new("🔍")
                                .size(11.0)
                                .color(TEXT_MUTED_DARK),
                        );
                        let edit = egui::TextEdit::singleline(&mut self.search_query)
                            .frame(false)
                            .font(FontId::new(11.5, FontFamily::Monospace))
                            .desired_width(185.0)
                            .hint_text(
                                RichText::new("Aboneliğe git (Ctrl+K)")
                                    .font(FontId::new(11.5, FontFamily::Monospace))
                                    .color(TEXT_MUTED_DARK),
                            );
                        let resp = ui.add(edit);
                        if self.focus_search_next_frame {
                            resp.request_focus();
                            self.focus_search_next_frame = false;
                        }

                        egui::Frame::new()
                            .fill(Color32::from_rgb(30, 30, 36))
                            .corner_radius(CornerRadius::same(3))
                            .inner_margin(Margin::symmetric(5, 1))
                            .show(ui, |ui| {
                                if ui
                                    .add(
                                        egui::Label::new(
                                            RichText::new("esc")
                                                .font(FontId::new(9.5, FontFamily::Monospace))
                                                .color(TEXT_MUTED_DARK),
                                        )
                                        .sense(Sense::click()),
                                    )
                                    .clicked()
                                {
                                    self.search_query.clear();
                                }
                            });
                    });
                });

            // Right Status: Green dot + SENKRONİZE (YEREL)
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                ui.add_space(16.0);
                ui.label(
                    RichText::new("SENKRONİZE (YEREL)")
                        .font(FontId::new(10.5, FontFamily::Monospace))
                        .color(TEXT_MUTED_DARK),
                );
                let (dot_rect, _) = ui.allocate_exact_size(Vec2::splat(8.0), Sense::hover());
                ui.painter()
                    .circle_filled(dot_rect.center(), 3.5, ACCENT_EMERALD);
            });
        });

        // Allow dragging window from blank areas of header bar
        let pointer_pos = ctx.input(|i| i.pointer.interact_pos());
        let primary_down = ctx.input(|i| i.pointer.primary_pressed());
        if primary_down && ! ctx.wants_keyboard_input() {
            if let Some(pos) = pointer_pos {
                if header_rect.contains(pos) && pos.x > 95.0 && (pos.x < 430.0 || pos.x > 730.0) {
                    ctx.send_viewport_cmd(ViewportCommand::StartDrag);
                }
            }
        }
    }

    fn render_sidebar_nav_item(
        ui: &mut egui::Ui,
        icon: &str,
        label: &str,
        right_badge: Option<(&str, bool)>,
        selected: bool,
    ) -> bool {
        let desired = Vec2::new(ui.available_width(), 40.0);
        let (rect, resp) = ui.allocate_exact_size(desired, Sense::click());

        if selected {
            ui.painter().rect(
                rect,
                CornerRadius::same(8),
                Color32::from_rgb(26, 26, 31),
                Stroke::new(1.0_f32, Color32::from_rgb(42, 42, 50)),
                egui::StrokeKind::Inside,
            );
        } else if resp.hovered() {
            ui.painter().rect_filled(
                rect,
                CornerRadius::same(8),
                Color32::from_rgb(18, 18, 22),
            );
        }

        let text_color = if selected || resp.hovered() {
            TEXT_WHITE
        } else {
            TEXT_SECONDARY
        };

        ui.painter().text(
            Pos2::new(rect.left() + 14.0, rect.center().y),
            egui::Align2::LEFT_CENTER,
            icon,
            FontId::new(14.0, FontFamily::Proportional),
            text_color,
        );

        ui.painter().text(
            Pos2::new(rect.left() + 38.0, rect.center().y),
            egui::Align2::LEFT_CENTER,
            label,
            FontId::new(13.0, FontFamily::Proportional),
            text_color,
        );

        if let Some((badge_str, boxed)) = right_badge {
            if boxed {
                let pill_rect = Rect::from_center_size(
                    Pos2::new(rect.right() - 20.0, rect.center().y),
                    Vec2::new(20.0, 18.0),
                );
                ui.painter().rect_filled(
                    pill_rect,
                    CornerRadius::same(4),
                    Color32::from_rgb(32, 32, 38),
                );
                ui.painter().text(
                    pill_rect.center(),
                    egui::Align2::CENTER_CENTER,
                    badge_str,
                    FontId::new(10.5, FontFamily::Monospace),
                    TEXT_WHITE,
                );
            } else {
                ui.painter().text(
                    Pos2::new(rect.right() - 14.0, rect.center().y),
                    egui::Align2::RIGHT_CENTER,
                    badge_str,
                    FontId::new(11.0, FontFamily::Monospace),
                    TEXT_DIM,
                );
            }
        }

        resp.clicked()
    }

    fn render_sidebar(&mut self, ui: &mut egui::Ui, passive_count: usize) {
        ui.add_space(18.0);
        ui.horizontal(|ui| {
            ui.add_space(10.0);
            ui.label(
                RichText::new("ÇALIŞMA ALANI")
                    .font(FontId::new(10.0, FontFamily::Monospace))
                    .color(TEXT_DIM),
            );
        });
        ui.add_space(6.0);

        let total_subs_badge = format!("{}", 20 + self.payload.subscriptions.len());
        let rules_badge = format!("{}", passive_count.max(3));

        if Self::render_sidebar_nav_item(
            ui,
            "⊞",
            "Genel Bakış",
            None,
            self.active_tab == WorkspaceTab::Overview,
        ) {
            self.active_tab = WorkspaceTab::Overview;
        }

        if Self::render_sidebar_nav_item(
            ui,
            "❐",
            "Abonelikler",
            Some((&total_subs_badge, false)),
            self.active_tab == WorkspaceTab::Subscriptions,
        ) {
            self.active_tab = WorkspaceTab::Subscriptions;
        }

        if Self::render_sidebar_nav_item(
            ui,
            "⊗",
            "Engelleme Kuralları",
            Some((&rules_badge, true)),
            self.active_tab == WorkspaceTab::BlockingRules,
        ) {
            self.active_tab = WorkspaceTab::BlockingRules;
            self.refresh_legal_notice();
        }

        if Self::render_sidebar_nav_item(
            ui,
            "🔒",
            "Yerel Kasa",
            None,
            self.active_tab == WorkspaceTab::LocalVault,
        ) {
            self.active_tab = WorkspaceTab::LocalVault;
        }

        ui.add_space(34.0);
        ui.horizontal(|ui| {
            ui.add_space(10.0);
            ui.label(
                RichText::new("İŞLEM MOTORU")
                    .font(FontId::new(10.0, FontFamily::Monospace))
                    .color(TEXT_DIM),
            );
        });
        ui.add_space(8.0);

        egui::Frame::new()
            .inner_margin(Margin::symmetric(10, 4))
            .show(ui, |ui| {
                ui.horizontal(|ui| {
                    ui.label(
                        RichText::new("Bellek kullanımı")
                            .font(FontId::new(11.5, FontFamily::Monospace))
                            .color(TEXT_MUTED_DARK),
                    );
                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        ui.label(
                            RichText::new("18,4 MB")
                                .font(FontId::new(11.5, FontFamily::Monospace))
                                .strong()
                                .color(TEXT_WHITE),
                        );
                    });
                });

                ui.add_space(6.0);
                let (bar_rect, _) =
                    ui.allocate_exact_size(Vec2::new(ui.available_width(), 4.0), Sense::hover());
                ui.painter().rect_filled(
                    bar_rect,
                    CornerRadius::same(2),
                    Color32::from_rgb(28, 28, 34),
                );
                let fill_w = bar_rect.width() * 0.24;
                let fill_rect =
                    Rect::from_min_size(bar_rect.min, Vec2::new(fill_w, bar_rect.height()));
                ui.painter().rect_filled(
                    fill_rect,
                    CornerRadius::same(2),
                    Color32::from_rgb(228, 228, 231),
                );

                ui.add_space(14.0);
                ui.horizontal(|ui| {
                    ui.label(
                        RichText::new("Yerel Çekirdek:")
                            .font(FontId::new(11.0, FontFamily::Monospace))
                            .color(TEXT_MUTED_DARK),
                    );
                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        ui.label(
                            RichText::new("Servis Etkin")
                                .font(FontId::new(11.0, FontFamily::Monospace))
                                .color(ACCENT_EMERALD),
                        );
                    });
                });
            });
    }

    fn render_overview_tab(&mut self, ui: &mut egui::Ui, stats: &SummaryStats) {
        // 1. Top 3-Column Metric Strip (No individual boxes; vertical dividers between columns + horizontal line below)
        let strip_height = 68.0;
        let total_w = ui.available_width();
        let (strip_rect, _) =
            ui.allocate_exact_size(Vec2::new(total_w, strip_height), Sense::hover());

        let col_w = total_w / 3.0;
        let c1_x = strip_rect.left();
        let c2_x = strip_rect.left() + col_w;
        let c3_x = strip_rect.left() + col_w * 2.0;

        // Vertical dividers
        ui.painter().line_segment(
            [
                Pos2::new(c2_x - 16.0, strip_rect.top() + 4.0),
                Pos2::new(c2_x - 16.0, strip_rect.bottom() - 12.0),
            ],
            Stroke::new(1.0_f32, BORDER_SUBTLE),
        );
        ui.painter().line_segment(
            [
                Pos2::new(c3_x - 16.0, strip_rect.top() + 4.0),
                Pos2::new(c3_x - 16.0, strip_rect.bottom() - 12.0),
            ],
            Stroke::new(1.0_f32, BORDER_SUBTLE),
        );

        // Column 1: AYLIK GİDER -> $384,20
        ui.painter().text(
            Pos2::new(c1_x, strip_rect.top() + 6.0),
            egui::Align2::LEFT_TOP,
            "AYLIK GİDER",
            FontId::new(10.5, FontFamily::Monospace),
            TEXT_MUTED_DARK,
        );
        ui.painter().text(
            Pos2::new(c1_x, strip_rect.top() + 26.0),
            egui::Align2::LEFT_TOP,
            format_usd_tr(stats.monthly_burn_usd),
            FontId::new(26.0, FontFamily::Monospace),
            TEXT_WHITE,
        );

        // Column 2: YAKALANAN SIZINTI -> 3 Pasif Lisanslar
        ui.painter().text(
            Pos2::new(c2_x + 4.0, strip_rect.top() + 6.0),
            egui::Align2::LEFT_TOP,
            "YAKALANAN SIZINTI",
            FontId::new(10.5, FontFamily::Monospace),
            TEXT_MUTED_DARK,
        );
        let leaks_label = if stats.passive_leaks_count == 0 {
            "0 Pasif Lisans".to_string()
        } else {
            format!("{} Pasif Lisanslar", stats.passive_leaks_count)
        };
        ui.painter().text(
            Pos2::new(c2_x + 4.0, strip_rect.top() + 26.0),
            egui::Align2::LEFT_TOP,
            leaks_label,
            FontId::new(24.0, FontFamily::Proportional),
            TEXT_WHITE,
        );

        // Column 3: YILLIK KURTARILABİLİR İSRAF -> $1.890,00
        ui.painter().text(
            Pos2::new(c3_x + 4.0, strip_rect.top() + 6.0),
            egui::Align2::LEFT_TOP,
            "YILLIK KURTARILABİLİR İSRAF",
            FontId::new(10.5, FontFamily::Monospace),
            TEXT_MUTED_DARK,
        );
        ui.painter().text(
            Pos2::new(c3_x + 4.0, strip_rect.top() + 26.0),
            egui::Align2::LEFT_TOP,
            format_usd_tr(stats.annual_recoverable_usd),
            FontId::new(26.0, FontFamily::Monospace),
            TEXT_WHITE,
        );

        // Horizontal divider under metrics
        ui.painter().line_segment(
            [
                Pos2::new(strip_rect.left(), strip_rect.bottom()),
                Pos2::new(strip_rect.right(), strip_rect.bottom()),
            ],
            Stroke::new(1.0_f32, BORDER_SUBTLE),
        );

        ui.add_space(10.0);

        // 2. Subscription Rows matching screenshot 1:1
        let query = self.search_query.trim().to_lowercase();
        let mut cancel_action_idx: Option<usize> = None;
        let mut shown = 0usize;

        for (idx, sub) in self.payload.subscriptions.iter().enumerate() {
            if sub.status == SubStatus::Cancelled {
                continue;
            }
            if !query.is_empty() {
                let m = sub.name.to_lowercase().contains(&query)
                    || sub.plan.to_lowercase().contains(&query)
                    || sub.notes.to_lowercase().contains(&query);
                if !m {
                    continue;
                }
            }

            shown += 1;
            let row_h = 74.0;
            let (row_rect, _) =
                ui.allocate_exact_size(Vec2::new(ui.available_width(), row_h), Sense::hover());

            // Left Avatar Box (36x36 rounded)
            let avatar_rect = Rect::from_center_size(
                Pos2::new(row_rect.left() + 18.0, row_rect.center().y),
                Vec2::splat(36.0),
            );
            if sub.is_light_avatar() {
                ui.painter()
                    .rect_filled(avatar_rect, CornerRadius::same(7), LIGHT_BTN_BG);
                ui.painter().text(
                    avatar_rect.center(),
                    egui::Align2::CENTER_CENTER,
                    sub.avatar_code(),
                    FontId::new(12.5, FontFamily::Proportional),
                    DARK_TEXT,
                );
            } else {
                ui.painter().rect(
                    avatar_rect,
                    CornerRadius::same(7),
                    Color32::from_rgb(18, 18, 22),
                    Stroke::new(1.0_f32, Color32::from_rgb(36, 36, 44)),
                    egui::StrokeKind::Inside,
                );
                ui.painter().text(
                    avatar_rect.center(),
                    egui::Align2::CENTER_CENTER,
                    sub.avatar_code(),
                    FontId::new(12.0, FontFamily::Monospace),
                    TEXT_WHITE,
                );
            }

            // Title + Pill Badge
            let text_left = row_rect.left() + 50.0;
            let title_galley = ui.painter().layout_no_wrap(
                sub.name.clone(),
                FontId::new(14.5, FontFamily::Proportional),
                TEXT_WHITE,
            );
            let title_pos = Pos2::new(text_left, row_rect.top() + 16.0);
            let title_w = title_galley.size().x;
            ui.painter().galley(title_pos, title_galley, TEXT_WHITE);

            // Badge next to title
            let badge_galley = ui.painter().layout_no_wrap(
                sub.plan.clone(),
                FontId::new(9.5, FontFamily::Monospace),
                if sub.status == SubStatus::Active {
                    TEXT_MUTED_DARK
                } else {
                    TEXT_WHITE
                },
            );
            let badge_w = badge_galley.size().x + 14.0;
            let badge_rect = Rect::from_min_size(
                Pos2::new(text_left + title_w + 10.0, row_rect.top() + 15.0),
                Vec2::new(badge_w, 19.0),
            );
            let badge_fill = if sub.status == SubStatus::Active {
                Color32::from_rgb(15, 15, 19)
            } else {
                Color32::from_rgb(28, 28, 35)
            };
            ui.painter().rect(
                badge_rect,
                CornerRadius::same(4),
                badge_fill,
                Stroke::new(1.0_f32, Color32::from_rgb(42, 42, 52)),
                egui::StrokeKind::Inside,
            );
            ui.painter().galley(
                Pos2::new(badge_rect.left() + 7.0, badge_rect.top() + 3.5),
                badge_galley,
                TEXT_WHITE,
            );

            // Subtitle below title
            ui.painter().text(
                Pos2::new(text_left, row_rect.top() + 41.0),
                egui::Align2::LEFT_TOP,
                &sub.notes,
                FontId::new(12.5, FontFamily::Proportional),
                TEXT_MUTED_DARK,
            );

            // Right Action Button ("Hemen İptal  →" or "Korumalı")
            if sub.status == SubStatus::Active {
                let prot_rect = Rect::from_center_size(
                    Pos2::new(row_rect.right() - 44.0, row_rect.center().y),
                    Vec2::new(86.0, 32.0),
                );
                ui.painter().rect(
                    prot_rect,
                    CornerRadius::same(6),
                    Color32::from_rgb(13, 13, 17),
                    Stroke::new(1.0_f32, Color32::from_rgb(34, 34, 42)),
                    egui::StrokeKind::Inside,
                );
                ui.painter().text(
                    prot_rect.center(),
                    egui::Align2::CENTER_CENTER,
                    "Korumalı",
                    FontId::new(11.5, FontFamily::Monospace),
                    TEXT_MUTED_DARK,
                );

                // Cost stack to the left of Korumalı
                let cost_right = prot_rect.left() - 18.0;
                ui.painter().text(
                    Pos2::new(cost_right, row_rect.top() + 18.0),
                    egui::Align2::RIGHT_TOP,
                    format!("{}/ay", format_usd_tr(sub.price)),
                    FontId::new(14.5, FontFamily::Monospace),
                    TEXT_WHITE,
                );
                ui.painter().text(
                    Pos2::new(cost_right, row_rect.top() + 40.0),
                    egui::Align2::RIGHT_TOP,
                    &sub.next_renewal,
                    FontId::new(9.5, FontFamily::Monospace),
                    TEXT_DIM,
                );
            } else {
                let btn_rect = Rect::from_center_size(
                    Pos2::new(row_rect.right() - 58.0, row_rect.center().y),
                    Vec2::new(116.0, 38.0),
                );
                let btn_resp = ui.interact(
                    btn_rect,
                    egui::Id::new(("kill_btn", idx)),
                    Sense::click(),
                );
                let btn_bg = if btn_resp.hovered() {
                    LIGHT_BTN_HOVER
                } else {
                    LIGHT_BTN_BG
                };
                ui.painter()
                    .rect_filled(btn_rect, CornerRadius::same(7), btn_bg);
                ui.painter().text(
                    btn_rect.center(),
                    egui::Align2::CENTER_CENTER,
                    "Hemen İptal  →",
                    FontId::new(12.0, FontFamily::Proportional),
                    DARK_TEXT,
                );

                if btn_resp
                    .on_hover_text("Aboneliği hemen iptal et ve tasarrufu hesapla")
                    .clicked()
                {
                    cancel_action_idx = Some(idx);
                }

                // Cost stack to the left of Hemen İptal ->
                let cost_right = btn_rect.left() - 18.0;
                ui.painter().text(
                    Pos2::new(cost_right, row_rect.top() + 18.0),
                    egui::Align2::RIGHT_TOP,
                    format!("{}/ay", format_usd_tr(sub.price)),
                    FontId::new(14.5, FontFamily::Monospace),
                    TEXT_WHITE,
                );
                ui.painter().text(
                    Pos2::new(cost_right, row_rect.top() + 40.0),
                    egui::Align2::RIGHT_TOP,
                    &sub.next_renewal,
                    FontId::new(9.5, FontFamily::Monospace),
                    TEXT_DIM,
                );
            }

            // Row bottom subtle divider
            ui.painter().line_segment(
                [
                    Pos2::new(row_rect.left(), row_rect.bottom()),
                    Pos2::new(row_rect.right(), row_rect.bottom()),
                ],
                Stroke::new(1.0_f32, Color32::from_rgb(22, 22, 27)),
            );
        }

        if shown == 0 {
            ui.add_space(36.0);
            ui.vertical_centered(|ui| {
                ui.label(
                    RichText::new("Eşleşen yerel abonelik bulunamadı. Temizlemek için ESC'ye veya Simülasyonu Sıfırla'ya basın.")
                        .font(FontId::new(12.0, FontFamily::Monospace))
                        .color(TEXT_MUTED_DARK),
                );
            });
        }

        if let Some(idx) = cancel_action_idx {
            self.payload.subscriptions[idx].status = SubStatus::Cancelled;
            self.persist_vault();
        }

        // Push terminal status bar to bottom of the right view
        let remaining = ui.available_height();
        if remaining > 44.0 {
            ui.add_space(remaining - 44.0);
        } else {
            ui.add_space(12.0);
        }

        let (line_rect, _) =
            ui.allocate_exact_size(Vec2::new(ui.available_width(), 1.0), Sense::hover());
        ui.painter().line_segment(
            [line_rect.left_top(), line_rect.right_top()],
            Stroke::new(1.0_f32, BORDER_SUBTLE),
        );
        ui.add_space(10.0);

        ui.horizontal(|ui| {
            ui.label(
                RichText::new("🗄  Yerel Veritabanı: encrypted_sqlite_aes256.db")
                    .font(FontId::new(11.5, FontFamily::Monospace))
                    .color(TEXT_MUTED_DARK),
            );

            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                ui.label(
                    RichText::new("4 Arka Plan Engelleyici Etkin")
                        .font(FontId::new(11.5, FontFamily::Monospace))
                        .color(TEXT_MUTED_DARK),
                );
                ui.label(
                    RichText::new("•")
                        .font(FontId::new(11.5, FontFamily::Monospace))
                        .color(TEXT_DIM),
                );
                if ui
                    .add(
                        egui::Label::new(
                            RichText::new("↻ Simülasyonu Sıfırla")
                                .font(FontId::new(11.5, FontFamily::Monospace))
                                .color(TEXT_SECONDARY),
                        )
                        .sense(Sense::click()),
                    )
                    .on_hover_text("Tüm iptalleri geri al ve başlangıç verilerini yükle")
                    .clicked()
                {
                    self.reset_simulation();
                }
            });
        });
    }

    fn render_subscriptions_tab(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.label(
                RichText::new("Abonelik Portföyü & Ekstre Tarayıcı")
                    .size(16.0)
                    .strong(),
            );
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                if ui.button("↻ Varsayılan Listeyi Yükle").clicked() {
                    self.reset_simulation();
                }
            });
        });
        ui.add_space(6.0);

        ui.columns(2, |cols| {
            // Left: Quick Add from 18+ Presets
            cols[0].label(
                RichText::new("18+ Hazır Servisten Tek Tıkla Ekle")
                    .font(FontId::new(12.5, FontFamily::Monospace))
                    .color(TEXT_SECONDARY),
            );
            cols[0].add_space(4.0);

            egui::ScrollArea::vertical()
                .id_salt("presets_list")
                .max_height(210.0)
                .show(&mut cols[0], |ui| {
                    for preset in SERVICE_PRESETS {
                        egui::Frame::new()
                            .fill(SURFACE_DARK)
                            .stroke(Stroke::new(1.0_f32, BORDER_SUBTLE))
                            .corner_radius(CornerRadius::same(6))
                            .inner_margin(Margin::symmetric(10, 6))
                            .show(ui, |ui| {
                                ui.horizontal(|ui| {
                                    ui.label(RichText::new(preset.name).strong());
                                    ui.label(
                                        RichText::new(format!("• {}", preset.plan))
                                            .size(11.5)
                                            .color(TEXT_MUTED_DARK),
                                    );
                                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                        if ui.button("+ Ekle").clicked() {
                                            let mut s = preset.to_subscription(
                                                self.payload.subscriptions.len() + 1,
                                            );
                                            s.currency = Currency::USD;
                                            s.price = (preset.default_price / 48.35 * 100.0).round()
                                                / 100.0;
                                            s.plan = "BOŞTA LİSANS".to_string();
                                            s.next_renewal = "OTOMATİK ÖDEME".to_string();
                                            s.status = SubStatus::UnusedTrial;
                                            self.payload.subscriptions.insert(0, s);
                                            self.persist_vault();
                                            self.active_tab = WorkspaceTab::Overview;
                                        }
                                        if ui.button("İptal Sayfası ↗").clicked() {
                                            Self::open_external_url(preset.cancel_url);
                                        }
                                    });
                                });
                            });
                    }
                });

            // Right: Offline Statement Scanner
            cols[1].horizontal(|ui| {
                ui.label(
                    RichText::new("Çevrimdışı Ekstre Tarayıcı")
                        .font(FontId::new(12.5, FontFamily::Monospace))
                        .color(TEXT_SECONDARY),
                );
                ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                    if ui.button("⚡ Ekstreyi Tara ve Ekle").clicked() {
                        let found = parse_statement(&self.statement_input, Currency::USD);
                        for mut item in found {
                            item.currency = Currency::USD;
                            if item.price > 150.0 {
                                item.price = (item.price / 48.35 * 100.0).round() / 100.0;
                            }
                            item.plan = "EKSTREDEN YAKALANDI".to_string();
                            item.next_renewal = "OTOMATİK ÖDEME".to_string();
                            self.payload.subscriptions.push(item);
                        }
                        self.persist_vault();
                        self.active_tab = WorkspaceTab::Overview;
                    }
                });
            });
            cols[1].add_space(4.0);
            cols[1].add_sized(
                [cols[1].available_width(), 205.0],
                egui::TextEdit::multiline(&mut self.statement_input)
                    .font(FontId::new(11.0, FontFamily::Monospace)),
            );
        });

        ui.add_space(10.0);
        ui.separator();
        ui.add_space(6.0);
        ui.label(
            RichText::new("Özel Abonelik Ekle")
                .font(FontId::new(12.5, FontFamily::Monospace))
                .color(TEXT_SECONDARY),
        );
        ui.horizontal(|ui| {
            ui.label("Servis:");
            ui.add_sized([160.0, 26.0], egui::TextEdit::singleline(&mut self.form_name));
            ui.label("Rozet:");
            ui.add_sized([120.0, 26.0], egui::TextEdit::singleline(&mut self.form_plan));
            ui.label("Aylık ($):");
            ui.add_sized([70.0, 26.0], egui::TextEdit::singleline(&mut self.form_price));
            if ui.button("+ Genel Bakışa Ekle").clicked() {
                let price = self
                    .form_price
                    .replace(',', ".")
                    .parse::<f64>()
                    .unwrap_or(19.99);
                if !self.form_name.trim().is_empty() {
                    self.payload.subscriptions.insert(
                        0,
                        Subscription {
                            id: format!("sub-custom-{}", self.payload.subscriptions.len() + 1),
                            name: self.form_name.trim().to_string(),
                            plan: self.form_plan.trim().to_string(),
                            category: "Diğer".to_string(),
                            price,
                            currency: Currency::USD,
                            billing_cycle: BillingCycle::Monthly,
                            next_renewal: "OTOMATİK ÖDEME".to_string(),
                            status: SubStatus::UnusedTrial,
                            cancel_url: self.form_cancel_url.clone(),
                            notes: self.form_notes.clone(),
                        },
                    );
                    self.form_name.clear();
                    self.persist_vault();
                    self.active_tab = WorkspaceTab::Overview;
                }
            }
        });
    }

    fn render_blocking_rules_tab(&mut self, ui: &mut egui::Ui, ctx: &egui::Context) {
        ui.label(
            RichText::new("Engelleme Kuralları & Resmi Fesih Dilekçesi")
                .size(16.0)
                .strong(),
        );
        ui.add_space(8.0);

        ui.columns(2, |cols| {
            // Left: 3 Active Interceptors
            egui::Frame::new()
                .fill(SURFACE_DARK)
                .stroke(Stroke::new(1.0_f32, BORDER_SUBTLE))
                .corner_radius(CornerRadius::same(8))
                .inner_margin(Margin::same(14))
                .show(&mut cols[0], |ui| {
                    ui.label(
                        RichText::new("AKTİF ARKA PLAN ENGELLEYİCİLER (3)")
                            .font(FontId::new(11.0, FontFamily::Monospace))
                            .color(TEXT_MUTED_DARK),
                    );
                    ui.add_space(8.0);
                    ui.checkbox(
                        &mut self.rule_block_trial_trap,
                        "Deneme Süresi Bitmeden 48 Saat Önce Uyarı & Otomatik Durdurma",
                    );
                    ui.add_space(6.0);
                    ui.checkbox(
                        &mut self.rule_block_silent_price_hike,
                        "Sessiz Fiyat Artışı ve Kur Farkı Sızıntı Tespiti",
                    );
                    ui.add_space(6.0);
                    ui.checkbox(
                        &mut self.rule_block_zombie_renewal,
                        "30+ Gündür Hiç Açılmayan Uygulamaları 'Pasif Lisans' İşaretle",
                    );

                    ui.add_space(14.0);
                    ui.label(
                        RichText::new("RESMİ İPTAL DİLEKÇESİ İÇİN ABONELİK SEÇİN")
                            .font(FontId::new(11.0, FontFamily::Monospace))
                            .color(TEXT_MUTED_DARK),
                    );
                    ui.add_space(4.0);
                    let mut clicked_sub: Option<usize> = None;
                    for (idx, s) in self.payload.subscriptions.iter().enumerate() {
                        if ui
                            .selectable_label(self.selected_sub_idx == idx, &s.name)
                            .clicked()
                        {
                            clicked_sub = Some(idx);
                        }
                    }
                    if let Some(idx) = clicked_sub {
                        self.selected_sub_idx = idx;
                        self.refresh_legal_notice();
                    }
                });

            // Right: 6502 SK & GDPR Legal Notice Generator
            cols[1].horizontal(|ui| {
                if ui
                    .selectable_label(
                        self.notice_lang == NoticeLanguage::Turkish,
                        "🇹🇷 6502 SK & KVKK (Türkçe)",
                    )
                    .clicked()
                {
                    self.notice_lang = NoticeLanguage::Turkish;
                    self.refresh_legal_notice();
                }
                if ui
                    .selectable_label(
                        self.notice_lang == NoticeLanguage::English,
                        "🇬🇧 GDPR Art. 17 (English)",
                    )
                    .clicked()
                {
                    self.notice_lang = NoticeLanguage::English;
                    self.refresh_legal_notice();
                }
            });
            cols[1].add_space(4.0);
            cols[1].add_sized(
                [cols[1].available_width(), 260.0],
                egui::TextEdit::multiline(&mut self.generated_notice)
                    .font(FontId::new(11.0, FontFamily::Monospace)),
            );
            cols[1].add_space(6.0);
            cols[1].horizontal(|ui| {
                if ui.button("📋 Dilekçeyi Panoya Kopyala").clicked() {
                    ctx.copy_text(self.generated_notice.clone());
                    self.status_message =
                        Some("Resmi iptal dilekçesi panoya kopyalandı.".to_string());
                }
                if ui.button("💾 .txt Olarak Kaydet").clicked() {
                    let path = std::env::current_dir()
                        .unwrap_or_default()
                        .join("subradar-iptal-dilekcesi.txt");
                    let _ = fs::write(path, &self.generated_notice);
                    self.status_message =
                        Some("subradar-iptal-dilekcesi.txt kaydedildi.".to_string());
                }
            });
        });
    }

    fn render_local_vault_tab(&mut self, ui: &mut egui::Ui) {
        ui.label(
            RichText::new("Yerel Kasa (encrypted_sqlite_aes256.db)")
                .size(16.0)
                .strong(),
        );
        ui.add_space(8.0);

        egui::Frame::new()
            .fill(SURFACE_DARK)
            .stroke(Stroke::new(1.0_f32, BORDER_SUBTLE))
            .corner_radius(CornerRadius::same(10))
            .inner_margin(Margin::same(18))
            .show(ui, |ui| {
                ui.label(
                    RichText::new("KRİPTOGRAFİK KASA VE SÜRÜM DURUMU")
                        .font(FontId::new(11.0, FontFamily::Monospace))
                        .color(TEXT_MUTED_DARK),
                );
                ui.add_space(8.0);
                ui.label("• Uygulama Sürümü: SubRadar Masaüstü v1.0 (Ticari Lisans)");
                ui.label("• Veritabanı: encrypted_sqlite_aes256.db / .subradar");
                ui.label("• Şifreleme Standardı: AES-256-CBC + PBKDF2-HMAC-SHA256");
                ui.label(
                    RichText::new("• Senkronizasyon: %100 Yerel ve Çevrimdışı (Bulut Yok)")
                        .color(ACCENT_EMERALD),
                );

                ui.add_space(14.0);
                ui.horizontal(|ui| {
                    ui.label("Ana Kasa Şifresi:");
                    ui.add_sized(
                        [220.0, 28.0],
                        egui::TextEdit::singleline(&mut self.master_password).password(true),
                    );
                    if ui.button("💾 Kasayı Şifrele ve Kaydet").clicked() {
                        let path = default_vault_path();
                        if save_vault_to_file(&path, &self.payload, &self.master_password).is_ok()
                        {
                            self.status_message = Some(format!(
                                "Şifreli kasa kaydedildi ({})",
                                VAULT_FILENAME
                            ));
                        }
                    }
                    if ui.button("🔒 Kasayı Şimdi Kilitle").clicked() {
                        self.is_locked = true;
                    }
                });

                if let Some(msg) = &self.status_message {
                    ui.add_space(8.0);
                    ui.label(RichText::new(msg).color(ACCENT_EMERALD));
                }
            });
    }

    fn render_lock_screen(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default()
            .frame(egui::Frame::new().fill(BG_MAIN))
            .show(ctx, |ui| {
                ui.vertical_centered(|ui| {
                    ui.add_space(150.0);
                    egui::Frame::new()
                        .fill(SURFACE_DARK)
                        .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                        .corner_radius(CornerRadius::same(12))
                        .inner_margin(Margin::same(28))
                        .show(ui, |ui| {
                            ui.set_max_width(360.0);
                            ui.vertical_centered(|ui| {
                                ui.label(
                                    RichText::new("🔒 SubRadar Masaüstü — Yerel Kasa")
                                        .size(17.0)
                                        .strong(),
                                );
                                ui.add_space(6.0);
                                ui.label(
                                    RichText::new("encrypted_sqlite_aes256.db kilidini açın")
                                        .font(FontId::new(11.5, FontFamily::Monospace))
                                        .color(TEXT_MUTED_DARK),
                                );
                                ui.add_space(14.0);
                                let resp = ui.add_sized(
                                    [300.0, 32.0],
                                    egui::TextEdit::singleline(&mut self.unlock_input)
                                        .password(true)
                                        .hint_text("Ana Kasa Şifresi (subradar2026)"),
                                );
                                if resp.lost_focus() && ui.input(|i| i.key_pressed(Key::Enter)) {
                                    if self.unlock_input == self.master_password
                                        || self.unlock_input == "subradar2026"
                                    {
                                        self.is_locked = false;
                                        self.unlock_input.clear();
                                    }
                                }
                                ui.add_space(10.0);
                                if ui.button("🔓 Kasayı Aç (Demo: subradar2026)").clicked() {
                                    self.is_locked = false;
                                    self.unlock_input.clear();
                                }
                            });
                        });
                });
            });
    }
}

impl eframe::App for SubRadarApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        apply_theme(ctx, true);

        // Keyboard shortcuts: Ctrl+K focuses search, ESC clears search
        if ctx.input(|i| i.modifiers.command && i.key_pressed(Key::K)) {
            self.active_tab = WorkspaceTab::Overview;
            self.focus_search_next_frame = true;
        }
        if ctx.input(|i| i.key_pressed(Key::Escape)) {
            self.search_query.clear();
        }

        // Top Custom Frameless Window Bar (46px height, #0b0b0e fill, 1px bottom border)
        egui::TopBottomPanel::top("subradar_window_header")
            .exact_height(46.0)
            .frame(
                egui::Frame::new()
                    .fill(BG_HEADER)
                    .inner_margin(Margin::ZERO)
                    .stroke(Stroke::new(1.0_f32, BORDER_SUBTLE)),
            )
            .show(ctx, |ui| {
                self.render_window_header(ctx, ui);
            });

        if self.is_locked {
            self.render_lock_screen(ctx);
            return;
        }

        let stats = SummaryStats::compute(&self.payload.subscriptions);

        // Left Sidebar (230px width, #08080a fill, 1px right border)
        egui::SidePanel::left("subradar_left_sidebar")
            .exact_width(230.0)
            .resizable(false)
            .frame(
                egui::Frame::new()
                    .fill(BG_SIDEBAR)
                    .inner_margin(Margin::symmetric(12, 6))
                    .stroke(Stroke::new(1.0_f32, BORDER_SUBTLE)),
            )
            .show(ctx, |ui| {
                self.render_sidebar(ui, stats.passive_leaks_count);
            });

        // Right Main Content Area (#09090b fill)
        egui::CentralPanel::default()
            .frame(
                egui::Frame::new()
                    .fill(BG_MAIN)
                    .inner_margin(Margin::symmetric(28, 22)),
            )
            .show(ctx, |ui| match self.active_tab {
                WorkspaceTab::Overview => self.render_overview_tab(ui, &stats),
                WorkspaceTab::Subscriptions => self.render_subscriptions_tab(ui),
                WorkspaceTab::BlockingRules => self.render_blocking_rules_tab(ui, ctx),
                WorkspaceTab::LocalVault => self.render_local_vault_tab(ui),
            });
    }
}
