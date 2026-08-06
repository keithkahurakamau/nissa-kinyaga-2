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
];

export default packages;
