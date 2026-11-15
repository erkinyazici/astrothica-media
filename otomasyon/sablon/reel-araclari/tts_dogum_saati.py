import json, base64, re, subprocess, sys, urllib.request, os
K=os.environ['ELK']; VOICE='SBqwqJrrVooSHZ6ofGmf'
# {ekran|okunuş}
S=[
"Doğduğun saat sana ne söylüyor?",
"Burcunun özelliklerini okuyunca “bu ben değilim” mi diyorsun?",
"Sebebi doğduğun saat olabilir.",
"Burcun, doğduğun gün Güneş'in nerede olduğunu söyler.",
"Doğduğun saat ise yükselenini belirler: insanların sende ilk gördüğü yüzü.",
"Yükselen ortalama iki saatte bir değişir.",
"Aynı gün doğan iki kişinin birbirine pek benzememesinin bir sebebi de bu.",
"Güneş doğarken doğduysan, büyük ihtimalle yükselenin de kendi burcundur.",
"Sen burcuna benziyor musun?",
"Burcunu ve doğum saatini yorumlara yaz.",
]
spoken=[re.sub(r'\{([^|]*)\|([^}]*)\}',r'\2',s) for s in S]
out=[]
for i,s in enumerate(S):
    # display tokens with spoken word counts
    toks=[]
    for m in re.finditer(r'\{([^|]*)\|([^}]*)\}(\S*)|(\S+)',s):
        if m.group(4): toks.append((m.group(4),1))
        else: toks.append((m.group(1)+m.group(3),len(m.group(2).split())))
    body={'text':spoken[i],'model_id':'eleven_multilingual_v2','language_code':'tr',
          'voice_settings':{'stability':0.45,'similarity_boost':0.8,'style':0.25,'speed':0.97}}
    if i>0: body['previous_text']=spoken[i-1]
    if i<len(S)-1: body['next_text']=spoken[i+1]
    req=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128',
        data=json.dumps(body).encode(),headers={'xi-api-key':K,'Content-Type':'application/json'})
    d=json.load(urllib.request.urlopen(req,timeout=90))
    open(f's{i:02d}.mp3','wb').write(base64.b64decode(d['audio_base64']))
    al=d['alignment']; ch=al['characters']; st=al['character_start_times_seconds']; en=al['character_end_times_seconds']
    words=[];cur=None
    for c,a,b in zip(ch,st,en):
        if c.isspace():
            if cur: words.append(cur);cur=None
        else:
            if not cur: cur={'w':'','t':a,'e':b}
            cur['w']+=c;cur['e']=b
    if cur: words.append(cur)
    k=0;dw=[]
    for t,n in toks:
        dw.append({'w':t,'t':words[k]['t'],'e':words[k+n-1]['e']});k+=n
    assert k==len(words),(i,k,len(words),[w['w'] for w in words])
    out.append({'i':i,'text':' '.join(t for t,_ in toks),'words':dw})
    print(i,len(words),'ok')
json.dump(out,open('tts.json','w'),ensure_ascii=False,indent=1)
