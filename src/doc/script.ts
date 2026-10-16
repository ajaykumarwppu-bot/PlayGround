export type Caption = {text: string; from: number; to: number};

export type Chapter = {
  n: number;
  name: string;
  place: string;
  from: number;
  duration: number;
};

export const FPS = 30;
export const TOTAL_FRAMES = 3600;
export const CHAPTER_CARD_FRAMES = 105;

export const T = {
  coldOpen: {from: 0, duration: 240},
  title: {from: 240, duration: 210},
  closing: {from: 3270, duration: 330},
};

export const CHAPTERS: Chapter[] = [
  {n: 1, name: 'Kagaz Ka Janm', place: 'CHINA • 105 AD', from: 450, duration: 660},
  {
    n: 2,
    name: 'Silk Road Par Safar',
    place: 'SAMARKAND → BAGHDAD → VENICE',
    from: 1110,
    duration: 660,
  },
  {n: 3, name: 'Aankdon Ki Zubani', place: 'PAPER BY THE NUMBERS', from: 1770, duration: 540},
  {n: 4, name: 'Kagaz Ke Avatar', place: 'ORIGAMI • CURRENCY • ART', from: 2310, duration: 480},
  {n: 5, name: 'Digital Zamana', place: 'SCREEN VS KAGAZ', from: 2790, duration: 480},
];

export const CAPTIONS: Caption[] = [
  {from: 20, to: 130, text: 'Aaj tumne ise kam se kam 12 baar chhua hoga.'},
  {from: 140, to: 232, text: 'Lekin iski asli kahani 2,000 saal purani hai…'},

  {from: 560, to: 715, text: 'China • 105 AD — ek court official, Cai Lun.'},
  {from: 725, to: 885, text: 'Bark, purane kapde aur machhli ke jaal se bana pehla asli kagaz.'},
  {from: 895, to: 1055, text: 'Papyrus se sasta, patthar se halka — ye tha idea revolution.'},

  {from: 1220, to: 1370, text: '751 AD, Talas ki jung — kaid papermakers Samarkand pahunche.'},
  {from: 1380, to: 1530, text: 'Baghdad ke paper mills: duniya ka pehla book boom.'},
  {from: 1540, to: 1700, text: '1450 — Gutenberg ki press. Kagaz ne ideas ko aazad kar diya.'},

  {from: 1895, to: 2005, text: 'Ab thoda data — kyunki kagaz numbers ka bhi hero hai.'},

  {from: 2430, to: 2580, text: 'Origami se currency tak — kagaz har roop me dhalta hai.'},
  {from: 2590, to: 2740, text: 'In panno par likhe ideas generations ko cross karte hain.'},

  {from: 2910, to: 3060, text: 'Digital zamane ne kaha: "paperless office". Par sach kuch aur hai.'},
  {from: 3070, to: 3220, text: 'Screen ne kagaz ko khatam nahi kiya — sirf uska role badla.'},

  {from: 3310, to: 3430, text: 'Jab bhi kuch banane ka mann kare — ek kagaz uthao, aur shuru karo.'},
];

export type Stat = {emoji: string; value: number; suffix: string; label: string};

export const STATS: Stat[] = [
  {emoji: '📦', value: 400, suffix: 'M+', label: 'tonnes kagaz har saal'},
  {emoji: '🌳', value: 8000, suffix: '', label: 'sheets ≈ 1 ped (approx.)'},
  {emoji: '♻️', value: 7, suffix: '×', label: 'baar tak recycle ho sakta hai'},
];

export const CRAFT = [
  {emoji: '🕊️', label: 'Origami'},
  {emoji: '💴', label: 'Currency'},
  {emoji: '📖', label: 'Books'},
  {emoji: '🎨', label: 'Art'},
  {emoji: '✉️', label: 'Letters'},
];

export const CREDITS = {
  title: 'KAGAZ',
  subtitle: 'The Untold Story of Paper',
  line: '2,000 saal • 3 mahadeep • ek chhoti si cheez',
  credit: 'Ek paper-cutout documentary • Remotion + React se bana',
};
