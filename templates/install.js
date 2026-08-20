import { html } from '../lib/html.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { breadcrumbNav, ctaBlock } from './partials.js';
import site from '../data/site.js';

/**
 * /app/ and /offline/, the two pages the installable-app layer needs.
 *
 * Everything here degrades: with JavaScript off, /app/ still explains how to
 * install on every platform by hand, because the written steps are always
 * rendered rather than swapped in by script. app.js only ever enables the
 * one-tap button and updates the status line above it.
 */

function clamp(text) {
  const trimmed = text.trim();
  return escapedLength(trimmed) <= MAX_DESCRIPTION
    ? trimmed
    : truncateToEscapedLimit(trimmed, MAX_DESCRIPTION);
}

function steps(heading, items) {
  return html`<div class="install-steps">
  <h3 class="h3">${heading}</h3>
  <ol class="install-step-list">
    ${items.map((item) => html`<li>${item}</li>`)}
  </ol>
</div>`;
}

/* ---------- /app/ ---------- */

export function installPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Get the app', path: '/app/' },
  ];

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap-narrow">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">Take it with you</h1>
      <p class="lede">Add Nissa Safaris to your phone and it opens like an app, with the pages you have already read still there when the signal is not.</p>

      <div id="nk-install-panel" class="install-panel">
        <p id="nk-install-status" class="install-status">Open this page on the phone or tablet you want to install it on, then follow the steps for your device below.</p>
        <button type="button" id="nk-install" class="btn btn-gold install-btn" hidden>Install Nissa Safaris</button>
      </div>
    </div>
  </header>

  <section class="section-alt">
    <div class="wrap-narrow">
      <h2 class="h2">Why you would want it</h2>
      <p class="body">This is written for one situation in particular. You are somewhere in Laikipia or the Mara, there is no signal for the next two days, and you want to check what tomorrow looks like or read back what the guide said about the rhino you saw. Anything you opened while you had a connection is still there.</p>
      <ul class="install-points">
        <li><strong>It keeps the pages you have opened.</strong> Read your itinerary once with a connection and it stays readable without one. Pages you never opened will not be there, so open what you want before you leave the wifi.</li>
        <li><strong>It opens from your home screen</strong>, full screen, with no browser bar around it.</li>
        <li><strong>There is no app store, no download, no account.</strong> It is this website, saved. Nothing is installed on your phone beyond the pages themselves.</li>
        <li><strong>It is light.</strong> Saving it costs a few hundred kilobytes. Photographs are only kept as you actually look at them, and the oldest are dropped once enough have built up.</li>
        <li><strong>It still tracks nothing.</strong> Same site, same rules: no cookies, no analytics. See the <a href="/privacy/">privacy policy</a>.</li>
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="wrap-narrow">
      <h2 class="h2">How to install it</h2>
      <p class="body">If the button at the top of this page is showing, that is the quickest way and you can ignore all of this. iPhones and iPads do not offer that button, so there they are the only way.</p>
      ${steps('On an iPhone or iPad', [
        html`Open this page in <strong>Safari</strong>. It has to be Safari; Chrome on an iPhone cannot do this.`,
        html`Tap the <strong>Share</strong> button, the square with an arrow coming out of the top.`,
        html`Scroll down the list and tap <strong>Add to Home Screen</strong>.`,
        html`Tap <strong>Add</strong>. The spearhead icon appears on your home screen.`,
      ])}
      ${steps('On an Android phone', [
        html`Open this page in <strong>Chrome</strong>.`,
        html`Tap the <strong>three dots</strong> in the top right.`,
        html`Tap <strong>Install app</strong>, or <strong>Add to Home screen</strong> on older versions.`,
        html`Confirm. It installs like any other app and appears in your app drawer.`,
      ])}
      ${steps('On a computer', [
        html`Open this page in <strong>Chrome</strong> or <strong>Edge</strong>.`,
        html`Look for the <strong>install icon</strong> in the address bar, a small screen with an arrow pointing into it.`,
        html`Click it and confirm. It opens in its own window from then on.`,
      ])}
    </div>
  </section>

  <section class="section-alt">
    <div class="wrap-narrow">
      <h2 class="h2">What still needs a connection</h2>
      <p class="body">Worth knowing before you rely on it, because the honest answer is not "everything".</p>
      <ul class="install-points">
        <li><strong>Sending an enquiry or a review.</strong> The form itself opens offline, but it hands your message to WhatsApp or your email app, and those need a connection to actually send. Your message waits in WhatsApp until you have signal again.</li>
        <li><strong>Google reviews.</strong> They are fetched live and are never stored, so they simply do not appear offline.</li>
        <li><strong>Anything you have not opened before.</strong> There is no bulk download, deliberately: pulling the whole site onto your phone would cost you a lot of data for pages you will never read.</li>
      </ul>
      <p class="body">Everything updates itself. When you next open it with a connection you get the current version of the site, without reinstalling anything.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap-narrow">
      <h2 class="h2">Removing it</h2>
      <p class="body">Press and hold the icon and remove it, exactly like any other app. On a computer, open it and use the three-dot menu inside its window. Removing it clears everything it had saved, and nothing is left behind anywhere else.</p>
      <p class="body">Any question about it, message <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a> or email <a href="mailto:${site.email}">${site.email}</a>.</p>
    </div>
  </section>

  ${ctaBlock({
    heading: 'Plan the trip first',
    body: 'Send your travel dates and Nissa will build the itinerary himself, drawing on the conservancies and lodges he knows first-hand.',
  })}
