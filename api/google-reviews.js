/**
 * Live Google reviews, proxied.
 *
 * WHY A PROXY AND NOT A BROWSER FETCH. Three constraints force this shape:
 *
 *   1. Google's Places API sends no CORS headers, so a browser cannot call it
 *      directly at all.
 *   2. API keys restricted by HTTP referrer, the only restriction that means
 *      anything in a browser, are rejected by the Places API.
 *   3. Google's policies forbid caching or storing review content. Only the
 *      place ID may be kept. So the reviews cannot be baked into the static
 *      build at deploy time, which is otherwise exactly how this site works.
 *
 * Proxying satisfies all three: the key stays server-side in an environment
 * variable and is never shipped, each request fetches live, and because this
 * endpoint is same-origin the page's `connect-src 'self'` policy already
 * allows it with no CSP relaxation. It is also better for the visitor than a
 * client-side widget: their browser never contacts Google at all, which is
 * what /privacy/ promises.
 *
 * Configuration, both set in the Vercel project's environment variables:
 *   GOOGLE_PLACES_API_KEY  a Places API (New) key, restricted to this API
 *   GOOGLE_PLACE_ID        the business's place ID, e.g. ChIJ...
 *
 * With either missing this returns `configured: false` and the page simply
 * renders nothing, rather than erroring.
 */

const ENDPOINT = 'https://places.googleapis.com/v1/places';
// Only what is actually rendered. A narrower mask is also a cheaper SKU.
const FIELD_MASK = 'id,displayName,rating,userRatingCount,googleMapsUri,reviews';

export default async function handler(request, response) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return response.status(200).json({
      configured: false,
      reason: 'GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set',
    });
  }

  try {
    const upstream = await fetch(`${ENDPOINT}/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      // Never forward Google's body: it can echo the key back in an error.
      console.error('Places API error', upstream.status, detail.slice(0, 300));
      return response.status(502).json({ configured: true, error: 'upstream', status: upstream.status });
    }

    const place = await upstream.json();

    // Normalised to only what the page shows. Google requires the author's
    // name and, where available, a link, to travel with each review; both are
    // carried through here and rendered by app.js.
    const reviews = (place.reviews ?? []).map((review) => ({
      author: review.authorAttribution?.displayName ?? 'A Google user',
      authorUri: review.authorAttribution?.uri ?? null,
      rating: review.rating ?? null,
      text: review.originalText?.text ?? review.text?.text ?? '',
      relativeTime: review.relativePublishTimeDescription ?? '',
      publishTime: review.publishTime ?? null,
    })).filter((review) => review.text.trim().length > 0);

    // Cached for a minute at the edge only. Google's policy forbids storing
    // review content; a 60 second shared cache keeps a burst of traffic from
    // becoming a burst of billed API calls without warehousing anything.
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=60');

    return response.status(200).json({
      configured: true,
      name: place.displayName?.text ?? null,
      rating: place.rating ?? null,
      total: place.userRatingCount ?? 0,
      mapsUri: place.googleMapsUri ?? null,
      reviews,
    });
  } catch (error) {
    console.error('google-reviews handler failed', error);
    return response.status(502).json({ configured: true, error: 'fetch-failed' });
  }
}
