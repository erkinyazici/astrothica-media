import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {SIGNS} from '../signs';
import {
	Background,
	CREAM,
	FAINT,
	FONT,
	GOLD,
	GoldText,
	H,
	Hairline,
	Logo,
	SiteFooter,
	MUTED,
	Sparkle,
	SwipeHint,
	upper,
	W,
	Wordmark,
	ZODIAC,
	CARD_BG,
	CARD_BORDER,
} from './shared';

export type CoverProps = {
	variant: 'A' | 'B' | 'C';
	dateLabel: string; // "6 Kasım 2026 · Cuma"
	group: 0 | 1; // 0: Koç–Başak, 1: Terazi–Balık
	hook: string;
};

export type SignSlideProps = {
	variant: 'A' | 'B';
	sign: string;
	dateLabel: string;
	items: Array<{label: string; text: string}>;
	luckyColor: {name: string; hex: string};
	luckyNumber: number;
};

export type ClosingProps = {variant: 'A' | 'B'};

const groupSigns = (g: 0 | 1) => ZODIAC.slice(g * 6, g * 6 + 6);

// ---------------- Takımyıldız (sabit) ----------------
export const StaticConstellation: React.FC<{sign: string; size: number; opacity?: number; style?: React.CSSProperties}> = ({
	sign,
	size,
	opacity = 0.6,
	style,
}) => {
	const info = SIGNS[sign as keyof typeof SIGNS];
	if (!info) return null;
	return (
		<svg viewBox="0 0 1000 1000" width={size} height={size} style={{position: 'absolute', overflow: 'visible', opacity, ...style}}>
			<defs>
				<filter id="g" x="-200%" y="-200%" width="500%" height="500%">
					<feGaussianBlur stdDeviation="7" result="b" />
					<feMerge>
						<feMergeNode in="b" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			{info.lines.map(([a, b], i) => (
				<line
					key={i}
					x1={info.stars[a][0]}
					y1={info.stars[a][1]}
					x2={info.stars[b][0]}
					y2={info.stars[b][1]}
					stroke={GOLD}
					strokeOpacity={0.55}
					strokeWidth={2.4}
					strokeLinecap="round"
				/>
			))}
			{info.stars.map(([x, y, b], i) => (
				<circle key={i} cx={x} cy={y} r={3 + b * 3} fill={b === 3 ? '#FFE3A8' : CREAM} filter="url(#g)" />
			))}
		</svg>
	);
};

// ---------------- KAPAK ----------------
export const Cover: React.FC<CoverProps> = (p) => {
	if (p.variant === 'B') return <CoverB {...p} />;
	if (p.variant === 'C') return <CoverC {...p} />;
	return <CoverA {...p} />;
};

// A: Klasik, ortalı başlık + burç listesi
const CoverA: React.FC<CoverProps> = ({dateLabel, group}) => {
	const signs = groupSigns(group);
	return (
		<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
			<Background glowY={560} seed={`ca${group}`} />
			<div style={{position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Img src={staticFile('logo/emblem-feather.png')} style={{width: 230, display: 'block'}} />
				<Img src={staticFile('logo/wordmark.png')} style={{width: 360, display: 'block', marginTop: 6}} />
			</div>
			<div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center'}}>
				<div style={{fontSize: 30, letterSpacing: '0.34em', color: MUTED}}>{upper(dateLabel)}</div>
				<GoldText size={124} style={{marginTop: 50}}>GÜNLÜK</GoldText>
				<GoldText size={124} style={{marginTop: 6}}>BURÇ YORUMU</GoldText>
				<div
					style={{
						marginTop: 46,
						fontFamily: FONT.serif,
						fontStyle: 'italic',
						fontSize: 58,
						color: CREAM,
					}}
				>
					{signs[0].name} → {signs[5].name}
				</div>
			</div>
			<div style={{position: 'absolute', top: 1040, left: 120, right: 120}}>
				<Hairline />
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '26px 0',
						fontSize: 26,
						letterSpacing: '0.2em',
						color: MUTED,
					}}
				>
					{signs.map((s) => (
						<span key={s.key}>{upper(s.name)}</span>
					))}
				</div>
				<Hairline />
			</div>
			<SwipeHint style={{position: 'absolute', bottom: 92, right: 110}} />
			<SiteFooter />
		</AbsoluteFill>
	);
};

