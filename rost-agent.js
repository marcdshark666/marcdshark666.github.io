/* Röstagenten på The Work List (#311).
 *
 * Marc 2026-09-16: "en knapp som man kan prata med The Worklist högst upp som
 * en AI-agent som har en röst med en glob som en 3D-modell som rör sig i takt
 * med rösten ... man kan starta den och fråga och begära också och koordinera
 * saker ... likt som man kan göra på telegram ... Du kan använda en Google
 * röstmodell så att man kan använda allting gratis så att den inte drar API
 * kostnader eller annat."
 *
 * Därför: INGEN modell i molnet, ingen nyckel, ingen kostnad.
 *  - Örat   = webbläsarens SpeechRecognition (i Chrome är det Googles egen
 *             röstigenkänning, gratis och utan konto).
 *  - Rösten = speechSynthesis, helst en svensk Google-röst.
 *  - Hjärnan = reglerna här nere. De läser samma livevy som sidan ritas av
 *             (window.WL_DATA), så frågor besvaras direkt utan nätverk.
 *  - Handen = /api/rost. Det Marc BEGÄR skickas dit och blir ett riktigt
 *             uppdrag på listan inom en minut (worklist.js rost).
 *
 * Globen är en punktsfär i canvas — ingen three.js, inget CDN, ingen CSP-fråga.
 * Den roterar, andas och slår ut i takt med ljudet: mikrofonens verkliga styrka
 * när du pratar, och en ordpuls från talsyntesen när agenten svarar.
 */
