import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {FONT, loadFonts} from '../fonts';

loadFonts();

// Marka paleti — kaynak: logo görseli (MARKA-KURALLARI.md)
export const W = 1080;
export const H = 1350;
export const NIGHT = '#04062A'; // gece laciverti, zemin
export const INDIGO = '#15153C';
export const VIOLET = '#4D3598'; // bulutsu moru
export const LAVENDER = '#7458B0';
export const STEEL = '#466A94'; // mavi kenar ışığı
export const GOLD = '#E8CB98'; // şampanya altın
export const GOLD_LIGHT = '#FBE7C6';
export const GOLD_DEEP = '#B48A52';
export const CREAM = '#F6F0E8';
export const MUTED = 'rgba(246,240,232,0.66)';
export const FAINT = 'rgba(246,240,232,0.40)';
export const CARD_BG = 'linear-gradient(180deg, rgba(34,28,92,0.74), rgba(14,14,52,0.78))';
export const CARD_BORDER = '1.5px solid rgba(232,203,152,0.30)';

export const ZODIAC: Array<{key: string; name: string; dates: string; element: string}> = [
	{key: 'koc', name: 'Koç', dates: '21 Mart – 19 Nisan', element: 'Ateş'},
	{key: 'boga', name: 'Boğa', dates: '20 Nisan – 20 Mayıs', element: 'Toprak'},
	{key: 'ikizler', name: 'İkizler', dates: '21 Mayıs – 20 Haziran', element: 'Hava'},
	{key: 'yengec', name: 'Yengeç', dates: '21 Haziran – 22 Temmuz', element: 'Su'},
	{key: 'aslan', name: 'Aslan', dates: '23 Temmuz – 22 Ağustos', element: 'Ateş'},
	{key: 'basak', name: 'Başak', dates: '23 Ağustos – 22 Eylül', element: 'Toprak'},
	{key: 'terazi', name: 'Terazi', dates: '23 Eylül – 22 Ekim', element: 'Hava'},
	{key: 'akrep', name: 'Akrep', dates: '23 Ekim – 21 Kasım', element: 'Su'},
	{key: 'yay', name: 'Yay', dates: '22 Kasım – 21 Aralık', element: 'Ateş'},
	{key: 'oglak', name: 'Oğlak', dates: '22 Aralık – 19 Ocak', element: 'Toprak'},
	{key: 'kova', name: 'Kova', dates: '20 Ocak – 18 Şubat', element: 'Hava'},
	{key: 'balik', name: 'Balık', dates: '19 Şubat – 20 Mart', element: 'Su'},
];

export const upper = (s: string) => s.toLocaleUpperCase('tr-TR');

