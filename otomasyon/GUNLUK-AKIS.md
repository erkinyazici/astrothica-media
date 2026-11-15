# Astrothica günlük burç akışı (otomatik)

Kuruluş: 15 Kasım 2026. Bu dosya, zamanlanmış görevlerin her gün uyguladığı adımları anlatır. Görevlerin metni kısa tutuldu; asıl talimat burasıdır. Akış değişecekse önce bu dosya güncellenir.

Bütün saatler TSİ (Europe/Istanbul). Instagram: @astrothica, IG kullanıcı kimliği `40813486448250208`, Composio bağlantısı "astrothica".

## Takvim (her gün, değişmez)

| Saat (TSİ) | Görev | Ne yapar |
|---|---|---|
| 20:47 | Gece hazırlığı | Ertesi günün 36 cümlesini yazar, denetler, 16 post + 13 hikâye görselini üretir, bu depoya `<tarih>/` altına yükler, en son `<tarih>/paylasim.json` dosyasını yazar. |
| 09:00 | Koç–Başak postu | `paylasim.json` içindeki `koc-basak` postunu paylaşır. Hikâye paylaşmaz. |
| 09:15 | Terazi–Balık postu + 13 hikâye | `terazi-balik` postunu, ardından 13 hikâyeyi sırayla paylaşır. |

Onay: Erkin 15 Kasım 2026'da günlük burç postlarının ve hikâyelerin her gün onay beklenmeden otomatik paylaşılmasını istedi. Gece hazırlığı bittiğinde özet bildirimi gider; Erkin bir günü durdurmak isterse görevi duraklatır ya da Claude'a söyler. Reels paylaşımları bu akışın dışındadır ve her biri ayrıca onaylanır.

## Klasörler

