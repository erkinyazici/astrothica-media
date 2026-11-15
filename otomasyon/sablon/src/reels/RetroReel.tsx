import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, loadFonts} from '../fonts';
import {CREAM, GOLD, GOLD_DEEP, GoldText, Logo, MUTED} from '../carousel/shared';
import TL from './timeline2.json';

loadFonts();

type Sent = {i: number; start: number; end: number; chunks: {words: string[]; start: number; end: number}[]; words: {w: string; f: number}[]};
const S = TL.sentences as Sent[];
const H = 1920;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
const wf = (s: number, i: number) => S[s].words[i].f;
const SHADOW = '0 0 26px rgba(4,6,42,0.95), 0 2px 10px rgba(4,6,42,0.95)';

const Bg: React.FC<{src: string; f: number; from: number; to: number; z0: number; z1: number; oy?: string; o: number}> = ({src, f, from, to, z0, z1, oy = '50%', o}) => {
	const z = interpolate(f, [from, to], [z0, z1], clamp);
	return (
		<AbsoluteFill style={{opacity: o}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, transformOrigin: `50% ${oy}`}} />
		</AbsoluteFill>
	);
};

const SIGNS = ['Eski biri geri döndü', 'Yanlış anlaşıldın', 'Kararından şüphe ettin'];

const SignRow: React.FC<{n: number; p: number; pulse: number; dim: number}> = ({n, p, pulse, dim}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			height: 148,
			marginBottom: 26,
			padding: '0 40px 0 30px',
			borderRadius: 30,
			background: 'linear-gradient(180deg, rgba(34,28,92,0.80), rgba(14,14,52,0.84))',
			border: `1.5px solid rgba(232,203,152,${0.3 + pulse * 0.6})`,
			boxShadow: `0 0 ${40 * pulse}px rgba(232,203,152,${0.45 * pulse})`,
			opacity: p * (1 - dim * 0.45),
			transform: `translateY(${(1 - p) * 40}px) scale(${1 + pulse * 0.035})`,
		}}
	>
		<div style={{width: 96, textAlign: 'center', flexShrink: 0}}>
			<GoldText size={84} style={{letterSpacing: 0, lineHeight: 1}}>{n}</GoldText>
		</div>
		<div style={{width: 1.5, height: 76, background: 'rgba(232,203,152,0.35)', margin: '0 30px 0 14px', flexShrink: 0}} />
		<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 58, lineHeight: 1, color: CREAM, whiteSpace: 'nowrap'}}>{SIGNS[n - 1]}</div>
	</div>
);

const RetroRow: React.FC<{name: string; from: string; p: number; fill: number; done: number}> = ({name, from, p, fill, done}) => (
	<div style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`, marginBottom: 34}}>
		<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
			<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 44, letterSpacing: '0.12em', lineHeight: 1, color: GOLD}}>{name} RETROSU</div>
			<div style={{fontFamily: FONT.sans, fontWeight: 500, fontSize: 26, letterSpacing: '0.16em', lineHeight: 1, color: done > 0.5 ? GOLD : MUTED}}>{done > 0.5 ? 'BİTTİ' : 'SÜRÜYOR'}</div>
		</div>
		<div style={{position: 'relative', height: 10, borderRadius: 5, background: 'rgba(246,240,232,0.16)'}}>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 5, background: `linear-gradient(90deg, ${GOLD_DEEP}, ${GOLD}, #FFF4DE)`, boxShadow: `0 0 ${14 + done * 18}px rgba(232,203,152,${0.5 + done * 0.4})`}} />
		</div>
		<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: FONT.sans, fontWeight: 500, fontSize: 26, letterSpacing: '0.14em', lineHeight: 1, color: MUTED}}>
			<span>{from}</span>
			<span>13 KASIM</span>
		</div>
	</div>
);

