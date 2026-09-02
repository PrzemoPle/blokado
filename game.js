// Trwały zapis na urządzeniu (localStorage) - bezpieczny fallback, gdy niedostępny
const store = {
  get(k, d){ try{ const v = localStorage.getItem('blokado:'+k); return v === null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('blokado:'+k, JSON.stringify(v)); }catch(e){} }
};

let lang = store.get('lang', null) || (navigator.language||'en').slice(0,2);
if(!['pl','en','de','fr'].includes(lang)) lang = 'en';
function t(key){ return I18N[lang][key]; }

function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
  if(currentLayoutIdx !== null) setLayoutLabel();
  if(pieces && pieces.length) renderTray();
}

// ================= Stałe =================
const N = 9;
const COLORS = ['#FF6B6B','#FFC145','#4ECDC4','#5AA9E6','#B388EB','#9BDE7E'];
const MONO_BONUS = 25, GOLD_BONUS = 15, STAR_BONUS = 10, BOMB_PER_CELL = 2;
const MAX_TOKENS = 3, BAR_MAX = 3;

const SHAPES = [
  {cells:[[0,0]], w:1},
  {cells:[[0,0],[0,1]], w:3},
  {cells:[[0,0],[1,0]], w:3},
  {cells:[[0,0],[0,1],[0,2]], w:3},
  {cells:[[0,0],[1,0],[2,0]], w:3},
  {cells:[[0,0],[0,1],[0,2],[0,3]], w:2},
  {cells:[[0,0],[1,0],[2,0],[3,0]], w:2},
  {cells:[[0,0],[0,1],[0,2],[0,3],[0,4]], w:1},
  {cells:[[0,0],[1,0],[2,0],[3,0],[4,0]], w:1},
  {cells:[[0,0],[0,1],[1,0],[1,1]], w:3},
  {cells:[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], w:1},
  {cells:[[0,0],[1,0],[1,1]], w:2},
  {cells:[[0,1],[1,0],[1,1]], w:2},
  {cells:[[0,0],[0,1],[1,1]], w:2},
  {cells:[[0,0],[0,1],[1,0]], w:2},
  {cells:[[0,0],[1,0],[2,0],[2,1],[2,2]], w:1},
  {cells:[[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]], w:1},
  {cells:[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]], w:1},
];

const LAYOUTS = [
  {stones:[], stars:[]},
  {stones:[], stars:[[2,2],[2,6],[6,2],[6,6]]},
  {stones:[[0,0],[0,8],[8,0],[8,8]], stars:[[4,4]]},
  {stones:[[4,4]], stars:[[0,4],[8,4],[4,0],[4,8]]},
  {stones:[[2,4],[6,4]], stars:[[4,2],[4,6]]},
];

function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function todayStr(){
  const d = new Date();
  return String(d.getDate()).padStart(2,'0') + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + d.getFullYear();
}
function todaySeed(){
  const d = new Date();
  return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
}

// ================= Stan =================
let board, stars, score, best = Object.assign({simple:0, advanced:0, daily:0}, store.get('best', {})), streak = 0;
let pieces = [], dragging = null, gameOver = false, mode = null, rng = Math.random;
let rotTokens, monoCharge, bombReady, refillCount, currentLayoutIdx = null;
let tutorialSeen = store.get('tutorialSeen', false);

const boardEl = document.getElementById('board');
const trayEl = document.getElementById('tray');
const ghostEl = document.getElementById('drag-ghost');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overlay = document.getElementById('overlay');
const bombSlot = document.getElementById('bomb-slot');
const segs = document.querySelectorAll('.seg');
const menuEl = document.getElementById('menu');
const tutEl = document.getElementById('tut');

