{
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
root.classList.add('js');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(pointer: fine)').matches;
const EMAIL='asmiyasayyad135@gmail.com';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
$$('.mailtxt').forEach(e=>{e.textContent=EMAIL});

/* ---------------- sound (Web Audio, synthesised, no files) ---------------- */
const Snd={on:store.get('snd')==='1',ctx:null,
  ac(){if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{this.ctx=new C()}catch(e){return null}}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx},
  noise(d){const c=this.ctx,b=c.createBuffer(1,Math.floor(c.sampleRate*d),c.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;return b},
  whoosh(){if(!this.on)return;const c=this.ac();if(!c)return;const s=c.createBufferSource();s.buffer=this.noise(.5);const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=1.1;const t=c.currentTime;
    f.frequency.setValueAtTime(380,t);f.frequency.exponentialRampToValueAtTime(3000,t+.22);f.frequency.exponentialRampToValueAtTime(500,t+.46);
    const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32,t+.07);g.gain.exponentialRampToValueAtTime(.001,t+.48);s.connect(f).connect(g).connect(c.destination);s.start(t);s.stop(t+.5)},
  pop(){if(!this.on)return;const c=this.ac();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type='triangle';o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(220,t+.12);
    g.gain.setValueAtTime(.22,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.16)},
  thud(){if(!this.on)return;const c=this.ac();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(38,t+.3);
    g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.36)},
  pluck(f,t,dur){const c=this.ctx,sr=c.sampleRate,N=Math.max(2,Math.round(sr/f)),len=Math.floor(sr*dur),b=c.createBuffer(1,len,sr),d=b.getChannelData(0),buf=new Float32Array(N);
    for(let i=0;i<N;i++)buf[i]=Math.random()*2-1;let ix=0;for(let i=0;i<len;i++){const nx=(ix+1)%N,v=buf[ix];d[i]=v;buf[ix]=.996*.5*(v+buf[nx]);ix=nx}
    const s=c.createBufferSource();s.buffer=b;const g=c.createGain();g.gain.value=.32;s.connect(g).connect(c.destination);s.start(t)},
  riff(){const c=this.ac();if(!c)return;const n=[329.63,392,440,493.88,587.33,659.25,587.33,493.88,440,493.88];let t=c.currentTime+.03;n.forEach((f,i)=>this.pluck(f,t+i*.15+(i>5?.08:0),1.3))}
};
const sndBtn=$('#sndBtn');
const syncSnd=()=>sndBtn.setAttribute('aria-pressed',String(Snd.on));
syncSnd();
sndBtn.addEventListener('click',()=>{Snd.on=!Snd.on;store.set('snd',Snd.on?'1':'0');syncSnd();if(Snd.on){Snd.ac();Snd.pop();toast('Sound on: page flips, pops and stamps.')}else toast('Sound off.')});

/* ---------------- toast + copy email ---------------- */
const toastEl=$('#toast');let tt;
function toast(m){toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),2800)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;e.preventDefault();
  const ok=()=>toast('Copied! '+EMAIL),no=()=>toast('Email: '+EMAIL);
  try{navigator.clipboard?navigator.clipboard.writeText(EMAIL).then(ok,no):no()}catch(err){no()}});

/* ---------------- loader + typed tagline ---------------- */
let booted=RM;
const pct=$('#pct');
if(RM){root.classList.add('loaded')}else{
  const t0=performance.now();const tk=now=>{const v=Math.min(100,Math.round((now-t0)/13));pct.textContent=v;if(v<100)requestAnimationFrame(tk)};requestAnimationFrame(tk);
  setTimeout(()=>{root.classList.add('loaded');booted=true},2900);
  setTimeout(()=>Snd.thud(),1450);
}
const typed=$('#typed');
if(typed&&!RM){const full=typed.dataset.text;typed.textContent='';let i=0;setTimeout(function ty(){typed.textContent=full.slice(0,++i);if(i<full.length)setTimeout(ty,22+Math.random()*28)},2900)}

/* ---------------- cursor + click sound-effect words ---------------- */
if(FINE&&!RM){root.classList.add('cur');const pen=$('#pen');addEventListener('pointermove',e=>{pen.style.transform=`translate(${e.clientX}px,${e.clientY}px)`},{passive:true})}
const WORDS=['POW!','ZAP!','KLIK!','BAM!','WHAM!','BOOP!','ZING!','POK!'];
function popWord(x,y,w){if(RM)return;const s=document.createElement('span');s.className='pop';s.textContent=w||WORDS[Math.floor(Math.random()*WORDS.length)];s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),760)}
addEventListener('pointerdown',e=>{if(e.target.closest('input,.msgs,.poke'))return;popWord(e.clientX,e.clientY);Snd.pop()});

/* ---------------- stars ---------------- */
let sd=135;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
$$('#stars i').forEach(el=>{const a=[];for(let i=0;i<70;i++)a.push(`${Math.round(rnd()*2200)}px ${Math.round(rnd()*1100)}px 0 ${['#FFFCF4','#F8DE3F','#BCC1F8'][Math.floor(rnd()*3)]}`);el.style.boxShadow=a.join(',')});

