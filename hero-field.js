/* Eclipwze sound contours: a time-based fluid field shaped by pointer energy.
   Marching squares draws continuous contour lines, with no images or WebGL dependency. */
(()=>{
 const hero=document.querySelector('.hero');
 if(!hero)return;
 const layer=document.createElement('div');layer.className='hero-sound-field';layer.setAttribute('aria-hidden','true');
 const canvas=document.createElement('canvas');layer.append(canvas);hero.prepend(layer);
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
 const coarse=matchMedia('(pointer:coarse)');const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,cols=0,rows=0,values,step=22,frame=0,last=0,visible=true,dirty=true;
 let x=0,y=0,targetX=0,targetY=0,energy=0,targetEnergy=0,lastDrop=0,lastInput=0,phase=0;
 const ripples=[];
 const enabled=()=>!document.documentElement.classList.contains('opening-active')&&!document.body.classList.contains('motion-off')&&!reduced.matches;
 function size(){
  const rect=hero.getBoundingClientRect();width=rect.width;height=rect.height;
  const dpr=Math.min(devicePixelRatio||1,width<701?1.25:1.5);canvas.width=Math.ceil(width*dpr);canvas.height=Math.ceil(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  step=width<701?30:24;cols=Math.ceil(width/step)+1;rows=Math.ceil(height/step)+1;values=new Float32Array(cols*rows);
  targetX=x=width*.66;targetY=y=height*.55;dirty=true;wake();
 }
 function pointer(e){
  if(!enabled())return;
  const rect=hero.getBoundingClientRect();targetX=e.clientX-rect.left;targetY=e.clientY-rect.top;
  targetEnergy=1;lastInput=performance.now();
  if(lastInput-lastDrop>140){ripples.push({x:targetX,y:targetY,born:lastInput});if(ripples.length>7)ripples.shift();lastDrop=lastInput;}
  wake();
 }
 hero.addEventListener('pointermove',pointer,{passive:true});
 hero.addEventListener('pointerdown',pointer,{passive:true});
 hero.addEventListener('pointerleave',()=>{targetEnergy=0;wake();},{passive:true});
 function glow(px,py,radius,color,alpha){const gradient=ctx.createRadialGradient(px,py,0,px,py,radius);gradient.addColorStop(0,`rgba(${color},${alpha})`);gradient.addColorStop(.48,`rgba(${color},${alpha*.5})`);gradient.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);}
 function draw(now){
  ctx.clearRect(0,0,width,height);
  const radius=Math.min(width*.38,420);const active=enabled()?energy:0;const dark=document.documentElement.dataset.theme==='dark';
  glow(width*.82,height*.72,Math.max(width*.34,260),'151,166,112',dark?.065:.045);
  if(active>.005){
   glow(x,y,radius,'211,104,58',active*(dark?.14:.19));
   glow(width-x*.55,height-y*.5,radius*1.15,'126,151,99',active*.12);
  }
  const scale=Math.min(1.1,Math.max(.7,width/1250));
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
   const px=i*step,py=j*step;const u=px/scale,v=py/scale;
   let value=Math.sin(u*.0048+Math.sin(v*.0042+phase)*1.1)+Math.cos(v*.0061-u*.0016-phase*.4)*.9+Math.sin((u+v)*.0028)*.52;
   if(active>.005){
    const dx=px-x,dy=py-y,d2=dx*dx+dy*dy;
    value+=Math.exp(-d2/(radius*radius*.48))*active*1.8;
    for(const r of ripples){const age=(now-r.born)/1000;if(age>2.3)continue;const d=Math.hypot(px-r.x,py-r.y);value+=Math.sin(d*.028-age*4.8)*Math.exp(-Math.pow((d-age*115)/125,2))*Math.exp(-age*1.7)*.18*active;}
   }
   values[j*cols+i]=value;
  }
  // Each cell's edge crossings are joined into smooth, unbroken contour paths.
  const levels=width<701?10:14;
  for(let level=0;level<levels;level++){
   const iso=-2.5+level*5/(levels-1);ctx.beginPath();
   for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){
    const n=j*cols+i,a=values[n],b=values[n+1],c=values[n+cols+1],d=values[n+cols];
    const code=(a<iso?1:0)|(b<iso?2:0)|(c<iso?4:0)|(d<iso?8:0);
    if(code===0||code===15)continue;
    const px=i*step,py=j*step;
    const topX=px+(iso-a)/(b-a)*step,rightY=py+(iso-b)/(c-b)*step,bottomX=px+(iso-d)/(c-d)*step,leftY=py+(iso-a)/(d-a)*step;
    switch(code){
     case 1:case 14:ctx.moveTo(topX,py);ctx.lineTo(px,leftY);break;
     case 2:case 13:ctx.moveTo(topX,py);ctx.lineTo(px+step,rightY);break;
     case 3:case 12:ctx.moveTo(px,leftY);ctx.lineTo(px+step,rightY);break;
     case 4:case 11:ctx.moveTo(px+step,rightY);ctx.lineTo(bottomX,py+step);break;
     case 6:case 9:ctx.moveTo(topX,py);ctx.lineTo(bottomX,py+step);break;
     case 7:case 8:ctx.moveTo(px,leftY);ctx.lineTo(bottomX,py+step);break;
     default:ctx.moveTo(topX,py);ctx.lineTo(px+step,rightY);ctx.moveTo(px,leftY);ctx.lineTo(bottomX,py+step);
    }
   }
   const ink=level%4===0;ctx.lineWidth=ink?.85:.65;
   ctx.strokeStyle=dark?(ink?`rgba(229,162,112,${.11+active*.05})`:`rgba(158,181,129,${.10+active*.05})`):(ink?`rgba(164,99,62,${.12+active*.035})`:`rgba(91,108,72,${.10+active*.03})`);ctx.stroke();
  }
 }
 function tick(now){
  frame=0;if(!visible||document.hidden)return;
  if(now-last<(energy>.05?40:80)){wake();return;}const dt=Math.min((now-last)||33,65);last=now;
  if((coarse.matches||width<701)&&now-lastInput>750)targetEnergy=0;
  x+=(targetX-x)*.11;y+=(targetY-y)*.11;energy+=(targetEnergy-energy)*.08;
  for(let i=ripples.length-1;i>=0;i--)if(now-ripples[i].born>2300)ripples.splice(i,1);
  if(enabled()){phase+=dt*.000015;draw(now);if(width>=701&&!coarse.matches||energy>.005||targetEnergy>0)wake();}
  else if(dirty){energy=0;draw(now);dirty=false;}
 }
 function wake(){if(!frame&&visible)frame=requestAnimationFrame(tick);}
 new ResizeObserver(size).observe(hero);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else{last=0;wake();}},{rootMargin:'80px'}).observe(hero);
 new MutationObserver(()=>{dirty=true;wake();}).observe(document.body,{attributes:true,attributeFilter:['class']});
 document.addEventListener('eclipwze-theme',()=>{dirty=true;if(visible){draw(performance.now());wake();}});
 reduced.addEventListener('change',()=>{dirty=true;wake();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(visible){last=0;wake();}});
 window.addEventListener('eclipwze:artwork-visible',()=>{dirty=true;last=0;wake();});
 size();
})();
