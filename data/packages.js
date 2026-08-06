// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER — EDIT BEFORE LAUNCH
// Indicative 2026 Kenya market rates, USD per person sharing, low season,
// mid-range accommodation, party of 4. Replace every figure with Nissa's own
// rates before the site goes live. Nothing else in the codebase hard-codes a
// price.
// ─────────────────────────────────────────────────────────────────────────────
export const PRICES = {
  mara2: { fromUsd: 420, tier: 'mid-range' },
  mara3: { fromUsd: 620, tier: 'mid-range' },
  'mara-nakuru4': { fromUsd: 880, tier: 'mid-range' },
  'mara-nakuru-naivasha5': { fromUsd: 1080, tier: 'mid-range' },
  'mara-nakuru-amboseli6': { fromUsd: 1340, tier: 'mid-range' },
  'best-of-kenya7': { fromUsd: 1590, tier: 'mid-range' },
  amboseli3: { fromUsd: 590, tier: 'mid-range' },
  tsavo2: { fromUsd: 390, tier: 'mid-range' },
  tsavo3: { fromUsd: 610, tier: 'mid-range' },
  'tsavo-amboseli4': { fromUsd: 850, tier: 'mid-range' },
  samburu3: { fromUsd: 650, tier: 'mid-range' },
  olpejeta2: { fromUsd: 430, tier: 'mid-range' },
  'samburu-olpejeta4': { fromUsd: 940, tier: 'mid-range' },
  'borana-lewa4': { fromUsd: 1180, tier: 'mid-range' },
  'laikipia-walking3': { fromUsd: 890, tier: 'mid-range' },
};

