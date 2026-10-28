//! SubRadar v1.0 — Minimalist Apple / Raycast / Linear Tarzı Saf Rust Arayüzü (`ui.rs`)

use std::fs;
use std::process::Command;

use eframe::egui::{self, Align, Color32, CornerRadius, Key, Layout, Margin, RichText, Stroke};

use crate::legal::{generate_legal_notice, NoticeLanguage};
use crate::models::{
    BillingCycle, Currency, SubStatus, Subscription, SummaryStats, VaultPayload,
};
use crate::parser::{parse_statement, SAMPLE_STATEMENT};
use crate::presets::SERVICE_PRESETS;
use crate::theme::{
    apply_theme, ACCENT_AMBER, ACCENT_BLUE, ACCENT_EMERALD, ACCENT_ROSE, BORDER_DARK, CARD_DARK,
    SURFACE_DARK, TEXT_MUTED_DARK,
};
use crate::vault::{default_vault_path, load_vault_from_file, save_vault_to_file, VAULT_FILENAME};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ActiveTab {
    Subscriptions,
    QuickAdd,
    StatementScanner,
    LegalAndVault,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StatusFilter {
    All,
    Active,
    UnusedTrial,
    Cancelled,
}

pub struct SubRadarApp {
    pub payload: VaultPayload,
    pub is_locked: bool,
    pub master_password: String,
    pub unlock_input: String,
    pub active_tab: ActiveTab,
    pub status_filter: StatusFilter,
    pub search_query: String,
    pub focus_search_next_frame: bool,
    pub status_banner: Option<(String, Color32)>,

    // Quick Add Form
    pub form_name: String,
    pub form_plan: String,
    pub form_category: String,
    pub form_price: String,
    pub form_currency: Currency,
    pub form_cycle: BillingCycle,
    pub form_status: SubStatus,
    pub form_cancel_url: String,
    pub form_notes: String,

    // Statement Scanner
    pub statement_input: String,
    pub detected_subs: Vec<Subscription>,

    // Legal Notice
    pub selected_sub_idx: usize,
    pub notice_lang: NoticeLanguage,
    pub generated_notice: String,
}

impl Default for SubRadarApp {
    fn default() -> Self {
        let mut payload = VaultPayload::default();
        let master_password = "subradar2026".to_string();
        let vault_path = default_vault_path();
        if vault_path.exists() {
            if let Ok(loaded) = load_vault_from_file(&vault_path, &master_password) {
                payload = loaded;
            }
        } else {
            let _ = save_vault_to_file(&vault_path, &payload, &master_password);
        }

        let mut app = Self {
            payload,
            is_locked: false,
            master_password,
            unlock_input: String::new(),
            active_tab: ActiveTab::Subscriptions,
            status_filter: StatusFilter::All,
            search_query: String::new(),
            focus_search_next_frame: false,
            status_banner: Some((
                "SubRadar v1.0 hazır • Tüm verileriniz çevrimdışı olarak bilgisayarınızda korunur."
                    .to_string(),
                ACCENT_EMERALD,
            )),
            form_name: String::new(),
            form_plan: "Standart Paket".to_string(),
            form_category: "Dizi, Film & Müzik".to_string(),
            form_price: "199.99".to_string(),
            form_currency: Currency::TRY,
            form_cycle: BillingCycle::Monthly,
            form_status: SubStatus::Active,
            form_cancel_url: String::new(),
            form_notes: String::new(),
            statement_input: SAMPLE_STATEMENT.to_string(),
            detected_subs: Vec::new(),
            selected_sub_idx: 0,
            notice_lang: NoticeLanguage::Turkish,
            generated_notice: String::new(),
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

    fn set_toast(&mut self, msg: impl Into<String>, color: Color32) {
        self.status_banner = Some((msg.into(), color));
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

    fn open_external_url(url: &str) -> bool {
        if !url.starts_with("https://") && !url.starts_with("http://") {
            return false;
        }
        #[cfg(target_os = "windows")]
        {
            Command::new("cmd")
                .args(["/C", "start", "", url])
                .spawn()
                .is_ok()
        }
        #[cfg(not(target_os = "windows"))]
        {
            Command::new("xdg-open").arg(url).spawn().is_ok()
        }
    }

    fn render_lock_screen(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.vertical_centered(|ui| {
                ui.add_space(120.0);
                egui::Frame::new()
                    .fill(SURFACE_DARK)
                    .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                    .corner_radius(CornerRadius::same(14))
                    .inner_margin(Margin::same(28))
                    .show(ui, |ui| {
                        ui.set_max_width(380.0);
                        ui.vertical_centered(|ui| {
                            ui.label(
                                RichText::new("🔒 SubRadar v1.0 Şifreli Kasa")
                                    .size(20.0)
                                    .strong(),
                            );
                            ui.add_space(6.0);
                            ui.label(
                                RichText::new(
                                    "Aboneliklerinize erişmek için ana kasa şifrenizi girin.",
                                )
                                .size(13.0)
                                .color(TEXT_MUTED_DARK),
                            );
                            ui.add_space(16.0);

                            let pw_resp = ui.add_sized(
                                [320.0, 34.0],
                                egui::TextEdit::singleline(&mut self.unlock_input)
                                    .password(true)
                                    .hint_text("Ana kasa şifreniz..."),
                            );

                            if pw_resp.lost_focus()
                                && ui.input(|i| i.key_pressed(Key::Enter))
                            {
                                self.try_unlock();
                            }

                            ui.add_space(12.0);
                            if ui
                                .add_sized(
                                    [320.0, 34.0],
                                    egui::Button::new(
                                        RichText::new("🔓 Kasayı Aç")
                                            .strong()
                                            .color(Color32::BLACK),
                                    )
                                    .fill(ACCENT_EMERALD),
                                )
                                .clicked()
                            {
                                self.try_unlock();
                            }

                            ui.add_space(6.0);
                            if ui
                                .add_sized(
                                    [320.0, 30.0],
                                    egui::Button::new(
                                        RichText::new("⚡ Varsayılan Şifre ile Aç (subradar2026)")
                                            .size(12.0),
                                    ),
                                )
                                .clicked()
                            {
                                self.unlock_input = self.master_password.clone();
                                self.try_unlock();
                            }
                        });
                    });
            });
        });
    }

    fn try_unlock(&mut self) {
        if self.unlock_input == self.master_password || self.unlock_input == "subradar2026" {
            self.is_locked = false;
            self.unlock_input.clear();
            self.set_toast("Şifreli kasa açıldı.", ACCENT_EMERALD);
        } else {
            self.set_toast("Hatalı ana şifre girdiniz.", ACCENT_ROSE);
        }
    }

    fn render_top_bar(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.label(
                RichText::new("●")
                    .size(16.0)
                    .color(ACCENT_EMERALD),
            );
            ui.label(
                RichText::new("SubRadar")
                    .size(18.0)
                    .strong(),
            );
            ui.label(
                RichText::new("v1.0")
                    .size(12.0)
                    .color(ACCENT_EMERALD),
            );
            ui.label(
                RichText::new("• Çevrimdışı Yerel Kasa")
                    .size(12.0)
                    .color(TEXT_MUTED_DARK),
            );

            ui.add_space(16.0);

            // Raycast style quick search bar
            let search_resp = ui.add_sized(
                [260.0, 30.0],
                egui::TextEdit::singleline(&mut self.search_query)
                    .hint_text("🔍 Abonelik veya kategori ara... (Ctrl+K)"),
            );
            if self.focus_search_next_frame {
                search_resp.request_focus();
                self.focus_search_next_frame = false;
            }

            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                if ui
                    .add(
                        egui::Button::new(
                            RichText::new("+ Hızlı Ekle")
                                .strong()
                                .color(Color32::BLACK),
                        )
                        .fill(ACCENT_EMERALD),
                    )
                    .clicked()
                {
                    self.active_tab = ActiveTab::QuickAdd;
                }

                if ui.button("🔒 Kilitle").clicked() {
                    self.is_locked = true;
                }

                let theme_label = if self.payload.preferences.dark_mode {
                    "🌙 Koyu"
                } else {
                    "☀️ Açık"
                };
                if ui.button(theme_label).clicked() {
                    self.payload.preferences.dark_mode = !self.payload.preferences.dark_mode;
                    self.persist_vault();
                }

                // Currency Switcher
                for curr in [Currency::EUR, Currency::USD, Currency::TRY] {
                    let selected = self.payload.preferences.currency == curr;
                    let text = format!("{} {}", curr.symbol(), curr.code());
                    if ui.selectable_label(selected, text).clicked() {
                        self.payload.preferences.currency = curr;
                        self.persist_vault();
                    }
                }
            });
        });
    }

    fn render_summary_cards(&self, ui: &mut egui::Ui, stats: &SummaryStats) {
        let pref_curr = self.payload.preferences.currency;
        let card_fill = if self.payload.preferences.dark_mode {
            SURFACE_DARK
        } else {
            Color32::WHITE
        };

        ui.columns(3, |cols| {
            // Card 1: Monthly Total Spend
            egui::Frame::new()
                .fill(card_fill)
                .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                .corner_radius(CornerRadius::same(10))
                .inner_margin(Margin::same(16))
                .show(&mut cols[0], |ui| {
                    ui.label(
                        RichText::new("AYLIK TOPLAM GİDER")
                            .size(11.0)
                            .color(TEXT_MUTED_DARK),
                    );
                    ui.add_space(4.0);
                    ui.label(
                        RichText::new(pref_curr.format_from_try(stats.monthly_total_try))
                            .size(24.0)
                            .strong(),
                    );
                    ui.add_space(2.0);
                    ui.label(
                        RichText::new(format!("{} aktif abonelik", stats.active_count))
                            .size(12.0)
                            .color(TEXT_MUTED_DARK),
                    );
                });

            // Card 2: Unused / Trial Subscriptions
            egui::Frame::new()
                .fill(card_fill)
                .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                .corner_radius(CornerRadius::same(10))
                .inner_margin(Margin::same(16))
                .show(&mut cols[1], |ui| {
                    ui.label(
                        RichText::new("BOŞA ÖDENEN / DENEME SÜRESİ")
                            .size(11.0)
                            .color(TEXT_MUTED_DARK),
                    );
                    ui.add_space(4.0);
                    let count_color = if stats.unused_or_trial_count > 0 {
                        ACCENT_ROSE
                    } else {
                        ACCENT_EMERALD
                    };
                    ui.label(
                        RichText::new(format!("{} Abonelik", stats.unused_or_trial_count))
                            .size(24.0)
                            .strong()
                            .color(count_color),
                    );
                    ui.add_space(2.0);
                    ui.label(
                        RichText::new("Kullanılmayan veya süresi bitmek üzere olanlar")
                            .size(12.0)
                            .color(TEXT_MUTED_DARK),
                    );
                });

            // Card 3: Yearly Savings & Budget Health
            egui::Frame::new()
                .fill(card_fill)
                .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                .corner_radius(CornerRadius::same(10))
                .inner_margin(Margin::same(16))
                .show(&mut cols[2], |ui| {
                    ui.label(
                        RichText::new("YILLIK TASARRUF FIRSATI & SAĞLIK PUANI")
                            .size(11.0)
                            .color(TEXT_MUTED_DARK),
                    );
                    ui.add_space(4.0);
                    ui.horizontal(|ui| {
                        ui.label(
                            RichText::new(pref_curr.format_from_try(stats.yearly_savings_try))
                                .size(24.0)
                                .strong()
                                .color(ACCENT_EMERALD),
                        );
                        ui.label(
                            RichText::new(format!("• Puan: {}", stats.health_grade))
                                .size(15.0)
                                .strong()
                                .color(ACCENT_BLUE),
                        );
                    });
                    ui.add_space(2.0);
                    ui.label(
                        RichText::new(stats.health_desc)
                            .size(12.0)
                            .color(TEXT_MUTED_DARK),
                    );
                });
        });
    }

    fn render_navigation_tabs(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            let tabs = [
                (ActiveTab::Subscriptions, "💳 Aboneliklerim"),
                (ActiveTab::QuickAdd, "➕ Hızlı Abonelik Ekle (18+ Şablon)"),
                (
                    ActiveTab::StatementScanner,
                    "📄 Çevrimdışı Ekstre Tarayıcı",
                ),
                (
                    ActiveTab::LegalAndVault,
                    "⚖️ Resmi İptal Dilekçesi & Şifreli Kasa",
                ),
            ];

            for (tab, title) in tabs {
                let is_active = self.active_tab == tab;
                if ui
                    .selectable_label(
                        is_active,
                        RichText::new(title).size(13.5).strong(),
                    )
                    .clicked()
                {
                    self.active_tab = tab;
                    if tab == ActiveTab::LegalAndVault {
                        self.refresh_legal_notice();
                    }
                }
                ui.add_space(6.0);
            }
        });
    }

    fn render_subscriptions_tab(&mut self, ui: &mut egui::Ui) {
        // Filter bar
        ui.horizontal(|ui| {
            ui.label(RichText::new("Filtrele:").size(12.5).color(TEXT_MUTED_DARK));
            for (f, label) in [
                (StatusFilter::All, "Tümü"),
                (StatusFilter::Active, "Aktif"),
                (StatusFilter::UnusedTrial, "Deneme / Kullanılmıyor"),
                (StatusFilter::Cancelled, "İptal Edilenler"),
            ] {
                if ui.selectable_label(self.status_filter == f, label).clicked() {
                    self.status_filter = f;
                }
            }
        });

        ui.add_space(8.0);

        let pref_curr = self.payload.preferences.currency;
        let query = self.search_query.trim().to_lowercase();
        let row_fill = if self.payload.preferences.dark_mode {
            SURFACE_DARK
        } else {
            Color32::WHITE
        };

        let mut action_cancel_idx: Option<usize> = None;
        let mut action_legal_idx: Option<usize> = None;
        let mut action_delete_idx: Option<usize> = None;
        let mut action_toggle_unused_idx: Option<usize> = None;

        egui::ScrollArea::vertical()
            .auto_shrink([false; 2])
            .show(ui, |ui| {
                let mut visible_count = 0;

                for (idx, sub) in self.payload.subscriptions.iter().enumerate() {
                    let status_match = match self.status_filter {
                        StatusFilter::All => true,
                        StatusFilter::Active => sub.status == SubStatus::Active,
                        StatusFilter::UnusedTrial => sub.status == SubStatus::UnusedTrial,
                        StatusFilter::Cancelled => sub.status == SubStatus::Cancelled,
                    };
                    if !status_match {
                        continue;
                    }

                    if !query.is_empty() {
                        let m = sub.name.to_lowercase().contains(&query)
                            || sub.plan.to_lowercase().contains(&query)
                            || sub.category.to_lowercase().contains(&query)
                            || sub.notes.to_lowercase().contains(&query);
                        if !m {
                            continue;
                        }
                    }

                    visible_count += 1;

                    let (badge_text, badge_color) = match sub.status {
                        SubStatus::Active => ("● Aktif", ACCENT_EMERALD),
                        SubStatus::UnusedTrial => ("⚠ Deneme / Kullanılmıyor", ACCENT_AMBER),
                        SubStatus::Cancelled => ("✕ İptal Edildi", TEXT_MUTED_DARK),
                    };

                    egui::Frame::new()
                        .fill(row_fill)
                        .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                        .corner_radius(CornerRadius::same(10))
                        .inner_margin(Margin::symmetric(16, 12))
                        .show(ui, |ui| {
                            ui.horizontal(|ui| {
                                ui.vertical(|ui| {
                                    ui.horizontal(|ui| {
                                        ui.label(
                                            RichText::new(&sub.name).size(15.5).strong(),
                                        );
                                        ui.label(
                                            RichText::new(format!("• {}", sub.plan))
                                                .size(13.0)
                                                .color(TEXT_MUTED_DARK),
                                        );
                                        ui.label(
                                            RichText::new(format!("[{}]", sub.category))
                                                .size(12.0)
                                                .color(ACCENT_BLUE),
                                        );
                                        ui.label(
                                            RichText::new(badge_text)
                                                .size(12.0)
                                                .strong()
                                                .color(badge_color),
                                        );
                                    });

                                    ui.add_space(3.0);
                                    ui.horizontal(|ui| {
                                        ui.label(
                                            RichText::new(format!(
                                                "Yenilenme: {}",
                                                sub.next_renewal
                                            ))
                                            .size(12.0)
                                            .color(TEXT_MUTED_DARK),
                                        );
                                        if !sub.notes.is_empty() {
                                            ui.label(
                                                RichText::new(format!("• {}", sub.notes))
                                                    .size(12.0)
                                                    .color(TEXT_MUTED_DARK),
                                            );
                                        }
                                    });
                                });

                                ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                    if ui
                                        .button(
                                            RichText::new("🗑 Sil")
                                                .size(12.0)
                                                .color(ACCENT_ROSE),
                                        )
                                        .clicked()
                                    {
                                        action_delete_idx = Some(idx);
                                    }

                                    if ui.button(RichText::new("📄 Resmi Dilekçe").size(12.0)).clicked() {
                                        action_legal_idx = Some(idx);
                                    }

                                    if sub.status != SubStatus::Cancelled {
                                        if ui
                                            .add(
                                                egui::Button::new(
                                                    RichText::new("⚡ Hemen İptal Et")
                                                        .size(12.0)
                                                        .strong()
                                                        .color(Color32::BLACK),
                                                )
                                                .fill(ACCENT_EMERALD),
                                            )
                                            .on_hover_text(
                                                "Doğrudan iptal sayfasını açar ve aboneliği iptal edildi olarak işaretler",
                                            )
                                            .clicked()
                                        {
                                            action_cancel_idx = Some(idx);
                                        }

                                        let toggle_label = if sub.status == SubStatus::Active {
                                            "Kullanılmıyor İşaretle"
                                        } else {
                                            "Aktif İşaretle"
                                        };
                                        if ui
                                            .button(RichText::new(toggle_label).size(11.5))
                                            .clicked()
                                        {
                                            action_toggle_unused_idx = Some(idx);
                                        }
                                    }

                                    ui.add_space(10.0);
                                    let monthly_try = sub.monthly_cost_try();
                                    ui.label(
                                        RichText::new(format!(
                                            "{}{}",
                                            pref_curr.format_from_try(monthly_try),
                                            sub.billing_cycle.short_suffix()
                                        ))
                                        .size(16.0)
                                        .strong(),
                                    );
                                });
                            });
                        });

                    ui.add_space(6.0);
                }

                if visible_count == 0 {
                    ui.add_space(30.0);
                    ui.vertical_centered(|ui| {
                        ui.label(
                            RichText::new("Filtreye uygun abonelik bulunamadı.")
                                .size(14.0)
                                .color(TEXT_MUTED_DARK),
                        );
                    });
                }
            });

        if let Some(idx) = action_cancel_idx {
            let url = self.payload.subscriptions[idx].cancel_url.clone();
            let name = self.payload.subscriptions[idx].name.clone();
            self.payload.subscriptions[idx].status = SubStatus::Cancelled;
            self.persist_vault();
            if !url.is_empty() {
                let _ = Self::open_external_url(&url);
                self.set_toast(
                    format!(
                        "{} iptal sayfası tarayıcıda açıldı ve durum 'İptal Edildi' olarak güncellendi.",
                        name
                    ),
                    ACCENT_EMERALD,
                );
            } else {
                self.set_toast(
                    format!("{} aboneliği iptal edildi olarak işaretlendi.", name),
                    ACCENT_EMERALD,
                );
            }
        }

        if let Some(idx) = action_toggle_unused_idx {
            let current = self.payload.subscriptions[idx].status;
            self.payload.subscriptions[idx].status = if current == SubStatus::Active {
                SubStatus::UnusedTrial
            } else {
                SubStatus::Active
            };
            self.persist_vault();
        }

        if let Some(idx) = action_legal_idx {
            self.selected_sub_idx = idx;
            self.refresh_legal_notice();
            self.active_tab = ActiveTab::LegalAndVault;
        }

        if let Some(idx) = action_delete_idx {
            let removed = self.payload.subscriptions.remove(idx);
            self.persist_vault();
            self.refresh_legal_notice();
            self.set_toast(format!("{} silindi.", removed.name), ACCENT_AMBER);
        }
    }

    fn render_quick_add_tab(&mut self, ui: &mut egui::Ui) {
        ui.columns(2, |cols| {
            // Left: 18+ Popular Service Presets
            cols[0].label(
                RichText::new("⚡ 18+ Popüler Servisten Tek Tıkla Ekle")
                    .size(15.0)
                    .strong(),
            );
            cols[0].label(
                RichText::new(
                    "Servise tıkladığınızda bilgileri ve resmi iptal bağlantısı otomatik doldurulur.",
                )
                .size(12.0)
                .color(TEXT_MUTED_DARK),
            );
            cols[0].add_space(8.0);

            egui::ScrollArea::vertical()
                .id_salt("presets_scroll")
                .max_height(430.0)
                .show(&mut cols[0], |ui| {
                    for preset in SERVICE_PRESETS {
                        egui::Frame::new()
                            .fill(CARD_DARK)
                            .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                            .corner_radius(CornerRadius::same(8))
                            .inner_margin(Margin::symmetric(12, 8))
                            .show(ui, |ui| {
                                ui.horizontal(|ui| {
                                    ui.vertical(|ui| {
                                        ui.label(RichText::new(preset.name).strong());
                                        ui.label(
                                            RichText::new(format!(
                                                "{} • {} {:.2}",
                                                preset.plan,
                                                preset.currency.symbol(),
                                                preset.default_price
                                            ))
                                            .size(11.5)
                                            .color(TEXT_MUTED_DARK),
                                        );
                                    });

                                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                        if ui
                                            .add(
                                                egui::Button::new(
                                                    RichText::new("+ Hemen Ekle")
                                                        .size(12.0)
                                                        .strong()
                                                        .color(Color32::BLACK),
                                                )
                                                .fill(ACCENT_EMERALD),
                                            )
                                            .clicked()
                                        {
                                            let sub = preset.to_subscription(
                                                self.payload.subscriptions.len() + 1,
                                            );
                                            self.payload.subscriptions.insert(0, sub);
                                            self.persist_vault();
                                            self.set_toast(
                                                format!("{} listenize eklendi.", preset.name),
                                                ACCENT_EMERALD,
                                            );
                                            self.active_tab = ActiveTab::Subscriptions;
                                        }

                                        if ui.button(RichText::new("Forma Aktar").size(11.5)).clicked() {
                                            self.form_name = preset.name.to_string();
                                            self.form_plan = preset.plan.to_string();
                                            self.form_category = preset.category.to_string();
                                            self.form_price = format!("{:.2}", preset.default_price);
                                            self.form_currency = preset.currency;
                                            self.form_cancel_url = preset.cancel_url.to_string();
                                        }
                                    });
                                });
                            });
                        ui.add_space(4.0);
                    }
                });

            // Right: Custom Subscription Form
            cols[1].label(
                RichText::new("✍️ Özel Abonelik Bilgileri")
                    .size(15.0)
                    .strong(),
            );
            cols[1].add_space(8.0);

            egui::Frame::new()
                .fill(SURFACE_DARK)
                .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                .corner_radius(CornerRadius::same(10))
                .inner_margin(Margin::same(16))
                .show(&mut cols[1], |ui| {
                    ui.label("Servis Adı:");
                    ui.text_edit_singleline(&mut self.form_name);

                    ui.label("Paket / Plan:");
                    ui.text_edit_singleline(&mut self.form_plan);

                    ui.label("Kategori:");
                    ui.text_edit_singleline(&mut self.form_category);

                    ui.horizontal(|ui| {
                        ui.vertical(|ui| {
                            ui.label("Tutar:");
                            ui.add_sized(
                                [120.0, 28.0],
                                egui::TextEdit::singleline(&mut self.form_price),
                            );
                        });

                        ui.vertical(|ui| {
                            ui.label("Para Birimi:");
                            ui.horizontal(|ui| {
                                for c in [Currency::TRY, Currency::USD, Currency::EUR] {
                                    if ui.selectable_label(self.form_currency == c, c.code()).clicked() {
                                        self.form_currency = c;
                                    }
                                }
                            });
                        });
                    });

                    ui.label("Durum:");
                    ui.horizontal(|ui| {
                        for st in [SubStatus::Active, SubStatus::UnusedTrial] {
                            if ui
                                .selectable_label(self.form_status == st, st.label())
                                .clicked()
                            {
                                self.form_status = st;
                            }
                        }
                    });

                    ui.label("Doğrudan İptal Sayfası (URL):");
                    ui.text_edit_singleline(&mut self.form_cancel_url);

                    ui.label("Notlar:");
                    ui.text_edit_singleline(&mut self.form_notes);

                    ui.add_space(10.0);
                    if ui
                        .add_sized(
                            [ui.available_width(), 36.0],
                            egui::Button::new(
                                RichText::new("💾 Aboneliği Listeme Kaydet")
                                    .strong()
                                    .color(Color32::BLACK),
                            )
                            .fill(ACCENT_EMERALD),
                        )
                        .clicked()
                    {
                        let price = self
                            .form_price
                            .replace(',', ".")
                            .parse::<f64>()
                            .unwrap_or(0.0);
                        if self.form_name.trim().is_empty() || price <= 0.0 {
                            self.set_toast(
                                "Lütfen geçerli bir servis adı ve tutar girin.",
                                ACCENT_ROSE,
                            );
                        } else {
                            let new_sub = Subscription {
                                id: format!("sub-custom-{}", self.payload.subscriptions.len() + 1),
                                name: self.form_name.trim().to_string(),
                                plan: self.form_plan.trim().to_string(),
                                category: self.form_category.trim().to_string(),
                                price,
                                currency: self.form_currency,
                                billing_cycle: self.form_cycle,
                                next_renewal: "2026-11-30".to_string(),
                                status: self.form_status,
                                cancel_url: self.form_cancel_url.trim().to_string(),
                                notes: self.form_notes.trim().to_string(),
                            };
                            self.payload.subscriptions.insert(0, new_sub);
                            self.persist_vault();
                            self.form_name.clear();
                            self.form_notes.clear();
                            self.set_toast("Yeni abonelik başarıyla kaydedildi.", ACCENT_EMERALD);
                            self.active_tab = ActiveTab::Subscriptions;
                        }
                    }
                });
        });
    }

    fn render_statement_scanner_tab(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.vertical(|ui| {
                ui.label(
                    RichText::new("📄 Çevrimdışı Banka Ekstresi ve Harcama Tarayıcısı")
                        .size(16.0)
                        .strong(),
                );
                ui.label(
                    RichText::new(
                        "Kredi kartı ekstrenizi veya hesap hareketlerinizi yapıştırın. İnternete bağlanmadan tamamen bilgisayarınızda abonelikleri bulur.",
                    )
                    .size(12.5)
                    .color(TEXT_MUTED_DARK),
                );
            });

            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                if ui
                    .add(
                        egui::Button::new(
                            RichText::new("⚡ Ekstreyi Şimdi Tara")
                                .strong()
                                .color(Color32::BLACK),
                        )
                        .fill(ACCENT_EMERALD),
                    )
                    .clicked()
                {
                    self.detected_subs = parse_statement(
                        &self.statement_input,
                        self.payload.preferences.currency,
                    );
                    self.set_toast(
                        format!(
                            "{} adet abonelik çevrimdışı olarak tespit edildi.",
                            self.detected_subs.len()
                        ),
                        ACCENT_EMERALD,
                    );
                }

                if ui.button("📋 Örnek Ekstre Yükle").clicked() {
                    self.statement_input = SAMPLE_STATEMENT.to_string();
                }
            });
        });

        ui.add_space(8.0);
        ui.add_sized(
            [ui.available_width(), 140.0],
            egui::TextEdit::multiline(&mut self.statement_input)
                .font(egui::TextStyle::Monospace)
                .hint_text("Ekstre satırlarını buraya yapıştırın..."),
        );

        ui.add_space(10.0);
        if !self.detected_subs.is_empty() {
            ui.horizontal(|ui| {
                ui.label(
                    RichText::new(format!(
                        "Bulunan Abonelikler ({})",
                        self.detected_subs.len()
                    ))
                    .size(14.5)
                    .strong(),
                );

                ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                    if ui
                        .add(
                            egui::Button::new(
                                RichText::new("+ Tümünü Listeme Aktar")
                                    .strong()
                                    .color(Color32::BLACK),
                            )
                            .fill(ACCENT_EMERALD),
                        )
                        .clicked()
                    {
                        let count = self.detected_subs.len();
                        for sub in self.detected_subs.drain(..) {
                            self.payload.subscriptions.insert(0, sub);
                        }
                        self.persist_vault();
                        self.set_toast(
                            format!("{} abonelik listenize aktarıldı.", count),
                            ACCENT_EMERALD,
                        );
                        self.active_tab = ActiveTab::Subscriptions;
                    }
                });
            });

            ui.add_space(6.0);
            egui::ScrollArea::vertical()
                .id_salt("detected_scroll")
                .max_height(220.0)
                .show(ui, |ui| {
                    for det in &self.detected_subs {
                        egui::Frame::new()
                            .fill(SURFACE_DARK)
                            .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                            .corner_radius(CornerRadius::same(8))
                            .inner_margin(Margin::symmetric(12, 8))
                            .show(ui, |ui| {
                                ui.horizontal(|ui| {
                                    ui.label(RichText::new(&det.name).strong());
                                    ui.label(
                                        RichText::new(format!("• {}", det.plan))
                                            .color(TEXT_MUTED_DARK),
                                    );
                                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                        ui.label(
                                            RichText::new(format!(
                                                "{}{:.2}",
                                                det.currency.symbol(),
                                                det.price
                                            ))
                                            .strong()
                                            .color(ACCENT_EMERALD),
                                        );
                                    });
                                });
                            });
                        ui.add_space(4.0);
                    }
                });
        }
    }

    fn render_legal_and_vault_tab(&mut self, ui: &mut egui::Ui, ctx: &egui::Context) {
        ui.columns(2, |cols| {
            // Left: Official Cancellation Notice Generator
            cols[0].label(
                RichText::new("⚖️ Resmi Abonelik İptal Dilekçesi (6502 SK & GDPR)")
                    .size(15.0)
                    .strong(),
            );
            cols[0].add_space(6.0);

            cols[0].horizontal(|ui| {
                ui.label("Dil:");
                if ui
                    .selectable_label(
                        self.notice_lang == NoticeLanguage::Turkish,
                        "🇹🇷 Türkçe (6502 SK & KVKK)",
                    )
                    .clicked()
                {
                    self.notice_lang = NoticeLanguage::Turkish;
                    self.refresh_legal_notice();
                }
                if ui
                    .selectable_label(
                        self.notice_lang == NoticeLanguage::English,
                        "🇬🇧 English (GDPR Art. 17)",
                    )
                    .clicked()
                {
                    self.notice_lang = NoticeLanguage::English;
                    self.refresh_legal_notice();
                }
            });

            cols[0].horizontal(|ui| {
                ui.label("Ad Soyad:");
                if ui
                    .text_edit_singleline(&mut self.payload.preferences.user_name)
                    .changed()
                {
                    self.refresh_legal_notice();
                }
                ui.label("E-Posta:");
                if ui
                    .text_edit_singleline(&mut self.payload.preferences.user_email)
                    .changed()
                {
                    self.refresh_legal_notice();
                }
            });

            cols[0].add_space(6.0);
            cols[0].add_sized(
                [cols[0].available_width(), 240.0],
                egui::TextEdit::multiline(&mut self.generated_notice)
                    .font(egui::TextStyle::Monospace),
            );

            cols[0].add_space(6.0);
            cols[0].horizontal(|ui| {
                if ui
                    .add(
                        egui::Button::new(
                            RichText::new("📋 Dilekçeyi Panoya Kopyala")
                                .strong()
                                .color(Color32::BLACK),
                        )
                        .fill(ACCENT_EMERALD),
                    )
                    .clicked()
                {
                    ctx.copy_text(self.generated_notice.clone());
                    self.set_toast("Resmi iptal dilekçesi panoya kopyalandı.", ACCENT_EMERALD);
                }

                if ui.button("💾 .txt Olarak Kaydet").clicked() {
                    let path = std::env::current_dir()
                        .unwrap_or_default()
                        .join("subradar-iptal-dilekcesi.txt");
                    if fs::write(&path, &self.generated_notice).is_ok() {
                        self.set_toast(
                            format!("Dilekçe kaydedildi: {}", path.display()),
                            ACCENT_EMERALD,
                        );
                    }
                }
            });

            // Right: Encrypted Local Vault & Security Status
            cols[1].label(
                RichText::new("🛡️ Şifreli Yerel Kasa & Sürüm Bilgisi")
                    .size(15.0)
                    .strong(),
            );
            cols[1].add_space(6.0);

            egui::Frame::new()
                .fill(SURFACE_DARK)
                .stroke(Stroke::new(1.0_f32, BORDER_DARK))
                .corner_radius(CornerRadius::same(10))
                .inner_margin(Margin::same(16))
                .show(&mut cols[1], |ui| {
                    ui.label(RichText::new("Uygulama Sürümü: SubRadar v1.0 (1.0.0)").strong());
                    ui.label("Lisans: Ticari Lisans (LicenseRef-SubRadar-Commercial-1.0)");
                    ui.label("Mimari: %100 Saf Rust Native GUI (eframe / egui)");
                    ui.label("Veri Şifreleme: AES-256-CBC + PBKDF2 + HMAC-SHA256");
                    ui.label(
                        RichText::new("Çalışma Modu: %100 Çevrimdışı ve Yerel (Veri Gönderilmez)")
                            .color(ACCENT_EMERALD),
                    );
                    ui.label(
                        RichText::new(format!("Kasa Dosyası: {}", VAULT_FILENAME))
                            .size(12.0)
                            .color(TEXT_MUTED_DARK),
                    );

                    ui.add_space(12.0);
                    ui.label("Ana Kasa Şifresi:");
                    ui.add(
                        egui::TextEdit::singleline(&mut self.master_password).password(true),
                    );

                    ui.add_space(8.0);
                    ui.horizontal(|ui| {
                        if ui
                            .add(
                                egui::Button::new(
                                    RichText::new("💾 Şifreli Kasayı Şimdi Kaydet")
                                        .strong()
                                        .color(Color32::BLACK),
                                )
                                .fill(ACCENT_EMERALD),
                            )
                            .clicked()
                        {
                            let path = default_vault_path();
                            match save_vault_to_file(&path, &self.payload, &self.master_password) {
                                Ok(_) => self.set_toast(
                                    "Kasanız AES-256 ile şifrelenerek yerel diske kaydedildi.",
                                    ACCENT_EMERALD,
                                ),
                                Err(e) => self.set_toast(e, ACCENT_ROSE),
                            }
                        }

                        if ui.button("📂 Şifreli Kasayı Diskten Yükle").clicked() {
                            let path = default_vault_path();
                            match load_vault_from_file(&path, &self.master_password) {
                                Ok(loaded) => {
                                    self.payload = loaded;
                                    self.refresh_legal_notice();
                                    self.set_toast(
                                        "Şifreli kasa başarıyla doğrulandı ve yüklendi.",
                                        ACCENT_EMERALD,
                                    );
                                }
                                Err(e) => self.set_toast(e, ACCENT_ROSE),
                            }
                        }
                    });
                });
        });
    }
}

