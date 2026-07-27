/* ========================================================
   BEFORE WE BECAME MEMORIES — interactions
======================================================== */

let lenis;
let soundOn = false;
let currentBookmarkPage = 'page-cover';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initLoader();
  bindTopbarControls();
});

/* ---------------- cursor ---------------- */
function initCursor(){
  const cursor = document.getElementById('cursor');
  let ready = false;
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    if(!ready){ ready = true; document.body.classList.add('custom-cursor-ready'); }
  });
  document.querySelectorAll('.polaroid, .icon-btn, .begin-btn, .bounce-bubble, .chair-seat, .pizza-spin, .anklet, .shirt, .dot, .nav-list a')
    .forEach(addHoverGrow);
}
function addHoverGrow(el){
  if(!el) return;
  el.addEventListener('mouseenter', () => document.getElementById('cursor').classList.add('grow'));
  el.addEventListener('mouseleave', () => document.getElementById('cursor').classList.remove('grow'));
}

/* ---------------- loader / intro ---------------- */
function initLoader(){
  setTimeout(typeTitle, 500);
  document.getElementById('begin-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    snapKitKatThenBegin();
  });
  // impatience escape hatch: clicking anywhere on the loader instantly
  // finishes the intro sequence instead of leaving the visitor stuck
  // waiting on an invisible button.
  document.getElementById('loader').addEventListener('click', () => {
    if(document.getElementById('begin-btn').classList.contains('show')) return;
    skipToBegin();
  });
}
function snapKitKatThenBegin(){
  const btn = document.getElementById('begin-btn');
  if(btn.classList.contains('snapping')) return;
  btn.classList.add('snapping');
  setTimeout(beginBook, 420);
}
function typeTitle(){
  const el = document.getElementById('typed-title');
  const text = 'Before We Became Memories';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i];
    i++;
    if(i >= text.length){
      clearInterval(iv);
      el.style.borderRight = 'none';
      setTimeout(() => document.getElementById('loader-subtitle').classList.add('show'), 250);
      setTimeout(() => bloomSunflower(), 750);
      setTimeout(() => document.getElementById('begin-btn').classList.add('show'), 1900);
    }
  }, 62);
  typeTitle._iv = iv;
}
function skipToBegin(){
  clearTimeout(typeTitle._iv);
  const el = document.getElementById('typed-title');
  el.textContent = 'Before We Became Memories';
  el.style.borderRight = 'none';
  document.getElementById('loader-subtitle').classList.add('show');
  bloomSunflower(true);
  document.getElementById('begin-btn').classList.add('show');
}

/* ---- sunflower bloom (signature intro moment) ---- */
function buildSunflowerPetals(){
  const group = document.getElementById('petal-group');
  if(group.dataset.built) return;
  group.dataset.built = '1';
  const svgNS = 'http://www.w3.org/2000/svg';
  const total = 12;
  for(let i = 0; i < total; i++){
    const angle = (360 / total) * i;
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `rotate(${angle} 110 110)`);
    const petal = document.createElementNS(svgNS, 'ellipse');
    petal.setAttribute('cx', '110');
    petal.setAttribute('cy', '58');
    petal.setAttribute('rx', '13');
    petal.setAttribute('ry', '36');
    petal.setAttribute('class', 'petal' + (i % 2 ? ' alt' : ''));
    petal.style.transformOrigin = '110px 58px';
    petal.style.transform = 'scale(0)';
    g.appendChild(petal);
    group.appendChild(g);
  }
}
function bloomSunflower(instant){
  buildSunflowerPetals();
  const stage = document.getElementById('sunflower-stage');
  const svg = document.getElementById('sunflower-svg');
  const chick = document.querySelector('.chick-doodle');
  stage.classList.add('show');
  const petals = document.querySelectorAll('#petal-group .petal');
  if(instant || typeof gsap === 'undefined'){
    petals.forEach(p => p.style.transform = 'scale(1)');
    document.querySelectorAll('.sunflower-center, .sunflower-center-texture').forEach(c => c.style.transform = 'scale(1)');
  } else {
    gsap.to(petals, { scale: 1, duration: .7, ease: 'back.out(2.2)', stagger: .045 });
    gsap.fromTo('.sunflower-center, .sunflower-center-texture', { scale: 0 }, { scale: 1, duration: .5, delay: .3, ease: 'back.out(2)' });
  }
  setTimeout(() => svg.classList.add('grown'), 900);
  setTimeout(() => chick.classList.add('show'), instant ? 0 : 500);
}
function beginBook(){
  const loader = document.getElementById('loader');
  loader.classList.add('closing');
  setTimeout(() => {
    loader.style.display = 'none';
    document.getElementById('book').classList.add('show');
    document.getElementById('topbar').classList.add('show');
    document.getElementById('chapter-dots').classList.add('show');
    initScrollSystems();
  }, 1050);
}

