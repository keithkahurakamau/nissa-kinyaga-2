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
  var track = document.getElementById('nk-track');
  function card(it, idx){
    var fig = document.createElement('figure');
    fig.className = 'nk-gcard';
    fig.style.cssText = 'flex:none;width:clamp(300px,30vw,400px);height:440px;margin:0 22px 0 0;position:relative;overflow:hidden;border-radius:4px;';
    fig.innerHTML =
      '<div role="img" aria-label="'+esc(it.title)+'" style="position:absolute;inset:0;background-image:url(\''+it.src+'\');background-size:cover;background-position:center;"></div>'+
      '<div style="position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(20,15,9,.55));"></div>'+
      '<figcaption class="nk-glass nk-glass-dark nk-refract" style="position:absolute;left:14px;right:14px;bottom:14px;padding:18px;border-radius:14px;">'+
        '<span style="font-family:\'DM Mono\',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#E6C879;">'+esc(it.cat)+'</span>'+
        '<div style="font-family:\'Cormorant Garamond\',serif;font-size:22px;color:#FBF7EF;margin:5px 0 8px;line-height:1.15;">'+esc(it.title)+'</div>'+
        '<p style="font-size:13px;line-height:1.55;color:#DAD0BC;margin:0 0 14px;">'+esc(it.story)+'</p>'+
        '<button type="button" class="nk-gbtn" data-lb="'+idx+'" style="font-family:\'DM Mono\',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#FBF7EF;padding:10px 18px;cursor:pointer;border-radius:30px;">View image</button>'+
      '</figcaption>';
    return fig;
  }
  items.forEach(function(it,i){ track.appendChild(card(it,i)); });
  items.forEach(function(it,i){ track.appendChild(card(it,i)); }); // duplicate set for seamless loop

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

  /* ---------- carousel physics (cursor steer + drag) ---------- */
  (function(){
    var gal = document.getElementById('nk-gal');
    if (!gal || !track) return;
    var half = function(){ return track.scrollWidth / 2; };
    var pos = 0, vel = 0, target = -0.22;
    var drag = false, dragX = 0, dragPos = 0, moved = false;
    gal.addEventListener('mousemove', function(e){
      if (drag) return;
      var r = gal.getBoundingClientRect();
      var t = (e.clientX - r.left) / r.width;
      var d = (t - 0.5) * 2;
      var dead = Math.abs(d) < 0.12 ? 0 : d;
      target = dead * 6;
    }, { passive:true });
    gal.addEventListener('mouseleave', function(){ target = -0.22; });
    gal.addEventListener('mousedown', function(e){ drag = true; moved = false; dragX = e.clientX; dragPos = pos; gal.classList.add('nk-grab'); });
    window.addEventListener('mouseup', function(){ drag = false; gal.classList.remove('nk-grab'); });
    window.addEventListener('mousemove', function(e){
      if (!drag) return;
      var dx = e.clientX - dragX;
      if (Math.abs(dx) > 4) moved = true;
      pos = dragPos + dx; vel = 0; target = 0;
    }, { passive:true });
    gal.addEventListener('click', function(e){
      if (moved){ e.preventDefault(); e.stopPropagation(); return; }
      var btn = e.target.closest('[data-lb]');
      if (btn){ openLb(parseInt(btn.getAttribute('data-lb'), 10)); }
    }, true);
    // touch: native horizontal scroll fallback via drag is non-trivial; allow tap-to-view
    function loop(){
      if (!drag){ vel += (target - vel) * 0.06; pos -= vel; }
      var h = half();
      if (h > 0){ if (pos <= -h) pos += h; if (pos > 0) pos -= h; }
      track.style.transform = 'translateX(' + pos + 'px)';
      requestAnimationFrame(loop);
    }
    loop();
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
    var cal = document.getElementById('nk-cal');
    var calToggle = document.getElementById('nk-cal-toggle');
    var calLabel = document.getElementById('nk-cal-label');
    var calIcon = document.getElementById('nk-cal-icon');
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
    var MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var dayNames = ['S','M','T','W','T','F','S'];
    var today = new Date(); today.setHours(0,0,0,0);
    var baseY = today.getFullYear(), baseM = today.getMonth();
    var sel = null;          // {y,m,d} or {flex:true}
    var open = false;

    function fmtLabel(){
      if (!sel) return 'Select a date';
      if (sel.flex) return 'Flexible / not sure yet';
      return MN[sel.m] + ' ' + sel.d + ', ' + sel.y;
    }
    function syncLabel(){
      calLabel.textContent = fmtLabel();
      calToggle.style.color = sel ? '#F6EFDE' : '#7F7560';
      calIcon.textContent = open ? 'CLOSE' : 'PICK DATE';
      calToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function renderCal(){
      var firstDow = new Date(baseY, baseM, 1).getDay();
      var daysIn = new Date(baseY, baseM + 1, 0).getDate();
      var html = '';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'+
        '<button type="button" data-nav="-1" style="background:none;border:1px solid rgba(201,162,75,.4);color:#E7DDC6;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px;">‹</button>'+
        '<div style="font-family:\'Cormorant Garamond\',serif;font-size:20px;color:#F6EFDE;">'+MN[baseM]+' '+baseY+'</div>'+
        '<button type="button" data-nav="1" style="background:none;border:1px solid rgba(201,162,75,.4);color:#E7DDC6;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px;">›</button>'+
      '</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:6px;">';
      dayNames.forEach(function(d){ html += '<div style="text-align:center;font-family:\'DM Mono\',monospace;font-size:9px;letter-spacing:.05em;color:#8A7E62;padding:4px 0;">'+d+'</div>'; });
      html += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">';
      var i;
      for (i = 0; i < firstDow; i++) html += '<span></span>';
      for (var d = 1; d <= daysIn; d++){
        var dt = new Date(baseY, baseM, d);
        var past = dt < today;
        var isSel = sel && !sel.flex && sel.y === baseY && sel.m === baseM && sel.d === d;
        var bg = isSel ? '#C9A24B' : 'transparent';
        var color = isSel ? '#1B2016' : (past ? '#5A5340' : '#E7DDC6');
        var cursor = past ? 'not-allowed' : 'pointer';
        html += '<button type="button" '+(past?'':'data-day="'+d+'"')+' '+(past?'disabled':'')+
          ' style="height:36px;border:none;background:'+bg+';color:'+color+';font-family:\'Mulish\',sans-serif;font-size:14px;cursor:'+cursor+';border-radius:50%;transition:background .2s ease;">'+d+'</button>';
      }
      html += '</div>';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;border-top:1px solid rgba(201,162,75,.18);padding-top:12px;">'+
        '<button type="button" data-flex="1" style="background:none;border:none;color:#C9A24B;font-family:\'DM Mono\',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">I\'m flexible</button>'+
        '<button type="button" data-close="1" style="background:none;border:none;color:#8A7E62;font-family:\'DM Mono\',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">Close</button>'+
      '</div>';
      cal.innerHTML = html;
    }
    function openCal(){ closePkg(); open = true; cal.style.display = 'block'; renderCal(); syncLabel(); }
    function closeCal(){ open = false; cal.style.display = 'none'; syncLabel(); }
    calToggle.addEventListener('click', function(){ open ? closeCal() : openCal(); });

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
    function openPkg(){ closeCal(); pkgOpen = true; pkg.style.display = 'block'; renderPkg(); syncPkg(); }
    function closePkg(){ pkgOpen = false; pkg.style.display = 'none'; syncPkg(); }
    pkgToggle.addEventListener('click', function(){ pkgOpen ? closePkg() : openPkg(); });
    pkg.addEventListener('click', function(e){
      var t = e.target.closest('[data-pkg]'); if (!t) return;
      pkgSel = t.getAttribute('data-pkg');
      closePkg();
    });

    /* close either popover when clicking outside the form */
    document.addEventListener('click', function(e){
      if (!form.contains(e.target)){ if (open) closeCal(); if (pkgOpen) closePkg(); }
    });
    cal.addEventListener('click', function(e){
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-nav')){
        var delta = parseInt(t.getAttribute('data-nav'),10);
        var m = baseM + delta, y = baseY;
        if (m < 0){ m = 11; y--; } if (m > 11){ m = 0; y++; }
        baseM = m; baseY = y; renderCal(); return;
      }
      if (t.hasAttribute('data-day')){
        sel = { y:baseY, m:baseM, d:parseInt(t.getAttribute('data-day'),10) };
        closeCal(); return;
      }
      if (t.hasAttribute('data-flex')){ sel = { flex:true }; closeCal(); return; }
      if (t.hasAttribute('data-close')){ closeCal(); return; }
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var inputs = form.querySelectorAll('input');
      var name = (inputs[0] && inputs[0].value || '').trim();
      var email = (inputs[1] && inputs[1].value || '').trim();
      var area = form.querySelector('textarea');
      var wish = (area && area.value || '').trim();
      var lines = 'Safari enquiry\n\n' +
        'Name: ' + (name || '-') + '\n' +
        'Email: ' + (email || '-') + '\n' +
        'Experience: ' + (pkgSel || '-') + '\n' +
        'When: ' + fmtLabel() + '\n' +
        'Hoping to see: ' + (wish || '-');
      window.open('https://wa.me/254707415444?text=' + encodeURIComponent(lines), '_blank', 'noopener');
      wrap.innerHTML =
        '<div style="background:#2C3325;border:1px solid rgba(201,162,75,.4);padding:48px 36px;text-align:center;">'+
          '<div style="font-family:\'Cormorant Garamond\',serif;font-size:30px;color:#C9A24B;margin-bottom:12px;">Asante sana.</div>'+
          '<p style="font-size:15px;color:#CFC5AE;line-height:1.6;margin:0 0 18px;">Your enquiry has opened in WhatsApp, just hit send and it comes straight to Nissa. If nothing opened, message <a href="https://wa.me/254707415444" target="_blank" rel="noopener noreferrer" style="color:#C9A24B;">+254 707 415 444</a> or email <a href="mailto:nissasafaris254@gmail.com" style="color:#C9A24B;">nissasafaris254@gmail.com</a>.</p>'+
        '</div>';
    });
  })();

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