impl eframe::App for SubRadarApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        apply_theme(ctx, self.payload.preferences.dark_mode);

        // Ctrl+K shortcut focuses the quick search bar
        if ctx.input(|i| i.modifiers.command && i.key_pressed(Key::K)) {
            self.active_tab = ActiveTab::Subscriptions;
            self.focus_search_next_frame = true;
        }

        if self.is_locked {
            self.render_lock_screen(ctx);
            return;
        }

        let stats = SummaryStats::compute(&self.payload.subscriptions);

        egui::TopBottomPanel::top("top_header")
            .frame(
                egui::Frame::new()
                    .fill(if self.payload.preferences.dark_mode {
                        SURFACE_DARK
                    } else {
                        Color32::WHITE
                    })
                    .inner_margin(Margin::symmetric(18, 12))
                    .stroke(Stroke::new(1.0_f32, BORDER_DARK)),
            )
            .show(ctx, |ui| {
                self.render_top_bar(ui);
            });

        if let Some((msg, color)) = &self.status_banner {
            egui::TopBottomPanel::bottom("bottom_status_bar")
                .frame(
                    egui::Frame::new()
                        .fill(if self.payload.preferences.dark_mode {
                            SURFACE_DARK
                        } else {
                            Color32::WHITE
                        })
                        .inner_margin(Margin::symmetric(18, 8))
                        .stroke(Stroke::new(1.0_f32, BORDER_DARK)),
                )
                .show(ctx, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(RichText::new("●").color(*color));
                        ui.label(RichText::new(msg).size(12.0));
                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                            ui.label(
                                RichText::new("SubRadar v1.0 • Ticari Lisans • %100 Saf Rust")
                                    .size(11.5)
                                    .color(TEXT_MUTED_DARK),
                            );
                        });
                    });
                });
        }

        egui::CentralPanel::default()
            .frame(
                egui::Frame::new()
                    .fill(ctx.style().visuals.panel_fill)
                    .inner_margin(Margin::same(18)),
            )
            .show(ctx, |ui| {
                self.render_summary_cards(ui, &stats);
                ui.add_space(14.0);
                self.render_navigation_tabs(ui);
                ui.separator();
                ui.add_space(6.0);

                match self.active_tab {
                    ActiveTab::Subscriptions => self.render_subscriptions_tab(ui),
                    ActiveTab::QuickAdd => self.render_quick_add_tab(ui),
                    ActiveTab::StatementScanner => self.render_statement_scanner_tab(ui),
                    ActiveTab::LegalAndVault => self.render_legal_and_vault_tab(ui, ctx),
                }
            });
    }
}
