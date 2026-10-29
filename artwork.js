/* Shared, decoded local artwork. No third-party players or tracking is prefetched. */
(()=>{'use strict';
const pending=new Map();
function loadImage(source,priority='low'){
 const url=new URL(source,location.href);if(url.origin!==location.origin)return Promise.reject(new Error('Only local artwork is preloaded.'));
 if(pending.has(url.href))return pending.get(url.href);
 const promise=new Promise((resolve,reject)=>{const image=new Image();let settled=false;image.decoding='async';image.fetchPriority=priority;
 const timer=setTimeout(()=>finish(new Error('Artwork request timed out')),20000);
 function finish(error){if(settled)return;settled=true;clearTimeout(timer);image.onload=image.onerror=null;if(error){pending.delete(url.href);reject(error);}else resolve(image);}
 image.onload=async()=>{try{if(!image.naturalWidth)throw Error('Empty artwork');if(image.decode)await image.decode();finish();}catch(error){finish(error);}};
 image.onerror=()=>finish(new Error('Artwork could not be loaded'));image.src=url.href;
 });pending.set(url.href,promise);return promise;
}
window.EclipwzeArtwork={loadImage};
})();
