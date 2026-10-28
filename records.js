'use strict';
(()=>{
 const releases=[{title:'Zara Zara Mashup',subtitle:'Bengali × Tamil · ft. Sampriti Sen & Asmita Mukherjee',image:'home-16.jpg',id:'DqZdm8OyFIE',duration:'04:21',tag:'LATEST MUSIC RELEASE · 31 DECEMBER 2024'},...TRACKS.map(t=>({...t,tag:t.top?'TOP MUSIC RELEASE':'FROM THE ECLIPWZE COLLECTION'}))];
 const host=document.querySelector('.record-browser');
 host.innerHTML=`<div class="record-browser-top"><span class="eyebrow">THE LISTENING ROOM / 01—05</span></div><div class="record-layout"><div class="record-details" aria-live="polite" aria-atomic="true"><span class="record-release-tag eyebrow"></span><h3 class="record-title"></h3><p class="record-credit"></p><div class="record-facts"><span>ECLIPWZE SOUNDS</span><span class="record-duration"></span></div><div class="record-actions"><button class="pill light record-play">Play music video <span>↗</span></button><a class="record-stream text-link" target="_blank" rel="noopener">Spotify ↗</a></div></div><div class="record-stage" role="group" aria-roledescription="carousel" aria-label="Browse Eclipwze song records" tabindex="0"><div class="record-orbit" aria-hidden="true"></div><span class="record-stage-mark" aria-hidden="true">e.</span><div class="record-discs">${releases.map((t,i)=>`<button class="printed-record" data-record="${i}" aria-label="${i===0?'Play':'Select'} ${escapeHTML(t.title)}" aria-current="${i===0?'true':'false'}"><span class="record-object"><span class="record-print"><img src="${assetURL(t.image)}" alt="${escapeHTML(t.title)} original artwork printed on a disc" draggable="false"><span class="record-reflection"></span></span><span class="record-hub"></span><svg class="record-rim-type" viewBox="0 0 400 400" aria-hidden="true"><defs><path id="rim-${i}" d="M200,21 a179,179 0 1,1 -1,0"/></defs><text><textPath href="#rim-${i}" startOffset="3%">ECLIPWZE SOUNDS / ${String(i+1).padStart(2,'0')} / ${escapeHTML(t.title.toUpperCase())} / VIOLIN · GUITAR · ALIGNMENT</textPath></text></svg></span><span class="record-play-badge" aria-hidden="true">↗</span></button>`).join('')}</div><span class="record-stage-caption">ORIGINAL ARTWORK. A DIFFERENT SPIN.</span></div></div><div class="record-navigation"><button class="record-prev" aria-label="Previous record">←</button><span class="record-count" aria-live="polite">01 <span>/ 05</span></span><button class="record-next" aria-label="Next record">→</button></div><div class="record-index" role="group" aria-label="Select a song">${releases.map((t,i)=>`<button data-select-record="${i}" aria-pressed="${i===0}"><span>0${i+1}</span><span>${escapeHTML(t.title)}</span><span class="record-index-indicator">↗</span></button>`).join('')}</div>`;

 host.innerHTML='<div class="record-sticky">'+host.innerHTML+'</div>';
 host.classList.add('record-scroll-story');
 host.querySelector('.record-stage-caption').textContent='EVERY REVOLUTION. A NEW FEELING.';
 host.querySelector('.record-stage').insertAdjacentHTML('afterbegin','<div class="record-eclipse" aria-hidden="true"></div><div class="record-signal" aria-hidden="true"></div>');
 host.querySelector('.record-navigation').insertAdjacentHTML('afterend','<div class="record-score" aria-hidden="true"><span></span></div>');
 const stage=host.querySelector('.record-stage'),sticky=host.querySelector('.record-sticky'),discs=[...host.querySelectorAll('.printed-record')];
 const accents=['#c96139','#bba469','#8caa80','#9aa9ad','#c49276'];
 let selected=-1,position=0,drag=null,ignoreClick=false,scheduled=false,infoAnimation=null;
 const limit=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 function headerHeight(){return document.querySelector('.site-header').offsetHeight;}
 function travel(){return Math.max(1,host.offsetHeight-sticky.offsetHeight);}
 function sectionTop(){return host.getBoundingClientRect().top+scrollY-headerHeight();}
 function updateInfo(i){
  if(i===selected)return;selected=i;const t=releases[i];
  host.dataset.long=String(t.title.length>28);
  host.style.setProperty('--record-accent',accents[i]);
  host.querySelector('.record-title').textContent=t.title;
  host.querySelector('.record-credit').textContent=t.subtitle;
  host.querySelector('.record-release-tag').textContent=t.tag;
  host.querySelector('.record-duration').textContent=t.duration;
  host.querySelector('.record-stage-mark').textContent=String(i+1).padStart(2,'0');
  const play=host.querySelector('.record-play');play.dataset.play=t.id;play.dataset.title=t.title;
  const link=host.querySelector('.record-stream');link.href=i===0?'https://open.spotify.com/album/7D56uCaWhaRLOD6Gdhii6i?si=GFNNJF0nSt697cAlu9rnpg':'https://www.youtube.com/watch?v='+t.id;
  link.replaceChildren(document.createTextNode(i===0?'Spotify ↗':'YouTube ↗'));platformIcons(host);
  host.querySelector('.record-count').innerHTML=String(i+1).padStart(2,'0')+' <span>/ 05</span>';
  host.querySelectorAll('[data-select-record]').forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===i));b.setAttribute('aria-label','Select '+releases[j].title);});
  if(motion){infoAnimation?.cancel();infoAnimation=host.querySelector('.record-details').animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:340,easing:'ease-out'});}
 }
 function render(p){
  position=limit(p,0,4);const current=Math.round(position);updateInfo(current);
  const staticMotion=!motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visual=staticMotion?current:position;
  discs.forEach((el,i)=>{
   const d=i-visual,dist=Math.abs(d),visible=dist<1.7;
   el.style.setProperty('--x',(d*76)+'%');
   el.style.setProperty('--y',(-d*35+Math.sin(d*1.4)*8)+'%');
   el.style.setProperty('--size',Math.max(.48,1-dist*.27));
   el.style.setProperty('--turn',(-d*32)+'deg');
   el.style.setProperty('--roll',(-12+d*-35+visual*6)+'deg');
   el.style.setProperty('--shine',(visual*70+i*25)+'deg');
   el.style.zIndex=30-Math.round(dist*10);
   el.style.opacity=String(limit((1.7-dist)*1.1));
   el.style.pointerEvents=visible?'auto':'none';
   el.setAttribute('aria-hidden',String(!visible));el.tabIndex=i===current?0:-1;
   el.setAttribute('aria-current',String(i===current));
   el.setAttribute('aria-label',(i===current?'Play ':'Select ')+releases[i].title);
  });
  host.style.setProperty('--revolution',(visual*80)+'deg');
  host.style.setProperty('--passage',position/4);
  host.querySelector('.record-score>span').style.transform='scaleX('+position/4+')';
  host.querySelectorAll('[data-select-record]').forEach((b,i)=>b.style.setProperty('--chapter-progress',limit(position-i+.5)));
 }
 function score(){scheduled=false;const bounds=host.getBoundingClientRect();if(selected>=0&&(bounds.top>innerHeight+100||bounds.bottom<headerHeight()-100))return;render(limit((scrollY-sectionTop())/travel())*4);}
 function requestScore(){if(!scheduled){scheduled=true;requestAnimationFrame(score);}}
 function goTo(i){const target=limit(i,0,4);window.scrollTo({top:sectionTop()+travel()*target/4,behavior:motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});}
 host.querySelector('.record-prev').onclick=()=>goTo(selected===0?4:selected-1);
 host.querySelector('.record-next').onclick=()=>goTo(selected===4?0:selected+1);
 host.querySelectorAll('[data-select-record]').forEach(b=>b.onclick=()=>goTo(Number(b.dataset.selectRecord)));
 discs.forEach((b,i)=>b.onclick=()=>{if(ignoreClick)return;if(i===selected)playVideo(releases[i].id,releases[i].title);else goTo(i);});
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();goTo(limit(selected+(e.key==='ArrowRight'?1:-1),0,4));}if((e.key==='Enter'||e.key===' ')&&e.target===stage){e.preventDefault();playVideo(releases[selected].id,releases[selected].title);}});
 stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,dx:0,start:position,active:false};ignoreClick=false;});
 stage.addEventListener('pointermove',e=>{
  if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.active&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){drag=null;return;}
  if(Math.abs(dx)>8){drag.active=true;ignoreClick=true;drag.dx=dx;
   if(!stage.hasPointerCapture(e.pointerId))stage.setPointerCapture(e.pointerId);
   render(drag.start-dx/(stage.clientWidth*.55));
  }
 });
 function finish(cancelled=false){if(!drag)return;const d=drag;drag=null;
  if(d.active){const target=cancelled?Math.round(d.start):Math.abs(d.dx)>35?Math.round(d.start)+(d.dx<0?1:-1):Math.round(d.start);goTo(target);setTimeout(()=>ignoreClick=false,100);}else score();
 }
 stage.addEventListener('pointerup',()=>finish());stage.addEventListener('pointercancel',()=>finish(true));stage.addEventListener('lostpointercapture',()=>finish(true));
 window.addEventListener('scroll',requestScore,{passive:true});window.addEventListener('resize',requestScore);
 document.querySelector('.motion-toggle').addEventListener('click',requestScore);
 score();
})();
