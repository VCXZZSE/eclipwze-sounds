/* Eclipwze's little stage companions. One atlas, six-frame body animation. */
(()=>{
 const asset=new URL('assets/duo-companions.png',document.currentScript.src).href;
 const frames=[[[58, 13, 134, 205], [273, 13, 127, 206], [468, 16, 123, 201], [664, 13, 135, 206], [871, 13, 128, 204], [1075, 13, 130, 206]], [[65, 226, 109, 211], [272, 229, 116, 208], [465, 230, 134, 205], [660, 230, 142, 206], [873, 232, 132, 204], [1083, 229, 124, 206]], [[29, 444, 197, 229], [245, 447, 185, 224], [447, 447, 178, 226], [649, 446, 186, 226], [858, 446, 184, 226], [1068, 447, 178, 226]], [[32, 675, 187, 217], [243, 678, 188, 216], [448, 681, 174, 213], [648, 679, 198, 214], [858, 681, 193, 212], [1067, 682, 175, 211]], [[42, 896, 153, 168], [257, 898, 150, 166], [456, 897, 152, 166], [658, 899, 153, 165], [873, 895, 143, 169], [1073, 897, 146, 167]], [[45, 1071, 152, 171], [255, 1070, 155, 172], [463, 1071, 154, 172], [665, 1074, 154, 169], [871, 1072, 156, 171], [1073, 1072, 147, 170]]];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const store={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
 let hidden=store.get('eclipwze-pals-hidden')==='yes',paused=store.get('eclipwze-pals-paused')==='yes',scene='',lastFrame=0,dirty=true,docked=false,nextWander=0;
 const stage=document.createElement('div');stage.className='pals-scene';stage.setAttribute('aria-label','Eclipwze illustrated companions');stage.hidden=hidden;
 const tools=document.createElement('div');tools.className='pals-tools';tools.innerHTML='<button class="pals-launch" aria-expanded="false" aria-controls="pals-options" aria-label="Animated duo options"><span aria-hidden="true">✳</span> THE DUO</button><div class="pals-options" id="pals-options" hidden><span>REPOME + DEV / IN THE MARGINS</span><p>Drag us somewhere. Tap us for an encore.</p><button data-pals="pause"></button><button data-pals="hide"></button></div>';
 document.body.append(stage,tools);
 const launch=tools.querySelector('.pals-launch'),options=tools.querySelector('.pals-options'),pause=tools.querySelector('[data-pals=pause]'),hide=tools.querySelector('[data-pals=hide]');
 function labels(){pause.textContent=paused?'Resume movement':'Pause movement';pause.setAttribute('aria-pressed',String(paused));hide.textContent=hidden?'Bring the duo back':'Let the duo rest';launch.setAttribute('aria-label',hidden?'Bring the animated duo back':'Animated duo options')}
 labels();launch.addEventListener('click',()=>{if(hidden){hidden=false;stage.hidden=false;store.set('eclipwze-pals-hidden','no');dirty=true;labels();return}options.hidden=!options.hidden;launch.setAttribute('aria-expanded',String(!options.hidden))});
 pause.addEventListener('click',()=>{paused=!paused;store.set('eclipwze-pals-paused',paused?'yes':'no');labels()});
 hide.addEventListener('click',()=>{hidden=!hidden;stage.hidden=hidden;store.set('eclipwze-pals-hidden',hidden?'yes':'no');options.hidden=true;launch.setAttribute('aria-expanded','false');labels()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){options.hidden=true;launch.setAttribute('aria-expanded','false')}});
 document.addEventListener('pointerdown',e=>{if(!tools.contains(e.target)){options.hidden=true;launch.setAttribute('aria-expanded','false')}});
 const actors=['Repome','Dev'].map((name,i)=>{
  const button=document.createElement('button');button.className='pals-actor';button.setAttribute('aria-label',`${name}, drag to move or tap for an encore`);button.innerHTML='<canvas width="256" height="256" aria-hidden="true"></canvas><span class="pals-bubble" aria-hidden="true"></span><span class="pals-shadow" aria-hidden="true"></span>';stage.append(button);
  const a={i,name,button,canvas:button.querySelector('canvas'),ctx:button.querySelector('canvas').getContext('2d'),state:'play',x:0,y:0,until:0,manual:0,drag:null,moved:false};
  button.addEventListener('pointerdown',e=>{if(e.button!==0)return;a.drag={x:e.clientX,y:e.clientY,ox:a.x,oy:a.y};a.moved=false;button.setPointerCapture(e.pointerId)});
  button.addEventListener('pointermove',e=>{if(!a.drag)return;let dx=e.clientX-a.drag.x,dy=e.clientY-a.drag.y;if(Math.hypot(dx,dy)>6)a.moved=true;if(a.moved){button.classList.add('pals-dragging');a.manual=Date.now()+10000;a.state='walk';move(a,a.drag.ox+dx,a.drag.oy+dy)}});
  button.addEventListener('pointerup',()=>{if(a.moved){a.state='read';say(a,'good spot.');button.classList.remove('pals-dragging')}a.drag=null});
  button.addEventListener('pointercancel',()=>{a.drag=null;button.classList.remove('pals-dragging')});
  button.addEventListener('click',()=>{if(a.moved){a.moved=false;return}encore(a)});return a;
 });
 function say(a,text){const b=a.button.querySelector('.pals-bubble');b.textContent=text;b.classList.add('pals-speaking');clearTimeout(a.speech);a.speech=setTimeout(()=>b.classList.remove('pals-speaking'),2900)}
 function encore(a){a.state='play';a.until=Date.now()+4500;a.button.classList.remove('pals-encore');void a.button.offsetWidth;a.button.classList.add('pals-encore');say(a,a.i?'one more riff?':'one more take?');setTimeout(()=>a.button.classList.remove('pals-encore'),1600)}
 function move(a,x,y){const size=innerWidth<=700?86:112;const w=docked?stage.clientWidth:innerWidth,h=docked?stage.clientHeight:innerHeight;a.x=Math.max(0,Math.min(w-size,x));a.y=Math.max(8,Math.min(h-size-8,y));a.button.style.translate=a.x+'px '+a.y+'px'}
 function visible(el){if(!el)return false;const r=el.getBoundingClientRect();return r.top<innerHeight*.8&&r.bottom>innerHeight*.3}
 function context(){if(document.querySelector('dialog[open]'))return 'quiet';if(document.querySelector('.reader-body'))return 'read';if(visible(document.querySelector('.record-stage')))return 'record';if(visible(document.querySelector('#albums')))return 'sleeves';if(visible(document.querySelector('#journal'))||document.body.classList.contains('journal-home'))return 'read';if(visible(document.querySelector('#contact')))return 'contact';if(visible(document.querySelector('#collaborators')))return 'friends';if(visible(document.querySelector('#members')))return 'duo';return 'wander'}
 function position(force=false){dirty=false;const next=context(),changed=next!==scene;scene=next;stage.dataset.scene=next;stage.classList.toggle('pals-quiet',next==='quiet');const host=next==='record'?document.querySelector('.record-stage'):document.body;const wantDock=next==='record';if(docked!==wantDock||stage.parentNode!==host){host.append(stage);docked=wantDock;stage.dataset.dock=docked?'record':'page';force=true}
  const small=innerWidth<=700,size=small?86:112,w=docked?host.clientWidth:innerWidth,h=docked?host.clientHeight:innerHeight;
  actors.forEach((a,i)=>{if(a.drag||a.manual>Date.now())return;let x,y;
   if(docked){const phase=Math.floor(Date.now()/7500)%3;x=phase===1?w*(i?.60:.20):w*(i?.76:.01);y=phase===2?h*.02:h*(phase===1?.53:.30)}
   else if(next==='read'){x=i?w-size-12:8;y=innerHeight-size-(small?55:25)}
   else if(next==='sleeves'){x=i?w-size-12:8;y=innerHeight-size-(small?75:40)}
   else{const swap=Math.floor(Date.now()/15000)%2;x=(i===swap)?8:w-size-12;y=innerHeight-size-(small?52:20)}
   if(changed||force){a.state=(changed||force)&&next!=='read'&&!reduced.matches?'walk':next==='read'?'read':'play';a.until=Date.now()+1300}move(a,x,y);
  });
 }
 const sheet=new Image();sheet.decoding='async';sheet.onload=()=>{stage.classList.add('pals-ready');dirty=true;requestAnimationFrame(tick)};sheet.onerror=()=>{stage.remove();tools.remove()};sheet.src=asset;
 function tick(t){requestAnimationFrame(tick);if(hidden||document.hidden)return;if(dirty)position();const still=paused||reduced.matches||document.body.classList.contains('motion-off');if(t-lastFrame<120)return;lastFrame=t;const now=Date.now();if(!still&&now>nextWander){nextWander=now+7500;position(scene!=='read')}
 actors.forEach(a=>{if(!a.drag&&now>a.until&&now>a.manual)a.state=scene==='read'?'read':'play';const row=a.state==='walk'?a.i:a.state==='read'?4+a.i:2+a.i;const frame=still?0:Math.floor(t/140+a.i*2)%6;const [sx,sy,sw,sh]=frames[row][frame],scale=1.05;a.ctx.clearRect(0,0,256,256);a.ctx.drawImage(sheet,sx,sy,sw,sh,(256-sw*scale)/2,252-sh*scale,sw*scale,sh*scale);a.button.dataset.action=a.state;a.button.style.setProperty('--pals-hop',still?'0px':Math.sin(t/280+a.i)*1.5+'px')});
 }
 addEventListener('scroll',()=>dirty=true,{passive:true});addEventListener('resize',()=>{actors.forEach(a=>a.manual=0);dirty=true});document.addEventListener('visibilitychange',()=>dirty=true);
 document.addEventListener('click',e=>{if(e.target.closest('[data-play],.record-navigation>button,.phone-surprise,[data-contact],.journal-item,.cover-controls button')){actors.forEach(encore);dirty=true}});
 const article=document.querySelector('#article-dialog');if(article)new MutationObserver(()=>dirty=true).observe(article,{attributes:true,attributeFilter:['open']});
})();
