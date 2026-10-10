/* Quote form + dialog (same logic as the original inline script). FormSubmit AJAX, honeypot, timing and engagement checks. */
(function(){
  var loadedAt = Date.now();
  var cfg = document.getElementById('qcfg');
  function dest(){ return atob(cfg.dataset.u) + String.fromCharCode(64) + atob(cfg.dataset.d1) + atob(cfg.dataset.d2); }

  document.querySelectorAll('a.eml').forEach(function(a){
    var d = atob(cfg.dataset.pu) + String.fromCharCode(64) + atob(cfg.dataset.pd1) + atob(cfg.dataset.pd2); a.href = 'mailto:' + d; a.textContent = d;
  });
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  var dlg = document.getElementById('qd');
  function openQuote(){
    if (dlg && typeof dlg.showModal === 'function') { dlg.showModal(); var f = dlg.querySelector('input[name="name"]'); if (f) f.focus(); }
    else { var q = document.getElementById('quote'); if (q) q.scrollIntoView(); }
  }
  document.querySelectorAll('[data-open-quote]').forEach(function(b){ b.addEventListener('click', openQuote); });
  document.querySelectorAll('[data-close-quote]').forEach(function(b){ b.addEventListener('click', function(){ dlg.close(); }); });
  if (dlg) dlg.addEventListener('click', function(e){ if (e.target === dlg) dlg.close(); });

  var PHONE = '1-888-779-2284';
  function setStatus(el, cls, msg){ el.className = 'qstatus ' + cls; el.textContent = msg; }

  document.querySelectorAll('form.qf').forEach(function(form){
    var engaged = false;
    ['keydown','pointerdown'].forEach(function(ev){ form.addEventListener(ev, function(){ engaged = true; }, {passive:true}); });
    var status = form.querySelector('.qstatus');
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.elements['name'], phone = form.elements['phone'], zip = form.elements['zip'], email = form.elements['email'];
      [name, phone, zip, email].forEach(function(i){ i.classList.remove('err'); i.removeAttribute('aria-invalid'); });
      var bad = [];
      if (name.value.trim().length < 2) bad.push(name);
      if (phone.value.replace(/\D/g,'').length < 10) bad.push(phone);
      if (!/^\d{5}$/.test(zip.value.trim())) bad.push(zip);
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push(email);
      if (bad.length){
        bad.forEach(function(i){ i.classList.add('err'); i.setAttribute('aria-invalid','true'); });
        bad[0].focus();
        setStatus(status, 'bad', 'Please check the highlighted fields: your name, a 10-digit phone number and a 5-digit ZIP code.');
        return;
      }
      var thanks = 'Thank you. Your request was delivered and a specialist will call you soon. Need us sooner? Call ' + PHONE + '.';
      if (form.elements['_honey'].value){ return; }
      if (Date.now() - loadedAt < 3500){ setStatus(status, 'bad', 'Give the form a moment, then send again.'); return; }
      if (!engaged){ return; }
      var data = {
        name: name.value.trim(), phone: phone.value.trim(), zip: zip.value.trim(), email: email.value.trim(),
        project: form.elements['project'].value, timeline: form.elements['timeline'].value,
        installation: form.elements['install'].value, notes: form.elements['notes'].value.trim(),
        page: location.pathname, form_location: form.dataset.where,
        _subject: 'Aging Safely Baths lead — walkintubshouston.com', _template: 'table', _captcha: 'false'
      };
      btn.disabled = true; btn.textContent = 'Sending...';
      setStatus(status, '', '');
      fetch('https://formsubmit.co/ajax/' + dest(), {
        method: 'POST', headers: {'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(data)
      }).then(function(r){
        return r.json().catch(function(){ return {}; }).then(function(j){ return {ok:r.ok, j:j}; });
      }).then(function(res){
        if (res.ok && (res.j.success === true || res.j.success === 'true')) { form.reset(); setStatus(status, 'ok', thanks); }
        else { setStatus(status, 'warn', 'We sent your request but could not confirm it arrived. Please call ' + PHONE + ' so nothing slips through.'); }
      }).catch(function(){
        setStatus(status, 'bad', 'Your request did not go through. Check your connection and try again, or call ' + PHONE + '.');
      }).then(function(){ btn.disabled = false; btn.textContent = 'Get my installation quote'; });
    });
  });
})();
