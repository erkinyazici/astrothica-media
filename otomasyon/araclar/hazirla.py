"""Kullanım: python3 araclar/hazirla.py YYYY-AA-GG
Kontrolden geçmiş metinlerden: açıklama metinlerini, <tarih>/paylasim.json manifestini yazar ve
cümleleri/renkleri/açıklama cümlelerini veri/*.tsv dosyalarına ekler (aynı tarih varsa önce siler)."""
import json, sys, csv, os
sys.path.insert(0, os.path.dirname(__file__))
from ortak import *
gun = sys.argv[1]; d = tarih(gun); klas = f'{KOK}/metinler/{gun}'
a = json.load(open(f'{klas}/aciklama.json'))
def aciklama(grup, burclar, sonraki):
    adlar = [AD[b] for b in burclar]
    liste = ', '.join(adlar[:-1]) + ' ve ' + adlar[-1]
    tags = ' '.join(['#burç', '#burçyorumu', '#günlükburç', '#astroloji'] + ['#' + ETIKET[b] for b in burclar] + ['#astrothica'])
    return (f'Günlük burç yorumu · {etiket_tarih(d)}, {gun_adi(d)}\n\n'
            f'{liste} için bugünün aşk, iş ve enerji yorumları.\n\n'
            f'{a[grup].strip()} {sonraki}\n\n'
            'Doğum haritası, astrokartografi, sinastri, tarot ve kahve falı tek uygulamada: www.astrothica.com\n\n'
            'Yorumlar eğlence ve kişisel farkındalık amaçlıdır.\n\n' + tags)
cap = {'koc-basak': aciklama('koc-basak', GRUP1, 'Diğer altı burç 15 dakika sonra burada.'),
       'terazi-balik': aciklama('terazi-balik', GRUP2, "Koç'tan Başak'a yorumlar bir önceki postta.")}
for g, t in cap.items(): open(f'{klas}/{g}-aciklama.txt', 'w').write(t + '\n')
def gorseller(alt):
    p = f'{REPO}/{gun}/{alt}'
    fs = sorted(f for f in os.listdir(p) if f.endswith('.jpg'))
    return [f'{RAW}/{gun}/{alt}/{f}' for f in fs]
man = {'tarih': gun,
       'postlar': {g: {'caption': cap[g], 'gorseller': gorseller(g)} for g in cap},
       'hikayeler': gorseller('hikaye')}
assert len(man['postlar']['koc-basak']['gorseller']) == 8 and len(man['postlar']['terazi-balik']['gorseller']) == 8 and len(man['hikayeler']) == 13, 'görsel sayısı hatalı (8+8+13 olmalı)'
json.dump(man, open(f'{REPO}/{gun}/paylasim.json', 'w'), ensure_ascii=False, indent=1)
# veri dosyalarını güncelle
def ekle(dosya, satirlar):
    p = f'{KOK}/veri/{dosya}'; L = open(p).read().splitlines()
    L = [L[0]] + [x for x in L[1:] if not x.startswith(gun + '\t')] + satirlar
    open(p, 'w').write('\n'.join(L) + '\n')
cum, ren = [], []
for g in ('koc-basak', 'terazi-balik'):
    for s in json.load(open(f'{klas}/{g}.json'))['signs']:
        ren.append(f"{gun}\t{s['sign']}\t{s['luckyColor']['name']}\t{s['luckyNumber']}")
        cum += [f"{gun}\t{s['sign']}\t{i['label']}\t{i['text'].strip()}" for i in s['items']]
ekle('kullanilan-cumleler.tsv', cum); ekle('sans-renk-sayi.tsv', ren)
ekle('aciklama-cumleleri.tsv', [f"{gun}\t{g}\t{a[g].strip()}" for g in ('koc-basak', 'terazi-balik')])
print('hazır:', f'{gun}/paylasim.json')