const Subtitle: React.FC<{f: number}> = ({f}) => {
	for (const s of S) {
		if (s.i === 0) continue;
		for (const c of s.chunks) {
			if (f >= c.start - 2 && f < c.end) {
				const o = interpolate(f, [c.start - 2, c.start + 4, c.end - 3, c.end], [0, 1, 1, 0], clamp);
				return (
					<div style={{position: 'absolute', top: 1296, left: 80, right: 80, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 10}px)`}}>
						<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 66, lineHeight: 1.16, color: CREAM, textShadow: SHADOW}}>
							{c.words.map((w, k) => (
								<span key={k} style={{color: /retro/i.test(w) ? GOLD : CREAM}}>
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

export const RetroReel: React.FC = () => {
	const f = useCurrentFrame();
	const {durationInFrames: D} = useVideoConfig();
	const a2 = S[5].start - 12; // gezegen sahnesi başlar
	const b2 = S[7].start - 4; // pencere sahnesine dönüş
	const closeAt = S[8].end + 14;
	const bg2o = interpolate(f, [a2, a2 + 16, b2, b2 + 16], [0, 1, 1, 0], clamp);
	const close = prog(f, closeAt, closeAt + 20);

	// kanca
	const hookO = interpolate(f, [0, 6, S[0].end + 4, S[1].start + 6], [1, 1, 1, 0], clamp);
	const h2 = prog(f, wf(0, 2) - 2, wf(0, 2) + 10);
	const h3 = prog(f, wf(0, 5) - 2, wf(0, 5) + 10);

	// üç işaret
	const rowsIn = interpolate(f, [S[2].start - 8, S[2].start, S[5].start - 14, S[5].start - 2], [0, 1, 1, 0], clamp);
	const rowsBack = interpolate(f, [S[8].start - 10, S[8].start + 2, closeAt, closeAt + 12], [0, 1, 1, 0], clamp);
	const rowsO = Math.max(rowsIn, rowsBack);
	const back = f >= S[7].start;
	const rp = [2, 3, 4].map((s) => (back ? prog(f, S[8].start - 10 + (s - 2) * 4, S[8].start + 6 + (s - 2) * 4) : prog(f, S[s].start - 2, S[s].start + 14)));
	const pulseAt = (c: number) => interpolate(f, [c - 6, c, c + 10], [0, 1, 0], clamp);
	const kacF = wf(8, 2);
	const pulse = [0, 1, 2].map((k) => (back ? pulseAt(kacF + k * 9) : pulseAt(S[k + 2].start + 6)));
	const dim = [0, 1, 2].map((k) => (back ? 0 : prog(f, S[k + 3]?.start - 4, S[k + 3]?.start + 10) * (k < 2 ? 1 : 0)));
	const headO = interpolate(f, [wf(1, 7) - 2, wf(1, 7) + 10, S[5].start - 14, S[5].start - 2], [0, 1, 1, 0], clamp);
	const askO = rowsBack;

	// retro çizelgesi
	const chartO = interpolate(f, [S[5].start - 2, S[5].start + 10, b2 - 6, b2 + 6], [0, 1, 1, 0], clamp);
	const venP = prog(f, wf(5, 4) - 6, wf(5, 4) + 8);
	const merP = prog(f, wf(5, 9) - 6, wf(5, 9) + 8);
	const bitti = wf(6, 6);
	const venFill = interpolate(f, [wf(5, 4), bitti], [0.06, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const merFill = interpolate(f, [wf(5, 9), bitti], [0.06, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const done = prog(f, bitti - 2, bitti + 8);

	return (
		<AbsoluteFill style={{background: '#04062A', color: CREAM, fontFamily: FONT.sans}}>
			<Bg src="reel2/bg1.jpg" f={f} from={0} to={D} z0={1.02} z1={1.16} oy="38%" o={1} />
			<Bg src="reel2/bg2.jpg" f={f} from={a2} to={b2 + 16} z0={1.2} z1={1.28} oy="100%" o={bg2o} />
			{/* okunabilirlik için üst ve alt karartma */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.72) 0%, rgba(4,6,42,0.30) 26%, rgba(4,6,42,0.10) 48%, rgba(4,6,42,0.62) 70%, rgba(2,3,31,0.90) 100%)'}} />

			{/* 1 — kanca */}
			<div style={{position: 'absolute', top: 262, left: 60, right: 60, textAlign: 'center', opacity: hookO}}>
				<GoldText size={124} style={{lineHeight: 1.05}}>13 KASIM’DA</GoldText>
				<div style={{marginTop: 26, fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 96, lineHeight: 1.1, color: CREAM, textShadow: SHADOW, opacity: h2, transform: `translateY(${(1 - h2) * 16}px)`}}>bir şey bitti.</div>
				<div style={{marginTop: 150, fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 96, lineHeight: 1.1, color: GOLD, textShadow: SHADOW, opacity: h3, transform: `scale(${0.92 + 0.08 * h3})`}}>Fark ettin mi?</div>
			</div>

			{/* 2–5 ve 9 — üç işaret */}
			<div style={{position: 'absolute', top: 236, left: 0, right: 0, textAlign: 'center', opacity: Math.max(headO * (1 - askO), askO)}}>
				{askO > 0.01 ? (
					<GoldText size={62} style={{lineHeight: 1.1}}>SEN KAÇ NUMARAYDIN?</GoldText>
				) : (
					<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 46, letterSpacing: '0.3em', lineHeight: 1.1, color: GOLD, textShadow: SHADOW}}>ÇİFT RETRO</div>
				)}
			</div>
			<div style={{position: 'absolute', top: 372, left: 80, right: 80, opacity: rowsO}}>
				{[1, 2, 3].map((n) => (
					<SignRow key={n} n={n} p={rp[n - 1]} pulse={pulse[n - 1]} dim={dim[n - 1]} />
				))}
			</div>

			{/* 6–7 — retro çizelgesi */}
			<div style={{position: 'absolute', top: 236, left: 0, right: 0, textAlign: 'center', opacity: chartO}}>
				<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 46, letterSpacing: '0.3em', lineHeight: 1.1, color: GOLD, textShadow: SHADOW}}>ÇİFT RETRO</div>
			</div>
			<div style={{position: 'absolute', top: 936, left: 70, right: 70, padding: '40px 40px 8px', borderRadius: 30, background: 'linear-gradient(180deg, rgba(34,28,92,0.80), rgba(14,14,52,0.86))', border: '1.5px solid rgba(232,203,152,0.30)', opacity: chartO}}>
				<RetroRow name="VENÜS" from="3 EKİM" p={venP} fill={venFill} done={done} />
				<RetroRow name="MERKÜR" from="24 EKİM" p={merP} fill={merFill} done={done} />
			</div>

			<Subtitle f={f} />
			<div style={{position: 'absolute', top: 1476, width: '100%', textAlign: 'center', fontFamily: FONT.sans, fontSize: 22, letterSpacing: '0.16em', lineHeight: 1, color: 'rgba(246,240,232,0.45)', opacity: 1 - close}}>@astrothica</div>

			{/* kapanış */}
			<AbsoluteFill style={{background: 'rgba(4,6,42,0.86)', opacity: close}} />
			<div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: close, transform: `scale(${0.94 + 0.06 * close})`}}>
				<Logo width={520} />
			</div>
			<div style={{position: 'absolute', top: 1150, left: 70, right: 70, textAlign: 'center', opacity: close}}>
				<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 64, lineHeight: 1.16, color: CREAM}}>Retro senin haritanda nereye dokundu?</div>
				<div style={{marginTop: 34, fontFamily: FONT.sans, fontWeight: 500, fontSize: 28, letterSpacing: '0.22em', lineHeight: 1, color: GOLD}}>WWW.ASTROTHICA.COM</div>
			</div>
			<Audio src={staticFile('audio/reel2.wav')} />
		</AbsoluteFill>
	);
};

export const REEL2_DURATION = TL.durationInFrames as number;