// ================= Dźwięk =================
let audioCtx = null, muted = store.get('muted', false);
document.body.classList.toggle('muted', muted);
document.querySelectorAll('.mute-btn').forEach(b => b.addEventListener('click', () => {
  muted = !muted;
  document.body.classList.toggle('muted', muted);
  store.set('muted', muted);
  if(!muted) sndUi();
}));
// iOS/Safari: odblokuj Web Audio przy pierwszym dotknięciu, żeby pierwszy klik w menu był słyszalny
function unlockAudio(){
  try{ const ctx = ac(); if(!ctx) return; const b = ctx.createBuffer(1,1,22050); const s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0); }catch(e){}
  document.removeEventListener('pointerdown', unlockAudio, true);
}
document.addEventListener('pointerdown', unlockAudio, true);
function ac(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return null;
  if(!audioCtx){ try{ audioCtx = new AC(); }catch(e){ return null; } }
  if(audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function tone(freq, delay, dur, type, vol){
  if(muted) return;
  const ctx = ac();
  if(!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t0); osc.stop(t0 + dur + 0.05);
}
function sndPick(){ tone(430 + Math.random()*40, 0, .06, 'triangle', .10); }
function sndPlace(){ const f = 300 + Math.random()*50; tone(f,0,.09,'triangle',.22); tone(f*1.5,.015,.07,'sine',.10); }
function sndBad(){ tone(160, 0, .12, 'sawtooth', .06); }
function sndRotate(){ tone(660, 0, .05, 'square', .06); }
function sndToken(){ tone(880,0,.12,'sine',.2); tone(1174.66,.1,.18,'sine',.18); }
function sndStar(){ tone(1760, 0, .15, 'sine', .12); }
function sndGold(){ tone(1318.5,0,.12,'sine',.15); tone(1567.98,.08,.16,'sine',.13); }
function sndIce(){ tone(2200,0,.05,'square',.07); tone(1800,.04,.05,'square',.06); }
function sndBomb(){ tone(90,0,.35,'sawtooth',.3); tone(60,.05,.4,'square',.22); tone(45,.1,.5,'sine',.25); }
function sndClear(nLines, mono){
  const base = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  const count = Math.min(nLines + 1, 5);
  for(let i=0;i<count;i++){ tone(base[i], i*0.07, .22, 'sine', .22); tone(base[i]/2, i*0.07, .22, 'triangle', .08); }
  if(mono){ tone(1567.98, count*0.07+.05, .3,'sine',.18); tone(2093.0, count*0.07+.13, .35,'sine',.14); }
}
function sndGameOver(){ [392,329.63,261.63,196].forEach((f,i)=>{ tone(f,i*0.18,.3,'sine',.18); tone(f/2,i*0.18,.3,'triangle',.07); }); }
function sndUi(){ tone(620,0,.05,'triangle',.16); tone(930,.03,.06,'sine',.09); }

// ================= Menu / tryby =================
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.addEventListener('click', ()=>{ lang = b.dataset.lang; store.set('lang', lang); sndUi(); applyLang(); });
});
document.querySelectorAll('.mode-card').forEach(b=>{
  b.addEventListener('click', ()=>{
    sndUi();
    const m = b.dataset.mode;
    if(!tutorialSeen){
      showTutorial(()=>{ tutorialSeen = true; store.set('tutorialSeen', true); startMode(m); });
    } else startMode(m);
  });
});
document.getElementById('howto-btn').addEventListener('click', ()=>{ sndUi(); showTutorial(null); });
document.getElementById('menu-btn').addEventListener('click', ()=>{ sndUi(); overlay.classList.remove('show'); menuEl.classList.add('show'); });
document.getElementById('to-menu').addEventListener('click', ()=>{ sndUi(); overlay.classList.remove('show'); menuEl.classList.add('show'); });

function startMode(m){
  mode = m;
  menuEl.classList.remove('show');
  newGame();
}

