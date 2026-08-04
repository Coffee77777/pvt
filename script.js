/* ========================================================
   BEFORE WE BECAME MEMORIES — interactions
======================================================== */

// password stored as SHA-256 hash — plaintext never lives in source
const PW_HASH = '0ee5422a2f0b7fda05fb1d03bf2afa3095f651ea2d207484d33d1102779911d2';

let lenis;
let soundOn = false;
let currentBookmarkPage = 'page-cover';

document.addEventListener('DOMContentLoaded', () => {
  initPasswordScreen();
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

/* ---- password screen ---- */
function initPasswordScreen(){
  const screen = document.getElementById('pw-screen');
  if(!screen) return;
  const input  = document.getElementById('pw-input');
  const btn    = document.getElementById('pw-btn');
  const error  = document.getElementById('pw-error');

  async function sha256(str){
    const buf = await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2,'0')).join('');
  }

  async function attempt(){
    const hash = await sha256(input.value.trim().toLowerCase());
    if(hash === PW_HASH){
      screen.classList.add('unlocking');
      setTimeout(() => { screen.style.display = 'none'; }, 950);
    } else {
      screen.classList.remove('shake');
      void screen.offsetWidth;
      screen.classList.add('shake');
      error.textContent = 'try again ♡';
      error.classList.add('show');
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', e => { if(e.key === 'Enter') attempt(); });
  input.addEventListener('input', () => error.classList.remove('show'));
}

/* ---- sunflower bloom (signature intro moment) ---- */
function buildSunflowerPetals(){
  const group = document.getElementById('petal-group');
  const innerGroup = document.getElementById('petal-group-inner');
  if(group.dataset.built) return;
  group.dataset.built = '1';
  const svgNS = 'http://www.w3.org/2000/svg';

  // outer petals — 16 pointed ray petals
  const outerCount = 16;
  for(let i = 0; i < outerCount; i++){
    const angle = (360 / outerCount) * i;
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `rotate(${angle} 110 110)`);
    const petal = document.createElementNS(svgNS, 'path');
    petal.setAttribute('d', 'M110 78 C100 64 98 40 110 22 C122 40 120 64 110 78');
    petal.setAttribute('fill', i % 2 === 0 ? '#f5c832' : '#e8a820');
    g.appendChild(petal);
    group.appendChild(g);
  }

  // inner petals — shorter, offset by half step, darker gold
  if(innerGroup && !innerGroup.dataset.built){
    innerGroup.dataset.built = '1';
    for(let i = 0; i < outerCount; i++){
      const angle = (360 / outerCount) * i + (360 / outerCount / 2);
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('transform', `rotate(${angle} 110 110)`);
      const petal = document.createElementNS(svgNS, 'path');
      petal.setAttribute('d', 'M110 78 C105 72 104 59 110 49 C116 59 115 72 110 78');
      petal.setAttribute('fill', '#c98c12');
      g.appendChild(petal);
      innerGroup.appendChild(g);
    }
  }
}

function bloomSunflower(instant){
  buildSunflowerPetals();
  const stage = document.getElementById('sunflower-stage');
  const svg   = document.getElementById('sunflower-svg');
  const chick = document.querySelector('.chick-doodle');
  stage.classList.add('show');

  const outerGs = document.querySelectorAll('#petal-group > g');
  const innerGs = document.querySelectorAll('#petal-group-inner > g');
  const centers = '.sunflower-center, .sunflower-center-texture, .sunflower-center-ring';

  if(instant || typeof gsap === 'undefined'){
    document.querySelectorAll(centers).forEach(c => c.style.transform = 'scale(1)');
  } else {
    gsap.set([...outerGs, ...innerGs], { scale: 0, svgOrigin: '110 110' });
    gsap.to(outerGs, { scale: 1, duration: .65, ease: 'back.out(2.2)', stagger: .04, svgOrigin: '110 110' });
    gsap.to(innerGs, { scale: 1, duration: .45, ease: 'back.out(2)',   stagger: .03, delay: .3, svgOrigin: '110 110' });
    gsap.fromTo(centers, { scale: 0 }, { scale: 1, duration: .5, delay: .55, ease: 'back.out(2)', svgOrigin: '110 110' });
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

  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if(!isTouch){
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // normalizeScroll tames iOS momentum & direction-change bounce
    ScrollTrigger.normalizeScroll({ allowNestedScroll: true, momentum: self => Math.min(3, self.velocityY * 0.3) });
    window.addEventListener('scroll', ScrollTrigger.update, { passive: true });
  }

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
    dot.addEventListener('click', () => lenis ? lenis.scrollTo('#' + p.id) : p.scrollIntoView({ behavior:'smooth' }));
    dotsWrap.appendChild(dot);
    addHoverGrow(dot);

    const link = document.createElement('a');
    link.href = '#' + p.id;
    link.textContent = label;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      lenis ? lenis.scrollTo('#' + p.id) : p.scrollIntoView({ behavior:'smooth' });
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
    { id: 'starfield-2',  fn: buildStarfield },
    { id: 'earring-stage',fn: animateEarring },
    { id: 'call-timer',   fn: animateCallTimer },
    { id: 'petals',       fn: buildPetals },
    { id: 'bokeh-field',  fn: buildBokeh },
    { id: 'mote-field',   fn: buildMotes },
    { id: 'ladoo-field',  fn: buildLadoos }
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
  ['starfield','starfield-2'].forEach(id => {
    const field = document.getElementById(id);
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
  });
}

function buildBokeh(){
  const field = document.getElementById('bokeh-field');
  if(!field || field.dataset.done) return;
  field.dataset.done = '1';
  const colors = ['rgba(200,140,255,.55)','rgba(255,180,80,.45)','rgba(100,160,255,.4)','rgba(255,120,160,.4)','rgba(180,255,200,.35)'];
  for(let i = 0; i < 22; i++){
    const s = document.createElement('span');
    const size = 30 + Math.random() * 90;
    s.style.cssText = `
      left:${Math.random()*100}%;
      bottom:${-10 + Math.random()*30}%;
      width:${size}px; height:${size}px;
      background:${colors[i % colors.length]};
      animation-duration:${6 + Math.random()*10}s;
      animation-delay:${Math.random()*8}s;
    `;
    field.appendChild(s);
  }
}

function buildMotes(){
  const field = document.getElementById('mote-field');
  if(!field || field.dataset.done) return;
  field.dataset.done = '1';
  for(let i = 0; i < 35; i++){
    const s = document.createElement('span');
    const size = 2 + Math.random() * 4;
    s.style.cssText = `
      left:${Math.random()*100}%;
      bottom:${Math.random()*30}%;
      width:${size}px; height:${size}px;
      animation-duration:${4 + Math.random()*7}s;
      animation-delay:${Math.random()*6}s;
    `;
    field.appendChild(s);
  }
}

function buildLadoos(){
  const field = document.getElementById('ladoo-field');
  if(!field || field.dataset.done) return;
  field.dataset.done = '1';
  for(let i = 0; i < 18; i++){
    const s = document.createElement('span');
    const size = 16 + Math.random() * 36;
    const dx  = (Math.random() - 0.5) * 60;
    const dx2 = (Math.random() - 0.5) * 60;
    s.style.cssText = `
      left:${5 + Math.random()*90}%;
      bottom:${-5 + Math.random()*20}%;
      width:${size}px; height:${size}px;
      --dx:${dx}px; --dx2:${dx2}px;
      animation-duration:${7 + Math.random()*9}s;
      animation-delay:${Math.random()*7}s;
    `;
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
    lenis ? lenis.scrollTo('#' + pageId, { duration: 1.2 }) : document.getElementById(pageId)?.scrollIntoView({ behavior:'smooth' });
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
    if(!ambientPlaying){
      startAmbient();
      musicBtn.textContent = '🔊';
      musicBtn.classList.add('active');
      toast('Ambient music on 🎵');
    } else {
      stopAmbient();
      musicBtn.textContent = '🔇';
      musicBtn.classList.remove('active');
      toast('Music off');
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
  // try audio file first, fall back to Web Audio synthesis
  const audio = document.getElementById('page-turn-sound');
  const played = audio.play();
  if(played) played.catch(() => synthPageTurn());
  else synthPageTurn();
}

function synthPageTurn(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const dur = 0.13;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i = 0; i < data.length; i++){
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.8) * 0.4;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 2800;
    filt.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.55, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(filt);
    filt.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    setTimeout(() => { try{ ctx.close(); }catch(e){} }, 600);
  }catch(e){}
}

/* ---- ambient music (Web Audio API) ---- */
let ambientCtx = null, ambientMaster = null, ambientPlaying = false;

function startAmbient(){
  try{
    ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
    ambientMaster = ambientCtx.createGain();
    ambientMaster.gain.setValueAtTime(0, ambientCtx.currentTime);
    ambientMaster.gain.linearRampToValueAtTime(0.16, ambientCtx.currentTime + 3);
    ambientMaster.connect(ambientCtx.destination);

    // C major chord — C4, E4, G4, C5 — soft sine waves, slightly detuned for warmth
    [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
      [-2, 0, 2].forEach(cent => {
        const osc = ambientCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.detune.value = cent;
        const g = ambientCtx.createGain();
        g.gain.value = 0.07 / (i + 1);
        osc.connect(g);
        g.connect(ambientMaster);
        osc.start();
      });
    });
    ambientPlaying = true;
  }catch(e){}
}

function stopAmbient(){
  if(ambientMaster && ambientCtx){
    ambientMaster.gain.linearRampToValueAtTime(0, ambientCtx.currentTime + 1.2);
    setTimeout(() => {
      try{ ambientCtx.close(); }catch(e){}
      ambientCtx = null; ambientMaster = null;
    }, 1400);
  }
  ambientPlaying = false;
}

function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2400);
}