/* ---------------- scroll system (Lenis + ScrollTrigger) ---------------- */
function initScrollSystems(){
  if(typeof gsap === 'undefined' || typeof Lenis === 'undefined'){
    // CDN libraries didn't load (no internet, or blocked) — fall back to plain scroll.
    document.querySelectorAll('.page *').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    toast('Running in fallback mode — reconnect to the internet for full animations');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false, touchMultiplier: 1.5 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  buildChapterNav();
  buildProgressBar();
  buildPageReveals();
  buildSpecialTriggers();

  ScrollTrigger.refresh();
  restoreBookmarkIfAny();
}

function buildProgressBar(){
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { document.getElementById('progress-bar').style.width = (self.progress * 100) + '%'; }
  });
}

function buildChapterNav(){
  const pages = document.querySelectorAll('.page');
  const dotsWrap = document.getElementById('chapter-dots');
  const navList = document.getElementById('nav-list');

  pages.forEach((p, i) => {
    const label = p.dataset.chapter || ('Page ' + (i + 1));

    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.title = label;
    dot.addEventListener('click', () => lenis.scrollTo('#' + p.id));
    dotsWrap.appendChild(dot);
    addHoverGrow(dot);

    const link = document.createElement('a');
    link.href = '#' + p.id;
    link.textContent = label;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo('#' + p.id);
      document.getElementById('nav-drawer').classList.remove('open');
    });
    navList.appendChild(link);
    addHoverGrow(link);

    ScrollTrigger.create({
      trigger: p, start: 'top 55%', end: 'bottom 55%',
      onEnter: () => setActiveDot(i, p.id),
      onEnterBack: () => setActiveDot(i, p.id)
    });
  });
}
function setActiveDot(i, id){
  document.querySelectorAll('.chapter-dots .dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
  currentBookmarkPage = id;
}

function buildPageReveals(){
  const pages = document.querySelectorAll('.page');
  const selector = 'h1,h2,h3,p,.polaroid,.phone-mockup,.notif-banner,.bounce-bubble,.chair-seat,' +
    '.camera-frame,.pizza-spin,.plate,.call-ui,.call-timer,.duel-item,.shirt-swap,.reality-numbers,' +
    '.ending-symbols,.chat-bubble,.map-svg,.note-fold,.letter-card,.starfield,.earring-stage,.anklet-stage';

  pages.forEach((page) => {
    const targets = page.querySelectorAll(selector);
    if(targets.length) gsap.set(targets, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: page,
      start: 'top 75%',
      onEnter: () => revealPage(page, targets),
      onEnterBack: () => revealPage(page, targets)
    });
  });

  // reveal the first page immediately since it's visible before any scroll
  const first = document.getElementById('page-cover');
  revealPage(first, first.querySelectorAll(selector));
}

