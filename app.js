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

  /* ---------- carousel controller (snap + arrows + keyboard) ----------
     Native scroll-snap drives touch swipe and trackpad on every device; arrows,
     keyboard and a live counter give explicit control. The centred card scales
     up for a focal transition. */
  (function(){
    if (!gal) return;
    var cards = galCards;
    if (!cards.length) return;
    var prevBtn = document.getElementById('nk-prev');
    var nextBtn = document.getElementById('nk-next');
    var curEl = document.getElementById('nk-gal-cur');
    var totEl = document.getElementById('nk-gal-total');
    var active = -1, raf = 0, target = 0, settleT = 0;
    var pad = function(n){ return ('0' + n).slice(-2); };
    if (totEl) totEl.textContent = pad(cards.length);

    function update(){
      var gr = gal.getBoundingClientRect();
      var center = gr.left + gr.width / 2;
      var best = 0, bd = Infinity;
      for (var i = 0; i < cards.length; i++){
        var r = cards[i].getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - center);
        if (d < bd){ bd = d; best = i; }
      }
      if (best !== active){
        if (cards[active]) cards[active].classList.remove('is-active');
        cards[best].classList.add('is-active');
        active = best;
        if (curEl) curEl.textContent = pad(active + 1);
      }
      if (prevBtn) prevBtn.disabled = (active <= 0);
      if (nextBtn) nextBtn.disabled = (active >= cards.length - 1);
    }
    // navigation is driven by an explicit target index that increments
    // immediately, so rapid arrow taps accumulate even mid-animation
    function goTo(i){
      target = Math.max(0, Math.min(cards.length - 1, i));
      var gr = gal.getBoundingClientRect();
      var cr = cards[target].getBoundingClientRect();
      var delta = (cr.left + cr.width / 2) - (gr.left + gr.width / 2);
      gal.scrollTo({ left: gal.scrollLeft + delta, behavior:'smooth' });
    }
    function schedule(){ if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }
    // only a genuine user swipe/scroll should resync the target; button-driven
    // scrolling must let the explicit target accumulate
    var userScroll = false;
    gal.addEventListener('wheel', function(){ userScroll = true; }, { passive:true });
    gal.addEventListener('touchstart', function(){ userScroll = true; }, { passive:true });
    gal.addEventListener('scroll', function(){
      schedule();
      if (userScroll){ clearTimeout(settleT); settleT = setTimeout(function(){ target = active; userScroll = false; }, 150); }
    }, { passive:true });
    window.addEventListener('resize', schedule);
    if (prevBtn) prevBtn.addEventListener('click', function(){ goTo(target - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ goTo(target + 1); });
    gal.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight'){ e.preventDefault(); goTo(target + 1); }
      else if (e.key === 'ArrowLeft'){ e.preventDefault(); goTo(target - 1); }
    });
    // tap / click a card opens the lightbox (suppressed if the pointer was dragging/swiping)
    var downX = 0, downY = 0, moved = false;
    gal.addEventListener('pointerdown', function(e){ downX = e.clientX; downY = e.clientY; moved = false; if (e.pointerType !== 'mouse') userScroll = true; }, { passive:true });
    gal.addEventListener('pointermove', function(e){ if (Math.abs(e.clientX - downX) > 8 || Math.abs(e.clientY - downY) > 8) moved = true; }, { passive:true });
    gal.addEventListener('click', function(e){
      var t = e.target.closest('[data-lb]');
      if (!t) return;
      if (moved){ e.preventDefault(); return; }
      openLb(parseInt(t.getAttribute('data-lb'), 10));
    });
    requestAnimationFrame(update);
  })();

  /* ---------- reveal on scroll ---------- */
  (function(){
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)){
      Array.prototype.forEach.call(els, function(el){ el.classList.add('nk-in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('nk-in'); io.unobserve(en.target); } });
    }, { threshold:0, rootMargin:'0px 0px 14% 0px' });
    Array.prototype.forEach.call(els, function(el){ io.observe(el); });
    setTimeout(function(){ Array.prototype.forEach.call(els, function(el){ el.classList.add('nk-in'); }); }, 2600);
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

  /* ---------- privacy / cookie consent ----------
     This site sets no tracking or advertising cookies. The banner records the
     visitor's choice in localStorage (a functional preference, not a tracker).
     Any future analytics must be initialised inside loadAnalytics() so it only
     runs after explicit consent. */
  (function(){
    var KEY = 'nk-consent';
    var el = document.getElementById('nk-consent');
    if (!el) return;
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch(e) {}

    function loadAnalytics(){
      /* consent-gated hook: place analytics/measurement init here.
         Nothing loads unless the visitor has chosen "Allow analytics". */
    }
    function hide(){ el.style.display = 'none'; }
    function remember(v){ try { localStorage.setItem(KEY, v); } catch(e) {} }

    if (stored === 'accepted'){ loadAnalytics(); hide(); }
    else if (stored === 'declined'){ hide(); }
    else { el.style.display = 'flex'; }

    var a = document.getElementById('nk-consent-accept');
    var d = document.getElementById('nk-consent-decline');
    if (a) a.addEventListener('click', function(){ remember('accepted'); hide(); loadAnalytics(); });
    if (d) d.addEventListener('click', function(){ remember('declined'); hide(); });
  })();
})();
