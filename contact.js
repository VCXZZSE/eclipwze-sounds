(()=>{
  'use strict';
  const dialog=document.getElementById('contact-dialog');
  const form=document.getElementById('contact-form');
  if(!dialog||!form)return;
  const note=document.getElementById('contact-note');
  const button=form.querySelector('button[type="submit"]');
  const label=button.querySelector('span');
  let sending=false;
  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-contact]');
    if(!trigger)return;
    event.preventDefault();
    if(!dialog.open)openDialog(dialog);
  });
  // Recover a draft saved by the old contact form, without storing new messages.
  try{
    const draft=JSON.parse(localStorage.getItem('eclipwze-message-draft')||'null');
    if(draft)for(const key of ['name','email','phone','message']){
      if(typeof draft[key]==='string')form.elements[key].value=draft[key];
    }
  }catch{}
  form.addEventListener('input',()=>{
    if(!sending&&note.dataset.state==='success'){
      note.textContent='We’ll reply to the email you provide.';
      delete note.dataset.state;
      label.textContent='Send your note';
    }
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(sending||!form.reportValidity())return;
    const values=Object.fromEntries(new FormData(form));
    if(String(values._honey||'').trim())return;
    if(!String(values.name||'').trim()||String(values.message||'').trim().length<10){
      note.dataset.state='error';note.textContent='Please add your name and a message of at least 10 characters.';return;
    }
    sending=true;button.disabled=true;form.setAttribute('aria-busy','true');
    delete note.dataset.state;label.textContent='Sending…';note.textContent='One moment. Sending your note…';
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),25000);
    try{
      const response=await fetch('https://formsubmit.co/ajax/eclipwze74@gmail.com',{
        method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(values),signal:controller.signal
      });
      const result=await response.json();
      if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Submission was not accepted.');
      if(/activat|confirm.*email|check.*email/i.test(result.message||'')){
        note.dataset.state='error';note.textContent='Our form is being set up. Please email eclipwze74@gmail.com directly for now.';label.textContent='Try again';
      }else{
        form.reset();try{localStorage.removeItem('eclipwze-message-draft');}catch{}
        note.dataset.state='success';note.textContent='Your note has been submitted. Thank you for reaching out!';label.textContent='Send another note';
      }
    }catch(error){
      note.dataset.state='error';
      note.textContent=error.name==='AbortError'?'The connection timed out. Your message is still here; try again or email us directly.':'We couldn’t confirm your submission. Your message is still here; try again or email us directly.';
      label.textContent='Try sending again';
    }finally{
      clearTimeout(timeout);sending=false;button.disabled=false;form.removeAttribute('aria-busy');
    }
  });
})();
