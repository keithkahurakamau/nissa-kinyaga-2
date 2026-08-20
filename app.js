(function(){
  "use strict";

  /* ---------- nav scroll + progress ----------
     The scrolled bar's appearance (solid fill, hairline rule, shadow) is
     driven entirely by the `.nk-scrolled` class in CSS (see
     `.nav.nk-scrolled .nav-bar` in styles.css) now that the old
     backdrop-filter glass panel is gone, so this only ever toggles the one
     class rather than also juggling glass/refract class names on #nk-navbar. */
  var nav = document.getElementById('nk-nav');
  var bar = document.getElementById('nk-progress');
  function onScroll(){
    var s = window.scrollY > 60;
    nav.classList.toggle('nk-scrolled', s);
    if (bar){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- back to top ----------
     Appears once you are more than a viewport down, which is the point at
     which reaching the nav again is a real scroll rather than a flick.
     Honours reduced motion by jumping instead of animating. */
  (function(){
    var btn = document.getElementById('nk-top');
    if (!btn) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    function sync(){
      btn.classList.toggle('is-visible', window.scrollY > window.innerHeight);
    }
    window.addEventListener('scroll', sync, { passive:true });
    window.addEventListener('resize', sync);
    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: (reduce && reduce.matches) ? 'auto' : 'smooth' });
    });
    sync();
  })();

  /* ---------- mobile menu ---------- */
  var menu = document.getElementById('nk-menu');
  function openMenu(){ menu.style.display = 'flex'; }
  function closeMenu(){ menu.style.display = 'none'; }
  document.getElementById('nk-menu-open').addEventListener('click', openMenu);
  document.getElementById('nk-menu-close').addEventListener('click', closeMenu);
  Array.prototype.forEach.call(document.querySelectorAll('.nk-mlink'), function(a){
    a.addEventListener('click', closeMenu);
  });

  /* ---------- gallery carousel ----------
     The reel is now server-rendered (templates/gallery.js, from
     data/gallery.js) as real <figure class="gal-item"> elements holding a
     real <img> and a static caption, so crawlers index every photo. This
     reads the item data back out of that markup instead of holding its own
     copy, the single source of truth is the DOM, not an inline array. */
  var gal = document.getElementById('nk-gal');
  var galCards = gal ? Array.prototype.slice.call(gal.querySelectorAll('.gal-item')) : [];
  var items = galCards.map(function(fig){
    var img = fig.querySelector('img');
    var cat = fig.querySelector('.gal-card-cat');
    var title = fig.querySelector('.gal-card-title');
    var story = fig.querySelector('.gal-card-story');
    return {
      src: img ? img.getAttribute('src') : '',
      cat: cat ? cat.textContent : '',
      title: title ? title.textContent : '',
      story: story ? story.textContent : ''
    };
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('nk-lb');
  var lbImg = document.getElementById('nk-lb-img');
  var lbCat = document.getElementById('nk-lb-cat');
  var lbTitle = document.getElementById('nk-lb-title');
  var lbStory = document.getElementById('nk-lb-story');
  var lbIndex = null;
  function renderLb(){
    if (lbIndex === null) return;
    var it = items[lbIndex];
    lbImg.style.backgroundImage = "url('"+it.src+"')";
    lbImg.setAttribute('aria-label', it.title);
    lbCat.textContent = it.cat;
    lbTitle.textContent = it.title;
    lbStory.textContent = it.story;
  }
  function openLb(i){ if (!lb) return; lbIndex = i; renderLb(); lb.classList.add('is-open'); }
  function closeLb(){ if (!lb) return; lbIndex = null; lb.classList.remove('is-open'); }
  function stepLb(d){ if (lbIndex === null) return; lbIndex = (lbIndex + d + items.length) % items.length; renderLb(); }
  // #nk-lb only renders on /gallery/ (templates/gallery.js), every other
  // page loads this same app.js bundle, so this whole block must be a
  // no-op there rather than throwing on a null lookup.
  if (lb) {
    document.getElementById('nk-lb-close').addEventListener('click', closeLb);
    document.getElementById('nk-lb-prev').addEventListener('click', function(e){ e.stopPropagation(); stepLb(-1); });
    document.getElementById('nk-lb-next').addEventListener('click', function(e){ e.stopPropagation(); stepLb(1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) closeLb(); });
    window.addEventListener('keydown', function(e){
      if (lbIndex === null) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') stepLb(1);
      if (e.key === 'ArrowLeft') stepLb(-1);
    });
  }

  /* ---------- gallery mosaic: filters + lightbox ----------
     Replaced the carousel controller. The gallery is now a grid of every
     photograph rather than a one-at-a-time reel, so there is nothing to
     scroll-snap and no active-card tracking; what is left is the category
     filter and opening a frame in the lightbox.

     Tiles are hidden with the `hidden` attribute rather than a class, so they
     leave the grid's flow entirely (styles.css sets display:none on [hidden])
     and the mosaic reflows without leaving holes. */
  (function(){
    if (!gal) return;
    var tiles = galCards;
    if (!tiles.length) return;

    var chips = Array.prototype.slice.call(document.querySelectorAll('.gal-chip'));
    var countEl = document.getElementById('nk-gal-count');
    var total = tiles.length;

    function applyFilter(name){
      var shown = 0;
      for (var i = 0; i < tiles.length; i++){
        var match = (name === 'all') || (tiles[i].getAttribute('data-cat') === name);
        tiles[i].hidden = !match;
        if (match) shown++;
      }
      chips.forEach(function(chip){
        var on = chip.getAttribute('data-filter') === name;
        chip.classList.toggle('is-on', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (countEl){
        countEl.textContent = (name === 'all')
          ? 'Showing all ' + total + ' photographs'
          : 'Showing ' + shown + ' of ' + total + ' photographs in ' + name;
      }
    }

    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        applyFilter(chip.getAttribute('data-filter'));
      });
    });

    // The lightbox indexes into the full, unfiltered list, so `data-lb` stays
    // correct whatever is on screen. Stepping through it with the arrows walks
    // every photograph rather than only the visible ones, which is deliberate:
    // the filter narrows the grid, not the viewer.
    gal.addEventListener('click', function(e){
      var t = e.target.closest('[data-lb]');
      if (!t) return;
      openLb(parseInt(t.getAttribute('data-lb'), 10));
    });
  })();

  /* ---------- reveal on scroll ----------
     The transitions and the up/left/right/zoom/clip variants live in
     styles.css and predate this; what was missing was any element carrying
     data-reveal, so the whole system was dead. Templates now set it.

     Two additions here. `data-reveal-delay` is applied by writing the --d
     custom property the stylesheet already reads, via CSSOM rather than a
     style attribute, since the CSP forbids markup-parsed inline styles.
     And siblings that reveal together are staggered, so a row of cards
     arrives in sequence instead of snapping in as one block.

     The 2600ms failsafe is kept: if the observer never fires (an odd
     viewport, a browser quirk), content must still end up visible rather
     than stuck at opacity 0. */
  (function(){
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;

    var STAGGER = 70;   // ms between siblings in the same container
    var MAX_STEPS = 6;  // beyond this the wait gets noticeable, so it caps

    function delayFor(el){
      var own = parseInt(el.getAttribute('data-reveal-delay'), 10);
      if (!isNaN(own)) return own;
      var parent = el.parentElement;
      if (!parent) return 0;
      var sibs = Array.prototype.filter.call(parent.children, function(c){
        return c.hasAttribute && c.hasAttribute('data-reveal');
      });
      if (sibs.length < 2) return 0;
      return Math.min(sibs.indexOf(el), MAX_STEPS) * STAGGER;
    }

    function show(el){
      var d = delayFor(el);
      if (d) el.style.setProperty('--d', d + 'ms');
      el.classList.add('nk-in');
    }

    // Reduced motion: the stylesheet already collapses the durations, but
    // there is no reason to run an observer at all in that case.
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if ((reduce && reduce.matches) || !('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('nk-in'); });
      return;
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        show(en.target);
        io.unobserve(en.target);
      });
    }, { threshold:0, rootMargin:'0px 0px 14% 0px' });
    els.forEach(function(el){ io.observe(el); });
    setTimeout(function(){ els.forEach(function(el){ el.classList.add('nk-in'); }); }, 2600);
  })();

  /* ---------- contact form + calendar ----------
     #nk-form only renders on /contact/ (templates/contact.js), every other
     page loads this same app.js bundle, so the whole block bails out early
     rather than throwing on a null lookup.

     The package listbox's options are now server-rendered (Task 17: one
     real button per data/packages.js entry, generated in
     templates/contact.js, so the list can never drift from the 21
     packages) instead of built here from a hardcoded, out-of-sync array, 
     this reads the choice straight off the clicked .pkg-select-opt rather
     than re-rendering the panel from JS. Open/selected/has-value state is
     tracked with the .is-open/.is-selected/.has-value modifier classes
     already defined in styles.css, not direct style assignment. */
  (function(){
    var form = document.getElementById('nk-form');
    if (!form) return;
    var wrap = document.getElementById('nk-form-wrap');
    var dateInput = document.getElementById('nk-date');
    var flexInput = document.getElementById('nk-flex');
    var pkgPanel = document.getElementById('nk-pkg');
    var pkgToggle = document.getElementById('nk-pkg-toggle');
    var pkgLabel = document.getElementById('nk-pkg-label');
    var pkgOpts = pkgPanel ? Array.prototype.slice.call(pkgPanel.querySelectorAll('.pkg-select-opt')) : [];
    var pkgSel = null;
    var pkgSelEl = null;
    var pkgOpen = false;
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    /* native date input: block past dates, format for the message */
    var t0 = new Date(); t0.setHours(0,0,0,0);
    function iso(d){ return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
    if (dateInput) dateInput.min = iso(t0);
    if (flexInput) flexInput.addEventListener('change', function(){
      if (flexInput.checked){ dateInput.value = ''; dateInput.disabled = true; }
      else { dateInput.disabled = false; }
    });
    function fmtWhen(){
      if (flexInput && flexInput.checked) return 'Flexible / not sure yet';
      if (dateInput && dateInput.value){
        var pr = dateInput.value.split('-');
        return MONTHS[(+pr[1]) - 1] + ' ' + (+pr[2]) + ', ' + pr[0];
      }
      return '-';
    }

    /* ----- experience / package listbox ----- */
    function syncPkg(){
      if (pkgLabel) pkgLabel.textContent = pkgSel || 'Choose a safari';
      if (pkgToggle){
        pkgToggle.classList.toggle('has-value', !!pkgSel);
        pkgToggle.setAttribute('aria-expanded', pkgOpen ? 'true' : 'false');
      }
    }
    function openPkg(){ pkgOpen = true; if (pkgPanel) pkgPanel.classList.add('is-open'); syncPkg(); }
    function closePkg(){ pkgOpen = false; if (pkgPanel) pkgPanel.classList.remove('is-open'); syncPkg(); }
    if (pkgToggle) pkgToggle.addEventListener('click', function(){ pkgOpen ? closePkg() : openPkg(); });
    pkgOpts.forEach(function(opt){
      opt.addEventListener('click', function(){
        if (pkgSelEl){ pkgSelEl.classList.remove('is-selected'); pkgSelEl.setAttribute('aria-selected', 'false'); }
        pkgSelEl = opt;
        pkgSel = opt.getAttribute('data-pkg');
        opt.classList.add('is-selected');
        opt.setAttribute('aria-selected', 'true');
        closePkg();
      });
    });

    /* close the package menu when clicking outside it */
    document.addEventListener('click', function(e){
      if (pkgOpen && pkgPanel && !pkgPanel.contains(e.target) && e.target !== pkgToggle && pkgToggle && !pkgToggle.contains(e.target)) closePkg();
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var nameEl = document.getElementById('nk-name');
      var emailEl = document.getElementById('nk-email');
      var wishEl = document.getElementById('nk-wish');
      var name = (nameEl && nameEl.value || '').trim();
      var email = (emailEl && emailEl.value || '').trim();
      var wish = (wishEl && wishEl.value || '').trim();
      var lines = 'Safari enquiry\n\n' +
        'Name: ' + (name || '-') + '\n' +
        'Email: ' + (email || '-') + '\n' +
        'Experience: ' + (pkgSel || '-') + '\n' +
        'When: ' + fmtWhen() + '\n' +
        'Hoping to see: ' + (wish || '-');
      // Contact details live in data/site.js. app.js is copied verbatim and
      // cannot import, so read them from the DOM the layout already renders
      // rather than keeping a third hardcoded copy that can silently drift.
      var wa = document.body.getAttribute('data-wa') || '';
      var mail = document.body.getAttribute('data-email') || '';
      var tel = document.body.getAttribute('data-phone') || '';
      window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(lines), '_blank', 'noopener');
      if (wrap) wrap.innerHTML =
        '<div class="form-success">'+
          '<div class="form-success-heading">Asante sana.</div>'+
          '<p class="form-success-body">Your enquiry has opened in WhatsApp, just hit send and it comes straight to Nissa. If nothing opened, message <a href="https://wa.me/'+wa+'" target="_blank" rel="noopener noreferrer">'+tel+'</a> or email <a href="mailto:'+mail+'">'+mail+'</a>.</p>'+
        '</div>';
    });
  })();

  /* ---------- parallax on photo-backed sections ----------
     Borrowed from a reference safari site that used
     `background-attachment: fixed`. That property is ignored by iOS Safari
     and repaints on every scroll frame elsewhere, so this drives the
     existing <img class="photo-bg"> with a compositor-only transform
     instead: same effect, no repaint, and it actually works on a phone.

     styles.css scales .photo-bg by --parallax-scale so the image is larger
     than its section; MAX_SHIFT stays well inside the slack that creates,
     otherwise the section's background would show through at one end of
     the travel.

     Writing to el.style is CSSOM, not a markup-parsed style attribute, so
     it is unaffected by the stylesheet CSP that forbids inline styles. */
  (function(){
    var imgs = Array.prototype.slice.call(document.querySelectorAll('.photo-bg'));
    if (!imgs.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce && reduce.matches) return;

    var MAX_SHIFT = 42; // px either side of centre; see --parallax-scale
    var visible = [];
    var raf = 0;

    function paint(){
      raf = 0;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < visible.length; i++){
        var el = visible[i];
        var section = el.parentElement;
        if (!section) continue;
        var r = section.getBoundingClientRect();
        // -1 when the section sits fully below the fold, +1 fully above it,
        // 0 when its centre is level with the viewport centre.
        var progress = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
        if (progress < -1) progress = -1;
        if (progress > 1) progress = 1;
        el.style.transform =
          'translate3d(0,' + (progress * MAX_SHIFT).toFixed(2) + 'px,0) ' +
          'scale(var(--parallax-scale))';
      }
    }
    function schedule(){ if (!raf) raf = requestAnimationFrame(paint); }

    // Only sections on screen are measured, so a long page does not pay for
    // every parallax image on every frame.
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          var at = visible.indexOf(en.target);
          if (en.isIntersecting && at === -1) visible.push(en.target);
          else if (!en.isIntersecting && at !== -1) visible.splice(at, 1);
        });
        schedule();
      }, { rootMargin: '120px 0px' });
      imgs.forEach(function(el){ el.classList.add('is-parallax'); io.observe(el); });
    } else {
      visible = imgs;
      imgs.forEach(function(el){ el.classList.add('is-parallax'); });
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    // If the visitor turns reduced motion on mid-session, hand the images
    // back to the stylesheet rather than leaving a stale inline transform.
    if (reduce && reduce.addEventListener){
      reduce.addEventListener('change', function(e){
        if (!e.matches) return;
        window.removeEventListener('scroll', schedule);
        imgs.forEach(function(el){ el.style.transform = ''; el.classList.remove('is-parallax'); });
      });
    }
  })();

  /* ---------- live Google reviews (/reviews/) ----------
     Fills #nk-google from /api/google-reviews, a same-origin proxy, and
     unhides the section only if that returns reviews. Google's Places API
     sends no CORS headers and rejects referrer-restricted keys, so the
     browser cannot call it directly; and its policies forbid storing review
     content, so the build cannot bake them in either. See the comment at the
     top of api/google-reviews.js.

     Everything is built with createElement and textContent rather than
     innerHTML: review text is third-party content this site does not
     control, and it is never parsed as markup. */
  (function(){
    var root = document.getElementById('nk-google');
    if (!root) return;

    var listEl = document.getElementById('nk-grev-list');
    var ratingEl = document.getElementById('nk-grev-rating');
    var starsEl = document.getElementById('nk-grev-stars');
    var totalEl = document.getElementById('nk-grev-total');
    var linkEl = document.getElementById('nk-grev-link');

    function stars(n){
      var full = Math.round(n || 0);
      return new Array(5).fill(0).map(function(_, i){ return i < full ? '★' : '☆'; }).join('');
    }

    function card(review){
      var fig = document.createElement('figure');
      fig.className = 'review';

      if (review.rating){
        var st = document.createElement('div');
        st.className = 'review-stars';
        st.setAttribute('aria-label', review.rating + ' out of 5');
        st.textContent = stars(review.rating);
        fig.appendChild(st);
      }

      var quote = document.createElement('blockquote');
      quote.className = 'review-body';
      quote.textContent = review.text;
      fig.appendChild(quote);

      var cap = document.createElement('figcaption');
      cap.className = 'review-by';
      // Google requires the author's name, and their link where there is one,
      // to be displayed with the review.
      if (review.authorUri){
        var a = document.createElement('a');
        a.href = review.authorUri;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = review.author;
        cap.appendChild(a);
      } else {
        cap.appendChild(document.createTextNode(review.author));
      }
      if (review.relativeTime){
        var when = document.createElement('span');
        when.className = 'review-trip';
        when.textContent = review.relativeTime;
        cap.appendChild(when);
      }
      fig.appendChild(cap);
      return fig;
    }

    fetch('/api/google-reviews', { headers: { accept: 'application/json' } })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){
        if (!data || !data.configured || !data.reviews || !data.reviews.length) return;

        if (ratingEl && data.rating) ratingEl.textContent = data.rating.toFixed(1);
        if (starsEl && data.rating) starsEl.textContent = stars(data.rating);
        if (totalEl && data.total){
          totalEl.textContent = data.total === 1
            ? 'from 1 Google review'
            : 'from ' + data.total + ' Google reviews';
        }
        if (linkEl && data.mapsUri) linkEl.href = data.mapsUri;

        data.reviews.forEach(function(review){ listEl.appendChild(card(review)); });
        root.hidden = false;
      })
      .catch(function(){ /* stays hidden; the rest of the page is unaffected */ });
  })();

  /* ---------- review form (/reviews/) ----------
     Same delivery model as the enquiry form above: static site, no backend,
     so the answers are composed into a message and handed to WhatsApp.
     #nk-review-form only renders on /reviews/, so bail out everywhere else
     rather than throwing on a null lookup.

     The consent checkbox is `required` in the markup, so the browser blocks
     submission without it; this never sends a review the guest has not
     agreed to have published, and says so in the message it composes. */
  (function(){
    var form = document.getElementById('nk-review-form');
    if (!form) return;
    var wrap = document.getElementById('nk-review-wrap');

    function val(id){
      var el = document.getElementById(id);
      return ((el && el.value) || '').trim();
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var checked = form.querySelector('input[name="rating"]:checked');
      var rating = checked ? checked.value : '';
      var consent = document.getElementById('nk-rv-consent');
      var lines = 'Safari review\n\n' +
        'Name: ' + (val('nk-rv-name') || '-') + '\n' +
        'From: ' + (val('nk-rv-country') || '-') + '\n' +
        'Trip: ' + (val('nk-rv-trip') || '-') + '\n' +
        'Rating: ' + (rating ? rating + '/5' : '-') + '\n' +
        'Publish on the site: ' + (consent && consent.checked ? 'yes' : 'no') + '\n\n' +
        (val('nk-rv-body') || '-');

      // Contact details come from the DOM attributes the layout renders, for
      // the same reason as the enquiry form: app.js cannot import site.js.
      var wa = document.body.getAttribute('data-wa') || '';
      var mail = document.body.getAttribute('data-email') || '';
      var tel = document.body.getAttribute('data-phone') || '';
      window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(lines), '_blank', 'noopener');
      if (wrap) wrap.innerHTML =
        '<div class="form-success">'+
          '<div class="form-success-heading">Asante sana.</div>'+
          '<p class="form-success-body">Your review has opened in WhatsApp, just hit send and it comes straight to Nissa. If nothing opened, message <a href="https://wa.me/'+wa+'" target="_blank" rel="noopener noreferrer">'+tel+'</a> or email <a href="mailto:'+mail+'">'+mail+'</a>.</p>'+
        '</div>';
    });
  })();

  /* ---------- safaris index: client-side filtering ----------
     Progressive enhancement over the static /safaris/ index: every card
     ships in the HTML already grouped by category (so JS-off visitors and
     crawlers see all 21), and this only ever hides/shows via `.hidden`
     once the two <select> filters are present on the page. */
  function initSafariFilters() {
    const destSelect = document.getElementById('filter-destination');
    const daysSelect = document.getElementById('filter-duration');
    if (!destSelect || !daysSelect) return;

    const cards = [...document.querySelectorAll('.pkg-card[data-destinations]')];
    const count = document.getElementById('filter-count');

    function apply() {
      const dest = destSelect.value;
      const band = daysSelect.value;
      let shown = 0;
      for (const card of cards) {
        const days = Number(card.dataset.days);
        const matchesDest = dest === 'all' || card.dataset.destinations.split(' ').includes(dest);
        const matchesBand =
          band === 'all' ||
          (band === 'short' && days <= 3) ||
          (band === 'medium' && days >= 4 && days <= 6) ||
          (band === 'long' && days >= 7);
        const visible = matchesDest && matchesBand;
        card.hidden = !visible;
        if (visible) shown += 1;
      }
      for (const section of document.querySelectorAll('[data-category-section]')) {
        section.hidden = !section.querySelector('.pkg-card:not([hidden])');
      }
      if (count) count.textContent = `Showing ${shown} of ${cards.length} safaris`;
      // 7 of the 36 destination/length combinations legitimately have no
      // package (there is no 7+ day Samburu-only trip, no short Mount Kenya
      // climb). Without this the page just goes blank.
      const empty = document.getElementById('filter-empty');
      if (empty) empty.hidden = shown !== 0;
    }

    destSelect.addEventListener('change', apply);
    daysSelect.addEventListener('change', apply);
  }
  initSafariFilters();

  /* ---------- privacy choice ----------
     Not a cookie banner: this site sets no cookies at all, and the single
     thing written here is the record of this choice. data/legal.js
     `storage` documents it and test/legal.test.js asserts the two agree,
     so the key name below cannot be changed without the cookie page
     changing with it.

     The choice is stored as JSON carrying the date it was made, so it can
     expire. Consent that never expires is consent someone gave to a
     different website years ago. Twelve months is the widely used figure
     and is what /cookies/ states.

     Any future analytics must be initialised inside loadAnalytics(), which
     is the only place gated on the choice. Nothing runs there today. */
  (function(){
    var KEY = 'nk-consent';
    var MAX_AGE_DAYS = 365;

    /* Reads the stored choice, migrating the original format (a bare
       'accepted' / 'declined' string) rather than discarding it: a visitor
       who already answered should not be asked again just because the
       storage shape changed. Undated records are treated as made now. */
    function read(){
      var raw = null;
      try { raw = localStorage.getItem(KEY); } catch(e) { return null; }
      if (!raw) return null;
      if (raw === 'accepted' || raw === 'declined') return { choice: raw, at: null };
      try {
        var parsed = JSON.parse(raw);
        if (parsed && (parsed.choice === 'accepted' || parsed.choice === 'declined')) return parsed;
      } catch(e) {}
      return null;
    }

    function expired(record){
      if (!record || !record.at) return false;
      var made = Date.parse(record.at);
      if (isNaN(made)) return false;
      return (Date.now() - made) > MAX_AGE_DAYS * 86400000;
    }

    function write(choice){
      try {
        localStorage.setItem(KEY, JSON.stringify({ choice: choice, at: new Date().toISOString() }));
      } catch(e) {}
    }

    function forget(){
      try { localStorage.removeItem(KEY); } catch(e) {}
    }

    function loadAnalytics(){
      /* consent-gated hook: place analytics/measurement init here.
         Nothing loads unless the visitor has chosen "Allow analytics". */
    }

    var record = read();
    if (expired(record)) { forget(); record = null; }
    if (record && record.choice === 'accepted') loadAnalytics();

    /* ---- the banner ---- */
    var el = document.getElementById('nk-consent');
    if (el) {
      var hide = function(){ el.style.display = 'none'; };
      if (record) hide(); else el.style.display = 'flex';

      var accept = document.getElementById('nk-consent-accept');
      var decline = document.getElementById('nk-consent-decline');
      if (accept) accept.addEventListener('click', function(){
        write('accepted'); hide(); loadAnalytics(); render();
      });
      if (decline) decline.addEventListener('click', function(){
        write('declined'); hide(); render();
      });
    }

    /* ---- the control on /cookies/ ----
       Withdrawing a choice has to be as easy as making one, and until this
       existed the banner was a one-way door: answer once and there was no
       way back short of clearing site data by hand. Only renders on
       /cookies/, so bail out everywhere else. */
    var status = document.getElementById('nk-prefs-status');

    function describe(){
      var current = read();
      if (expired(current)) { forget(); current = null; }
      if (!current) return 'Nothing is stored in this browser. The banner will ask you on your next visit.';
      var when = '';
      if (current.at) {
        var d = new Date(current.at);
        if (!isNaN(d.getTime())) when = ', chosen on ' + d.toLocaleDateString(undefined,
          { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return current.choice === 'accepted'
        ? 'Your current choice is Allow analytics' + when + '. Nothing is actually running, because this site has no analytics yet.'
        : 'Your current choice is Essential only' + when + '. Nothing beyond this record is stored in your browser.';
    }

    function render(){ if (status) status.textContent = describe(); }

    if (status) {
      render();
      var on = function(id, fn){
        var b = document.getElementById(id);
        if (b) b.addEventListener('click', function(){ fn(); render(); });
      };
      on('nk-prefs-accept', function(){ write('accepted'); loadAnalytics(); });
      on('nk-prefs-decline', function(){ write('declined'); });
      on('nk-prefs-clear', forget);
    }
  })();

  /* ---------- installable app ----------
     Registers the service worker (sw.js, generated by lib/pwa.js) and drives
     the install button on /app/.

     Every branch below is a real platform difference, not defensive padding:

       - Chrome and Edge fire `beforeinstallprompt`, which must be captured
         and held, because it can only be used from a user gesture later.
       - iOS fires nothing and exposes no API at all. Installing there is
         Share, then Add to Home Screen, by hand, in Safari specifically.
       - An already-installed copy runs in display-mode: standalone, where
         offering to install it again is nonsense.

     The written steps for all three platforms are server-rendered on /app/
     and never touched here, so the page is complete with JavaScript off.
     This only ever enables the shortcut and rewrites the status line. */
  (function(){
    var deferredPrompt = null;
    var status = document.getElementById('nk-install-status');
    var button = document.getElementById('nk-install');

    function standalone(){
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true;
    }

    /* iPadOS reports itself as a Mac, so the touch-point check is what
       actually separates an iPad from a desktop Safari. */
    function isIOS(){
      var ua = navigator.userAgent || '';
      return /iPad|iPhone|iPod/.test(ua) ||
        (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    }

    function say(text){ if (status) status.textContent = text; }

    function showButton(on){
      if (button) button.hidden = !on;
    }

    if (status) {
      if (standalone()) {
        say('Nissa Safaris is installed on this device, and you are reading it right now. Open it any time from your home screen.');
      } else if (isIOS()) {
        say('On an iPhone or iPad, tap the Share button in Safari and choose Add to Home Screen. The steps are below.');
      }
    }

    window.addEventListener('beforeinstallprompt', function(e){
      /* Held rather than fired: the prompt is only allowed from a gesture,
         and springing it on someone who has read nothing is how install
         prompts got their reputation. */
      e.preventDefault();
      deferredPrompt = e;
      if (!button) return;
      showButton(true);
      say('This device can install it in one tap.');
    });

    if (button) {
      button.addEventListener('click', function(){
        if (!deferredPrompt) return;
        var prompt = deferredPrompt;
        deferredPrompt = null;
        showButton(false);
        prompt.prompt();
        prompt.userChoice.then(function(choice){
          if (choice && choice.outcome === 'accepted') {
            say('Installed. Look for the spearhead icon on your home screen.');
          } else {
            say('No problem, nothing was installed. The steps below are here whenever you want it.');
          }
        }).catch(function(){
          say('That did not open. The steps for your device are below.');
        });
      });
    }

    window.addEventListener('appinstalled', function(){
      deferredPrompt = null;
      showButton(false);
      say('Installed. Look for the spearhead icon on your home screen.');
    });

    /* The retry button on /offline/. */
    var retry = document.getElementById('nk-retry');
    if (retry) retry.addEventListener('click', function(){ window.location.reload(); });

    /* Registration last, so a browser that does not support it has still had
       everything above wired up. Deferred to load: the worker's install step
       fetches the precache list, and doing that mid-page-load competes with
       the page's own requests for bandwidth that, on a Kenyan mobile
       connection, the page needs more. */
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function(){
        navigator.serviceWorker.register('/sw.js').catch(function(){
          /* No worker means no offline copy. Nothing else on the site
             depends on it, so there is nothing to tell the visitor. */
        });
      });
    }
  })();
})();
