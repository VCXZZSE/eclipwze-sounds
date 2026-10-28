'use strict';
// The recipient is fixed on the server: callers cannot turn this into an email relay.
module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  const origin=req.headers.origin;
  if(origin&&origin!=='https://eclipwze-sounds.vercel.app')return res.status(403).json({error:'Please use the contact form on our official website.'});
  if(Number(req.headers['content-length']||0)>20000)return res.status(413).json({error:'Please shorten your message.'});
  let body=req.body;
  if(typeof body==='string'){try{body=JSON.parse(body);}catch{return res.status(400).json({error:'Invalid message.'});}}
  if(!body||typeof body!=='object'||Array.isArray(body))return res.status(400).json({error:'Invalid message.'});
  const clean=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';
  const name=clean(body.name,100),email=clean(body.email,254),message=clean(body.message,5000),phone=clean(body.phone,35),enquiry=clean(body.enquiry,80);
  if(body._honey||!name||/[\r\n]/.test(name)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<10)return res.status(400).json({error:'Please enter your name, a valid email and a message of at least 10 characters.'});
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
  try{
    const response=await fetch('https://formsubmit.co/ajax/eclipwze74@gmail.com',{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','Referer':'https://eclipwze-sounds.vercel.app/','Origin':'https://eclipwze-sounds.vercel.app'},
      body:JSON.stringify({name,email,phone,enquiry,message,_subject:'New message · Eclipwze Sounds official website',_template:'table',_url:'https://eclipwze-sounds.vercel.app/'}),signal:controller.signal
    });
    const raw=await response.text();
    let result;
    try{result=JSON.parse(raw);}catch{
      console.warn('Contact provider returned non-JSON:',response.status,response.headers.get('content-type'),raw.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]||'No title');
      throw new Error('Invalid provider response.');
    }
    if(/activat|confirm.*email|check.*email/i.test(result.message||''))return res.status(503).json({code:'CONTACT_NOT_ACTIVATED',error:'Our form is being set up. Please email eclipwze74@gmail.com directly for now.'});
    if(!response.ok||!(result.success===true||result.success==='true')){console.warn('Contact provider rejected request:',response.status,String(result.message||'No provider message').slice(0,250));return res.status(502).json({error:'We couldn’t submit your message. Please try again or email us directly.'});}
    return res.status(200).json({success:true});
  }catch(error){
    console.warn('Contact delivery unavailable:',error.name,error.message);
    return res.status(502).json({error:'We couldn’t confirm your submission. Please try again or email us directly.'});
  }finally{clearTimeout(timeout);}
};
