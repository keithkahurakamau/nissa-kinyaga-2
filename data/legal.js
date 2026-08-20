/**
 * The site's legal copy: terms and conditions, privacy policy, cookie and
 * storage policy, copyright and image credits.
 *
 * ---------------------------------------------------------------------------
 * EDITORIAL RULE, the same one that governs data/credentials.js
 * ---------------------------------------------------------------------------
 * Never invent a commercial term. A deposit percentage, a cancellation
 * ladder, a payment deadline or a quote validity period is a number the
 * client can be held to in a dispute, and a wrong one here is worse than no
 * number at all: it is a term neither side agreed and both could point at.
 *
 * So the booking terms below describe the SHAPE of the arrangement (a
 * written quote, confirmed in writing, carrying its own commercial terms)
 * and state plainly that the quote governs. When Nissa supplies his actual
 * deposit and cancellation terms, add them as their own section and delete
 * `commercialTermsPending`; the test in test/legal.test.js checks that no
 * invented figure has crept in in the meantime.
 *
 * Same rule for the privacy policy: every third party named below is one the
 * site or the business demonstrably contacts. Do not list a processor "to be
 * safe", a privacy policy that over-declares is as inaccurate as one that
 * under-declares, and this one is checked against the code in
 * test/legal.test.js (the storage keys) and against api/google-reviews.js.
 *
 * `paragraphs` and list items may carry `[label](href)` inline links; see
 * inlineLinks() in lib/text.js for the (deliberately tiny) subset allowed.
 */

// Shown on every legal page. Bump whenever the substance changes, not for a
// typo fix: a "last updated" that moves without the terms moving trains
// readers to ignore it.
export const lastUpdated = '20 August 2026';

// Kenya. The business is registered and operates here, the trips happen
// here, and the guide is here; there is no second entity anywhere else, so
// there is no group structure to be vague about.
export const jurisdiction = {
  country: 'Kenya',
  regulator: 'Office of the Data Protection Commissioner',
  regulatorUrl: 'https://www.odpc.go.ke/',
  dataLaw: 'Data Protection Act, 2019',
};

// True while the written quote is the only place commercial terms exist.
// Rendered as a plain statement rather than hidden, a client reading the
// terms is entitled to know where the numbers live.
export const commercialTermsPending = true;

/**
 * Browser storage this site actually writes.
 *
 * This is the source of truth for the cookie policy AND for the consent
 * banner copy, and test/legal.test.js asserts it against app.js: every
 * localStorage key app.js touches must appear here, and every key here must
 * exist in app.js. A cookie policy that has drifted from the code is the
 * single most common way an honest site ends up making a false statement.
 *
 * There are no cookies. app.js contains no `document.cookie` anywhere, and
 * the test asserts that too, which is why the page is allowed to say so
 * flatly instead of hedging.
 */
export const storage = [
  {
    key: 'nk-consent',
    kind: 'Local storage',
    purpose:
      'Remembers the choice you made on the privacy banner, so it stops reappearing on every page.',
    contains:
      'Your choice ("essential" or "analytics") and the date you made it. No identifier, nothing about you.',
    duration: 'Until you clear it, or twelve months, whichever comes first.',
    category: 'Strictly necessary',
  },
];

/**
 * Third parties that see something. Each entry states what actually reaches
 * them, which is the part a visitor cares about and the part most policies
 * skip.
 */
export const processors = [
  {
    name: 'Vercel',
    role: 'Hosting and content delivery',
    sees:
      'Your IP address and browser user-agent, in ordinary server request logs. This is unavoidable for any website: it is how a page gets sent back to you. Vercel is our hosting provider and processes this on our instructions.',
    url: 'https://vercel.com/legal/privacy-policy',
  },
  {
    name: 'Google Fonts',
    role: 'Typefaces',
    sees:
      'Your IP address, when your browser fetches the two typefaces this site uses. Google states it sets no cookies for this. It is the only third party your browser contacts while you read a page here.',
    url: 'https://policies.google.com/privacy',
  },
  {
    name: 'WhatsApp (Meta)',
    role: 'How enquiries and reviews reach us',
    sees:
      'The message you choose to send, and your phone number, once you press send in WhatsApp. This is a message you send from your own account, on your own device, under WhatsApp terms you already hold with Meta. Nothing is sent until you send it, and you can email instead.',
    url: 'https://www.whatsapp.com/legal/privacy-policy',
  },
  {
    name: 'Google Places API',
    role: 'Showing our Google reviews, when that is switched on',
    sees:
      'Nothing about you. Reviews are fetched by our own server, not by your browser, so your browser never contacts Google for them and Google never sees that you visited this page. What is displayed is the review text and reviewer name already published publicly on Google.',
    url: 'https://policies.google.com/privacy',
  },
];

