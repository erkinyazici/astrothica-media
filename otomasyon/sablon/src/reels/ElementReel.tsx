import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, loadFonts} from '../fonts';
import {Background, CREAM, GOLD, GoldText, Logo, MUTED, upper} from '../carousel/shared';
import TL from './timeline1.json';

loadFonts();

type Word = {w: string; f: number};
type Sent = {i: number; start: number; end: number; chunks: {text: string; start: number; end: number}[]; words: Word[]};
const S = TL.sentences as Sent[];
const W = 1080;
const H = 1920;
const CX = 540;
const CY = 760; // sahne merkezi

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
const wordF = (s: number, idx: number) => S[s].words[Math.min(idx, S[s].words.length - 1)].f;

// ---------------- Element tanımları ----------------
type El = 'fire' | 'water' | 'air' | 'earth';
const EL: Record<El, {name: string; color: string; glow: string; up: boolean; bar: boolean}> = {
	fire: {name: 'Ateş', color: '#F4A259', glow: 'rgba(244,162,89,0.55)', up: true, bar: false},
	earth: {name: 'Toprak', color: '#A8C686', glow: 'rgba(168,198,134,0.5)', up: false, bar: true},
	air: {name: 'Hava', color: '#C9D3F5', glow: 'rgba(201,211,245,0.5)', up: true, bar: true},
	water: {name: 'Su', color: '#6FB3F0', glow: 'rgba(111,179,240,0.55)', up: false, bar: false},
};

const Glyph: React.FC<{el: El; x: number; y: number; size?: number; o?: number; label?: boolean; pulse?: number}> = ({
	el,
	x,
	y,
	size = 170,
	o = 1,
	label = true,
	pulse = 0,
}) => {
	const e = EL[el];
	const r = size / 2;
	const t = r * 0.62;
	const pts = e.up
		? `0,${-t} ${t * 0.92},${t * 0.6} ${-t * 0.92},${t * 0.6}`
		: `0,${t} ${t * 0.92},${-t * 0.6} ${-t * 0.92},${-t * 0.6}`;
	return (
		<div style={{position: 'absolute', left: x - r, top: y - r, width: size, height: size, opacity: o}}>
			<svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} style={{overflow: 'visible'}}>
				<defs>
					<radialGradient id={`gl${el}`}>
						<stop offset="0%" stopColor={e.color} stopOpacity={0.45 + pulse * 0.3} />
						<stop offset="100%" stopColor={e.color} stopOpacity={0} />
					</radialGradient>
				</defs>
				<circle r={r * 1.55} fill={`url(#gl${el})`} />
				<circle r={r * 0.95} fill="rgba(10,10,46,0.55)" stroke={e.color} strokeOpacity={0.55} strokeWidth={2} />
				<polygon points={pts} fill="none" stroke={e.color} strokeWidth={5} strokeLinejoin="round" />
				{e.bar && <line x1={-t * 0.62} x2={t * 0.62} y1={e.up ? t * 0.05 : -t * 0.05} y2={e.up ? t * 0.05 : -t * 0.05} stroke={e.color} strokeWidth={5} strokeLinecap="round" />}
			</svg>
			{label && (
				<div style={{position: 'absolute', top: size + 18, left: -60, right: -60, textAlign: 'center', fontFamily: FONT.display, fontWeight: 600, fontSize: 30, letterSpacing: '0.24em', color: e.color}}>
					{upper(e.name)}
				</div>
			)}
		</div>
	);
};

