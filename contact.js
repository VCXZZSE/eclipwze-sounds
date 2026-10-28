(()=>{
  'use strict';
  const dialog=document.getElementById('contact-dialog');
  const form=document.getElementById('contact-form');
  if(!dialog||!form)return;
  const note=document.getElementById('contact-note');
  const button=form.querySelector('button[type="submit"]');
  const label=button.querySelector('span');
  const directEmail=dialog.querySelector('.contact-direct a');
  const draftKey='eclipwze-contact-pending';
  let sending=false;
  function updateDirectEmail(){
    const values=Object.fromEntries(new FormData(form));
    const subject='Eclipwze Sounds — '+(values.enquiry||'Website enquiry');
    const body='Name: '+(values.name||'')+'\nEmail: '+(values.email||'')+'\nPhone: '+(values.phone||'')+'\n\n'+(values.message||'');
    directEmail.href='mailto:eclipwze74@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }
  form.addEventListener('input',updateDirectEmail);
  form.addEventListener('change',updateDirectEmail);
  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-contact]'))return;
    event.preventDefault();
    if(!dialog.open)openDialog(dialog);
  });
  function restoreDraft(){
    try{
      const draft=JSON.parse(sessionStorage.getItem(draftKey)||localStorage.getItem('eclipwze-message-draft')||'null');
      if(draft)for(const key of ['name','email','phone','message','enquiry']){
        if(typeof draft[key]==='string')form.elements[key].value=draft[key];
      }
    }catch{}
    updateDirectEmail();
  }
  restoreDraft();
  form.addEventListener('input',()=>{
    if(note.dataset.state==='success'){
      note.textContent='We’ll reply to the email you provide.';
      delete note.dataset.state;label.textContent='Send your note';
    }
  });
  // Submit from the visitor's browser so the provider can perform its security
  // check. A server-to-server request is rejected by the provider's firewall.
  form.addEventListener('submit',event=>{
    if(sending){event.preventDefault();return;}
    const values=Object.fromEntries(new FormData(form));
    if(String(values._honey||'').trim()){
      event.preventDefault();return;
    }
    if(!form.reportValidity()||!String(values.name||'').trim()||String(values.message||'').trim().length<10){
      event.preventDefault();note.dataset.state='error';
      note.textContent='Please add your name, a valid email and a message of at least 10 characters.';return;
    }
    try{
      const draft={};for(const key of ['name','email','phone','message','enquiry'])draft[key]=values[key];
      sessionStorage.setItem(draftKey,JSON.stringify(draft));
    }catch{}
    sending=true;button.disabled=true;label.textContent='Continue to send…';
    note.textContent='Complete the security check if prompted. You’ll return here when your note is submitted.';
    // Allow the form's documented native POST action. Never claim success here.
  });
  addEventListener('pageshow',()=>{
    sending=false;button.disabled=false;
    if(note.dataset.state!=='success'){
      label.textContent='Send your note';note.textContent='We’ll reply to the email you provide.';
    }
  });
  const url=new URL(location.href);
  if(url.searchParams.get('contact')==='submitted'){
    form.reset();
    try{sessionStorage.removeItem(draftKey);localStorage.removeItem('eclipwze-message-draft');}catch{}
    updateDirectEmail();note.dataset.state='success';
    note.textContent='Thank you! Your note has been submitted. We’ll reply to the email you provided.';
    label.textContent='Send another note';
    url.searchParams.delete('contact');history.replaceState(null,'',url.pathname+url.search+url.hash);
    if(!dialog.open)openDialog(dialog);
  }
})();