// ================= Samouczek =================
let tutStep = 0, tutDone = null;
function tutVisual(i){
  const v = document.getElementById('tut-vis');
  v.innerHTML = '';
  if(i===0){
    for(let k=0;k<5;k++){
      const d = document.createElement('div');
      d.className = 'tv-cell' + (k===4 ? ' ghosty' : ' pulse');
      d.style.background = COLORS[k];
      d.style.animationDelay = (k*0.1)+'s';
      v.appendChild(d);
    }
  } else if(i===1){
    const mini = document.createElement('div');
    mini.className = 'tv-mini';
    [[1,'#5AA9E6'],[0,''],[1,'#5AA9E6'],[1,'#5AA9E6']].forEach(([f,c])=>{
      const d = document.createElement('div');
      if(f) d.style.background = c; else d.style.visibility='hidden';
      mini.appendChild(d);
    });
    v.appendChild(mini);
    const arr = document.createElement('div');
    arr.className = 'tv-icon'; arr.innerHTML = '&#8635;';
    arr.style.color = 'var(--c4)';
    v.appendChild(arr);
    for(let k=0;k<3;k++){
      const tk = document.createElement('div');
      tk.className = 'tv-cell'; tk.innerHTML = '&#8635;';
      tk.style.background = 'var(--c4)'; tk.style.fontSize='14px';
      v.appendChild(tk);
    }
  } else if(i===2){
    for(let k=0;k<4;k++){
      const d = document.createElement('div');
      d.className = 'tv-cell pulse';
      d.style.background = '#4ECDC4';
      d.style.animationDelay = (k*0.1)+'s';
      v.appendChild(d);
    }
    const b = document.createElement('div');
    b.className = 'tv-icon'; b.textContent = '\u{1F4A3}';
    v.appendChild(b);
  } else {
    [['\u2605','var(--slot)'],['','#FFC145'],['\u26A1','#7FB8D8'],['','var(--stone)']].forEach(([ic,c],k)=>{
      const d = document.createElement('div');
      d.className = 'tv-cell';
      d.style.background = c; d.textContent = ic;
      if(k===1) d.style.boxShadow = 'inset 0 0 8px 3px rgba(255,255,255,.7)';
      v.appendChild(d);
    });
  }
}
function renderTutStep(){
  const slides = t('tut');
  tutVisual(tutStep);
  document.getElementById('tut-title').innerHTML = slides[tutStep].title;
  document.getElementById('tut-text').innerHTML = slides[tutStep].text;
  const dots = document.getElementById('tut-dots');
  dots.innerHTML = '';
  slides.forEach((_,i)=>{
    const d = document.createElement('div');
    d.className = 'dot' + (i===tutStep ? ' on' : '');
    dots.appendChild(d);
  });
  const last = tutStep === slides.length-1;
  document.getElementById('tut-next').textContent = last ? (tutDone ? t('play') : t('done')) : t('next');
  document.getElementById('tut-skip').textContent = t('skip');
  document.getElementById('tut-skip').style.visibility = last ? 'hidden' : 'visible';
}
function showTutorial(onDone){
  tutStep = 0; tutDone = onDone;
  renderTutStep();
  tutEl.classList.add('show');
}
function closeTutorial(){
  tutEl.classList.remove('show');
  if(tutDone){ const f = tutDone; tutDone = null; f(); }
}
document.getElementById('tut-next').addEventListener('click', ()=>{
  sndUi();
  if(tutStep < t('tut').length-1){ tutStep++; renderTutStep(); }
  else { tutorialSeen = true; store.set('tutorialSeen', true); closeTutorial(); }
});
document.getElementById('tut-skip').addEventListener('click', ()=>{ sndUi(); tutorialSeen = true; store.set('tutorialSeen', true); closeTutorial(); });

// ================= Gra =================
function setLayoutLabel(){
  document.getElementById('layout-name').textContent =
    t('board') + ': ' + t('layouts')[currentLayoutIdx] + (mode==='daily' ? ' (' + todayStr() + ')' : '');
}

function newGame(){
  if(mode === 'daily' && store.get('dailyDate', '') !== todayStr()){ best.daily = 0; store.set('dailyDate', todayStr()); store.set('best', best); }
  rng = (mode === 'daily') ? mulberry32(todaySeed()) : Math.random;
  let layoutIdx;
  if(mode === 'simple') layoutIdx = 0;
  else if(mode === 'advanced') layoutIdx = 1 + Math.floor(rng()*(LAYOUTS.length-1));
  else layoutIdx = Math.floor(rng()*LAYOUTS.length);
  currentLayoutIdx = layoutIdx;
  const layout = LAYOUTS[layoutIdx];
  setLayoutLabel();

  board = Array.from({length:N}, () => Array(N).fill(null));
  layout.stones.forEach(([r,c])=>{ board[r][c] = {t:'stone'}; });
  stars = new Set(layout.stars.map(([r,c])=>r+','+c));

  score = 0; streak = 0; pieces = []; gameOver = false;
  rotTokens = MAX_TOKENS; monoCharge = 0; bombReady = false; refillCount = 0;
  scoreEl.textContent = 0;
  bestEl.textContent = best[mode];
  boardEl.classList.remove('dim');
  updateTokens(); updateBar();
  renderBoard();
  refillTray();
  overlay.classList.remove('show');
}

