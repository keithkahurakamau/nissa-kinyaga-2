(function(){
  "use strict";
  var items = [
    { src:'assets/p04.jpg', title:'Leopard at first light', cat:'Wildlife', story:'She had been on this acacia since before dawn. We cut the engine and simply waited, the mountain behind her turning gold.' },
    { src:'assets/lion.jpg', title:'The watch at golden hour', cat:'Wildlife', story:'A coalition male surveying his territory in the last warm light. He held the pose long enough for the whole vehicle to fall silent.' },
    { src:'assets/p14.jpg', title:'Lion in the green season', cat:'Wildlife', story:'After the rains the grass comes up sweet and the prides grow fat. This old male barely lifted his head as we passed.' },
    { src:'assets/kudu.jpg', title:'Greater kudu, low sun', cat:'Wildlife', story:'A bull stepping out of the thicket at the edge of light. Those spiralled horns take six years to reach full turn.' },
    { src:'assets/giraffe.jpg', title:'Giraffe at dusk', cat:'Landscapes', story:'The everyday miracle of Borana, a giraffe browsing the acacia line as the sky burns out behind the hills.' },
    { src:'assets/p05.jpg', title:'King of the koppie', cat:'Wildlife', story:'Lions love a vantage point. From these rocks he can read the whole valley, and so can we.' },
    { src:'assets/p06.jpg', title:'Stillness in the grass', cat:'Wildlife', story:'A leopard waiting out the heat. Patience is the whole craft here, the longer you sit, the more the bush forgets you.' },
    { src:'assets/p08.jpg', title:'Rhino at golden hour', cat:'Conservation', story:'A black rhino grazing under guard. Every one on this conservancy is known by name to the rangers who protect them.' },
    { src:'assets/p12.jpg', title:'Rhino and her escorts', cat:'Conservation', story:'Cattle egrets ride alongside, picking insects from the grass she disturbs. A small partnership, played out daily.' },
    { src:'assets/p10.jpg', title:'Elephants at the river', cat:'Safari Moments', story:'Two bulls crossing below the doum palms in the late afternoon, unhurried, the way only elephants can be.' },
    { src:'assets/p01.jpg', title:'Morning at the waterhole', cat:'Safari Moments', story:'First light at the water draws everyone in. We come early and let the morning fill up around us.' },
    { src:'assets/p03.jpg', title:'Gathering at the shore', cat:'Landscapes', story:'The herds move down to drink as the heat builds. Stand still long enough and the whole plain comes to you.' },
    { src:'assets/p11.jpg', title:"A mother's watch", cat:'Wildlife', story:'A topi standing sentinel over her calf in the long grass, eyes never quite leaving the tree line.' },
    { src:'assets/p02.jpg', title:'Tawny eagle, Rift Valley', cat:'Birdlife', story:'A favourite of mine to point out, perched and scanning. Northern Kenya holds over a thousand species of bird.' },
    { src:'assets/p09.jpg', title:'Gerenuk, Northern Kenya', cat:'Wildlife', story:'The gerenuk rises onto its hind legs to reach what others cannot, a desert antelope built for the dry country.' },
    { src:'assets/p13.jpg', title:'Greater kudu in the bush', cat:'Wildlife', story:'Half-hidden in green, watching us watch him. Read the ears and you will always know the moment before he bolts.' },
    { src:'assets/plane.jpg', title:'Wheels down at the airstrip', cat:'Safari Moments', story:'The bush plane touching down on the conservancy strip, where most journeys into the Northern Frontier begin.' },
    { src:'assets/p15.jpg', title:'Brothers in the gold', cat:'Wildlife', story:'Two coalition males holding the high grass at sundown. Where you find one, look for the other, they rarely range far apart.' },
    { src:'assets/p16.jpg', title:'The dam at last light', cat:'Landscapes', story:'A quiet waterhole below the hills as the day cools. Sit here long enough and the whole conservancy comes down to drink.' },
    { src:'assets/p17.jpg', title:'Wings over the frontier', cat:'Safari Moments', story:'The helicopter waiting under an acacia. For the far reaches of the Northern Frontier, sometimes the only way in is from the air.' },
    { src:'assets/p18.jpg', title:'Down to the sand river', cat:'Landscapes', story:'The green line of a seasonal sand river cutting through the dry country, a magnet for elephant, kudu and a hundred smaller lives.' }
  ];

  var esc = function(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };

  /* ---------- nav scroll + progress ---------- */
  var nav = document.getElementById('nk-nav');
  var bar = document.getElementById('nk-progress');
  var navbar = document.getElementById('nk-navbar');
  function onScroll(){
    var s = window.scrollY > 60;
    nav.classList.toggle('nk-scrolled', s);
    if (s) navbar.classList.add('nk-glass','nk-glass-dark','nk-refract');
    else navbar.classList.remove('nk-glass','nk-glass-dark','nk-refract');
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

  /* ---------- gallery carousel ---------- */
  var gal = document.getElementById('nk-gal');
  function card(it, idx){
    var fig = document.createElement('figure');
    fig.className = 'nk-gcard';
    fig.innerHTML =
      '<img src="'+it.src+'" alt="'+esc(it.title)+'" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>'+
      '<div style="position:absolute;inset:0;background:linear-gradient(transparent 38%,rgba(20,15,9,.62));"></div>'+
      '<figcaption class="nk-glass nk-glass-dark nk-refract" style="position:absolute;left:16px;right:16px;bottom:16px;padding:18px;border-radius:14px;">'+
        '<span style="font-family:\'DM Mono\',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#E6C879;">'+esc(it.cat)+'</span>'+
        '<div style="font-family:\'Cormorant Garamond\',serif;font-size:23px;color:#FBF7EF;margin:5px 0 8px;line-height:1.15;">'+esc(it.title)+'</div>'+
        '<p style="font-size:13px;line-height:1.55;color:#DAD0BC;margin:0 0 14px;">'+esc(it.story)+'</p>'+
        '<button type="button" class="nk-gbtn" data-lb="'+idx+'" style="font-family:\'DM Mono\',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#FBF7EF;padding:10px 18px;cursor:pointer;border-radius:30px;">View image</button>'+
      '</figcaption>';
    return fig;
  }
  if (gal) items.forEach(function(it,i){ gal.appendChild(card(it,i)); });

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
  function openLb(i){ lbIndex = i; renderLb(); lb.style.display = 'flex'; }
  function closeLb(){ lbIndex = null; lb.style.display = 'none'; }
  function stepLb(d){ if (lbIndex === null) return; lbIndex = (lbIndex + d + items.length) % items.length; renderLb(); }
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

  /* ---------- carousel controller (snap + arrows + keyboard) ----------
     Native scroll-snap drives touch swipe and trackpad on every device; arrows,
     keyboard and a live counter give explicit control. The centred card scales
     up for a focal transition. */
  (function(){
    if (!gal) return;
    var cards = Array.prototype.slice.call(gal.querySelectorAll('.nk-gcard'));
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

  /* ---------- custom cursor ---------- */
  (function(){
    var ring = document.getElementById('nk-cursor');
    var dot = document.getElementById('nk-dot');
    if (!ring || !dot) return;
    if (window.matchMedia && window.matchMedia('(hover:none),(pointer:coarse)').matches) return;
    var rx = window.innerWidth/2, ry = window.innerHeight/2, cx = rx, cy = ry;
    window.addEventListener('mousemove', function(e){
      cx = e.clientX; cy = e.clientY;
      dot.style.left = cx+'px'; dot.style.top = cy+'px';
      ring.style.opacity = '1'; dot.style.opacity = '1';
    }, { passive:true });
    (function l(){
      rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(l);
    })();
    document.addEventListener('mouseover', function(e){
      var hot = e.target.closest('a,button,figure,article,[data-exp],input,textarea,[role="img"]');
      ring.classList.toggle('nk-hot', !!hot);
    }, { passive:true });
    document.addEventListener('mouseleave', function(){ ring.style.opacity='0'; dot.style.opacity='0'; });
  })();

  /* ---------- contact form + calendar ---------- */
  (function(){
    var form = document.getElementById('nk-form');
    var wrap = document.getElementById('nk-form-wrap');
    var dateInput = document.getElementById('nk-date');
    var flexInput = document.getElementById('nk-flex');
    var pkg = document.getElementById('nk-pkg');
    var pkgToggle = document.getElementById('nk-pkg-toggle');
    var pkgLabel = document.getElementById('nk-pkg-label');
    var pkgIcon = document.getElementById('nk-pkg-icon');
    var PACKAGES = [
      'Tracking Rhino on Foot, at Dawn',
      'Predator Tracking',
      'Plains & Migration Safaris',
      'Photographic Safaris',
      'Conservation Safaris',
      'Day & Night Game Drives',
      'Horseback Safari',
      'Helicopter & Fixed-Wing',
      'Mountain & E-Biking',
      'High-Altitude Trout Fishing',
      'Quad & Sand Rivers',
      'Anti-Poaching Patrol',
      'Astronomy of the South',
      'Not sure yet — help me choose'
    ];
    var pkgSel = null;
    var pkgOpen = false;
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    /* native date input: block past dates, format for the message */
    var t0 = new Date(); t0.setHours(0,0,0,0);
    function iso(d){ return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
    if (dateInput) dateInput.min = iso(t0);
    if (flexInput) flexInput.addEventListener('change', function(){
      if (flexInput.checked){ dateInput.value = ''; dateInput.disabled = true; dateInput.style.opacity = '.45'; }
      else { dateInput.disabled = false; dateInput.style.opacity = ''; }
    });
    function fmtWhen(){
      if (flexInput && flexInput.checked) return 'Flexible / not sure yet';
      if (dateInput && dateInput.value){
        var pr = dateInput.value.split('-');
        return MONTHS[(+pr[1]) - 1] + ' ' + (+pr[2]) + ', ' + pr[0];
      }
      return '-';
    }

    /* ----- experience / package dropdown ----- */
    function syncPkg(){
      pkgLabel.textContent = pkgSel || 'Choose a safari';
      pkgToggle.style.color = pkgSel ? '#F6EFDE' : '#7F7560';
      pkgIcon.textContent = pkgOpen ? 'CLOSE' : 'SELECT';
      pkgToggle.setAttribute('aria-expanded', pkgOpen ? 'true' : 'false');
    }
    function renderPkg(){
      var html = '';
      PACKAGES.forEach(function(name){
        var isSel = pkgSel === name;
        html += '<button type="button" role="option" class="nk-pkg-opt'+(isSel?' nk-pkg-sel':'')+'" data-pkg="'+name.replace(/"/g,'&quot;')+'" aria-selected="'+(isSel?'true':'false')+'">'+name+'</button>';
      });
      pkg.innerHTML = html;
    }
    function openPkg(){ pkgOpen = true; pkg.style.display = 'block'; renderPkg(); syncPkg(); }
    function closePkg(){ pkgOpen = false; pkg.style.display = 'none'; syncPkg(); }
    pkgToggle.addEventListener('click', function(){ pkgOpen ? closePkg() : openPkg(); });
    pkg.addEventListener('click', function(e){
      var t = e.target.closest('[data-pkg]'); if (!t) return;
      pkgSel = t.getAttribute('data-pkg');
      closePkg();
    });

    /* close the package menu when clicking outside it */
    document.addEventListener('click', function(e){
      if (pkgOpen && !pkg.contains(e.target) && e.target !== pkgToggle && !pkgToggle.contains(e.target)) closePkg();
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
      window.open('https://wa.me/254707415444?text=' + encodeURIComponent(lines), '_blank', 'noopener');
      wrap.innerHTML =
        '<div style="background:#2C3325;border:1px solid rgba(201,162,75,.4);padding:48px 36px;text-align:center;">'+
          '<div style="font-family:\'Cormorant Garamond\',serif;font-size:30px;color:#C9A24B;margin-bottom:12px;">Asante sana.</div>'+
          '<p style="font-size:15px;color:#CFC5AE;line-height:1.6;margin:0 0 18px;">Your enquiry has opened in WhatsApp, just hit send and it comes straight to Nissa. If nothing opened, message <a href="https://wa.me/254707415444" target="_blank" rel="noopener noreferrer" style="color:#C9A24B;">+254 707 415 444</a> or email <a href="mailto:nissasafaris254@gmail.com" style="color:#C9A24B;">nissasafaris254@gmail.com</a>.</p>'+
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
