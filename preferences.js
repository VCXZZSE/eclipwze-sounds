(()=>{
 document.documentElement.dataset.theme="light";
 // Only the scene in view spends frames on ambient animation.
 const scenes=document.querySelectorAll('.studio-moment');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('scene-offscreen',!entry.isIntersecting)),{rootMargin:'100px'});
 scenes.forEach(scene=>observer.observe(scene));
 document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
 // Touchscreens expose the same controls through focus/tap, without hover scaling.
 document.querySelectorAll('img').forEach(img=>img.decoding='async');
})();