function revealPage(page, targets){
  if(targets && targets.length && !page.dataset.revealed){
    gsap.to(targets, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out' });
  }
  page.dataset.revealed = '1';
  playPageTurn();
  triggerSpecial(page.id);
}

/* ---------------- per-moment bespoke animations ---------------- */
function triggerSpecial(id){
  switch(id){
    case 'page-3':  typeDMMessages(); break;
    case 'page-4':  gsap.to('.notif-banner', { y: 0, opacity: 1, duration: .8, ease: 'back.out(1.6)' }); break;
    case 'page-5':  typeLine(document.querySelector('.type-line:not(.delay)'), 'Su kare che?', () => {
                       setTimeout(() => typeLine(document.querySelector('.type-line.delay'), 'Su nathi :)'), 500);
                     }); break;
    case 'page-24': document.getElementById('page-24').classList.add('separated'); break;
    case 'page-ending': setTimeout(() => document.getElementById('maliye-text').classList.add('show'), 3000); break;
  }
}

/* Bespoke visuals that now sit below several paragraphs of text get their
   own ScrollTrigger tied to the visual itself, not the page. Otherwise the
   page-level trigger (fired when the tall page's top crosses 75%) finishes
   the animation before the visual has actually scrolled into view. */
function buildSpecialTriggers(){
  const byId = [
    { id: 'map-svg',      fn: animatePlane },
    { id: 'starfield',    fn: buildStarfield },
    { id: 'earring-stage',fn: animateEarring },
    { id: 'call-timer',   fn: animateCallTimer },
    { id: 'petals',       fn: buildPetals }
  ];
  byId.forEach(({ id, fn }) => {
    const el = document.getElementById(id);
    if(!el) return;
    ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: fn, onEnterBack: fn });
  });

  const duelRow = document.querySelector('.duel-row');
  if(duelRow){
    const animateDuel = () => {
      gsap.to('.duel-left', { x: 0, opacity: 1, duration: 1, ease: 'power3.out' });
      gsap.to('.duel-right', { x: 0, opacity: 1, duration: 1, ease: 'power3.out' });
    };
    ScrollTrigger.create({ trigger: duelRow, start: 'top 85%', onEnter: animateDuel, onEnterBack: animateDuel });
  }
}

const dmData = [
  { who: 'them', text: 'okay but why is your bio so mysterious' },
  { who: 'me',   text: "it's supposed to be intriguing" },
  { who: 'them', text: "it's just confusing lol" },
  { who: 'me',   text: 'wow okay' },
  { who: 'them', text: '😂😂 fine it kind of works' }
];
function typeDMMessages(){
  const wrap = document.getElementById('dm-messages');
  if(!wrap || wrap.dataset.done) return;
  wrap.dataset.done = '1';
  dmData.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'msg ' + m.who;
    el.textContent = m.text;
    wrap.appendChild(el);
    gsap.to(el, { opacity: 1, y: 0, duration: .5, delay: i * .45, ease: 'power2.out' });
  });
}

function typeLine(el, text, cb){
  if(!el || el.dataset.done){ if(cb) cb(); return; }
  el.dataset.done = '1';
  let i = 0;
  el.textContent = '';
  const iv = setInterval(() => {
    el.textContent += text[i];
    i++;
    if(i >= text.length){ clearInterval(iv); if(cb) cb(); }
  }, 85);
}

function animatePlane(){
  const path = document.getElementById('flight-path');
  const plane = document.getElementById('plane-icon');
  if(!path || path.dataset.done) return;
  path.dataset.done = '1';
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  gsap.to(path, { strokeDashoffset: 0, duration: 2.4, ease: 'power1.inOut' });
  const tl = gsap.timeline({ delay: .2 });
  tl.to(plane, { attr: { x: 400, y: 60 }, duration: 1.2, ease: 'power1.out' })
    .to(plane, { attr: { x: 690, y: 148 }, duration: 1.2, ease: 'power1.in' });
}

function animateSteam(){
  const steams = document.querySelectorAll('.steam');
  if(!steams.length || steams[0].dataset.done) return;
  steams.forEach(s => s.dataset.done = '1');
  gsap.fromTo(steams, { opacity: 0, y: 0 }, {
    opacity: .55, y: -50, duration: 2.2, repeat: -1, stagger: .5, ease: 'power1.out'
  });
}

function buildStarfield(){
  const field = document.getElementById('starfield');
  if(!field || field.dataset.done) return;
  field.dataset.done = '1';
  for(let i = 0; i < 70; i++){
    const s = document.createElement('span');
    s.style.left = (Math.random() * 100) + '%';
    s.style.top = (Math.random() * 100) + '%';
    s.style.animationDelay = (Math.random() * 3) + 's';
    s.style.animationDuration = (2 + Math.random() * 3) + 's';
    field.appendChild(s);
  }
}