let vh=innerHeight,cur=-1,dirty=true,jumping=false,zoneB=-1,sheetOn=false;
/* ---------------- scroll-driven reveals: no timers, everything follows the scroll position ---------------- */
const RV=[...new Set($$('main [data-r],main .label,main .tree,main .teamup,main .tc'))].filter(el=>!el.closest('#cover,.rack-stage')).map(el=>{
  const tc=el.classList.contains('tc');const d=parseFloat(el.style.getPropertyValue('--d'))||0;
  return{el,y:0,rv:-1,q:-1,off:d*.35+(tc?[...el.parentNode.children].indexOf(el)*.07:0),w:tc?.5:.35,qw:.7}});
const CNT=$$('[data-count]').map(el=>({el,y:0,to:+el.dataset.count,dec:+(el.dataset.dec||0),suf:el.dataset.suf||'',last:''}));
$$('.pile i').forEach(i=>i.style.setProperty('--o',(.25+(parseFloat(i.style.getPropertyValue('--dl'))||0)*.5).toFixed(3)));
const backOut=x=>{const c1=1.70158,c3=c1+1;return 1+c3*(x-1)**3+c1*(x-1)**2};
function docTop(el){if(!('offsetTop' in el))return el.getBoundingClientRect().top+scrollY;let y=0;while(el){y+=el.offsetTop;el=el.offsetParent}return y}
function remeasure(){RV.forEach(o=>{o.y=docTop(o.el)});CNT.forEach(o=>{o.y=docTop(o.el)});dirty=true}
function reveals(){const sy=scrollY;
  RV.forEach(o=>{const base=vh*.95-o.off*vh-(o.y-sy);const rv=RM?1:clamp(base/(vh*o.w)),q=RM?1:clamp(base/(vh*o.qw));const st=o.el.style;
    if(rv!==o.rv){o.rv=rv;st.setProperty('--rv',rv.toFixed(3));st.setProperty('--re',backOut(rv).toFixed(3))}
    if(q!==o.q){o.q=q;st.setProperty('--q',q.toFixed(3));st.setProperty('--qe',(1-(1-q)**3).toFixed(3))}});
  CNT.forEach(o=>{const k=RM?1:clamp((vh*.95-(o.y-sy))/(vh*.5));const v=o.to*(1-(1-k)**3);const t=(o.dec?v.toFixed(o.dec):Math.round(v).toLocaleString('en-IN'))+o.suf;if(t!==o.last){o.last=t;o.el.textContent=t}});
}

