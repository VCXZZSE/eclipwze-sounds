/* Ambient loops run independently of scroll and can be paused individually. */
document.querySelectorAll('.moment-pause').forEach(button=>{
 button.addEventListener('click',()=>{
  const scene=button.closest('.studio-moment');
  const paused=scene.classList.toggle('scene-paused');
  button.setAttribute('aria-pressed',String(paused));
  button.setAttribute('aria-label',`${paused?'Resume':'Pause'} ${scene.dataset.scene} animation`);
  button.textContent=paused?'▶':'Ⅱ';
 });
});
