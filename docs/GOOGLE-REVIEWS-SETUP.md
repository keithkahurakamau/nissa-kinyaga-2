# Turning on live Google reviews

The code is already in place. Nothing shows on `/reviews/` until the two
values below are set, and the moment they are, the Google section appears on
its own. No deploy or code change is needed after that.

## Why it works this way

Three of Google's rules decide the design, and they rule out the obvious
approaches:

- The Places API sends no CORS headers, so a browser cannot call it directly.
- API keys restricted by HTTP referrer, the only restriction worth anything in
  a browser, are rejected by the Places API.
- Google's policies forbid caching or storing review content. Only the place ID
  may be kept. So the reviews cannot be baked into the site at build time.

So reviews are fetched by a small server-side function at
`api/google-reviews.js`. The key stays on the server and is never sent to a
visitor, each request is live, and because the function is on your own domain
the site's Content Security Policy already allows it. A visitor's browser never
contacts Google at all, which is also what `/privacy/` promises them.

Two consequences worth knowing:

- **Google returns at most 5 reviews.** That is an API limit, not a setting.
  Everything beyond those five lives behind the "Read them all on Google"
  button. This is why the guest review form on the same page still matters:
  it is the only way to build a body of testimonial you own.
- Reviews cannot be edited, reordered or filtered. Whatever Google returns is
  what shows, which is the honest arrangement anyway.

## Step 1, find your Place ID

Your Place ID is a string starting with `ChIJ`. Either route works:

**From Google Maps**

1. Open [google.com/maps](https://www.google.com/maps) and search for
   **Nissa Safaris**.
2. Click your business so its panel opens on the left.
3. Click **Share**, then **Copy link**. You get a `maps.app.goo.gl/...` link.
4. Send that link to your developer, or paste it into the Place ID finder below,
   which will resolve it.

**From Google's Place ID finder**

1. Open the [Place ID finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
2. Type **Nissa Safaris** into the search box on the map.
3. Select your business. The Place ID appears in a bubble above the pin.
4. Copy it. It looks like `ChIJN1t_tDeuEmsRUsoyG83frY4`.

## Step 2, create an API key

1. Go to the [Google Cloud console](https://console.cloud.google.com/) and sign
   in with the account that owns the Business Profile.
2. Create a project, or pick an existing one.
3. **APIs & Services → Library**, search for **Places API (New)**, and enable it.
4. **APIs & Services → Credentials → Create credentials → API key**.
5. Open the new key and set **API restrictions → Restrict key → Places API (New)**.
   Leave application restrictions set to None: this key is only ever used from
   the server, never from a browser, and a referrer restriction would break it.
6. Copy the key.

Billing must be enabled on the project. Google's free monthly credit covers a
site at this traffic level comfortably, but the API will refuse to answer
without a billing account attached.

## Step 3, set both values in Vercel

**Project → Settings → Environment Variables**, add two, for all environments:

| Name | Value |
|---|---|
| `GOOGLE_PLACES_API_KEY` | the key from step 2 |
| `GOOGLE_PLACE_ID` | the Place ID from step 1 |

Then redeploy, or push any commit. Environment variables are only read at
request time, so an existing deployment picks them up on the next request.

## Step 4, check it

Open `https://nissasafaris.com/api/google-reviews` directly. You should see
JSON with `"configured": true` and a `reviews` array. If it says
`"configured": false`, one of the two variables is missing or misspelt.

Then load `/reviews/`. The Google section appears above your own guest
reviews, with the rating, the star row, the review count and a link out.

## Also worth doing

Paste your Google Maps link into `profiles.googleBusiness` in `data/site.js`.
That puts it in the site's `sameAs` structured data and in `llms.txt`, which
is how a search engine or an AI assistant confirms the Nissa Safaris on this
domain is the same business as the one on Google. It is the single strongest
signal available for that, and it is one line.

## If something goes wrong

| Symptom | Cause |
|---|---|
| `configured: false` | One or both environment variables are unset |
| `error: upstream`, status 403 | Key not restricted to Places API (New), or billing is off |
| `error: upstream`, status 404 | The Place ID is wrong |
| Section never appears, JSON looks right | Google returned no reviews for the place |

The function logs the upstream status and a truncated body to the Vercel
runtime logs. It deliberately never forwards Google's error body to the
browser, because those bodies can echo the API key back.