function updateScore(add){
  score += add;
  scoreEl.textContent = score;
  if(add > 0){ scoreEl.classList.remove('bump'); void scoreEl.offsetWidth; scoreEl.classList.add('bump'); }
  if(score > best[mode]){ best[mode] = score; bestEl.textContent = score; store.set('best', best); }
}

function updateTokens(gained){
  for(let i=0;i<MAX_TOKENS;i++){
    const el = document.getElementById('tok'+i);
    el.classList.toggle('on', i < rotTokens);
    if(gained && i === rotTokens-1){ el.classList.remove('gain'); void el.offsetWidth; el.classList.add('gain'); }
  }
}

function updateBar(){
  segs.forEach((s,i)=> s.classList.toggle('full', i < monoCharge));
  bombSlot.classList.toggle('ready', bombReady);
}

function renderBoard(){
  boardEl.innerHTML = '';
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const d = document.createElement('div');
    d.className = 'cell';
    const v = board[r][c];
    if(v){
      if(v.t === 'stone') d.classList.add('stone');
      else{
        d.classList.add('filled');
        d.style.background = v.color;
        if(v.kind === 'g') d.classList.add('gold');
        if(v.kind === 'i'){ d.classList.add('ice'); if(v.hp === 1) d.classList.add('cracked'); }
      }
    } else if(stars.has(r+','+c)) d.classList.add('star');
    boardEl.appendChild(d);
  }
}

function cellAt(r,c){ return boardEl.children[r*N+c]; }

function rotateCells(cells){
  const maxR = Math.max(...cells.map(x=>x[0]));
  return cells.map(([r,c])=>[c, maxR - r]);
}

function pickShape(){
  const bag = [];
  SHAPES.forEach((s,i)=>{ for(let k=0;k<s.w;k++) bag.push(i); });
  return SHAPES[bag[Math.floor(rng()*bag.length)]];
}

function genPiece(){
  const shape = pickShape();
  const goldIdx = (rng() < 0.12) ? Math.floor(rng()*shape.cells.length) : -1;
  return { cells: shape.cells.map(x=>x.slice()), color: COLORS[Math.floor(rng()*COLORS.length)],
           used:false, rotUnlocked:false, goldIdx };
}

function refillTray(){
  refillCount++;
  // Uczciwe rozdanie: max JEDEN duży klocek (6+ pól) na tackę,
  // a jeśli świeże rozdanie w całości nie pasuje - przelosuj (do 5 prób).
  // W trybie dziennym determinizm zachowany (przelosowania z tego samego ziarna).
  let attempts = 0;
  do{
    pieces = [];
    let bigUsed = false;
    for(let k=0;k<3;k++){
      let pc, guard = 0;
      do{ pc = genPiece(); guard++; } while(bigUsed && pc.cells.length >= 6 && guard < 30);
      if(pc.cells.length >= 6) bigUsed = true;
      pieces.push(pc);
    }
    attempts++;
  } while(attempts < 5 && !pieces.some(p=>fitsAnywhereCells(p.cells)));
  if(mode !== 'simple' && refillCount % 4 === 0) spawnIce();
  renderTray();
}

function spawnIce(){
  const empty = [];
  for(let r=0;r<N;r++)for(let c=0;c<N;c++) if(board[r][c]===null) empty.push([r,c]);
  if(empty.length < 20) return;
  const [r,c] = empty[Math.floor(rng()*empty.length)];
  board[r][c] = {t:'b', color:'#7FB8D8', kind:'i', hp:2};
  renderBoard();
  sndIce();
}

