"""Kullanım: python3 araclar/kontrol_metin.py YYYY-AA-GG
metinler/<tarih>/koc-basak.json, terazi-balik.json ve aciklama.json dosyalarını denetler.
Sorun yoksa 'TAMAM' yazar ve 0 ile çıkar; varsa her sorunu listeler ve 1 ile çıkar."""
import json, sys, csv, difflib, re, datetime
sys.path.insert(0, __import__('os').path.dirname(__file__))
from ortak import *
gun = sys.argv[1]; d = tarih(gun)
klas = f'{KOK}/metinler/{gun}'
sorun = []
def norm(t): return re.sub(r'[^\wçğıöşü ]', '', t.lower()).strip()
def ilk(t): return norm(t).split()[0] if norm(t) else ''
gecmis = [r for r in csv.DictReader(open(f'{KOK}/veri/kullanilan-cumleler.tsv'), delimiter='\t') if r['tarih'] != gun]
renkler = [r for r in csv.DictReader(open(f'{KOK}/veri/sans-renk-sayi.tsv'), delimiter='\t') if r['tarih'] != gun]
yakin = (d - datetime.timedelta(days=7)).isoformat()
yeni = []
for dosya, grup in (('koc-basak', GRUP1), ('terazi-balik', GRUP2)):
    j = json.load(open(f'{klas}/{dosya}.json'))
    if j.get('dateLabel') != etiket_tarih(d): sorun.append(f'{dosya}: dateLabel "{etiket_tarih(d)}" olmalı')
    if j.get('coverDate') != f'{etiket_tarih(d)} · {gun_adi(d)}': sorun.append(f'{dosya}: coverDate "{etiket_tarih(d)} · {gun_adi(d)}" olmalı')
    if [s['sign'] for s in j['signs']] != grup: sorun.append(f'{dosya}: burç sırası {grup} olmalı')
    for s in j['signs']:
        if [i['label'] for i in s['items']] != ['Aşk','İş','Enerji']: sorun.append(f"{s['sign']}: etiketler Aşk/İş/Enerji olmalı")
        if not re.fullmatch(r'#[0-9A-Fa-f]{6}', s['luckyColor']['hex']): sorun.append(f"{s['sign']}: renk hex hatalı")
        if not (1 <= int(s['luckyNumber']) <= 12): sorun.append(f"{s['sign']}: şanslı sayı 1-12 arası olmalı")
        son = [r for r in renkler if r['burç'] == s['sign'] and r['tarih'] >= yakin]
        if any(norm(r['renk']) == norm(s['luckyColor']['name']) for r in son): sorun.append(f"{s['sign']}: '{s['luckyColor']['name']}' rengi son 7 günde bu burçta kullanıldı")
        for i in s['items']:
            t = i['text'].strip()
            if len(t) > 72: sorun.append(f"{s['sign']}/{i['label']}: {len(t)} karakter (en fazla 72): {t}")
            if len(t) < 30: sorun.append(f"{s['sign']}/{i['label']}: çok kısa: {t}")
            yeni.append((s['sign'], i['label'], t))
# benzerlik: geçmiş + gün içi
for k, (b, l, t) in enumerate(yeni):
    for r in gecmis:
        o = difflib.SequenceMatcher(None, norm(t), norm(r['cümle'])).ratio()
        if o >= 0.55: sorun.append(f'{b}/{l}: "{t}" ≈ {r["tarih"]} "{r["cümle"]}" (benzerlik {o:.2f})')
        elif r['tarih'] >= yakin and r['burç'] == b and ilk(t) == ilk(r['cümle']) and len(ilk(t)) > 2:
            sorun.append(f'{b}/{l}: "{t}" son 7 gündeki "{r["cümle"]}" ile aynı kelimeyle başlıyor')
    for b2, l2, t2 in yeni[k+1:]:
        o = difflib.SequenceMatcher(None, norm(t), norm(t2)).ratio()
        if o >= 0.55: sorun.append(f'gün içi tekrar: "{t}" ≈ "{t2}" ({o:.2f})')
        elif ilk(t) == ilk(t2) and len(ilk(t)) > 2: sorun.append(f'gün içi aynı açılış kelimesi: "{t}" / "{t2}"')
# açıklama cümleleri
a = json.load(open(f'{klas}/aciklama.json'))
eski_a = [r for r in csv.DictReader(open(f'{KOK}/veri/aciklama-cumleleri.tsv'), delimiter='\t') if r['tarih'] != gun]
for g in ('koc-basak', 'terazi-balik'):
    t = a[g].strip()
    if len(re.findall(r'[\U0001F300-\U0001FAFF☀-➿]', t)) > 1: sorun.append(f'açıklama {g}: en fazla 1 emoji')
    if re.search(r'tuttu mu|etiketle', t.lower()): sorun.append(f'açıklama {g}: yasaklı kalıp')
    for r in eski_a:
        o = difflib.SequenceMatcher(None, norm(t), norm(r['cümle'])).ratio()
        if o >= 0.55: sorun.append(f'açıklama {g}: "{t}" ≈ {r["tarih"]} "{r["cümle"]}" ({o:.2f})')
if difflib.SequenceMatcher(None, norm(a['koc-basak']), norm(a['terazi-balik'])).ratio() >= 0.55: sorun.append('iki açıklama cümlesi birbirine çok benziyor')
if sorun:
    print(f'{len(sorun)} SORUN:'); print('\n'.join('- ' + s for s in sorun)); sys.exit(1)
print('TAMAM: 36 cümle, renkler ve 2 açıklama cümlesi kontrolden geçti.')
