// Optional add-on experiences offered alongside the safaris.
//
// VOICE RULE. Nissa does not fly the balloons. Balloon safaris in Kenya are
// run by separately licensed balloon companies with their own pilots,
// aircraft and civil aviation approval, and we book a seat with them on your
// behalf. Every line here is written that way, the same operator voice the
// nine data/journeys.js countries use, and for the same reason: claiming to
// operate something we broker would be a false statement about who is
// responsible for your safety in the air.
//
// FACTS. Everything stated below is general and checkable, no numbers we
// cannot support. Deliberately absent: prices (removed sitewide, see commit
// 167defe), flight durations given to the minute, weight or age limits, and
// any named balloon company, since which operator we book depends on the
// camp and the date.

export const balloonSafari = {
  id: 'balloon',
  name: 'Hot air balloon safari',
  hero: '/assets/balloon-01.jpg',
  heroAlt:
    'A balloon burner firing into the open mouth of an envelope before dawn, crew silhouetted below',
  summary:
    'A dawn flight over the plains, then breakfast where the balloon sets down. The single most requested add-on to a Kenya safari, and the one worth setting an early alarm for.',

  // Shared across both parks.
  howItWorks: [
    'You are collected from camp in the dark and driven to the launch site, arriving while the crew are still inflating the envelope. Take-off is at first light, which is the whole point: the air is calmest then, and the low sun puts long shadows behind everything below you.',
    'The flight runs roughly an hour, drifting with whatever wind there is rather than steering, so no two flights follow the same line. Height varies through the flight, from just above the treetops to a few hundred metres up.',
    'Where the balloon lands, the ground crew are already setting up breakfast, cooked in the open and eaten at the landing site before you are driven back to camp. Most guests are back in time for the rest of the morning.',
  ],

  // Per-park detail. Keys match data/destinations.js slugs.
  parks: {
    'masai-mara': {
      label: 'Over the Masai Mara',
      body:
        'The Mara is where balloon safaris in Kenya started and it remains the classic flight: open plains, the river courses picked out by their tree lines, and game visible below in a way no vehicle can show you. Between roughly July and October, when the migration herds are in the reserve, the view from the basket takes in a scale of movement that is genuinely hard to grasp from the ground.',
      image: '/assets/balloon-02.jpg',
      imageAlt:
        'A hot air balloon aloft over open dry grassland at dawn, more balloons small on the horizon behind it',
    },
    amboseli: {
      label: 'Over Amboseli',
      body:
        'Amboseli flights are the newer of the two, operating from the Kimana side of the park, and the draw is the backdrop rather than the herds: Kilimanjaro fills the southern horizon at dawn, before the cloud builds over it later in the morning. You are flying over classic Amboseli country, swamp, open pan and acacia, with the mountain behind everything.',
      image: '/assets/balloon-03.jpg',
      imageAlt:
        'A red and yellow hot air balloon standing on open ground at dawn with crew working around the basket',
    },
  },

  // The things that actually cause disappointment if nobody mentions them.
  practical: [
    'Flights go at dawn and are weather dependent. Wind or low cloud cancels them, and that call belongs to the pilot on the morning, not to us.',
    'Baskets are small and fill early in high season, so this is worth adding when you book the safari rather than deciding once you have arrived.',
    'It is a genuinely early start, normally a pre-dawn pickup from camp.',
  ],

  operatorNote:
    'The flight itself is run by a licensed balloon operator with its own pilots and civil aviation approval, not by us. What we do is book your seats, make sure the pickup lines up with where you are staying and what your itinerary is doing the rest of that day, and sort it out with the operator if the weather moves your flight.',
};

export default { balloonSafari };