/**
 * Terms and conditions.
 *
 * Written for a small owner-operated Kenyan tour operator that takes no
 * payment through the website and publishes no prices. Every clause below is
 * either a plain description of how the business already works or a term
 * that follows from that; none of it invents a figure.
 */
export const terms = [
  {
    id: 'who',
    heading: 'Who these terms are between',
    paragraphs: [
      'These terms are between you and Nissa Safaris, a tour operator registered and operating in Kenya, run by the safari guide Nissa Ole Kinyaga. Where these terms say "we" or "us" they mean Nissa Safaris; "you" means the person making an enquiry or booking, and anyone else travelling on the same booking.',
      'They cover two separate things: using this website, which anyone doing so accepts, and booking a trip with us, which applies once a trip is confirmed. If you are booking for other people, you confirm that you have their authority to do so and that you have passed these terms on to them.',
    ],
  },
  {
    id: 'website',
    heading: 'What this website is, and is not',
    paragraphs: [
      'This is an information and enquiry site. It publishes no prices, takes no payment and has no booking engine. Nothing on it is an offer capable of being accepted: the itineraries, destinations and journey pages describe the kind of trip we build, and are an invitation for you to get in touch, not a contract on the table.',
      'We write these pages carefully and correct them when we find something wrong, but park fees, lodge availability, permit allocations, road conditions and wildlife all change without telling us. Details are indicative until they are written into a quote for your specific dates.',
      'Photographs show the places and animals we guide in. They are real frames from real trips, but no photograph is a promise of a sighting.',
    ],
  },
  {
    id: 'quotes',
    heading: 'Quotes, and when a booking exists',
    paragraphs: [
      'Send us your dates and what you want from the trip, and Nissa builds an itinerary and puts it in writing to you. That written quote sets out what is included, what is not, and what it costs.',
      'A booking exists when you accept that quote in writing and we confirm back that we have it. Until both of those have happened there is no booking and nothing is held for you. An enquiry, a phone call or a WhatsApp conversation on its own does not reserve anything, and lodges, conservancy beds, gorilla permits and balloon seats are allocated to whoever confirms first.',
      'Your written quote carries its own payment, deposit and cancellation terms. Where anything in that quote differs from this page, the quote is what governs your trip. This page describes how we work in general; the quote is the agreement you actually made.',
    ],
  },
  {
    id: 'prices',
    heading: 'Prices and what moves them',
    paragraphs: [
      'We do not publish prices anywhere on this site, and we will not quote one until we know your dates, your party and where you want to go, because those are what determine it. Anyone quoting you a Nissa Safaris price that did not come from us in writing is not quoting for us.',
      'A quote holds for the validity period stated on it. Several of the costs inside it are set by other people and can change after a quote is issued: national park and reserve entry fees, conservancy fees, government levies and taxes, gorilla and chimpanzee permit fees, and domestic flight fares. If one of those changes before your trip we will tell you what has changed and what it does to your total, with the evidence, rather than absorbing it silently or springing it on you late.',
    ],
  },
  {
    id: 'payment',
    heading: 'Paying',
    paragraphs: [
      'Payment is arranged directly with us, on the terms in your quote. No payment is ever taken through this website, and this website will never ask you for card details.',
      'We will never send you new bank details by unsolicited message part-way through a booking. If you receive anything claiming to change our payment details, treat it as fraud, do not pay it, and call one of the numbers on our [contact page](/contact/) to check with us first.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes and cancellations',
    paragraphs: [
      'If you need to change or cancel a confirmed trip, tell us in writing as early as you can, by email or WhatsApp to the addresses on the [contact page](/contact/). The date we receive that is the date we work from. What it costs you depends on the cancellation terms in your quote and on what the lodges, camps, charter operators and permit offices we have already committed to on your behalf will refund us, which is often nothing close to the trip date.',
      'We may need to change parts of an itinerary ourselves. Roads wash out, parks and conservancies close sections, camps flood, aircraft are grounded and animals move. Where that happens we substitute the closest equivalent we can find, at no drop in standard, and tell you why.',
      'We may cancel a trip outright where it cannot be run safely, or where a supplier fails us and there is no workable alternative. If we cancel for a reason that is ours, you are entitled to a refund of what you have paid us for the parts not delivered. That is a refund of our charges, and it is not the same as your out-of-pocket losses on flights and other arrangements you made yourself, which is what travel insurance is for.',
    ],
  },
  {
    id: 'insurance',
    heading: 'Travel insurance is a condition of travelling',
    paragraphs: [
      'You must hold travel insurance for the whole trip, and we will ask you to confirm you have it. This is not a formality on a Kenyan safari.',
      'Make sure the policy actually covers what you are doing.',
    ],
    list: [
      'Emergency medical treatment and, specifically, air evacuation. Several of the conservancies we guide in are hours from a road and the realistic way out of a serious problem is a light aircraft.',
      'Cancellation, curtailment and delay, including your international flights.',
      'The activities on your itinerary by name. Walking safaris, mountain trekking, diving and hot air balloon flights are excluded by some standard policies.',
      'Baggage and, if you are bringing it, camera equipment, which is often capped well below what a long lens is worth.',
    ],
  },
  {
    id: 'documents',
    heading: 'Passports, visas and health requirements',
    paragraphs: [
      'Getting your travel documents right is yours to do, not ours. That means a passport valid well beyond your return date with enough blank pages, the correct entry authorisation for Kenya and for any other country on your itinerary, and any vaccination certificate required for your route, including yellow fever where your routing makes it mandatory.',
      'We will tell you what we understand the requirements to be and flag anything we think will catch you out, but requirements change at short notice and the only authority on them is the issuing government and your own doctor. We cannot be responsible for a trip you are refused boarding for, or refused entry on, because a document was missing, and no refund arises from it.',
      'If you take regular medication, bring enough for the whole trip plus a margin, in your hand luggage. Remote camps have no pharmacy.',
    ],
  },
  {
    id: 'fitness',
    heading: 'Fitness, health and taking part',
    paragraphs: [
      'Tell us at the time of booking about any medical condition, mobility limitation, allergy or dietary requirement that affects your trip. We are not asking to be intrusive: it changes which camps work, how far we can walk, how long a game drive should run and what the kitchen needs to know. We would far rather build the right trip than discover the problem in the field.',
      'Some trips ask more of you than others. Walking safaris cover uneven ground; the Mount Kenya treks involve sustained walking at altitude; gorilla and chimpanzee trekking can be steep, wet and long. Balloon operators set their own requirements, including on weight and on climbing unaided into and out of the basket, and those are theirs to enforce, not ours to waive.',
      'If someone on a trip behaves in a way that puts other guests, staff, wildlife or themselves at real risk, and does not stop when asked, we may end their participation. In that situation we help them get to the nearest town or airstrip, at their cost, and no refund arises.',
    ],
  },
  {
    id: 'wildlife',
    heading: 'Wild animals, wild places, and your guide',
    paragraphs: [
      'A safari happens in wild country among free-ranging animals. That is the whole point of it, and it carries risk that no operator can remove. Elephant, buffalo, lion, hippo and snakes are dangerous, and they are not managed for your convenience.',
      'You must follow your guide\'s instructions at all times, and immediately when given urgently. Do not leave the vehicle unless your guide tells you it is safe to; stay inside the vehicle profile on a game drive; do not walk in camp at night without an escort; do not feed or approach any animal. These are not house rules, they are the actual safety margin.',
      'No sighting is guaranteed. We do not fence, bait or habituate anything to produce one. What we sell is a guide who has spent more than twenty years reading this country and will put you in the best place he knows, at the best hour, and explain what you are looking at. Some days that is a leopard on a branch at first light and some days it is a bird and a long conversation.',
    ],
  },
  {
    id: 'suppliers',
    heading: 'Lodges, camps, balloons, aircraft and other operators',
    paragraphs: [
      'Some parts of a trip we run ourselves, and some parts we book with other companies. It matters which is which.',
      'Nissa guides the Kenya trips personally, and the vehicle and the guiding are ours. Lodges, tented camps, conservancies, domestic and charter airlines, hot air balloon operators, mountain guiding outfits and dive centres are independent businesses. We choose them, book them, brief them and chase them, and we stay your single point of contact throughout. We do not own or control them, they carry their own licences, insurance and safety procedures, and their own terms apply to what they provide.',
      'Hot air balloon flights are flown by separately licensed balloon companies holding their own civil aviation approval, with their own pilots. We book your seats and fit the flight into your itinerary. We do not operate aircraft, and whether a flight goes ahead on the morning is the pilot\'s decision on the weather, not ours.',
      'Where a supplier fails badly, we will press your case with them and help you document it. Our own liability for their failure is limited to having taken reasonable care in choosing and booking them.',
    ],
  },
  {
    id: 'international',
    heading: 'Trips outside Kenya',
    paragraphs: [
      'The countries on our [international journeys pages](/journeys/) work differently, and we say so on every one of those pages. Nissa does not guide inside those countries. We plan the route, book the flights, lodges and permits, and stay your point of contact, and a ground operator licensed in that country runs the trip on the ground with its own vehicles and its own guides.',
      'Those operators hold the permits and guiding accreditation their country requires, and their terms apply alongside these to the part of the trip they run.',
    ],
  },
  {
    id: 'liability',
    heading: 'Our responsibility, and its limits',
    paragraphs: [
      'We are responsible for arranging your trip with reasonable skill and care, and for the guiding and the vehicle where those are ours. Where we get that wrong, we are responsible for it.',
      'We are not responsible for loss or damage caused by something outside our reasonable control, by an independent supplier beyond our care in choosing them, by another guest, by your own act or omission, or by your failure to follow safety instructions. We are not responsible for arrangements you make yourself and we did not book, including your international flights.',
      'Nothing in these terms limits or excludes our liability for death or personal injury caused by our negligence, for fraud, or for anything else the law does not permit us to limit. Where our liability is limited, it is limited to the amount you paid us for the part of the trip affected.',
    ],
  },
  {
    id: 'force-majeure',
    heading: 'Events outside anyone\'s control',
    paragraphs: [
      'Neither of us is in breach of these terms for failing to do something made impossible by an event outside reasonable control. In this part of the world that realistically means extreme weather and flooding, impassable or closed roads, park, reserve or border closures by the authorities, outbreaks of disease and the public health measures taken against them, civil unrest, strikes, airline and airport disruption, aircraft grounding, fire, and wildlife or environmental events such as a river crossing that does not happen where or when it usually does.',
      'If one of those disrupts a confirmed trip, we will do everything practical to rework it, and we will be straight with you about what we can and cannot recover from suppliers who are themselves affected.',
    ],
  },
  {
    id: 'photography',
    heading: 'Photographs from your trip',
    paragraphs: [
      'Nissa photographs on trips, and some of those frames end up in the [gallery](/gallery/) or on social media. If you would rather not be photographed, or are happy to be photographed but not published, say so at any point, at booking or in the vehicle, and that is the end of it. No explanation needed, and it changes nothing about your trip.',
      'If a photograph of you is already published here and you want it taken down, email us and we will remove it. We do not ask why.',
      'Photographs you take on your trip are yours. If you send us one and are happy for us to use it, we will credit you by whatever name you tell us to use.',
    ],
  },
  {
    id: 'complaints',
    heading: 'If something goes wrong',
    paragraphs: [
      'Tell your guide, at the time. Almost everything that goes wrong on a safari can be fixed on the day it happens, and cannot be fixed at all once you are home. Nissa is with you on the Kenya trips, and on trips run by a partner operator you can reach us directly on the numbers on the [contact page](/contact/), whatever time it is.',
      'If it is not resolved on the ground, write to us within a reasonable time of getting home with the detail and anything you have documenting it, and we will investigate it properly and come back to you.',
    ],
  },
  {
    id: 'law',
    heading: 'Governing law',
    paragraphs: [
      'These terms and any trip booked under them are governed by the laws of Kenya, and the courts of Kenya have jurisdiction over any dispute. If you are a consumer resident elsewhere, this does not take away any protection you have under the mandatory law of your own country.',
      'If any part of these terms turns out to be unenforceable, the rest of them still stand.',
    ],
  },
  {
    id: 'updates',
    heading: 'Changes to these terms',
    paragraphs: [
      'We update this page when the way we work changes. The version that applies to your trip is the one in force on the day your booking was confirmed, and we will not change your terms after that without telling you. The date at the top of this page is when it was last changed.',
    ],
  },
];

/**
 * Privacy policy.
 *
 * The unusual and genuinely true fact this policy is built around: the site
 * has no backend that receives form data. Both forms compose a message in
 * your browser and hand it to WhatsApp or your mail client. Nothing about
 * that is a marketing claim, it is visible in app.js and in the CSP.
 */
export const privacy = [
  {
    id: 'summary',
    heading: 'The short version',
    paragraphs: [
      'This site has no backend, no database, no analytics, no advertising and no tracking cookies. It does not build a profile of you, and there is nothing here to sell even if we wanted to.',
      'The forms do not submit anywhere. They compose a message inside your own browser and hand it to your WhatsApp or your mail client, where you decide whether to press send. If you close the tab instead, nothing has left your device.',
      'The rest of this page is the detail behind those two paragraphs, and how to get in touch about your data.',
    ],
  },
  {
    id: 'controller',
    heading: 'Who is responsible for your data',
    paragraphs: [
      'Nissa Safaris, a tour operator registered and operating in Kenya, is the data controller. We are based in Laikipia County, Kenya. There is no parent company, no group and no third party running this on our behalf.',
      'For anything about your data, email [nissasafaris254@gmail.com](mailto:nissasafaris254@gmail.com) or use the details on the [contact page](/contact/). It reaches Nissa directly.',
    ],
  },
  {
    id: 'browsing',
    heading: 'What happens when you just read the site',
    paragraphs: [
      'No analytics run. No tracking pixel loads. No advertising network is contacted. We do not know that you visited, which page you read, or how long you spent on it.',
      'Two things do happen, and both are ordinary web plumbing rather than anything about you. Our hosting provider records the request in a server log, which includes your IP address, in the same way every website on the internet does. And your browser fetches this site\'s two typefaces from Google Fonts, which lets Google see your IP address as part of that request.',
      'That is the complete list. There is nothing else.',
    ],
  },
  {
    id: 'forms',
    heading: 'What happens when you use a form',
    paragraphs: [
      'There are two forms on this site: the enquiry form on the [contact page](/contact/) and the review form on the [reviews page](/reviews/). Both work the same way, and neither sends anything to a server here.',
      'What you type is assembled into a plain message inside your browser. That message is then handed to WhatsApp, or to your email client, as a draft. You read it, and you send it or you do not. Until you press send in that app, the text has never left your device, and even then it goes to Nissa\'s phone or inbox rather than to any system belonging to this website.',
      'The practical consequence is that this website stores nothing you type, cannot lose it in a breach, and cannot pass it to anyone. What Nissa then holds is a WhatsApp conversation or an email thread with you, like any other conversation with a client.',
    ],
  },
  {
    id: 'booking',
    heading: 'What we hold once you are booking a trip',
    paragraphs: [
      'Planning a real trip needs real details, and at that point we do hold information about you: your name and contact details, your travel dates and party, your passport details where a lodge, an airline or an immigration process requires them, dietary requirements, and any medical or mobility information you have chosen to tell us so we can build the trip safely.',
      'We use it to plan and run your trip and for nothing else. Where a lodge, camp, charter airline, permit office or partner operator needs a specific detail to hold your booking, we pass on that detail and no more. We do not sell it, we do not rent it, and we do not add you to a marketing list you did not ask for.',
      'Health information and passport details are sensitive, and we treat them accordingly: they are shared only where the booking genuinely requires it, and we do not keep them beyond the trip.',
    ],
  },
  {
    id: 'reviews-data',
    heading: 'Reviews',
    paragraphs: [
      'The review form carries a consent checkbox, and it is meaningful: nothing you write is published on this site unless you tick it. Reviews we publish show the first name and country you gave us and nothing else, and you can ask us to take yours down at any time.',
      'Where we display reviews from Google, those are reviews already published publicly on Google by the people who wrote them. They are fetched by our server rather than by your browser, which means your browser never contacts Google for them and Google is not told that you looked at that page. We do not store their content; it is fetched fresh each time, which is what Google\'s own terms require.',
    ],
  },
  {
    id: 'sharing',
    heading: 'Who else sees anything',
    paragraphs: [
      'The table below is the complete list of third parties involved in this website. Each entry says exactly what reaches them.',
    ],
  },
  {
    id: 'basis',
    heading: 'Why we are allowed to hold it',
    paragraphs: [
      'Where you have made an enquiry or a booking, we hold your details because we need them to answer you and to perform the trip you asked us for. Where we keep booking records after a trip, it is because we have a legitimate interest in being able to answer a later question or a dispute about it, and in some cases a legal or tax obligation to keep them.',
      'Where you have given consent, for a review to be published or for a photograph of you to be used, that consent is the whole basis and you can withdraw it at any time by telling us.',
    ],
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    paragraphs: [
      'Enquiries that do not turn into trips are not kept indefinitely: the conversation stays in WhatsApp or the inbox while it is live and is cleared out once it plainly is not.',
      'Booking records are kept while they may still be needed, for a later question about your trip or for tax and accounting purposes. Passport and health details are not kept beyond what the booking required.',
      'You can ask us to delete anything we hold about you and we will, except where we are legally required to keep a record.',
    ],
  },
  {
    id: 'rights',
    heading: 'Your rights over your data',
    paragraphs: [
      'Under Kenya\'s Data Protection Act, 2019 you have the right to be told what we hold about you, to get a copy of it, to have it corrected if it is wrong, to have it deleted, to object to how we are using it, and to withdraw any consent you gave.',
      'If you are in the United Kingdom or the European Economic Area, the UK GDPR and the GDPR give you the same rights and we will honour them on the same terms, including your right to receive your data in a portable form.',
      'Ask by emailing [nissasafaris254@gmail.com](mailto:nissasafaris254@gmail.com). We will not charge you for it and we will not make it difficult. If you are not satisfied with how we have handled it, you can complain to the Office of the Data Protection Commissioner in Kenya at [odpc.go.ke](https://www.odpc.go.ke/), or to your own national data protection authority if you are in the UK or the EEA.',
    ],
  },
  {
    id: 'international',
    heading: 'Where your data goes',
    paragraphs: [
      'We are in Kenya, so if you enquire from elsewhere your message is read in Kenya. Booking a trip means passing the details a booking needs to lodges, camps, airlines and partner operators in Kenya and, for the international journeys, in the country you are travelling to.',
      'Our hosting and content delivery run on servers outside Kenya, which is normal for any website, and the messaging and email services we use are operated by companies outside Kenya under their own privacy terms.',
    ],
  },
  {
    id: 'children',
    heading: 'Children',
    paragraphs: [
      'This site is not aimed at children and we do not knowingly collect anything from one. Children travel on our family safaris, and where we hold a child\'s details it is because a parent or guardian gave them to us as part of the family\'s booking.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    paragraphs: [
      'The site is served only over HTTPS, with HSTS, so the connection between you and it is encrypted and cannot be downgraded. Its Content-Security-Policy blocks inline scripts and inline styles outright and restricts every network request the page can make, which is what stops injected code running on a page you are reading.',
      'The structural protection is simpler than any of that: there is no database here and no server that receives your form data, so there is no store of visitor data on this site to be breached.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    paragraphs: [
      'If this changes, the date at the top of the page changes with it. We will not quietly start collecting something this page says we do not.',
    ],
  },
];

/**
 * Cookie and browser storage policy.
 *
 * The `storage` table above is rendered into this page; these sections are
 * the prose around it.
 */
export const cookies = [
  {
    id: 'none',
    heading: 'This site sets no cookies',
    paragraphs: [
      'Not "no third-party cookies", and not "no cookies except the necessary ones". No cookies. This site\'s code does not write a cookie anywhere, and there is a test in the build that fails if one is ever added without this page being updated.',
      'That means no advertising cookies, no tracking cookies, no cross-site identifiers, no remarketing, no social media pixels and no analytics cookies. Nobody is following you from here to anywhere else, because there is nothing here doing the following.',
    ],
  },
  {
    id: 'stored',
    heading: 'The one thing we do store',
    paragraphs: [
      'There is a single item kept in your browser\'s local storage, which is a separate mechanism from cookies and, unlike a cookie, is never transmitted to any server. It exists so the privacy banner stops reappearing once you have answered it.',
    ],
  },
  {
    id: 'analytics',
    heading: 'Analytics',
    paragraphs: [
      'There are none. No measurement tool of any kind runs on this site today, which is why choosing "Essential only" on the banner changes nothing about what happens: there is nothing for it to switch off.',
      'The banner offers the choice because the code has a consent gate built into it, ready for the day we want to know something as basic as which safaris people read most. If that day comes, anything of the sort will run only for visitors who chose to allow it, this page will be updated to name the tool and say what it collects before it is switched on, and it will never be an advertising network.',
    ],
  },
  {
    id: 'third-party',
    heading: 'Third parties',
    paragraphs: [
      'One third party is contacted by your browser while you read a page here: Google Fonts, which serves the two typefaces the site is set in. Google states that it sets no cookies for font requests, though it does see your IP address as part of any such request, as any server you fetch a file from does.',
      'Everything else this site touches happens on our own server, not in your browser. That is a deliberate design choice, and it is why there is no embedded reviews widget, no social feed and no third-party map here: each of those would be a company watching you read.',
      'The [privacy policy](/privacy/) lists every third party involved and exactly what reaches each one.',
    ],
  },
  {
    id: 'control',
    heading: 'Changing your mind',
    paragraphs: [
      'Your choice is recorded with the date you made it and is treated as expiring after twelve months, so you will be asked again rather than being held to something you decided years ago. You can change it whenever you like, using the control below.',
      'You can also clear it yourself. Local storage is cleared through your browser\'s settings for site data, listed under this site\'s name, and clearing it simply means the banner asks you again on your next visit. Nothing else on the site depends on it.',
    ],
  },
];

/**
 * Copyright and intellectual property.
 *
 * The Creative Commons credits on this page are generated from
 * data/journeys.js rather than typed here, so the attribution required by
 * CC BY-SA 4.0 cannot fall out of step with the photographs actually in use.
 * See templates/legal.js.
 */
export const copyright = [
  {
    id: 'ownership',
    heading: 'What is ours',
    paragraphs: [
      'The writing on this site, the itineraries, the destination and journey pages, the field notes and the design and code of the site itself are the copyright of Nissa Safaris.',
      'The safari photographs are Nissa Ole Kinyaga\'s own work, taken on the trips described here, and are his copyright, except for the small number of images credited to someone else and listed further down this page.',
      'Nothing here is stock photography passed off as ours. If a frame is on this site, either Nissa took it or it is credited.',
    ],
  },
  {
    id: 'use',
    heading: 'What you are welcome to do',
    paragraphs: [
      'Link to any page here, freely and without asking. Quote a short passage in a review, a blog post or an article, with our name and a link back. Print a page for your own trip planning. Share a page with anyone you like.',
      'If you are writing about Nissa or about a trip you took with us and want a photograph to go with it, ask us. The answer is usually yes, and we will send you a proper file rather than something scraped off the page.',
    ],
  },
  {
    id: 'restrictions',
    heading: 'What needs permission first',
    paragraphs: [
      'Republishing our photographs or our itinerary text elsewhere, using anything from this site to advertise or sell another operator\'s trips, or presenting our work as your own, all need our written permission and generally will not get it. Small operators get their itineraries copied constantly and it is worth being clear about it.',
      'The Creative Commons images listed below are a separate matter: they are not ours to license, and their own terms govern reuse.',
    ],
  },
  {
    id: 'marks',
    heading: 'Names and marks',
    paragraphs: [
      '"Nissa Safaris" and the Nissa Safaris logo identify this business. Please do not use them in a way that suggests a partnership, an endorsement or an affiliation that does not exist.',
      'Other organisations named on this site own their own names and marks. The Kenya Wildlife Service, the Kenya Professional Safari Guides Association, the Tourism Regulatory Authority, Kenya Utalii College, the conservancies, lodges and camps we work with, Google, TripAdvisor and IWACO-KENYA are named because we work with them, are accredited by them or are describing them accurately. Naming them does not imply that any of them endorses this website, and any accreditation we claim is set out with its issuing body on the [credentials page](/reviews/).',
    ],
  },
  {
    id: 'takedown',
    heading: 'If you think we have used something of yours',
    paragraphs: [
      'Tell us and we will deal with it properly. Email [nissasafaris254@gmail.com](mailto:nissasafaris254@gmail.com) with the page it is on, which image or passage it is, and what makes you the owner. We will take it down while we look into it rather than after, and if we got it wrong we will say so and credit or remove it as you prefer.',
      'The same applies if you are a guest who appears in a photograph here and would rather not be. Ask, and it comes down. No reason needed.',
    ],
  },
];
