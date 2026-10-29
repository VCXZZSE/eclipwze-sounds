/* Reveal the site when local artwork and fonts are ready, rather than on a timer. */
(()=>{'use strict';
const root=document.documentElement,existing=document.getElementById('opening-screen');if(!existing||!window.EclipwzeArtwork)return;
const screen=existing,shownAt=Number(screen.dataset.started)||performance.now(),reduce=matchMedia('(prefers-reduced-motion: reduce)'),manager=window.EclipwzeArtwork;
let seen=false;try{seen=window.EclipwzePrivacy?.allows('preferences')&&sessionStorage.getItem('eclipwze-opening-seen')==='1';}catch{}
clearTimeout(window.eclipwzeOpeningFallback);screen.hidden=false;root.classList.add('opening-active');
const main=document.querySelector('main'),header=document.querySelector('.site-header,.journal-header,body>header'),wasMainInert=!!main?.inert,wasHeaderInert=!!header?.inert;
if(main)main.inert=true;if(header)header.inert=true;
let closing=false,running=false,ready=false,slowTimer=0,releaseTimer=0;
const help=screen.querySelector('.opening-help'),status=screen.querySelector('.opening-status'),progress=screen.querySelector('.opening-progress');
function dismiss(){if(closing)return;closing=true;clearTimeout(slowTimer);clearTimeout(releaseTimer);document.removeEventListener('keydown',onKey);root.classList.remove('opening-active');if(main)main.inert=wasMainInert;if(header)header.inert=wasHeaderInert;try{if(window.EclipwzePrivacy?.allows('preferences'))sessionStorage.setItem('eclipwze-opening-seen','1');}catch{}const focused=screen.contains(document.activeElement);screen.classList.add('is-leaving');screen.setAttribute('aria-hidden','true');if(focused)document.querySelector('.brand,.journal-brand,body>header a')?.focus({preventScroll:true});window.dispatchEvent(new Event('eclipwze:artwork-visible'));setTimeout(()=>screen.remove(),reduce.matches?0:480);}
function onKey(e){if(e.key==='Escape')dismiss();}
function showHelp(text){if(closing)return;help.hidden=false;status.textContent=text;}
screen.querySelector('.opening-mark').onclick=dismiss;screen.querySelector('.opening-enter').onclick=dismiss;document.addEventListener('keydown',onKey);
screen.querySelector('.opening-retry').onclick=()=>{if(running){location.reload();return;}prepare();};
const logo=screen.querySelector('.opening-colour');logo.onerror=()=>{screen.querySelectorAll('.opening-mark img').forEach(i=>i.hidden=true);screen.querySelector('.opening-fallback').hidden=false;};
function inventory(){const entries=new Map();
 function add(src,node,high=false){if(!src||src.startsWith('data:'))return;const url=new URL(src,location.href);if(url.origin!==location.origin)return;let entry=entries.get(url.href);if(!entry){entry={url:url.href,nodes:[],high};entries.set(url.href,entry);}if(node)entry.nodes.push(node);entry.high ||= high;}
 document.querySelectorAll('img').forEach(img=>add(img.currentSrc||img.getAttribute('src'),img,!!img.closest('.hero,header,.reader-cover,.cover-artwork')||img.fetchPriority==='high'));
 if(document.querySelector('.rooftop'))for(const name of ['repome','dev'])for(const action of ['walk','dance','play'])add('assets/calcutta-'+name+'-'+action+'.webp');
 if(document.querySelector('.pals-tools')){add('assets/duo-companions.webp');add('assets/duo-playful.webp');}
 if(document.querySelector('.hero'))add('assets/alignment-3.png');
 if(document.querySelector('.character canvas')&&!document.querySelector('.hero')){add('/assets/missing-note-repome.webp');add('/assets/missing-note-dev.webp');}
 return [...entries.values()].sort((a,b)=>Number(b.high)-Number(a.high));}
async function fontsReady(){if(!document.fonts)return;let timer;try{await Promise.race([document.fonts.ready,new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('Fonts are taking longer')),20000))]);}finally{clearTimeout(timer);}}
async function prepare(){if(running||closing)return;running=true;ready=false;help.hidden=true;clearTimeout(slowTimer);slowTimer=setTimeout(()=>showHelp('Still preparing the artwork. You can keep waiting, retry, or enter now.'),10000);
 const entries=inventory();let cursor=0,complete=0;const failed=[];
 function report(){const pct=Math.round(complete/Math.max(1,entries.length)*95);screen.style.setProperty('--opening-cut',(100-pct)+'%');progress.setAttribute('aria-valuenow',String(pct));}
 const worker=async()=>{while(cursor<entries.length){const entry=entries[cursor++];try{await manager.loadImage(entry.url,entry.high?'high':'low');await Promise.all(entry.nodes.map(async img=>{img.loading='eager';if(img.decode)await img.decode();else if(!img.complete)await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true});});}));complete++;report();}catch{failed.push(entry.url);}}};
 await Promise.all(Array.from({length:4},worker));try{await fontsReady();}catch{failed.push('fonts');}
 running=false;if(closing)return;clearTimeout(slowTimer);
 if(failed.length){showHelp('A few images could not finish loading. Retry the artwork, or enter now.');return;}
 ready=true;screen.style.setProperty('--opening-cut','0%');progress.setAttribute('aria-valuenow','100');screen.dataset.ready='true';window.dispatchEvent(new Event('eclipwze:artwork-ready'));
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 if(!closing)releaseTimer=setTimeout(dismiss,Math.max(reduce.matches?0:250,(seen||reduce.matches?0:900)-(performance.now()-shownAt)));
}
prepare();addEventListener('pageshow',event=>{if(event.persisted){if(ready)dismiss();else if(!running)prepare();}});addEventListener('pagehide',()=>{clearTimeout(slowTimer);clearTimeout(releaseTimer);});
})();
