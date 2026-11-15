import React from 'react';
import {Composition, Still} from 'remotion';
import {ElementReel, REEL1_DURATION} from './reels/ElementReel';
import {RetroReel, REEL2_DURATION} from './reels/RetroReel';
import {RetroCover} from './reels/RetroCover';
import {DogumSaatiReel, REEL3_DURATION} from './reels/DogumSaatiReel';
import {DogumSaatiCover} from './reels/DogumSaatiCover';
import {Closing, Cover, SignSlide, StoryClosing, StorySign} from './carousel/Slides';
import {DailyHoroscope, HoroscopeProps} from './DailyHoroscope';

const defaultProps: HoroscopeProps = {
	sign: 'akrep',
	dateLabel: '6 Kasım',
	hook: 'Bugün sezgilerin seni yanıltmayacak.',
	items: [
		{label: 'Aşk', text: 'İçinde tuttuğun o sözü bugün söyle; karşılığını göreceksin.'},
		{label: 'İş', text: 'Ertelediğin işe sadece 20 dakika ayır. Gerisi kendiliğinden gelir.'},
		{label: 'Enerji', text: 'Akşamüstü yükseliyorsun. Önemli konuşmaları o saate bırak.'},
	],
	luckyColor: {name: 'Bordo', hex: '#7A1F3D'},
	luckyNumber: 8,
	cta: 'Kendi doğum haritanı keşfet',
};

const W = 1080;
const H = 1350;

export const Root: React.FC = () => (
	<>
	<Still id="Cover" component={Cover} width={W} height={H}
		defaultProps={{variant: 'A', dateLabel: '6 Kasım 2026 · Cuma', group: 0, hook: 'Bugün bir burç beklenmedik bir haber alıyor.'}} />
	<Still id="SignSlide" component={SignSlide} width={W} height={H}
		defaultProps={{variant: 'A', sign: 'akrep', dateLabel: '6 Kasım 2026', items: defaultProps.items, luckyColor: defaultProps.luckyColor, luckyNumber: defaultProps.luckyNumber}} />
	<Still id="StorySign" component={StorySign} width={W} height={1920}
		defaultProps={{variant: 'A', sign: 'akrep', dateLabel: '7 Kasım', items: defaultProps.items, luckyColor: defaultProps.luckyColor, luckyNumber: defaultProps.luckyNumber}} />
	<Still id="StoryClosing" component={StoryClosing} width={W} height={1920} defaultProps={{}} />
	<Still id="Closing" component={Closing} width={W} height={H} defaultProps={{variant: 'A'}} />
	<Still id="RetroCover" component={RetroCover} width={1080} height={1920} defaultProps={{variant: 'A' as const}} />
	<Still id="DogumSaatiCover" component={DogumSaatiCover} width={1080} height={1920} defaultProps={{variant: 'A' as const}} />
	<Composition id="DogumSaatiReel" component={DogumSaatiReel} durationInFrames={REEL3_DURATION} fps={30} width={1080} height={1920} />
	<Composition id="RetroReel" component={RetroReel} durationInFrames={REEL2_DURATION} fps={30} width={1080} height={1920} />
	<Composition id="ElementReel" component={ElementReel} durationInFrames={REEL1_DURATION} fps={30} width={1080} height={1920} />
	<Composition
		id="DailyHoroscope"
		component={DailyHoroscope}
		durationInFrames={450}
		fps={30}
		width={1080}
		height={1920}
		defaultProps={defaultProps}
	/>
	</>
);
