import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, loadFonts} from '../fonts';
import {CREAM, GOLD, GoldText, Logo} from '../carousel/shared';
import TL from './timeline3.json';

loadFonts();

type Sent = {i: number; start: number; end: number; chunks: {words: string[]; start: number; end: number}[]; words: {w: string; f: number}[]};
const S = TL.sentences as Sent[];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
const wf = (s: number, i: number) => S[s].words[i].f;
const SHADOW = '0 0 26px rgba(4,6,42,0.95), 0 2px 10px rgba(4,6,42,0.95)';

// Sahne → cümle eşlemesi. vid: Gemini (Veo) ile hareketlendirilmiş klip varsa onun dosyası.
type Motion = {z0: number; z1: number; x0: number; x1: number; y0: number; y1: number; r0?: number; r1?: number};
type Fx = {kind: 'spin'; cx: number; cy: number; deg: number; maskTo: number} | {kind: 'glow'; cx: number; cy: number; r: number; rise?: number; flicker?: boolean};
type Scene = {img: string; vid?: string; sent: number; m: Motion; fx?: Fx[]};
export const SCENES: Scene[] = [
	{img: 'reel3/s1.jpg', vid: 'reel3/v1.mp4', sent: 0, m: {z0: 1.0, z1: 1.03, x0: 0, x1: 0, y0: 0, y1: 0}},
	{img: 'reel3/s2.jpg', sent: 1, m: {z0: 1.08, z1: 1.0, x0: 30, x1: -20, y0: 0, y1: 0}, fx: [{kind: 'glow', cx: 0.14, cy: 0.7, r: 160, flicker: true}]},
	{img: 'reel3/s3.jpg', sent: 2, m: {z0: 1.0, z1: 1.09, x0: 0, x1: 18, y0: 10, y1: -20}},
	{img: 'reel3/s4.jpg', sent: 3, m: {z0: 1.04, z1: 1.12, x0: 0, x1: 0, y0: 30, y1: -30}, fx: [{kind: 'spin', cx: 0.5, cy: 0.5, deg: 0, maskTo: 1}, {kind: 'glow', cx: 0.5, cy: 0.49, r: 420}]},
	{img: 'reel3/s5.jpg', sent: 4, m: {z0: 1.1, z1: 1.0, x0: -24, x1: 24, y0: -10, y1: 10}},
	{img: 'reel3/s6.jpg', sent: 5, m: {z0: 1.0, z1: 1.06, x0: 0, x1: 0, y0: 20, y1: -10}, fx: [{kind: 'spin', cx: 0.518, cy: 0.256, deg: 9, maskTo: 0.6}]},
	{img: 'reel3/s7.jpg', sent: 6, m: {z0: 1.0, z1: 1.07, x0: -30, x1: 30, y0: 0, y1: 0}},
	{img: 'reel3/s8.jpg', sent: 7, m: {z0: 1.08, z1: 1.0, x0: 0, x1: 0, y0: -30, y1: 20}, fx: [{kind: 'glow', cx: 0.5, cy: 0.635, r: 380, rise: 70}]},
	{img: 'reel3/s9.jpg', sent: 8, m: {z0: 1.0, z1: 1.1, x0: 0, x1: 0, y0: 20, y1: -30}, fx: [{kind: 'glow', cx: 0.6, cy: 0.74, r: 300, flicker: true}]},
];

const IW = 1188;
const IH = 2112;

