import datetime, os
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # otomasyon/
REPO = os.path.dirname(KOK)
RAW = 'https://raw.githubusercontent.com/erkinyazici/astrothica-media/main'
AYLAR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
GUNLER = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar']
GRUP1 = ['koc','boga','ikizler','yengec','aslan','basak']
GRUP2 = ['terazi','akrep','yay','oglak','kova','balik']
AD = dict(koc='Koç',boga='Boğa',ikizler='İkizler',yengec='Yengeç',aslan='Aslan',basak='Başak',
          terazi='Terazi',akrep='Akrep',yay='Yay',oglak='Oğlak',kova='Kova',balik='Balık')
ETIKET = dict(koc='koç',boga='boğa',ikizler='ikizler',yengec='yengeç',aslan='aslan',basak='başak',
          terazi='terazi',akrep='akrep',yay='yay',oglak='oğlak',kova='kova',balik='balık')
def tarih(s):
    return datetime.date.fromisoformat(s)
def etiket_tarih(d):          # "16 Kasım 2026"
    return f'{d.day} {AYLAR[d.month-1]} {d.year}'
def gun_adi(d):
    return GUNLER[d.weekday()]
