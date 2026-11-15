import json, re, subprocess
d=json.load(open('tts.json'))
LEAD=0.35; GAP=0.38; TAIL=3.6; FPS=30
dur=[float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f's{x["i"]:02d}.mp3']).decode()) for x in d]
t=LEAD; sents=[]; parts=[]
for x,du in zip(d,dur):
    ws=x['words']; toks=[w['w'] for w in ws]
    chunks=[];cur=[]
    for k,tok in enumerate(toks):
        cur.append(k)
        txt=' '.join(toks[j] for j in cur)
        nxt=len(toks[k+1]) if k+1<len(toks) else 0
        if (re.search(r'[.;?…:,]$',tok) and len(txt)>=12) or len(txt)+1+nxt>30 or k==len(toks)-1:
            chunks.append(cur);cur=[]
    OV={1:[3,5],4:[3,2,5]}
    if x['i'] in OV:
        chunks=[];k=0
        for n in OV[x['i']]: chunks.append(list(range(k,k+n)));k+=n
        assert k==len(toks),(k,len(toks))
    if len(chunks)>1 and len(' '.join(toks[j] for j in chunks[-1]))<10 and len(' '.join(toks[j] for j in chunks[-2]+chunks[-1]))<=38:
        chunks[-2]=chunks[-2]+chunks[-1]; chunks.pop()
    cs=[{'words':[toks[j] for j in c],'start':round((t+ws[c[0]]['t'])*FPS)} for c in chunks]
    for n in range(len(cs)):
        cs[n]['end']=cs[n+1]['start'] if n+1<len(cs) else round((t+du)*FPS)+6
    sents.append({'i':x['i'],'start':round(t*FPS),'end':round((t+du)*FPS),'chunks':cs,'words':[{'w':w['w'],'f':round((t+w['t'])*FPS)} for w in ws]})
    parts.append((f's{x["i"]:02d}.mp3',t)); t+=du+GAP
total=t-GAP+TAIL
json.dump({'fps':FPS,'durationInFrames':round(total*FPS),'sentences':sents},open('timeline3.json','w'),ensure_ascii=False,indent=1)
inputs=[];flt=[]
for k,(f,st) in enumerate(parts):
    inputs+=['-i',f]; ms=int(st*1000); flt.append(f'[{k}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[a{k}]')
flt.append(''.join(f'[a{k}]' for k in range(len(parts)))+f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur={total}[out]')
subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',';'.join(flt),'-map','[out]','-ar','48000','narration.wav'],check=True)
print('total',round(total,2),'frames',round(total*FPS))
for s in sents: print(s['i'],s['start'],s['end'],[' '.join(c['words']) for c in s['chunks']])
