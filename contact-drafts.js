(function(root){
'use strict';
const presets={
collaboration:['Collaboration idea','I have a music idea I’d love to try with you.','The idea I’d like to explore','If you’re feeling it too, let’s figure out the next step.','Tell us what you play or sing, your idea, and any links to your work.'],
booking:['Live performance enquiry','We’d love to have Eclipwze Sounds on our stage.','Event details and what I have in mind','Please let me know your availability, booking process, and any details you need to prepare a quote.','Share the event, date, city or venue, audience size, set length, and budget if you have one.'],
production:['Music production enquiry','I have a song in the works and would love your help shaping its sound.','About the project','I’d appreciate your thoughts on the approach, availability, timeline, and next steps.','Describe the track, the sound you’re after, what help you need, and your timeline. Demo links are welcome.'],
press:['Press and interview enquiry','I’m reaching out about a press, interview, or feature opportunity for Eclipwze Sounds.','About the opportunity','Please let me know if you’re interested and whom I should coordinate with.','Tell us your publication or channel, the proposed feature, format, deadline, and any useful links.'],
feedback:['A note about your music','Your music stayed with me, so I thought I’d write.','What I wanted to tell you','Thanks for the music. Keep it coming!','Which song or moment stayed with you? Share your thoughts, a memory, or a song you’d love to hear.'],
rights:['Rights, permission or credits enquiry','I’m writing about rights, permission, or credits relating to Eclipwze Sounds.','The work and my enquiry','Please let me know the appropriate process and any further information you need from me.','Name the song or video, include its link, and explain the permission, usage, or credits you’re asking about.'],
general:['General enquiry','I thought I’d drop you a line.','What’s on my mind','Looking forward to hearing from you when you get a moment.','Tell us what’s on your mind and how we can help.']};
function buildDraft(values){
 const preset=presets[values.enquiry];
 if(!preset)throw new Error('Please choose a query type.');
 const name=String(values.name||'').trim(),email=String(values.email||'').trim(),phone=String(values.phone||'').trim(),message=String(values.message||'').trim();
 const labels={collaboration:'Music collaboration',booking:'Live performance / booking',production:'Production / arrangement',press:'Press / interview / feature',feedback:'Feedback / a little love',rights:'Rights / permission / credits',general:'General enquiry'};
 const subject=preset[0]+' | '+name+' → Eclipwze Sounds';
 const body=['Hi Repome and Deb,','',preset[1],'',preset[2]+':',message,'',preset[3],'','Warm regards,',name,'Email: '+email,...(phone?['Phone: '+phone]:[]),'','Query type: '+labels[values.enquiry],'Prepared through the official Eclipwze Sounds website.'].join('\n');
 const gmail='https://mail.google.com/mail/?'+new URLSearchParams({view:'cm',fs:'1',to:'eclipwze74@gmail.com',su:subject,body});
 const mailto='mailto:eclipwze74@gmail.com?'+new URLSearchParams({subject,body}).toString().replace(/\+/g,'%20');
 return {subject,body,gmail,mailto};
}
const api={presets,buildDraft};
if(typeof module==='object'&&module.exports)module.exports=api;else root.EclipwzeContactDrafts=api;
})(typeof globalThis!=='undefined'?globalThis:this);
