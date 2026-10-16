import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const FONT_DISPLAY = 'AntonCut';
export const FONT_LABEL = 'ArchivoBlackCut';
export const FONT_BODY = 'InterCut';
export const FONT_HINDI = 'Baloo2Cut';

export const fontsReady = Promise.all([
  loadFont({family: FONT_DISPLAY, url: staticFile('fonts/Anton-Regular.ttf')}),
  loadFont({family: FONT_LABEL, url: staticFile('fonts/ArchivoBlack-Regular.ttf')}),
  loadFont({family: FONT_BODY, url: staticFile('fonts/Inter-Variable.ttf')}),
  loadFont({family: FONT_HINDI, url: staticFile('fonts/Baloo2-Variable.ttf')}),
]);

export const wght = (weight: number): React.CSSProperties => ({
  fontVariationSettings: `'wght' ${weight}`,
});
