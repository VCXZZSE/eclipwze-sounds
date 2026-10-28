(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const selectors='.section-title h2,.album-heading h3,.duo-heading h2,.journal-masthead h2,.origin-writing h2,.contact-section>h2,.archive-heading h2,.closing-note>p,.reader-body h2,.next-story h2';
 const titles=[...document.querySelectorAll(selectors)];
 const watch=[];
 titles.forEach(title=>{
  if(reduce.matches)return;
  const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT),texts=[];while(walker.nextNode())texts.push(walker.currentNode);
  let i=0;texts.forEach(node=>{if(!node.textContent.trim())return;const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word)return;if(/^\s+$/.test(word))fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='flow-word';span.style.setProperty('--flow-i',Math.min(i++,8));span.textContent=word;fragment.append(span)}});node.replaceWith(fragment)});
  title.classList.add('flow-title');watch.push(title);
 });
 document.querySelectorAll('.section-top,.section-rule,.zine-edition').forEach(el=>{el.classList.add('flow-rule');watch.push(el)});
 document.querySelectorAll('.origin-main img,.origin-inset img,.reader-cover:not(.logo-art) img').forEach(el=>el.classList.add('flow-photo'));
 if(!('IntersectionObserver'in window)){watch.forEach(el=>el.classList.add('flow-seen'));return}
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('flow-seen');observer.unobserve(entry.target)}})},{threshold:.15,rootMargin:'0px 0px -25px 0px'});
 watch.forEach(el=>observer.observe(el));
})();