function renderTray(){
  trayEl.innerHTML = '';
  pieces.forEach((p,idx)=>{
    const slot = document.createElement('div');
    slot.className = 'piece-slot';
    if(!p.used){
      const rows = Math.max(...p.cells.map(c=>c[0]))+1;
      const cols = Math.max(...p.cells.map(c=>c[1]))+1;
      const el = document.createElement('div');
      el.className = 'piece';
      el.style.gridTemplateColumns = `repeat(${cols},18px)`;
      const map = {};
      p.cells.forEach((c,i)=>{ map[c[0]+','+c[1]] = i; });
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        const d = document.createElement('div');
        const key = r+','+c;
        if(key in map){
          d.className = 'pcell' + (map[key] === p.goldIdx ? ' gold' : '');
          d.style.background = p.color;
        } else d.className = 'pcell empty';
        el.appendChild(d);
      }
      const wrap = document.createElement('div');
      wrap.className = 'piece-wrap';
      wrap.appendChild(el);
      slot.appendChild(wrap);
      const fits = affordableFits(p);
      if(!fits){
        el.classList.add('disabled');
        const nw = document.createElement('div');
        nw.className = 'nofit-wrap';
        const warn = document.createElement('div');
        warn.className = 'nofit'; warn.textContent = t('nofit');
        nw.appendChild(warn);
        slot.appendChild(nw);
      } else {
        el.addEventListener('pointerdown', e => startDrag(e, idx));
        const rb = document.createElement('button');
        rb.className = 'rot-btn' + (p.rotUnlocked ? ' unlocked' : '');
        rb.innerHTML = '<span class="ri">&#8635;</span><span>' + t(p.rotUnlocked ? 'rotateFree' : 'rotate') + '</span>';
        rb.disabled = !p.rotUnlocked && rotTokens === 0;
        rb.title = p.rotUnlocked ? t('rotFreeTip') : t('rotUnlockTip');
        rb.addEventListener('click', ev => { ev.stopPropagation(); rotatePiece(idx); });
        rb.addEventListener('pointerdown', ev => ev.stopPropagation());
        slot.appendChild(rb);
      }
    }
    trayEl.appendChild(slot);
  });
}

function rotatePiece(idx){
  const p = pieces[idx];
  if(!p.rotUnlocked){
    if(rotTokens === 0) return;
    rotTokens--; p.rotUnlocked = true;
    updateTokens();
  }
  p.cells = rotateCells(p.cells);
  sndRotate();
  renderTray();
}

function canPlace(cells, r0, c0){
  return cells.every(([r,c])=>{
    const rr=r0+r, cc=c0+c;
    return rr>=0 && rr<N && cc>=0 && cc<N && board[rr][cc]===null;
  });
}

function fitsAnywhereCells(cells){
  for(let r=0;r<N;r++)for(let c=0;c<N;c++) if(canPlace(cells,r,c)) return true;
  return false;
}

function affordableFits(p){
  if(fitsAnywhereCells(p.cells)) return true;
  if(p.rotUnlocked || rotTokens > 0){
    let cs = p.cells;
    for(let i=0;i<3;i++){
      cs = rotateCells(cs);
      if(fitsAnywhereCells(cs)) return true;
    }
  }
  return false;
}

// ================= Drag & drop =================
function startDrag(e, idx){
  if(gameOver) return;
  const isBomb = (idx === 'bomb');
  const p = isBomb ? null : pieces[idx];
  if(!isBomb && !fitsAnywhereCells(p.cells)){ sndBad(); return; }
  e.preventDefault();
  sndPick();

  const boardRect = boardEl.getBoundingClientRect();
  const cellSize = (boardRect.width - 16 - 4*(N-1)) / N;
  const cells = isBomb ? [[0,0]] : p.cells;
  const rows = Math.max(...cells.map(c=>c[0]))+1;
  const cols = Math.max(...cells.map(c=>c[1]))+1;

  ghostEl.innerHTML = '';
  ghostEl.style.display = 'grid';
  ghostEl.style.gridTemplateColumns = `repeat(${cols},${cellSize}px)`;
  const map = {};
  cells.forEach((c,i)=>{ map[c[0]+','+c[1]] = i; });
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const d = document.createElement('div');
    const key = r+','+c;
    d.style.width = d.style.height = cellSize+'px';
    if(key in map){
      d.className = 'gcell' + (!isBomb && map[key] === p.goldIdx ? ' gold' : '');
      if(isBomb){ d.style.background = 'var(--c1)'; d.style.fontSize = cellSize*0.6+'px'; d.textContent = '\u{1F4A3}'; }
      else d.style.background = p.color;
    } else d.className = 'gcell empty';
    ghostEl.appendChild(d);
  }

  const touchLift = e.pointerType === 'touch' ? 70 : 0;
  dragging = {idx, p, isBomb, cellSize, touchLift,
              gw: cols*cellSize + (cols-1)*4, gh: rows*cellSize + (rows-1)*4};
  moveDrag(e);
  window.addEventListener('pointermove', moveDrag, {passive:false});
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
}

