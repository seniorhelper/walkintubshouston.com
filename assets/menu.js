(function(){
  var b = document.querySelector('.menu-btn'), m = document.getElementById('mnav');
  if (!b || !m) return;
  b.addEventListener('click', function(){
    var open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', open ? 'false' : 'true');
    m.hidden = open;
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !m.hidden){ m.hidden = true; b.setAttribute('aria-expanded','false'); b.focus(); } });
})();