const SceneLayer: React.FC<{sc: Scene; from: number; to: number; f: number; o: number}> = ({sc, from, to, f, o}) => {
	if (o <= 0.001) return null;
	const p = interpolate(f, [from, to], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
	const {m} = sc;
	const z = m.z0 + (m.z1 - m.z0) * p;
	const x = m.x0 + (m.x1 - m.x0) * p;
	const y = m.y0 + (m.y1 - m.y0) * p;
	const r = (m.r0 ?? 0) + ((m.r1 ?? 0) - (m.r0 ?? 0)) * p;
	const box: React.CSSProperties = {
		position: 'absolute',
		left: (1080 - IW) / 2,
		top: (1920 - IH) / 2,
		width: IW,
		height: IH,
		transform: `translate(${x}px, ${y}px) scale(${z}) rotate(${r}deg)`,
	};
	const full: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: IW, height: IH, objectFit: 'cover'};
	return (
		<AbsoluteFill style={{opacity: o}}>
			<div style={box}>
				{sc.vid ? <OffthreadVideo src={staticFile(sc.vid)} muted style={full} /> : <Img src={staticFile(sc.img)} style={full} />}
				{(sc.fx ?? []).map((fx, k) => {
					if (fx.kind === 'spin') {
						if (!fx.deg) return null;
						const m = `linear-gradient(180deg, black 0%, black ${fx.maskTo * 100 - 6}%, transparent ${fx.maskTo * 100}%)`;
						return (
							<Img
								key={k}
								src={staticFile(sc.img)}
								style={{...full, transformOrigin: `${fx.cx * 100}% ${fx.cy * 100}%`, transform: `rotate(${fx.deg * p}deg) scale(1.04)`, WebkitMaskImage: m, maskImage: m}}
							/>
						);
					}
					const fl = fx.flicker ? 0.75 + 0.25 * Math.sin(f / 2.3) * Math.sin(f / 5.1 + 1) : 0.7 + 0.3 * Math.sin(f / 9);
					const cy = fx.cy * IH - (fx.rise ?? 0) * p;
					return (
						<div
							key={k}
							style={{
								position: 'absolute',
								left: fx.cx * IW - fx.r,
								top: cy - fx.r,
								width: fx.r * 2,
								height: fx.r * 2,
								borderRadius: '50%',
								background: 'radial-gradient(circle, rgba(255,226,170,0.55) 0%, rgba(232,203,152,0.22) 35%, rgba(232,203,152,0) 70%)',
								mixBlendMode: 'screen',
								opacity: fl,
								transform: `scale(${0.92 + 0.12 * fl})`,
							}}
						/>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// Yanıp sönen, yavaşça yükselen yıldız tozu
const Dust: React.FC<{f: number}> = ({f}) => {
	const dots = [];
	for (let k = 0; k < 70; k++) {
		const x = random(`x${k}`) * 1080;
		const y0 = random(`y${k}`) * 1920;
		const sp = 0.15 + random(`s${k}`) * 0.45;
		const y = (((y0 - f * sp) % 1920) + 1920) % 1920;
		const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (18 + random(`t${k}`) * 40) + k));
		const sz = 1.5 + random(`z${k}`) * 3.2;
		const gold = random(`g${k}`) > 0.6;
		dots.push(
			<div
				key={k}
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: sz,
					height: sz,
					borderRadius: '50%',
					background: gold ? '#FBE7C6' : '#F6F0E8',
					opacity: tw * 0.75,
					boxShadow: `0 0 ${sz * 3}px ${gold ? 'rgba(232,203,152,0.9)' : 'rgba(246,240,232,0.7)'}`,
				}}
			/>,
		);
	}
	return <AbsoluteFill style={{pointerEvents: 'none'}}>{dots}</AbsoluteFill>;
};

const Chip: React.FC<{children: React.ReactNode; o: number}> = ({children, o}) => (
	<div style={{position: 'absolute', top: 318, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 18}px)`}}>
		<div
			style={{
				padding: '22px 40px',
				borderRadius: 999,
				background: 'linear-gradient(180deg, rgba(34,28,92,0.82), rgba(14,14,52,0.86))',
				border: '1.5px solid rgba(232,203,152,0.45)',
				boxShadow: '0 0 30px rgba(232,203,152,0.18)',
				fontFamily: FONT.sans,
				fontWeight: 500,
				fontSize: 34,
				letterSpacing: '0.16em',
				lineHeight: 1,
				color: GOLD,
				whiteSpace: 'nowrap',
			}}
		>
			{children}
		</div>
	</div>
);

const KEY = /^(saat|saatte|saatini|yükselen|yükselenini|yükselenin|güneş|güneş'in|burcun|burcuna|burcunu|burcundur|doğarken)$/;
const isKey = (w: string) => KEY.test(w.toLocaleLowerCase('tr-TR').replace(/[.,:;?!“”"]/g, ''));

const Subtitle: React.FC<{f: number}> = ({f}) => {
	for (const s of S) {
		if (s.i === 0) continue;
		for (const c of s.chunks) {
			if (f >= c.start - 2 && f < c.end) {
				const o = interpolate(f, [c.start - 2, c.start + 4, c.end - 3, c.end], [0, 1, 1, 0], clamp);
				return (
					<div style={{position: 'absolute', top: 1280, left: 100, right: 100, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 10}px)`}}>
						<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 66, lineHeight: 1.16, color: CREAM, textShadow: SHADOW}}>
							{c.words.map((w, k) => (
								<span key={k} style={{color: isKey(w) ? GOLD : CREAM}}>
									{w}
									{k < c.words.length - 1 ? ' ' : ''}
								</span>
							))}
						</span>
					</div>
				);
			}
		}
	}
	return null;
};