// Zemin: gece laciverti + mor bulutsu + mavi kenar ışığı + yıldızlar
export const Background: React.FC<{glowX?: number; glowY?: number; seed?: string; height?: number}> = ({
	glowX = 540,
	glowY = 480,
	seed = 's',
	height = H,
}) => {
	const n = Math.round(150 * (height / H));
	const stars = new Array(n).fill(0).map((_, i) => ({
		x: random(`${seed}x${i}`) * W,
		y: random(`${seed}y${i}`) * height,
		r: 0.6 + random(`${seed}r${i}`) * 2,
		o: 0.25 + random(`${seed}o${i}`) * 0.55,
		big: random(`${seed}b${i}`) > 0.94,
	}));
	const side = random(`${seed}side`) > 0.5 ? 1 : -1;
	const tealX = glowX + side * 260;
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, #060930 0%, ${NIGHT} 45%, #02031F 100%)`}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 620px 540px at ${glowX}px ${glowY}px, rgba(77,53,152,0.62) 0%, rgba(43,34,115,0.38) 42%, transparent 75%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 420px 360px at ${tealX}px ${glowY + 120}px, rgba(70,106,148,0.30) 0%, transparent 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 520px 260px at ${W / 2 - side * 330}px ${glowY - 260}px, rgba(116,88,176,0.22) 0%, transparent 72%)`,
				}}
			/>
			<svg width={W} height={height} style={{position: 'absolute', opacity: 0.32, mixBlendMode: 'screen'}}>
				<filter id={`neb${seed}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.0032 0.0055" numOctaves={4} seed={Math.floor(random(seed) * 1000)} />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.42  0 0 0 0 0.30  0 0 0 0 0.78  0 0 0 1.6 -0.72"
					/>
				</filter>
				<rect width={W} height={height} filter={`url(#neb${seed})`} />
			</svg>
			<svg width={W} height={height} style={{position: 'absolute'}}>
				<defs>
					<filter id={`sg${seed}`} x="-300%" y="-300%" width="700%" height="700%">
						<feGaussianBlur stdDeviation="3" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				{stars.map((s, i) => (
					<circle
						key={i}
						cx={s.x}
						cy={s.y}
						r={s.big ? s.r + 0.8 : s.r}
						fill={s.big ? GOLD_LIGHT : CREAM}
						opacity={s.big ? 0.95 : s.o}
						filter={s.big ? `url(#sg${seed})` : undefined}
					/>
				))}
			</svg>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 820px 360px at 50% ${height}px, rgba(180,138,82,0.14), transparent 70%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

// Logo dosyaları: public/logo/
// logo-feather.png: amblem + yazı, kenarları zemine yumuşak geçişli (kapanış)
// wordmark.png: sadece ASTROTHICA yazısı, şeffaf (kapak üstü)
// emblem-feather.png: amblem, kenarları zemine yumuşak geçişli; wordmark.png + tagline.png: şeffaf yazılar
// Oranlar logo görselindeki ile aynı (amblem genişliği = 1440 birim).
export const Logo: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => {
	const k = width / 1440;
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>
			<Img src={staticFile('logo/emblem-feather.png')} style={{width, display: 'block'}} />
			<Img src={staticFile('logo/wordmark.png')} style={{width: 1589 * k, display: 'block', marginTop: 60 * k}} />
			<Img src={staticFile('logo/tagline.png')} style={{width: 1295 * k, display: 'block', marginTop: 57 * k}} />
		</div>
	);
};

export const Wordmark: React.FC<{width?: number; style?: React.CSSProperties}> = ({width = 380, style}) => (
	<div style={{display: 'flex', justifyContent: 'center', ...style}}>
		<Img src={staticFile('logo/wordmark.png')} style={{width, display: 'block'}} />
	</div>
);

export const Sparkle: React.FC<{size: number; color?: string}> = ({size, color = GOLD}) => (
	<svg width={size} height={size} viewBox="0 0 20 20" style={{display: 'block'}}>
		<path d="M10 0 L11.6 8.4 L20 10 L11.6 11.6 L10 20 L8.4 11.6 L0 10 L8.4 8.4 Z" fill={color} />
	</svg>
);

export const GoldText: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	size,
	children,
	style,
}) => (
	<div
		style={{
			fontFamily: FONT.display,
			fontWeight: 600,
			fontSize: size,
			letterSpacing: '0.08em',
			lineHeight: 1.05,
			background: `linear-gradient(180deg, #FFF4DE 0%, ${GOLD} 48%, ${GOLD_DEEP} 100%)`,
			WebkitBackgroundClip: 'text',
			backgroundClip: 'text',
			color: 'transparent',
			filter: 'drop-shadow(0 0 26px rgba(232,203,152,0.35))',
			...style,
		}}
	>
		{children}
	</div>
);

export const SwipeHint: React.FC<{style?: React.CSSProperties; label?: string}> = ({style, label = 'Kaydır'}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 22,
			fontFamily: FONT.sans,
			fontSize: 28,
			lineHeight: 1,
			letterSpacing: '0.3em',
			color: GOLD,
			...style,
		}}
	>
		<span>{upper(label)}</span>
		<svg width={110} height={24} viewBox="0 0 110 24" style={{display: 'block'}}>
			<line x1={0} y1={12} x2={104} y2={12} stroke={GOLD} strokeWidth={2.2} />
			<path d="M92 2 L106 12 L92 22" fill="none" stroke={GOLD} strokeWidth={2.2} />
		</svg>
	</div>
);

export const Hairline: React.FC<{style?: React.CSSProperties}> = ({style}) => (
	<div style={{height: 1.5, background: 'rgba(232,203,152,0.35)', ...style}} />
);

export const SITE = 'www.astrothica.com';

export const SiteFooter: React.FC<{bottom?: number}> = ({bottom = 38}) => (
	<div
		style={{
			position: 'absolute',
			bottom,
			left: 0,
			right: 0,
			textAlign: 'center',
			fontFamily: FONT.sans,
			fontSize: 21,
			lineHeight: 1,
			letterSpacing: '0.22em',
			color: 'rgba(246,240,232,0.45)',
		}}
	>
		{SITE.toUpperCase()}
	</div>
);

export {FONT};
