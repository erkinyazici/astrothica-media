import json, subprocess, sys, os
from PIL import Image
src, group, outdir = sys.argv[1], int(sys.argv[2]), sys.argv[3]
import glob
B=os.environ.get('CHROME_BIN') or (sorted(glob.glob('/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell'))+[''])[-1]
d=json.load(open(src)); os.makedirs(outdir, exist_ok=True)
jobs=[('Cover', {'variant':'A','dateLabel':d['coverDate'],'group':group}, '01-kapak')]
for i,s in enumerate(d['signs']):
    jobs.append(('SignSlide', {'variant':'A','dateLabel':d['dateLabel'],**s}, f'{i+2:02d}-{s["sign"]}'))
jobs.append(('Closing', {'variant':'B'}, f'{len(jobs)+1:02d}-kapanis'))
for comp, props, name in jobs:
    png=f'{outdir}/{name}.png'
    subprocess.run(['npx','remotion','still','src/index.ts',comp,png,f'--props={json.dumps(props, ensure_ascii=False)}',f'--browser-executable={B}','--log=error'],check=True)
    Image.open(png).convert('RGB').save(f'{outdir}/{name}.jpg', quality=92)
    os.remove(png)
print('ok')
