# Astrothica Sosyal Medya — Marka Kuralları

Son güncelleme: 6 Kasım 2026. Tüm görsel ve metin üretiminde bu kurallar geçerlidir.

## Renk paleti (kaynak: resmi logo görseli)

Canlı, logodaki tonlar kullanılır; soluk/gri mor kullanılmaz.

| Rol | Ad | Hex |
|---|---|---|
| Zemin | Gece laciverti | #04062A (üst #060930, alt #02031F) |
| Derin zemin | İndigo | #15153C |
| Ana parlama | Bulutsu moru | #4D3598 |
| İkincil parlama | Lavanta | #7458B0 |
| Kenar ışığı | Çelik mavisi | #466A94 |
| Vurgu | Şampanya altın | #E8CB98 (açık #FBE7C6, koyu #B48A52) |
| Metin | Krem | #F6F0E8 (ikincil %66, soluk %40 opaklık) |
| Kart zemini | — | rgba(34,28,92,0.74) → rgba(14,14,52,0.78), kenarlık altın %30 |

Zemin: lacivert degrade + mor bulutsu parlama + çelik mavisi yan ışık + yumuşak bulutsu dokusu + yıldızlar (bazıları altın ve hafif parlak).

## Logo

- Resmi logo: `gorseller/logo/logo-orijinal.jpg` (2068×2048).
- Kullanım dosyaları (`sablon/public/logo/`): `emblem-feather.png` (amblem, kenarları zemine yumuşak geçer), `wordmark.png` (ASTROTHICA yazısı, şeffaf), `tagline.png` (DERİN ASTROLOJİ EKOSİSTEMİ, şeffaf).
- Kapanış görselinde tam logo (amblem + yazı + alt yazı) orijinal oranlarla. Kapak üstünde sadece `wordmark.png`.
- Logo yazı tipiyle başka "ASTROTHICA" yazısı taklit edilmez.

## Tipografi

- Başlık: Cinzel 600 (altın degrade).
- Metin: Cormorant Garamond italik 500.
- Etiket: Inter 500, büyük harf, geniş harf aralığı.
- Sayılar: Cormorant italik **lining (düz hizalı) rakam** (`lnum`). Eski stil rakam kullanılmaz (9 aşağı sarkıyordu).

## Yerleşim ve simetri

- Akış görseli: 1080×1350 (4:5), JPEG. Önemli içerik kenarlardan en az 70 px içeride.
- Her görselin altında ortalı, küçük ve soluk `WWW.ASTROTHICA.COM` (Inter 21 px, alttan 38 px).
- Şanslı renk / sayı kutuları: sabit yükseklik; etiket ile değer **aynı yatay eksende, dikey ortalı**. Renk noktası ve renk adı da aynı eksende.
- Burç görselinde kartlar + şanslı kutular blok olarak dikeyde ortalanır; altta boşluk kalmaz.
- Görseller teslimden önce tek tek kontrol edilir: hizalama, taşma, satır kayması, simetri.

## Post yapısı

- Günde 2 çoklu görsel post, ayrı saatlerde: Koç–Başak ve Terazi–Balık.
- Sıra: Kapak (A) → 6 burç (A) → Kapanış (B: logo + slogan + özellik etiketleri + "İOS ve Android · Çok yakında"; mağaza rozetleri gelince eklenecek).
- Özellik listesi: Doğum Haritası · Astrokartografi · Sinastri · Tarot · Kahve Falı · Günlük Burç Yorumu.

## Metin ve açıklama tonu

- Samimi, sohbet havasında, yapay zekâ kokmayan. Kalıp ve robotik ifadeler yok.
- Kullanılmayacak: "Yorumun tuttu mu?", "bu yorumun tam oturduğu kişiyi etiketle" gibi kalıplar.
- Açıklama düzeni: başlık satırı · burç listesi cümlesi · bir samimi cümle (emoji en fazla 1) · "Doğum haritası, astrokartografi, sinastri, tarot ve kahve falı tek uygulamada: www.astrothica.com" · "Yorumlar eğlence ve kişisel farkındalık amaçlıdır." · hashtag'ler.
- Burç kartı metinleri en fazla 2 satır.

## Onay

- Günlük burç postları ve hikâyeleri (15 Kasım 2026'dan itibaren): onay beklenmeden otomatik paylaşılır; ayrıntı `GUNLUK-AKIS.md`.
- Reels, DM ve diğer tüm paylaşımlar: önce Erkin'in onayı alınır.

## Günlük akış (13 Kasım 2026'dan itibaren)

- Her gece 20:47 TSİ: ertesi günün 12 burç metni, 2 post (16 görsel) ve 13 hikâye otomatik hazırlanır ve GitHub'a yüklenir; Erkin'e özet bildirimi gider.
- Paylaşım: 09:00 TSİ Koç–Başak postu; 09:15 TSİ Terazi–Balık postu, hemen ardından 13 hikâye (Koç → Balık, sonra kapanış).
- Kapak: üstte logo amblemi, altında ASTROTHICA yazısı.
- "Şimdi paylaş" dendiğinde zamanlama yapılmaz, hemen paylaşılır.

## Cümle özgünlüğü

- Hiçbir gün ve hiçbir burçta aynı ya da benzer cümle kullanılmaz (aynı fikir, kalıp, açılış kelimesi ya da anahtar kelime tekrarı yok).
- Kullanılan tüm cümleler `veri/kullanilan-cumleler.tsv` dosyasına eklenir; yeni cümleler bu listeyle karşılaştırılır.
- Açıklamalardaki samimi cümle de her gün farklıdır.