// B: Kanca öne çıkar, burçlar 2x3 ızgarada tarihleriyle
const CoverB: React.FC<CoverProps> = ({dateLabel, group, hook}) => {
	const signs = groupSigns(group);
	return (
		<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
			<Background glowX={group === 0 ? 260 : 820} glowY={360} seed={`cb${group}`} />
			<div
				style={{
					position: 'absolute',
					top: 100,
					left: 100,
					right: 100,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Wordmark width={300} />
				<div style={{fontSize: 24, letterSpacing: '0.24em', color: MUTED}}>{upper(dateLabel)}</div>
			</div>
			<div style={{position: 'absolute', top: 290, left: 100, right: 100}}>
				<div style={{fontSize: 28, letterSpacing: '0.34em', color: GOLD}}>
					GÜNLÜK BURÇ · {upper(signs[0].name)} – {upper(signs[5].name)}
				</div>
				<div
					style={{
						marginTop: 40,
						fontFamily: FONT.serif,
						fontStyle: 'italic',
						fontWeight: 500,
						fontSize: 96,
						lineHeight: 1.12,
					}}
				>
					“{hook}”
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 820,
					left: 100,
					right: 100,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr 1fr',
					rowGap: 44,
					columnGap: 30,
				}}
			>
				{signs.map((s) => (
					<div key={s.key}>
						<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 38, letterSpacing: '0.12em', color: GOLD}}>
							{upper(s.name)}
						</div>
						<div style={{marginTop: 8, fontSize: 21, color: FAINT, letterSpacing: '0.04em'}}>{s.dates}</div>
					</div>
				))}
			</div>
			<SwipeHint style={{position: 'absolute', bottom: 92, right: 100}} label="Burcunu bul" />
			<SiteFooter />
		</AbsoluteFill>
	);
};

// C: Burç çemberi, bu postun 6 burcu altınla vurgulanır
const CoverC: React.FC<CoverProps> = ({dateLabel, group}) => {
	const cx = 540;
	const cy = 600;
	const R = 380;
	return (
		<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
			<Background glowY={cy} seed={`cc${group}`} />
			<svg width={W} height={H} style={{position: 'absolute'}}>
				<circle cx={cx} cy={cy} r={R + 70} fill="none" stroke="rgba(233,201,126,0.22)" strokeWidth={1.5} />
				<circle cx={cx} cy={cy} r={R - 70} fill="none" stroke="rgba(233,201,126,0.22)" strokeWidth={1.5} />
				{ZODIAC.map((_, i) => {
					const a = ((i * 30 - 90 - 15) * Math.PI) / 180;
					return (
						<line
							key={i}
							x1={cx + Math.cos(a) * (R - 70)}
							y1={cy + Math.sin(a) * (R - 70)}
							x2={cx + Math.cos(a) * (R + 70)}
							y2={cy + Math.sin(a) * (R + 70)}
							stroke="rgba(233,201,126,0.22)"
							strokeWidth={1.5}
						/>
					);
				})}
			</svg>
			{ZODIAC.map((s, i) => {
				const a = ((i * 30 - 90) * Math.PI) / 180;
				const on = Math.floor(i / 6) === group;
				return (
					<div
						key={s.key}
						style={{
							position: 'absolute',
							left: cx + Math.cos(a) * R - 100,
							top: cy + Math.sin(a) * R - 20,
							width: 200,
							textAlign: 'center',
							fontFamily: FONT.display,
							fontWeight: 600,
							fontSize: 30,
							letterSpacing: '0.1em',
							color: on ? GOLD : 'rgba(244,237,225,0.28)',
							textShadow: on ? '0 0 18px rgba(233,201,126,0.45)' : 'none',
						}}
					>
						{upper(s.name)}
					</div>
				);
			})}
			<div style={{position: 'absolute', top: cy - 120, width: '100%', textAlign: 'center'}}>
				<Sparkle size={34} />
				<div style={{marginTop: 22, fontSize: 24, letterSpacing: '0.3em', color: MUTED}}>GÜNLÜK BURÇ</div>
				<div style={{marginTop: 16, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 64}}>
					{dateLabel.split(' · ')[0]}
				</div>
				<div style={{marginTop: 4, fontSize: 24, letterSpacing: '0.3em', color: MUTED}}>
					{upper(dateLabel.split(' · ')[1] ?? '')}
				</div>
			</div>
			<Wordmark width={340} style={{position: 'absolute', bottom: 150, left: 0, right: 0}} />
			<SwipeHint style={{position: 'absolute', bottom: 96, left: 0, right: 0, justifyContent: 'center', fontSize: 22}} />
			<SiteFooter />
		</AbsoluteFill>
	);
};