/* ---------------- pages, scrub loop, page flip ---------------- */
const pages=$$('main > section.page');const N=pages.length;
const pgc=$('#pgc'),inkbar=$('#inkbar');
const scrubs=$$('[data-scrub]');
const hooks={};
const flipEl=$('#flip'),sheet=$('#sheet'),shade=$('#shade'),fnum=$('#fnum'),ftitle=$('#ftitle'),fsfx=$('#fsfx');
let flipsOn=store.get('flip')!=='0',flipping=false;
const flipBtn=$('#flipBtn');
const syncFlip=()=>flipBtn.setAttribute('aria-pressed',String(flipsOn));
syncFlip();
flipBtn.addEventListener('click',()=>{flipsOn=!flipsOn;dirty=true;store.set('flip',flipsOn?'1':'0');syncFlip();toast(flipsOn?'Page flips on. Cross a section to see one.':'Page flips off. Smooth reading mode.')});
const FSFX=['FLIP!','SHFF!','FWIP!','SWOOSH!','KA-FLIP!','FLAP!'];
const PEEK=['neutral','think','smug','excited','wink','smug','excited','think','angry','pout','smug','excited','wink','think','excited'];const peek=$('#peek');
function setSheet(i){const s=pages[i];const pf=PEEK[i%PEEK.length];peek.src=pf==='neutral'?'assets/cutout.webp':'assets/cut-'+pf+'.webp';fnum.textContent='PAGE '+String(i+1).padStart(2,'0')+' / '+N;ftitle.textContent=s.dataset.page;fsfx.textContent=FSFX[(i*5)%FSFX.length];sheet.style.setProperty('--acc',s.dataset.acc||'#EC3B3B')}
async function flip(i,dir,mid){
  if(!flipsOn||RM){if(mid)mid();return}
  if(flipping){setSheet(i);if(mid)mid();return}
  flipping=true;setSheet(i);flipEl.classList.add('on');Snd.whoosh();
  const a1=dir>0?92:-92,a2=dir>0?-92:92;
  sheet.style.transformOrigin=dir>0?'100% 50%':'0% 50%';
  const e1='cubic-bezier(.2,.75,.25,1)',e2='cubic-bezier(.6,0,.8,.35)';
  const A=sheet.animate([{transform:`rotateY(${a1}deg)`},{transform:'rotateY(0deg)'}],{duration:430,easing:e1,fill:'forwards'});
  const As=shade.animate([{opacity:.75},{opacity:0}],{duration:430,easing:e1,fill:'forwards'});
  try{await A.finished}catch(e){}
  if(mid)mid();
  await wait(170);
  sheet.style.transformOrigin=dir>0?'0% 50%':'100% 50%';
  const B=sheet.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${a2}deg)`}],{duration:420,easing:e2,fill:'forwards'});
  const Bs=shade.animate([{opacity:0},{opacity:.75}],{duration:420,easing:e2,fill:'forwards'});
  try{await B.finished}catch(e){}
  flipEl.classList.remove('on');[A,As,B,Bs].forEach(a=>a.cancel());flipping=false;
}
function jumpTo(id){
  const t=document.getElementById(id);if(!t)return;const i=pages.indexOf(t.closest('main > section.page'));
  const go=()=>{window.scrollTo({top:t.getBoundingClientRect().top+scrollY,behavior:'instant'});dirty=true};
  if(!flipsOn||RM||i<0){t.scrollIntoView({behavior:RM?'auto':'smooth'});return}
  jumping=true;const dir=i>=cur?1:-1;cur=i;updCounter();
  flip(i,dir,go).then(()=>{jumping=false;sheetOn=false;zoneB=-1;dirty=true});
}
function updCounter(){pgc.textContent=`PAGE ${String(cur+1).padStart(2,'0')} / ${N}`}
function prog(el,r){const t=el.dataset.scrub;if(t==='pin'){const span=r.height-vh;return span>0?clamp(-r.top/span):0}
  if(t==='view2')return clamp((vh-r.top)/(r.height+vh));return clamp((vh*.85-r.top)/(vh*.6))}
function update(){
  const H=document.documentElement.scrollHeight-vh;
  const rects=scrubs.map(el=>el.getBoundingClientRect());
  const tops=pages.map(p=>p.getBoundingClientRect().top);
  inkbar.style.setProperty('--sp',H>0?clamp(scrollY/H).toFixed(4):0);
  scrubs.forEach((el,k)=>{const p=RM?1:prog(el,rects[k]);if(el._p!==p){el._p=p;el.style.setProperty('--p',p.toFixed(4));const h=hooks[el.id];if(h)h(p,el)}});
  let idx=0;for(let i=0;i<N;i++)if(tops[i]<=vh*.5)idx=i;
  if(idx!==cur&&!jumping){cur=idx;updCounter()}
  reveals();
  /* scroll-driven page flip: the sheet's angle follows the next section's top edge as it crosses the screen */
  if(!flipping&&!jumping){
    let bi=-1,t=0;
    if(flipsOn&&!RM&&booted)for(let i=1;i<N;i++){const b=tops[i];if(b<vh*.8&&b>vh*.2){bi=i;t=(vh*.8-b)/(vh*.6);break}}
    if(bi<0){if(sheetOn){flipEl.classList.remove('on');sheetOn=false}zoneB=-1}
    else{
      if(bi!==zoneB){zoneB=bi;setSheet(bi);Snd.whoosh()}
      const sm=x=>x*x*(3-2*x);let ang=0,org='0% 50%',sh=0;
      if(t<.42){const k=sm(t/.42);ang=92*(1-k);org='100% 50%';sh=.75*(1-k)}
      else if(t>.58){const k=sm((t-.58)/.42);ang=-92*k;sh=.75*k}
      sheet.style.transformOrigin=org;sheet.style.transform=`rotateY(${ang.toFixed(2)}deg)`;shade.style.opacity=sh.toFixed(3);
      if(!sheetOn){flipEl.classList.add('on');sheetOn=true}
    }
  }
}
addEventListener('scroll',()=>{dirty=true},{passive:true});
function measure(){vh=innerHeight;remeasure();flipEl.style.perspective=Math.max(1800,innerWidth*2.3)+'px';const f=$('#foot'),sp=$('#spacer');if(f&&sp)sp.style.height=f.offsetHeight+'px';dirty=true}
addEventListener('resize',measure);
const mainRO=new ResizeObserver(()=>remeasure());mainRO.observe($('#main'));
addEventListener('load',remeasure);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(remeasure);
(function loop(){if(dirty){dirty=false;update()}requestAnimationFrame(loop)})();

document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"],[data-jump]');if(!a)return;const id=a.dataset.jump||a.getAttribute('href').slice(1);if(!id||!document.getElementById(id))return;e.preventDefault();closeToc();jumpTo(id)});

/* contents */
const toc=$('#toc'),tocList=$('#tocList');
tocList.innerHTML=pages.map((p,i)=>`<li><button data-jump="${p.id}"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="t"></span><span class="k">page ${i+1}</span></button></li>`).join('');
$$('.t',tocList).forEach((s,i)=>{s.textContent=pages[i].dataset.page});
function openToc(){toc.classList.add('on');$('#tocX').focus()}
function closeToc(){toc.classList.remove('on')}
$('#tocBtn').addEventListener('click',openToc);$('#tocX').addEventListener('click',closeToc);
toc.addEventListener('click',e=>{if(e.target===toc)closeToc()});

/* ---------------- cover: parallax, expressions, blink ---------------- */
const cover=$('#cover'),heroMe=$('#heroMe'),faces=$$('.face',heroMe),hb=$('#heroBubble');
hooks.cover=(p,el)=>el.classList.toggle('front',p>.6);
if(FINE&&!RM)cover.addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;cover.style.setProperty('--mx',(x*-26).toFixed(1)+'px');cover.style.setProperty('--my',(y*-10).toFixed(1)+'px')});
const LINES={neutral:['','Psst. Click me. Then scroll. The villain is waiting.'],wink:['WINK!','Yes, I build AI. Yes, it ships.'],smug:['HEH.','Ask me about the 57% token cut.'],
  excited:['YAY!','Five projects and an IEEE paper. Keep scrolling!'],think:['HMM??','Wondering what I built? Try page 04.'],pout:['HMPH.','You stopped scrolling. Rude.'],
  nervous:['GULP!','Wait. Is that Dr. Busywork behind you?'],angry:['GRRR!','Busywork, you are going DOWN.']};
const ORDER=['wink','smug','excited','think','pout','nervous','angry'];
let heroFace='neutral',hf=0,heroReset;
function setHero(f,quiet){heroFace=f;faces.forEach(i=>i.classList.toggle('on',i.dataset.f===f));if(!quiet){heroMe.classList.remove('squash');void heroMe.offsetWidth;heroMe.classList.add('squash');hb.textContent=LINES[f][1]}}
$('#poke').addEventListener('click',e=>{const f=ORDER[hf++%ORDER.length];setHero(f);const r=hb.getBoundingClientRect();popWord(r.left+20,r.top,LINES[f][0]);Snd.pop();clearTimeout(heroReset);heroReset=setTimeout(()=>setHero('neutral'),3200)});
function blinker(el,ok){if(RM||!el)return;(function go(){setTimeout(()=>{if(ok()){el.classList.add('on');setTimeout(()=>el.classList.remove('on'),130)}go()},2400+Math.random()*3400)})()}
blinker($('.blink',heroMe),()=>heroFace==='neutral'&&scrollY<vh*1.5);
if(!RM)setInterval(()=>{if(heroFace==='neutral'&&scrollY<vh){setHero('wink',true);setTimeout(()=>{if(heroFace==='wink')setHero('neutral',true)},480)}},7000);

/* ---------------- rack ---------------- */
const track=$('#track');
hooks.rackPin=p=>{if(innerWidth<900){track.style.removeProperty('--tx');return}const max=track.scrollWidth-innerWidth;track.style.setProperty('--tx',(-p*Math.max(0,max)).toFixed(1)+'px')};

/* ---------------- #01 token squeeze ---------------- */
const prompt=$('#prompt'),words=$$('#prompt .w'),tokPct=$('#tokPct');
hooks.tok=(p,el)=>{const a=clamp((p-.05)/.45);words.forEach((w,i)=>w.classList.toggle('st',a>(i+.5)/words.length));prompt.classList.toggle('squeeze',p>.62);
  const tw=1-.57*clamp((p-.1)/.6);el.style.setProperty('--tw',tw.toFixed(3));tokPct.textContent=Math.round(tw*100)+'%';el.classList.toggle('pick',p>.45);el.classList.toggle('done',p>.78)};

/* ---------------- #02 red tape + graph + greetings ---------------- */
const tapes=$$('#tapeDemo .tape');
hooks.tapeDemo=(p,el)=>{tapes.forEach((t,i)=>t.classList.toggle('rip',p>.12+i*.11));el.style.setProperty('--hd',(1-clamp((p-.55)/.35)).toFixed(3))};
const HELLO=['नमस्ते','नमस्कार','வணக்கம்','నమస్కారం','ನಮಸ್ಕಾರ','নমস্কার','નમસ્તે','ਸਤ ਸ੍ਰੀ ਅਕਾਲ','നമസ്കാരം','ନମସ୍କାର'];
const hello=$('#hello');let hi=0;
if(!RM)setInterval(()=>{hi=(hi+1)%HELLO.length;hello.textContent=HELLO[hi]},1400);

/* ---------------- #03 pipeline ---------------- */
const stages=$$('#pipe i'),risk=$('#risk'),riskT=$('#riskT');
hooks.pipeDemo=(p,el)=>{const hold=p>.52&&p<.68;const st=hold?4:Math.min(7,Math.floor(p*8.6));stages.forEach((s,i)=>{s.classList.toggle('on',i<=st);s.classList.toggle('hold',hold&&i===4)});
  el.style.setProperty('--cp',(hold?4/7:clamp(st/7)).toFixed(3));risk.className='risk '+(hold?'l2':'l1');
  riskT.textContent=hold?'Risk check: flagged, paused for creator approval':(p>=.68?'Risk check: approved, resuming':'Risk check: clear')};

/* ---------------- #04 cctv ---------------- */
const cctv=$('#cctv'),boxT=$('#boxT');
hooks.cctvWrap=(p,el)=>{el.style.setProperty('--ia',clamp(p/.7).toFixed(3));const al=p>.72;el.classList.toggle('alarm',al);cctv.classList.toggle('alarm',al);boxT.textContent=al?'NO MOVEMENT · ALERT SENT':(p>.25?'PERSON · STILL':'PERSON · MOVING')};

/* ---------------- #05 hazard heads ---------------- */
const road=$('#road');
$$('.heads button').forEach(b=>b.addEventListener('click',()=>{$$('.heads button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));road.classList.toggle('seg',b.dataset.head==='seg');road.classList.toggle('dep',b.dataset.head==='dep')}));

/* ---------------- special edition: federated poisoning sim ---------------- */
const fl=$('#fl');
if(fl&&fl.getContext){
  const cx=fl.getContext('2d');let W=0,H=0,vis=false,last=0,caught=0;const caughtEl=$('#caught');
  const size=()=>{const d=Math.min(2,devicePixelRatio||1);W=fl.clientWidth;H=fl.clientHeight;fl.width=Math.round(W*d);fl.height=Math.round(H*d);cx.setTransform(d,0,0,d,0,0);if(RM)draw()};
  const flRO=new ResizeObserver(size);flRO.observe(fl);
  const flIO=new IntersectionObserver(es=>{vis=es[0].isIntersecting});flIO.observe(fl);
  const BAD=new Set([1,4,8]),parts=[];
  const C=()=>({x:(W-90)/2+10,y:H/2}),P=()=>({x:W-46,y:H/2}),R=()=>Math.max(60,Math.min((W-90)/2-26,H*.4));
  const node=i=>{const a=-Math.PI/2+i*Math.PI/5,c=C(),r=R();return{x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r}};
  function draw(){
    cx.clearRect(0,0,W,H);const c=C(),p=P();
    cx.lineWidth=1.5;cx.strokeStyle='rgba(188,193,248,.28)';for(let i=0;i<10;i++){const n=node(i);cx.beginPath();cx.moveTo(n.x,n.y);cx.lineTo(c.x,c.y);cx.stroke()}
    cx.fillStyle='#F8DE3F';cx.strokeStyle='#17142F';cx.lineWidth=3;cx.beginPath();cx.roundRect?cx.roundRect(p.x-28,p.y-30,56,62,10):cx.rect(p.x-28,p.y-30,56,62);cx.fill();cx.stroke();
    cx.fillStyle='#17142F';cx.font='13px Bangers, Impact, sans-serif';cx.textAlign='center';cx.fillText('HONEY',p.x,p.y-4);cx.fillText('POT',p.x,p.y+12);
    cx.beginPath();cx.arc(c.x,c.y,32,0,Math.PI*2);cx.fillStyle='#FFFCF4';cx.fill();cx.stroke();cx.fillStyle='#17142F';cx.fillText('GLOBAL',c.x,c.y-2);cx.fillText('MODEL',c.x,c.y+13);
    for(let i=0;i<10;i++){const n=node(i);cx.beginPath();cx.arc(n.x,n.y,15,0,Math.PI*2);cx.fillStyle=BAD.has(i)?'#EC3B3B':'#8C96F0';cx.fill();cx.lineWidth=3;cx.strokeStyle='#17142F';cx.stroke();cx.fillStyle='#17142F';cx.fillText('C'+(i+1),n.x,n.y+5)}
    for(let k=parts.length-1;k>=0;k--){const q=parts[k];const s=node(q.i);let x,y;const t=q.t;
      if(q.b){const u=1-t;x=u*u*s.x+2*u*t*c.x+t*t*p.x;y=u*u*s.y+2*u*t*c.y+t*t*p.y}else{x=s.x+(c.x-s.x)*t;y=s.y+(c.y-s.y)*t}
      cx.beginPath();cx.arc(x,y,5.5,0,Math.PI*2);cx.fillStyle=q.b?'#EC3B3B':'#BCC1F8';cx.fill();cx.lineWidth=2;cx.strokeStyle='#17142F';cx.stroke()}
  }
  function frame(t){requestAnimationFrame(frame);if(!vis||!W)return;
    if(t-last>240){last=t;parts.push({i:Math.floor(Math.random()*10),t:0,b:false});const q=parts[parts.length-1];q.b=BAD.has(q.i)}
    for(let k=parts.length-1;k>=0;k--){const q=parts[k];q.t+=q.b?.0095:.013;if(q.t>=1){parts.splice(k,1);if(q.b){caught++;caughtEl.textContent='caught: '+caught}}}
    draw()}
  if(RM){parts.push({i:1,t:.6,b:true},{i:3,t:.5,b:false},{i:6,t:.3,b:false})}else requestAnimationFrame(frame);
}

/* ---------------- squad: holo tilt, moods, guitar ---------------- */
if(FINE&&!RM)$$('.holo').forEach(h=>{
  h.addEventListener('pointermove',e=>{const r=h.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    h.style.setProperty('--ry',((x-.5)*22).toFixed(2)+'deg');h.style.setProperty('--rx',((.5-y)*18).toFixed(2)+'deg');
    h.style.setProperty('--fx',(x*100).toFixed(1)+'%');h.style.setProperty('--fy',(y*100).toFixed(1)+'%');h.style.setProperty('--gx',(x*100).toFixed(1)+'%');h.style.setProperty('--gy',(y*100).toFixed(1)+'%')});
  h.addEventListener('pointerleave',()=>{h.style.setProperty('--rx','0deg');h.style.setProperty('--ry','0deg')})});
const card=$('#heroCard'),cfs=$$('.cf',card);let cardFace='neutral',cardHold=false,cardVis=false;
function setCard(f){if(f===cardFace)return;cardFace=f;cfs.forEach(i=>i.classList.toggle('on',i.dataset.f===f));card.classList.remove('pop');void card.offsetWidth;card.classList.add('pop')}
blinker($('.blink',card),()=>cardFace==='neutral'&&cardVis);
const cardIO=new IntersectionObserver(es=>{cardVis=es[0].isIntersecting});cardIO.observe(card);
const SEQ=[['neutral',2600],['wink',450],['neutral',2000],['smug',1500],['neutral',1800],['pout',1300],['neutral',2200],['think',1500]];let si=0;
if(!RM)(function step(){const[f,d]=SEQ[si++%SEQ.length];if(!cardHold&&cardVis)setCard(f);setTimeout(step,d)})();
const holdCard=f=>{cardHold=true;setCard(f)},freeCard=()=>{cardHold=false;setCard('neutral')};
card.addEventListener('pointerenter',()=>holdCard('excited'));card.addEventListener('pointerleave',freeCard);
const wantedCard=$('.wanted').closest('.holo');wantedCard.addEventListener('pointerenter',()=>holdCard('angry'));wantedCard.addEventListener('pointerleave',freeCard);
const gCard=$('#guitarCard');gCard.addEventListener('pointerenter',()=>holdCard('smug'));gCard.addEventListener('pointerleave',freeCard);
function playGuitar(host){Snd.riff();if(host){host.classList.add('playing');setTimeout(()=>host.classList.remove('playing'),1000);
  for(let i=0;i<6;i++)setTimeout(()=>{const n=document.createElement('span');n.className='note';n.textContent=['♪','♫','♬'][i%3];n.style.left=(30+Math.random()*40)+'%';n.style.top='45%';n.style.setProperty('--nx',(Math.random()*120-60)+'px');host.appendChild(n);setTimeout(()=>n.remove(),1700)},i*160)}
  holdCard('excited');setTimeout(freeCard,1800)}
$('button',gCard).addEventListener('click',()=>playGuitar(gCard));
document.addEventListener('click',e=>{if(e.target.closest('.gtr'))playGuitar(null)});

/* ---------------- narrator chat ---------------- */
const KB=[
 {k:['who','about','asmiya','introduce','yourself','background','tell me about her','summary'],go:'origin',a:'Asmiya Sayyad is a final-year Computer Engineering student at Sardar Patel Institute of Technology (SPIT), Mumbai, graduating in May 2027 with a CGPA of 8.41, plus a Barclays-sponsored minor in Banking Technology (CGPA 8.60). She builds AI systems that take repetitive work off people\'s plates: five projects, an IEEE paper and an EY internship so far.'},
 {k:['project','projects','built','build','portfolio','issues','made'],w:.7,go:'issues',a:'Five issues plus a special edition: #01 Prompt Optimizer (an MCP server that cuts total tokens by up to 57%), #02 Saarthi (welfare schemes in 23+ languages), #03 CreatorCrew (7 AI agents, script to dubbing), #04 ElderCare AI (CCTV inactivity alerts to family), #05 Volkswagen Hazard Detection (live road-hazard vision), and an IEEE paper on poisoning-resistant federated intrusion detection.'},
 {k:['prompt','optimizer','optimiser','mcp','token','tokens','agensi','cloud run','gemini enterprise'],go:'i1',a:'Prompt Optimizer is an MCP server for Gemini Enterprise, deployed scale-to-zero on Cloud Run with an OAuth-secured, auto-prefilled in-chat form. Its rule-based engine makes zero LLM calls: it picks from 7 prompting techniques and builds the leanest complete prompt. Benchmarked on full conversations, overhead included, it cuts total tokens by up to 57%. It is published as a skill on Agensi (18,000+ users) and works in Claude Code, Cursor and Codex.'},
 {k:['saarthi','welfare','scheme','schemes','government','neo4j','sign','isl','deaf','csc','knowledge graph'],go:'i2',a:'Saarthi matches citizens to welfare schemes. It models 1000+ schemes in a Neo4j knowledge graph with multi-hop traversal, runs a text and voice assistant in 23+ Indian languages that checks uploaded documents against eligibility rules, and maps the nearest Common Service Centers. Its Indian Sign Language classifier hit 99.71% accuracy on a self-built 5,250-image dataset.'},
 {k:['creatorcrew','creator','crew','video','dag','dubbing','storyboard','flux','ffmpeg','content','youtube'],go:'i3',a:'CreatorCrew is a content creator studio: a DAG orchestrator coordinates 7 AI agents across an 8-stage video workflow, from script to dubbing. It has a persistent async job queue with stage tracking and retries, turns live video references into storyboards matched to the creator\'s camera gear (Parallel web search, Gemini Vision, FLUX), and a 3-level risk agent pauses copyright or brand-safety flags for approval.'},
 {k:['eldercare','elder','elderly','care','cctv','opencv','twilio','whatsapp','fitbit','health','medical','senior'],go:'i4',a:'ElderCare AI is a multi-agent Flask system running SOS, health and reminder agents on parallel threads. It detects real-time inactivity from CCTV with OpenCV and fires Twilio WhatsApp alerts to family, grounds medical-report advice with OCR plus a Gemini RAG pipeline over FAISS, and syncs Fitbit vitals into a caregiver dashboard.'},
 {k:['hazard','volkswagen','vw','pothole','potholes','road','yolo','yolov10','midas','vision','mqtt','vehicle','car','driving'],go:'i5',a:'Volkswagen Hazard Detection is a multi-head computer vision pipeline (YOLOv10, YOLOv8-Seg, MiDaS) that detects and sizes road hazards from live video in real time. Adaptive Keyframe Sampling cuts inference compute and end-to-end latency by up to 60%, federated learning improves fleet accuracy without moving raw driver data off the device, and alerts travel edge-to-cloud over MQTT with offline caching and de-duplication.'},
 {k:['paper','ieee','research','publication','published','federated','intrusion','poisoning','honeypot','security','cnn','lstm','siis'],go:'se',a:'Her paper, "Poisoning-Resistant Federated Intrusion Detection System", is accepted at IEEE AI-SIIS 2026. She trained a hybrid CNN-LSTM intrusion detector across 10 federated clients in TensorFlow and designed a honeypot-based defence that flags poisoned updates. With 30% of clients malicious, it recovered 77% of clean-baseline accuracy at 16.5% overhead.'},
 {k:['ey','ernst','young','intern','internship','experience','job','sap','dashboard','kpi','kpis','analytics','work experience'],go:'identity',a:'At Ernst & Young (EY) she was a Business Analytics Intern in AI & Data, Jul to Sep 2025, in Mumbai. She built a 6-page SAP Analytics Cloud dashboard for automated ROI and engagement KPI reporting, standardised 25+ KPIs across a 6-category KPI tree for four reporting teams, and automated predictive ROI forecasts validated against historical actuals.'},
 {k:['skills','skill','stack','tech stack','technologies','python','java','javascript','react','next','fastapi','flask','database','aws','gcp','docker','langchain','langgraph','pytorch','tensorflow','programming','tools'],go:'powers',a:'Languages: Python, Java, C++, JavaScript, SQL. Frameworks: FastAPI, Flask, Node.js, REST APIs, React.js, Next.js. Databases: PostgreSQL, MySQL, MongoDB, Neo4j, Pinecone, Chroma. AI/ML: TensorFlow, PyTorch, LangChain, LangGraph, RAG, FAISS, MCP, prompt engineering. Cloud and tools: AWS, GCP, Docker, Git, OAuth 2.0. Data: SAP Analytics Cloud, data modeling, dashboarding.'},
 {k:['award','awards','achievement','achievements','hackathon','hackathons','amazon','google','accenture','won','win','winner','finalist','prize','summer school','competition'],go:'fame',a:'Selected twice for Amazon ML Summer School (2025 and 2026), top 5% of 60,000+ applicants. Finalist at Google India Girl Hackathon 2025 among 58,000+ competitors. National Top 11 at EY Techathon 5.0 out of 150,000+ participants. Second Runner-Up at the Accenture x GeeksforGeeks Hackathon among 38,000+ teams.'},
 {k:['leadership','iete','vice','chairperson','committee','event','events','bug buster','code buster','lead','organise','organize'],go:'identity',a:'As Vice Chairperson of the I.E.T.E. Committee at SPIT (2024 to 2025), she led planning for Bug Buster, a 300+ participant hackathon, and secured sponsorships for Code Buster, a 150-participant coding competition.'},
 {k:['contact','email','mail','reach','hire','hiring','available','availability','resume','cv','linkedin','github','connect','recruit','recruiter','opportunity'],go:'tbc',a:'Email: '+EMAIL+'. LinkedIn: linkedin.com/in/asmiya135. GitHub: github.com/Asmiya135. Her resume PDF is the last button in the dock. She graduates in May 2027 and is open to conversations about internships and roles.'},
 {k:['education','college','university','spit','cgpa','gpa','degree','btech','b.tech','minor','barclays','banking','graduate','graduation','study','studies'],go:'origin',a:'B.Tech in Computer Engineering at Sardar Patel Institute of Technology, Mumbai (Aug 2023 to May 2027), CGPA 8.41, with a minor in Banking Technology through a Barclays-sponsored programme, CGPA 8.60.'},
 {k:['best project','best','favourite','favorite','proudest','impressive','top','pick','recommend','start'],go:'i1',a:'Narrator\'s pick: start with Prompt Optimizer. It is live on Agensi for 18,000+ users and cuts total tokens by up to 57% with zero LLM calls in its engine. Then read Saarthi for scale: 1000+ schemes, 23+ languages and a 99.71% sign-language classifier.'},
 {k:['music','guitar','hobby','hobbies','fun','free time','play'],go:'squad',a:'She plays guitar. Tap the guitar sidekick card on the Meet the Squad page for a riff.'},
 {k:['busywork','villain','villains','dr','theme','comic','comics','why'],go:'origin',a:'Dr. Busywork is the series villain: forms, spreadsheets and the same task done a thousand times. Every issue is a project that beats one of his henchmen. The theme comes from her mission: AI that carries the repetitive work so people can rise to what matters.'},
 {k:['narrator','bot','chatbot','rag','retrieval','how do you work','are you ai','llm'],go:null,a:'I\'m a tiny keyword-retrieval bot running entirely in your browser over her resume and project notes. No API calls, so I only say what is on the record.'},
 {k:['where','location','based','mumbai','city','india'],go:'origin',a:'She is based in Mumbai, India.'}
];
const SUG=['Who is Asmiya?','Show me her best project','What did she do at EY?','What is her tech stack?','Any awards?','Tell me about the IEEE paper','How do I reach her?'];
function answer(q){const t=' '+q.toLowerCase().replace(/[^a-z0-9.+# ]/g,' ')+' ';const ws=t.trim().split(/\s+/);let best=null,bs=0;
  const hit=(w,k)=>w===k||(k.length>5&&w.length>5&&w.slice(0,6)===k.slice(0,6));
  KB.forEach(e=>{let s=0;const single=e.k.filter(k=>!k.includes(' '));
    ws.forEach(w=>{let m=0;single.forEach(k=>{if(hit(w,k))m=Math.max(m,k.length>4?2:1)});s+=m});
    e.k.forEach(k=>{if(k.includes(' ')&&t.includes(k))s+=2});
    s*=e.w||1;if(s>bs){bs=s;best=e}});
  return bs>0?best:null}
const chat=$('#chat'),msgs=$('#msgs'),sugg=$('#sugg'),form=$('#chatForm'),inp=$('#chatIn');let greeted=false;
function addMsg(text,who,go){const m=document.createElement('div');m.className='m '+who;const p=document.createElement('div');p.textContent=text;m.appendChild(p);
  if(go){const b=document.createElement('button');b.className='src';b.type='button';b.textContent='Take me to that page →';b.addEventListener('click',()=>{if(innerWidth<700)closeChat();jumpTo(go)});m.appendChild(b)}
  msgs.appendChild(m);msgs.scrollTop=msgs.scrollHeight}
function ask(q){q=q.trim();if(!q)return;addMsg(q,'me');const ty=document.createElement('div');ty.className='m typing';ty.innerHTML='<i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i>';msgs.appendChild(ty);msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{ty.remove();const l=q.toLowerCase();
    if(/^(hi|hello|hey|yo|namaste|hii+)\b/.test(l)&&l.length<20){addMsg('Hey! Ask me about her projects, the EY internship, skills, awards or the IEEE paper.','bot');return}
    if(/\b(thanks|thank you|thx|ty)\b/.test(l)){addMsg('Anytime. The red button is always here.','bot');return}
    const e=answer(q);if(e)addMsg(e.a,'bot',e.go);else addMsg('That one isn\'t in my script. I only answer from her resume and project notes. Try: projects, EY internship, skills, awards, the IEEE paper, or how to reach her.','bot')},RM?0:550+Math.random()*350)}
sugg.innerHTML=SUG.map(s=>`<button type="button"></button>`).join('');$$('button',sugg).forEach((b,i)=>{b.textContent=SUG[i];b.addEventListener('click',()=>ask(SUG[i]))});
const qs=$('#qs');qs.innerHTML=SUG.map((s,i)=>`<button type="button" style="--rot:${[-2,1.5,-1,2,-1.5,1,-2.5][i]}deg"></button>`).join('');$$('button',qs).forEach((b,i)=>{b.textContent=SUG[i];b.addEventListener('click',()=>{openChat();ask(SUG[i])})});
function openChat(){chat.classList.add('on');chat.setAttribute('aria-hidden','false');if(!greeted){greeted=true;addMsg('Hey, I\'m the Narrator. I\'ve read every issue of ASMIYA. Ask me anything about her work.','bot')}setTimeout(()=>{if(FINE)inp.focus()},50)}
function closeChat(){chat.classList.remove('on');chat.setAttribute('aria-hidden','true')}
$('#chatBtn').addEventListener('click',()=>chat.classList.contains('on')?closeChat():openChat());$('#chatX').addEventListener('click',closeChat);
form.addEventListener('submit',e=>{e.preventDefault();const q=inp.value;inp.value='';ask(q)});

/* ---------------- keys: escape, "busywork" easter egg ---------------- */
let buf='';
addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeChat();closeToc();return}
  if(e.target.closest&&e.target.closest('input,textarea'))return;
  if(e.key.length===1){buf=(buf+e.key.toLowerCase()).slice(-8);if(buf==='busywork'){buf='';defeat()}}});
function defeat(){const k=document.createElement('div');k.className='ko';k.innerHTML='<img src="assets/cut-excited.webp" alt=""><b>VILLAIN<br>DEFEATED!</b>';document.body.appendChild(k);Snd.thud();setHero('excited');setTimeout(()=>{k.remove();setHero('neutral')},2500)}

/* ---------------- console note for curious devs ---------------- */
try{console.log('%c ASMIYA COMICS #01 ','font:24px Impact,sans-serif;color:#F8DE3F;background:#17142F;padding:6px 10px;border:3px solid #EC3B3B');
console.log('Hello, fellow dev. Hand-built: no framework, no template, synthesised sounds, one retrieval bot. Say hi: '+EMAIL+' · github.com/Asmiya135')}catch(e){}

measure();
}
