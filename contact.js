(()=>{
  'use strict';
  const dialog=document.getElementById('contact-dialog');
  const form=document.getElementById('contact-form');
  const drafts=window.EclipwzeContactDrafts;
  if(!dialog||!form||!drafts)return;
  const note=document.getElementById('contact-note');
  const query=form.elements.enquiry;
  const message=form.elements.message;
  const gmailLink=document.getElementById('contact-gmail-link');
  const emailLink=dialog.querySelector('.contact-direct a');
  const subjectPreview=document.getElementById('contact-subject-preview');
  const bodyPreview=document.getElementById('contact-body-preview');
  const draftKey='eclipwze-contact-pending';
  const idleNote='Gmail opens with your draft. Review it and press Send there.';
  let currentDraft=null;
  function values(){return Object.fromEntries(new FormData(form));}
  function updatePreview(){
    const preset=drafts.presets[query.value];
    message.placeholder=preset?preset[4]:'Choose a query type, then tell us what’s on your mind…';
    if(!preset){
      currentDraft=null;
      subjectPreview.textContent='Choose a query type to see your email.';
      bodyPreview.textContent='Your name, contact details, and message will appear here.';
      gmailLink.hidden=true;emailLink.href='mailto:eclipwze74@gmail.com';
      return;
    }
    currentDraft=drafts.buildDraft(values());
    subjectPreview.textContent=currentDraft.subject;
    bodyPreview.textContent=currentDraft.body;
    emailLink.href=currentDraft.mailto;
    gmailLink.hidden=!form.checkValidity();
    if(!gmailLink.hidden)gmailLink.href=currentDraft.gmail;
  }
  function rememberDraft(){
    try{sessionStorage.setItem(draftKey,JSON.stringify(values()));}catch{}
  }
  function validate(){
    form.elements.name.setCustomValidity(form.elements.name.value.trim()?'':'Please enter your name.');
    message.setCustomValidity(message.value.trim().length>=10?'':'Please write a message of at least 10 characters.');
    return form.reportValidity();
  }
  form.addEventListener('input',()=>{
    form.elements.name.setCustomValidity('');message.setCustomValidity('');
    note.textContent=idleNote;delete note.dataset.state;updatePreview();
  });
  form.addEventListener('change',updatePreview);
  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-contact]'))return;
    event.preventDefault();if(!dialog.open)openDialog(dialog);
  });
  try{
    const stored=JSON.parse(sessionStorage.getItem(draftKey)||localStorage.getItem('eclipwze-message-draft')||'null');
    if(stored)for(const key of ['name','email','phone','message','enquiry']){
      if(typeof stored[key]==='string'&&form.elements[key]){
        if(key!=='enquiry'||drafts.presets[stored[key]])form.elements[key].value=stored[key];
      }
    }
  }catch{}
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!validate())return;
    updatePreview();rememberDraft();
    if(!currentDraft)return;
    // Open synchronously with the visitor's click: no request or security queue.
    const opened=window.open(currentDraft.gmail,'_blank');
    if(opened){
      try{opened.opener=null;}catch{}
      note.textContent='Continue in Gmail to review and send your note. Your form is kept here.';
      note.dataset.state='ready';
    }else{
      note.textContent='Your browser blocked the new tab. Use “Open Gmail draft” below, or use your email app.';
      note.dataset.state='error';
    }
  });
  form.addEventListener('keydown',event=>{
    if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){
      event.preventDefault();form.requestSubmit();
    }
  });
  gmailLink.addEventListener('click',event=>{
    if(!validate()){event.preventDefault();return;}
    updatePreview();rememberDraft();
    note.textContent='Review your draft in Gmail and press Send when you’re ready.';
    note.dataset.state='ready';
  });
  emailLink.addEventListener('click',event=>{
    if(!validate()){event.preventDefault();return;}
    updatePreview();rememberDraft();
    note.textContent='Review the draft in your email app and press Send there.';
    note.dataset.state='ready';
  });
  const url=new URL(location.href);
  if(url.searchParams.has('contact')){
    url.searchParams.delete('contact');history.replaceState(null,'',url.pathname+url.search+url.hash);
  }
  note.textContent=idleNote;updatePreview();
})();
