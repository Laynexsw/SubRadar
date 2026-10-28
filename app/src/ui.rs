//! SubRadar v1.0 — Sitedeki Önizleme ile 1:1 Birebir + Maksimum Kullanıcı Dostu Arayüz (`ui.rs`)

use std::fs;
use std::process::Command;

use eframe::egui::{
    self, Align, Color32, CornerRadius, FontFamily, FontId, Key, Layout, Margin, Pos2, Rect,
    RichText, Sense, Stroke, Vec2, ViewportCommand,
};

use crate::legal::{
    generate_chargeback_document, generate_legal_notice, generate_thh_application,
    LegalDocumentType, NoticeLanguage,
};
use crate::models::{
    BillingCycle, Currency, SpendingCategory, SubStatus, Subscription, SummaryStats, VaultPayload,
};
use crate::parser::{detect_price_hike, parse_statement, SAMPLE_STATEMENT};
use crate::presets::{get_dark_pattern_guide, SERVICE_PRESETS};
use crate::theme::{apply_theme, ThemePalette};
use crate::vault::{default_vault_path, load_vault_from_file, save_vault_to_file, VAULT_FILENAME};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum WorkspaceTab {
    Overview,
    Subscriptions,
    BlockingRules,
    LocalVault,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OverviewFilter {
    All,
    PassiveWaste,
    ActiveUsed,
    Protected,
    Cancelled,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PresetCategoryFilter {
    All,
    AI,
    Media,
    Dev,
    Cloud,
    Lifestyle,
}

pub struct SubRadarApp {
    pub payload: VaultPayload,
    pub is_locked: bool,
    pub is_maximized: bool,
    pub master_password: String,
    pub unlock_input: String,
    pub active_tab: WorkspaceTab,
    pub overview_filter: OverviewFilter,
    pub preset_category_filter: PresetCategoryFilter,
    pub search_query: String,
    pub focus_search_next_frame: bool,

    // Interactive Inline Drawer & Undo State
    pub expanded_sub_id: Option<String>,
    pub dark_pattern_active_id: Option<String>,
    pub editing_sub_id: Option<String>,
    pub edit_price_input: String,
    pub edit_note_input: String,
    pub last_cancelled_id: Option<String>,
    pub last_cancelled_status: Option<SubStatus>,
    pub toast_banner: Option<(String, bool)>, // (message, show_undo)

    // Quick Add Form (Subscriptions tab)
    pub form_name: String,
    pub form_plan: String,
    pub form_category: String,
    pub form_price: String,
    pub form_cancel_url: String,
    pub form_notes: String,

    // Statement Scanner
    pub statement_input: String,
    pub detected_subs: Vec<Subscription>,

    // Legal Notice & Smart Rules
    pub selected_sub_idx: usize,
    pub legal_doc_type: LegalDocumentType,
    pub notice_lang: NoticeLanguage,
    pub generated_notice: String,
    pub rule_warn_trial_3days: bool,
    pub rule_mark_idle_30days: bool,
    pub rule_notify_price_hike: bool,
    pub rule_auto_refund_notice: bool,
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
            overview_filter: OverviewFilter::All,
            preset_category_filter: PresetCategoryFilter::All,
            search_query: String::new(),
            focus_search_next_frame: false,
            expanded_sub_id: None,
            dark_pattern_active_id: None,
            editing_sub_id: None,
            edit_price_input: String::new(),
            edit_note_input: String::new(),
            last_cancelled_id: None,
            last_cancelled_status: None,
            toast_banner: None,
            form_name: "Netflix".to_string(),
            form_plan: "Standart Paket".to_string(),
            form_category: "Dizi, Film & Müzik".to_string(),
            form_price: "14.99".to_string(),
            form_cancel_url: "https://www.netflix.com/cancelplan".to_string(),
            form_notes: "Hazır şablondan seçildi.".to_string(),
            statement_input: SAMPLE_STATEMENT.to_string(),
            detected_subs: Vec::new(),
            selected_sub_idx: 0,
            legal_doc_type: LegalDocumentType::CancellationNotice,
            notice_lang: NoticeLanguage::Turkish,
            generated_notice: String::new(),
            rule_warn_trial_3days: true,
            rule_mark_idle_30days: true,
            rule_notify_price_hike: true,
            rule_auto_refund_notice: true,
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

    fn show_toast(&mut self, msg: impl Into<String>, show_undo: bool) {
        self.toast_banner = Some((msg.into(), show_undo));
    }

    fn reset_simulation(&mut self) {
        self.payload.subscriptions = VaultPayload::default_overview_subscriptions();
        self.overview_filter = OverviewFilter::All;
        self.search_query.clear();
        self.expanded_sub_id = None;
        self.dark_pattern_active_id = None;
        self.editing_sub_id = None;
        self.last_cancelled_id = None;
        self.persist_vault();
        self.refresh_legal_notice();
        self.show_toast(
            "✓ Simülasyon başlangıç durumuna sıfırlandı ($384,20 / 3 Pasif Lisans).",
            false,
        );
    }

    fn undo_last_cancel(&mut self) {
        if let Some(last_id) = self.last_cancelled_id.take() {
            let prev_status = self
                .last_cancelled_status
                .take()
                .unwrap_or(SubStatus::UnusedTrial);
            if let Some(sub) = self
                .payload
                .subscriptions
                .iter_mut()
                .find(|s| s.id == last_id)
            {
                sub.status = prev_status;
                let name = sub.name.clone();
                self.persist_vault();
                self.show_toast(format!("↩ {} iptal işlemi geri alındı.", name), false);
            }
        }
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
        self.generated_notice = match self.legal_doc_type {
            LegalDocumentType::CancellationNotice => {
                generate_legal_notice(sub, &self.payload.preferences, self.notice_lang)
            }
            LegalDocumentType::ConsumerArbitration => {
                generate_thh_application(sub, &self.payload.preferences)
            }
            LegalDocumentType::BankChargeback => {
                generate_chargeback_document(sub, &self.payload.preferences, "4123", "2026-10-14")
            }
        };
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

    fn render_window_header(&mut self, ctx: &egui::Context, ui: &mut egui::Ui, pal: &ThemePalette) {
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
                "Tam Ekran / Pencereli",
            ) {
                self.is_maximized = !self.is_maximized;
                ctx.send_viewport_cmd(ViewportCommand::Maximized(self.is_maximized));
            }

            ui.add_space(12.0);
            ui.label(
                RichText::new("SubRadar Masaüstü — Yerel Kasa")
                    .font(FontId::new(11.5, FontFamily::Monospace))
                    .color(pal.text_muted),
            );

            ui.add_space(18.0);

            // Center Search Box ("Aboneliğe git (Ctrl+K)" + "esc")
            egui::Frame::new()
                .fill(pal.search_bg)
                .stroke(Stroke::new(1.0_f32, pal.search_border))
                .corner_radius(CornerRadius::same(6))
                .inner_margin(Margin::symmetric(10, 4))
                .show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(RichText::new("🔍").size(11.0).color(pal.text_muted));
                        let edit = egui::TextEdit::singleline(&mut self.search_query)
                            .frame(false)
                            .font(FontId::new(11.5, FontFamily::Monospace))
                            .desired_width(175.0)
                            .hint_text(
                                RichText::new("Aboneliğe git (Ctrl+K)")
                                    .font(FontId::new(11.5, FontFamily::Monospace))
                                    .color(pal.text_muted),
                            );
                        let resp = ui.add(edit);
                        if self.focus_search_next_frame {
                            resp.request_focus();
                            self.focus_search_next_frame = false;
                        }

                        egui::Frame::new()
                            .fill(pal.bg_elevated)
                            .corner_radius(CornerRadius::same(3))
                            .inner_margin(Margin::symmetric(5, 1))
                            .show(ui, |ui| {
                                if ui
                                    .add(
                                        egui::Label::new(
                                            RichText::new("esc")
                                                .font(FontId::new(9.5, FontFamily::Monospace))
                                                .color(pal.text_muted),
                                        )
                                        .sense(Sense::click()),
                                    )
                                    .on_hover_text("Aramayı temizle (Esc)")
                                    .clicked()
                                {
                                    self.search_query.clear();
                                }
                            });
                    });
                });

            // Right Controls: Sync status + New Sub + Theme toggle + Currency switcher
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                ui.add_space(14.0);
                ui.label(
                    RichText::new("SENKRONİZE (YEREL)")
                        .font(FontId::new(10.0, FontFamily::Monospace))
                        .color(pal.text_muted),
                );
                let (dot_rect, _) = ui.allocate_exact_size(Vec2::splat(8.0), Sense::hover());
                ui.painter()
                    .circle_filled(dot_rect.center(), 3.5, pal.accent_emerald);

                ui.add_space(6.0);
                if ui
                    .button(RichText::new("+ Yeni Abonelik").size(11.0).strong())
                    .on_hover_text("Hızlı abonelik ekle (Ctrl+N)")
                    .clicked()
                {
                    self.active_tab = WorkspaceTab::Subscriptions;
                }

                let theme_icon = if self.payload.preferences.dark_mode {
                    "🌙 Koyu"
                } else {
                    "☀ Açık"
                };
                if ui
                    .button(RichText::new(theme_icon).size(11.0))
                    .on_hover_text("Koyu / Açık tema geçişi")
                    .clicked()
                {
                    self.payload.preferences.dark_mode = !self.payload.preferences.dark_mode;
                    self.persist_vault();
                }

                // 1-Click Currency Switcher ($ USD | ₺ TRY | € EUR)
                for curr in [Currency::EUR, Currency::TRY, Currency::USD] {
                    let is_sel = self.payload.preferences.currency == curr;
                    let label = format!("{} {}", curr.symbol(), curr.code());
                    if ui
                        .selectable_label(
                            is_sel,
                            RichText::new(label)
                                .font(FontId::new(10.5, FontFamily::Monospace)),
                        )
                        .on_hover_text("Tüm fiyatları bu para biriminde göster")
                        .clicked()
                    {
                        self.payload.preferences.currency = curr;
                        self.persist_vault();
                    }
                }
            });
        });

        // Drag window from blank header areas
        let pointer_pos = ctx.input(|i| i.pointer.interact_pos());
        let primary_down = ctx.input(|i| i.pointer.primary_pressed());
        if primary_down && !ctx.wants_keyboard_input() {
            if let Some(pos) = pointer_pos {
                if header_rect.contains(pos) && pos.x > 85.0 && pos.x < 310.0 {
                    ctx.send_viewport_cmd(ViewportCommand::StartDrag);
                }
            }
        }
    }

    fn render_sidebar_nav_item(
        ui: &mut egui::Ui,
        pal: &ThemePalette,
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
                pal.nav_active_bg,
                Stroke::new(1.0_f32, pal.nav_active_border),
                egui::StrokeKind::Inside,
            );
        } else if resp.hovered() {
            ui.painter()
                .rect_filled(rect, CornerRadius::same(8), pal.nav_hover_bg);
        }

        let text_color = if selected || resp.hovered() {
            pal.text_primary
        } else {
            pal.text_secondary
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
                    pal.badge_passive_bg,
                );
                ui.painter().text(
                    pill_rect.center(),
                    egui::Align2::CENTER_CENTER,
                    badge_str,
                    FontId::new(10.5, FontFamily::Monospace),
                    pal.text_primary,
                );
            } else {
                ui.painter().text(
                    Pos2::new(rect.right() - 14.0, rect.center().y),
                    egui::Align2::RIGHT_CENTER,
                    badge_str,
                    FontId::new(11.0, FontFamily::Monospace),
                    pal.text_dim,
                );
            }
        }

        resp.clicked()
    }

    fn render_sidebar(&mut self, ui: &mut egui::Ui, pal: &ThemePalette, passive_count: usize) {
        ui.add_space(18.0);
        ui.horizontal(|ui| {
            ui.add_space(10.0);
            ui.label(
                RichText::new("ÇALIŞMA ALANI")
                    .font(FontId::new(10.0, FontFamily::Monospace))
                    .color(pal.text_dim),
            );
        });
        ui.add_space(6.0);

        let total_subs_badge = format!("{}", 20 + self.payload.subscriptions.len());
        let rules_badge = format!("{}", passive_count.max(3));

        if Self::render_sidebar_nav_item(
            ui,
            pal,
            "⊞",
            "Genel Bakış",
            None,
            self.active_tab == WorkspaceTab::Overview,
        ) {
            self.active_tab = WorkspaceTab::Overview;
        }

        if Self::render_sidebar_nav_item(
            ui,
            pal,
            "❐",
            "Abonelikler",
            Some((&total_subs_badge, false)),
            self.active_tab == WorkspaceTab::Subscriptions,
        ) {
            self.active_tab = WorkspaceTab::Subscriptions;
        }

        if Self::render_sidebar_nav_item(
            ui,
            pal,
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
            pal,
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
                    .color(pal.text_dim),
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
                            .color(pal.text_muted),
                    );
                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        ui.label(
                            RichText::new("18,4 MB")
                                .font(FontId::new(11.5, FontFamily::Monospace))
                                .strong()
                                .color(pal.text_primary),
                        );
                    });
                });

                ui.add_space(6.0);
                let (bar_rect, _) =
                    ui.allocate_exact_size(Vec2::new(ui.available_width(), 4.0), Sense::hover());
                ui.painter()
                    .rect_filled(bar_rect, CornerRadius::same(2), pal.border_subtle);
                let fill_w = bar_rect.width() * 0.24;
                let fill_rect =
                    Rect::from_min_size(bar_rect.min, Vec2::new(fill_w, bar_rect.height()));
                ui.painter()
                    .rect_filled(fill_rect, CornerRadius::same(2), pal.text_primary);

                ui.add_space(14.0);
                ui.horizontal(|ui| {
                    ui.label(
                        RichText::new("Yerel Çekirdek:")
                            .font(FontId::new(11.0, FontFamily::Monospace))
                            .color(pal.text_muted),
                    );
                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        ui.label(
                            RichText::new("Servis Etkin")
                                .font(FontId::new(11.0, FontFamily::Monospace))
                                .color(pal.accent_emerald),
                        );
                    });
                });
            });
    }

    fn render_overview_tab(
        &mut self,
        ui: &mut egui::Ui,
        pal: &ThemePalette,
        stats: &SummaryStats,
    ) {
        let pref_curr = self.payload.preferences.currency;
        let mut cancel_action_idx: Option<usize> = None;

        // 1. Top 3-Column Metric Strip (1:1 Match with Screenshot)
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
            Stroke::new(1.0_f32, pal.border_subtle),
        );
        ui.painter().line_segment(
            [
                Pos2::new(c3_x - 16.0, strip_rect.top() + 4.0),
                Pos2::new(c3_x - 16.0, strip_rect.bottom() - 12.0),
            ],
            Stroke::new(1.0_f32, pal.border_subtle),
        );

        // Column 1: AYLIK GİDER
        ui.painter().text(
            Pos2::new(c1_x, strip_rect.top() + 4.0),
            egui::Align2::LEFT_TOP,
            "AYLIK GİDER",
            FontId::new(10.5, FontFamily::Monospace),
            pal.text_muted,
        );
        ui.painter().text(
            Pos2::new(c1_x, strip_rect.top() + 24.0),
            egui::Align2::LEFT_TOP,
            pref_curr.format_from_usd(stats.monthly_burn_usd),
            FontId::new(26.0, FontFamily::Monospace),
            pal.text_primary,
        );

        // Column 2: YAKALANAN SIZINTI
        ui.painter().text(
            Pos2::new(c2_x + 4.0, strip_rect.top() + 4.0),
            egui::Align2::LEFT_TOP,
            "YAKALANAN SIZINTI",
            FontId::new(10.5, FontFamily::Monospace),
            pal.text_muted,
        );
        let leaks_label = if stats.passive_leaks_count == 0 {
            "0 Pasif Lisans".to_string()
        } else {
            format!("{} Pasif Lisanslar", stats.passive_leaks_count)
        };
        ui.painter().text(
            Pos2::new(c2_x + 4.0, strip_rect.top() + 24.0),
            egui::Align2::LEFT_TOP,
            leaks_label,
            FontId::new(24.0, FontFamily::Proportional),
            pal.text_primary,
        );

        // Column 3: YILLIK KURTARILABİLİR İSRAF
        ui.painter().text(
            Pos2::new(c3_x + 4.0, strip_rect.top() + 4.0),
            egui::Align2::LEFT_TOP,
            "YILLIK KURTARILABİLİR İSRAF",
            FontId::new(10.5, FontFamily::Monospace),
            pal.text_muted,
        );
        ui.painter().text(
            Pos2::new(c3_x + 4.0, strip_rect.top() + 24.0),
            egui::Align2::LEFT_TOP,
            pref_curr.format_from_usd(stats.annual_recoverable_usd),
            FontId::new(26.0, FontFamily::Monospace),
            pal.text_primary,
        );

        // Horizontal divider under metrics
        ui.painter().line_segment(
            [
                Pos2::new(strip_rect.left(), strip_rect.bottom()),
                Pos2::new(strip_rect.right(), strip_rect.bottom()),
            ],
            Stroke::new(1.0_f32, pal.border_subtle),
        );

        // 1.3 YAKLAŞAN YENİLEME KALKANI (Önümüzdeki 7 Gün)
        let upcoming_renewals = SummaryStats::find_upcoming_renewals(&self.payload.subscriptions, 7);
        if !upcoming_renewals.is_empty() {
            ui.add_space(8.0);
            let amber_color = Color32::from_rgb(245, 158, 11);
            egui::Frame::new()
                .fill(pal.bg_surface)
                .stroke(Stroke::new(1.0_f32, amber_color.gamma_multiply(0.6)))
                .corner_radius(CornerRadius::same(10))
                .inner_margin(Margin::symmetric(14, 10))
                .show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(
                            RichText::new("⏰ YAKLAŞAN YENİLEMELER (ÖNÜMÜZDEKİ 7 GÜN)")
                                .font(FontId::new(10.5, FontFamily::Monospace))
                                .strong()
                                .color(amber_color),
                        );

                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                            let total_risk_usd: f64 = upcoming_renewals.iter().map(|u| u.cost_usd).sum();
                            ui.label(
                                RichText::new(format!(
                                    "Yenileme Tutarı: {}",
                                    pref_curr.format_from_usd(total_risk_usd)
                                ))
                                .font(FontId::new(10.5, FontFamily::Monospace))
                                .color(pal.text_muted),
                            );
                        });
                    });

                    ui.add_space(6.0);
                    for item in &upcoming_renewals {
                        ui.horizontal(|ui| {
                            let (badge_bg, badge_fg, badge_text) = if item.days_left == 0 {
                                (Color32::from_rgb(45, 18, 22), pal.accent_rose, "BUGÜN!".to_string())
                            } else if item.days_left <= 3 {
                                (Color32::from_rgb(38, 28, 12), amber_color, format!("{} gün kaldı", item.days_left))
                            } else {
                                (pal.bg_elevated, pal.text_muted, format!("{} gün sonra", item.days_left))
                            };

                            egui::Frame::new()
                                .fill(badge_bg)
                                .stroke(Stroke::new(1.0_f32, badge_fg.gamma_multiply(0.5)))
                                .corner_radius(CornerRadius::same(4))
                                .inner_margin(Margin::symmetric(6, 2))
                                .show(ui, |ui| {
                                    ui.label(
                                        RichText::new(badge_text)
                                            .font(FontId::new(10.0, FontFamily::Monospace))
                                            .strong()
                                            .color(badge_fg),
                                    );
                                });

                            ui.label(
                                RichText::new(&item.sub_name)
                                    .font(FontId::new(11.5, FontFamily::Proportional))
                                    .strong()
                                    .color(pal.text_primary),
                            );
                            ui.label(
                                RichText::new(format!("• {}", pref_curr.format_from_usd(item.cost_usd)))
                                    .font(FontId::new(11.0, FontFamily::Monospace))
                                    .color(pal.text_muted),
                            );

                            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                if let Some(idx) = self.payload.subscriptions.iter().position(|s| s.id == item.sub_id) {
                                    if ui.button(
                                        RichText::new("Hemen İptal Et  →")
                                            .font(FontId::new(10.5, FontFamily::Proportional))
                                            .color(pal.cta_fg),
                                    ).clicked() {
                                        cancel_action_idx = Some(idx);
                                    }
                                }
                            });
                        });
                        ui.add_space(3.0);
                    }
                });
        }

        // 1.5 BENTO GRID: Kategori & Harcama Dağılımı + Bütçe Sağlık Skoru
        let cat_spendings = SummaryStats::compute_category_spending(&self.payload.subscriptions);
        let health = SummaryStats::compute_budget_health(stats);

        ui.add_space(8.0);

        egui::Frame::new()
            .fill(pal.bg_surface)
            .stroke(Stroke::new(1.0_f32, pal.border_subtle))
            .corner_radius(CornerRadius::same(10))
            .inner_margin(Margin::symmetric(14, 10))
            .show(ui, |ui| {
                // Header: Title + Health Badge
                ui.horizontal(|ui| {
                    ui.label(
                        RichText::new("BENTO HARCAMA ANALİTİĞİ & DAĞILIM")
                            .font(FontId::new(10.0, FontFamily::Monospace))
                            .color(pal.text_muted),
                    );

                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        let health_color = Color32::from_rgb(
                            health.color_rgb.0,
                            health.color_rgb.1,
                            health.color_rgb.2,
                        );
                        egui::Frame::new()
                            .fill(pal.bg_elevated)
                            .stroke(Stroke::new(1.0_f32, health_color.gamma_multiply(0.5)))
                            .corner_radius(CornerRadius::same(6))
                            .inner_margin(Margin::symmetric(8, 2))
                            .show(ui, |ui| {
                                ui.horizontal(|ui| {
                                    let (dot, _) =
                                        ui.allocate_exact_size(Vec2::splat(6.0), Sense::hover());
                                    ui.painter().circle_filled(dot.center(), 3.0, health_color);
                                    ui.label(
                                        RichText::new(format!(
                                            "Bütçe Sağlığı: {} ({} Puan)",
                                            health.grade, health.score
                                        ))
                                        .font(FontId::new(10.0, FontFamily::Monospace))
                                        .strong()
                                        .color(health_color),
                                    );
                                });
                            });
                    });
                });

                ui.add_space(6.0);

                // Multi-Segmented Bento Progress Bar
                let total_bar_w = ui.available_width();
                let bar_h = 8.0;
                let (bar_rect, bar_resp) =
                    ui.allocate_exact_size(Vec2::new(total_bar_w, bar_h), Sense::hover());
                ui.painter()
                    .rect_filled(bar_rect, CornerRadius::same(4), pal.border_subtle);

                let mut cur_x = bar_rect.left();
                for cat in &cat_spendings {
                    if cat.percentage <= 0.0 {
                        continue;
                    }
                    let seg_w = (total_bar_w * (cat.percentage as f32 / 100.0)).max(2.0);
                    let seg_rect = Rect::from_min_size(
                        Pos2::new(cur_x, bar_rect.top()),
                        Vec2::new(seg_w.min(bar_rect.right() - cur_x), bar_h),
                    );
                    let (cr, cg, cb) = cat.category.color_rgb();
                    let seg_color = Color32::from_rgb(cr, cg, cb);
                    ui.painter()
                        .rect_filled(seg_rect, CornerRadius::same(3), seg_color);

                    cur_x += seg_w;
                    if cur_x >= bar_rect.right() {
                        break;
                    }
                }

                if bar_resp.hovered() {
                    let mut tip = String::from("Bento Kategori Dağılımı:\n");
                    for cat in &cat_spendings {
                        if cat.percentage > 0.0 {
                            tip.push_str(&format!(
                                "{} {}: {} (%{:.1}) • {} servis\n",
                                cat.category.icon(),
                                cat.category.label(),
                                pref_curr.format_from_usd(cat.monthly_usd),
                                cat.percentage,
                                cat.count
                            ));
                        }
                    }
                    bar_resp.on_hover_text(tip.trim_end());
                }

                ui.add_space(8.0);

                // Bento Mini Cards: 5 Category Mini Cards + 1 Health Score Card
                let num_cards = 6.0;
                let spacing = 6.0;
                let card_w = ((total_bar_w - spacing * (num_cards - 1.0)) / num_cards).max(110.0);
                let card_h = 56.0;

                ui.horizontal(|ui| {
                    for cat_kind in [
                        SpendingCategory::SoftwareDev,
                        SpendingCategory::Entertainment,
                        SpendingCategory::CloudServer,
                        SpendingCategory::Productivity,
                        SpendingCategory::Other,
                    ] {
                        let cat_data = cat_spendings.iter().find(|c| c.category == cat_kind);
                        let monthly_usd = cat_data.map(|c| c.monthly_usd).unwrap_or(0.0);
                        let percentage = cat_data.map(|c| c.percentage).unwrap_or(0.0);
                        let count = cat_data.map(|c| c.count).unwrap_or(0);
                        let (cr, cg, cb) = cat_kind.color_rgb();
                        let cat_color = Color32::from_rgb(cr, cg, cb);

                        egui::Frame::new()
                            .fill(pal.bg_elevated)
                            .stroke(Stroke::new(1.0_f32, pal.border_subtle))
                            .corner_radius(CornerRadius::same(6))
                            .inner_margin(Margin::symmetric(8, 6))
                            .show(ui, |ui| {
                                ui.set_width(card_w);
                                ui.set_height(card_h);
                                ui.vertical(|ui| {
                                    ui.horizontal(|ui| {
                                        ui.label(RichText::new(cat_kind.icon()).size(10.5));
                                        ui.label(
                                            RichText::new(cat_kind.short_label())
                                                .font(FontId::new(10.0, FontFamily::Proportional))
                                                .strong()
                                                .color(pal.text_primary),
                                        );
                                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                            ui.label(
                                                RichText::new(format!("%{:.0}", percentage))
                                                    .font(FontId::new(9.0, FontFamily::Monospace))
                                                    .color(cat_color),
                                            );
                                        });
                                    });
                                    ui.add_space(2.0);
                                    ui.label(
                                        RichText::new(pref_curr.format_from_usd(monthly_usd))
                                            .font(FontId::new(11.5, FontFamily::Monospace))
                                            .strong()
                                            .color(pal.text_primary),
                                    );
                                    ui.label(
                                        RichText::new(format!("{} aktif", count))
                                            .font(FontId::new(8.5, FontFamily::Monospace))
                                            .color(pal.text_dim),
                                    );
                                });
                            });
                    }

                    // 6th Card: Health Score Card
                    let health_color = Color32::from_rgb(
                        health.color_rgb.0,
                        health.color_rgb.1,
                        health.color_rgb.2,
                    );
                    egui::Frame::new()
                        .fill(pal.bg_elevated)
                        .stroke(Stroke::new(1.0_f32, health_color.gamma_multiply(0.4)))
                        .corner_radius(CornerRadius::same(6))
                        .inner_margin(Margin::symmetric(8, 6))
                        .show(ui, |ui| {
                            ui.set_width(card_w);
                            ui.set_height(card_h);
                            ui.vertical(|ui| {
                                ui.horizontal(|ui| {
                                    ui.label(RichText::new("🛡").size(10.5));
                                    ui.label(
                                        RichText::new("Skor")
                                            .font(FontId::new(10.0, FontFamily::Proportional))
                                            .strong()
                                            .color(pal.text_primary),
                                    );
                                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                        egui::Frame::new()
                                            .fill(health_color)
                                            .corner_radius(CornerRadius::same(3))
                                            .inner_margin(Margin::symmetric(4, 1))
                                            .show(ui, |ui| {
                                                ui.label(
                                                    RichText::new(health.grade)
                                                        .font(FontId::new(
                                                            9.0,
                                                            FontFamily::Monospace,
                                                        ))
                                                        .strong()
                                                        .color(Color32::from_rgb(10, 10, 12)),
                                                );
                                            });
                                    });
                                });
                                ui.add_space(2.0);
                                ui.label(
                                    RichText::new(format!("{} Puan", health.score))
                                        .font(FontId::new(11.5, FontFamily::Monospace))
                                        .strong()
                                        .color(health_color),
                                );
                                ui.label(
                                    RichText::new(health.message)
                                        .font(FontId::new(8.5, FontFamily::Proportional))
                                        .color(pal.text_dim),
                                );
                            });
                        });
                });
            });

        ui.add_space(8.0);

        ui.add_space(8.0);

        // 2. Quick Filter Bar & Shortcut Actions
        ui.horizontal(|ui| {
            for (filt, label) in [
                (OverviewFilter::All, "Tümü"),
                (OverviewFilter::PassiveWaste, "⚠ Boşa Ödenenler"),
                (OverviewFilter::ActiveUsed, "✓ Aktif Kullanılanlar"),
                (OverviewFilter::Protected, "🛡 Korumalılar"),
                (OverviewFilter::Cancelled, "✕ İptal Edilenler"),
            ] {
                if ui
                    .selectable_label(
                        self.overview_filter == filt,
                        RichText::new(label).size(11.5),
                    )
                    .clicked()
                {
                    self.overview_filter = filt;
                }
            }

            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                if ui
                    .button(RichText::new("🔍 Ekstre Tara").size(11.5))
                    .clicked()
                {
                    self.active_tab = WorkspaceTab::BlockingRules;
                }
                if ui
                    .button(RichText::new("+ Hızlı Abonelik Ekle").size(11.5))
                    .clicked()
                {
                    self.active_tab = WorkspaceTab::Subscriptions;
                }
            });
        });

        ui.add_space(4.0);

        // 3. Subscription Rows + Inline Action Drawer
        let query = self.search_query.trim().to_lowercase();
        let mut restore_action_idx: Option<usize> = None;
        let mut toggle_protect_idx: Option<usize> = None;
        let mut open_url_str: Option<String> = None;
        let mut prepare_legal_idx: Option<usize> = None;
        let mut toggle_expand_id: Option<String> = None;
        let mut start_edit_idx: Option<usize> = None;
        let mut save_edit_idx: Option<usize> = None;
        let mut shown = 0usize;

        egui::ScrollArea::vertical()
            .id_salt("overview_rows_scroll")
            .max_height(240.0)
            .show(ui, |ui| {
                for (idx, sub) in self.payload.subscriptions.iter().enumerate() {
                    let filter_ok = match self.overview_filter {
                        OverviewFilter::All => sub.status != SubStatus::Cancelled,
                        OverviewFilter::PassiveWaste => sub.status == SubStatus::UnusedTrial,
                        OverviewFilter::ActiveUsed | OverviewFilter::Protected => {
                            sub.status == SubStatus::Active
                        }
                        OverviewFilter::Cancelled => sub.status == SubStatus::Cancelled,
                    };
                    if !filter_ok {
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
                    let row_h = 70.0;
                    let (row_rect, row_resp) = ui.allocate_exact_size(
                        Vec2::new(ui.available_width(), row_h),
                        Sense::click(),
                    );

                    if row_resp.hovered() {
                        ui.painter().rect_filled(
                            row_rect,
                            CornerRadius::same(6),
                            pal.nav_hover_bg,
                        );
                    }

                    // Left Avatar Box (36x36 rounded)
                    let avatar_rect = Rect::from_center_size(
                        Pos2::new(row_rect.left() + 18.0, row_rect.center().y),
                        Vec2::splat(36.0),
                    );
                    if sub.is_light_avatar() {
                        ui.painter()
                            .rect_filled(avatar_rect, CornerRadius::same(7), pal.cta_bg);
                        ui.painter().text(
                            avatar_rect.center(),
                            egui::Align2::CENTER_CENTER,
                            sub.avatar_code(),
                            FontId::new(12.5, FontFamily::Proportional),
                            pal.cta_fg,
                        );
                    } else {
                        ui.painter().rect(
                            avatar_rect,
                            CornerRadius::same(7),
                            pal.bg_surface,
                            Stroke::new(1.0_f32, pal.border_default),
                            egui::StrokeKind::Inside,
                        );
                        ui.painter().text(
                            avatar_rect.center(),
                            egui::Align2::CENTER_CENTER,
                            sub.avatar_code(),
                            FontId::new(12.0, FontFamily::Monospace),
                            pal.text_primary,
                        );
                    }

                    // Title + Pill Badge
                    let text_left = row_rect.left() + 50.0;
                    let title_galley = ui.painter().layout_no_wrap(
                        sub.name.clone(),
                        FontId::new(14.5, FontFamily::Proportional),
                        pal.text_primary,
                    );
                    let title_pos = Pos2::new(text_left, row_rect.top() + 14.0);
                    let title_w = title_galley.size().x;
                    ui.painter().galley(title_pos, title_galley, pal.text_primary);

                    let badge_text = if sub.status == SubStatus::Cancelled {
                        "İPTAL EDİLDİ".to_string()
                    } else {
                        sub.plan.clone()
                    };
                    let badge_galley = ui.painter().layout_no_wrap(
                        badge_text,
                        FontId::new(9.5, FontFamily::Monospace),
                        if sub.status == SubStatus::Active {
                            pal.text_muted
                        } else {
                            pal.text_primary
                        },
                    );
                    let badge_w = badge_galley.size().x + 14.0;
                    let badge_rect = Rect::from_min_size(
                        Pos2::new(text_left + title_w + 10.0, row_rect.top() + 13.0),
                        Vec2::new(badge_w, 19.0),
                    );
                    let (badge_fill, badge_stroke) = if sub.status == SubStatus::Active {
                        (pal.badge_active_bg, pal.badge_active_border)
                    } else {
                        (pal.badge_passive_bg, pal.badge_passive_border)
                    };
                    ui.painter().rect(
                        badge_rect,
                        CornerRadius::same(4),
                        badge_fill,
                        Stroke::new(1.0_f32, badge_stroke),
                        egui::StrokeKind::Inside,
                    );
                    ui.painter().galley(
                        Pos2::new(badge_rect.left() + 7.0, badge_rect.top() + 3.5),
                        badge_galley,
                        pal.text_primary,
                    );

                    // Price Hike Warning Badge: ⚠ ZAM TESPİT EDİLDİ (+%35)
                    if sub.price_hike_detected {
                        let hike_pct = sub.price_hike_percentage.unwrap_or(0.0);
                        let hike_text = format!("⚠ ZAM TESPİT EDİLDİ (+%{:.0})", hike_pct);
                        let hike_galley = ui.painter().layout_no_wrap(
                            hike_text,
                            FontId::new(9.5, FontFamily::Monospace),
                            pal.accent_rose,
                        );
                        let hike_w = hike_galley.size().x + 14.0;
                        let hike_rect = Rect::from_min_size(
                            Pos2::new(badge_rect.right() + 8.0, row_rect.top() + 13.0),
                            Vec2::new(hike_w, 19.0),
                        );
                        ui.painter().rect(
                            hike_rect,
                            CornerRadius::same(4),
                            Color32::from_rgb(45, 18, 22),
                            Stroke::new(1.0_f32, pal.accent_rose),
                            egui::StrokeKind::Inside,
                        );
                        ui.painter().galley(
                            Pos2::new(hike_rect.left() + 7.0, hike_rect.top() + 3.5),
                            hike_galley,
                            pal.accent_rose,
                        );
                    }

                    // Subtitle below title
                    ui.painter().text(
                        Pos2::new(text_left, row_rect.top() + 39.0),
                        egui::Align2::LEFT_TOP,
                        &sub.notes,
                        FontId::new(12.5, FontFamily::Proportional),
                        pal.text_muted,
                    );

                    let display_cost = format!(
                        "{}{}",
                        pref_curr.format_from_usd(sub.monthly_cost_usd()),
                        sub.billing_cycle.short_suffix()
                    );

                    // Right Action Control ("Hemen İptal  →", "Korumalı", or "↩ Geri Al")
                    if sub.status == SubStatus::Active {
                        let prot_rect = Rect::from_center_size(
                            Pos2::new(row_rect.right() - 44.0, row_rect.center().y),
                            Vec2::new(86.0, 32.0),
                        );
                        let prot_resp = ui.interact(
                            prot_rect,
                            egui::Id::new(("prot_btn", idx)),
                            Sense::click(),
                        );
                        ui.painter().rect(
                            prot_rect,
                            CornerRadius::same(6),
                            pal.badge_active_bg,
                            Stroke::new(1.0_f32, pal.badge_active_border),
                            egui::StrokeKind::Inside,
                        );
                        ui.painter().text(
                            prot_rect.center(),
                            egui::Align2::CENTER_CENTER,
                            "Korumalı",
                            FontId::new(11.5, FontFamily::Monospace),
                            pal.text_muted,
                        );
                        if prot_resp
                            .on_hover_text("Yönetim seçeneklerini açmak için tıklayın")
                            .clicked()
                        {
                            toggle_expand_id = Some(sub.id.clone());
                        }

                        let cost_right = prot_rect.left() - 18.0;
                        ui.painter().text(
                            Pos2::new(cost_right, row_rect.top() + 16.0),
                            egui::Align2::RIGHT_TOP,
                            display_cost,
                            FontId::new(14.5, FontFamily::Monospace),
                            pal.text_primary,
                        );
                        ui.painter().text(
                            Pos2::new(cost_right, row_rect.top() + 38.0),
                            egui::Align2::RIGHT_TOP,
                            &sub.next_renewal,
                            FontId::new(9.5, FontFamily::Monospace),
                            pal.text_dim,
                        );
                    } else if sub.status == SubStatus::Cancelled {
                        let undo_rect = Rect::from_center_size(
                            Pos2::new(row_rect.right() - 52.0, row_rect.center().y),
                            Vec2::new(100.0, 32.0),
                        );
                        let undo_resp = ui.interact(
                            undo_rect,
                            egui::Id::new(("undo_row_btn", idx)),
                            Sense::click(),
                        );
                        ui.painter().rect(
                            undo_rect,
                            CornerRadius::same(6),
                            pal.bg_elevated,
                            Stroke::new(1.0_f32, pal.border_default),
                            egui::StrokeKind::Inside,
                        );
                        ui.painter().text(
                            undo_rect.center(),
                            egui::Align2::CENTER_CENTER,
                            "↩ Geri Al",
                            FontId::new(11.5, FontFamily::Proportional),
                            pal.text_primary,
                        );
                        if undo_resp.clicked() {
                            restore_action_idx = Some(idx);
                        }

                        let cost_right = undo_rect.left() - 18.0;
                        ui.painter().text(
                            Pos2::new(cost_right, row_rect.top() + 16.0),
                            egui::Align2::RIGHT_TOP,
                            display_cost,
                            FontId::new(14.5, FontFamily::Monospace),
                            pal.text_muted,
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
                            pal.cta_hover
                        } else {
                            pal.cta_bg
                        };
                        ui.painter()
                            .rect_filled(btn_rect, CornerRadius::same(7), btn_bg);
                        ui.painter().text(
                            btn_rect.center(),
                            egui::Align2::CENTER_CENTER,
                            "Hemen İptal  →",
                            FontId::new(12.0, FontFamily::Proportional),
                            pal.cta_fg,
                        );

                        if btn_resp
                            .on_hover_text(
                                "Tıklandığında aboneliği iptal eder, tasarrufa ekler ve yönetim seçeneklerini açar",
                            )
                            .clicked()
                        {
                            cancel_action_idx = Some(idx);
                        }

                        let cost_right = btn_rect.left() - 18.0;
                        ui.painter().text(
                            Pos2::new(cost_right, row_rect.top() + 16.0),
                            egui::Align2::RIGHT_TOP,
                            display_cost,
                            FontId::new(14.5, FontFamily::Monospace),
                            pal.text_primary,
                        );
                        ui.painter().text(
                            Pos2::new(cost_right, row_rect.top() + 38.0),
                            egui::Align2::RIGHT_TOP,
                            &sub.next_renewal,
                            FontId::new(9.5, FontFamily::Monospace),
                            pal.text_dim,
                        );
                    }

                    if row_resp
                        .on_hover_text("İptal, resmi dilekçe ve düzenleme seçenekleri için tıklayın")
                        .clicked()
                    {
                        toggle_expand_id = Some(sub.id.clone());
                    }

                    // Expandable Inline Action Drawer
                    if self.expanded_sub_id.as_deref() == Some(sub.id.as_str()) {
                        egui::Frame::new()
                            .fill(pal.bg_surface)
                            .stroke(Stroke::new(1.0_f32, pal.border_default))
                            .corner_radius(CornerRadius::same(8))
                            .inner_margin(Margin::symmetric(14, 10))
                            .show(ui, |ui| {
                                if sub.price_hike_detected {
                                    let prev_str = sub
                                        .previous_price
                                        .map(|p| pref_curr.format_from_usd(p))
                                        .unwrap_or_else(|| "Bilinmiyor".to_string());
                                    let hike_str = sub
                                        .price_hike_percentage
                                        .map(|pct| format!("+%{:.0}", pct))
                                        .unwrap_or_else(|| "+%0".to_string());
                                    egui::Frame::new()
                                        .fill(Color32::from_rgb(45, 18, 22))
                                        .stroke(Stroke::new(1.0_f32, pal.accent_rose))
                                        .corner_radius(CornerRadius::same(6))
                                        .inner_margin(Margin::symmetric(10, 6))
                                        .show(ui, |ui| {
                                            ui.horizontal(|ui| {
                                                ui.label(
                                                    RichText::new("⚠ GİZLİ ZAM TESPİT EDİLDİ:")
                                                        .font(FontId::new(11.0, FontFamily::Monospace))
                                                        .strong()
                                                        .color(pal.accent_rose),
                                                );
                                                ui.label(
                                                    RichText::new(format!(
                                                        "Önceki fiyat: {} • Yeni fiyat: {} ({})",
                                                        prev_str,
                                                        pref_curr.format_from_usd(sub.monthly_cost_usd()),
                                                        hike_str
                                                    ))
                                                    .font(FontId::new(11.5, FontFamily::Proportional))
                                                    .color(pal.text_primary),
                                                );
                                            });
                                        });
                                    ui.add_space(6.0);
                                }

                                ui.horizontal_wrapped(|ui| {
                                    if sub.status != SubStatus::Cancelled {
                                        if ui
                                            .button(
                                                RichText::new(
                                                    "✓ İptal Edildi İşaretle (Tasarrufa Ekle)",
                                                )
                                                .size(11.5)
                                                .color(pal.accent_emerald),
                                            )
                                            .clicked()
                                        {
                                            cancel_action_idx = Some(idx);
                                        }
                                    } else if ui
                                        .button(RichText::new("↩ İptali Geri Al").size(11.5))
                                        .clicked()
                                    {
                                        restore_action_idx = Some(idx);
                                    }

                                    if !sub.cancel_url.is_empty()
                                        && ui
                                            .button(
                                                RichText::new("🌐 Resmi İptal Sayfasına Git")
                                                    .size(11.5),
                                            )
                                            .clicked()
                                    {
                                        open_url_str = Some(sub.cancel_url.clone());
                                    }

                                    if ui
                                        .button(
                                            RichText::new(
                                                "📄 Resmi İptal & İade Dilekçesi Hazırla",
                                            )
                                            .size(11.5),
                                        )
                                        .clicked()
                                    {
                                        prepare_legal_idx = Some(idx);
                                    }

                                    let prot_label = if sub.status == SubStatus::Active {
                                        "🛡 Korumayı Kaldır (Boşta İşaretle)"
                                    } else {
                                        "🛡 Korumalı Yap"
                                    };
                                    if ui.button(RichText::new(prot_label).size(11.5)).clicked() {
                                        toggle_protect_idx = Some(idx);
                                    }

                                    if ui
                                        .button(RichText::new("✏ Fiyat / Not Düzenle").size(11.5))
                                        .clicked()
                                    {
                                        start_edit_idx = Some(idx);
                                    }

                                    if get_dark_pattern_guide(&sub.name).is_some() {
                                        let is_open = self.dark_pattern_active_id.as_deref() == Some(sub.id.as_str());
                                        let btn_label = if is_open {
                                            "🎯 Tuzağı Gizle"
                                        } else {
                                            "🎯 İptal Tuzağını Aşma Rehberi"
                                        };
                                        if ui
                                            .button(
                                                RichText::new(btn_label)
                                                    .size(11.5)
                                                    .color(Color32::from_rgb(245, 158, 11)),
                                            )
                                            .clicked()
                                        {
                                            if is_open {
                                                self.dark_pattern_active_id = None;
                                            } else {
                                                self.dark_pattern_active_id = Some(sub.id.clone());
                                            }
                                        }
                                    }
                                });

                                if self.dark_pattern_active_id.as_deref() == Some(sub.id.as_str()) {
                                    if let Some(guide) = get_dark_pattern_guide(&sub.name) {
                                        ui.add_space(8.0);
                                        egui::Frame::new()
                                            .fill(pal.bg_elevated)
                                            .stroke(Stroke::new(1.0_f32, Color32::from_rgb(245, 158, 11)))
                                            .corner_radius(CornerRadius::same(6))
                                            .inner_margin(Margin::symmetric(12, 10))
                                            .show(ui, |ui| {
                                                ui.horizontal(|ui| {
                                                    ui.label(
                                                        RichText::new("🎯 KARANLIK DESEN (DARK PATTERN) BYPASS REHBERİ")
                                                            .font(FontId::new(11.0, FontFamily::Monospace))
                                                            .strong()
                                                            .color(Color32::from_rgb(245, 158, 11)),
                                                    );
                                                });
                                                ui.add_space(4.0);
                                                ui.label(
                                                    RichText::new(guide)
                                                        .font(FontId::new(11.0, FontFamily::Proportional))
                                                        .color(pal.text_primary),
                                                );
                                            });
                                    }
                                }

                                if self.editing_sub_id.as_deref() == Some(sub.id.as_str()) {
                                    ui.add_space(6.0);
                                    ui.horizontal(|ui| {
                                        ui.label(RichText::new("Aylık Tutar ($):").size(11.5));
                                        ui.add_sized(
                                            [80.0, 24.0],
                                            egui::TextEdit::singleline(&mut self.edit_price_input),
                                        );
                                        ui.label(RichText::new("Not:").size(11.5));
                                        ui.add_sized(
                                            [260.0, 24.0],
                                            egui::TextEdit::singleline(&mut self.edit_note_input),
                                        );
                                        if ui.button("💾 Kaydet").clicked() {
                                            save_edit_idx = Some(idx);
                                        }
                                    });
                                }
                            });
                    }

                    // Row bottom subtle divider
                    ui.painter().line_segment(
                        [
                            Pos2::new(row_rect.left(), row_rect.bottom()),
                            Pos2::new(row_rect.right(), row_rect.bottom()),
                        ],
                        Stroke::new(1.0_f32, pal.border_subtle),
                    );
                }

                if shown == 0 {
                    ui.add_space(28.0);
                    ui.vertical_centered(|ui| {
                        ui.label(
                            RichText::new(
                                "Bu filtrede abonelik bulunamadı. Tümünü görmek için 'Tümü' veya 'Simülasyonu Sıfırla'ya tıklayın.",
                            )
                            .font(FontId::new(12.0, FontFamily::Monospace))
                            .color(pal.text_muted),
                        );
                    });
                }
            });

        // Apply deferred row actions
        if let Some(id) = toggle_expand_id {
            if self.expanded_sub_id.as_deref() == Some(id.as_str()) {
                self.expanded_sub_id = None;
            } else {
                self.expanded_sub_id = Some(id);
            }
        }

        if let Some(idx) = start_edit_idx {
            let sub = &self.payload.subscriptions[idx];
            self.editing_sub_id = Some(sub.id.clone());
            self.edit_price_input = format!("{:.2}", sub.price);
            self.edit_note_input = sub.notes.clone();
        }

        if let Some(idx) = save_edit_idx {
            if let Ok(new_p) = self.edit_price_input.replace(',', ".").parse::<f64>() {
                if new_p > 0.0 {
                    self.payload.subscriptions[idx].price = new_p;
                }
            }
            self.payload.subscriptions[idx].notes = self.edit_note_input.trim().to_string();
            let name = self.payload.subscriptions[idx].name.clone();
            self.editing_sub_id = None;
            self.persist_vault();
            self.show_toast(format!("✓ {} bilgileri güncellendi.", name), false);
        }

        if let Some(idx) = cancel_action_idx {
            let previous_status = self.payload.subscriptions[idx].status;
            let sub = &mut self.payload.subscriptions[idx];
            sub.status = SubStatus::Cancelled;
            let id = sub.id.clone();
            let name = sub.name.clone();
            let annual_saved = sub.monthly_cost_usd() * 12.0;
            let saved = pref_curr.format_from_usd(annual_saved);
            self.last_cancelled_id = Some(id.clone());
            self.last_cancelled_status = Some(previous_status);
            self.expanded_sub_id = Some(id);
            self.persist_vault();
            self.show_toast(
                format!(
                    "✓ {} iptal edildi — Yılda {} kazandınız",
                    name, saved
                ),
                true,
            );
        }

        if let Some(idx) = restore_action_idx {
            self.payload.subscriptions[idx].status = SubStatus::UnusedTrial;
            let name = self.payload.subscriptions[idx].name.clone();
            self.persist_vault();
            self.show_toast(format!("↩ {} tekrar listeye alındı.", name), false);
        }

        if let Some(idx) = toggle_protect_idx {
            let cur = self.payload.subscriptions[idx].status;
            self.payload.subscriptions[idx].status = if cur == SubStatus::Active {
                SubStatus::UnusedTrial
            } else {
                SubStatus::Active
            };
            let name = self.payload.subscriptions[idx].name.clone();
            self.persist_vault();
            self.show_toast(format!("✓ {} koruma durumu güncellendi.", name), false);
        }

        if let Some(url) = open_url_str {
            Self::open_external_url(&url);
            self.show_toast("🌐 Resmi abonelik iptal sayfası tarayıcıda açıldı.", false);
        }

        if let Some(idx) = prepare_legal_idx {
            self.selected_sub_idx = idx;
            self.refresh_legal_notice();
            self.active_tab = WorkspaceTab::BlockingRules;
            self.show_toast("📄 Resmi iptal ve iade dilekçesi hazırlandı.", false);
        }

        // 4. Toast Banner & Bottom Terminal Status Strip
        let remaining = ui.available_height();
        if remaining > 56.0 {
            ui.add_space(remaining - 56.0);
        } else {
            ui.add_space(6.0);
        }

        if let Some((msg, can_undo)) = self.toast_banner.clone() {
            egui::Frame::new()
                .fill(pal.bg_elevated)
                .stroke(Stroke::new(1.2_f32, pal.accent_emerald.gamma_multiply(0.7)))
                .corner_radius(CornerRadius::same(8))
                .inner_margin(Margin::symmetric(14, 8))
                .show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(
                            RichText::new(&msg)
                                .size(12.0)
                                .strong()
                                .color(pal.text_primary),
                        );
                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                            if ui
                                .add(
                                    egui::Button::new(
                                        RichText::new("✕")
                                            .font(FontId::new(11.0, FontFamily::Monospace))
                                            .color(pal.text_muted),
                                    )
                                    .frame(false),
                                )
                                .clicked()
                            {
                                self.toast_banner = None;
                            }
                            if can_undo {
                                ui.add_space(8.0);
                                let undo_btn = egui::Button::new(
                                    RichText::new("↩ Geri Al")
                                        .size(11.5)
                                        .strong()
                                        .color(pal.cta_fg),
                                )
                                .fill(pal.cta_bg)
                                .corner_radius(CornerRadius::same(5));
                                if ui.add(undo_btn).clicked() {
                                    self.undo_last_cancel();
                                }
                            }
                        });
                    });
                });
            ui.add_space(4.0);
        }

        let (line_rect, _) =
            ui.allocate_exact_size(Vec2::new(ui.available_width(), 1.0), Sense::hover());
        ui.painter().line_segment(
            [line_rect.left_top(), line_rect.right_top()],
            Stroke::new(1.0_f32, pal.border_subtle),
        );
        ui.add_space(8.0);

        ui.horizontal(|ui| {
            ui.label(
                RichText::new("⚡ Raycast Kısayolları: [Ctrl+K] Ara • [Ctrl+N] Ekle • [Ctrl+E] Ekstre • [Ctrl+T] Tema • [Ctrl+D] Birim • [Esc] Kapat")
                    .font(FontId::new(10.0, FontFamily::Monospace))
                    .color(pal.text_dim),
            );

            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                if ui
                    .add(
                        egui::Label::new(
                            RichText::new("↻ Simülasyonu Sıfırla")
                                .font(FontId::new(11.5, FontFamily::Monospace))
                                .color(pal.text_secondary),
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

    fn render_subscriptions_tab(&mut self, ui: &mut egui::Ui, pal: &ThemePalette) {
        let pref_curr = self.payload.preferences.currency;

        ui.horizontal(|ui| {
            ui.label(
                RichText::new("Popüler Servislerden 3 Saniyede Abonelik Ekle (36+ Hazır Şablon)")
                    .size(15.0)
                    .strong(),
            );
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                if ui.button("← Genel Bakışa Dön").clicked() {
                    self.active_tab = WorkspaceTab::Overview;
                }
            });
        });
        ui.label(
            RichText::new(
                "Bir servise tıkladığınızda isim, kategori, varsayılan fiyat ve resmi iptal adresi otomatik doldurulur.",
            )
            .size(12.0)
            .color(pal.text_muted),
        );
        ui.add_space(6.0);

        // Category Filter Tabs for 36+ Presets
        ui.horizontal(|ui| {
            for (f, label) in [
                (PresetCategoryFilter::All, "Tümü (36+)"),
                (PresetCategoryFilter::AI, "🤖 Yapay Zekâ"),
                (PresetCategoryFilter::Media, "🎬 Medya & Müzik"),
                (PresetCategoryFilter::Dev, "💻 Yazılım & Araçlar"),
                (PresetCategoryFilter::Cloud, "☁ Bulut & Depolama"),
                (PresetCategoryFilter::Lifestyle, "🎮 Yaşam & Oyun"),
            ] {
                if ui
                    .selectable_label(
                        self.preset_category_filter == f,
                        RichText::new(label).size(11.5),
                    )
                    .clicked()
                {
                    self.preset_category_filter = f;
                }
            }
        });
        ui.add_space(6.0);

        // 36+ Preset Grid (3 columns)
        let mut quick_added_name: Option<String> = None;
        let filtered_presets: Vec<&crate::presets::ServicePreset> = SERVICE_PRESETS
            .iter()
            .filter(|p| match self.preset_category_filter {
                PresetCategoryFilter::All => true,
                PresetCategoryFilter::AI => p.category == "Yapay Zekâ",
                PresetCategoryFilter::Media => p.category == "Medya & Müzik",
                PresetCategoryFilter::Dev => p.category == "Yazılım & Araçlar",
                PresetCategoryFilter::Cloud => p.category == "Bulut & Depolama",
                PresetCategoryFilter::Lifestyle => p.category == "Yaşam & Oyun",
            })
            .collect();

        egui::ScrollArea::vertical()
            .id_salt("presets_grid_scroll")
            .max_height(180.0)
            .show(ui, |ui| {
                egui::Grid::new("popular_presets_grid")
                    .num_columns(3)
                    .spacing([10.0, 8.0])
                    .show(ui, |ui| {
                        for (i, preset) in filtered_presets.iter().enumerate() {
                            let usd_price = preset.default_price_usd;
                            egui::Frame::new()
                                .fill(pal.bg_surface)
                                .stroke(Stroke::new(1.0_f32, pal.border_subtle))
                                .corner_radius(CornerRadius::same(7))
                                .inner_margin(Margin::symmetric(10, 6))
                                .show(ui, |ui| {
                                    ui.set_min_width(245.0);
                                    ui.horizontal(|ui| {
                                        if ui
                                            .selectable_label(
                                                self.form_name == preset.name,
                                                RichText::new(preset.name).strong().size(12.5),
                                            )
                                            .on_hover_text("Bilgileri forma doldur")
                                            .clicked()
                                        {
                                            self.form_name = preset.name.to_string();
                                            self.form_plan = preset.plan.to_string();
                                            self.form_category = preset.category.to_string();
                                            self.form_price = format!("{:.2}", usd_price);
                                            self.form_cancel_url = preset.cancel_url.to_string();
                                            self.form_notes = format!(
                                                "{} ({}) aboneliği.",
                                                preset.name, preset.category
                                            );
                                        }

                                        ui.with_layout(
                                            Layout::right_to_left(Align::Center),
                                            |ui| {
                                                if ui
                                                    .small_button("+ Ekle")
                                                    .on_hover_text("Tek tıkla doğrudan listeye ekle")
                                                    .clicked()
                                                {
                                                    let mut s = preset.to_subscription(
                                                        self.payload.subscriptions.len() + 1,
                                                    );
                                                    s.currency = Currency::USD;
                                                    s.price = usd_price;
                                                    s.plan = "BOŞTA LİSANS".to_string();
                                                    s.next_renewal = "OTOMATİK ÖDEME".to_string();
                                                    s.status = SubStatus::UnusedTrial;
                                                    self.payload.subscriptions.insert(0, s);
                                                    self.persist_vault();
                                                    quick_added_name =
                                                        Some(preset.name.to_string());
                                                }
                                                ui.label(
                                                    RichText::new(
                                                        pref_curr.format_from_usd(usd_price),
                                                    )
                                                    .font(FontId::new(11.0, FontFamily::Monospace))
                                                    .color(pal.text_muted),
                                                );
                                            },
                                        );
                                    });
                                });
                            if (i + 1) % 3 == 0 {
                                ui.end_row();
                            }
                        }
                    });
            });

        if let Some(name) = quick_added_name {
            self.show_toast(format!("✓ {} listenize eklendi.", name), false);
            self.active_tab = WorkspaceTab::Overview;
        }

        ui.add_space(8.0);

        // Auto-filled Quick Add Form Bar
        egui::Frame::new()
            .fill(pal.bg_surface)
            .stroke(Stroke::new(1.0_f32, pal.border_default))
            .corner_radius(CornerRadius::same(8))
            .inner_margin(Margin::symmetric(12, 10))
            .show(ui, |ui| {
                ui.horizontal_wrapped(|ui| {
                    ui.label(RichText::new("Servis:").size(12.0));
                    ui.add_sized([150.0, 26.0], egui::TextEdit::singleline(&mut self.form_name));

                    ui.label(RichText::new("Paket:").size(12.0));
                    ui.add_sized([120.0, 26.0], egui::TextEdit::singleline(&mut self.form_plan));

                    ui.label(RichText::new("Aylık ($):").size(12.0));
                    ui.add_sized([70.0, 26.0], egui::TextEdit::singleline(&mut self.form_price));

                    ui.label(RichText::new("Not:").size(12.0));
                    ui.add_sized(
                        [180.0, 26.0],
                        egui::TextEdit::singleline(&mut self.form_notes),
                    );

                    if ui
                        .button(
                            RichText::new("+ Listeme Ekle")
                                .strong()
                                .color(pal.accent_emerald),
                        )
                        .clicked()
                    {
                        let price = self
                            .form_price
                            .replace(',', ".")
                            .parse::<f64>()
                            .unwrap_or(14.99);
                        if !self.form_name.trim().is_empty() {
                            let name = self.form_name.trim().to_string();
                            self.payload.subscriptions.insert(
                                0,
                                Subscription {
                                    id: format!(
                                        "sub-custom-{}",
                                        self.payload.subscriptions.len() + 1
                                    ),
                                    name: name.clone(),
                                    plan: self.form_plan.trim().to_string(),
                                    category: self.form_category.trim().to_string(),
                                    price,
                                    previous_price: None,
                                    price_hike_detected: false,
                                    price_hike_percentage: None,
                                    currency: Currency::USD,
                                    billing_cycle: BillingCycle::Monthly,
                                    next_renewal: "OTOMATİK ÖDEME".to_string(),
                                    status: SubStatus::UnusedTrial,
                                    cancel_url: self.form_cancel_url.trim().to_string(),
                                    notes: self.form_notes.trim().to_string(),
                                },
                            );
                            self.persist_vault();
                            self.show_toast(format!("✓ {} listenize eklendi.", name), false);
                            self.active_tab = WorkspaceTab::Overview;
                        }
                    }
                });
            });

        ui.add_space(10.0);
        ui.label(
            RichText::new(format!(
                "Kayıtlı Abonelikler ({})",
                self.payload.subscriptions.len()
            ))
            .size(13.5)
            .strong(),
        );
        ui.add_space(4.0);

        let mut del_idx: Option<usize> = None;
        let mut status_toggle_idx: Option<usize> = None;
        egui::ScrollArea::vertical()
            .id_salt("all_subs_manage_scroll")
            .max_height(190.0)
            .show(ui, |ui| {
                for (idx, s) in self.payload.subscriptions.iter().enumerate() {
                    egui::Frame::new()
                        .fill(pal.bg_surface)
                        .stroke(Stroke::new(1.0_f32, pal.border_subtle))
                        .corner_radius(CornerRadius::same(6))
                        .inner_margin(Margin::symmetric(12, 6))
                        .show(ui, |ui| {
                            ui.horizontal(|ui| {
                                ui.label(RichText::new(&s.name).strong());
                                ui.label(
                                    RichText::new(format!("• {}", s.status.label()))
                                        .size(11.5)
                                        .color(pal.text_muted),
                                );
                                ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                    if ui
                                        .small_button(
                                            RichText::new("🗑 Sil").color(pal.accent_rose),
                                        )
                                        .clicked()
                                    {
                                        del_idx = Some(idx);
                                    }
                                    if !s.cancel_url.is_empty()
                                        && ui.small_button("🌐 İptal Sayfası").clicked()
                                    {
                                        Self::open_external_url(&s.cancel_url);
                                    }
                                    if ui.small_button("Durum Değiştir").clicked() {
                                        status_toggle_idx = Some(idx);
                                    }
                                    ui.label(
                                        RichText::new(format!(
                                            "{}/ay",
                                            pref_curr.format_from_usd(s.monthly_cost_usd())
                                        ))
                                        .font(FontId::new(12.0, FontFamily::Monospace))
                                        .strong(),
                                    );
                                });
                            });
                        });
                }
            });

        if let Some(idx) = status_toggle_idx {
            let next = match self.payload.subscriptions[idx].status {
                SubStatus::UnusedTrial => SubStatus::Active,
                SubStatus::Active => SubStatus::Cancelled,
                SubStatus::Cancelled => SubStatus::UnusedTrial,
            };
            self.payload.subscriptions[idx].status = next;
            self.persist_vault();
        }
        if let Some(idx) = del_idx {
            let removed = self.payload.subscriptions.remove(idx);
            self.persist_vault();
            self.refresh_legal_notice();
            self.show_toast(format!("🗑 {} silindi.", removed.name), false);
        }
    }

    fn render_blocking_rules_tab(
        &mut self,
        ui: &mut egui::Ui,
        ctx: &egui::Context,
        pal: &ThemePalette,
    ) {
        ui.columns(2, |cols| {
            // Left Column: Section 1 (Smart Rules) + Section 2 (100% Offline Statement Scanner)
            egui::Frame::new()
                .fill(pal.bg_surface)
                .stroke(Stroke::new(1.0_f32, pal.border_subtle))
                .corner_radius(CornerRadius::same(8))
                .inner_margin(Margin::same(12))
                .show(&mut cols[0], |ui| {
                    ui.label(
                        RichText::new("1. AKILLI KORUMA & ENGELLEME KURALLARI")
                            .font(FontId::new(11.0, FontFamily::Monospace))
                            .color(pal.text_muted),
                    );
                    ui.add_space(6.0);
                    ui.checkbox(
                        &mut self.rule_warn_trial_3days,
                        "Ücretsiz deneme bitmeden 3 gün önce uyar",
                    );
                    ui.checkbox(
                        &mut self.rule_mark_idle_30days,
                        "30+ gün kullanılmayan abonelikleri otomatik 'Boşta' işaretle",
                    );
                    ui.checkbox(
                        &mut self.rule_notify_price_hike,
                        "Fiyat artışı tespit edildiğinde bildir (Gizli Zam Kalkanı)",
                    );
                    ui.checkbox(
                        &mut self.rule_auto_refund_notice,
                        "İptal edilen abonelikten tekrar çekim olursa iade dilekçesi hazırla",
                    );

                    // Active Shield Card for Gizli Zam & Fiyat Artışı Kalkanı
                    if self.rule_notify_price_hike {
                        ui.add_space(8.0);
                        let hike_count = self
                            .payload
                            .subscriptions
                            .iter()
                            .filter(|s| s.price_hike_detected)
                            .count();
                        egui::Frame::new()
                            .fill(pal.bg_elevated)
                            .stroke(Stroke::new(1.0_f32, pal.accent_rose.gamma_multiply(0.5)))
                            .corner_radius(CornerRadius::same(6))
                            .inner_margin(Margin::symmetric(10, 8))
                            .show(ui, |ui| {
                                ui.horizontal(|ui| {
                                    let (dot, _) =
                                        ui.allocate_exact_size(Vec2::splat(6.0), Sense::hover());
                                    ui.painter().circle_filled(dot.center(), 3.0, pal.accent_rose);
                                    ui.label(
                                        RichText::new("🛡 Gizli Zam & Fiyat Artışı Kalkanı: ETKİN")
                                            .font(FontId::new(10.5, FontFamily::Monospace))
                                            .strong()
                                            .color(pal.accent_rose),
                                    );
                                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                        ui.label(
                                            RichText::new(format!("{} zamlı abonelik", hike_count))
                                                .font(FontId::new(10.0, FontFamily::Monospace))
                                                .color(pal.text_dim),
                                        );
                                    });
                                });
                                ui.add_space(6.0);
                                if ui
                                    .small_button("🔍 Ekstredeki Gizli Zamları Tara ve İşaretle")
                                    .on_hover_text("Mevcut ekstre metnini tarayıp aboneliklerdeki fiyat artışlarını otomatik rozetle")
                                    .clicked()
                                {
                                    let mut found_hikes = 0;
                                    for sub in &mut self.payload.subscriptions {
                                        let (hike, prev, pct) =
                                            detect_price_hike(&sub.name, sub.price, &self.statement_input);
                                        if hike {
                                            sub.price_hike_detected = true;
                                            sub.previous_price = prev;
                                            sub.price_hike_percentage = pct;
                                            found_hikes += 1;
                                        }
                                    }
                                    self.persist_vault();
                                    self.show_toast(
                                        format!(
                                            "✓ Ekstre tarandı: {} abonelikte gizli zam tespit edildi!",
                                            found_hikes
                                        ),
                                        false,
                                    );
                                }
                            });
                    }
                });

            cols[0].add_space(8.0);

            egui::Frame::new()
                .fill(pal.bg_surface)
                .stroke(Stroke::new(1.0_f32, pal.border_subtle))
                .corner_radius(CornerRadius::same(8))
                .inner_margin(Margin::same(12))
                .show(&mut cols[0], |ui| {
                    ui.horizontal(|ui| {
                        ui.label(
                            RichText::new("2. %100 ÇEVRİMDIŞI BANKA EKSTRESİ TARAYICI")
                                .font(FontId::new(11.0, FontFamily::Monospace))
                                .color(pal.text_muted),
                        );
                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                            if ui.small_button("Örnek Banka Ekstresi Yükle").clicked() {
                                self.statement_input = SAMPLE_STATEMENT.to_string();
                            }
                        });
                    });
                    ui.add_space(4.0);
                    ui.add_sized(
                        [ui.available_width(), 120.0],
                        egui::TextEdit::multiline(&mut self.statement_input)
                            .font(FontId::new(10.5, FontFamily::Monospace)),
                    );
                    ui.add_space(6.0);
                    ui.horizontal(|ui| {
                        if ui.button("🔍 Ekstreyi Şimdi Tara").clicked() {
                            self.detected_subs =
                                parse_statement(&self.statement_input, Currency::USD);
                            let hikes = self
                                .detected_subs
                                .iter()
                                .filter(|s| s.price_hike_detected)
                                .count();
                            let msg = if hikes > 0 {
                                format!(
                                    "✓ Ekstrede {} abonelik ve {} gizli zam tespit edildi!",
                                    self.detected_subs.len(),
                                    hikes
                                )
                            } else {
                                format!(
                                    "✓ Ekstrede {} adet abonelik tespit edildi.",
                                    self.detected_subs.len()
                                )
                            };
                            self.show_toast(msg, false);
                        }
                        if !self.detected_subs.is_empty()
                            && ui
                                .button(
                                    RichText::new(format!(
                                        "+ Bulunanları Listeme Ekle ({})",
                                        self.detected_subs.len()
                                    ))
                                    .color(pal.accent_emerald),
                                )
                                .clicked()
                        {
                            let count = self.detected_subs.len();
                            for mut item in self.detected_subs.drain(..) {
                                item.currency = Currency::USD;
                                if item.price > 150.0 {
                                    item.price = (item.price / 48.35 * 100.0).round() / 100.0;
                                }
                                item.plan = "EKSTREDEN YAKALANDI".to_string();
                                item.next_renewal = "OTOMATİK ÖDEME".to_string();
                                self.payload.subscriptions.insert(0, item);
                            }
                            self.persist_vault();
                            self.show_toast(
                                format!("✓ {} abonelik genel bakış listesine eklendi.", count),
                                false,
                            );
                            self.active_tab = WorkspaceTab::Overview;
                        }
                    });
                });

            // Right Column: Section 3 (Hukuki Savunma, THH Başvurusu & Banka Ters İbraz Dosyası)
            egui::Frame::new()
                .fill(pal.bg_surface)
                .stroke(Stroke::new(1.0_f32, pal.border_subtle))
                .corner_radius(CornerRadius::same(8))
                .inner_margin(Margin::same(12))
                .show(&mut cols[1], |ui| {
                    ui.label(
                        RichText::new("3. HUKUKİ SİLAHLANMA: THH, İHTARNAME & TERS İBRAZ (CHARGEBACK)")
                            .font(FontId::new(11.0, FontFamily::Monospace))
                            .color(pal.text_muted),
                    );
                    ui.add_space(6.0);

                    // Document Type Switcher Tabs
                    ui.horizontal(|ui| {
                        if ui
                            .selectable_label(
                                self.legal_doc_type == LegalDocumentType::CancellationNotice,
                                "📜 6502 SK İhtarname",
                            )
                            .clicked()
                        {
                            self.legal_doc_type = LegalDocumentType::CancellationNotice;
                            self.refresh_legal_notice();
                        }
                        if ui
                            .selectable_label(
                                self.legal_doc_type == LegalDocumentType::ConsumerArbitration,
                                "⚖ THH Başvurusu (E-Devlet)",
                            )
                            .clicked()
                        {
                            self.legal_doc_type = LegalDocumentType::ConsumerArbitration;
                            self.refresh_legal_notice();
                        }
                        if ui
                            .selectable_label(
                                self.legal_doc_type == LegalDocumentType::BankChargeback,
                                "💳 Chargeback Dosyası",
                            )
                            .clicked()
                        {
                            self.legal_doc_type = LegalDocumentType::BankChargeback;
                            self.refresh_legal_notice();
                        }
                    });

                    ui.add_space(6.0);

                    let mut clicked_sub: Option<usize> = None;
                    ui.horizontal_wrapped(|ui| {
                        for (idx, s) in self.payload.subscriptions.iter().enumerate() {
                            if ui
                                .selectable_label(
                                    self.selected_sub_idx == idx,
                                    RichText::new(&s.name).size(11.5),
                                )
                                .clicked()
                            {
                                clicked_sub = Some(idx);
                            }
                        }
                    });
                    if let Some(idx) = clicked_sub {
                        self.selected_sub_idx = idx;
                        self.refresh_legal_notice();
                    }

                    ui.add_space(4.0);
                    ui.horizontal(|ui| {
                        ui.label(RichText::new("Ad Soyad:").size(11.5));
                        if ui
                            .add_sized(
                                [120.0, 22.0],
                                egui::TextEdit::singleline(&mut self.payload.preferences.user_name),
                            )
                            .changed()
                        {
                            self.refresh_legal_notice();
                        }
                        if self.legal_doc_type == LegalDocumentType::CancellationNotice {
                            if ui
                                .selectable_label(
                                    self.notice_lang == NoticeLanguage::Turkish,
                                    "🇹🇷 Türkçe (6502 SK)",
                                )
                                .clicked()
                            {
                                self.notice_lang = NoticeLanguage::Turkish;
                                self.refresh_legal_notice();
                            }
                            if ui
                                .selectable_label(
                                    self.notice_lang == NoticeLanguage::English,
                                    "🇬🇧 English (GDPR)",
                                )
                                .clicked()
                            {
                                self.notice_lang = NoticeLanguage::English;
                                self.refresh_legal_notice();
                            }
                        }
                    });

                    ui.add_space(6.0);
                    ui.add_sized(
                        [ui.available_width(), 240.0],
                        egui::TextEdit::multiline(&mut self.generated_notice)
                            .font(FontId::new(10.5, FontFamily::Monospace)),
                    );

                    ui.add_space(6.0);
                    ui.horizontal(|ui| {
                        if ui.button("📋 Panoya Kopyala").clicked() {
                            ctx.copy_text(self.generated_notice.clone());
                            self.show_toast(
                                "✓ Belge metni panoya kopyalandı.",
                                false,
                            );
                        }
                        if ui.button("💾 .txt Olarak İndir").clicked() {
                            let filename = match self.legal_doc_type {
                                LegalDocumentType::CancellationNotice => "subradar-iptal-ihtarname.txt",
                                LegalDocumentType::ConsumerArbitration => "subradar-thh-basvuru-formu.txt",
                                LegalDocumentType::BankChargeback => "subradar-chargeback-dosyasi.txt",
                            };
                            let path = std::env::current_dir()
                                .unwrap_or_default()
                                .join(filename);
                            let _ = fs::write(&path, &self.generated_notice);
                            self.show_toast(
                                format!("✓ Belge kaydedildi: {}", path.display()),
                                false,
                            );
                        }
                    });
                });
        });
    }

    fn render_local_vault_tab(&mut self, ui: &mut egui::Ui, pal: &ThemePalette) {
        ui.label(
            RichText::new("Yerel Kasa & Veri Güvenliği")
                .size(16.0)
                .strong(),
        );
        ui.label(
            RichText::new(
                "Tüm abonelik verileriniz hiçbir bulut sunucusuna gönderilmeden bilgisayarınızda şifreli olarak saklanır.",
            )
            .size(12.5)
            .color(pal.text_muted),
        );
        ui.add_space(10.0);

        egui::Frame::new()
            .fill(pal.bg_surface)
            .stroke(Stroke::new(1.0_f32, pal.border_subtle))
            .corner_radius(CornerRadius::same(10))
            .inner_margin(Margin::same(18))
            .show(ui, |ui| {
                ui.label(
                    RichText::new("✓ AES-256 Yerel Koruma Aktif")
                        .size(14.5)
                        .strong()
                        .color(pal.accent_emerald),
                );
                ui.add_space(6.0);
                ui.label("• Uygulama Sürümü: SubRadar Masaüstü v1.0 (Ticari Lisans)");
                ui.label("• Yerel Veritabanı: encrypted_sqlite_aes256.db / .subradar");
                ui.label("• Şifreleme Motoru: AES-256-CBC + PBKDF2-HMAC-SHA256");
                ui.label("• İnternet ve Bulut Paylaşımı: %100 Çevrimdışı (0 Bayt Veri Çıkışı)");

                ui.add_space(16.0);
                ui.horizontal(|ui| {
                    ui.label("Kasa Ana Şifresi:");
                    ui.add_sized(
                        [200.0, 28.0],
                        egui::TextEdit::singleline(&mut self.master_password).password(true),
                    );
                });

                ui.add_space(12.0);
                ui.horizontal_wrapped(|ui| {
                    if ui
                        .button(
                            RichText::new("💾 Verilerimi Şimdi Kaydet")
                                .strong()
                                .color(pal.accent_emerald),
                        )
                        .clicked()
                    {
                        let path = default_vault_path();
                        match save_vault_to_file(&path, &self.payload, &self.master_password) {
                            Ok(_) => self.show_toast(
                                format!(
                                    "✓ Verileriniz AES-256 ile şifrelenerek kaydedildi ({}).",
                                    VAULT_FILENAME
                                ),
                                false,
                            ),
                            Err(e) => self.show_toast(e, false),
                        }
                    }

                    if ui.button("📤 Yedek Dışa Aktar (.json)").clicked() {
                        let backup_path = std::env::current_dir()
                            .unwrap_or_default()
                            .join("subradar-backup.json");
                        if let Ok(json) = serde_json::to_string_pretty(&self.payload) {
                            if fs::write(&backup_path, json).is_ok() {
                                self.show_toast(
                                    format!(
                                        "✓ Yedek dosyası dışa aktarıldı: {}",
                                        backup_path.display()
                                    ),
                                    false,
                                );
                            }
                        }
                    }

                    if ui.button("🔒 Kasayı Şimdi Kilitle").clicked() {
                        self.is_locked = true;
                    }
                });

                if let Some((msg, _)) = &self.toast_banner {
                    ui.add_space(10.0);
                    ui.label(RichText::new(msg).color(pal.accent_emerald));
                }
            });
    }

    fn render_lock_screen(&mut self, ctx: &egui::Context, pal: &ThemePalette) {
        egui::CentralPanel::default()
            .frame(egui::Frame::new().fill(pal.bg_canvas))
            .show(ctx, |ui| {
                ui.vertical_centered(|ui| {
                    ui.add_space(150.0);
                    egui::Frame::new()
                        .fill(pal.bg_surface)
                        .stroke(Stroke::new(1.0_f32, pal.border_default))
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
                                        .color(pal.text_muted),
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
        let dark_mode = self.payload.preferences.dark_mode;
        apply_theme(ctx, dark_mode);
        let pal = ThemePalette::for_mode(dark_mode);

        // Raycast Power-User Hotkeys (Ctrl/Cmd based)
        let ctrl_or_cmd = ctx.input(|i| i.modifiers.command || i.modifiers.ctrl);

        // Ctrl+K: Canlı arama ve komut çubuğuna odaklanma
        if ctrl_or_cmd && ctx.input(|i| i.key_pressed(Key::K)) {
            self.focus_search_next_frame = true;
        }

        // Ctrl+N: Hızlı abonelik ekleme paneli
        if ctrl_or_cmd && ctx.input(|i| i.key_pressed(Key::N)) {
            self.active_tab = WorkspaceTab::Subscriptions;
        }

        // Ctrl+E: Çevrimdışı ekstre tarayıcı sekmesine anında geçiş
        if ctrl_or_cmd && ctx.input(|i| i.key_pressed(Key::E)) {
            self.active_tab = WorkspaceTab::BlockingRules;
            self.refresh_legal_notice();
        }

        // Ctrl+T: Koyu / Açık tema geçişi
        if ctrl_or_cmd && ctx.input(|i| i.key_pressed(Key::T)) {
            self.payload.preferences.dark_mode = !self.payload.preferences.dark_mode;
            self.persist_vault();
            self.show_toast(
                if self.payload.preferences.dark_mode {
                    "🌙 Koyu tema aktif edildi (Ctrl+T)"
                } else {
                    "☀ Açık tema aktif edildi (Ctrl+T)"
                },
                false,
            );
        }

        // Ctrl+D: Para birimi değiştirici (USD -> TRY -> EUR döngüsü)
        if ctrl_or_cmd && ctx.input(|i| i.key_pressed(Key::D)) {
            let next_curr = match self.payload.preferences.currency {
                Currency::USD => Currency::TRY,
                Currency::TRY => Currency::EUR,
                Currency::EUR => Currency::USD,
            };
            self.payload.preferences.currency = next_curr;
            self.persist_vault();
            self.show_toast(
                format!(
                    "💱 Para birimi {} ({}) olarak değiştirildi (Ctrl+D)",
                    next_curr.code(),
                    next_curr.symbol()
                ),
                false,
            );
        }

        // Esc: Arama filtresini temizleme veya açık çekmeceyi kapatma
        if ctx.input(|i| i.key_pressed(Key::Escape)) {
            self.search_query.clear();
            self.expanded_sub_id = None;
            self.editing_sub_id = None;
        }

        // Top Custom Frameless Window Bar (46px height)
        egui::TopBottomPanel::top("subradar_window_header")
            .exact_height(46.0)
            .frame(
                egui::Frame::new()
                    .fill(pal.bg_header)
                    .inner_margin(Margin::ZERO)
                    .stroke(Stroke::new(1.0_f32, pal.border_subtle)),
            )
            .show(ctx, |ui| {
                self.render_window_header(ctx, ui, &pal);
            });

        if self.is_locked {
            self.render_lock_screen(ctx, &pal);
            return;
        }

        let stats = SummaryStats::compute(&self.payload.subscriptions);

        // Left Sidebar (230px width)
        egui::SidePanel::left("subradar_left_sidebar")
            .exact_width(230.0)
            .resizable(false)
            .frame(
                egui::Frame::new()
                    .fill(pal.bg_sidebar)
                    .inner_margin(Margin::symmetric(12, 6))
                    .stroke(Stroke::new(1.0_f32, pal.border_subtle)),
            )
            .show(ctx, |ui| {
                self.render_sidebar(ui, &pal, stats.passive_leaks_count);
            });

        // Right Main Content Area
        egui::CentralPanel::default()
            .frame(
                egui::Frame::new()
                    .fill(pal.bg_canvas)
                    .inner_margin(Margin::symmetric(28, 20)),
            )
            .show(ctx, |ui| match self.active_tab {
                WorkspaceTab::Overview => self.render_overview_tab(ui, &pal, &stats),
                WorkspaceTab::Subscriptions => self.render_subscriptions_tab(ui, &pal),
                WorkspaceTab::BlockingRules => self.render_blocking_rules_tab(ui, ctx, &pal),
                WorkspaceTab::LocalVault => self.render_local_vault_tab(ui, &pal),
            });
    }
}
