'use strict';
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const assetURL = name => typeof EMBEDDED_ASSETS !== 'undefined' ? EMBEDDED_ASSETS[name] : 'assets/' + name;
const escapeHTML = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TRACKS = [
 {title:'Husn',subtitle:'Violin Cover · Anuv Jain · Repome · Dev · Instrumental [Official Visualizer]',image:'home-24-fast.webp',id:'GFWSmHqIG4w',duration:'04:27',top:true},
 {title:'Purano Sei Diner Kotha X Ami Chini Go Chini',subtitle:'[Music Video] Fusion · Violin Cover · Rabindra Sangeet',image:'home-21-fast.webp',id:'nPO5E4g3tto',duration:'03:10'},
 {title:'My Heart Will Go On X Raabta',subtitle:'ft. Naireet Bagchi · [Official Visualizer] · Medley · Eclipwze Sounds',image:'home-22-fast.webp',id:'leoEztGmsjk',duration:'04:33'},
 {title:'Main Dhoondne Ko X Let Me Down Slowly',subtitle:'Violin cover · Repome · Dev · Instrumental Mashup',image:'home-23-fast.webp',id:'i4I3xpx4m_I',duration:'05:22'}
];
$('#tracklist').innerHTML=TRACKS.map((t,i)=>`<button class="track" data-play="${t.id}" data-title="${escapeHTML(t.title)}" aria-label="Play ${escapeHTML(t.title)}"><span class="track-number">0${i+1}</span><img src="${assetURL(t.image)}" alt="${escapeHTML(t.title)} original video artwork" loading="lazy"><span><span class="track-title">${escapeHTML(t.title)}${t.top?'<span class="track-tag">TOP MUSIC RELEASE</span>':''}</span><span class="track-subtitle">${escapeHTML(t.subtitle)}</span></span><span class="track-duration">${t.duration}</span><span class="track-play" aria-hidden="true">▶</span></button>`).join('');
const ALBUMS=[
 {key:'uttirno',name:'উত্তীর্ণ / Uttirno',lang:'BENGALI',file:'uttirno-fast.webp',url:'copy-of-radiance',description:"A captivating collection of Bengali cover songs. From timeless melodies to modern interpretations, this album celebrates Bengal's musical heritage."},
 {key:'radiance',name:'Radiance',lang:'ENGLISH',file:'radiance-fast.webp',url:'radiance',description:'An exhilarating album of English covers, featuring iconic hits and beloved classics reimagined with a modern twist. An invitation to listen a little differently.'},
 {key:'saath',name:'साथ / Saath',lang:'HINDI',file:'saath-fast.webp',url:encodeURIComponent('स-थ'),description:"A collection of Hindi covers, from Bollywood classics to contemporary hits, celebrating India's vibrant musical landscape."}
];
$('#albums').innerHTML=ALBUMS.map(a=>`<button class="album" data-album="${a.key}" aria-label="Explore ${a.name}"><div class="album-art"><img src="${assetURL(a.file)}" alt="${a.name} original album cover" loading="lazy"><span aria-hidden="true">↗</span></div><div class="album-title"><h4>${a.name}</h4><span>${a.lang}</span></div><p>${a.description}</p></button>`).join('');
const COLLABORATORS=[
 {name:'Sayantan',role:'KOLKATA VISUALS',image:'collaborators-2-fast.webp',body:'Sayantan or Sayan Editz has helped Eclipwze Sounds by providing Kolkata-focused clips which were used in our Music Video project "Ami Chini Go X Purano Sei Diner Kotha". The video has performed really well across all music streaming platforms and is also one of the most-viewed videos on our channel!',url:'https://www.instagram.com/xo_sayan/'},
 {name:'Naireet',role:'VOCALS / GUITAR',image:'collaborators-9-fast.webp',body:'Naireet Bagchi, a passionate guitarist and rising vocalist, collaborated with Eclipwze Sounds to provide his melodious vocals for our project "Titanic X Raabta." We are delighted that talented artists like him have chosen to work with us.',url:'https://www.instagram.com/_noir._.it.iss/',email:'naireetbagchi16@gmail.com'},
 {name:'Sampriti',role:'TAMIL VOCALS',image:'collaborators-10-fast.webp',body:'Sampriti Sen, a gifted vocalist with a soulful voice, collaborated with Eclipwze Sounds to bring her enchanting Tamil verse to life in our project “Zara Zara (Tamil x Bengali).” We are honored to have such a talented artist join us, adding her unique charm and depth to this multilingual fusion.',url:'https://www.instagram.com/sampritisen_/'},
 {name:'Asmita',role:'BENGALI VOCALS',image:'collaborators-15-fast.webp',body:'Asmita Mukherjee, a versatile and passionate singer, lent her captivating Bengali vocals to our project “Zara Zara (Tamil x Bengali).” Her heartfelt rendition beautifully captured the essence of the song, and we are thrilled to have collaborated with such an exceptional talent.',url:'https://www.instagram.com/__asmitaaaa.__/'}
];
$('#collaborator-list').innerHTML=COLLABORATORS.map((c,i)=>`<details class="collaborator"><summary><span>0${i+1}</span><img src="${assetURL(c.image)}" alt="${c.name}" loading="lazy"><h3>${c.name}</h3><span class="collaborator-role eyebrow">${c.role}</span><span class="collaborator-plus" aria-hidden="true">+</span></summary><div class="collaborator-body"><div><p>${escapeHTML(c.body)}</p>${c.email?`<a href="mailto:${c.email}">${c.email}</a>`:''}</div><a href="${c.url}" target="_blank" rel="noopener">Instagram ↗</a></div></details>`).join('');
let lastFocused=null;
function openDialog(dialog){lastFocused=document.activeElement;dialog.showModal();dialog.scrollTop=0;}
$$('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$$('dialog').forEach(dialog=>{
 dialog.addEventListener('close',()=>{if(dialog.id==='media-dialog')$('#media-content').replaceChildren();lastFocused?.focus({preventScroll:true});});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
});
function playVideo(id,title){
 $('#media-label').textContent='NOW PLAYING / ECLIPWZE SOUNDS';$('#media-title').textContent=title;
 $('#media-external').href='https://www.youtube.com/watch?v='+id;$('#media-external').textContent='Open on YouTube ↗';
 $('#media-content').innerHTML=`<iframe title="${escapeHTML(title)} — music video" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="player-note">If the embedded video is unavailable, use “Open on YouTube” below.</p>`;
 openDialog($('#media-dialog'));
}
function openArticle(key){const article=ARTICLES[key];if(!article)return;$('#article-content').innerHTML=`<h1>${escapeHTML(article.title)}</h1><div class="article-meta">${article.date} · eclipwze74</div>`+article.paragraphs.map(p=>p==='LOGO OF ECLIPWZE SOUNDS'?`<img src="${assetURL('alignment-3.png')}" alt="Logo of Eclipwze Sounds">`:/^[WZE] – /.test(p)?`<h3>${escapeHTML(p)}</h3>`:p.startsWith('http')?`<p><a class="text-link" target="_blank" rel="noopener" href="${escapeHTML(p)}">${escapeHTML(p)}</a></p>`:`<p>${escapeHTML(p)}</p>`).join('');openDialog($('#article-dialog'));}
function openAlbum(key){const a=ALBUMS.find(x=>x.key===key);if(!a)return;$('#media-label').textContent=a.lang+' SONG RELEASE 2023–24';$('#media-title').textContent=a.name;$('#media-external').href='https://eclipwze74.wixsite.com/eclipwze/'+a.url;$('#media-external').textContent='Original album & music player ↗';$('#media-content').innerHTML=`<div class="album-dialog-body"><img src="${assetURL(a.file)}" alt="${a.name} original cover"><div><p>${a.description}</p><div id="album-tracks"></div></div></div>`;const entries=typeof CATALOGUE!=='undefined'?CATALOGUE[key]:[];$('#album-tracks').innerHTML=entries.map(t=>`<div class="catalogue-track"><span>${escapeHTML(t.title)}</span><small>${escapeHTML(t.duration||t.status||'')}</small>${t.id?`<button class="text-link" data-play="${t.id}" data-title="${escapeHTML(t.title)}">Play ↗</button>`:''}</div>`).join('');openDialog($('#media-dialog'));}
document.addEventListener('click',e=>{
 const play=e.target.closest('[data-play]');if(play){if($('#media-dialog').open)$('#media-dialog').close();playVideo(play.dataset.play,play.dataset.title);return;}
 const article=e.target.closest('[data-article]');if(article)openArticle(article.dataset.article);
 const album=e.target.closest('[data-album]');if(album)openAlbum(album.dataset.album);
 if(e.target.closest('[data-contact]')){openDialog($('#contact-dialog'));try{const draft=JSON.parse(localStorage.getItem('eclipwze-message-draft')||'null');if(draft)for(const [key,value]of Object.entries(draft)){if($('#contact-form').elements[key])$('#contact-form').elements[key].value=value;}}catch{}}
 if(e.target.closest('[data-store]')){showInfo('Store opening soon','Sign up to be the first to know when we go live.','https://eclipwze74.wixsite.com/eclipwze/coming-soon-01','Notify me on the original website ↗');}
 if(e.target.closest('[data-about-studios]')){showInfo('Eclipwze Studios','We are The Eclipwze Sounds. Bringing the rhythm, raising the decibels.','https://eclipwze74.wixsite.com/eclipwze/copy-of-about-us','Original about page ↗');}
});
function showInfo(title,body,href,label){$('#article-content').innerHTML=`<h1>${escapeHTML(title)}</h1><p>${escapeHTML(body)}</p><p><a class="text-link" href="${href}" target="_blank" rel="noopener">${label}</a></p>`;openDialog($('#article-dialog'));}
$('.menu-toggle').addEventListener('click',()=>{const open=$('.site-header').classList.toggle('menu-open');$('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').setAttribute('aria-label',open?'Close menu':'Open menu');$('.menu-toggle span').textContent=open?'−':'+';});
$$('.site-header nav a').forEach(a=>a.addEventListener('click',()=>{$('.site-header').classList.remove('menu-open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Open menu');$('.menu-toggle span').textContent='+';}));
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();try{const values=Object.fromEntries(new FormData(e.target));localStorage.setItem('eclipwze-message-draft',JSON.stringify(values));$('#contact-note').textContent='Draft saved on this device. To send it, use the original website link below.';toast('Message draft saved. Nothing has been sent.');}catch{$('#contact-note').textContent='Your browser cannot save a draft. Use the original website link below to send your message.';}});
$('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();showInfo('Get on the list','Subscribe Now. Complete your signup on our original website. Your email is submitted only when you complete the original signup form.','https://eclipwze74.wixsite.com/eclipwze/blank','Continue to signup ↗');});
let toastTimer;function toast(text){$('.toast').textContent=text;$('.toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').classList.remove('visible'),4000);}
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');let motion=!reducedMotion.matches;
function applyMotion(){document.body.classList.toggle('motion-off',!motion);document.body.classList.toggle('js-motion',motion);$('.motion-toggle').setAttribute('aria-pressed',String(!motion));$('.motion-toggle').setAttribute('aria-label',motion?'Pause animations':'Enable animations');$('.motion-toggle span').textContent=motion?'on':'off';}
$('.motion-toggle').addEventListener('click',()=>{motion=!motion;applyMotion();});reducedMotion.addEventListener('change',e=>{motion=!e.matches;applyMotion();});applyMotion();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));
let activeProcess=-1;let ticking=false;
function updateScroll(){
 const y=window.scrollY;const max=document.documentElement.scrollHeight-window.innerHeight;$('.reading-progress').style.width=(max>0?y/max*100:0)+'%';
 if(motion){$('.illustrated-stage').style.setProperty('--drift',Math.min(y*.09,55)+'px');$('.illustrated-stage').style.setProperty('--eclipse',Math.min(y/600,1));}
 const section=$('.process-scroll');const r=section.getBoundingClientRect();const distance=section.offsetHeight-window.innerHeight+82;const progress=Math.max(0,Math.min(1,(82-r.top)/Math.max(distance,1)));const index=Math.min(2,Math.floor(progress*3));
 if(index!==activeProcess){activeProcess=index;$$('.process-letter').forEach((l,i)=>l.classList.toggle('active',i===index));$('#process-title').textContent=PROCESS[index].title;$('#process-text').textContent=PROCESS[index].text;$('.process-number').textContent='0'+(index+1)+' / 03';}
 $('.process-meter span').style.width=progress*100+'%';ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();

$('#clear-draft').addEventListener('click',()=>{try{localStorage.removeItem('eclipwze-message-draft');}catch{}$('#contact-form').reset();$('#contact-note').textContent='Save a draft on this device, then use the link below to send it on our original website.';toast('Draft cleared.');});
