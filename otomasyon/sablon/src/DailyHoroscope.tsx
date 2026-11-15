import React from 'react';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {FONT, loadFonts} from './fonts';
import {SIGNS} from './signs';

loadFonts();

export type HoroscopeProps = {
	sign: keyof typeof SIGNS;
	dateLabel: string;
	hook: string;
	items: Array<{label: string; text: string}>;
	luckyColor: {name: string; hex: string};
	luckyNumber: number;
	cta: string;
};

const GOLD = '#E9C97E';
const GOLD_DEEP = '#B98A3E';
const CREAM = '#F4EDE1';
const MUTED = 'rgba(244,237,225,0.62)';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const fadeUp = (frame: number, start: number, dur = 18, dist = 40) => {
	const p = interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: ease});
	return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};

const fadeOut = (frame: number, start: number, dur = 14) =>
	interpolate(frame, [start, start + dur], [1, 0], clamp);

// ---------- Arka plan ----------
const Starfield: React.FC = () => {
	const frame = useCurrentFrame();
	const stars = new Array(160).fill(0).map((_, i) => ({
		x: random(`x${i}`) * 1080,
		y: random(`y${i}`) * 1920,
		r: 0.6 + random(`r${i}`) * 2.2,
		phase: random(`p${i}`) * Math.PI * 2,
		speed: 0.04 + random(`s${i}`) * 0.08,
	}));
	return (
		<svg width={1080} height={1920} style={{position: 'absolute'}}>
			{stars.map((s, i) => {
				const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * s.speed + s.phase));
				const drift = (frame * 0.08 * s.r) % 1920;
				return (
					<circle
						key={i}
						cx={s.x}
						cy={(s.y - drift + 1920) % 1920}
						r={s.r}
						fill={CREAM}
						opacity={tw * 0.7}
					/>
				);
			})}
		</svg>
	);
};

const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const shift = Math.sin(frame / 90) * 60;
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at ${540 + shift}px 700px, #3B2363 0%, #1C1338 38%, #0B0A1C 72%, #06060F 100%)`,
			}}
		>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 900px 500px at 50% 1750px, rgba(185,138,62,0.18), transparent 70%)',
				}}
			/>
			<Starfield />
		</AbsoluteFill>
	);
};

// ---------- Takımyıldız ----------
const Constellation: React.FC<{sign: keyof typeof SIGNS}> = ({sign}) => {
	const frame = useCurrentFrame();
	const {stars, lines} = SIGNS[sign];
	const drawStart = 6;
	const perLine = 4;
	const opacity = interpolate(
		frame,
		[0, 10, 100, 125, 345, 370],
		[0, 0.7, 0.7, 0.2, 0.2, 0.3],
		clamp
	);
	const rot = interpolate(frame, [0, 450], [-4, 4]);
	const scale = interpolate(frame, [0, 450], [1, 1.08]);
	return (
		<svg
			viewBox="0 0 1000 1000"
			width={1000}
			height={1000}
			style={{
				position: 'absolute',
				left: 40,
				top: 430,
				opacity,
				transform: `rotate(${rot}deg) scale(${scale})`,
				overflow: 'visible',
			}}
		>
			<defs>
				<filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
					<feGaussianBlur stdDeviation="7" result="b" />
					<feMerge>
						<feMergeNode in="b" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			{lines.map(([a, b], i) => {
				const [x1, y1] = stars[a];
				const [x2, y2] = stars[b];
				const len = Math.hypot(x2 - x1, y2 - y1);
				const p = interpolate(frame, [drawStart + i * perLine, drawStart + i * perLine + 10], [0, 1], {
					...clamp,
					easing: ease,
				});
				return (
					<line
						key={i}
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						stroke={GOLD}
						strokeOpacity={0.55}
						strokeWidth={2.2}
						strokeDasharray={len}
						strokeDashoffset={len * (1 - p)}
						strokeLinecap="round"
					/>
				);
			})}
			{stars.map(([x, y, b], i) => {
				const appear = interpolate(frame, [drawStart + i * 3.5, drawStart + i * 3.5 + 8], [0, 1], clamp);
				const pulse = 0.85 + 0.15 * Math.sin(frame / 8 + i);
				return (
					<circle
						key={i}
						cx={x}
						cy={y}
						r={(3 + b * 3) * appear * pulse}
						fill={b === 3 ? '#FFE3A8' : CREAM}
						filter="url(#glow)"
					/>
				);
			})}
		</svg>
	);
};

