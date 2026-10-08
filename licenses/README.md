# 📜 Yazılım Lisansları Kılavuzu & Şablon Koleksiyonu

Bu klasör, SubRadar projesinde veya gelecekteki geliştirmelerde referans olarak kullanılabilecek **popüler açık kaynak ve ticari lisans tam metinlerini** barındırır.

> **Mevcut Proje Lisansı:** SubRadar kök dizinindeki [`LICENSE`](../LICENSE) dosyası üzerinden **MIT Lisansı** ile lisanslanmıştır.

---

## 📂 Klasördeki Lisans Dosyaları

| Dosya | Lisans Adı | Kategori | Temel Özellik |
| :--- | :--- | :--- | :--- |
| [`MIT.txt`](MIT.txt) | **MIT License** | İzin Verici (Permissive) | En sade ve popüler lisans. Kod kapatılabilir, ticari serbest. |
| [`APACHE-2.0.txt`](APACHE-2.0.txt) | **Apache License 2.0** | İzin Verici + Patent | MIT gibidir + patent dava koruması ve katkı hakları sağlar. |
| [`BSD-3-CLAUSE.txt`](BSD-3-CLAUSE.txt) | **BSD 3-Clause** | İzin Verici | Reklam ve tanıtımda yazarın adının izinsiz kullanımını yasaklar. |
| [`BSD-2-CLAUSE.txt`](BSD-2-CLAUSE.txt) | **BSD 2-Clause** | İzin Verici | FreeBSD lisansı olarak da bilinir; MIT'ye çok benzer. |
| [`GPL-3.0.txt`](GPL-3.0.txt) | **GNU GPL v3** | Güçlü Copyleft | Kodu kullanan herkes kendi türetilmiş projesini de açık kaynak yapmak zorundadır. |
| [`AGPL-3.0.txt`](AGPL-3.0.txt) | **GNU AGPL v3** | Ağ/Bulut Copyleft | Yazılım SaaS/web servisi olarak sunulsa bile kaynak kodun açılmasını zorunlu tutar. |
| [`MPL-2.0.txt`](MPL-2.0.txt) | **Mozilla Public License 2.0** | Zayıf Copyleft | Sadece değiştirilen dosyaların açık kaynak kalmasını ister; projeyi kapatmaya izin verir. |
| [`UNLICENSE.txt`](UNLICENSE.txt) | **The Unlicense** | Kamu Malı (Public Domain) | Tüm telif haklarından feragat edilir. Sıfır kısıtlama. |
| [`PROPRIETARY.txt`](PROPRIETARY.txt) | **Tescilli / Özel (Kapalı Kod)** | Ticari | Tüm hakları saklıdır. İzinsiz kopyalama, dağıtma veya satma yasaktır. |

---

## ⚖️ Karşılaştırma Matrisi

| Lisans | Ticari Kullanım | Kodu Değiştirme | Kendi Kodunu Açma Zorunluluğu? | Patent Koruması? |
| :--- | :---: | :---: | :---: | :---: |
| **MIT** | ✅ Serbest | ✅ Serbest | ❌ Yok (Kapalı tutabilir) | ❌ Yok |
| **Apache 2.0** | ✅ Serbest | ✅ Serbest | ❌ Yok (Kapalı tutabilir) | ✅ Var |
| **BSD 3-Clause** | ✅ Serbest | ✅ Serbest | ❌ Yok (Kapalı tutabilir) | ❌ Yok |
| **MPL 2.0** | ✅ Serbest | ✅ Serbest | ⚠️ Yalnızca değiştirilen dosyalarda | ✅ Var |
| **GPL v3** | ✅ Serbest | ✅ Serbest | ⚠️ **Zorunlu** (Tüm proje açık kaynak olmalı) | ✅ Var |
| **AGPL v3** | ✅ Serbest | ✅ Serbest | ⚠️ **Zorunlu** (SaaS olarak sunulsa dahi) | ✅ Var |
| **Unlicense** | ✅ Serbest | ✅ Serbest | ❌ Yok | ❌ Yok |
| **Proprietary** | ❌ Yasak | ❌ Yasak | — | — |

---

## 🎯 Hangisini Seçmeliyim?

1. **"Herkes kullansın, öğrensin, şirketler projelerine rahatça eklesin":** 👉 `MIT` veya `Apache-2.0`
2. **"Patent davalarından korunmak ve kurumsal katkıları garanti altına almak istiyorum":** 👉 `Apache-2.0`
3. **"Kimse benim kodumu alıp kapatıp ticari ürün yapamasın, açık kaynak kalsın":** 👉 `GPL-3.0`
4. **"Kodum bulutta web servisi (SaaS) olarak çalıştırılsa dahi açık kaynak kalmak zorunda olsun":** 👉 `AGPL-3.0`
5. **"Kodu satmak istiyorum, kimse izinsiz kullanamasın veya kopyalamasın":** 👉 `PROPRIETARY`
