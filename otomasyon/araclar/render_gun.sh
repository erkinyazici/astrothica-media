#!/bin/bash
# Kullanım: bash araclar/render_gun.sh YYYY-AA-GG  → <repo>/<tarih>/{koc-basak,terazi-balik,hikaye}/*.jpg + kontrol paftaları
set -e
GUN=$1; O=$(cd "$(dirname "$0")/.." && pwd); R=$(dirname "$O"); M=$O/metinler/$GUN
cd "$O/sablon"
[ -d node_modules ] || npm ci --no-audit --no-fund --loglevel=error
rm -rf "$R/$GUN/koc-basak" "$R/$GUN/terazi-balik" "$R/$GUN/hikaye"
python3 render_post.py "$M/koc-basak.json" 0 "$R/$GUN/koc-basak"
python3 render_post.py "$M/terazi-balik.json" 1 "$R/$GUN/terazi-balik"
python3 render_story.py "$M/koc-basak.json" "$M/terazi-balik.json" "$R/$GUN/hikaye"
python3 - "$R/$GUN" <<'PY'
import sys,glob
from PIL import Image
r=sys.argv[1]
for alt,boy in (('koc-basak',(270,338)),('terazi-balik',(270,338)),('hikaye',(270,480))):
    fs=sorted(glob.glob(f'{r}/{alt}/*.jpg')); n=4
    sh=Image.new('RGB',(boy[0]*n,boy[1]*((len(fs)+n-1)//n)))
    for i,f in enumerate(fs): sh.paste(Image.open(f).resize(boy),((i%n)*boy[0],(i//n)*boy[1]))
    sh.save(f'/tmp/pafta-{alt}.jpg',quality=85)
print('paftalar: /tmp/pafta-koc-basak.jpg /tmp/pafta-terazi-balik.jpg /tmp/pafta-hikaye.jpg')
PY