// ---------------- İnsan figürü ----------------
const Figure: React.FC<{x: number; y: number; s?: number; o?: number; heart?: number; heartColor?: string; flip?: boolean}> = ({
	x,
	y,
	s = 1,
	o = 1,
	heart = 0,
	heartColor = '#F4A259',
	flip = false,
}) => {
	const id = `fg${Math.round(x)}${Math.round(y)}${Math.round(s * 100)}`;
	return (
		<svg
			width={200 * s}
			height={480 * s}
			viewBox="-100 -60 200 480"
			style={{position: 'absolute', left: x - 100 * s, top: y - 60 * s, opacity: o, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}
		>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#FFF6E8" />
					<stop offset="55%" stopColor="#C9B8E8" />
					<stop offset="100%" stopColor="#6E5BB0" stopOpacity={0.7} />
				</linearGradient>
				<radialGradient id={`${id}h`}>
					<stop offset="0%" stopColor={heartColor} stopOpacity={0.95} />
					<stop offset="100%" stopColor={heartColor} stopOpacity={0} />
				</radialGradient>
				<filter id={`${id}f`} x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="6" result="b" />
					<feMerge>
						<feMergeNode in="b" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			<g filter={`url(#${id}f)`} opacity={0.95}>
				<circle cx={0} cy={0} r={34} fill={`url(#${id})`} />
				<path d="M-46 52 Q0 36 46 52 L54 220 Q40 236 30 232 L26 400 Q14 410 4 404 L0 250 L-4 404 Q-14 410 -26 400 L-30 232 Q-40 236 -54 220 Z" fill={`url(#${id})`} />
			</g>
			{heart > 0 && <circle cx={0} cy={110} r={60} fill={`url(#${id}h)`} opacity={heart} />}
		</svg>
	);
};

// ---------------- Konuşma balonu ----------------
const Bubble: React.FC<{x: number; y: number; text: string; o: number; color?: string; dx?: number}> = ({x, y, text, o, color = CREAM, dx = 0}) => (
	<div
		style={{
			position: 'absolute',
			left: x + dx,
			top: y,
			transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * o})`,
			opacity: o,
			padding: '22px 34px',
			borderRadius: 34,
			background: 'rgba(30,26,88,0.75)',
			border: '1.5px solid rgba(232,203,152,0.45)',
			fontFamily: FONT.serif,
			fontStyle: 'italic',
			fontWeight: 500,
			fontSize: 50,
			lineHeight: 1,
			whiteSpace: 'nowrap',
			color,
		}}
	>
		{text}
	</div>
);

// ---------------- Sahneler ----------------
const Scene: React.FC<{i: number; f: number}> = ({i, f}) => {
	const s = S[i];
	const lf = f - s.start; // sahne içi kare
	switch (i) {
		case 0: {
			const crack = prog(f, s.start + 25, s.start + 110);
			const pts = [
				[540, 520],
				[520, 600],
				[560, 660],
				[525, 740],
				[565, 810],
				[530, 880],
				[555, 960],
			];
			const n = Math.max(1, Math.floor(crack * (pts.length - 1)) + 1);
			const path = pts.slice(0, n + 1).map((p, k) => `${k ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
			return (
				<>
					<Figure x={340} y={560} s={1.12} heart={0.6} heartColor="#F4A259" />
					<Figure x={760} y={640} s={0.86} heart={0.6} heartColor="#6FB3F0" flip />
					<svg width={W} height={H} style={{position: 'absolute'}}>
						<path d={path} fill="none" stroke="#F2C48D" strokeWidth={4} strokeLinejoin="round" opacity={0.9} style={{filter: 'drop-shadow(0 0 10px rgba(242,196,141,0.9))'}} />
					</svg>
					<div style={{position: 'absolute', top: 1110, width: '100%', textAlign: 'center', fontFamily: FONT.sans, fontSize: 26, letterSpacing: '0.3em', color: MUTED}}>ANNE · ÇOCUK</div>
				</>
			);
		}
		case 1: {
			const els: El[] = ['fire', 'earth', 'air', 'water'];
			const dim = interpolate(lf, [0, 30], [1, 0.35], clamp);
			return (
				<>
					<Figure x={CX - 70} y={600} s={0.9} o={dim} />
					<Figure x={CX + 70} y={640} s={0.7} o={dim} flip />
					{els.map((el, k) => {
						const a = (-90 + k * 90) * (Math.PI / 180);
						const p = prog(f, wordF(1, 4) - 4 + k * 5, wordF(1, 4) + 20 + k * 5);
						return <Glyph key={el} el={el} x={CX + Math.cos(a) * 330 * p} y={CY + Math.sin(a) * 330 * p} o={p} size={150} />;
					})}
				</>
			);
		}
		case 2: {
			const signs = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
			const order: El[] = ['fire', 'earth', 'air', 'water'];
			const hl = [wordF(2, 7), wordF(2, 8), wordF(2, 9), wordF(2, 11)];
			const rot = interpolate(lf, [0, 220], [-8, 8]);
			const appear = prog(f, s.start, s.start + 30);
			return (
				<>
					<svg width={W} height={H} style={{position: 'absolute', opacity: appear}}>
						<g transform={`rotate(${rot} ${CX} ${CY})`}>
							<circle cx={CX} cy={CY} r={380} fill="none" stroke="rgba(232,203,152,0.3)" strokeWidth={1.5} />
							<circle cx={CX} cy={CY} r={250} fill="none" stroke="rgba(232,203,152,0.3)" strokeWidth={1.5} />
							{signs.map((_, k) => {
								const el = order[k % 4];
								const on = f >= hl[order.indexOf(el)] ? 1 : 0;
								const a0 = ((k * 30 - 105) * Math.PI) / 180;
								const a1 = (((k + 1) * 30 - 105) * Math.PI) / 180;
								const p = (r: number, a: number) => `${CX + Math.cos(a) * r} ${CY + Math.sin(a) * r}`;
								return (
									<path
										key={k}
										d={`M${p(250, a0)} L${p(380, a0)} A380 380 0 0 1 ${p(380, a1)} L${p(250, a1)} A250 250 0 0 0 ${p(250, a0)} Z`}
										fill={EL[el].color}
										fillOpacity={0.05 + on * 0.28}
										stroke="rgba(232,203,152,0.3)"
										strokeWidth={1.5}
									/>
								);
							})}
						</g>
					</svg>
					{signs.map((nm, k) => {
						const a = ((k * 30 - 90 + rot) * Math.PI) / 180;
						const el = order[k % 4];
						const on = f >= hl[order.indexOf(el)];
						return (
							<div
								key={nm}
								style={{
									position: 'absolute',
									left: CX + Math.cos(a) * 315 - 90,
									top: CY + Math.sin(a) * 315 - 16,
									width: 180,
									textAlign: 'center',
									fontFamily: FONT.display,
									fontWeight: 600,
									fontSize: 24,
									letterSpacing: '0.08em',
									color: on ? EL[el].color : 'rgba(246,240,232,0.45)',
									opacity: appear,
								}}
							>
								{upper(nm)}
							</div>
						);
					})}
					{order.map((el, k) => {
						const p = prog(f, hl[k] - 3, hl[k] + 12);
						const pos = [
							[CX - 70, CY - 70],
							[CX + 70, CY - 70],
							[CX - 70, CY + 70],
							[CX + 70, CY + 70],
						][k];
						return <Glyph key={el} el={el} x={pos[0]} y={pos[1]} size={92} o={p} label={false} />;
					})}
				</>
			);
		}
		case 3:
		case 5: {
			const a: El = i === 3 ? 'fire' : 'air';
			const b: El = i === 3 ? 'water' : 'fire';
			const meet = prog(f, s.start + 10, s.start + 60);
			const xa = interpolate(meet, [0, 1], [230, 400]);
			const xb = interpolate(meet, [0, 1], [850, 680]);
			const steam = i === 3 ? prog(f, wordF(3, 3), wordF(3, 3) + 40) : 0;
			const grow = i === 5 ? prog(f, s.start + 30, wordF(5, 4)) : 0;
			const talk = i === 5 ? prog(f, wordF(5, 6), wordF(5, 6) + 15) : 0;
			const jit = i === 5 && f > wordF(5, 9) ? Math.sin(f * 1.7) * 6 : 0;
			return (
				<>
					<Glyph el={a} x={xa} y={CY - 40} size={200} pulse={grow} />
					<Glyph el={b} x={xb} y={CY - 40} size={i === 5 ? 200 + grow * 60 : 200} pulse={grow} />
					{i === 3 &&
						new Array(9).fill(0).map((_, k) => {
							const ph = (lf * 0.9 + k * 23) % 120;
							const y = CY - 80 - ph * 3.2;
							const x = CX + Math.sin((ph + k * 40) / 18) * 30 + (k - 4) * 14;
							return <div key={k} style={{position: 'absolute', left: x - 18, top: y, width: 36, height: 36, borderRadius: 18, background: 'rgba(220,230,255,0.5)', filter: 'blur(10px)', opacity: steam * (1 - ph / 120)}} />;
						})}
					{i === 5 &&
						new Array(6).fill(0).map((_, k) => {
							const ph = (lf * 6 + k * 40) % 240;
							return <div key={k} style={{position: 'absolute', left: xa + 90 + ph, top: CY - 70 + k * 14, width: 70, height: 3, borderRadius: 2, background: EL.air.color, opacity: 0.6 * (1 - ph / 240) * (1 - talk)}} />;
						})}
					{i === 3 && (
						<>
							<Figure x={330} y={1010} s={0.5} o={0.8} heart={0.7} heartColor={EL.fire.color} />
							<Figure x={750} y={1010} s={0.5} o={0.8} heart={0.7} heartColor={EL.water.color} flip />
						</>
					)}
					{i === 5 && (
						<>
							<Bubble x={400} y={1080} text="…ve sonra" o={talk} dx={jit} />
							<Bubble x={680} y={1160} text="hayır, dinle!" o={talk} dx={-jit} />
						</>
					)}
				</>
			);
		}
		case 4: {
			const snap = wordF(4, 6); // "özgürlük"
			const pull = prog(f, s.start + 10, snap);
			const broke = f >= snap;
			const back = prog(f, snap, snap + 20);
			const xa = broke ? interpolate(back, [0, 1], [300, 230]) : interpolate(pull, [0, 1], [230, 300]);
			const xb = broke ? interpolate(back, [0, 1], [780, 850]) : interpolate(pull, [0, 1], [850, 780]);
			const b1 = prog(f, wordF(4, 9) - 3, wordF(4, 9) + 10);
			const b2 = prog(f, wordF(4, 14) - 3, wordF(4, 14) + 10);
			return (
				<>
					<Glyph el="earth" x={xa} y={CY - 40} size={190} />
					<Glyph el="air" x={xb} y={CY - 40} size={190} />
					<svg width={W} height={H} style={{position: 'absolute'}}>
						{!broke ? (
							<path d={`M${xa + 92} ${CY - 40} Q${CX} ${CY - 40 + 40 * (1 - pull)} ${xb - 92} ${CY - 40}`} stroke={GOLD} strokeWidth={3} fill="none" />
						) : (
							<>
								<path d={`M${xa + 92} ${CY - 40} Q${xa + 130} ${CY + 30 * back} ${xa + 150 - 30 * back} ${CY + 60 * back}`} stroke={GOLD} strokeWidth={3} fill="none" opacity={1 - back * 0.4} />
								<path d={`M${xb - 92} ${CY - 40} Q${xb - 130} ${CY + 30 * back} ${xb - 150 + 30 * back} ${CY + 60 * back}`} stroke={GOLD} strokeWidth={3} fill="none" opacity={1 - back * 0.4} />
							</>
						)}
					</svg>
					<Bubble x={330} y={1100} text="Plan yapalım." o={b1} />
					<Bubble x={760} y={1190} text="Bakarız." o={b2} />
				</>
			);
		}
		case 6: {
			const grow = prog(f, s.start + 20, s.start + 120);
			const dots = Math.floor(interpolate(f, [wordF(6, 5), s.end], [0, 14], clamp));
			return (
				<>
					<Glyph el="water" x={CX} y={420} size={150} />
					{new Array(5).fill(0).map((_, k) => {
						const ph = (lf * 4 + k * 50) % 250;
						return <div key={k} style={{position: 'absolute', left: CX - 6 + (k - 2) * 22, top: 560 + ph, width: 12, height: 20, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: EL.water.color, opacity: 0.7 * (1 - ph / 250)}} />;
					})}
					<svg width={W} height={H} style={{position: 'absolute'}}>
						<line x1={200} x2={880} y1={900} y2={900} stroke={EL.earth.color} strokeWidth={3} opacity={0.7} />
						<path d={`M${CX} 900 C ${CX} ${900 - 120 * grow}, ${CX - 10} ${900 - 160 * grow}, ${CX} ${900 - 200 * grow}`} stroke={EL.earth.color} strokeWidth={5} fill="none" />
						<ellipse cx={CX - 34 * grow} cy={900 - 150 * grow} rx={34 * grow} ry={14 * grow} fill={EL.earth.color} opacity={0.85} transform={`rotate(-25 ${CX - 34 * grow} ${900 - 150 * grow})`} />
						<ellipse cx={CX + 34 * grow} cy={900 - 175 * grow} rx={34 * grow} ry={14 * grow} fill={EL.earth.color} opacity={0.85} transform={`rotate(25 ${CX + 34 * grow} ${900 - 175 * grow})`} />
						{new Array(dots).fill(0).map((_, k) => (
							<circle key={k} cx={300 + random(`d${k}`) * 480} cy={930 + random(`e${k}`) * 160} r={6 + random(`r${k}`) * 6} fill="#C77D8E" opacity={0.55} />
						))}
					</svg>
					<Glyph el="earth" x={CX} y={1130} size={130} label={false} />
				</>
			);
		}
		case 7:
		case 8: {
			const m = prog(f, S[7].start, S[7].start + 40);
			const conflict = i === 8 ? interpolate(f, [s.start, wordF(8, 4), wordF(8, 5)], [0.3, 1, 0], clamp) : 0;
			const self = i === 8 ? prog(f, wordF(8, 5), wordF(8, 7)) : 0;
			return (
				<>
					<svg width={W} height={H} style={{position: 'absolute'}}>
						<line x1={CX} x2={CX} y1={CY - 380 * m} y2={CY + 380 * m} stroke={CREAM} strokeOpacity={0.7} strokeWidth={3} style={{filter: 'drop-shadow(0 0 14px rgba(246,240,232,0.9))'}} />
						{conflict > 0 &&
							[0, 1, 2].map((k) => (
								<path key={k} d={`M${CX - 160} ${CY - 120 + k * 60} l40 -20 l40 30 l40 -30 l40 30 l40 -30 l40 30 l40 -20`} stroke="#F2A0A0" strokeWidth={3} fill="none" opacity={conflict * (0.5 + 0.5 * Math.sin(f / 3 + k))} />
							))}
					</svg>
					<Figure x={CX - 210} y={CY - 260} s={0.95} o={m} heart={0.5 + self * 0.5} heartColor={self > 0 ? '#FFD59A' : '#F4A259'} />
					<Figure x={CX + 210} y={CY - 260} s={0.95} o={m * (1 - self * 0.5)} heart={0.5} heartColor="#F4A259" flip />
					{i === 7 && <div style={{position: 'absolute', top: CY + 300, width: '100%', textAlign: 'center', fontFamily: FONT.sans, fontSize: 26, letterSpacing: '0.3em', color: MUTED, opacity: m}}>AYNI ELEMENT · AYNA</div>}
				</>
			);
		}
		case 9: {
			const merge = prog(f, wordF(9, 5), s.end - 10);
			const near = prog(f, s.start, s.end);
			return (
				<>
					<Figure x={340 + 80 * near} y={720} s={0.8} heart={0.5} heartColor={EL.fire.color} />
					<Figure x={740 - 80 * near} y={760} s={0.66} heart={0.5} heartColor={EL.water.color} flip />
					<svg width={W} height={H} style={{position: 'absolute'}}>
						{[0, 1].map((k) => {
							const x = k === 0 ? interpolate(merge, [0, 1], [330, CX]) : interpolate(merge, [0, 1], [750, CX]);
							return (
								<g key={k} transform={`translate(${x} 470)`} opacity={k === 1 ? 1 - merge * 0.3 : 1}>
									<rect x={-120} y={-60} width={240} height={120} rx={40} fill="rgba(30,26,88,0.7)" stroke={k ? EL.water.color : EL.fire.color} strokeWidth={2} />
									{[0, 1, 2].map((j) =>
										k === 0 ? (
											<polygon key={j} points={`${-60 + j * 60},-16 ${-44 + j * 60},14 ${-76 + j * 60},14`} fill="none" stroke={EL.fire.color} strokeWidth={3} />
										) : (
											<circle key={j} cx={-60 + j * 60} cy={0} r={16} fill="none" stroke={EL.water.color} strokeWidth={3} />
										)
									)}
								</g>
							);
						})}
					</svg>
				</>
			);
		}
		case 10: {
			const card = prog(f, s.start, s.start + 25);
			const typed = 'Annem Yengeç, ben Koç'.slice(0, Math.floor(interpolate(f, [s.start + 25, s.start + 110], [0, 21], clamp)));
			const heart = spring({frame: f - (s.start + 130), fps: 30, config: {damping: 12}});
			return (
				<div style={{position: 'absolute', left: 110, right: 110, top: CY - 200, opacity: card, transform: `translateY(${(1 - card) * 40}px)`}}>
					<div style={{padding: '40px 44px', borderRadius: 34, background: 'rgba(30,26,88,0.78)', border: '1.5px solid rgba(232,203,152,0.4)', display: 'flex', alignItems: 'center', gap: 28}}>
						<div style={{width: 84, height: 84, borderRadius: 42, background: 'linear-gradient(135deg,#7458B0,#466A94)', flexShrink: 0}} />
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.sans, fontSize: 26, color: MUTED, letterSpacing: '0.04em'}}>sen</div>
							<div style={{marginTop: 8, fontFamily: FONT.sans, fontSize: 42, color: CREAM, minHeight: 50}}>
								{typed}
								<span style={{opacity: Math.floor(f / 15) % 2 ? 1 : 0}}>|</span>
							</div>
						</div>
						<svg width={56} height={56} viewBox="0 0 24 24" style={{transform: `scale(${0.6 + heart * 0.5})`}}>
							<path d="M12 21s-7-4.4-9.5-9C.8 8.7 2.7 4.5 6.6 4.5c2 0 3.4 1.1 4.4 2.5 1-1.4 2.4-2.5 4.4-2.5 3.9 0 5.8 4.2 4.1 7.5C19 16.6 12 21 12 21z" fill={heart > 0.1 ? '#F27A8A' : 'none'} stroke="#F27A8A" strokeWidth={1.6} />
						</svg>
					</div>
					<div style={{marginTop: 40, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, letterSpacing: '0.3em', color: GOLD}}>YORUMLARA YAZ</div>
				</div>
			);
		}
		case 11: {
			const join = prog(f, s.start + 10, s.start + 80);
			const logo = prog(f, wordF(11, 8) - 10, wordF(11, 8) + 20);
			const wheel = (cx: number, color: string, seed: string, rot: number) => (
				<g transform={`rotate(${rot} ${cx} ${CY - 60})`}>
					<circle cx={cx} cy={CY - 60} r={230} fill="none" stroke={color} strokeWidth={2.5} opacity={0.8} />
					<circle cx={cx} cy={CY - 60} r={170} fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
					{new Array(12).fill(0).map((_, k) => {
						const a = (k * 30 * Math.PI) / 180;
						return <line key={k} x1={cx + Math.cos(a) * 170} y1={CY - 60 + Math.sin(a) * 170} x2={cx + Math.cos(a) * 230} y2={CY - 60 + Math.sin(a) * 230} stroke={color} strokeWidth={1.5} opacity={0.5} />;
					})}
					{new Array(7).fill(0).map((_, k) => {
						const a = random(`${seed}${k}`) * Math.PI * 2;
						return <circle key={k} cx={cx + Math.cos(a) * 200} cy={CY - 60 + Math.sin(a) * 200} r={9} fill={color} />;
					})}
				</g>
			);
			return (
				<>
					<svg width={W} height={H} style={{position: 'absolute', opacity: 1 - logo * 0.75}}>
						{wheel(interpolate(join, [0, 1], [300, CX - 40]), EL.fire.color, 'a', lf * 0.2)}
						{wheel(interpolate(join, [0, 1], [780, CX + 40]), EL.water.color, 'b', -lf * 0.2)}
					</svg>
					<div style={{position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: logo, transform: `scale(${0.92 + 0.08 * logo})`}}>
						<Logo width={560} />
					</div>
					<div style={{position: 'absolute', top: 1080, width: '100%', textAlign: 'center', opacity: logo}}>
						<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 40, letterSpacing: '0.3em', color: GOLD}}>SİNASTRİ</div>
						<div style={{marginTop: 18, fontFamily: FONT.sans, fontSize: 26, letterSpacing: '0.22em', color: MUTED}}>WWW.ASTROTHICA.COM</div>
					</div>
				</>
			);
		}
	}
	return null;
};

