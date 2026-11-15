import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONT, loadFonts} from '../fonts';
import {CREAM, GOLD, GoldText} from '../carousel/shared';

loadFonts();
const SHADOW = '0 0 30px rgba(4,6,42,0.95), 0 2px 12px rgba(4,6,42,0.95)';

const LogoRow: React.FC = () => (
	<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<Img src={staticFile('logo/emblem-feather.png')} style={{width: 104, display: 'block', marginRight: 14}} />
		<Img src={staticFile('logo/wordmark.png')} style={{width: 300, display: 'block'}} />
	</div>
);
const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{fontFamily: FONT.sans, fontWeight: 500, fontSize: 30, letterSpacing: '0.34em', lineHeight: 1, color: GOLD, textShadow: SHADOW}}>{children}</div>
);
const Sub: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 66, lineHeight: 1.14, color: CREAM, textShadow: SHADOW}}>{children}</div>
);
const Rule: React.FC = () => <div style={{width: 120, height: 2, background: 'rgba(232,203,152,0.6)', margin: '0 auto'}} />;
const Bg: React.FC<{src: string; t?: string}> = ({src, t}) => (
	<Img src={staticFile(src)} style={{position: 'absolute', left: -54, top: -96, width: 1188, height: 2112, objectFit: 'cover', transform: t}} />
);

export const DogumSaatiCover: React.FC<{variant: 'A' | 'B' | 'C'}> = ({variant}) => {
	if (variant === 'A')
		return (
			<AbsoluteFill style={{background: '#04062A', textAlign: 'center'}}>
				<Bg src="reel3/s1.jpg" t="translateY(170px) scale(0.95)" />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.85) 0%, rgba(4,6,42,0.55) 30%, rgba(4,6,42,0.05) 50%, rgba(2,3,31,0.25) 80%, rgba(2,3,31,0.7) 100%)'}} />
				<div style={{position: 'absolute', top: 290, left: 50, right: 50}}>
					<Label>YÜKSELEN BURÇ</Label>
					<GoldText size={124} style={{marginTop: 40, lineHeight: 1.06}}>DOĞDUĞUN</GoldText>
					<GoldText size={124} style={{marginTop: 4, lineHeight: 1.06}}>SAAT</GoldText>
					<div style={{marginTop: 24}}><Sub>sana ne söylüyor?</Sub></div>
				</div>
				<div style={{position: 'absolute', top: 1530, left: 0, right: 0}}><LogoRow /></div>
			</AbsoluteFill>
		);
	if (variant === 'B')
		return (
			<AbsoluteFill style={{background: '#04062A', textAlign: 'center'}}>
				<Bg src="reel3/s6.jpg" />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.35) 0%, rgba(4,6,42,0.05) 35%, rgba(4,6,42,0.25) 55%, rgba(2,3,31,0.92) 70%, rgba(2,3,31,0.96) 100%)'}} />
				<div style={{position: 'absolute', top: 1060, left: 40, right: 40}}>
					<Label>DOĞDUĞUN SAAT</Label>
					<GoldText size={70} style={{marginTop: 40, lineHeight: 1.1, whiteSpace: 'nowrap'}}>BURCUNA</GoldText>
					<GoldText size={70} style={{marginTop: 6, lineHeight: 1.1, whiteSpace: 'nowrap'}}>BENZEMİYOR MUSUN?</GoldText>
					<div style={{marginTop: 34}}><Rule /></div>
					<div style={{marginTop: 40}}><LogoRow /></div>
				</div>
			</AbsoluteFill>
		);
	return (
		<AbsoluteFill style={{background: '#04062A', textAlign: 'center'}}>
			<Bg src="reel3/s5.jpg" t="translateY(-60px)" />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.2) 0%, rgba(4,6,42,0) 30%, rgba(4,6,42,0.2) 50%, rgba(2,3,31,0.92) 64%, rgba(2,3,31,0.97) 100%)'}} />
			<div style={{position: 'absolute', top: 1160, left: 50, right: 50}}>
				<Label>DOĞDUĞUN SAAT</Label>
				<GoldText size={88} style={{marginTop: 38, lineHeight: 1.08, whiteSpace: 'nowrap'}}>İNSANLAR SENDE</GoldText>
				<GoldText size={88} style={{marginTop: 4, lineHeight: 1.08, whiteSpace: 'nowrap'}}>NE GÖRÜYOR?</GoldText>
				<div style={{marginTop: 34}}><LogoRow /></div>
			</div>
		</AbsoluteFill>
	);
};