function ghostOrigin(e){
  return {x: e.clientX - dragging.gw/2, y: e.clientY - dragging.gh/2 - dragging.touchLift};
}

function moveDrag(e){
  if(!dragging) return;
  e.preventDefault();
  const {x,y} = ghostOrigin(e);
  ghostEl.style.transform = `translate(${x}px,${y}px)`;
  clearPreview();
  const tc = targetCell(x,y);
  if(!tc) return;
  if(dragging.isBomb) showBombPreview(tc.r, tc.c);
  else if(canPlace(dragging.p.cells, tc.r, tc.c)) showPreview(tc.r, tc.c);
}

function targetCell(gx, gy){
  const br = boardEl.getBoundingClientRect();
  const cs = dragging.cellSize + 4;
  const c = Math.round((gx - br.left - 8) / cs);
  const r = Math.round((gy - br.top - 8) / cs);
  if(r < -1 || r > N || c < -1 || c > N) return null;
  return {r: Math.max(0, Math.min(N-1, r)), c: Math.max(0, Math.min(N-1, c))};
}

function clearPreview(){
  boardEl.querySelectorAll('.preview-ok,.will-clear,.bomb-preview').forEach(el=>{
    el.classList.remove('preview-ok','will-clear','bomb-preview');
    if(!el.classList.contains('filled')) el.style.background = '';
  });
}

function showPreview(r0,c0){
  const p = dragging.p;
  const temp = board.map(row=>row.slice());
  p.cells.forEach(([r,c])=>{ temp[r0+r][c0+c] = {t:'b', color:p.color, kind:'n'}; });
  p.cells.forEach(([r,c])=>{
    const el = cellAt(r0+r, c0+c);
    el.classList.add('preview-ok');
    el.style.background = p.color;
  });
  const lines = findFullLines(temp);
  lines.rows.forEach(r=>{ for(let c=0;c<N;c++) cellAt(r,c).classList.add('will-clear'); });
  lines.cols.forEach(c=>{ for(let r=0;r<N;r++) cellAt(r,c).classList.add('will-clear'); });
}

function showBombPreview(r0,c0){
  for(let r=r0-1;r<=r0+1;r++)for(let c=c0-1;c<=c0+1;c++){
    if(r>=0 && r<N && c>=0 && c<N) cellAt(r,c).classList.add('bomb-preview');
  }
}

function endDrag(e){
  window.removeEventListener('pointermove', moveDrag);
  window.removeEventListener('pointerup', endDrag);
  window.removeEventListener('pointercancel', endDrag);
  if(!dragging) return;
  const {x,y} = ghostOrigin(e);
  const tc = targetCell(x,y);
  const d = dragging;
  dragging = null;
  ghostEl.style.display = 'none';
  clearPreview();
  if(!tc){ sndBad(); return; }
  if(d.isBomb){ detonate(tc.r, tc.c, e); return; }
  if(canPlace(d.p.cells, tc.r, tc.c)) placePiece(d.idx, tc.r, tc.c, e);
  else { sndBad(); renderTray(); }
}

// ================= Bomba =================
bombSlot.addEventListener('pointerdown', e => { if(bombReady && !gameOver) startDrag(e, 'bomb'); });

function detonate(r0, c0, e){
  bombReady = false;
  updateBar();
  let destroyed = 0;
  for(let r=r0-1;r<=r0+1;r++)for(let c=c0-1;c<=c0+1;c++){
    if(r<0||r>=N||c<0||c>=N) continue;
    const v = board[r][c];
    if(v && v.t === 'b'){ board[r][c] = null; destroyed++; cellAt(r,c).classList.add('clearing'); }
  }
  sndBomb();
  updateScore(destroyed * BOMB_PER_CELL);
  showFloatText(e, t('boom') + ' +' + (destroyed*BOMB_PER_CELL), '');
  setTimeout(()=>{ renderBoard(); renderTray(); checkGameOver(); }, 320);
}

