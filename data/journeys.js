// Nine international "journeys" pages: overview-and-enquiry only, no fixed
// itineraries, no prices. Nissa has no recorded first-hand guiding in any of
// these countries (see docs/nissa-biography-source.md), so every entry is
// written in operator voice ("we arrange", "we plan the route"), never a
// first-hand claim. Contrast with data/destinations.js, whose Kenya entries
// carry `nissaNote`, a field this shape deliberately omits.
//
// Facts here (parks, seasons, permits, landmarks) are general and checkable,
// no invented names, no numeric prices or permit fees anywhere on the site
// (see commit 167defe, which removed prices sitewide).

const journeys = [
  // ---------- Eastern Africa ----------
  {
    slug: 'rwanda',
    region: 'Eastern Africa',
    name: 'Rwanda',
    shortName: 'Rwanda',
    countryCode: 'RW',
    hero: '/assets/rwanda-01.jpg',
    heroAlt:
      'A mountain gorilla in close view, head and shoulders filling the frame against blurred green forest',
    heroCredit: {
      author: 'Charles J. Sharp',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Mountain_gorilla_(Gorilla_beringei_beringei)_female_3.jpg',
    },
    summary:
      'The Land of a Thousand Hills, and the most straightforward country in the world for seeing mountain gorillas: a short trek from volcanoes, terraced farmland and rainforest.',
    overview: [
      "Rwanda is compact enough that a first-time visitor covers ground quickly: Kigali is a short flight from Nairobi, and Volcanoes National Park, the country's gorilla-trekking base, is only a couple of hours' drive north of the capital. The park sits in the Virunga Mountains, a chain of volcanoes shared with Uganda and the Democratic Republic of Congo, and its bamboo and rainforest slopes hold roughly a third of the world's remaining mountain gorillas.",
      "Gorilla trekking is the reason most people come, but it is not the only reason to stay. Nyungwe Forest National Park in the south-west has a canopy walkway and habituated chimpanzee groups, and Akagera National Park in the east, on the Tanzanian border, has been rebuilt into a genuine Big Five savanna reserve since black rhino and lion were reintroduced there.",
      "We arrange Rwanda as a stand-alone trip or as an add-on to a Kenya safari: flights, the right permit allocation, lodges near each park and a private guide and driver for the whole circuit.",
    ],
    highlights: [
      'Mountain gorilla trekking, Volcanoes National Park',
      'Golden monkey trekking in the same park',
      'Chimpanzee tracking and a canopy walkway, Nyungwe Forest',
      'Akagera National Park, a rebuilt Big Five savanna reserve',
    ],
    bestTime:
      'Gorilla trekking runs year-round; the two dry spells, June through September and December through February, keep the forest trails firmer underfoot. Permits are limited and allocated daily, so book well ahead of your travel dates.',
    gettingThere:
      "Kigali International Airport connects to Nairobi, Addis Ababa and several European hubs; Volcanoes National Park is a two-to-three hour drive north of the city.",
    metaTitle: 'Rwanda Safaris & Gorilla Trekking | Nissa Safaris',
    metaDescription:
      "Rwanda safaris arranged by Nissa Safaris: mountain gorilla trekking, Nyungwe chimpanzees and Akagera's Big Five, with flights, lodges and guiding sorted for you.",
  },
  {
    slug: 'uganda',
    region: 'Eastern Africa',
    name: 'Uganda',
    shortName: 'Uganda',
    countryCode: 'UG',
    hero: '/assets/uganda-01.jpg',
    heroAlt: 'An alpha male chimpanzee on the forest floor in Kibale National Park',
    heroCredit: {
      author: 'Giles Laurent',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:013_Alpha_male_chimpanzee_at_Kibale_forest_National_Park_Photo_by_Giles_Laurent.jpg',
    },
    summary:
      "The Pearl of Africa: gorilla and chimpanzee tracking in ancient rainforest, tree-climbing lions on the savanna, and the Nile forced through a narrow gorge at Murchison Falls.",
    overview: [
      "Uganda pairs primates with plains game in a way few countries can. Bwindi Impenetrable National Park in the south-west holds roughly half the world's mountain gorillas across several habituated family groups, while Kibale Forest National Park further north has one of the highest primate densities anywhere in Africa, chimpanzees included.",
      "The savanna parks add a different kind of game viewing: Queen Elizabeth National Park is known for the tree-climbing lions of its Ishasha sector and a boat cruise along the Kazinga Channel between two lakes, and Murchison Falls National Park is built around the point where the Nile is squeezed through a gap in the rock only a few metres wide before dropping into the gorge below.",
      "We arrange Uganda as its own trip or paired with Rwanda for gorillas on both sides of the border: flights, permits, lodges and a private guide for the whole route.",
    ],
    highlights: [
      'Mountain gorilla trekking, Bwindi Impenetrable National Park',
      'Chimpanzee tracking, Kibale Forest',
      'Tree-climbing lions and the Kazinga Channel, Queen Elizabeth National Park',
      'Murchison Falls, where the Nile forces through a narrow gorge',
    ],
    bestTime:
      'Trekking is possible year-round; the driest and easiest trail conditions are December through February and June through September. Gorilla and chimpanzee permits are limited and should be booked well in advance.',
    gettingThere:
      "Entebbe International Airport serves Kampala; onward travel to the parks is by road, around eight to nine hours to Bwindi, or a shorter scheduled or charter flight.",
    metaTitle: 'Uganda Safaris & Gorilla Trekking | Nissa Safaris',
    metaDescription:
      "Uganda safaris arranged by Nissa Safaris: gorilla and chimpanzee tracking, tree-climbing lions and Murchison Falls, with flights, permits and guiding handled.",
  },
  {
    slug: 'tanzania',
    region: 'Eastern Africa',
    name: 'Tanzania',
    shortName: 'Tanzania',
    countryCode: 'TZ',
    hero: '/assets/i01.jpg',
    heroAlt: 'A cheetah sitting alert in dry golden grassland, looking away from the camera',
    summary:
      "The Serengeti's wildebeest migration, the wildlife-dense Ngorongoro Crater, and Kilimanjaro standing over it all: Tanzania's northern circuit is East African safari at its biggest scale.",
    overview: [
      "Tanzania's northern circuit runs from Lake Manyara and Tarangire, both known for large elephant herds and Tarangire's ancient baobabs, through the Ngorongoro Crater, a collapsed volcanic caldera whose floor holds one of the densest concentrations of wildlife in Africa, and on into the Serengeti itself, the same ecosystem that continues north into Kenya's Masai Mara.",
      "The Serengeti's wildebeest and zebra migration moves through the park on a rough annual circuit, with calving season on the southern plains around January to March and river crossings further north later in the year. Where to be depends on the month, so we plan the route around it rather than a fixed itinerary.",
      "Kilimanjaro, Africa's highest peak, is climbable on several routes without technical gear and is often combined with the northern circuit or a beach extension to Zanzibar. We arrange the flights, park fees, lodges and a private guide for the whole trip.",
    ],
    highlights: [
      'The Serengeti migration and its river crossings',
      "Ngorongoro Crater's dense, concentrated wildlife",
      "Tarangire's elephant herds and ancient baobabs",
      'Kilimanjaro treks and a Zanzibar beach extension',
    ],
    bestTime:
      'June through October is the classic dry season across the northern circuit. Where the migration is depends on the month: calving on the southern plains around January to March, river crossings further north from around July.',
    gettingThere:
      "Kilimanjaro International Airport and Arusha serve the northern circuit, with direct flights from Nairobi; light aircraft link the parks themselves.",
    metaTitle: 'Tanzania Safaris: Serengeti & Kilimanjaro | Nissa Safaris',
    metaDescription:
      "Tanzania safaris arranged by Nissa Safaris: the Serengeti migration, Ngorongoro Crater and Kilimanjaro, with flights, lodges and a private guide handled.",
  },
  // ---------- Southern Africa ----------
  {
    slug: 'botswana',
    region: 'Southern Africa',
    name: 'Botswana',
    shortName: 'Botswana',
    countryCode: 'BW',
    hero: '/assets/i14.jpg',
    heroAlt: 'A stone-walled lodge building with large windows, set on an open lawn among trees',
    summary:
      "The Okavango Delta by mokoro and light aircraft, the elephant herds of Chobe, and a low-volume model built around small camps and private concessions.",
    overview: [
      "The Okavango Delta is a vast inland river delta, water flowing off the Angolan highlands and fanning out across the Kalahari sand instead of reaching the sea, and it is explored differently from a standard game drive: by mokoro canoe through the reed channels, on foot on the delta's islands, and by light aircraft between camps.",
      "Chobe National Park, in the country's north, holds one of the largest elephant populations in Africa, concentrated along the Chobe River especially in the dry months. Moremi Game Reserve and the Kalahari's Makgadikgadi salt pans add further variety, from classic delta game viewing to the seasonal zebra migration and meerkat colonies of the pans.",
      "Botswana's tourism model runs on a small number of beds per camp rather than large lodges, so trips here are booked well ahead. We handle the flights, the camp selection and sequencing, and a private guide for each leg.",
    ],
    highlights: [
      'The Okavango Delta by mokoro and light aircraft',
      "Chobe National Park's river-front elephant herds",
      'Moremi Game Reserve',
      'Makgadikgadi salt pans: meerkats and the zebra migration',
    ],
    bestTime:
      "May through October is the dry season, when game concentrates around the delta and the Chobe River; the delta's own floodwaters, arriving from Angola, typically peak locally around June to August.",
    gettingThere:
      "Fly into Maun for the Okavango Delta or Kasane for Chobe, then onward by light aircraft or road transfer to camp.",
    metaTitle: 'Botswana Safaris: Okavango & Chobe | Nissa Safaris',
    metaDescription:
      "Botswana safaris arranged by Nissa Safaris: the Okavango Delta by mokoro, Chobe's elephant herds and the Kalahari pans, flights and camps handled for you.",
  },
  {
    slug: 'zimbabwe',
    region: 'Southern Africa',
    name: 'Zimbabwe',
    shortName: 'Zimbabwe',
    countryCode: 'ZW',
    hero: '/assets/i11.jpg',
    heroAlt: 'A two-storey timber and stone lodge building with an open staircase, set among trees',
    summary:
      "Victoria Falls on the Zambezi, the elephant herds of Hwange, and Mana Pools' canoe and walking safaris along the river floodplain.",
    overview: [
      "Victoria Falls, on the Zambezi River and shared with Zambia on the opposite bank, is one of the world's great natural wonders, a curtain of water more than a kilometre wide dropping into a narrow gorge; the Zimbabwe side gives the widest views of the falls themselves.",
      "Hwange National Park, in the country's west, is Zimbabwe's largest reserve and known for its elephant herds, which gather at pumped waterholes through the dry months. Mana Pools National Park, a UNESCO World Heritage Site on the Zambezi's floodplain, is one of the few parks in Africa where walking and canoe safaris are routinely on offer alongside game drives.",
      "We build Zimbabwe as its own trip or paired with Zambia or Botswana across the wider Zambezi region: flights, the right camps for each park, and a private guide throughout.",
    ],
    highlights: [
      'Victoria Falls from the Zimbabwe side',
      "Hwange National Park's dry-season elephant herds",
      'Canoe and walking safaris, Mana Pools National Park',
      'Matobo Hills: rock formations and rhino',
    ],
    bestTime:
      'April through October is the dry season and the best time for game viewing; the falls carry the most water from February to May and are at their driest-looking around October and November.',
    gettingThere:
      "Victoria Falls International Airport serves the falls directly; Hwange and Mana Pools are reached by light aircraft or road transfer from there or from Harare.",
    metaTitle: 'Zimbabwe Safaris: Victoria Falls & Hwange | Nissa Safaris',
    metaDescription:
      "Zimbabwe safaris arranged by Nissa Safaris: Victoria Falls, Hwange's elephant herds and Mana Pools canoe safaris, with flights and camps handled for you.",
  },
  {
    slug: 'mozambique',
    region: 'Southern Africa',
    name: 'Mozambique',
    shortName: 'Mozambique',
    countryCode: 'MZ',
    hero: '/assets/i19.jpg',
    heroAlt: 'A white sand beach with a leaning palm tree and small boats moored offshore',
    summary:
      'A long Indian Ocean coastline of coral reefs and island archipelagos, usually paired with a Kruger-area safari as the beach half of a bush-and-beach trip.',
    overview: [
      "Mozambique's coast runs for well over two thousand kilometres, and the two archipelagos most visitors reach, Bazaruto in the south and the Quirimbas further north, are built around coral reefs, sandbanks and dhow sailing rather than a resort strip: diving and snorkelling are the main draw, alongside deep-sea fishing in places.",
      "Inland, Gorongosa National Park is a genuine conservation recovery story: its wildlife was decimated during Mozambique's civil war and has been rebuilt over the past two decades through a long-running restoration partnership, and it now offers a real, still-developing safari alongside the coast.",
      "Because Maputo and the southern beaches sit a short flight from Johannesburg, Mozambique is most often booked as the beach half of a trip that starts with a Kruger-area safari. We arrange the flights, the lodge and the transfer between the two.",
    ],
    highlights: [
      'Bazaruto Archipelago: coral reefs and dhow sailing',
      'Quirimbas Archipelago diving and snorkelling',
      'Gorongosa National Park, a wildlife recovery story',
      'A classic bush-to-beach pairing with South Africa',
    ],
    bestTime:
      "Good along the coast year-round, with a wetter spell from December through March; Gorongosa's game viewing is best in the dry season, roughly May through November.",
    gettingThere:
      "Maputo, Vilanculos and Beira all have international or regional airports; the southern beaches are commonly reached on a short connecting flight from Johannesburg.",
    metaTitle: 'Mozambique Safaris & Beach Journeys | Nissa Safaris',
    metaDescription:
      "Mozambique journeys arranged by Nissa Safaris: coral coastlines, island archipelagos and Gorongosa's wildlife recovery, with flights and lodges handled.",
  },
  {
    slug: 'south-africa',
    region: 'Southern Africa',
    name: 'South Africa',
    shortName: 'South Africa',
    countryCode: 'ZA',
    hero: '/assets/i12.jpg',
    heroAlt: 'An empty lodge dining room set with white tablecloths under a high timber-beamed roof',
    summary:
      'Kruger and its private reserves for Big Five and leopard sightings, Cape Town and the Winelands for a very different second half of the trip, and a well-developed self-drive network throughout.',
    overview: [
      "Kruger National Park is one of Africa's largest game reserves, and the private reserves along its unfenced western boundary, Sabi Sands and Timbavati among them, are known for close, off-road sightings and some of the best leopard viewing on the continent. Malaria-free alternatives further south, including Madikwe and parts of the Eastern Cape, suit families travelling with young children.",
      "South Africa is also the easiest country on this list to combine safari with a city and wine break: Cape Town, Table Mountain, the Cape Peninsula and the Winelands around Stellenbosch and Franschhoek are a short domestic flight from Johannesburg, and the country's infrastructure makes a self-drive add-on realistic in a way it rarely is elsewhere on this list.",
      "We put together the safari leg, the Cape Town leg and the transfers between them, with flights and a private guide where the ground calls for one.",
    ],
    highlights: [
      'Kruger National Park and its private reserves',
      'Leopard sightings in Sabi Sands and Timbavati',
      'Cape Town, Table Mountain and the Cape Peninsula',
      'The Winelands: Stellenbosch and Franschhoek',
    ],
    bestTime:
      "May through September, the dry winter, is best for game viewing in Kruger, thinner bush and animals drawn to waterholes; Cape Town is at its best in the local summer, November through March.",
    gettingThere:
      "OR Tambo International Airport serves Johannesburg and Kruger's private reserves; Cape Town has its own international airport, with a short domestic flight connecting the two legs of a trip.",
    metaTitle: 'South Africa Safaris: Kruger & Cape Town | Nissa Safaris',
    metaDescription:
      "South Africa journeys arranged by Nissa Safaris: Kruger's Big Five, private reserve leopard sightings and a Cape Town and Winelands add-on, all handled.",
  },
  {
    slug: 'namibia',
    region: 'Southern Africa',
    name: 'Namibia',
    shortName: 'Namibia',
    countryCode: 'NA',
    hero: '/assets/namibia-01.jpg',
    heroAlt: 'The crest of a tall red dune at Sossusvlei catching low sunrise light',
    heroCredit: {
      author: 'Giles Laurent',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:006_Dune_45_in_Sossusvlei_at_sunrise_Photo_by_Giles_Laurent.jpg',
    },
    summary:
      "Towering red dunes at Sossusvlei, desert-adapted elephant in Damaraland, and Etosha's waterholes: big-sky, self-drive country with some of the lowest population density in Africa.",
    overview: [
      "Namibia is built around space and light rather than density of wildlife. The Namib Desert, among the oldest deserts on earth, holds the dunes at Sossusvlei, some of the tallest in the world, and the ghost forest at Deadvlei, a white clay pan of centuries-dead camel thorn trees against the red sand.",
      "Etosha National Park, in the north, centres on a vast salt pan, and its waterholes concentrate game in a way that makes for reliable sightings even in dry country. Further west, Damaraland is home to desert-adapted elephant and black rhino, animals that have learned to cover long distances between scattered water sources. Namibia is also thought to hold the largest free-ranging cheetah population of any country.",
      "Distances between areas are long, so trips here mix self-drive sections with light-aircraft transfers depending on time and budget. We plan the route, book the lodges and camps, and arrange a guide for the sections that call for one.",
    ],
    highlights: [
      "Sossusvlei's dunes and the Deadvlei clay pan",
      "Etosha National Park's waterhole game viewing",
      'Desert-adapted elephant and rhino in Damaraland',
      "The world's largest free-ranging cheetah population",
    ],
    bestTime:
      "May through October is the dry season, when game concentrates at Etosha's waterholes; the desert scenery around Sossusvlei is a year-round draw regardless of season.",
    gettingThere:
      "Hosea Kutako International Airport serves Windhoek; onward travel is a mix of self-drive and light-aircraft transfer, given the long distances between areas.",
    metaTitle: 'Namibia Safaris: Desert & Dunes | Nissa Safaris',
    metaDescription:
      "Namibia journeys arranged by Nissa Safaris: Sossusvlei's dunes, Etosha's waterholes and Damaraland's desert-adapted wildlife, planned and booked for you.",
  },
  {
    slug: 'zambia',
    region: 'Southern Africa',
    name: 'Zambia',
    shortName: 'Zambia',
    countryCode: 'ZM',
    hero: '/assets/i17.jpg',
    heroAlt: 'A table set with wine glasses and cutlery, overlooking open grassland through a tent window',
    summary:
      "The birthplace of the walking safari, South Luangwa's leopard-dense oxbow lagoons, and canoe safaris among elephant and hippo on the Lower Zambezi.",
    overview: [
      "The walking safari, as most of the industry now practises it, was pioneered in Zambia's South Luangwa National Park in the 1950s, and it remains the park's signature activity alongside conventional game drives, its oxbow lagoons and riverine forest holding one of the highest leopard densities anywhere in Africa.",
      "The Lower Zambezi National Park, downstream from Victoria Falls, is usually explored by canoe as much as by vehicle, drifting past elephant and pods of hippo along the river's floodplain. Kafue National Park, one of the largest parks in Africa, is far less visited than either, open country for travellers who want to get away from other vehicles entirely.",
      "Many camps in Zambia close for part of the wet season, so timing matters here more than in most of the countries on this list. We build the route around when you can travel, book the camps and arrange the transfers and guiding.",
    ],
    highlights: [
      'Walking safaris in South Luangwa National Park',
      'Leopard-dense oxbow lagoons and riverine forest',
      'Canoe safaris among elephant and hippo, Lower Zambezi',
      'Kafue National Park, vast and lightly visited',
    ],
    bestTime:
      'May through October is the dry season and peak walking-safari season; many camps close during the wettest months, roughly November through April.',
    gettingThere:
      "Lusaka and Livingstone (for Victoria Falls) both have international airports; South Luangwa is usually reached via a short flight to Mfuwe airstrip.",
    metaTitle: 'Zambia Safaris: Walking Safaris & South Luangwa | Nissa Safaris',
    metaDescription:
      "Zambia safaris arranged by Nissa Safaris: walking safaris in South Luangwa, Lower Zambezi canoe trips and Kafue, with flights and camps handled for you.",
  },
];

export default journeys;
