import json, re, subprocess
d=json.load(open('tts.json'))
LEAD=0.5; GAP=0.55; TAIL=1.6; FPS=30
dur=[float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f's{x["i"]:02d}.mp3']).decode()) for x in d]
t=LEAD; sents=[]; parts=[]
for x,du in zip(d,dur):
    text=x['text'].replace("Astrotika","Astrothica")
    toks=text.split()
    ws=x['words']
    if len(toks)!=len(ws): print('MISMATCH',x['i'],len(toks),len(ws),toks,[w['w'] for w in ws])
    # chunks
    chunks=[];cur=[];
    for k,tok in enumerate(toks):
        cur.append(k)
        txt=' '.join(toks[j] for j in cur)
        nxt=len(toks[k+1]) if k+1<len(toks) else 0
        if (re.search(r'[.;?…:,]$|”$',tok) and len(txt)>=12) or len(txt)+1+nxt>32 or k==len(toks)-1:
            chunks.append(cur);cur=[]
    if cur: chunks.append(cur)
    if len(chunks)>1 and len(' '.join(toks[j] for j in chunks[-1]))<12 and len(' '.join(toks[j] for j in chunks[-2]+chunks[-1]))<=40:
        chunks[-2]=chunks[-2]+chunks[-1]; chunks.pop()
    cs=[]
    for c in chunks:
        a=ws[min(c[0],len(ws)-1)]['t']; cs.append({'text':' '.join(toks[j] for j in c),'start':round((t+a)*FPS)})
    for n in range(len(cs)):
        cs[n]['end']=cs[n+1]['start'] if n+1<len(cs) else round((t+du)*FPS)+8
    sents.append({'i':x['i'],'start':round(t*FPS),'end':round((t+du)*FPS),'chunks':cs})
    parts.append((f's{x["i"]:02d}.mp3',t))
    t+=du+GAP
total=t-GAP+TAIL
json.dump({'fps':FPS,'durationInFrames':round(total*FPS),'sentences':sents},open('timeline.json','w'),ensure_ascii=False,indent=1)
# build narration
inputs=[];flt=[]
for k,(f,st) in enumerate(parts):
    inputs+=['-i',f]; ms=int(st*1000); flt.append(f'[{k}:a]adelay={ms}|{ms},aresample=48000[a{k}]')
flt.append(''.join(f'[a{k}]' for k in range(len(parts)))+f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur={total}[out]')
subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',';'.join(flt),'-map','[out]','-ac','2','-ar','48000','narration.wav'],check=True)
print('total',round(total,2),'frames',round(total*FPS))
for s in sents: print(s['i'],s['start'],s['end'],[c['text'] for c in s['chunks']])