// ================= Logika =================
function placePiece(idx, r0, c0, e){
  const p = pieces[idx];
  let starHits = 0;
  p.cells.forEach(([r,c],i)=>{
    const rr = r0+r, cc = c0+c;
    board[rr][cc] = {t:'b', color:p.color, kind: (i===p.goldIdx ? 'g' : 'n')};
    if(stars.has(rr+','+cc)){ stars.delete(rr+','+cc); starHits++; }
    const el = cellAt(rr, cc);
    el.classList.remove('star');
    el.classList.add('filled','pop');
    if(i===p.goldIdx) el.classList.add('gold');
    el.style.background = p.color;
  });
  p.used = true;
  updateScore(p.cells.length);
  sndPlace();
  if(starHits > 0){
    updateScore(starHits * STAR_BONUS);
    sndStar();
    showFloatText(e, '\u2605 +' + starHits*STAR_BONUS, 'gold-t', -30);
  }

  const lines = findFullLines(board);
  const nLines = lines.rows.length + lines.cols.length;
  if(nLines > 0){
    streak++;
    let monoLines = 0, goldCleared = 0;
    const lineCells = collectLineCells(lines);
    lines.rows.forEach(r=>{ if(isMonoRow(r)) monoLines++; });
    lines.cols.forEach(c=>{ if(isMonoCol(c)) monoLines++; });
    lineCells.forEach(key=>{
      const [r,c] = key.split(',').map(Number);
      const v = board[r][c];
      if(v && v.t==='b' && v.kind==='g') goldCleared++;
    });

    const lineBonus = nLines*9 + (nLines-1)*9 + (streak-1)*5;
    const monoBonus = monoLines * MONO_BONUS;
    const goldBonus = goldCleared * GOLD_BONUS;
    updateScore(lineBonus + monoBonus + goldBonus);
    sndClear(nLines, monoLines > 0);
    if(goldCleared > 0) sndGold();
    showFloat(e, nLines, lineBonus, monoLines, monoBonus, goldCleared, goldBonus);

    if(monoLines > 0 && !bombReady){
      monoCharge = Math.min(BAR_MAX, monoCharge + monoLines);
      if(monoCharge >= BAR_MAX){ monoCharge = 0; bombReady = true; }
      updateBar();
    }
    if(nLines >= 4 && rotTokens < MAX_TOKENS){
      rotTokens++;
      updateTokens(true);
      sndToken();
      showFloatText(e, t('rotGain'), 'rot', -70);
    }
    animateClear(lines);
  } else {
    streak = 0;
  }

  if(pieces.every(x=>x.used)) refillTray();
  else renderTray();

  setTimeout(checkGameOver, nLines > 0 ? 350 : 50);
}

function isMonoRow(r){
  let col = null;
  for(let c=0;c<N;c++){
    const v = board[r][c];
    if(!v || v.t==='stone') continue;
    if(col === null) col = v.color;
    else if(v.color !== col) return false;
  }
  return col !== null;
}
function isMonoCol(c){
  let col = null;
  for(let r=0;r<N;r++){
    const v = board[r][c];
    if(!v || v.t==='stone') continue;
    if(col === null) col = v.color;
    else if(v.color !== col) return false;
  }
  return col !== null;
}

function findFullLines(b){
  const rows=[], cols=[];
  for(let r=0;r<N;r++) if(b[r].every(v=>v!==null)) rows.push(r);
  for(let c=0;c<N;c++){
    let full=true;
    for(let r=0;r<N;r++) if(b[r][c]===null){full=false;break}
    if(full) cols.push(c);
  }
  return {rows, cols};
}

function collectLineCells(lines){
  const s = new Set();
  lines.rows.forEach(r=>{for(let c=0;c<N;c++)s.add(r+','+c)});
  lines.cols.forEach(c=>{for(let r=0;r<N;r++)s.add(r+','+c)});
  return s;
}

function animateClear(lines){
  const toClear = collectLineCells(lines);
  let anyIce = false;
  toClear.forEach(key=>{
    const [r,c] = key.split(',').map(Number);
    const v = board[r][c];
    if(!v || v.t === 'stone') return;
    if(v.kind === 'i' && v.hp > 1){ anyIce = true; return; }
    cellAt(r,c).classList.add('clearing');
  });
  if(anyIce) sndIce();
  setTimeout(()=>{
    toClear.forEach(key=>{
      const [r,c] = key.split(',').map(Number);
      const v = board[r][c];
      if(!v || v.t === 'stone') return;
      if(v.kind === 'i' && v.hp > 1){ v.hp--; return; }
      board[r][c] = null;
    });
    renderBoard();
  }, 300);
}

