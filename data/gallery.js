// The photo manifest for /gallery/ — migrated out of app.js (Task 17) so the
// build emits real server-rendered <img> tags: before this, the whole reel
// was built client-side from an inline array and crawlers indexed nothing.
// app.js still drives the carousel/lightbox behaviour, but now reads each
// item back out of the rendered DOM instead of holding its own copy.
//
// Fields: `src` (root-relative asset path), `alt` (a plain description of
// the frame, for accessibility/SEO — independent of `title`, which is the
// caption shown in the gallery/lightbox), `category`, `title`, `story`.
export default [
  {
    src: '/assets/p04.jpg',
    alt: 'A leopard resting low on the branch of an acacia tree at first light',
    category: 'Wildlife',
    title: 'Leopard at first light',
    story: 'She had been on this acacia since before dawn. We cut the engine and simply waited, the mountain behind her turning gold.',
  },
  {
    src: '/assets/lion.jpg',
    alt: 'A maned lion sitting upright and alert in golden dry grass',
    category: 'Wildlife',
    title: 'The watch at golden hour',
    story: 'A coalition male surveying his territory in the last warm light. He held the pose long enough for the whole vehicle to fall silent.',
  },
  {
    src: '/assets/p14.jpg',
    alt: 'A lion resting in lush green grass after the rains',
    category: 'Wildlife',
    title: 'Lion in the green season',
    story: 'After the rains the grass comes up sweet and the prides grow fat. This old male barely lifted his head as we passed.',
  },
  {
    src: '/assets/kudu.jpg',
    alt: 'A greater kudu bull with spiralled horns stepping out of thicket in low sun',
    category: 'Wildlife',
    title: 'Greater kudu, low sun',
    story: 'A bull stepping out of the thicket at the edge of light. Those spiralled horns take six years to reach full turn.',
  },
  {
    src: '/assets/giraffe.jpg',
    alt: 'A giraffe browsing an acacia line as the sky burns out at dusk',
    category: 'Landscapes',
    title: 'Giraffe at dusk',
    story: 'The everyday miracle of Borana, a giraffe browsing the acacia line as the sky burns out behind the hills.',
  },
  {
    src: '/assets/p05.jpg',
    alt: 'A lion perched on a rocky koppie surveying the valley below',
    category: 'Wildlife',
    title: 'King of the koppie',
    story: 'Lions love a vantage point. From these rocks he can read the whole valley, and so can we.',
  },
  {
    src: '/assets/p06.jpg',
    alt: 'A leopard resting low in tall grass during the heat of the day',
    category: 'Wildlife',
    title: 'Stillness in the grass',
    story: 'A leopard waiting out the heat. Patience is the whole craft here, the longer you sit, the more the bush forgets you.',
  },
  {
    src: '/assets/p08.jpg',
    alt: "A black rhino grazing under a ranger's watch at golden hour",
    category: 'Conservation',
    title: 'Rhino at golden hour',
    story: 'A black rhino grazing under guard. Every one on this conservancy is known by name to the rangers who protect them.',
  },
  {
    src: '/assets/p12.jpg',
    alt: 'A rhino grazing with cattle egrets picking insects from the disturbed grass',
    category: 'Conservation',
    title: 'Rhino and her escorts',
    story: 'Cattle egrets ride alongside, picking insects from the grass she disturbs. A small partnership, played out daily.',
  },
  {
    src: '/assets/p10.jpg',
    alt: 'Two elephant bulls crossing a river below doum palms in late afternoon',
    category: 'Safari Moments',
    title: 'Elephants at the river',
    story: 'Two bulls crossing below the doum palms in the late afternoon, unhurried, the way only elephants can be.',
  },
  {
    src: '/assets/p01.jpg',
    alt: 'Wildlife gathered at a waterhole in the soft light of early morning',
    category: 'Safari Moments',
    title: 'Morning at the waterhole',
    story: 'First light at the water draws everyone in. We come early and let the morning fill up around us.',
  },
  {
    src: '/assets/p03.jpg',
    alt: 'Wildebeest gathered along a still lake shore under a hazy sky',
    category: 'Landscapes',
    title: 'Gathering at the shore',
    story: 'The herds move down to drink as the heat builds. Stand still long enough and the whole plain comes to you.',
  },
  {
    src: '/assets/p11.jpg',
    alt: 'A topi standing sentinel over her calf in long grass',
    category: 'Wildlife',
    title: "A mother's watch",
    story: 'A topi standing sentinel over her calf in the long grass, eyes never quite leaving the tree line.',
  },
  {
    src: '/assets/p02.jpg',
    alt: 'A tawny eagle perched and scanning the horizon',
    category: 'Birdlife',
    title: 'Tawny eagle, Rift Valley',
    story: 'A favourite of mine to point out, perched and scanning. Northern Kenya holds over a thousand species of bird.',
  },
  {
    src: '/assets/p09.jpg',
    alt: 'A gerenuk rising onto its hind legs to browse',
    category: 'Wildlife',
    title: 'Gerenuk, Northern Kenya',
    story: 'The gerenuk rises onto its hind legs to reach what others cannot, a desert antelope built for the dry country.',
  },
  {
    src: '/assets/p13.jpg',
    alt: 'A greater kudu half-hidden in green bush, watching the vehicle',
    category: 'Wildlife',
    title: 'Greater kudu in the bush',
    story: 'Half-hidden in green, watching us watch him. Read the ears and you will always know the moment before he bolts.',
  },
  {
    src: '/assets/plane.jpg',
    alt: 'A bush plane touching down on a dirt airstrip on the conservancy',
    category: 'Safari Moments',
    title: 'Wheels down at the airstrip',
    story: 'The bush plane touching down on the conservancy strip, where most journeys into the Northern Frontier begin.',
  },
  {
    src: '/assets/p15.jpg',
    alt: 'Two coalition male lions holding high grass at sundown',
    category: 'Wildlife',
    title: 'Brothers in the gold',
    story: 'Two coalition males holding the high grass at sundown. Where you find one, look for the other, they rarely range far apart.',
  },
  {
    src: '/assets/p16.jpg',
    alt: 'A quiet waterhole below hills as the day cools at last light',
    category: 'Landscapes',
    title: 'The dam at last light',
    story: 'A quiet waterhole below the hills as the day cools. Sit here long enough and the whole conservancy comes down to drink.',
  },
  {
    src: '/assets/p17.jpg',
    alt: 'A helicopter waiting under an acacia tree in the Northern Frontier',
    category: 'Safari Moments',
    title: 'Wings over the frontier',
    story: 'The helicopter waiting under an acacia. For the far reaches of the Northern Frontier, sometimes the only way in is from the air.',
  },
  {
    src: '/assets/p18.jpg',
    alt: 'A green line of seasonal sand river cutting through dry country',
    category: 'Landscapes',
    title: 'Down to the sand river',
    story: 'The green line of a seasonal sand river cutting through the dry country, a magnet for elephant, kudu and a hundred smaller lives.',
  },
];
