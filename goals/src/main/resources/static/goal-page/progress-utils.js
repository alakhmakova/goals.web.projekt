// expose a small helper to paint a progress bar based on percentage value
// expected: element is the inner fill element (e.g., .top-fill)
(function(){
  function clamp(n){
    return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
  }
  function updateProgressBar(fillEl, percent){
    const pct = clamp(percent);
    if(!fillEl) return;
    fillEl.style.width = pct + '%';
    // color stays same (violet), but could be extended to thresholds
    fillEl.setAttribute('aria-valuenow', String(pct));
    const track = fillEl.parentElement;
    if(track){
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', '100');
      track.setAttribute('aria-valuenow', String(pct));
    }
  }
  window.updateProgressBar = updateProgressBar;
})();