function showFloat(e, nLines, lineBonus, monoLines, monoBonus, goldCleared, goldBonus){
  const msgs = t('floats');
  showFloatText(e, msgs[Math.min(nLines,4)-1] + ' +' + lineBonus, '');
  if(monoLines > 0) showFloatText(e, t('mono') + ' +' + monoBonus, 'mono', -36);
  if(goldCleared > 0) showFloatText(e, t('gold') + ' +' + goldBonus, 'gold-t', -104);
}

function showFloatText(e, text, cls, dy){
  const el = document.createElement('div');
  el.className = 'float-text' + (cls ? ' ' + cls : '');
  el.textContent = text;
  el.style.left = Math.min(e.clientX, window.innerWidth-190) + 'px';
  el.style.top = (e.clientY - 60 + (dy||0)) + 'px';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1000);
}

function checkGameOver(){
  const alive = pieces.filter(p=>!p.used);
  if(alive.length && alive.every(p=>!affordableFits(p)) && !bombReady){
    gameOver = true;
    boardEl.classList.add('dim');
    sndGameOver();
    setTimeout(()=>{
      document.getElementById('final-score').textContent = score;
      document.getElementById('new-record').style.display = (score >= best[mode] && score > 0) ? 'block' : 'none';
      document.getElementById('share').style.display = (mode === 'daily') ? 'inline-block' : 'none';
      overlay.classList.add('show');
    }, 700);
  } else {
    renderTray();
  }
}

// ================= Instalacja (PWA) =================
const isStandalone = (window.matchMedia ? window.matchMedia('(display-mode: standalone)').matches : false) || navigator.standalone === true;
if(isStandalone) document.body.classList.add('standalone');
const UA = navigator.userAgent || '';
const isIOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(UA);
const isIOSSafari = isIOS && /Safari/.test(UA) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(UA);
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; });
window.addEventListener('appinstalled', () => { deferredInstall = null; document.body.classList.add('standalone'); document.getElementById('install').classList.remove('show'); });

function renderInstall(){
  const steps = t('instSteps'), intro = t('instIntro');
  const nativeBtn = document.getElementById('inst-native');
  const introEl = document.getElementById('inst-intro');
  const list = document.getElementById('inst-steps');
  let key, introTxt;
  if(isStandalone){ list.innerHTML = ''; introEl.textContent = t('installedNote'); nativeBtn.style.display = 'none'; return; }
  if(isIOS){ key = 'ios'; introTxt = intro.ios + (isIOSSafari ? '' : ' ' + t('instNotSafari')); }
  else if(isAndroid){ key = deferredInstall ? 'androidNative' : 'android'; introTxt = intro.android; }
  else { key = deferredInstall ? 'desktopNative' : 'desktop'; introTxt = intro.desktop; }
  introEl.textContent = introTxt;
  list.innerHTML = steps[key].map(s => '<li>' + s + '</li>').join('');
  nativeBtn.style.display = deferredInstall ? 'inline-block' : 'none';
}
document.getElementById('install-btn').addEventListener('click', ()=>{ sndUi(); renderInstall(); document.getElementById('install').classList.add('show'); });
document.getElementById('inst-close').addEventListener('click', ()=>{ sndUi(); document.getElementById('install').classList.remove('show'); });
document.getElementById('inst-native').addEventListener('click', async ()=>{
  sndUi();
  if(!deferredInstall) return;
  deferredInstall.prompt();
  try{ await deferredInstall.userChoice; }catch(e){}
  deferredInstall = null;
  renderInstall();
});

// ================= Share / restart =================
document.getElementById('share').addEventListener('click', function(){
  sndUi();
  const txt = t('shareText')(todayStr(), score);
  const btn = this;
  function done(){ btn.textContent = t('copied'); setTimeout(()=>btn.textContent = t('copyResult'), 1500); }
  function fallback(){
    const ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta);
    ta.select(); try{ document.execCommand('copy'); done(); }catch(err){}
    ta.remove();
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(done).catch(fallback);
  } else fallback();
});

document.getElementById('restart').addEventListener('click', ()=>{ sndUi(); newGame(); });

// ================= Start =================
document.getElementById('version').textContent = 'v' + APP_VERSION;
applyLang();