// ---------- Ana kompozisyon ----------
export const DailyHoroscope: React.FC<HoroscopeProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const info = SIGNS[props.sign];

	// İsim bloğu: ortadan yukarı taşınır (kare 98'den itibaren)
	const move = spring({frame: frame - 98, fps, config: {damping: 200}, durationInFrames: 26});
	const nameTop = interpolate(move, [0, 1], [700, 330]);
	const nameScale = interpolate(move, [0, 1], [1, 0.6]);
	const nameIn = fadeUp(frame, 8, 22, 30);

	const hookOpacity = interpolate(frame, [22, 38], [0, 1], clamp) * fadeOut(frame, 92, 12);
	const hookY = interpolate(frame, [22, 40], [30, 0], {...clamp, easing: ease});

	const cardsOut = fadeOut(frame, 340, 16);
	const cardStarts = [122, 192, 262];

	return (
		<AbsoluteFill style={{fontFamily: FONT.sans, color: CREAM}}>
			<Background />
			<Constellation sign={props.sign} />

			{/* Üst etiket */}
			<div
				style={{
					position: 'absolute',
					top: 210,
					width: '100%',
					textAlign: 'center',
					fontSize: 30,
					letterSpacing: '0.32em',
					color: GOLD,
					...fadeUp(frame, 0, 16, 16),
				}}
			>
				GÜNÜN BURCU · {props.dateLabel.toLocaleUpperCase('tr-TR')}
			</div>

			{/* Burç adı */}
			<div
				style={{
					position: 'absolute',
					top: nameTop,
					width: '100%',
					textAlign: 'center',
					transform: `scale(${nameScale}) ${nameIn.transform}`,
					transformOrigin: 'center top',
					opacity: nameIn.opacity,
				}}
			>
				<div
					style={{
						fontFamily: FONT.display,
						fontWeight: 600,
						fontSize: 190,
						letterSpacing: '0.1em',
						lineHeight: 1,
						background: `linear-gradient(180deg, #FFF1CC 0%, ${GOLD} 45%, ${GOLD_DEEP} 100%)`,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
						filter: 'drop-shadow(0 0 30px rgba(233,201,126,0.35))',
					}}
				>
					{info.name.toLocaleUpperCase('tr-TR')}
				</div>
				<div style={{marginTop: 26, fontSize: 38, color: MUTED, letterSpacing: '0.06em'}}>
					{info.dates} · {info.element} Elementi
				</div>
			</div>

			{/* Kanca */}
			<div
				style={{
					position: 'absolute',
					top: 1060,
					left: 100,
					right: 100,
					textAlign: 'center',
					fontFamily: FONT.serif,
					fontStyle: 'italic',
					fontWeight: 500,
					fontSize: 78,
					lineHeight: 1.18,
					textShadow: '0 0 24px rgba(6,6,15,0.95), 0 0 8px rgba(6,6,15,0.9)',
					opacity: hookOpacity,
					transform: `translateY(${hookY}px)`,
				}}
			>
				“{props.hook}”
			</div>

			{/* Kartlar */}
			<div style={{position: 'absolute', top: 580, left: 90, right: 90, opacity: cardsOut}}>
				{props.items.map((item, i) => {
					const s = fadeUp(frame, cardStarts[i], 20, 50);
					const lineW = interpolate(frame, [cardStarts[i] + 4, cardStarts[i] + 24], [0, 120], {
						...clamp,
						easing: ease,
					});
					return (
						<div
							key={i}
							style={{
								...s,
								marginBottom: 34,
								padding: '30px 44px 34px',
								borderRadius: 28,
								background: 'linear-gradient(180deg, rgba(36,26,70,0.72), rgba(18,14,40,0.72))',
								border: '1.5px solid rgba(233,201,126,0.28)',
								boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
							}}
						>
							<div
								style={{
									fontFamily: FONT.display,
									fontWeight: 600,
									fontSize: 40,
									letterSpacing: '0.2em',
									color: GOLD,
								}}
							>
								{item.label.toLocaleUpperCase('tr-TR')}
							</div>
							<div style={{height: 2, width: lineW, background: GOLD, opacity: 0.6, margin: '16px 0 18px'}} />
							<div
								style={{
									fontFamily: FONT.serif,
									fontStyle: 'italic',
									fontWeight: 500,
									fontSize: 54,
									lineHeight: 1.18,
								}}
							>
								{item.text}
							</div>
						</div>
					);
				})}
			</div>

			{/* Kapanış: şanslı renk/sayı + CTA */}
			<div style={{position: 'absolute', top: 760, left: 90, right: 90, textAlign: 'center'}}>
				<div style={{display: 'flex', justifyContent: 'center', gap: 40, ...fadeUp(frame, 356, 18, 40)}}>
					<LuckyChip label="Şanslı renk">
						<span
							style={{
								display: 'inline-block',
								width: 40,
								height: 40,
								borderRadius: 20,
								background: props.luckyColor.hex,
								border: `2px solid ${GOLD}`,
								marginRight: 18,
								verticalAlign: 'middle',
							}}
						/>
						{props.luckyColor.name}
					</LuckyChip>
					<LuckyChip label="Şanslı sayı">{props.luckyNumber}</LuckyChip>
				</div>
				<div
					style={{
						marginTop: 120,
						fontFamily: FONT.serif,
						fontStyle: 'italic',
						fontSize: 64,
						lineHeight: 1.2,
						textShadow: '0 0 24px rgba(6,6,15,0.95)',
						...fadeUp(frame, 376, 18, 30),
					}}
				>
					{props.cta}
				</div>
				<div
					style={{
						marginTop: 40,
						fontFamily: FONT.display,
						fontWeight: 600,
						fontSize: 64,
						letterSpacing: '0.24em',
						color: GOLD,
						...fadeUp(frame, 390, 18, 20),
					}}
				>
					ASTROTHICA
				</div>
			</div>
		</AbsoluteFill>
	);
};

const LuckyChip: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
	<div
		style={{
			flex: 1,
			padding: '30px 20px 34px',
			borderRadius: 26,
			border: '1.5px solid rgba(233,201,126,0.35)',
			background: 'rgba(28,20,56,0.7)',
		}}
	>
		<div style={{fontSize: 26, letterSpacing: '0.24em', color: GOLD}}>
			{label.toLocaleUpperCase('tr-TR')}
		</div>
		<div style={{marginTop: 18, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 60}}>{children}</div>
	</div>
);
