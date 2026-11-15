import numpy as np, wave, sys
SR=48000; T=float(sys.argv[1]); n=int(SR*T); t=np.arange(n)/SR
rng=np.random.default_rng(7)
def env_fade(x,fi=3,fo=4):
    e=np.ones_like(x); a=int(fi*SR); b=int(fo*SR)
    e[:a]=np.linspace(0,1,a)**2; e[-b:]=np.linspace(1,0,b)**2; return x*e
L=np.zeros(n); R=np.zeros(n)
# pad: Dm(add9) -> Bb(add9) -> F -> C slow progression, 11s each
chords=[[146.83,220.0,349.23,440.0,659.25],[116.54,174.61,293.66,349.23,523.25],[174.61,261.63,349.23,440.0,523.25],[130.81,196.0,329.63,392.0,587.33]]
seg=11.0
for k in range(int(np.ceil(T/seg))+1):
    ch=chords[k%4]; st=k*seg-2.0
    idx=(t>=st)&(t<st+seg+4)
    if not idx.any(): continue
    tt=t[idx]-st; e=np.sin(np.pi*np.clip(tt/(seg+4),0,1))**1.5
    for j,f in enumerate(ch):
        det=1+0.0025*(j%2*2-1)
        v=np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*f*2*tt+0.3)+0.12*np.sin(2*np.pi*f*3*tt)
        v2=np.sin(2*np.pi*f*det*tt+1.1)
        lfo=0.75+0.25*np.sin(2*np.pi*(0.07+0.013*j)*tt+j)
        amp=0.055/(1+j*0.35)
        L[idx]+=amp*e*lfo*(0.6*v+0.4*v2); R[idx]+=amp*e*lfo*(0.4*v+0.6*v2)
# shimmer bells
notes=[587.33,659.25,880.0,987.77,1174.66,1318.5]
for s in np.arange(2.5,T-3,2.9):
    s+=rng.uniform(-0.6,0.6); f=rng.choice(notes); i0=int(s*SR); m=int(4*SR)
    if i0+m>n: break
    tt=np.arange(m)/SR; v=np.sin(2*np.pi*f*tt)*np.exp(-tt*1.1)*0.025
    p=rng.uniform(0.2,0.8); L[i0:i0+m]+=v*p; R[i0:i0+m]+=v*(1-p)
st=np.stack([env_fade(L),env_fade(R)],1); st/=np.max(np.abs(st))*1.25
w=wave.open('ambient_raw.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
