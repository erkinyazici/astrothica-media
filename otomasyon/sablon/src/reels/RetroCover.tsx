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
	<div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 62, lineHeight: 1.14, color: CREAM, textShadow: SHADOW}}>{children}</div>
);
const Rule: React.FC = () => <div style={{width: 120, height: 2, background: 'rgba(232,203,152,0.6)', margin: '0 auto'}} />;

export const RetroCover: React.FC<{variant: 'A' | 'B' | 'C'}> = ({variant}) => {
	if (variant === 'A')
		return (
			<AbsoluteFill style={{background: '#04062A', textAlign: 'center'}}>
				<Img src={staticFile('reel2/bg1.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.80) 0%, rgba(4,6,42,0.50) 30%, rgba(4,6,42,0.12) 55%, rgba(2,3,31,0.55) 100%)'}} />
				<div style={{position: 'absolute', top: 300, left: 60, right: 60}}>
					<Label>MERKÜR · VENÜS</Label>
					<GoldText size={124} style={{marginTop: 44, lineHeight: 1.08}}>13 KASIM’DA</GoldText>
					<GoldText size={100} style={{marginTop: 10, lineHeight: 1.08}}>BİR ŞEY BİTTİ</GoldText>
					<div style={{marginTop: 44}}><Rule /></div>
					<div style={{marginTop: 40}}><Sub>Merkür ve Venüs retrosunun bitişi</Sub></div>
					<div style={{marginTop: 60}}><LogoRow /></div>
				</div>
			</AbsoluteFill>
		);
	if (variant === 'B')
		return (
			<AbsoluteFill style={{background: '#04062A', textAlign: 'center'}}>
				<Img src={staticFile('reel2/bg2.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.12)', transformOrigin: '50% 100%'}} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.45) 0%, rgba(4,6,42,0.05) 30%, rgba(4,6,42,0.25) 52%, rgba(2,3,31,0.92) 72%, rgba(2,3,31,0.96) 100%)'}} />
				<div style={{position: 'absolute', top: 1030, left: 40, right: 40}}>
					<Label>13 KASIM 2026</Label>
					<GoldText size={84} style={{marginTop: 42, lineHeight: 1.1, whiteSpace: 'nowrap'}}>MERKÜR VE VENÜS</GoldText>
					<GoldText size={84} style={{marginTop: 8, lineHeight: 1.1, whiteSpace: 'nowrap'}}>RETROSU BİTTİ</GoldText>
					<div style={{marginTop: 38}}><Rule /></div>
					<div style={{marginTop: 34}}><Sub>Bu üç şeyden biri başına geldi mi?</Sub></div>
					<div style={{marginTop: 44}}><LogoRow /></div>
				</div>
			</AbsoluteFill>
		);
	return (
		<AbsoluteFill style={{background: '#04062A', textAlign: 'center'}}>
			<Img src={staticFile('reel2/bg3.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)', transformOrigin: '50% 12%'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,42,0.25) 0%, rgba(4,6,42,0) 30%, rgba(4,6,42,0.15) 50%, rgba(2,3,31,0.94) 63%, rgba(2,3,31,0.98) 100%)'}} />
			<div style={{position: 'absolute', top: 1180, left: 60, right: 60}}>
				<Label>13 KASIM · MERKÜR VE VENÜS</Label>
				<GoldText size={132} style={{marginTop: 40, lineHeight: 1.06}}>ÇİFT RETRO</GoldText>
				<GoldText size={132} style={{marginTop: 4, lineHeight: 1.06}}>BİTTİ</GoldText>
				<div style={{marginTop: 30}}><LogoRow /></div>
			</div>
		</AbsoluteFill>
	);
};