function animateEarring(){
  const el = document.getElementById('earring');
  if(!el || el.dataset.done) return;
  el.dataset.done = '1';
  const tl = gsap.timeline({ delay: .3 });
  tl.to(el, { y: 140, duration: 1, ease: 'bounce.out' })
    .to(el, { x: 110, rotation: 300, duration: 1.1, ease: 'power1.in' })
    .to(el, { opacity: 0, duration: .5 }, '-=0.2');
}

function animateCallTimer(){
  const el = document.getElementById('call-timer');
  if(!el || el.dataset.done) return;
  el.dataset.done = '1';
  const target = 3 * 3600 + 14 * 60 + 27;
  const duration = 2600;
  const start = performance.now();
  function tick(now){
    const p = Math.min(1, (now - start) / duration);
    const val = Math.floor(p * target);
    const h = String(Math.floor(val / 3600)).padStart(2, '0');
    const m = String(Math.floor((val % 3600) / 60)).padStart(2, '0');
    const s = String(val % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function buildPetals(){
  const wrap = document.getElementById('petals');
  if(!wrap || wrap.dataset.done) return;
  wrap.dataset.done = '1';
  for(let i = 0; i < 20; i++){
    const p = document.createElement('span');
    p.textContent = '🌼';
    p.style.left = (Math.random() * 100) + '%';
    p.style.animationDuration = (6 + Math.random() * 6) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    wrap.appendChild(p);
  }
}

/* ---------------- bookmark ---------------- */
function restoreBookmarkIfAny(){
  const saved = localStorage.getItem('bwbm_bookmark');
  const btn = document.getElementById('bookmark-btn');
  if(saved && document.getElementById(saved)){
    btn.classList.add('active');
    setTimeout(() => {
      showResumeToast(saved);
    }, 800);
  }
}
function showResumeToast(pageId){
  const el = document.getElementById('toast');
  el.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = 'Tap to resume from your bookmark 🔖';
  span.style.cursor = 'pointer';
  span.addEventListener('click', () => {
    lenis.scrollTo('#' + pageId, { duration: 1.2 });
    el.classList.remove('show');
  });
  el.appendChild(span);
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 5000);
}

/* ---------------- topbar controls ---------------- */
function bindTopbarControls(){
  document.getElementById('chapter-nav-btn').addEventListener('click', () => {
    document.getElementById('nav-drawer').classList.add('open');
  });
  document.getElementById('nav-close').addEventListener('click', () => {
    document.getElementById('nav-drawer').classList.remove('open');
  });

  const bookmarkBtn = document.getElementById('bookmark-btn');
  bookmarkBtn.addEventListener('click', () => {
    const existing = localStorage.getItem('bwbm_bookmark');
    if(existing){
      localStorage.removeItem('bwbm_bookmark');
      bookmarkBtn.classList.remove('active');
      toast('Bookmark cleared');
    } else {
      localStorage.setItem('bwbm_bookmark', currentBookmarkPage);
      bookmarkBtn.classList.add('active');
      toast('Bookmark saved 🔖 — tap again to clear');
    }
  });

  const soundBtn = document.getElementById('sound-toggle-btn');
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.classList.toggle('active', soundOn);
    toast(soundOn ? 'Page-turn sound on' : 'Page-turn sound off');
  });

  const musicBtn = document.getElementById('music-toggle-btn');
  musicBtn.addEventListener('click', () => {
    const audio = document.getElementById('ambient-audio');
    if(audio.paused){
      audio.volume = .4;
      audio.play().then(() => {
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('active');
      }).catch(() => {
        toast('Add a music file to assets/audio/piano.mp3 to enable this');
      });
    } else {
      audio.pause();
      musicBtn.textContent = '🔇';
      musicBtn.classList.remove('active');
    }
  });

  document.getElementById('dark-toggle-btn').addEventListener('click', (e) => {
    document.body.classList.toggle('dark');
    e.target.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });

  document.getElementById('share-btn').addEventListener('click', () => {
    if(navigator.share){
      navigator.share({ title: 'Before We Became Memories', url: location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(location.href).then(() => toast('Link copied ✨'));
    }
  });
}

function playPageTurn(){
  if(!soundOn) return;
  const audio = document.getElementById('page-turn-sound');
  try{
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }catch(e){ /* no audio file present, ignore */ }
}

function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2400);
}