</main>`;

  return layout({
    title: 'Get the App | Nissa Safaris',
    description: clamp(
      'Add Nissa Safaris to your phone: it opens like an app and keeps the pages you have read available with no signal. No app store, no account, no tracking.',
    ),
    path: '/app/',
    crumbs,
    body,
  });
}

/* ---------- /offline/ ---------- */

/**
 * Served by the service worker when a navigation fails and nothing cached
 * matches. Carries no photographs and nothing it would need to fetch: by
 * definition it renders when the network is gone, so anything it referenced
 * beyond the precached stylesheet would be a broken box on the page.
 */
export function offlinePage() {
  const body = html`<main id="main">
  <section class="section offline-section">
    <div class="wrap-narrow">
      <p class="label">No connection</p>
      <h1 class="display">You are offline</h1>
      <p class="lede">This page was not saved to your device, so there is nothing to show you until you have signal again.</p>
      <p class="body">Anything you opened while you had a connection is still readable. Try one of these, or press back to return to where you were.</p>
      <nav class="offline-links" aria-label="Pages you may have saved">
        <a href="/">Home</a>
        <a href="/safaris/">Safaris</a>
        <a href="/destinations/">Destinations</a>
        <a href="/gallery/">Gallery</a>
        <a href="/contact/">Contact</a>
      </nav>
      <button type="button" id="nk-retry" class="btn btn-gold offline-retry">Try again</button>
      <p class="body offline-note">If you installed Nissa Safaris on your home screen, it keeps the pages you have already read. Pages you never opened were never downloaded, which is why this one is missing. More on that on the <a href="/app/">app page</a>.</p>
    </div>
  </section>
</main>`;

  return layout({
    title: 'Offline | Nissa Safaris',
    description: clamp(
      'You are offline. Pages you opened while you had a connection are still readable on your device; this one was not saved.',
    ),
    path: '/offline/',
    // The footer's full logo is an 890KB lazy-loaded image, so it is almost
    // never cached when this page is the one being shown, and it rendered as
    // a broken-image icon at the bottom of the one screen guaranteed to be
    // seen with no network. Omitted rather than hidden: a display:none image
    // is still fetched.
    bodyClass: 'is-offline',
    minimalFooter: true,
    // A fallback screen has no business in search results: it would rank for
    // nothing useful and would look to a crawler like a broken page.
    robots: 'noindex, follow',
    body,
  });
}