- `otomasyon/sablon/` — Remotion şablonu (`render_post.py`, `render_story.py`, `src/carousel/`). `node_modules` depoda yok; `render_gun.sh` ilk çalıştırmada `npm ci` yapar.
- `otomasyon/metinler/<tarih>/` — `koc-basak.json`, `terazi-balik.json`, `aciklama.json`, üretilen `*-aciklama.txt`.
- `otomasyon/veri/kullanilan-cumleler.tsv` — şimdiye kadar kullanılan bütün kart cümleleri (tarih, burç, başlık, cümle).
- `otomasyon/veri/sans-renk-sayi.tsv` — şanslı renk/sayı geçmişi.
- `otomasyon/veri/aciklama-cumleleri.tsv` — açıklamalardaki samimi cümlelerin geçmişi.
- `otomasyon/araclar/` — `kontrol_metin.py`, `render_gun.sh`, `hazirla.py`, `ortak.py`.
- `<tarih>/koc-basak/`, `<tarih>/terazi-balik/`, `<tarih>/hikaye/` — paylaşılacak görseller (raw.githubusercontent adresleriyle Instagram'a verilir).
- `<tarih>/paylasim.json` — sabah görevlerinin okuduğu tek dosya: iki postun tam açıklaması ve görsel adresleri, 13 hikâye adresi. **Bu dosya yoksa sabah görevleri hiçbir şey paylaşmaz.**

## GECE HAZIRLIĞI (20:47)

1. Hedef tarih = yarın (Europe/Istanbul). `<tarih>/paylasim.json` zaten varsa dur ve "zaten hazır" diye bildir.
2. Depoyu al: `add_repo` (erkinyazici/astrothica-media, push) → `git clone --depth 1 … /home/claude/astrothica-media` (uzun zaman aşımı ver). `git config user.name "Astrothica Bot"`, `user.email "bot@astrothica.com"`.
3. `otomasyon/MARKA-KURALLARI.md` dosyasını oku. Son 3 günün `metinler/*/` JSON'larına ve `veri/*.tsv` dosyalarına bak (ton ve çeşitlilik için).
4. `otomasyon/metinler/<tarih>/` altına yaz:
   - `koc-basak.json` ve `terazi-balik.json`: yapı `otomasyon/metinler/2026-11-13/` örnekleriyle birebir aynı. `dateLabel` = "16 Kasım 2026" biçimi, `coverDate` = "16 Kasım 2026 · Pazartesi". Burç sırası: koc, boga, ikizler, yengec, aslan, basak / terazi, akrep, yay, oglak, kova, balik. Her burçta Aşk, İş, Enerji.
   - `aciklama.json`: `{"koc-basak": "…", "terazi-balik": "…"}` — her post için tek samimi cümle (emoji en fazla 1). Günü hesaba kat (haftanın günü, varsa gökyüzü olayı: ör. 22 Kasım Güneş Yay'a geçiyor, 24 Kasım İkizler'de dolunay). Sondaki "Diğer altı burç 15 dakika sonra burada." / "Koç'tan Başak'a yorumlar bir önceki postta." cümlelerini YAZMA; `hazirla.py` ekliyor.
   - Cümle kuralları: Türkçe, samimi, gündelik, somut; yapay zekâ kokan kalıplar yok ("evren sana…", "enerjiler hizalanıyor" gibi). 35–70 karakter (kart en fazla 2 satır). Kesin kehanet ya da sağlık/para vaadi yok. Aynı gün içinde iki cümle aynı kelimeyle başlamaz. Renkler çeşitli (aynı burçta son 7 günde kullanılan renk yok), hex gerçek renge uygun; sayı 1–12.
5. `python3 otomasyon/araclar/kontrol_metin.py <tarih>` → TAMAM çıkana kadar sorunlu cümleleri yeniden yaz (benzer cümleyi kelime değiştirerek kurtarmaya çalışma, yeni bir fikir yaz).
6. `bash otomasyon/araclar/render_gun.sh <tarih>` (2–3 dk). Sonra `/tmp/pafta-*.jpg` üç paftayı Read ile aç ve kontrol et: taşma, 3. satıra düşen metin, kayan hizalama, yanlış tarih. Şüpheli bir görsel varsa tam boyutunu aç. Sorun varsa metni kısalt, 5–6'yı tekrarla.
7. `python3 otomasyon/araclar/hazirla.py <tarih>` → açıklamaları ve `paylasim.json`'ı yazar, `veri/*.tsv`'ye ekler.
8. `git add -A && git commit -m "<tarih> günlük burç içerikleri" && git -c push.negotiate=true push origin main`. Push reddedilirse `git pull --rebase` sonra tekrar push. Push sonrası `curl -sf https://raw.githubusercontent.com/erkinyazici/astrothica-media/main/<tarih>/paylasim.json` ile dosyanın yayında olduğunu doğrula (önbellek yüzünden birkaç dakika gecikebilir).
9. Erkin'e Türkçe kısa özet: tarih, iki samimi cümle, örnek 2–3 burç cümlesi, görsel klasörünün GitHub adresi (`https://github.com/erkinyazici/astrothica-media/tree/main/<tarih>`), sabah 09:00 ve 09:15'te otomatik paylaşılacağı. Hata olduysa neyin eksik kaldığını yaz; yarım iş varsa `paylasim.json`'ı YAZMA ki sabah görevleri yanlış bir şey paylaşmasın.

## SABAH PAYLAŞIMI (09:00 ve 09:15)

1. Bugünün tarihi (Europe/Istanbul) → `curl -sf https://raw.githubusercontent.com/erkinyazici/astrothica-media/main/<tarih>/paylasim.json`. Yoksa (404) HİÇBİR ŞEY paylaşma; Erkin'e "gece hazırlığı eksik, <tarih> postu paylaşılmadı" diye bildir. Görseli ya da metni kendin üretme, başka güne ait dosya kullanma.
2. Çift paylaşım koruması: Composio `INSTAGRAM_GET_IG_USER_MEDIA` (ig_user_id "me", limit 10, fields "id,caption,timestamp,permalink"). Açıklaması bu postun açıklamasının ilk üç satırıyla (tarih başlığı + burç listesi) başlayan bir gönderi bugün zaten varsa paylaşma, permalink'i bildir (09:15 görevinde bu durumda hikâyeleri de paylaşma).
3. Görsel adreslerinin hepsine `curl -sfI` at; biri 200 değilse paylaşma, bildir.
4. `INSTAGRAM_CREATE_CAROUSEL_CONTAINER`: ig_user_id `40813486448250208`, `child_image_urls` = manifestteki sıra, `caption` = manifestteki metin BİREBİR (satır sonları korunur; `#` olduğu gibi gönderilir, `%23` olarak KODLANMAZ). Sonra `INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH` (max_wait_seconds 120), `INSTAGRAM_GET_IG_MEDIA` ile permalink.
5. Yalnız 09:15 görevi: post yayınlandıktan SONRA 13 hikâye, manifestteki sırayla. Kapsayıcılar önceden oluşturulabilir (`INSTAGRAM_POST_IG_USER_MEDIA`, media_type "STORIES", image_url), ama yayınlama tek tek ve sırayla yapılır, paralel değil.
6. Geçici hatada (500, "işleniyor") bir kez tekrar dene. Hiçbir şeyi iki kez paylaşma.
7. Türkçe kısa özet: permalink, kaç hikâye yayınlandı, varsa hata.
