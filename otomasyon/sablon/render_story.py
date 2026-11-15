import json, subprocess, sys, os
from PIL import Image
# kullanım: render_story.py <json1> <json2> <çıktı klasörü>
import glob
B=os.environ.get('CHROME_BIN') or (sorted(glob.glob('/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell'))+[''])[-1]
outdir=sys.argv[-1]; os.makedirs(outdir, exist_ok=True)
signs=[]
for src in sys.argv[1:-1]:
    d=json.load(open(src))
    for s in d['signs']: signs.append({**s,'variant':'A','dateLabel':d['dateLabel'].rsplit(' ',1)[0]})
jobs=[('StorySign',s,f'{i+1:02d}-{s["sign"]}') for i,s in enumerate(signs)]+[('StoryClosing',{},f'{len(signs)+1:02d}-kapanis')]
for comp,props,name in jobs:
    png=f'{outdir}/{name}.png'
    subprocess.run(['npx','remotion','still','src/index.ts',comp,png,f'--props={json.dumps(props,ensure_ascii=False)}',f'--browser-executable={B}','--log=error'],check=True)
    Image.open(png).convert('RGB').save(f'{outdir}/{name}.jpg',quality=92); os.remove(png)
print('ok')