export const DogumSaatiReel: React.FC = () => {
	const f = useCurrentFrame();
	const {durationInFrames: D} = useVideoConfig();
	const closeAt = S[9].end + 14;
	const close = prog(f, closeAt, closeAt + 20);

	// sahne zamanları
	const starts = SCENES.map((sc, k) => (k === 0 ? 0 : S[sc.sent].start - 8));
	const ends = SCENES.map((_, k) => (k < SCENES.length - 1 ? starts[k + 1] + 12 : D));

	// kanca
	const hookO = interpolate(f, [S[0].end + 6, S[1].start + 4], [1, 0], clamp);
	const h1 = prog(f, 0, 12);
	const h2 = prog(f, wf(0, 2) - 3, wf(0, 2) + 10);

	// üst etiket ve bilgi çipleri
	const labelO = interpolate(f, [S[1].start, S[1].start + 12, S[8].start - 10, S[8].start], [0, 1, 1, 0], clamp);
	const chipO = (a: number, b: number) => interpolate(f, [a - 4, a + 10, b - 8, b + 2], [0, 1, 1, 0], clamp);
	const askO = interpolate(f, [S[8].start - 4, S[8].start + 10, closeAt, closeAt + 12], [0, 1, 1, 0], clamp);

	return (
		<AbsoluteFill style={{background: '#04062A', color: CREAM, fontFamily: FONT.sans}}>
			{SCENES.map((sc, k) => {
				const a = starts[k];
				const b = ends[k];
				const o = k === 0 ? interpolate(f, [b - 12, b], [1, 0], clamp) : interpolate(f, [a, a + 12, b - 12, b], [0, 1, 1, k === SCENES.length - 1 ? 1 : 0], clamp);
				return <SceneLayer key={k} sc={sc} from={a} to={b} f={f} o={o} />;
			})}
			<Dust f={f} />
			{/* okunabilirlik için üst ve alt karartma */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.74) 0%, rgba(4,6,42,0.32) 24%, rgba(4,6,42,0.06) 46%, rgba(4,6,42,0.58) 66%, rgba(2,3,31,0.90) 100%)'}} />

			{/* 0 — kanca */}
			<div style={{position: 'absolute', top: 232, left: 50, right: 50, textAlign: 'center', opacity: hookO}}>
				<div style={{opacity: h1, transform: `scale(${0.94 + 0.06 * h1})`}}>
					<GoldText size={110} style={{lineHeight: 1.06}}>DOĞDUĞUN</GoldText>
					<GoldText size={110} style={{lineHeight: 1.06, marginTop: 6}}>SAAT</GoldText>
				</div>
				<div style={{marginTop: 26, fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 86, lineHeight: 1.1, color: CREAM, textShadow: SHADOW, opacity: h2, transform: `translateY(${(1 - h2) * 16}px)`}}>
					sana ne söylüyor?
				</div>
			</div>

			{/* üst etiket */}
			<div style={{position: 'absolute', top: 236, left: 0, right: 0, textAlign: 'center', opacity: labelO * (1 - close)}}>
				<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 46, letterSpacing: '0.3em', lineHeight: 1.1, color: GOLD, textShadow: SHADOW}}>DOĞDUĞUN SAAT</div>
			</div>
			<Chip o={chipO(S[3].start, S[3].end + 6)}>BURCUN = GÜNEŞ’İN YERİ</Chip>
			<Chip o={chipO(S[4].start, S[4].end + 6)}>YÜKSELEN = İLK İZLENİM</Chip>
			<Chip o={chipO(S[5].start, S[5].end + 8)}>≈ 2 SAATTE BİR DEĞİŞİR</Chip>
			<Chip o={chipO(S[7].start, S[7].end + 6)}>GÜN DOĞUMU: YÜKSELEN ≈ BURCUN</Chip>

			{/* 8–9 — soru */}
			<div style={{position: 'absolute', top: 250, left: 50, right: 50, textAlign: 'center', opacity: askO, transform: `scale(${0.95 + 0.05 * askO})`}}>
				<GoldText size={84} style={{lineHeight: 1.1}}>BURCUNA</GoldText>
				<GoldText size={84} style={{lineHeight: 1.1, marginTop: 4}}>BENZİYOR MUSUN?</GoldText>
			</div>

			<Subtitle f={f} />
			<div style={{position: 'absolute', top: 1476, width: '100%', textAlign: 'center', fontFamily: FONT.sans, fontSize: 22, letterSpacing: '0.16em', lineHeight: 1, color: 'rgba(246,240,232,0.45)', opacity: 1 - close}}>@astrothica</div>

			{/* kapanış */}
			<AbsoluteFill style={{background: 'rgba(4,6,42,0.86)', opacity: close}} />
			<div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: close, transform: `scale(${0.94 + 0.06 * close})`}}>
				<Logo width={520} />
			</div>
			<div style={{position: 'absolute', top: 1150, left: 70, right: 70, textAlign: 'center', opacity: close}}>
				<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 64, lineHeight: 1.16, color: CREAM}}>Burcunu ve doğum saatini<br />yorumlara yaz.</div>
				<div style={{marginTop: 34, fontFamily: FONT.sans, fontWeight: 500, fontSize: 28, letterSpacing: '0.22em', lineHeight: 1, color: GOLD}}>WWW.ASTROTHICA.COM</div>
			</div>
			<Audio src={staticFile('audio/reel3.wav')} />
		</AbsoluteFill>
	);
};

export const REEL3_DURATION = TL.durationInFrames as number;
