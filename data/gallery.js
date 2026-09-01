// The photo manifest for /gallery/, migrated out of app.js (Task 17) so the
// build emits real server-rendered <img> tags: before this, the whole reel
// was built client-side from an inline array and crawlers indexed nothing.
// app.js still drives the carousel/lightbox behaviour, but now reads each
// item back out of the rendered DOM instead of holding its own copy.
//
// Fields: `src` (root-relative asset path), `alt` (a plain description of
// the frame, for accessibility/SEO, independent of `title`, which is the
// caption shown in the gallery/lightbox), `category`, `title`, `story`.
//
// Optional: `tile` ('feature' | 'tall' | 'normal') overrides the positional
// tile rhythm in templates/gallery.js, for a frame whose shape the rhythm
// would crop badly.
//
// Optional: `credit` for a photograph that is not Nissa's own work, shaped
// exactly like `heroCredit` in data/journeys.js:
//
//   credit: { author, license, licenseUrl, sourceUrl }
//
// A frame with no `credit` is Nissa's own, and that is the claim the gallery
// makes about it, so never add one to a photograph whose provenance is not
// certain. A frame WITH a credit renders its attribution on the tile and in
// the lightbox, and is listed on /copyright/, which is what CC BY-SA
// requires and what keeps the page honest about whose work it is.
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
    alt: "Close-up of a rhino's head and horn lit low through tall golden grass",
    category: 'Conservation',
    title: 'Horn and grass',
    story: 'Close enough to see the grain of the horn. On the conservancies I know best, every rhino is monitored individually and known by name to the team that protects it.',
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
    alt: 'A bush plane on a dirt airstrip, grass and scrub either side',
    category: 'Safari Moments',
    title: 'Wheels down',
    story: 'The bush plane down on a dirt strip. Most journeys into the far north begin with one of these rather than a long day on the road.',
  },
  {
    src: '/assets/p15.jpg',
    alt: 'A lioness standing beside a termite mound in golden dry grass',
    category: 'Wildlife',
    title: 'The vantage point',
    story: 'A lioness up on a termite mound at last light. They use them as lookouts, a metre of height over the grass is enough to change what she can see.',
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
    alt: 'Two helicopters parked on a grassy slope under a broad acacia',
    category: 'Safari Moments',
    title: 'Waiting under the acacia',
    story: 'Helicopters parked up under a tree between flights. For the far reaches of the northern circuit, sometimes the only sensible way in is from the air.',
  },
  {
    src: '/assets/p18.jpg',
    alt: 'Two buffalo on a red-earth bank above a still waterhole, green hills behind',
    category: 'Landscapes',
    title: 'Down to the water',
    story: 'Two buffalo holding the bank above a waterhole in the late morning. Water like this is the axis everything else turns around in the dry months.',
  },
  {
    src: '/assets/i04.jpg',
    alt: 'Five cheetahs sitting upright in a row in dry grass, heads raised and facing away',
    category: 'Wildlife',
    title: 'The whole coalition, sitting up',
    story: 'Five cheetahs up on their haunches at once, every head turned the same way. Brothers often stay together for life after leaving their mother, and hunt as a unit.',
  },
  {
    src: '/assets/i02.jpg',
    alt: 'Three cheetahs resting close together in tall dry grass, looking towards the camera',
    category: 'Wildlife',
    title: 'Resting up in the long grass',
    story: 'The same group down flat in the grass through the middle of the day. Cheetahs hunt on sight and in daylight, so the heat is spent waiting rather than moving.',
  },
  {
    src: '/assets/mukogodo.jpg',
    alt: 'A rocky promontory above a wide valley of hills and open country in hazy golden light',
    category: 'Landscapes',
    title: 'The edge of the Mukogodo',
    story: 'A rock jutting out over the whole valley, with two figures standing on it for scale. From up here the country reads as one piece rather than a series of separate places.',
  },
  {
    src: '/assets/balloon-01.jpg',
    alt: 'A balloon burner firing into the open mouth of an envelope before dawn, crew silhouetted below',
    category: 'Safari Moments',
    title: 'Inflating before first light',
    story: 'The burner going in while it is still dark. Balloons fly at dawn because that is when the air is calmest, which means arriving at the launch site well before the sun.',
  },
  {
    src: '/assets/balloon-02.jpg',
    alt: 'A hot air balloon aloft over open dry grassland at dawn with more balloons small on the horizon',
    category: 'Safari Moments',
    title: 'Up over the plains',
    story: 'Away and climbing, with others already out ahead on the horizon. A balloon drifts with the wind rather than steering, so no two mornings take the same line.',
  },
  {
    src: '/assets/i08.jpg',
    alt: 'A person in a cap and jacket standing beside still water at dawn, binoculars in hand',
    category: 'Safari Moments',
    title: 'First light at the water',
    story: 'Standing off the vehicle at a waterhole in the first cold light, glasses up. Water is where the morning happens: whatever is around comes to it eventually.',
  },
  {
    src: '/assets/i17.jpg',
    alt: 'A table laid with glasses and cutlery under a tree, open grassland and cloud beyond',
    category: 'Safari Moments',
    title: 'Lunch laid out in the open',
    story: 'Glasses upturned and the table set under a tree, with nothing but grass past it. Some of the best hours of a safari are the ones with nothing scheduled in them.',
  },
  {
    src: '/assets/i14.jpg',
    alt: 'A stone and glass building with a steep pitched roof standing on a mown lawn',
    category: 'Camps & Lodges',
    title: 'Stone, glass and a steep roof',
    story: 'Built out of the rock it stands on, with the whole front glazed towards the view. The camps and lodges we book are chosen for where they sit as much as for the rooms.',
  },
  {
    src: '/assets/diani-01.jpg',
    alt: 'Tall coconut palms leaning over a coastal treeline with the sea visible beyond',
    category: 'Landscapes',
    title: 'Palms and the sea beyond',
    story: 'Coconut palms leaning the way the wind has trained them, with the water showing through underneath. This is where a Kenya trip usually ends, after the bush.',
  },
  {
    // Baraka died on the night of 15 August 2026, aged 31, at Ol Pejeta.
    // The facts here (born 1994, right eye lost in a fight in 2008, the
    // remaining eye lost to a cataract, blind thereafter) are on the public
    // record and were checked before publishing, rather than written from
    // memory. Do not add a cause of death: Ol Pejeta had not published a
    // veterinary finding when this was written.
    src: '/assets/baraka.jpg',
    alt: 'A black rhino standing in green grass with flat-topped acacia and a treeline behind',
    category: 'Conservation',
    title: 'The late Baraka',
    story: 'Ol Pejeta\'s blind black rhino, born there in 1994 and known to almost everyone who visited. He lost one eye fighting another male in 2008 and the other to a cataract, and lived out his years in a quiet enclosure where people could meet a rhino at arm\'s length. He died on 15 August 2026, aged 31.',
  },
  {
    // Was the home hero briefly, replaced there by the cheetah cubs. Kept in
    // the gallery rather than deleted, since the photograph was supplied for
    // the site. NOTE: guests' faces are identifiable in this frame; if consent
    // was not obtained, remove this entry rather than cropping it, because the
    // tile crop is not guaranteed to exclude them at every breakpoint.
    src: '/assets/bush-breakfast.jpg',
    alt: 'Guests seated at a long table for a bush breakfast in the open, with a spread of food in the foreground and dry hills behind',
    category: 'Safari Moments',
    title: 'Breakfast in the open',
    story: 'A table carried out to a spot chosen the night before, laid up while the drive is still running, and reached when the morning has already earned it. Camps do this properly when they are told in advance, which is the whole reason we ask.',
  },
  {
    // A 2.2:1 panorama, which is why it carries an explicit `tile`: the
    // positional rhythm in templates/gallery.js would otherwise be free to
    // hand it a portrait tile and crop the people off both ends, and this is
    // a photograph where every person in it is the point.
    //
    // NOTE: guests' faces are identifiable here, as with the bush breakfast
    // above. If consent was not obtained, remove this entry outright rather
    // than relying on the crop, which is not guaranteed to exclude anyone at
    // any breakpoint.
    src: '/assets/safari-group.jpg',
    alt: 'A safari group standing together with their guide in front of an open-sided safari vehicle, dry golden grass and open bush behind them',
    tile: 'feature',
    category: 'Safari Moments',
    title: 'The whole party',
    story: 'The photograph nobody plans and everybody ends up wanting: the whole vehicle emptied out, drinks handed round, the country falling away behind. Ask your guide and it takes two minutes.',
  },
  // ---- Lake Nakuru flamingos ----
  // Not Nissa's photographs. Nissa has none of flamingos, and rather than
  // leave the birds off a site that sells three itineraries routing through
  // Lake Nakuru, these are used under the Creative Commons licence they
  // carry, credited on the tile, in the lightbox and on /copyright/. All
  // three are Thomas Fuhrmann's, taken in Lake Nakuru National Park.
  //
  // The stories deliberately avoid the "million flamingos" line the lake is
  // still marketed on. Numbers there collapsed after lake levels rose
  // through the 2010s and diluted the alkalinity the lesser flamingos' food
  // algae depends on, which is why data/packages.js hedges every mention
  // with "lake levels permitting". These captions say the same thing.
  {
    src: '/assets/flamingo-flock.jpg',
    alt: 'A long line of lesser flamingos standing in the shallows along the shore of Lake Nakuru, reflected in still water',
    tile: 'feature',
    category: 'Birdlife',
    title: 'The pink line',
    story: 'From any distance a flock stops being birds and becomes one pink line drawn along the shallows. Lake Nakuru does this in a good year; the numbers rise and fall with the lake itself, which is why nobody honest will promise you them.',
    credit: {
      author: 'Thomas Fuhrmann',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Lake_Nakuru_National_Park_03_-_Lesser_flamingo_(Phoeniconaias_minor).jpg',
    },
  },
  {
    src: '/assets/flamingo-landing.jpg',
    alt: 'A flamingo coming in to land on the shallow water of Lake Nakuru with wings spread, the flock a pink line on the far shore',
    category: 'Birdlife',
    title: 'Coming in',
    story: 'They land like a badly judged aeroplane, legs down and running on the surface for a few strides before the wings fold. The far shore here is the rest of the flock, close enough together to read as a single band of colour.',
    credit: {
      author: 'Thomas Fuhrmann',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Lake_Nakuru_National_Park_02_-_Lesser_Flamingo_(Phoeniconaias_minor).jpg',
    },
  },
  {
    src: '/assets/flamingo-reflection.jpg',
    alt: 'A greater flamingo standing on a sandbar at Lake Nakuru, mirrored in the still water below it',
    tile: 'tall',
    category: 'Birdlife',
    title: 'Greater, not lesser',
    story: 'Two species share these lakes and it is worth learning to split them: the greater flamingo is the taller, paler one with a pink bill tipped in black, while the lesser is smaller, deeper pink, and carries a bill so dark it reads as black at any distance.',
    credit: {
      author: 'Thomas Fuhrmann',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Lake_Nakuru_National_Park_04_-_greater_flamingo_(Phoenicopterus_roseus).jpg',
    },
  },
  // ---- Added September 2026, from the client's own folder ----
  {
    src: '/assets/lion-approach.jpg',
    alt: 'A maned lion walking directly towards the camera through dry golden grass',
    category: 'Wildlife',
    title: 'Straight at the vehicle',
    story: 'Head on, at eye level, and not hurrying. Lions in these parks read a vehicle as one large object and give it almost no attention, which is exactly why nobody inside it should stand up and break that outline.',
  },
  {
    src: '/assets/lionesses-cubs.jpg',
    alt: 'Two lionesses and their cubs pressed close together in dry grass, one nuzzling another',
    category: 'Wildlife',
    title: 'One animal with too many heads',
    story: 'Lionesses in a pride are usually sisters, cousins or mothers and daughters, and they raise cubs more or less communally, grooming and nursing whichever young are nearest. It is why a pride at rest so often reads as a single animal with the wrong number of heads.',
  },
  {
    src: '/assets/cheetah-mound.jpg',
    alt: 'A cheetah lying on top of a red termite mound, watching out across open grassland',
    category: 'Wildlife',
    title: 'The termite mound office',
    story: 'On a flat plain a termite mound is the only high ground there is, and cheetahs use them constantly. A metre of elevation is the difference between seeing a gazelle at eight hundred metres and not seeing it at all. Learn to check the mounds before you check the grass.',
  },
  {
    src: '/assets/lion-young.jpg',
    alt: 'A young lion looking directly into the camera through tall dry grass',
    category: 'Wildlife',
    title: 'Being assessed',
    story: 'Cats look at you properly, in a way almost no plains game does. Whatever else is happening, you are being read, filed as not food, and dismissed, and the whole thing takes about three seconds.',
  },
  {
    // The most graphic frame on the site by some distance. It is here because
    // a predator feeding is a real and common sighting and the caption says
    // so plainly rather than dressing it up. If the client would rather the
    // gallery did not carry it, delete this entry; nothing else depends on it.
    src: '/assets/cheetah-cubs-kill.jpg',
    alt: 'Several cheetah cubs feeding together on a small antelope carcass in dry grass, one looking up towards the camera',
    category: 'Wildlife',
    title: 'How it actually works',
    story: 'Not the part that ends up in brochures, and the part people remember longest. A cheetah eats fast because it cannot defend a kill against anything bigger, and losing one to hyena or lion is routine rather than bad luck. If this is not what you came out for, say so and we drive on.',
  },
  {
    // Guests are visible but distant and not identifiable at this size. The
    // same consent note as the other guest photographs still applies if that
    // ever changes: delete the entry rather than relying on the crop.
    src: '/assets/bush-breakfast-wide.jpg',
    alt: 'A bush breakfast laid out on a long table in the open, with flasks, juices and a cheese board in the foreground and guests eating at a table under acacias behind',
    tile: 'feature',
    category: 'Safari Moments',
    title: 'The whole set-up',
    story: 'The wider view of the same idea: the buffet goes up first, out of the vehicle and onto a table standing in the open, and the long table under the trees is where you actually sit. Every part of it is carried in and carried out again.',
  },
  {
    // NOTE: guests' faces are identifiable in this frame. If consent was not
    // obtained, remove this entry rather than cropping it.
    src: '/assets/airstrip-group.jpg',
    alt: 'A group of guests standing together with their bags on a bush airstrip, a runway marker board beside them and open plains behind',
    tile: 'feature',
    category: 'Safari Moments',
    title: 'Waiting on the strip',
    story: 'The board reads 03 21: the two compass headings you can land on here, depending on which way the wind is running. A bush strip is a graded line of murram, a windsock and that number, and the aircraft is a speck for a long time before it is a noise.',
  },
];
