'use strict';
// Existing copy, music links and the WZE chapter are kept in app.js/content.js.
const iconNames = ['spotify','youtube','applemusic','soundcloud','instagram'];
function platformFor(href){if(href.includes('spotify.com'))return 'spotify';if(/youtube\.com|youtu\.be/.test(href))return 'youtube';if(href.includes('music.apple.com'))return 'applemusic';if(href.includes('soundcloud.com'))return 'soundcloud';if(href.includes('instagram.com'))return 'instagram';if(href.includes('jiosaavn.com'))return 'jiosaavn';return null;}
function platformIcons(root=document){
 $$('a[href]',root).forEach(a=>{const service=platformFor(a.href);if(!service||a.querySelector('.service-icon')||a.classList.contains('brand'))return;const img=document.createElement('img');img.className='service-icon icon-'+service;img.alt='';img.setAttribute('aria-hidden','true');img.src=assetURL('icon-'+service+(service==='jiosaavn'?'.png':'.svg'));a.prepend(img);});
 $$('button[data-play].pill',root).forEach(button=>{if(button.querySelector('.service-icon'))return;button.innerHTML=button.innerHTML.replace('▶','');const img=document.createElement('img');img.className='service-icon';img.alt='';img.setAttribute('aria-hidden','true');img.src=assetURL('icon-youtube.svg');button.prepend(img);});
}
$('#collaborator-list').innerHTML=COLLABORATORS.map((c,i)=>`<details class="collaborator"><summary aria-label="Read about ${escapeHTML(c.name)}"><div class="collaborator-portrait"><img src="${assetURL(c.image)}" alt="${c.name}" loading="lazy"><span>0${i+1}</span></div><div class="collaborator-caption"><h3>${c.name}</h3><span class="collaborator-plus" aria-hidden="true">+</span></div><span class="collaborator-role eyebrow">${c.role}</span></summary><div class="collaborator-body"><p>${escapeHTML(c.body)}</p>${c.email?`<a href="mailto:${c.email}">${c.email}</a><br>`:''}<a href="${c.url}" target="_blank" rel="noopener">Instagram ↗</a></div></details>`).join('');
$$('.album-art').forEach((art,i)=>{const n=document.createElement('span');n.className='album-sleeve-number';n.textContent='ECLIPWZE / 00'+(i+1);art.append(n);});
// Preserve exact original founder biographies; the mixer chooses which one is in focus.
const duoCopy=[
 {title:'SIDE A / VIOLIN / FOUNDER',body:'Repome Roy Mondal is a Kolkata based versatile violinist currently working for his own built band The Eclipwze Sounds with his co partner Deb Banerjee'},
 {title:'IN STEREO / ECLIPWZE SOUNDS',body:'One of us with a violin, the other with a guitar. Ideas turned into riffs, riffs into recordings.'},
 {title:'SIDE B / GUITAR & PRODUCTION / CO-FOUNDER',body:'Deb Banerjee currently serves as both a guitarist and a music producer and engineer at Eclipwze Sounds. He co-founded Eclipwze Sounds, an emerging venture originating from Kolkata, alongside Repome Roy Mondal.'}
];
// Two layers let the Bengali initial fill with the same light as its portrait.
$$('.duo-bengali').forEach(letter=>{
 const glyph=letter.textContent.trim();letter.innerHTML=`<span class="duo-glyph-outline">${glyph}</span><span class="duo-glyph-fill">${glyph}</span><span class="duo-glyph-spark">✦</span>`;
});
let selectedDuo=1;
function mixDuo(value){const v=Math.max(0,Math.min(100,Number(value)));$('.duo-deck').style.setProperty('--mix',v/100);$$('.duo-person-name[data-solo]').forEach(button=>button.setAttribute('aria-pressed',String(v<32?button.dataset.solo==='0':v>68?button.dataset.solo==='100':false)));$('#duo-mix').value=v;const which=v<32?0:v>68?2:1;$('.duo-workstation').dataset.profile=['repome','both','deb'][which];$('#duo-active-name').textContent=['Repome Roy Mondal','Repome + Deb','Deb Banerjee'][which];if(which!==selectedDuo){selectedDuo=which;$('#duo-note .eyebrow').textContent=duoCopy[which].title;$('#duo-note p').textContent=duoCopy[which].body;}$$('.duo-selector [data-solo]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.solo)===[0,50,100][which])));}
$('#duo-mix').addEventListener('input',e=>mixDuo(e.target.value));
$$('[data-solo]').forEach(button=>button.addEventListener('click',()=>mixDuo(button.dataset.solo)));
mixDuo(50);
// Portrait buttons respond to keyboard, taps and hover. No hover-only content.
$$('.collaborator').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)$$('.collaborator').filter(other=>other!==details).forEach(other=>other.open=false);}));
platformIcons();document.addEventListener('click',()=>queueMicrotask(()=>platformIcons()));
$$('.sprite-window>img').forEach(img=>{img.classList.add('action-pose');const idle=document.createElement('img');idle.src=assetURL('duo.png');idle.alt='';idle.setAttribute('aria-hidden','true');idle.className='standing-pose';img.after(idle);});
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const stuntKeys=[
 {at:0,x:-.54,y:.19,r:-28,o:0},{at:.16,x:-.29,y:.09,r:-12,o:1},
 {at:.32,x:-.22,y:-.04,r:5,o:1},{at:.52,x:.04,y:-.29,r:200,o:1},
 {at:.72,x:.27,y:-.09,r:355,o:1},{at:.88,x:.25,y:.16,r:360,o:1},
 {at:1,x:.25,y:.16,r:360,o:1}
];
function interpolateStunt(p){let end=stuntKeys.findIndex(k=>k.at>=p);if(end<=0)return stuntKeys[0];const a=stuntKeys[end-1],b=stuntKeys[end];let t=(p-a.at)/(b.at-a.at);t=t*t*(3-2*t);const out={};for(const key of ['x','y','r','o'])out[key]=a[key]+(b[key]-a[key])*t;return out;}
let stuntFrame=false;
function scoreScroll(){
 stuntFrame=false;
 const section=$('.stunt-scroll'),sticky=$('.stunt-sticky');if(!section||!sticky)return;
 const head=$('.site-header').offsetHeight;const bounds=section.getBoundingClientRect();if(bounds.top>innerHeight+100||bounds.bottom<0)return;const top=bounds.top;const travel=Math.max(section.offsetHeight-innerHeight+head,1);const progress=clamp((head-top)/travel);const p=motion?progress:.96;const k=interpolateStunt(p);const w=sticky.clientWidth,h=sticky.clientHeight;const performerWidth=$('.sprite-window').clientWidth;const small=w<701;
 // Paths cross above a spinning record, turn a full circle and land facing each other.
 const x=k.x*w*(small?.85:1);const y=k.y*h;const centerOffset=performerWidth/2;const baseY=h*(small?.09:.25);const crossingSeparation=Math.pow(Math.sin(p*Math.PI),2)*(small?65:120);
 $('.stunt-repome').style.transform=`translate(${-centerOffset+x}px,${-baseY+y}px) rotate(${k.r}deg)`;
 $('.stunt-deb').style.transform=`translate(${-centerOffset-x}px,${-baseY+y+(small?30:15)+crossingSeparation}px) rotate(${-k.r}deg)`;
 $$('.stunt-performer').forEach(el=>{el.style.opacity=k.o;el.style.setProperty('--landed',clamp((p-.8)/.1));});
 sticky.style.setProperty('--title-y',(-p*75)+'px');sticky.style.setProperty('--record-rotation',(p*620)+'deg');
 $('.stunt-record').style.bottom=(small?-7-p*2:-50+p*29)+'%';$('.stunt-timeline span').style.width=progress*100+'%';
 $('.stunt-counter').textContent=progress<.28?'01 / DROP IN':progress<.73?'02 / BREAK ORBIT':'03 / BACK IN SYNC';
 const origin=$('.origin-pictures');const originProgress=clamp((innerHeight-origin.getBoundingClientRect().top)/(innerHeight+origin.offsetHeight));origin.style.setProperty('--origin-shift',motion?((originProgress-.5)*35)+'px':'0px');
 stuntFrame=false;
}
function requestScore(){if(!stuntFrame){stuntFrame=true;requestAnimationFrame(scoreScroll);}}
window.addEventListener('scroll',requestScore,{passive:true});window.addEventListener('resize',requestScore);$('.motion-toggle').addEventListener('click',scoreScroll);
$('.stunt-replay').addEventListener('click',()=>{if(!motion){toast('Turn motion on to replay the stunt.');return;}$$('.stunt-performer').forEach((el,i)=>{const base=el.style.transform;el.animate([{transform:base},{transform:base+` translateY(-${Math.min(innerHeight*.2,150)}px) rotate(${i?-360:360}deg)`,offset:.55},{transform:base}],{duration:1500,easing:'cubic-bezier(.3,0,.3,1)'});});});
// A subtle stage light follows the pointer, while type and portraits keep their own hierarchy.
$('.stunt-sticky').addEventListener('pointermove',e=>{if(!motion||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();$('.stunt-orbit').style.transform=`rotate(${-20+(e.clientX-r.left)/r.width*15}deg)`;});
scoreScroll();
$$('.duo-socials a').forEach(a=>{a.dataset.artist=a.textContent.trim().startsWith('Repome')?'repome':'deb';});