(function () {
  'use strict';

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var TTS = window.speechSynthesis || null;
  var HAR_ORA = !!SR;

  /* ------------------------------------------------------------------ data */
  var D = function () { return window.WL_DATA || { items: [], vakthundar: [], routines: [], runs: [] }; };
  var items = function () { return (D().items || []); };
  var med = function (s) { return items().filter(function (i) { return i.status === s; }); };
  var oppna = function () { return med('open'); };
  var pagar = function () { return med('working'); };
  var hinder = function () { return med('failed'); };
  var pausade = function () { return med('paused'); };
  var klaraIdag = function () {
    var idag = new Date().toLocaleDateString('sv-SE');
    return items().filter(function (i) {
      if (i.status !== 'done' || !i.finished) return false;
      try { return new Date(i.finished).toLocaleDateString('sv-SE') === idag; } catch (e) { return false; }
    });
  };
  var kort = function (t, n) {
    t = String(t == null ? '' : t).replace(/\s+/g, ' ').trim();
    n = n || 110;
    return t.length > n ? t.slice(0, n - 1) + '…' : t;
  };
  var antal = function (n, ett, flera) { return n + ' ' + (n === 1 ? ett : flera); };

  /* Uppdragstexten som den ska LÅTA: numret först, sedan meningen, utan
   * parentesernas maskineri (körnings-id, taggar) som bara stör i örat. */
  var sagUppdrag = function (it) {
    var t = String(it.text || '').split('\n')[0];
    return 'number ' + it.id + ': ' + kort(t, 140);
  };

  /* --------------------------------------------------------------- panelen */
  var panel = null, cv = null, statusEl = null, loggEl = null, micKnapp = null, glob = null;
  var oppen = false, lyssnar = false, talar = false, tyst = false;
  var vantarPa = null;        // en begäran som väntar på "ja" eller "nej"
  var sistaSvar = '';
  var bevakade = [];          // röstrader vi väntar på uppdragsnummer för

  function byggPanel() {
    if (panel) return;
    panel = document.createElement('div');
    panel.className = 'rost-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Talk to The Work List');
    panel.innerHTML = ''
      + '<div class="rost-ruta">'
      + '  <button type="button" class="rost-stang" aria-label="Close">✕</button>'
      + '  <canvas class="rost-glob" width="440" height="440" aria-hidden="true"></canvas>'
      + '  <div class="rost-status" aria-live="polite">Press the microphone and talk.</div>'
      + '  <div class="rost-logg" aria-live="polite"></div>'
      + '  <div class="rost-knappar">'
      + '    <button type="button" class="rost-mic">🎙️ Start</button>'
      + '    <button type="button" class="rost-tyst" title="Mute the voice">🔊</button>'
      + '    <button type="button" class="rost-hjalp" title="What can I say?">❔</button>'
      + '  </div>'
      + '  <div class="rost-fot">The ear and the voice are the browser\u2019s own (Google) — no API costs. Whatever you <b>ask for</b> becomes a task on the list.</div>'
      + '</div>';
    document.body.appendChild(panel);
    cv = panel.querySelector('.rost-glob');
    statusEl = panel.querySelector('.rost-status');
    loggEl = panel.querySelector('.rost-logg');
    micKnapp = panel.querySelector('.rost-mic');
    panel.querySelector('.rost-stang').addEventListener('click', stang);
    panel.addEventListener('click', function (e) { if (e.target === panel) stang(); });
    micKnapp.addEventListener('click', function () { if (lyssnar) { stoppaLyssna(true); status('Paused — press to talk again.'); } else { startaLyssna(); } });
    panel.querySelector('.rost-tyst').addEventListener('click', function (e) {
      tyst = !tyst;
      e.currentTarget.textContent = tyst ? '🔇' : '🔊';
      e.currentTarget.title = tyst ? 'The voice is off — answers show as text only' : 'Mute the voice';
      if (tyst && TTS) TTS.cancel();
    });
    panel.querySelector('.rost-hjalp').addEventListener('click', function () { svara(hjalpText()); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && oppen) stang(); });
    glob = nyGlob(cv);
  }

  function skrivLogg(vem, text) {
    if (!loggEl) return;
    var rad = document.createElement('div');
    rad.className = 'rost-rad ' + vem;
    rad.textContent = (vem === 'du' ? '🗣 ' : '🌐 ') + text;
    loggEl.appendChild(rad);
    while (loggEl.children.length > 40) loggEl.removeChild(loggEl.firstChild);
    loggEl.scrollTop = loggEl.scrollHeight;
  }
  function status(t) { if (statusEl) statusEl.textContent = t; }

  function visa() {
    byggPanel();
    oppen = true;
    panel.classList.add('pa');
    document.body.classList.add('rost-oppet');
    glob.start();
    if (!HAR_ORA) {
      status('This browser cannot listen. Chrome on desktop or Android works.');
      skrivLogg('ai', 'I can talk but not hear in here — speech recognition only exists in Chrome-like browsers. Write in Telegram as usual for now.');
      return;
    }
    halsa();
  }
  function stang() {
    oppen = false;
    if (panel) panel.classList.remove('pa');
    document.body.classList.remove('rost-oppet');
    stoppaLyssna(true);
    if (TTS) TTS.cancel();
    talar = false;
    if (glob) glob.stop();
  }

  function halsa() {
    var h = new Date().getHours();
    var tid = h < 5 ? 'Good night' : h < 10 ? 'Good morning' : h < 18 ? 'Hello' : 'Good evening';
    var p = pagar().length, o = oppna().length;
    svara(tid + '. ' + (p + o
      ? antal(p, 'task is in progress', 'tasks are in progress') + ' and ' + antal(o, 'is queued', 'are queued') + '. What would you like?'
      : 'The list is empty right now. Say the word if you want to add something.'));
    startaLyssna();
  }

  /* ------------------------------------------------------------------ rösten */
  var rostVal = null;
  function valjRost() {
    if (!TTS || rostVal) return rostVal;
    var alla = TTS.getVoices() || [];
    var sv = alla.filter(function (v) { return /^en/i.test(v.lang || ''); });
    // Googles röst låter mest som en människa — den Marc bad om.
    rostVal = sv.filter(function (v) { return /google/i.test(v.name); })[0]
      || sv.filter(function (v) { return /natural|online/i.test(v.name); })[0]
      || sv[0] || null;
    return rostVal;
  }
  if (TTS) { try { TTS.onvoiceschanged = function () { rostVal = null; valjRost(); }; } catch (e) { /* äldre webbläsare */ } }

  /* Uppdragstexterna är skrivna för ögat: emoji, «citattecken» och pilar. Skärmen
   * behåller dem, men munnen läser en rensad version — annars stavar rösten
   * "klocka" och "vänsterpil" mitt i en mening. */
  function renText(t) {
    return String(t)
      .replace(/[\u{1F000}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{20E3}]/gu, ' ')
      .replace(/[«»"„”]/g, ' ')
      .replace(/\s*[·|]\s*/g, ', ')
      .replace(/#(\d)/g, 'number $1')
      .replace(/\s+/g, ' ').trim();
  }

  function tala(text, sedan) {
    if (!TTS || tyst) { if (sedan) sedan(); return; }
    text = renText(text);
    try { TTS.cancel(); } catch (e) { /* inget att avbryta */ }
    var u = new SpeechSynthesisUtterance(text);
    var v = valjRost();
    if (v) u.voice = v;
    u.lang = (v && v.lang) || 'en-US';
    u.rate = 1.03; u.pitch = 1.0;
    talar = true;
    if (glob) glob.lage('talar');
    // Örat stängs medan munnen går: annars hör agenten sig själv och svarar på
    // sitt eget svar. Det startas om när meningen är slut.
    stoppaLyssna(false);
    u.onboundary = function () { if (glob) glob.puls(); };
    var klar = function () {
      talar = false;
      if (glob) glob.lage(lyssnar ? 'lyssnar' : 'vilar');
      // `vill` läses här och inte när meningen började: hälsningen sätter viljan
      // efter att munnen redan öppnats, och en kopia hade låst örat stängt.
      if (vill && oppen) setTimeout(startaLyssna, 250);
      if (sedan) sedan();
    };
    u.onend = klar;
    u.onerror = klar;
    try { TTS.speak(u); } catch (e) { klar(); }
  }

  function svara(text) {
    sistaSvar = text;
    skrivLogg('ai', text);
    status(text.length > 120 ? kort(text, 120) : text);
    tala(text);
  }

  /* -------------------------------------------------------------------- örat */
  var rec = null, vill = false;      // `vill` = agenten SKA lyssna; `lyssnar` = den gör det just nu
  function startaLyssna() {
    if (!HAR_ORA || !oppen) return;
    // Viljan sätts först: sägs det här mitt i en mening tar munnen över, och
    // örat öppnas igen när meningen är slut. Utan den blev agenten döv efter
    // sin egen hälsning och man var tvungen att trycka på mikrofonen.
    vill = true;
    if (lyssnar || talar) return;
    try {
      rec = new SR();
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.onstart = function () {
        lyssnar = true; vill = true;
        micKnapp.textContent = '⏹ Listening';
        micKnapp.classList.add('pa');
        if (glob) glob.lage('lyssnar');
        status('I am listening…');
        lyssnaPaMikrofonen();
      };
      rec.onresult = function (e) {
        var slut = '', pagaende = '';
        for (var i = e.resultIndex; i < e.results.length; i++) {
          var r = e.results[i];
          if (r.isFinal) slut += r[0].transcript;
          else pagaende += r[0].transcript;
        }
        if (pagaende) status('… ' + kort(pagaende, 90));
        if (slut.trim()) {
          skrivLogg('du', slut.trim());
          hantera(slut.trim());
        }
      };
      rec.onerror = function (e) {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          vill = false;
          status('The microphone is blocked. Allow the microphone for this page and try again.');
          skrivLogg('ai', 'I am not allowed to use the microphone. Allow it in the address bar and I will hear you.');
        } else if (e.error === 'no-speech') {
          status('I did not hear anything — say something.');
        }
      };
      rec.onend = function () {
        lyssnar = false;
        micKnapp.textContent = '🎙️ Start';
        micKnapp.classList.remove('pa');
        if (glob) glob.lage(talar ? 'talar' : 'vilar');
        // continuous-läget slutar av sig självt efter en tystnad; vill vi fortfarande
        // lyssna startar vi om, så samtalet känns som ett samtal och inte som en knapp.
        if (vill && oppen && !talar) setTimeout(function () { if (vill && oppen && !talar) startaLyssna(); }, 350);
      };
      rec.start();
    } catch (e) {
      status('Could not start listening: ' + e.message);
    }
  }
  function stoppaLyssna(helt) {
    if (helt) vill = false;
    try { if (rec) rec.stop(); } catch (e) { /* redan stoppad */ }
    if (helt) slutaMikrofon();
  }

  /* Mikrofonens verkliga styrka driver globen medan du pratar. */
  var ac = null, analys = null, strom = null, buf = null;
  function lyssnaPaMikrofonen() {
    if (analys || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      strom = s;
      ac = new (window.AudioContext || window.webkitAudioContext)();
      var k = ac.createMediaStreamSource(s);
      analys = ac.createAnalyser();
      analys.fftSize = 512;
      buf = new Uint8Array(analys.fftSize);
      k.connect(analys);
    }).catch(function () { /* utan mikrofonström andas globen på egen hand */ });
  }
  function slutaMikrofon() {
    try { if (strom) strom.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* redan stängd */ }
    try { if (ac) ac.close(); } catch (e) { /* redan stängd */ }
    strom = null; ac = null; analys = null;
  }
  function mikroNiva() {
    if (!analys) return 0;
    analys.getByteTimeDomainData(buf);
    var sum = 0;
    for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
    return Math.min(1, Math.sqrt(sum / buf.length) * 4.5);
  }

  /* ------------------------------------------------------------------ globen */
  function nyGlob(canvas) {
    var ctx = canvas.getContext('2d');
    var N = 620, pts = [], i;
    var gyllene = Math.PI * (3 - Math.sqrt(5));
    for (i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * gyllene;
      pts.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r, f: 0.7 + Math.random() * 1.4, ph: Math.random() * 6.283 });
    }
    var LAGEN = {
      vilar:   { a: [96, 126, 180], b: [150, 190, 240] },
      lyssnar: { a: [64, 196, 190], b: [130, 235, 255] },
      talar:   { a: [232, 150, 60], b: [255, 205, 130] },
      skickar: { a: [150, 110, 225], b: [205, 175, 255] }
    };
    var lage = 'vilar', farg = LAGEN.vilar, malFarg = LAGEN.vilar, blend = 1;
    var kor = false, rafId = 0, t0 = (window.performance || Date).now();
    var amp = 0, talAmp = 0;

    function storlek() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var b = Math.min(400, Math.max(200, Math.min(window.innerWidth - 80, window.innerHeight * 0.38)));
      canvas.style.width = b + 'px'; canvas.style.height = b + 'px';
      canvas.width = Math.round(b * dpr); canvas.height = Math.round(b * dpr);
    }
    function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
    function rgba(c, al) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + al + ')'; }

    function rita(nu) {
      rafId = kor ? requestAnimationFrame(rita) : 0;
      if (!kor) return;
      var t = (nu - t0) / 1000;
      // Ljudet: mikrofonen när du pratar, ordpulsen när agenten talar, annars andning.
      var mal = talar ? talAmp : (lyssnar ? mikroNiva() : 0.06 + 0.05 * Math.sin(t * 1.4));
      amp += (mal - amp) * 0.22;
      talAmp *= 0.90;
      if (blend < 1) blend = Math.min(1, blend + 0.06);
      var c1 = mix(farg.a, malFarg.a, blend), c2 = mix(farg.b, malFarg.b, blend);

      var w = canvas.width, h = canvas.height;
      var cx = w / 2, cy = h / 2;
      var R = Math.min(w, h) * 0.30;
      ctx.clearRect(0, 0, w, h);

      // Glöden bakom klotet andas med rösten.
      var g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * (1.9 + amp * 0.7));
      g.addColorStop(0, rgba(c2, 0.30 + amp * 0.32));
      g.addColorStop(0.45, rgba(c1, 0.12 + amp * 0.14));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      var a = t * 0.34, ca = Math.cos(a), sa = Math.sin(a);
      var TILT = 0.42, cb = Math.cos(TILT), sb = Math.sin(TILT);
      ctx.globalCompositeOperation = 'lighter';
      for (var j = 0; j < pts.length; j++) {
        var p = pts[j];
        var x = p.x * ca - p.z * sa, z = p.x * sa + p.z * ca;
        var y = p.y * cb - z * sb; z = p.y * sb + z * cb;
        var puff = 1 + amp * (0.30 * Math.sin(t * p.f * 3.4 + p.ph) + 0.16);
        var persp = 1 / (1 - z * 0.34);
        var sx = cx + x * R * puff * persp, sy = cy + y * R * puff * persp;
        var djup = (z + 1) / 2;
        var s = (0.7 + 1.9 * djup) * (0.85 + amp * 0.9) * (Math.min(w, h) / 440);
        ctx.fillStyle = rgba(mix(c1, c2, djup), 0.10 + 0.72 * djup * djup);
        ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.4, s), 0, 6.2832); ctx.fill();
      }
      // Två ringar ger klotet en riktning så att rotationen syns.
      for (var k = 0; k < 2; k++) {
        ctx.strokeStyle = rgba(c2, 0.16 + amp * 0.22);
        ctx.lineWidth = Math.max(1, Math.min(w, h) / 420);
        var rr = R * (1 + amp * 0.18) * (k ? 0.72 : 1);
        var ry = rr * Math.abs(Math.sin(a + k * 1.1)) * 0.55 + rr * 0.06;
        ctx.beginPath();
        if (ctx.ellipse) ctx.ellipse(cx, cy, rr, ry, 0, 0, 6.2832);
        else ctx.arc(cx, cy, rr, 0, 6.2832);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    window.addEventListener('resize', function () { if (kor) storlek(); });
    return {
      start: function () { if (kor) return; kor = true; storlek(); t0 = (window.performance || Date).now(); rafId = requestAnimationFrame(rita); },
      stop: function () { kor = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; },
      lage: function (l) { if (!LAGEN[l] || l === lage) return; farg = { a: farg.a.slice(), b: farg.b.slice() }; malFarg = LAGEN[l]; blend = 0; lage = l; },
      puls: function () { talAmp = Math.min(1, 0.45 + Math.random() * 0.45); }
    };
  }

  /* ------------------------------------------------------------ kommandotolk */
  var TAL = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    en: 1, ett: 1, 'två': 2, tva: 2, tre: 3, fyra: 4, fem: 5, sex: 6, sju: 7, 'åtta': 8, atta: 8, nio: 9, tio: 10 };
  function siffra(ord) {
    ord = String(ord || '').toLowerCase();
    if (/^\d+$/.test(ord)) return parseInt(ord, 10);
    return TAL[ord] === undefined ? null : TAL[ord];
  }
  var norm = function (s) {
    return String(s || '').toLowerCase().replace(/[.,!?;:]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  function hjalpText() {
    return 'You can ask: what is the status, what is in progress, what is queued, are there any blockers, what is paused, '
      + 'what was finished today, how are the watchdogs, read task 311, what suggestions are there. '
      + 'You can request: add task, and then what you want done — it lands on the list as if you had written it in Telegram. '
      + 'You can coordinate: push suggestion one, set gadget drop to free, open paused, dark theme. Say close when you are done.';
  }

  function lageText() {
    var p = pagar(), o = oppna(), f = hinder(), pa = pausade(), k = klaraIdag();
    var d = [];
    d.push(p.length ? antal(p.length, 'task is in progress', 'tasks are in progress') : 'nothing is in progress right now');
    d.push(antal(o.length, 'is queued', 'are queued'));
    if (f.length) d.push(antal(f.length, 'is stuck on a blocker', 'are stuck on blockers'));
    if (pa.length) d.push(pa.length === 1 ? 'one is paused' : pa.length + ' are paused');
    d.push(k.length ? antal(k.length, 'was finished today', 'were finished today') : 'nothing has been finished today');
    var s = 'Status: ' + d.join(', ') + '.';
    if (p.length) s += ' Right now: ' + sagUppdrag(p[0]) + (p.length > 1 ? ' And ' + (p.length - 1) + ' more.' : '');
    return s;
  }

  function listaText(lista, tomt, rubrik) {
    if (!lista.length) return tomt;
    var s = rubrik + ' ' + antal(lista.length, 'task', 'tasks') + '. ';
    s += lista.slice(0, 3).map(sagUppdrag).join('. ');
    if (lista.length > 3) s += '. And ' + (lista.length - 3) + ' more on the page.';
    return s;
  }

  function hundText() {
    var h = (D().vakthundar || []);
    if (!h.length) return 'I do not see any watchdogs in the view right now.';
    var lever = h.filter(function (x) { return x.lever; });
    var jobbar = h.filter(function (x) { return x.arbetar; });
    var s = antal(lever.length, 'watchdog answers', 'watchdogs answer') + ' out of ' + h.length + ', '
      + antal(jobbar.length, 'is working', 'are working') + ' right now.';
    var doda = h.filter(function (x) { return !x.lever; }).map(function (x) { return x.n; });
    if (doda.length) s += ' Silent: ' + doda.join(', ') + '.';
    if (jobbar.length && jobbar[0].uppdrag) s += ' Watchdog ' + jobbar[0].n + ' is working on ' + kort(jobbar[0].uppdrag.text, 90) + '.';
    return s;
  }

  function uppdragText(nr) {
    var it = items().filter(function (i) { return Number(i.id) === nr; })[0];
    if (!it) return 'I cannot find a task ' + nr + ' on the list.';
    var STATUS = { open: 'is queued', working: 'is in progress', done: 'is done', failed: 'is stuck on a blocker', paused: 'is paused half-finished' };
    var s = 'Task ' + nr + ' ' + (STATUS[it.status] || it.status) + '. ' + kort(String(it.text).split('\n')[0], 180);
    if (it.handledBy) s += ' The hand is ' + it.handledBy + '.';
    var steg = it.steg || [];
    if (steg.length) s += ' Last: ' + kort(steg[steg.length - 1].text, 140);
    if (it.result) s += ' Result: ' + kort(it.result, 160);
    return s;
  }

  // rek-widget.js äger förslagen; agenten lånar dem (och dess Ja-knapp) i stället
  // för att hålla en egen kopia som kan gå isär med sidan.
  function obesvaradeForslag() {
    var w = window.WL_REK;
    if (w && typeof w.obesvarade === 'function') { try { return w.obesvarade(); } catch (e) { return []; } }
    return [];
  }
  function forslagText() {
    var r = obesvaradeForslag();
    if (!r.length) return 'There are no unanswered suggestions right now.';
    var s = antal(r.length, 'unanswered suggestion', 'unanswered suggestions') + '. ';
    s += r.slice(0, 3).map(function (x, i) { return (i + 1) + ': ' + kort(x.titel || x.text, 110) + ', rated ' + (x.grad || 3) + ' out of 5'; }).join('. ');
    s += '. Say push suggestion one if you want it to become a task right away.';
    return s;
  }

  /* Projektnamnen sidan känner till — används av tillståndsnivåerna. */
  function projekt() {
    var set = {};
    items().forEach(function (i) { if (i.projekt) set[i.projekt] = 1; });
    (window.WL_TILLSTAND || []).forEach(function (n) { set[n] = 1; });
    return Object.keys(set);
  }
  function hittaProjekt(text) {
    var b = null, bl = 0;
    var t = norm(text).replace(/[-_]/g, ' ');
    projekt().forEach(function (n) {
      var nn = norm(n).replace(/[-_]/g, ' ');
      if (nn && t.indexOf(nn) >= 0 && nn.length > bl) { b = n; bl = nn.length; }
    });
    return b;
  }

  /* --------------------------------------------------- att BEGÄRA något */
  function begar(text, vad) {
    vantarPa = { text: text, vad: vad || 'uppdrag' };
    svara('I heard: ' + text + '. Shall I put that on the list as a task? Say yes or no.');
  }

  function skicka(rad) {
    if (glob) glob.lage('skickar');
    status('Sending to the list…');
    fetch('/api/rost', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: rad.text, vad: rad.vad })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) { svara('That did not work: ' + ((res.j && res.j.error) || 'the list did not answer') + '.'); return; }
        svara('Sent. It becomes a task on the list within a minute, and the watchdogs take it first in the queue.');
        if (res.j && res.j.id) bevaka(res.j.id);
      })
      .catch(function (e) { svara('I could not reach the list: ' + e.message + '. Write it in Telegram instead.'); });
  }

  /* När datorn gjort ett uppdrag av meningen säger agenten numret — då vet man
   * att det verkligen landade, precis som Telegram-kvittot. */
  function bevaka(id) {
    if (bevakade.indexOf(id) >= 0) return;
    bevakade.push(id);
    var forsok = 0;
    var kolla = function () {
      if (++forsok > 30 || !oppen) return;
      fetch('/api/rost?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); })
        .then(function (j) {
          var rad = (j.rader || []).filter(function (x) { return x.id === id; })[0];
          if (rad && rad.uppdragId) { svara('It became task ' + rad.uppdragId + ' on the list.'); return; }
          setTimeout(kolla, 5000);
        }).catch(function () { setTimeout(kolla, 8000); });
    };
    setTimeout(kolla, 6000);
  }

  function pushaForslag(nr) {
    var vald = obesvaradeForslag()[(nr || 1) - 1];
    if (!vald) { svara('I cannot find a suggestion like that.'); return; }
    if (!window.WL_REK || typeof window.WL_REK.satt !== 'function') { svara('The suggestions have not loaded yet — try again in a moment.'); return; }
    try {
      // Samma väg som knappen på sidan: widgeten ritar om sig och skickar till /api/rek.
      Promise.resolve(window.WL_REK.satt(vald.id, 'pusha')).catch(function () { /* widgeten skriver felet på kortet */ });
      svara('Pushed: ' + kort(vald.titel || vald.text, 110) + '. It becomes a task at the front of the queue within a minute.');
    } catch (e) { svara('The suggestion could not be pushed: ' + e.message); }
  }

  function sattTillstand(namn, niva) {
    fetch('/api/tillstand', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: namn, niva: niva }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) { svara('That did not work: ' + (res.j.error || 'unknown error')); return; }
        svara(namn + ' is now set to ' + (niva === 'stopp' ? 'stop — nothing without your yes' : niva === 'fraga' ? 'ask — big changes ask first' : 'free') + '.');
      })
      .catch(function (e) { svara('I could not reach the permission level: ' + e.message); });
  }

  /* ------------------------------------------------------------- reglerna */
  function hantera(ra) {
    var t = norm(ra);
    if (!t) return;

    // 1. Väntar vi på ett ja eller nej går allt annat åt sidan.
    if (vantarPa) {
      if (/\b(yes|yep|yeah|do it|send it|go ahead|sure|absolutely|okay|correct|ja|japp|kör|kor|skicka|gör det|gor det|absolut|okej|ok|precis|stämmer|stammer)\b/.test(t)) {
        var r = vantarPa; vantarPa = null; skicka(r); return;
      }
      if (/\b(no|nope|cancel|forget it|never mind|drop it|nej|näe|nae|avbryt|strunt|glöm|glom)\b/.test(t)) {
        vantarPa = null; svara('All right, I am not sending anything.'); return;
      }
      vantarPa = null;   // något helt annat sades — låt det bli den nya frågan
    }

    // 2. Stänga / tysta / upprepa
    if (/\b(close|goodbye|bye|that is all|thanks for now|stäng|stang|hej då|hej da|tack för nu|tack for nu|avsluta)\b/.test(t)) { svara('Talk soon. Goodbye.'); setTimeout(stang, 1800); return; }
    if (/\b(be quiet|stop talking|quiet|mute|var tyst|sluta prata|håll tyst|hall tyst)\b/.test(t)) { if (TTS) TTS.cancel(); status('Quiet.'); return; }
    if (/\b(repeat|say that again|what did you say|once more|upprepa|vad sa du|en gång till|en gang till)\b/.test(t)) { svara(sistaSvar || 'I have not said anything yet.'); return; }
    if (/\b(help|what can you do|what can i say|hjälp|hjalp|vad kan du|vad kan jag säga|vad kan jag saga)\b/.test(t)) { svara(hjalpText()); return; }

    // 3. Frågor om listan — besvaras ur vyn sidan redan har, utan nätverk
    if (/\b(status|the status|summary|summarise|summarize|how is it going|where are we|what is happening|how many tasks|läget|laget|sammanfatta|hur går det|hur gar det|hur ligger vi|vad händer|vad hander|hur många uppdrag|hur manga uppdrag)\b/.test(t)) { svara(lageText()); return; }
    if (/\b(in progress|working on|what are you doing|running now|pågår|pagar|jobbar (ni|du|de)|vad gör ni|vad gor ni|arbetas)\b/.test(t)) { svara(listaText(pagar(), 'Nothing is in progress right now.', 'In progress:')); return; }
    if (/\b(queue|queued|in the queue|waiting|left to do|kön|kon|i kö|i ko|köat|koat|väntar|vantar|kvar att göra|kvar att gora)\b/.test(t)) { svara(listaText(oppna(), 'The queue is empty.', 'Queued:')); return; }
    if (/\b(blocker|blockers|blocked|stuck|failed|problem|hinder|fastnat|misslyck)\b/.test(t)) { svara(listaText(hinder(), 'No blockers — nothing is stuck.', 'Blocked:')); return; }
    if (/\b(paused|half finished|half-finished|pausat|pausade|halvfärdig|halvfardig)\b/.test(t)) { svara(listaText(pausade(), 'Nothing is paused.', 'Paused:')); return; }
    if (/\b(done|finished|completed|done today|klart|klara|blev färdigt|blev fardigt|gjort idag|avklarat)\b/.test(t)) { svara(listaText(klaraIdag(), 'Nothing has been finished today yet.', 'Done today:')); return; }
    if (/watchdog|the dogs|vakthund|hundarna/.test(t)) { svara(hundText()); return; }
    if (/\b(suggestion|suggestions|recommendation|förslag|forslag|rekommendation)/.test(t) && !/\b(push|approve|pusha|godkänn|godkann)\b/.test(t)) { svara(forslagText()); return; }

    var m = t.match(/\b(?:task|uppdrag(?:et)?)\s+(?:number\s+|nummer\s+)?(\d+)\b/);
    if (m && !/\b(add|new|create|lägg till|lagg till|nytt|nya|skapa)\b/.test(t)) { svara(uppdragText(parseInt(m[1], 10))); return; }

    // 4. Koordinera
    var pf = t.match(/\b(?:push|approve|pusha|godkänn|godkann)\s+(?:suggestion|recommendation|förslag|forslag|rekommendation)(?:et)?\s*(\d+|one|two|three|en|ett|två|tva|tre)?\b/);
    if (pf) { pushaForslag(siffra(pf[1] || 'one') || 1); return; }

    var ts = t.match(/\b(?:set|put|sätt|satt|ställ|stall)\s+(.+?)\s+(?:to|on|på|pa|till)\s+(stop|ask|free|stopp|fråga|fraga|fri|fritt)\b/);
    if (ts) {
      var namn = hittaProjekt(ts[1]);
      if (!namn) { svara('I do not recognise the project ' + ts[1] + '. Say the name as it appears on the page.'); return; }
      sattTillstand(namn, /stop/.test(ts[2]) ? 'stopp' : /(ask|fr[åa]ga)/.test(ts[2]) ? 'fraga' : 'fri');
      return;
    }

    if (/\b(open|show|go to|öppna|oppna|visa|gå till|ga till)\b/.test(t)) {
      if (/\b(paused|pausade|pausat)\b/.test(t)) { svara('Opening paused.'); setTimeout(function () { location.href = '/paused'; }, 900); return; }
      if (/\b(routine|rutin)/.test(t)) { svara('Opening the routines.'); setTimeout(function () { location.href = '/projects-routines'; }, 900); return; }
      if (/\bvercel\b/.test(t)) { svara('Opening the Vercel page.'); setTimeout(function () { location.href = '/projects-vercel'; }, 900); return; }
      if (/\bgithub\b/.test(t)) { svara('Opening the GitHub page.'); setTimeout(function () { location.href = '/projects-github'; }, 900); return; }
      if (/\b(project|projekt)/.test(t)) { svara('Opening projects.'); setTimeout(function () { location.href = '/projects'; }, 900); return; }
      if (/\b(the list|listan|work list|startsidan|home)\b/.test(t)) { svara('Opening the list.'); setTimeout(function () { location.href = '/'; }, 900); return; }
    }
    if (/\b(dark|mörkt|morkt)\s+(theme|mode|tema|läge|lage)\b/.test(t)) { document.documentElement.setAttribute('data-theme', 'dark'); try { localStorage.setItem('wl-tema', 'dark'); } catch (e) { /* privat läge */ } svara('Dark theme.'); return; }
    if (/\b(light|white|ljust|vitt)\s+(theme|mode|tema|läge|lage)\b/.test(t)) { document.documentElement.setAttribute('data-theme', 'white'); try { localStorage.setItem('wl-tema', 'white'); } catch (e) { /* privat läge */ } svara('Light theme.'); return; }

    // 5. Begäran: uttalade beställningar går rakt in
    var bm = t.match(/\b(?:add|create|new|lägg till|lagg till|skapa|nytt|ny)\s+(?:a\s+|ett\s+)?(?:task|uppdrag)\b[:,]?\s*(.+)$/);
    if (bm) {
      var txt = ra.slice(ra.length - bm[1].length).trim();
      if (txt.length < 3) { svara('What should the task be about? Say the whole sentence.'); return; }
      begar(txt); return;
    }
    var b = ra.replace(/^\s*(hey|hi|hello|hej|hörru|horru|du)\s+/i, '').trim();
    if (/^(can you|could you|please|make|build|fix|do|sort out|send|update|remove|delete|check|look into|start|add|kan du|skulle du kunna|be dem|be handen|fixa|bygg|gör|gor|ordna|skicka|uppdatera|ta bort|kolla|undersök|undersok|starta|lägg|lagg)\b/.test(t) && t.split(' ').length >= 3) {
      begar(b); return;
    }

    // 6. Inget matchade: en hel mening tolkas som en begäran (ett "ja" skickar den),
    //    ett löst ord får hjälpraden i stället.
    if (t.split(' ').length >= 4) { begar(b); return; }
    svara('I did not understand that. Ask about the status, the queue, blockers or a task number — or say add task, and what you want done.');
  }

  /* --------------------------------------------------------------- knappen */
  function koppla() {
    var k = document.getElementById('rost-knapp');
    if (!k) return;
    k.addEventListener('click', function () { if (oppen) { stang(); } else { visa(); } });
    if (!HAR_ORA) k.title = 'The voice agent can only hear you in Chrome or Edge. It can still read the status aloud.';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', koppla);
  else koppla();

})();
