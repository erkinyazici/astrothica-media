import asyncio, json, os, edge_tts
PROXY=os.environ.get('HTTPS_PROXY')
S=[
"Annenle konuşurken neden hep aynı yerde tıkanıyorsunuz?",
"Belki mesele konu değil… elementiniz.",
"Astrolojide her burç dört elementten birine aittir: ateş, toprak, hava ve su.",
"Ateş ve su… Biri aklındakini hemen söyler, diğeri o sözü günlerce taşır.",
"Toprak ve hava… Biri garanti ister, diğeri özgürlük. Biri “plan yapalım” der, diğeri “bakarız”.",
"Ateş ve hava birbirini büyütür; ama aynı anda konuştuklarında kimse dinlemez.",
"Toprak ve su sessizce anlaşır; kırgınlıklar da sessizce birikir.",
"Peki aynı elementtenseniz? O zaman birbirinizin aynasısınız.",
"En çok da bu yüzden çatışırsınız; çünkü onda gördüğün, aslında sende olan.",
"Belki iyileşmek aynı dili konuşmak değil; birbirinizin dilini öğrenmektir.",
"Annenin burcunu ve kendi burcunu yorumlara yaz; elementinizin size ne anlattığına birlikte bakalım.",
"Daha derinini merak ediyorsan, ikinizin haritasını Astrotika'da karşılaştır. Sinastri tam olarak bunun için.",
]
async def one(i,t):
    c=edge_tts.Communicate(t,'tr-TR-EmelNeural',rate='-6%',boundary='WordBoundary',proxy=PROXY)
    words=[]; 
    with open(f's{i:02d}.mp3','wb') as f:
        async for ch in c.stream():
            if ch['type']=='audio': f.write(ch['data'])
            elif ch['type']=='WordBoundary': words.append({'t':ch['offset']/1e7,'d':ch['duration']/1e7,'w':ch['text']})
    return {'i':i,'text':t,'words':words}
async def main():
    out=[await one(i,t) for i,t in enumerate(S)]
    json.dump(out,open('tts.json','w'),ensure_ascii=False,indent=1)
asyncio.run(main())