// ---------------- BURÇ GÖRSELİ ----------------
export const SignSlide: React.FC<SignSlideProps> = (p) => (p.variant === 'B' ? <SignB {...p} /> : <SignA {...p} />);

const signMeta = (key: string) => ZODIAC.find((z) => z.key === key)!;

// A: Video şablonunun sabit hali, kartlı
const SignA: React.FC<SignSlideProps> = ({sign, dateLabel, items, luckyColor, luckyNumber}) => {
	const m = signMeta(sign);
	return (
		<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
			<Background glowY={260} seed={`sa${sign}`} />
			<StaticConstellation sign={sign} size={620} opacity={0.32} style={{left: 460, top: -40}} />
			<div style={{position: 'absolute', top: 96, left: 90, fontSize: 24, letterSpacing: '0.3em', color: GOLD}}>
				{upper(dateLabel)}
			</div>
			<GoldText size={120} style={{position: 'absolute', top: 150, left: 84}}>
				{upper(m.name)}
			</GoldText>
			<div style={{position: 'absolute', top: 290, left: 90, fontSize: 28, color: MUTED, letterSpacing: '0.04em'}}>
				{m.dates} · {m.element}
			</div>
			<div style={{position: 'absolute', top: 350, bottom: 90, left: 70, right: 70, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
				{items.map((it) => (
					<div
						key={it.label}
						style={{
							marginBottom: 24,
							padding: '24px 40px 28px',
							borderRadius: 26,
							background: CARD_BG,
							border: CARD_BORDER,
						}}
					>
						<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 30, letterSpacing: '0.2em', color: GOLD}}>
							{upper(it.label)}
						</div>
						<div style={{marginTop: 10, fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 46, lineHeight: 1.16}}>
							{it.text}
						</div>
					</div>
				))}
				<div style={{display: 'flex', gap: 24, marginTop: 6}}>
					<Chip label="Şanslı renk" grow={1.55}>
						<span style={{width: 34, height: 34, borderRadius: 17, background: luckyColor.hex, border: `2px solid ${GOLD}`, flexShrink: 0}} />
						<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 46, lineHeight: 1, paddingBottom: 6}}>{luckyColor.name}</span>
					</Chip>
					<Chip label="Şanslı sayı">
						<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 52, lineHeight: 1, paddingBottom: 6, fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum" 1'}}>{luckyNumber}</span>
					</Chip>
				</div>
			</div>
			<SiteFooter />
		</AbsoluteFill>
	);
};

const Chip: React.FC<{label: string; children: React.ReactNode; grow?: number}> = ({label, children, grow = 1}) => (
	<div
		style={{
			flex: grow,
			height: 96,
			boxSizing: 'border-box',
			whiteSpace: 'nowrap',
			padding: '0 32px',
			borderRadius: 22,
			border: CARD_BORDER,
			background: CARD_BG,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 20,
		}}
	>
		<div style={{fontSize: 22, lineHeight: 1, letterSpacing: '0.22em', color: GOLD}}>{upper(label)}</div>
		<div style={{display: 'flex', alignItems: 'center', gap: 14}}>{children}</div>
	</div>
);