const packages = [
  {
    title: '2-Day Masai Mara Escape',
    slug: '2-day-masai-mara-escape',
    days: 2,
    nights: 1,
    category: 'Masai Mara & Rift Valley',
    destinations: ['masai-mara'],
    priceKey: 'mara2',
    hero: '/assets/p03.jpg',
    heroAlt: 'Four wildebeest walking along a still lake shore under a hazy sky',
    summary:
      'A weekend-length dash to the Mara for guests short on time: one afternoon and one full morning of game drives either side of a single night in camp.',
    overview: [
      "This is the itinerary I put together for guests who can free up a weekend but not a week: two days is enough for a proper look at the Mara without the two long drives eating most of your time. We leave Nairobi early, before the city traffic builds, and cover the roughly five to six hours to Narok and on to the reserve gate in one push, with a stop along the way to stretch and buy a coffee.",
      "Because you only get one night in camp, the schedule is built around the two best light windows: an afternoon drive on arrival day and a full morning drive before you leave. Everything in between is set up to protect those two sessions rather than pad the day with extras.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to the Mara',
        body: "We collect you early and drive southwest via Narok, entering the reserve through Sekenani or Oloolaimutia gate by early afternoon, depending on which camp you're booked into. After a light lunch at camp we head straight back out for an afternoon game drive, working the drainage lines and open plains where the resident prides tend to lie up once the heat breaks. Dinner and the night are at a tented camp inside or on the edge of the reserve.",
      },
      {
        day: 2,
        title: 'Morning drive and the road home',
        body: 'We are out at first light, when the grass is still cool and cats that hunted overnight are often still on a kill or moving back toward cover. We drive until mid-morning, then return to camp for a late breakfast, pack up, and start the drive back to Nairobi, arriving in the early evening in time for an onward flight or a night in the city.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle with a pop-up roof',
      'One night full-board accommodation at a tented camp in or bordering the Mara',
      'Two game drives, led by an English-speaking driver-guide',
      'Masai Mara reserve entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'The reserve rewards a visit at any time of year, but late June through October adds a real chance of the migration herds being present, and January through March gives quieter camps and clearer, cooler mornings.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for standing game viewing. Depending on your group size it may be a private vehicle or shared with one or two other bookings travelling the same route on the same dates; tell us at booking if you need it private.',
      },
      {
        q: 'Are park fees included?',
        a: 'Yes. Masai Mara conservation and entry fees for both days are built into the price. The only fees not included are anything outside the reserve itself, such as a visa on arrival in Kenya.',
      },
      {
        q: 'Is the migration guaranteed on this trip?',
        a: "No, and I would be doing you a disservice to promise it. The wildebeest migration is a movement of animals following rainfall and grazing, not a timetable, and river crossings can happen at almost any hour or not at all on a given day. What I can promise on two days in the Mara is resident lion, plenty of plains game, and a good chance of cheetah; the migration, when it lines up, is a bonus.",
      },
      {
        q: 'How much driving is involved for two days?',
        a: "It's honest to flag this: you are looking at roughly ten to twelve hours of road time over the two days, against one afternoon and one morning of game viewing. If that ratio bothers you, the 3-Day Masai Mara Classic gives you a full extra day in the park for not much more driving.",
      },
    ],
    signature: false,
  },
  {
    title: '3-Day Masai Mara Classic',
    slug: '3-day-masai-mara-classic',
    days: 3,
    nights: 2,
    category: 'Masai Mara & Rift Valley',
    destinations: ['masai-mara'],
    priceKey: 'mara3',
    hero: '/assets/lion.jpg',
    heroAlt: 'A maned lion sitting upright and alert in golden dry grass',
    summary:
      'Our most-booked Mara itinerary: a full unbroken day of game drives bracketed by two travel days, giving the reserve time to show itself properly.',
    overview: [
      "This is the itinerary most guests end up choosing, and for a simple reason: with a full day sitting entirely inside the Mara, you get a morning drive, a midday break at camp through the hottest hours, and an afternoon drive, rather than compressing everything into the edges of two travel days. The extra day also gives us room to move if the wildlife isn't cooperating in one part of the reserve; we can shift areas rather than working the same square kilometre twice.",
      "The route out and back is the same drive as the 2-Day Escape, but because it now brackets a full day rather than one, the driving feels far less like the point of the trip.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to the Mara',
        body: 'We leave Nairobi in the early morning and drive southwest through Narok to the reserve, arriving by early afternoon and checking into camp for lunch. The afternoon is a game drive along the river tree lines and open plains near camp, the stretch of the day when cats that have been lying up through the heat start to move again.',
      },
      {
        day: 2,
        title: 'Full day in the Mara',
        body: "This day is unstructured on purpose. We're out before sunrise for the morning drive, back at camp for lunch and a rest through the hot midday hours, then out again from mid-afternoon until the light goes. Where we drive depends on where the game has been the past few days — near the river for cat sightings, out onto the open plains if the migration herds are moving through, or toward the conservancies bordering the reserve for a quieter session.",
      },
      {
        day: 3,
        title: 'Morning drive and departure',
        body: 'A final early game drive before breakfast, then we pack up and start the drive back to Nairobi, timed to have you at your hotel or the airport by early evening.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle with a pop-up roof',
      'Two nights full-board accommodation at a tented camp in or bordering the Mara',
      'Four game drives, led by an English-speaking driver-guide',
      'Masai Mara reserve entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'Year-round, but late June through October is when the migration herds are most likely to be in or near the reserve, and January through March gives drier tracks and clear early light.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for standing game viewing. It may be shared with a small number of other guests on the same dates unless you request a private vehicle at booking, which we can usually arrange for a supplement.',
      },
      {
        q: 'Do I need to be fit for this trip?',
        a: 'No particular fitness is needed. You are seated in the vehicle for the drives, with the option to stand through the pop-up roof for photos; the only walking is between the vehicle and camp buildings, which are on level ground.',
      },
      {
        q: 'Is there a single supplement?',
        a: "Yes, if you're travelling alone and want your own tent rather than sharing. The per-person rate above assumes two people sharing a tent; ask us for the single rate when you enquire and we'll quote it against the specific camp you've chosen.",
      },
      {
        q: 'What happens if it rains during a game drive?',
        a: 'The vehicle has a roof and side flaps that come down, so drives continue in light rain; heavier storms sometimes cut a drive short if tracks become impassable. Rain in the Mara tends to be short and localised rather than an all-day event, and it rarely stops a full day of driving.',
      },
      {
        q: 'Will we see the migration?',
        a: 'Only if it happens to be in the area during your dates, and we never promise otherwise. The migration is a seasonal movement rather than a fixed schedule, roughly July through October in most years, and even then a river crossing can happen at any hour or on any day within that window.',
      },
    ],
    signature: false,
  },
  {
    title: '4-Day Masai Mara & Lake Nakuru',
    slug: '4-day-masai-mara-lake-nakuru',
    days: 4,
    nights: 3,
    category: 'Masai Mara & Rift Valley',
    destinations: ['masai-mara'],
    priceKey: 'mara-nakuru4',
    hero: '/assets/p01.jpg',
    heroAlt: 'A zebra drinking from a muddy waterhole with grazing zebra in the grass behind',
    summary:
      'Pairs a night at Lake Nakuru, in the Rift Valley, with two full days in the Mara, giving you rhino and flamingos on the way in and cat country to finish.',
    overview: [
      "This itinerary breaks the drive to the Mara into two shorter legs by routing through Lake Nakuru National Park, which sits inside the Rift Valley escarpment roughly three hours from Nairobi. It's a fenced park with its own black and white rhino, and depending on rainfall and lake levels, flamingos along the shallows in varying numbers.",
      'From Nakuru we continue on to the Mara for two full days, which is where this itinerary puts its weight: the rhino and lake stop is a strong addition on the way through, but the Mara days are built the same way as our 3-Day Classic, with a proper midday break at camp between drives.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Lake Nakuru',
        body: 'We leave Nairobi in the morning and climb up over the Rift Valley escarpment, with a stop at one of the viewpoints along the way before dropping down to Nakuru town and into the park. The afternoon is a game drive around the lake shore and acacia woodland, looking for both black and white rhino, buffalo and, lake levels permitting, flamingo.',
      },
      {
        day: 2,
        title: 'Nakuru to the Mara',
        body: "A short morning drive to close out our time at Nakuru, then we head southwest through Narok to reach the Mara reserve by mid-afternoon. We go straight into an afternoon game drive on arrival rather than waiting until the next morning, since there's still good light left in the day.",
      },
      {
        day: 3,
        title: 'Full day in the Mara',
        body: 'A complete day inside the reserve: an early morning drive, a break at camp through the heat, and an afternoon session that runs until the light fades. This is the day I keep flexible, moving between the river tree lines, the open plains and the conservancy edges depending on where sightings have been building.',
      },
      {
        day: 4,
        title: 'Morning drive and departure',
        body: 'One last early game drive before breakfast, then the drive back to Nairobi, arriving by early evening.',
      },
    ],
    included: [
      'Ground transport throughout in a 4x4 safari vehicle with a pop-up roof',
      'Three nights full-board accommodation: one at Lake Nakuru, two in or bordering the Mara',
      'Six game drives, led by an English-speaking driver-guide',
      'Lake Nakuru and Masai Mara park and reserve entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'Lake Nakuru is a year-round park with no strong seasonal draw beyond lake levels; for the Mara leg, late June through October brings the best odds on the migration, while January through March is drier and quieter.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof, used for all four days including the drive between parks. It may be shared with other guests on the same route unless a private vehicle is requested at booking.',
      },
      {
        q: 'Are park fees included for both parks?',
        a: 'Yes, both Lake Nakuru and Masai Mara entry fees are built into the price for the days you spend inside each. Anything outside the two parks, such as a Kenya entry visa, is not included.',
      },
      {
        q: 'Will we see the migration on this trip?',
        a: "Only if it's in the reserve during your travel dates. The migration follows rainfall and grazing rather than a calendar, so we treat any river crossing as a bonus rather than something we can schedule around your two Mara days.",
      },
      {
        q: 'Is this a lot of driving?',
        a: "There's more road time than a Mara-only trip, since Nakuru adds a leg, but splitting the journey into Nairobi–Nakuru and Nakuru–Mara keeps each individual drive shorter than the direct run, and neither day is purely a travel day — both include a game drive.",
      },
    ],
    signature: false,
  },
  {
    title: '5-Day Mara, Nakuru & Naivasha',
    slug: '5-day-mara-nakuru-naivasha',
    days: 5,
    nights: 4,
    category: 'Masai Mara & Rift Valley',
    destinations: ['masai-mara'],
    priceKey: 'mara-nakuru-naivasha5',
    hero: '/assets/p13.jpg',
    heroAlt: 'A kudu bull with tall spiralled horns looking through green bush foliage toward the camera',
    summary:
      'Adds a slower first day on Lake Naivasha, boating and walking rather than game-driving, ahead of Nakuru and two full days in the Mara.',
    overview: [
      "This is a good route for guests who want the Rift Valley lakes to be more than a drive-through stop. We start at Lake Naivasha, less than two hours from Nairobi, where the pace for a few hours is boat and foot rather than vehicle: a ride out on the water among hippo and fish eagle, and for those who want it, a walk among giraffe, zebra and waterbuck on Crescent Island, where there are no predators to keep you in the car.",
      'From Naivasha we move on to Lake Nakuru for its rhino and lake-shore game drives, then continue to the Mara for two full days, following the same rhythm as our other Mara itineraries: an early drive, a rest through the heat, and an afternoon session.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Lake Naivasha',
        body: "A short morning drive down into the Rift Valley to Lake Naivasha, where the afternoon is spent on and around the water rather than in the vehicle: a boat trip along the shoreline for hippo and birdlife, and time on foot on Crescent Island among giraffe, zebra, waterbuck and eland, none of which share the island with predators.",
      },
      {
        day: 2,
        title: 'Naivasha to Lake Nakuru',
        body: 'A short drive on to Lake Nakuru National Park, arriving in time for an afternoon game drive around the lake shore and acacia woodland, looking for both black and white rhino, buffalo and the flamingo that gather along the shallows when lake levels allow.',
      },
      {
        day: 3,
        title: 'Nakuru to the Mara',
        body: 'We finish our time at Nakuru with a short morning drive, then head southwest through Narok to reach the Mara by mid-afternoon, going straight into an afternoon game drive on arrival.',
      },
      {
        day: 4,
        title: 'Full day in the Mara',
        body: 'A complete day inside the reserve, with an early drive, a break at camp through the hottest hours, and an afternoon session running until last light. Where exactly we drive depends on where sightings have concentrated over the preceding days.',
      },
      {
        day: 5,
        title: 'Morning drive and departure',
        body: 'A final early game drive before breakfast, then the drive back to Nairobi, arriving in the early evening.',
      },
    ],
    included: [
      'Ground transport throughout in a 4x4 safari vehicle with a pop-up roof',
      'Four nights full-board accommodation: one at Naivasha, one at Nakuru, two in or bordering the Mara',
      'Boat ride and Crescent Island walk at Lake Naivasha',
      'Six game drives, led by an English-speaking driver-guide',
      'Lake Nakuru and Masai Mara park and reserve entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'The two Rift Valley lakes are good year-round; for the Mara leg, late June through October gives the best odds on the migration, and January through March is drier and quieter.',
    faqs: [
      {
        q: 'Is the Naivasha boat ride included, or an add-on?',
        a: 'Included, along with the Crescent Island walk. Both are built into the price for day one; no separate booking is needed once you confirm this itinerary.',
      },
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for the road days and game drives. The Naivasha boat is a separate small craft run by a local operator on the lake, not the safari vehicle.',
      },
      {
        q: 'How fit do I need to be for the Crescent Island walk?',
        a: 'Not very. It is flat ground with no technical walking, roughly ninety minutes at an easy pace, and you can shorten it if needed. There are no predators on the island, which is why walking is allowed there at all.',
      },
      {
        q: 'Will we see the migration in the Mara?',
        a: 'Only if it happens to be in the reserve on your dates. It is a seasonal movement rather than a fixed schedule, and we would rather be honest about that than promise a river crossing we cannot guarantee.',
      },
      {
        q: 'Is there a single supplement?',
        a: 'Yes. The price above is per person sharing a room or tent; travelling alone with your own room adds a supplement, which we can quote once we know which camps you have chosen at each stop.',
      },
    ],
    signature: false,
  },
  {
    title: '6-Day Mara, Nakuru & Amboseli',
    slug: '6-day-mara-nakuru-amboseli',
    days: 6,
    nights: 5,
    category: 'Masai Mara & Rift Valley',
    destinations: ['masai-mara', 'amboseli'],
    priceKey: 'mara-nakuru-amboseli6',
    hero: '/assets/p14.jpg',
    heroAlt: 'A maned lion resting low in green grass, glancing off to one side',
    summary:
      'Rift Valley, the Mara and Amboseli in one loop: rhino at Nakuru, cats in the Mara, then a light-aircraft transfer to elephant herds under Kilimanjaro.',
    overview: [
      "This itinerary covers three very different landscapes in six days, so I build it around one flight rather than trying to drive the whole loop. The first half is a familiar Rift Valley opening: Lake Nakuru for rhino and lake-shore game, then two full days in the Mara. There is no practical direct road between the Mara and Amboseli, so on the morning we leave the Mara we take a light aircraft back to Wilson Airport and straight on to Amboseli's own airstrip, landing in time for an afternoon game drive under Kilimanjaro the same day.",
      "Amboseli closes the trip at the foot of the mountain, with its swamps drawing elephant out into the open in family herds, a different kind of game viewing from the cat-focused days in the Mara.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Lake Nakuru',
        body: 'We leave Nairobi in the morning and climb over the Rift Valley escarpment to Lake Nakuru, arriving in time for an afternoon game drive around the lake shore and woodland, looking for black and white rhino, buffalo and flamingo.',
      },
      {
        day: 2,
        title: 'Nakuru to the Mara',
        body: 'A short morning drive to finish at Nakuru, then we head southwest through Narok to the Masai Mara, arriving by mid-afternoon and going straight into a game drive on arrival.',
      },
      {
        day: 3,
        title: 'Full day in the Mara',
        body: 'A complete day inside the reserve: an early drive, a rest at camp through the heat, and an afternoon session running until last light, with the route depending on where cats and plains game have been concentrating.',
      },
      {
        day: 4,
        title: 'Mara to Amboseli by air',
        body: "An early game drive before breakfast, then we transfer to the nearest airstrip for a light-aircraft flight back to Wilson Airport and straight on to Amboseli, landing in the early afternoon. We check into camp and go straight out for a first game drive; the clearest view of the mountain itself will come the next morning, before cloud builds around the peak.",
      },
      {
        day: 5,
        title: 'Full day in Amboseli',
        body: 'A day built around the swamps that draw elephant herds out into open ground to drink and graze, often for hours at a stretch. We work the swamp edges in the morning and again in the late afternoon, when the light is best for the classic view of elephant crossing the plain with the mountain behind them.',
      },
      {
        day: 6,
        title: 'Morning drive and return to Nairobi',
        body: 'A final early game drive, then breakfast and the drive back to Nairobi, roughly four hours via Namanga or Emali, arriving in time for an onward flight.',
      },
    ],
    included: [
      'Ground transport in a 4x4 safari vehicle with a pop-up roof for the Nakuru and Mara legs, and for Amboseli',
      'One light-aircraft flight from the Mara to Amboseli via Wilson Airport',
      'Five nights full-board accommodation: one at Nakuru, two in or bordering the Mara, two at Amboseli',
      'Eight game drives, led by an English-speaking driver-guide',
      'Lake Nakuru, Masai Mara and Amboseli park and reserve entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through February give the driest conditions at Nakuru and in the Mara; the same months also bring the clearest early-morning Kilimanjaro views over Amboseli, before cloud builds around the peak later in the day. Late June through October also carries the best odds on the migration.',
    faqs: [
      {
        q: 'Why is there a flight in this itinerary rather than driving throughout?',
        a: "There is no reasonable direct road between the Mara and Amboseli, so linking the two by road would cost most of a day on rough tracks. The light-aircraft transfer takes under two hours in total including the stop at Wilson Airport, which is why we build it into this route rather than dropping one of the two parks.",
      },
      {
        q: 'Are park fees and the flight included in the price?',
        a: 'Yes. The flight, and entry fees for all three parks on the days you visit them, are built into the price above. Only items outside the itinerary, such as your international flight into Kenya, are excluded.',
      },
      {
        q: 'Is luggage limited on the light-aircraft leg?',
        a: 'Yes, light aircraft operating into bush airstrips typically limit checked luggage to around 15 kg per person in a soft-sided bag, with no rigid suitcases. We flag this at booking so you can pack accordingly for this itinerary.',
      },
      {
        q: 'Will we definitely see the migration in the Mara section?',
        a: "We can't promise a crossing on a given day, since the migration follows grazing and rainfall rather than a fixed schedule. What this itinerary does guarantee is two full days in the reserve, which gives a strong chance at resident lion, cheetah and the general plains game even outside migration season.",
      },
    ],
    signature: false,
  },
  {
    title: '7-Day Best of Kenya',
    slug: '7-day-best-of-kenya',
    days: 7,
    nights: 6,
    category: 'Masai Mara & Rift Valley',
    destinations: ['masai-mara', 'amboseli'],
    priceKey: 'best-of-kenya7',
    hero: '/assets/p15.jpg',
    heroAlt: 'A lioness standing on a termite mound in golden grass, looking directly at the camera',
    summary:
      'Our full circuit: Naivasha, Nakuru, two days in the Mara and two in Amboseli, linked by one internal flight, covering lakes, cats and elephant in a week.',
    overview: [
      'This is the longest of our Rift Valley and Mara routes and the one that tries to show the most ground without turning into a week of driving. It opens gently, with a half-day on the water at Lake Naivasha rather than a straight game drive, then moves through Lake Nakuru for rhino and flamingo, into two full days in the Mara, and finally to Amboseli for two days under Kilimanjaro, linked by a short light-aircraft flight since there is no practical road between the Mara and Amboseli.',
      "Seven days gives real breathing room at each stop: nobody in this itinerary is spending a whole day purely in transit without also getting a game drive or another activity out of it.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Lake Naivasha',
        body: 'A short morning drive down into the Rift Valley to Lake Naivasha, where the afternoon is a boat ride along the shoreline among hippo and fish eagle, followed by a walk on Crescent Island among giraffe, zebra and waterbuck, none of which share the island with predators.',
      },
      {
        day: 2,
        title: 'Naivasha to Lake Nakuru',
        body: 'A short drive on to Lake Nakuru National Park for an afternoon game drive around the lake shore and acacia woodland, looking for black and white rhino, buffalo and, lake levels permitting, flamingo along the shallows.',
      },
      {
        day: 3,
        title: 'Nakuru to the Mara',
        body: 'A short morning drive to finish at Nakuru, then southwest through Narok to reach the Masai Mara by mid-afternoon, going straight into a game drive on arrival.',
      },
      {
        day: 4,
        title: 'Full day in the Mara',
        body: 'A complete day inside the reserve, with an early drive, a rest at camp through the heat, and an afternoon session running until last light. Where we drive depends on where sightings have concentrated over the preceding days, near the river for cats or out on the open plains if migration herds are moving through.',
      },
      {
        day: 5,
        title: 'Mara to Amboseli by air',
        body: 'A final early game drive in the Mara before breakfast, then a transfer to the airstrip for a light-aircraft flight back to Wilson Airport and on to Amboseli, landing in the early afternoon in time for a first game drive under Kilimanjaro.',
      },
      {
        day: 6,
        title: 'Full day in Amboseli',
        body: 'A day built around the swamps that pull elephant herds into the open to drink and graze, often for hours at a time. We work the swamp edges early, while Kilimanjaro is still clear of the cloud that builds around the peak as the day warms, and return again in the late afternoon for a second session.',
      },
      {
        day: 7,
        title: 'Morning drive and return to Nairobi',
        body: 'A last early game drive, then breakfast and the drive back to Nairobi, roughly four hours via Namanga or Emali, arriving in good time for an onward flight or overnight in the city.',
      },
    ],
    included: [
      'Ground transport in a 4x4 safari vehicle with a pop-up roof for the Naivasha, Nakuru, Mara and Amboseli legs',
      'One light-aircraft flight from the Mara to Amboseli via Wilson Airport',
      'Boat ride and Crescent Island walk at Lake Naivasha',
      'Six nights full-board accommodation: one at Naivasha, one at Nakuru, two in or bordering the Mara, two at Amboseli',
      'Ten game drives, led by an English-speaking driver-guide',
      'Lake Nakuru, Masai Mara and Amboseli park and reserve entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through February give the driest conditions across all four stops; the same months also bring the clearest early-morning Kilimanjaro views over Amboseli, before cloud builds around the peak later in the day. Late June through October also carries the best odds on the Mara migration.',
    faqs: [
      {
        q: 'Is this itinerary suitable for a first trip to Kenya?',
        a: "Yes, it's the route I recommend most often for a first visit, since it covers the Rift Valley lakes, the Mara and Amboseli without any single day being pure transit. Each travel day still includes a game drive or another activity at the far end.",
      },
      {
        q: 'What vehicle do we travel in, and is it private?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for every road leg. It can be private to your group or shared with other guests travelling the same dates; let us know your preference at booking.',
      },
      {
        q: 'Are park fees and the internal flight included?',
        a: 'Yes, both are built into the price above, along with all listed accommodation and game drives. What is not included is your international flight into and out of Kenya.',
      },
      {
        q: 'Will we see the wildebeest migration?',
        a: 'Only if it is in the Mara during your travel dates. The migration follows rainfall and grazing rather than a fixed calendar, so we treat any crossing you witness as a bonus on top of two full days of game driving, not something we can schedule.',
      },
      {
        q: 'Is there a single supplement, and can the itinerary be shortened?',
        a: 'A single supplement applies if you want your own room or tent rather than sharing; we quote it against the specific camps once chosen. The itinerary can also be trimmed, most often by dropping the Naivasha day, if seven days is more than you have available.',
      },
    ],
    signature: false,
  },
  {
    title: '3-Day Amboseli Under Kilimanjaro',
    slug: '3-day-amboseli-under-kilimanjaro',
    days: 3,
    nights: 2,
    category: 'Amboseli & Tsavo',
    destinations: ['amboseli'],
    priceKey: 'amboseli3',
    hero: '/assets/p14.jpg',
    heroAlt: 'A maned lion resting low in green grass, glancing off to one side',
    summary:
      'Three days at the foot of Kilimanjaro, built around the two windows when elephant herds move onto open ground and the mountain is clearest of cloud.',
    overview: [
      "Amboseli rewards a short stay better than almost anywhere else on the safari circuit, because the two things that make it worth visiting — the swamp-fed elephant herds and the view of Kilimanjaro across the border — both show best in short windows either side of the heat of the day. Three days gives us two full mornings and two full afternoons inside the park, without a long first or last day eaten up by road.",
      'We drive south from Nairobi via Namanga or Emali, a run of about four hours that puts you into camp in time for lunch on the first day. From there the itinerary is built around the swamp edges, where elephant come out of the acacia to drink and graze often for hours at a stretch, and around the early morning light, when the mountain is most likely to be clear of the cloud that gathers around the peak as the day warms.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Amboseli',
        body: 'We leave Nairobi in the morning and drive south via Namanga or Emali, roughly four hours to the park gate, arriving in time for lunch at camp. The afternoon is a first game drive along the swamp edges, an easy introduction to the open, dusty plains that make Amboseli such forgiving country for game viewing.',
      },
      {
        day: 2,
        title: 'Full day among the swamps',
        body: 'A day built entirely around the permanent swamps that draw elephant herds out into open ground. We are out before the light softens the mountain into cloud, working the swamp margins for elephant, buffalo and the plains game that gather at the water, then return to camp through the heat of the day before a second session in the late afternoon, when the herds move again.',
      },
      {
        day: 3,
        title: 'Final drive and departure',
        body: 'One more early game drive while the mountain is still clear, then breakfast, check-out and the drive back to Nairobi, arriving by early afternoon.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle with a pop-up roof',
      'Two nights full-board accommodation at a camp or lodge in or bordering Amboseli',
      'Four game drives, led by an English-speaking driver-guide',
      'Amboseli National Park entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through February give the driest ground and the clearest early-morning views of Kilimanjaro, before cloud builds around the peak later in the day.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for standing game viewing. It may be shared with other guests travelling the same dates unless you request a private vehicle at booking.',
      },
      {
        q: 'Is Kilimanjaro visible every day?',
        a: "Not guaranteed. The mountain sits across the border in Tanzania and is often wrapped in cloud by mid-morning, so the clearest views tend to come at first light. We build the schedule around early starts for this reason, but a clear summit on any given day is weather, not something we control.",
      },
      {
        q: 'Are park fees included?',
        a: 'Yes, Amboseli entry fees for both days inside the park are built into the price. Fees outside the park, such as a Kenya entry visa, are not included.',
      },
      {
        q: 'How much walking is involved?',
        a: 'None beyond short distances between the vehicle and camp buildings, both on level ground. All game viewing here is done from the vehicle.',
      },
    ],
    signature: false,
  },
  {
    title: '2-Day Tsavo East',
    slug: '2-day-tsavo-east',
    days: 2,
    nights: 1,
    category: 'Amboseli & Tsavo',
    destinations: ['tsavo'],
    priceKey: 'tsavo2',
    hero: '/assets/p10.jpg',
    heroAlt: 'Two elephants wading across a muddy river lined with doum palms',
    summary:
      "A short first look at Tsavo East's wide red-dust plains: one afternoon and one morning game drive either side of a night in camp.",
    overview: [
      "Tsavo East is the wider, flatter half of Kenya's largest protected area, open plains of red volcanic soil running to a low horizon. Two days is enough to get a proper look at it without committing a full week to the journey down from Nairobi, and it works well either as a stop on the way to the coast or as a short break on its own.",
      "The road down passes through the same corridor as the railway and highway to Mombasa, so getting here is straightforward. Once inside the park, the schedule is built around the two clearest light windows, an afternoon drive on arrival and a full morning before you leave, since a single night doesn't allow for the midday rest that longer stays build in.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Tsavo East',
        body: "We drive southeast from Nairobi, joining the Mombasa highway and turning off at the park gate after around four to five hours on the road. After lunch at camp we head straight into an afternoon game drive across the open plains, where the red dust that dyes the elephants' hides rust-coloured is the first thing most guests notice.",
      },
      {
        day: 2,
        title: 'Morning drive and the road home',
        body: 'An early game drive while the light is still low and soft, working the plains and the Galana River for elephant, lion and the fringe-eared oryx particular to this dry country. We return to camp for a late breakfast, then start the drive back to Nairobi or on to the coast, depending on your onward plans.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle with a pop-up roof',
      'One night full-board accommodation at a camp or lodge in or bordering Tsavo East',
      'Two game drives, led by an English-speaking driver-guide',
      'Tsavo East National Park entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through February are driest, when animals concentrate around the Galana River and remaining waterholes rather than spreading across the plains.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for standing game viewing. It may be shared with other guests travelling the same dates unless you request a private vehicle at booking.',
      },
      {
        q: 'Can this trip be combined with a coast extension?',
        a: "Yes, that's one of the most common ways we run it. Tsavo sits directly beside the Nairobi–Mombasa highway, so from here it's a straightforward continuation to Diani or another coast stop rather than a detour.",
      },
      {
        q: 'Are park fees included?',
        a: 'Yes, Tsavo East entry fees for both days are built into the price. Fees outside the park are not included.',
      },
      {
        q: 'Is one night enough to see much?',
        a: "It's honest to say two game drives is a short visit for a park this size. What you get is a genuine introduction to Tsavo's red-dust country and its elephant herds; for a fuller picture of both Tsavo East and Tsavo West, the 3-Day Tsavo East & Tsavo West itinerary gives considerably more time inside the park.",
      },
    ],
    signature: false,
  },
  {
    title: '3-Day Tsavo East & Tsavo West',
    slug: '3-day-tsavo-east-tsavo-west',
    days: 3,
    nights: 2,
    category: 'Amboseli & Tsavo',
    destinations: ['tsavo'],
    priceKey: 'tsavo3',
    hero: '/assets/p11.jpg',
    heroAlt: 'A topi antelope standing over a resting calf in golden grassland, hills hazy behind',
    summary:
      'A fuller look at both halves of Tsavo: red-dust plains in the east, broken hill country and Mzima Springs in the west.',
    overview: [
      'Three days gives us room to see both parks properly rather than treating one as a drive-through on the way to the other. Tsavo East is wide and flat, red-dust plains that stretch to a low horizon; Tsavo West, across the highway and railway line, is broken country of old lava flows, hills and denser bush, a genuinely different landscape only a short drive away.',
      'The centrepiece of the western half is Mzima Springs, a series of clear pools fed by water filtering down from the Chyulu Hills, with an underwater viewing chamber that puts you at eye level with hippo and crocodile in water clear enough to see the fish moving around them. We build a stop here into the second full day, alongside the more usual game driving.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Tsavo East',
        body: 'We drive southeast on the Mombasa highway to the Tsavo East gate, arriving by early afternoon and settling into camp for lunch. The afternoon is a first game drive across the open red-dust plains, watching for elephant, lion and the Galana River\'s resident hippo and crocodile.',
      },
      {
        day: 2,
        title: 'Tsavo East to Tsavo West, via Mzima Springs',
        body: 'A final morning drive in Tsavo East, then we cross to Tsavo West, a shorter transfer than it looks on the map since the two parks share a boundary. We build in time at Mzima Springs, walking down to the underwater viewing chamber for a close look at hippo and crocodile in the clear spring water, before an afternoon game drive through the park\'s hillier, more broken country.',
      },
      {
        day: 3,
        title: 'Morning drive and departure',
        body: 'A last early game drive around the lava flows and acacia bush of Tsavo West, then breakfast, check-out and the drive back to Nairobi or onward to the coast.',
      },
    ],
    included: [
      'Ground transport throughout in a 4x4 safari vehicle with a pop-up roof',
      'Two nights full-board accommodation: one in or bordering Tsavo East, one in or bordering Tsavo West',
      'Four game drives, led by an English-speaking driver-guide',
      'Guided visit to the Mzima Springs underwater viewing chamber',
      'Tsavo East and Tsavo West National Park entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through February, when dry conditions concentrate wildlife around the Galana River in the east and Mzima Springs in the west.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for standing game viewing, used for the drive between parks as well as the game drives themselves.',
      },
      {
        q: 'Is Mzima Springs included or an extra booking?',
        a: 'Included. The underwater viewing chamber is a short walk from the parking area with a ranger escort, since hippo and buffalo also use the springs; there is no separate ticket to arrange.',
      },
      {
        q: 'How much driving is involved between the two parks?',
        a: "Less than the map suggests. Tsavo East and Tsavo West share a boundary near Mtito Andei, so the transfer on day two is closer to an hour than a full travel day, and it's built around the Mzima Springs stop rather than being dead road time.",
      },
      {
        q: 'Are park fees for both parks included?',
        a: 'Yes, entry fees for both Tsavo East and Tsavo West are built into the price for the days you spend inside each.',
      },
    ],
    signature: false,
  },
  {
    title: '4-Day Tsavo & Amboseli',
    slug: '4-day-tsavo-amboseli',
    days: 4,
    nights: 3,
    category: 'Amboseli & Tsavo',
    destinations: ['tsavo', 'amboseli'],
    priceKey: 'tsavo-amboseli4',
    hero: '/assets/p05.jpg',
    heroAlt: 'A lion resting atop a sunlit granite rock, blue sky and bush behind',
    summary:
      "Links Tsavo's red-dust elephant country with Amboseli's swamps and Kilimanjaro views, on a single road route south of Nairobi.",
    overview: [
      "Tsavo and Amboseli sit close enough together, both south of Nairobi and not far from the Tanzanian border, that linking them by road is a natural itinerary rather than a stretch. Four days lets us give each park a genuine stay rather than a single overnight, with Tsavo's open plains and red-dust elephants first, then Amboseli's swamp country and the Kilimanjaro backdrop to close the trip.",
      "The two parks make an interesting pair precisely because they don't look alike: Tsavo is wide, dry and rust-coloured underfoot, while Amboseli's permanent swamps keep a green core inside otherwise dusty country. Coming from Tsavo, that contrast is part of the point of the itinerary, not just the wildlife.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Tsavo East',
        body: 'We drive southeast on the Mombasa highway to Tsavo East, arriving by early afternoon for lunch at camp, then head out for an afternoon game drive across the open plains.',
      },
      {
        day: 2,
        title: 'Full day in Tsavo East',
        body: 'A complete day inside the park: an early drive while the light is soft, a rest at camp through the heat, and an afternoon session along the Galana River and out onto the plains, watching for elephant, lion and the fringe-eared oryx found in this dry country.',
      },
      {
        day: 3,
        title: 'Tsavo to Amboseli',
        body: 'We leave Tsavo after an early game drive and cross west toward Amboseli, a drive of several hours that we break with a stop along the way. We arrive in the early afternoon and go straight into a first game drive along the swamp edges before evening.',
      },
      {
        day: 4,
        title: 'Morning in Amboseli and departure',
        body: 'An early game drive while the mountain is most likely to be clear of cloud, working the swamp margins for elephant and the wider plains game, then breakfast and the drive back to Nairobi via Namanga or Emali.',
      },
    ],
    included: [
      'Ground transport throughout in a 4x4 safari vehicle with a pop-up roof',
      'Three nights full-board accommodation: two in or bordering Tsavo East, one in or bordering Amboseli',
      'Six game drives, led by an English-speaking driver-guide',
      'Tsavo East and Amboseli National Park entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through February give the driest conditions in both parks and the clearest early-morning views of Kilimanjaro over Amboseli.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof, used throughout including the road leg between the two parks.',
      },
      {
        q: 'Is there a lot of driving between the two parks?',
        a: "There's a genuine cross-country leg on day three, several hours on the road since Tsavo and Amboseli sit on different sides of the Chyulu Hills. We break it with a stop rather than driving straight through, and the day still ends with a game drive rather than being pure transit.",
      },
      {
        q: 'Are park fees for both parks included?',
        a: 'Yes, entry fees for Tsavo East and Amboseli are both built into the price above.',
      },
      {
        q: 'Will Kilimanjaro be visible?',
        a: "Not guaranteed on any single day, since the mountain sits across the border and is often in cloud by mid-morning. The clearest views tend to come at first light, which is why the Amboseli morning on day four is built around an early start.",
      },
    ],
    signature: false,
  },
  {
    title: '3-Day Samburu Special Five',
    slug: '3-day-samburu-special-five',
    days: 3,
    nights: 2,
    category: 'Laikipia & the North',
    destinations: ['samburu'],
    priceKey: 'samburu3',
    hero: '/assets/kudu.jpg',
    heroAlt: 'A greater kudu bull with tall spiralled horns standing in dry bush',
    summary:
      'Three days built around Samburu\'s dry-country specialities, the animals rarely seen on the southern circuit, along the Ewaso Ng\'iro river.',
    overview: [
      "Samburu runs on a different rhythm from the parks further south, dry acacia and doum palm country where almost everything depends on the Ewaso Ng'iro river at some point in the day. Three days gives us two full days inside the reserve, enough time to work the riverine strip properly rather than treating it as a single afternoon stop.",
      "The reserve is known for what guides here sometimes call the Special Five: Grevy's zebra, reticulated giraffe, Beisa oryx, gerenuk and Somali ostrich, none of them found on the Mara or Amboseli circuits further south. My own routes through the northern frontier, out through Sarara Camp and Saruni Kalama in the Mathews Range, run through this same dry country, and it's ground I keep coming back to for exactly that contrast.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Samburu',
        body: 'We drive north via Nanyuki and Isiolo, five to six hours crossing the equator on the way, arriving at the reserve in the early afternoon. After lunch at camp we head straight into a first game drive along the river, watching for the dry-country species that set Samburu apart from parks further south.',
      },
      {
        day: 2,
        title: "Full day along the Ewaso Ng'iro",
        body: 'A complete day working the river and the surrounding scrub: an early drive while the light is soft, a rest through the heat of the day, and a second drive in the late afternoon when animals move back toward the water. We keep an eye out through the day for the reserve\'s dry-country specialities, though which ones turn up, and how many, varies day to day.',
      },
      {
        day: 3,
        title: 'Morning drive and departure',
        body: 'A final early game drive along the river before breakfast, then the drive back south to Nairobi, arriving by early evening.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle with a pop-up roof',
      'Two nights full-board accommodation at a camp in or bordering Samburu National Reserve',
      'Four game drives, led by an English-speaking driver-guide',
      'Samburu National Reserve entry fees',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through March are driest and best for game along the river; the short rains from November green the country and can make some tracks harder going.',
    faqs: [
      {
        q: 'What is the Special Five?',
        a: "A local shorthand for five species found in this dry northern country and not on the southern safari circuit: Grevy's zebra, reticulated giraffe, Beisa oryx, gerenuk and Somali ostrich. We look for all five across the two full days, but as with any wild sighting, we can't promise every one will show.",
      },
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for standing game viewing. It may be shared with other guests travelling the same dates unless you request a private vehicle at booking.',
      },
      {
        q: 'How much driving is involved to reach Samburu?',
        a: "It's a genuine day of driving each way, five to six hours via Nanyuki and Isiolo, so this itinerary suits guests who want to commit properly to the north rather than treat it as a quick add-on. Combining it with an Ol Pejeta stop, as in our 4-Day Samburu & Ol Pejeta itinerary, is a common way to make the drive north work harder.",
      },
      {
        q: 'Is Samburu quieter than the Mara?',
        a: 'Generally yes. Vehicle numbers at a sighting are typically lower here than in the Mara, and the terrain and species are different enough that it rarely feels repetitive if you have already done a southern-circuit safari.',
      },
    ],
    signature: false,
  },
  {
    title: '2-Day Ol Pejeta Rhino Safari',
    slug: '2-day-ol-pejeta-rhino-safari',
    days: 2,
    nights: 1,
    category: 'Laikipia & the North',
    destinations: ['ol-pejeta'],
    priceKey: 'olpejeta2',
    hero: '/assets/p08.jpg',
    heroAlt: "Close-up of a rhino's head and horn lit by low golden sunlight in tall grass",
    summary:
      'A short, focused visit to East Africa\'s largest black rhino sanctuary, with the chimpanzee sanctuary and the last two northern white rhino.',
    overview: [
      "Ol Pejeta is a fenced, privately run conservancy in Laikipia, built specifically around rhino security, and two days is enough to see what makes it different from an open reserve. Round-the-clock ranger patrols protect the largest black rhino population in East Africa here, and the conservancy is also home to the world's last two northern white rhino, kept under permanent guard.",
      "Because the boundary is fenced, Ol Pejeta can run big predators alongside the rhino without the usual conflict with the livestock country that surrounds it, so game drives here cover lion and elephant as well as rhino. The itinerary also builds in a stop at the chimpanzee sanctuary, home to chimps rescued from the illegal pet and bushmeat trade elsewhere in Africa.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Ol Pejeta',
        body: "We drive north via Nanyuki, around three hours, arriving at the conservancy in time for lunch. The afternoon is a first game drive focused on rhino, working the open grassland where Ol Pejeta's black rhino and the two northern white rhino are most often found.",
      },
      {
        day: 2,
        title: 'Morning drive and chimpanzee sanctuary',
        body: 'An early game drive while the light is still low, working the grassland for rhino and the conservancy\'s other resident game, then breakfast and a visit to the chimpanzee sanctuary before we start the drive back to Nairobi.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle with a pop-up roof',
      'One night full-board accommodation at a camp or lodge within Ol Pejeta Conservancy',
      'Two game drives, led by an English-speaking driver-guide',
      'Ol Pejeta Conservancy entry fees and chimpanzee sanctuary visit',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'Visitable year-round; June through October and January through February give the easiest driving and clearest views.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof for standing game viewing. It may be shared with other guests travelling the same dates unless you request a private vehicle at booking.',
      },
      {
        q: 'Are we guaranteed to see rhino?',
        a: 'No sighting on safari is ever guaranteed, but Ol Pejeta gives you some of the best odds anywhere in Kenya for rhino specifically, since it holds the largest black rhino population in East Africa within a fenced, closely monitored area. Two game drives inside the conservancy give a strong chance, without it being a certainty.',
      },
      {
        q: 'Is the chimpanzee sanctuary included or a separate booking?',
        a: 'Included. It is run by a different organisation from the conservancy itself, so a small portion of the fee supports the sanctuary directly, but there is nothing extra for you to arrange; we build the visit and its fee into the itinerary.',
      },
      {
        q: 'Is there a single supplement?',
        a: 'Yes, if travelling alone and preferring your own room rather than sharing. The per-person price above assumes two people sharing, and we quote the supplement once we know the specific lodge you have chosen.',
      },
    ],
    signature: false,
  },
  {
    title: '4-Day Samburu & Ol Pejeta',
    slug: '4-day-samburu-ol-pejeta',
    days: 4,
    nights: 3,
    category: 'Laikipia & the North',
    destinations: ['samburu', 'ol-pejeta'],
    priceKey: 'samburu-olpejeta4',
    hero: '/assets/giraffe.jpg',
    heroAlt: 'A giraffe silhouetted against an orange sunset, acacia trees on either side',
    summary:
      "Pairs two days in Samburu's dry-country specialities with two days at Ol Pejeta, the region's rhino sanctuary, on one northern loop.",
    overview: [
      "This itinerary links two of the north's strongest draws: Samburu's dry-country wildlife along the Ewaso Ng'iro river, and Ol Pejeta's rhino sanctuary a few hours south. Both sit within a day's drive of Nairobi via Nanyuki, so the route runs as a single loop north and back rather than needing a flight.",
      "The two stops complement each other well. Samburu's landscape and species, Grevy's zebra, reticulated giraffe and gerenuk among them, are found nowhere on the southern circuit; Ol Pejeta, fenced and closely managed, gives some of the strongest rhino viewing anywhere in Kenya alongside a visit to its chimpanzee sanctuary.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Samburu',
        body: 'We drive north via Nanyuki and Isiolo, crossing the equator along the way, arriving at the reserve in the early afternoon. After lunch we head into a first game drive along the river.',
      },
      {
        day: 2,
        title: 'Full day in Samburu',
        body: "A complete day working the river and surrounding scrub for the reserve's dry-country specialities: an early drive, a rest through the heat, and a second session in the late afternoon.",
      },
      {
        day: 3,
        title: 'Samburu to Ol Pejeta',
        body: "We leave Samburu after an early game drive and head south to Ol Pejeta, a drive of a few hours, arriving in time for lunch and an afternoon game drive focused on the conservancy's black rhino and its two northern white rhino.",
      },
      {
        day: 4,
        title: 'Chimpanzee sanctuary and return to Nairobi',
        body: 'An early game drive at Ol Pejeta, then breakfast and a visit to the chimpanzee sanctuary before we start the drive back to Nairobi, around three hours via Nanyuki.',
      },
    ],
    included: [
      'Ground transport throughout in a 4x4 safari vehicle with a pop-up roof',
      'Three nights full-board accommodation: two in or bordering Samburu, one within Ol Pejeta Conservancy',
      'Six game drives, led by an English-speaking driver-guide',
      'Samburu National Reserve and Ol Pejeta Conservancy entry fees, including the chimpanzee sanctuary visit',
      'Bottled water in the vehicle throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'June through October and January through March give the driest conditions across both stops and the easiest driving on the road between them.',
    faqs: [
      {
        q: 'What vehicle do we travel in?',
        a: 'A 4x4 safari Land Cruiser with a pop-up roof, used throughout including the road leg between the two stops.',
      },
      {
        q: 'How much driving links the two parks?',
        a: "A few hours on a reasonable road, considerably less than the drive north from Nairobi to Samburu itself. We treat day three as a travel day with a game drive at the end rather than pure transit.",
      },
      {
        q: 'Are we guaranteed rhino and the Samburu specialities?',
        a: 'No sighting is ever guaranteed. Ol Pejeta gives strong odds on rhino given how closely the population is monitored inside a fenced area, and two full days in Samburu give a good chance at several of the dry-country species, but which ones and how many varies day to day.',
      },
      {
        q: 'Is this itinerary suitable if we only have four days?',
        a: "Yes, it's built for exactly that: two genuinely different landscapes and wildlife sets without needing an internal flight, since both stops sit within a day's drive of Nairobi via Nanyuki.",
      },
    ],
    signature: false,
  },
  {
    title: '4-Day Borana & Lewa Conservation Safari',
    slug: '4-day-borana-lewa-conservation-safari',
    days: 4,
    nights: 3,
    category: 'Laikipia & the North',
    destinations: ['laikipia'],
    priceKey: 'borana-lewa4',
    hero: '/assets/p12.jpg',
    heroAlt: 'A rhino grazing in open grassland with cattle egrets around its feet and hills behind',
    summary:
      'Four days on the conservancies where I spent thirteen years guiding: rhino tracked on foot, day and night drives, a horseback safari and an anti-poaching patrol.',
    overview: [
      "Borana and Lewa are the ground I know better than anywhere else in Kenya. I spent seven years at Lewa Safari Camp, starting as a safari guide and working up to camp assistant manager and head guide, then two years at Sirikoi before six years at Borana itself as head of staff and head guide, until I stepped back into freelance guiding in 2024. This itinerary is built around the activities that make these two conservancies different from a standard reserve safari: rhino tracked on foot, drives that run after dark, and a horseback outing across open country most parks won't let you ride through.",
      "Both conservancies set their own vehicle limits and manage the land for livestock and wildlife side by side, which keeps them quieter than the southern circuit and gives room for activities a fenced national park doesn't allow. Over four days we track black rhino on foot with the anti-poaching team at first light, run a day drive and a night drive, spend a morning on horseback, and join rangers for an evening anti-poaching patrol — the same rhino and anti-poaching work I came to know closely over six years as head of staff and head guide at Borana.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Borana',
        body: "We drive north via Nanyuki, about three to four hours, arriving at Borana in time for lunch. The afternoon is a day game drive across the conservancy's open, rolling country, with Mount Kenya standing on the southern horizon on a clear afternoon.",
      },
      {
        day: 2,
        title: 'Rhino tracking on foot, and a night drive',
        body: "We are out at first light with Borana's anti-poaching team, tracking black rhino on foot from fresh sign — ground I came to know closely over six years as head of staff and head guide here. It's slow work with a genuinely high success rate, though I won't promise a sighting on any given day; what it does give you is time on the ground with the people whose job is protecting these animals. After a rest through the heat, we go back out after dark for a night game drive, spotlighting for the nocturnal side of the conservancy that a normal day drive never shows.",
      },
      {
        day: 3,
        title: 'Horseback safari and an anti-poaching patrol',
        body: "A morning on horseback across open grassland, riding among plains game in a way no vehicle allows, for guests who ride at an intermediate level or above. In the evening we join Borana's rangers for a stretch of their anti-poaching patrol, conservation work I got to know well over six years as head of staff here, and after dark, weather allowing, we take in the night sky over the conservancy, dark enough this far from any town to pick out the southern constellations clearly.",
      },
      {
        day: 4,
        title: 'Lewa and the road home',
        body: 'We cross to neighbouring Lewa for a final morning game drive, the conservancy where I spent seven years working from safari guide up to head guide, before breakfast and the drive back to Nairobi.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle',
      'Three nights full-board accommodation at a camp within Borana Conservancy',
      'Day and night game drives, led by an English-speaking driver-guide',
      'Guided rhino tracking on foot with the Borana anti-poaching team',
      'Horseback safari for intermediate and above riders',
      'Evening anti-poaching patrol with Borana rangers',
      'Borana and Lewa conservancy fees',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide, rangers and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      "Driest from June through October and January through March, though rainfall here is lighter than further south and the conservancies are comfortable to visit outside those months too. Night drives and the patrol depend on clear-enough weather and are subject to change if it's raining.",
    faqs: [
      {
        q: 'Is the rhino tracked on foot guaranteed?',
        a: "No, and I'd rather be straight about that than promise something I can't deliver. Tracking on foot from fresh sign at Borana has a genuinely high success rate in my experience, considerably higher than most people expect, but rhino move, and there are mornings the team tracks for hours without a sighting. What's guaranteed is time on the ground with the anti-poaching team and their tracking method, which is worth the morning on its own.",
      },
      {
        q: 'Do we need riding experience for the horseback safari?',
        a: "Yes, an intermediate level or above — comfortable at a walk, trot and controlled canter in open country, since this isn't a lead-rein outing. If you or anyone in your group hasn't ridden before, tell us at booking and we can swap that morning for an additional game drive instead.",
      },
      {
        q: 'What vehicle do we travel in, and is the night drive different?',
        a: 'A 4x4 safari vehicle with a pop-up roof for day drives; the night drive uses a spotlight worked by hand from the vehicle, which is only permitted in conservancies like Borana and not inside most national parks and reserves.',
      },
      {
        q: 'Is it safe to join an anti-poaching patrol?',
        a: "Yes, guests join a section of a routine patrol alongside armed rangers on their normal rounds, not an operation in progress. It's a working patrol rather than a demonstration, on foot for part of it, and gives an honest look at what conservation work actually involves day to day.",
      },
      {
        q: 'How fit do we need to be for rhino tracking?',
        a: 'A reasonable level of fitness for walking on uneven ground for a few hours, sometimes at a brisk pace if the team picks up fresh tracks. It is not technical walking, but it is more than a stroll, so flag any mobility concerns when you book.',
      },
    ],
    signature: true,
  },
  {
    title: '3-Day Laikipia Walking & Tracking Safari',
    slug: '3-day-laikipia-walking-tracking-safari',
    days: 3,
    nights: 2,
    category: 'Laikipia & the North',
    destinations: ['laikipia'],
    priceKey: 'laikipia-walking3',
    hero: '/assets/mukogodo.jpg',
    heroAlt: 'A figure in a red shawl standing on a rock outcrop above a wide valley at dawn',
    summary:
      "Three days on foot across Laikipia's conservancies, tracking game the way I learned to as a boy in the Mukogodo Forest.",
    overview: [
      "I grew up in the Mukogodo Forest, in northern Kenya, walking seven kilometres each way to primary school for eight years, and learning on that walk and on weekends as a herder boy to read the ground: when a hyena had new pups, when an aardvark had opened a fresh hole after termites, when buffalo had moved through overnight. That way of reading a landscape on foot is the whole basis of this itinerary. It has nothing to do with a vehicle's engine noise or a fixed route; it's slow, quiet, and it puts you close enough to sign and scent that you start to understand an animal's last few hours before you ever see it.",
      "Laikipia's conservancies, Borana and Lewa among them, are some of the few places in Kenya where walking safaris are routinely on offer, since the vehicle limits and lower predator density here make it workable in a way it isn't in the Mara or Amboseli. Three days is built around one full day on foot with an armed tracker alongside your guide, bracketed by a shorter orientation walk on arrival and a final morning walk before you leave, either side of the road transfers to and from Nairobi.",
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Laikipia',
        body: 'We drive north via Nanyuki, three to four hours, arriving in time for lunch. The afternoon is a short orientation walk near camp, an easy introduction to walking with an armed tracker before the fuller days ahead, followed by a game drive back as the light drops.',
      },
      {
        day: 2,
        title: 'Full day walking and tracking',
        body: 'A full day on foot, working game trails and drainage lines with an armed tracker and your guide, reading fresh sign the same way I learned to as a boy in the Mukogodo Forest: track age, browse lines, droppings, the small disturbances in the grass that say something passed through recently. We stop for a packed breakfast out on the ground rather than back at camp, and walk through the cooler hours of the morning before the heat sets in.',
      },
      {
        day: 3,
        title: 'Morning walk and departure',
        body: 'A final shorter walk at first light, then breakfast, check-out and the drive back to Nairobi, arriving by early afternoon.',
      },
    ],
    included: [
      'Ground transport from and to Nairobi in a 4x4 safari vehicle',
      'Two nights full-board accommodation at a camp within a Laikipia conservancy',
      'One full day walking, plus a shorter orientation walk and a final morning walk, all with an armed tracker and driver-guide',
      'One game drive',
      'Laikipia conservancy fees',
      'Bottled water throughout',
    ],
    excluded: [
      'International and domestic flights',
      'Kenya e-Visa or entry permit fees',
      'Tips and gratuities for your guide, tracker and camp staff',
      'Alcoholic drinks and items of a personal nature',
      'Travel insurance',
    ],
    bestTime:
      'Driest from June through October and January through March; walking is possible outside those months too, though wetter ground can slow the pace and change which trails are usable on a given day.',
    faqs: [
      {
        q: 'Do we need previous walking-safari experience?',
        a: 'No, though a reasonable level of fitness matters more here than on a vehicle-based trip, since day two is several hours on foot, mostly flat but occasionally over uneven ground. If anyone in your group has mobility concerns, tell us at booking and we can shorten the walking days and add a drive instead.',
      },
      {
        q: 'Is this safe, given some of the animals we might track?',
        a: "Every walk is led by an armed, licensed tracker alongside your guide, and the approach is built around distance and wind direction, not proximity. We don't push in close on dangerous game on foot; the point is reading sign and understanding behaviour, and a sighting at a safe distance is treated as a good outcome, not a disappointment.",
      },
      {
        q: 'Will we definitely track something on a given walk?',
        a: "No, and I wouldn't want to promise that. Some mornings the sign is fresh and easy to follow to an animal; other mornings you learn as much from a trail that goes cold as from one that doesn't. Either way you come away reading the ground differently than when you started.",
      },
      {
        q: "What's the difference between this and the Borana & Lewa Conservation Safari?",
        a: 'That itinerary is built around rhino tracking specifically, plus night drives and a horseback outing, with one full day of walking. This one is built around walking itself: the same one full day, bracketed by two shorter walks rather than a night drive and a ride, general tracking rather than rhino-focused, and suited to guests who want walking to be the central activity of the trip rather than one element among several.',
      },
      {
        q: 'What should we wear or bring?',
        a: "Sturdy closed walking shoes, neutral-coloured clothing, a hat and sun protection. Camps provide water for the walk itself; anything else personal, we'll cover in a checklist once you book.",
      },
    ],
    signature: true,
  },
];

export default packages;