// ---------------- Altyazı ----------------
const Subtitle: React.FC<{f: number}> = ({f}) => {
	for (const s of S) {
		for (const c of s.chunks) {
			if (f >= c.start - 2 && f < c.end) {
				const o = interpolate(f, [c.start - 2, c.start + 4, c.end - 4, c.end], [0, 1, 1, 0], clamp);
				return (
					<div style={{position: 'absolute', top: 1300, left: 90, right: 90, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 10}px)`}}>
						<span
							style={{
								fontFamily: FONT.serif,
								fontWeight: 500,
								fontSize: 64,
								lineHeight: 1.18,
								color: CREAM,
								textShadow: '0 0 24px rgba(4,6,42,0.95), 0 2px 8px rgba(4,6,42,0.9)',
							}}
						>
							{c.text}
						</span>
					</div>
				);
			}
		}
	}
	return null;
};

export const ElementReel: React.FC = () => {
	const f = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const titleO = interpolate(f, [0, 8, S[0].end + 10, S[1].start + 10], [1, 1, 1, 0], clamp);
	return (
		<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
			<Background glowY={CY - 40} seed="reel1" height={H} />
			{S.map((s, k) => {
				const next = S[k + 1];
				const a = k === 0 ? 0 : s.start - 10;
				const b = next ? next.start + 6 : durationInFrames;
				if (f < a - 1 || f > b + 1) return null;
				const o = interpolate(f, [a, a + 12, b - 12, b], [k === 0 ? 1 : 0, 1, 1, next ? 0 : 1], clamp);
				return (
					<AbsoluteFill key={k} style={{opacity: o}}>
						<Scene i={k} f={f} />
					</AbsoluteFill>
				);
			})}
			<div style={{position: 'absolute', top: 250, left: 70, right: 70, textAlign: 'center', opacity: titleO}}>
				<GoldText size={72} style={{lineHeight: 1.12}}>
					ANNENLE AYNI
					<br />
					ELEMENT MİSİNİZ?
				</GoldText>
			</div>
			<Subtitle f={f} />
			<div style={{position: 'absolute', top: 1470, width: '100%', textAlign: 'center', fontFamily: FONT.sans, fontSize: 22, letterSpacing: '0.16em', color: 'rgba(246,240,232,0.4)'}}>@astrothica</div>
			<Audio src={staticFile('audio/reel1.wav')} />
		</AbsoluteFill>
	);
};

export const REEL1_DURATION = TL.durationInFrames as number;