// B: Editoryal; büyük takımyıldız üstte, metinler çizgilerle ayrılmış
const SignB: React.FC<SignSlideProps> = ({sign, dateLabel, items, luckyColor, luckyNumber}) => {
	const m = signMeta(sign);
	return (
		<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
			<Background glowY={300} seed={`sb${sign}`} />
			<StaticConstellation sign={sign} size={520} opacity={0.5} style={{left: 280, top: 10}} />
			<div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center'}}>
				<GoldText size={128}>{upper(m.name)}</GoldText>
				<div style={{marginTop: 18, fontSize: 26, color: MUTED, letterSpacing: '0.16em'}}>
					{upper(m.dates)} · {upper(m.element)}
				</div>
			</div>
			<div style={{position: 'absolute', top: 545, left: 96, right: 96}}>
				{items.map((it, i) => (
					<div key={it.label}>
						{i > 0 && <Hairline style={{margin: '0 0 0 0'}} />}
						<div style={{display: 'flex', gap: 36, padding: '30px 0'}}>
							<div
								style={{
									width: 150,
									flexShrink: 0,
									paddingTop: 12,
									fontFamily: FONT.display,
									fontWeight: 600,
									fontSize: 28,
									letterSpacing: '0.2em',
									color: GOLD,
								}}
							>
								{upper(it.label)}
							</div>
							<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 46, lineHeight: 1.16}}>
								{it.text}
							</div>
						</div>
					</div>
				))}
			</div>
			<div
				style={{
					position: 'absolute',
					top: 1150,
					left: 96,
					right: 96,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 26,
					fontSize: 24,
					letterSpacing: '0.2em',
					color: GOLD,
				}}
			>
				<span>ŞANSLI RENK</span>
				<span style={{width: 26, height: 26, borderRadius: 13, background: luckyColor.hex, border: `2px solid ${GOLD}`}} />
				<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 40, letterSpacing: 0, color: CREAM}}>
					{luckyColor.name}
				</span>
				<Sparkle size={14} />
				<span>ŞANSLI SAYI</span>
				<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 40, letterSpacing: 0, color: CREAM}}>
					{luckyNumber}
				</span>
			</div>
			<div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontSize: 22, letterSpacing: '0.3em', color: GOLD}}>
				{upper(dateLabel)}
			</div>
			<SiteFooter />
		</AbsoluteFill>
	);
};

// ---------------- KAPANIŞ ----------------
// Mağaza rozetleri (App Store / Google Play) daha sonra STORE_ROW alanına eklenecek.
export const FEATURES = ['Doğum Haritası', 'Astrokartografi', 'Sinastri', 'Tarot', 'Kahve Falı', 'Günlük Burç Yorumu'];

export const Closing: React.FC<ClosingProps> = ({variant}) => (
	<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
		<Background glowY={380} seed="clc" />
		<div style={{position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
			<Logo width={640} />
		</div>
		<div style={{position: 'absolute', top: 795, left: 60, right: 60, textAlign: 'center'}}>
			<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 58, lineHeight: 1.15}}>
				Gökyüzünün sırları, tek uygulamada.
			</div>
		</div>
		{variant === 'B' ? <FeaturePills /> : <FeatureGrid />}
		{/* STORE_ROW: rozetler gelince burası */}
		<div style={{position: 'absolute', top: 1100, left: 0, right: 0, textAlign: 'center', fontSize: 24, lineHeight: 1, letterSpacing: '0.3em', color: GOLD}}>
			İOS VE ANDROİD · ÇOK YAKINDA
		</div>
		<SiteFooter />
	</AbsoluteFill>
);

// A: iki satır, ince çizgiler arasında, yıldızla ayrılmış
const FeatureGrid: React.FC = () => (
	<div style={{position: 'absolute', top: 905, left: 90, right: 90}}>
		<Hairline />
		<div style={{padding: '26px 0'}}>
			{[FEATURES.slice(0, 3), FEATURES.slice(3)].map((row, r) => (
				<div
					key={r}
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 20,
						marginTop: r ? 20 : 0,
						fontSize: 23,
						letterSpacing: '0.14em',
						color: CREAM,
					}}
				>
					{row.map((f, i) => (
						<React.Fragment key={f}>
							{i > 0 && <Sparkle size={12} />}
							<span>{upper(f)}</span>
						</React.Fragment>
					))}
				</div>
			))}
		</div>
		<Hairline />
	</div>
);

// B: Altın çerçeveli etiketler
const FeaturePills: React.FC = () => (
	<div style={{position: 'absolute', top: 905, left: 70, right: 70, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16}}>
		{FEATURES.map((f) => (
			<div
				key={f}
				style={{
					padding: '14px 28px',
					borderRadius: 40,
					border: '1.5px solid rgba(232,203,152,0.45)',
					background: 'rgba(30,26,88,0.55)',
					fontSize: 23,
					letterSpacing: '0.12em',
					color: CREAM,
				}}
			>
				{upper(f)}
			</div>
		))}
	</div>
);

// ---------------- HİKÂYE (1080×1920) ----------------
// Instagram güvenli alanı: üst ~250 px ve alt ~250 px boş bırakılır.
const SH = 1920;

export const StorySign: React.FC<SignSlideProps> = ({sign, dateLabel, items, luckyColor, luckyNumber}) => {
	const m = signMeta(sign);
	return (
		<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
			<Background glowY={480} seed={`st${sign}`} height={SH} />
			<StaticConstellation sign={sign} size={720} opacity={0.32} style={{left: 400, top: 170}} />
			<div style={{position: 'absolute', top: 290, left: 90, fontSize: 26, lineHeight: 1, letterSpacing: '0.3em', color: GOLD}}>
				GÜNLÜK BURÇ · {upper(dateLabel)}
			</div>
			<GoldText size={140} style={{position: 'absolute', top: 345, left: 82}}>
				{upper(m.name)}
			</GoldText>
			<div style={{position: 'absolute', top: 510, left: 90, fontSize: 30, lineHeight: 1, color: MUTED, letterSpacing: '0.04em'}}>
				{m.dates} · {m.element}
			</div>
			<div style={{position: 'absolute', top: 580, bottom: 330, left: 70, right: 70, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
				{items.map((it) => (
					<div key={it.label} style={{marginBottom: 28, padding: '30px 44px 34px', borderRadius: 28, background: CARD_BG, border: CARD_BORDER}}>
						<div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 32, letterSpacing: '0.2em', color: GOLD}}>{upper(it.label)}</div>
						<div style={{marginTop: 12, fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 52, lineHeight: 1.16}}>{it.text}</div>
					</div>
				))}
				<div style={{display: 'flex', gap: 24, marginTop: 6}}>
					<Chip label="Şanslı renk" grow={1.55}>
						<span style={{width: 34, height: 34, borderRadius: 17, background: luckyColor.hex, border: `2px solid ${GOLD}`, flexShrink: 0}} />
						<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 46, lineHeight: 1, paddingBottom: 6}}>{luckyColor.name}</span>
					</Chip>
					<Chip label="Şanslı sayı">
						<span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 52, lineHeight: 1, paddingBottom: 6, fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum" 1'}}>{luckyNumber}</span>
					</Chip>
				</div>
			</div>
			<SiteFooter bottom={270} />
		</AbsoluteFill>
	);
};

export const StoryClosing: React.FC = () => (
	<AbsoluteFill style={{color: CREAM, fontFamily: FONT.sans}}>
		<Background glowY={640} seed="stc" height={SH} />
		<div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
			<Logo width={760} />
		</div>
		<div style={{position: 'absolute', top: 1130, left: 60, right: 60, textAlign: 'center'}}>
			<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 64, lineHeight: 1.15}}>Gökyüzünün sırları, tek uygulamada.</div>
		</div>
		<div style={{position: 'absolute', top: 1250, left: 70, right: 70, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18}}>
			{FEATURES.map((f) => (
				<div key={f} style={{padding: '16px 30px', borderRadius: 40, border: '1.5px solid rgba(232,203,152,0.45)', background: 'rgba(30,26,88,0.55)', fontSize: 25, letterSpacing: '0.12em', color: CREAM}}>
					{upper(f)}
				</div>
			))}
		</div>
		<div style={{position: 'absolute', top: 1470, left: 0, right: 0, textAlign: 'center', fontSize: 26, lineHeight: 1, letterSpacing: '0.3em', color: GOLD}}>İOS VE ANDROİD · ÇOK YAKINDA</div>
		<SiteFooter bottom={270} />
	</AbsoluteFill>
);
