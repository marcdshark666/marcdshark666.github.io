/* Rekommendationer på sajten — inte i Telegram.
 *
 * Marc 2026-09-07: förslagen ska skrivas på listan, med gradering, nedanför
 * sidorna där de hör hemma, och gå att besluta med ett tryck.
 * Marc 2026-09-16: knapparna heter Ja / Nej / Senare, det finns en
 * uppläsningsknapp, och en "Pusha nu" som gör förslaget till ett uppdrag
 * FÖRST i kön — per förslag, per projekt/rutin, och för allt på en gång.
 * Marc 2026-09-16 (#317): varje förslag har dessutom en papperskorg — "Jag vill
 * också ha ta bort denna uppdatering eller rekommendation fixa så att det finns".
 * Nej lägger förslaget bort men låter kvittot stå kvar på sidan; Ta bort plockar
 * bort hela kortet. Raden får `raderad: true` hos servern, som en gravsten, så att
 * kontrollerna inte skriver tillbaka samma förslag vid nästa skanning.
 * Marc 2026-09-16 (#285): "man ska indirekt också kunna skriva meddelanden på
 * feedback delen eller ja eller nej" — därför har varje förslag också en
 * skrivruta. Meddelandet sparas på förslaget (api/rek), följer med in i
 * uppdragstexten när förslaget blir ett uppdrag, och skrivs som ett steg på
 * uppdraget om det redan finns — så handen som jobbar ser svaret.
 *
 * Samma fil används av alla flikar:
 *   - Project Management-korten (projects, projects-vercel, projects-github,
 *     projects-routines): förslagen för just det projektet eller den rutinen
 *     hamnar längst ned i kortet (data-name = projekt-mapp eller rutin.<slug>).
 *   - Work List-startsidan: alla förslag i #rek-lista, projektet utskrivet.
 *
 * Besluten sparas server-side (api/rek → privat GitHub-repo). En väntekö i
 * localStorage gör att ett tryck aldrig tappas om nätet blippar — precis som
 * prioritetsknapparna. Ja plockas upp av datorn vid nästa bevakning (worklist.js
 * poll, var tionde minut); Pusha nu plockas upp av livebevakaren inom en minut.
 */
(function () {
  var PKEY = 'wl_rek_pending';
  var BESLUT = [
    { k: 'pusha', t: '🚀 Push now', c: 'push', titel: 'Becomes a task within a minute and goes before everything else in the queue' },
    { k: 'implementera', t: '✅ Yes', c: 'ja', titel: 'Becomes a task on the list at the next watch (within 10 min)' },
    { k: 'senare', t: '🕒 Later', c: 'sen', titel: 'Stays, sorted aside' },
    { k: 'bort', t: '🚫 No', c: 'nej', titel: "Dismissed and won't come back" },
  ];

  var css = '.reks{margin-top:10px;border-top:1px dashed var(--rule,#ddd);padding-top:8px}'
    + '.reks .rekhead{font-family:var(--display,inherit);font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--ink-3,#888);margin:0 0 6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}'
    + '.reks .rekhead .sm{margin-left:auto;display:inline-flex;gap:4px}'
    + '.reks .rekhead .sm button,.rek .las{font-family:var(--body,inherit);font-size:12px;font-weight:600;border:1px solid var(--rule,#ddd);background:var(--sunk,#eee);color:var(--ink,#222);border-radius:9px;padding:3px 8px;cursor:pointer;letter-spacing:0;text-transform:none}'
    + '.rek{border:1px solid var(--rule,#ddd);border-radius:12px;padding:9px 11px;margin:0 0 8px;background:var(--panel,#fff)}'
    + '.rek.klar{opacity:.62}.rek.bort{opacity:.45}.rek.pushad{border-color:var(--accent,#1f4e8c);box-shadow:0 0 0 2px var(--accent-soft,#dfe8f5)}'
    + '.rek .rt{font-family:var(--display,inherit);font-weight:700;font-size:15px;line-height:1.25;display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}'
    + '.rek .rt .las{margin-left:auto;align-self:center}.rek .las.on{background:var(--accent-soft,#dfe8f5);color:var(--accent,#1f4e8c);border-color:var(--accent,#1f4e8c)}'
    + '.rek .grad{font-family:var(--mono,monospace);font-size:12px;color:var(--work,#a8680f);letter-spacing:1px;white-space:nowrap}'
    + '.rek .rp{font-size:13.5px;color:var(--ink-2,#555);margin:4px 0 0}'
    // Klarsprak (#333): egen ruta sa ogat ser att det INTE ar mer kodtext.
    + '.rek .foljd{display:flex;flex-direction:column;gap:2px;margin:7px 0 0;padding:7px 10px;border-left:3px solid var(--done,#2e7d32);border-radius:0 4px 4px 0;background:var(--done-soft,rgba(46,125,50,.08))}'
    + '.rek .foljd b{font-family:var(--display,inherit);font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--done,#2e7d32)}'
    + '.rek .foljd span{font-size:13.5px;line-height:1.45;color:var(--ink,#222)}'
    + '.rek .meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}'
    + '.rek .meta span{font-family:var(--mono,monospace);font-size:11px;padding:2px 8px;border-radius:99px;background:var(--sunk,#eee);color:var(--ink-2,#555)}'
    + '.rek .knappar{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}'
    + '.rek .knappar button,.rek-bar button{font-family:var(--body,inherit);font-size:13px;font-weight:600;border:1px solid var(--rule,#ddd);background:var(--sunk,#eee);color:var(--ink,#222);border-radius:9px;padding:6px 11px;cursor:pointer}'
    + '.rek .knappar button:hover,.rek-bar button:hover{filter:brightness(1.06)}'
    + '.rek .knappar button.on.ja{background:var(--done-soft,#d6ecdf);color:var(--done,#24734a);border-color:var(--done,#24734a)}'
    + '.rek .knappar button.on.sen{background:var(--work-soft,#f6e6c8);color:var(--work,#a8680f);border-color:var(--work,#a8680f)}'
    + '.rek .knappar button.on.nej{background:var(--fail-soft,#f5dbd7);color:var(--fail,#ad392f);border-color:var(--fail,#ad392f)}'
    + '.rek .knappar button.on.push,.rek-bar button.push{background:var(--accent,#1f4e8c);color:#fff;border-color:var(--accent,#1f4e8c)}'
    + '.rek .knappar button.err,.rek-bar button.err{outline:2px solid var(--fail,#ad392f)}'
    + '.rek .knappar button.tabort{margin-left:auto}'
    + '.rek .knappar button.tabort.armerad{background:var(--fail,#ad392f);color:#fff;border-color:var(--fail,#ad392f)}'
    + '.rek .status{font-size:12px;color:var(--ink-3,#888);margin-top:5px}'
    // Meddelanderutan: Marcs egna ord på förslaget, utan omvägen via Telegram.
    + '.rek .msgs{display:flex;flex-direction:column;gap:4px;margin-top:7px}'
    + '.rek .msg{font-size:13px;background:var(--sunk,#eee);border-radius:10px;padding:5px 9px;color:var(--ink,#222)}'
    + '.rek .msg .n{font-family:var(--mono,monospace);font-size:11px;color:var(--ink-3,#888);margin-right:6px}'
    + '.rek .msg.vantar{opacity:.6}'
    + '.rek .skriv{display:flex;gap:6px;margin-top:7px;align-items:flex-start}'
    + '.rek .skriv textarea{flex:1;min-width:0;font-family:var(--body,inherit);font-size:13px;line-height:1.35;border:1px solid var(--rule,#ddd);border-radius:10px;padding:6px 9px;background:var(--panel,#fff);color:var(--ink,#222);resize:vertical;min-height:36px}'
    + '.rek .skriv button{font-family:var(--body,inherit);font-size:13px;font-weight:600;border:1px solid var(--rule,#ddd);background:var(--sunk,#eee);color:var(--ink,#222);border-radius:9px;padding:6px 11px;cursor:pointer;white-space:nowrap}'
    + '.rek .skriv button.err{outline:2px solid var(--fail,#ad392f)}'
    + '.rek .prj{font-family:var(--mono,monospace);font-size:11px;color:var(--ink-3,#888)}'
    + '.reks .tom,#rek-lista .tom{font-size:13px;color:var(--ink-3,#888);margin:0}'
    // Handläggningsraden: allt på en gång — läs upp, pusha nu, ja, senare, nej.
    + '.rek-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;background:var(--panel,#fff);border:1px solid var(--rule,#ddd);border-radius:14px;padding:10px 12px;margin:0 0 14px;box-shadow:var(--shadow,none)}'
    + '.rek-bar b{font-family:var(--display,inherit);font-size:13px;margin-right:4px}'
    + '.rek-bar .sum{font-size:13px;color:var(--ink-2,#555);margin-right:auto}'
    + '.rek-bar button.on{background:var(--accent-soft,#dfe8f5);color:var(--accent,#1f4e8c);border-color:var(--accent,#1f4e8c)}'
    + '@media(max-width:600px){.rek-bar .sum{width:100%;margin:0 0 4px}}';

  var MKEY = 'wl_rek_msg';
  var BKEY = 'wl_rek_bort';   // papperskorgen (#317): id som ska bort, tills servern kvitterat
  var pending = {}, rek = [], koade = [], bortKo = {}, armerad = {};
  try { pending = JSON.parse(localStorage.getItem(PKEY) || '{}'); } catch (e) { pending = {}; }
  try { koade = JSON.parse(localStorage.getItem(MKEY) || '[]'); } catch (e) { koade = []; }
  if (!Array.isArray(koade)) koade = [];
  try { bortKo = JSON.parse(localStorage.getItem(BKEY) || '{}') || {}; } catch (e) { bortKo = {}; }
  function spara() { try { localStorage.setItem(PKEY, JSON.stringify(pending)); } catch (e) { /* privat läge */ } }
  function sparaMsg() { try { localStorage.setItem(MKEY, JSON.stringify(koade)); } catch (e) { /* privat läge */ } }
  function sparaBort() { try { localStorage.setItem(BKEY, JSON.stringify(bortKo)); } catch (e) { /* privat läge */ } }
  /* Det som Marc tagit bort ska aldrig ritas: varken det servern märkt som raderat
   * eller det som ligger i papperskorgskön och ännu inte kommit fram. */
  function rensa(lista) {
    return (Array.isArray(lista) ? lista : []).filter(function (r) { return !r.raderad && !bortKo[r.id]; });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // Vad Marc har svarat: väntekön går före servern; ett pushat Ja visas som "pusha".
  function beslutAv(r) {
    if (Object.prototype.hasOwnProperty.call(pending, r.id)) return pending[r.id];
    if (!r.beslut) return null;
    return r.beslut === 'implementera' && r.pusha ? 'pusha' : r.beslut;
  }
  function oppen(r) { return !beslutAv(r); }
  // Släppt i dag av dagsransonen — det som är nytt sedan i går, räknat i svensk tid.
  function idag(r) {
    if (!r.skapad) return false;
    try { return new Date(r.skapad).toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' }) === new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' }); } catch (e) { return false; }
  }
  function grader(n) { n = Math.max(1, Math.min(5, Number(n) || 3)); return '●'.repeat(n) + '○'.repeat(5 - n); }
  function datum(iso) { if (!iso) return ''; try { return new Date(iso).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' }).slice(0, 16); } catch (e) { return ''; } }
  function var_(r) { return r.rutin ? '⏰ ' + r.rutin : (r.projekt || ''); }

  // ---------------------------------------------------------------- uppläsning
  // Web Speech API — finns i Chrome/Safari/Edge på mobil och dator. Svensk röst om
  // det finns någon, annars den röst webbläsaren har. Tryck igen = tyst.
  var talar = null;
  function svenskRost() {
    try {
      var v = window.speechSynthesis.getVoices() || [];
      return v.filter(function (x) { return /^sv/i.test(x.lang); })[0] || null;
    } catch (e) { return null; }
  }
  function tyst() {
    try { window.speechSynthesis.cancel(); } catch (e) { /* ingen talsyntes */ }
    if (talar && talar.knapp) talar.knapp.classList.remove('on');
    talar = null;
  }
  function las(text, knapp, nyckel) {
    if (!('speechSynthesis' in window)) { alert('The browser lacks speech synthesis.'); return; }
    if (talar && talar.nyckel === nyckel) { tyst(); return; }
    tyst();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 1.0;
    var r = svenskRost(); if (r) u.voice = r;
    u.onend = u.onerror = function () { if (talar && talar.nyckel === nyckel) { if (talar.knapp) talar.knapp.classList.remove('on'); talar = null; } };   // talar.knapp, inte knapp: kortet kan ha ritats om under tiden
    talar = { nyckel: nyckel, knapp: knapp };
    if (knapp) knapp.classList.add('on');
    window.speechSynthesis.speak(u);
  }
  function textFor(r) {
    var b = beslutAv(r);
    return (r.rutin ? 'Routine ' + r.rutin + '. ' : r.projekt ? 'Project ' + r.projekt + '. ' : '')
      + 'Rating ' + (r.grad || 3) + ' of 5. '
      + (r.titel || '') + (r.titel && r.text ? '. ' : '') + (r.text || '')
      + (r.foljd ? ' What this leads to: ' + r.foljd : '')
      + (b ? '. Decision: ' + ({ pusha: 'pushed', implementera: 'yes', senare: 'later', bort: 'no' }[b] || b) + '.' : '. Unanswered.')
      + ((r.meddelanden && r.meddelanden.length) ? ' Your messages: ' + r.meddelanden.map(function (m) { return m.text; }).join('. ') + '.' : '');
  }
  function lasAlla(lista, knapp) {
    if (!lista.length) { las('No unanswered recommendations.', knapp, 'alla'); return; }
    var text = lista.length + ' recommendations. ' + lista.map(function (r, i) { return 'Number ' + (i + 1) + '. ' + textFor(r); }).join(' ');
    las(text, knapp, 'alla');
  }

  // ---------------------------------------------------------------- kortet
  function kort(r, visaProjekt) {
    var b = beslutAv(r);
    var meta = [];
    if (r.nytta) meta.push('value: ' + r.nytta);
    if (r.insats) meta.push('effort: ' + r.insats);
    if (r.kalla) meta.push(r.kalla);
    if (r.skapad) meta.push(datum(r.skapad));
    var status = '';
    if (b === 'pusha') status = r.uppdragId ? ('Pushed — task #' + r.uppdragId + ' is first in the queue.') : 'Pushed — becomes a task within a minute and goes before everything else.';
    else if (b === 'implementera') status = r.uppdragId ? ('Yes — became task #' + r.uppdragId + ' on the list.') : 'Yes — becomes a task at the next watch (within 10 min).';
    else if (b === 'senare') status = 'Later — stays until you press Yes or Push now.';
    else if (b === 'bort') status = 'No — dismissed. Press the same button again to undo.';
    return '<div class="rek ' + (b === 'bort' ? 'bort' : b === 'pusha' ? 'pushad' : (b ? 'klar' : '')) + '" data-rek="' + esc(r.id) + '">'
      + '<div class="rt"><span class="grad" title="rating ' + (r.grad || 3) + ' of 5">' + grader(r.grad) + '</span>'
      + '<span>' + esc(r.titel || r.text || 'Suggestion') + '</span>'
      + (visaProjekt && var_(r) ? '<span class="prj">' + esc(var_(r)) + '</span>' : '')
      + '<button type="button" class="las" data-las="' + esc(r.id) + '" title="Read aloud" aria-label="Read aloud">🔊</button></div>'
      + (r.text && r.titel ? '<p class="rp">' + esc(r.text) + '</p>' : '')
      // Vad det leder till (#333): förslagets text är kodspråk. Raden under
      // säger följden i klarspråk, så den som inte kodar kan fatta beslutet på
      // kortet utan att först översätta det.
      + (r.foljd ? '<div class="foljd"><b>What this leads to</b><span>' + esc(r.foljd) + '</span></div>' : '')
      + (meta.length ? '<div class="meta">' + meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>' : '')
      + '<div class="knappar">' + BESLUT.map(function (x) {
        return '<button type="button" data-beslut="' + x.k + '" class="' + x.c + (b === x.k ? ' on' : '') + '" title="' + esc(x.titel) + '">' + x.t + '</button>';
      }).join('')
      // Papperskorgen (#317): bort från sidan helt — inte ett beslut, utan ett städtryck.
      + '<button type="button" class="tabort' + (armerad[r.id] ? ' armerad' : '') + '" data-radera="' + esc(r.id) + '" title="The card disappears from the page and won\'t come back">'
      + (armerad[r.id] ? '🗑 Press again to remove' : '🗑 Remove') + '</button>'
      + '</div>'
      + (status ? '<div class="status">' + esc(status) + '</div>' : '')
      + meddelandeDel(r)
      + '</div>';
  }

  // Meddelandena på ett förslag: det som redan är sparat, det som ligger i kön,
  // och rutan där Marc skriver nästa. Ett meddelande går fram vare sig förslaget
  // är besvarat eller inte — svaret ska kunna komma efter Ja:et.
  function meddelandeDel(r) {
    var sparade = Array.isArray(r.meddelanden) ? r.meddelanden : [];
    var vantar = koade.filter(function (m) { return m.id === r.id; });
    var rader = sparade.map(function (m) {
      return '<div class="msg"><span class="n">' + esc(datum(m.at) || 'Marc') + '</span>' + esc(m.text) + '</div>';
    }).concat(vantar.map(function (m) {
      return '<div class="msg vantar"><span class="n">skickas…</span>' + esc(m.text) + '</div>';
    })).join('');
    return (rader ? '<div class="msgs">' + rader + '</div>' : '')
      + '<div class="skriv"><textarea rows="1" data-msg="' + esc(r.id) + '" placeholder="Write a message to the hand that picks this up…" aria-label="Message about the suggestion"></textarea>'
      + '<button type="button" data-skicka="' + esc(r.id) + '" title="Saved on the suggestion and carried into the task">💬 Send</button></div>';
  }

  // Obesvarade först, sedan högst gradering, sedan nyast.
  function sorten(a, b) {
    var ab = beslutAv(a) ? 1 : 0, bb = beslutAv(b) ? 1 : 0;
    return (ab - bb) || ((Number(b.grad) || 3) - (Number(a.grad) || 3)) || String(b.skapad || '').localeCompare(String(a.skapad || ''));
  }

  // Handläggningsraden: samma knappar som på kortet, men för ALLA obesvarade
  // (projekt och rutiner) — eller för ett enda projekt om `projekt` anges.
  function bar(lista, projekt) {
    var oppna = lista.filter(oppen).length;
    var rut = lista.filter(function (r) { return oppen(r) && r.rutin; }).length;
    var p = projekt ? ' data-projekt="' + esc(projekt) + '"' : '';
    return '<div class="rek-bar"' + p + '><b>Handling</b><span class="sum">'
      + (oppna ? oppna + ' unanswered' + (rut ? ' (of which ' + rut + ' routines)' : '') + ' of ' + lista.length : (lista.length ? 'All ' + lista.length + ' answered' : 'No recommendations'))
      + '</span>'
      + '<button type="button" data-alla="las" title="Read aloud all unanswered">🔊 Read aloud</button>'
      + '<button type="button" data-alla="pusha" class="push" title="All unanswered become tasks first in the queue, within a minute">🚀 Push now — all</button>'
      + '<button type="button" data-alla="implementera" title="Yes on all unanswered — task at the next watch">✅ Yes on all</button>'
      + '<button type="button" data-alla="senare" title="Later on all unanswered">🕒 Later on all</button>'
      + '<button type="button" data-alla="bort" title="No on all unanswered">🚫 No on all</button>'
      + '</div>';
  }

  // Sidan ritas om var sextionde sekund och vid varje knapptryck — en påbörjad
  // mening i skrivrutan får inte försvinna under fingrarna.
  function samlaUtkast() {
    var bo = { text: {}, aktiv: null };
    var f = document.activeElement;
    var t = document.querySelectorAll('textarea[data-msg]');
    for (var i = 0; i < t.length; i++) {
      if (t[i].value) bo.text[t[i].dataset.msg] = t[i].value;
      if (t[i] === f) bo.aktiv = { id: t[i].dataset.msg, start: t[i].selectionStart, end: t[i].selectionEnd };
    }
    return bo;
  }
  function aterstallUtkast(bo) {
    Object.keys(bo.text).forEach(function (id) {
      var t = document.querySelector('textarea[data-msg="' + id.replace(/"/g, '\\"') + '"]');
      if (t) t.value = bo.text[id];
    });
    if (bo.aktiv) {
      var a = document.querySelector('textarea[data-msg="' + bo.aktiv.id.replace(/"/g, '\\"') + '"]');
      if (a) { a.focus(); try { a.setSelectionRange(bo.aktiv.start, bo.aktiv.end); } catch (e) { /* äldre webbläsare */ } }
    }
  }

  function rita() {
    var utkast = samlaUtkast();
    // Project Management: förslagen hamnar längst ned i sitt eget projekt- eller rutinkort.
    var kortEls = document.querySelectorAll('.card[data-name]');
    for (var i = 0; i < kortEls.length; i++) {
      var c = kortEls[i], namn = c.dataset.name;
      var mina = rek.filter(function (r) { return r.projekt === namn; });
      var box = c.querySelector('.reks');
      if (!mina.length) { if (box) box.remove(); continue; }
      if (!box) {
        box = document.createElement('div');
        box.className = 'reks';
        (c.querySelector('.body') || c).appendChild(box);
      }
      var oppna = mina.filter(oppen).length;
      var farska = mina.filter(idag).length;   // dagsransonen (#294): guld/platina får fem om dagen, lägre nivåer en eller två
      box.innerHTML = '<div class="rekhead">Recommendations · ' + mina.length + (oppna ? ' · ' + oppna + ' unanswered' : '') + (farska ? ' · ' + farska + ' new today' : '')
        + '<span class="sm"><button type="button" data-las-projekt="' + esc(namn) + '" title="Read aloud the card\'s suggestions">🔊</button>'
        + (oppna ? '<button type="button" data-pusha-projekt="' + esc(namn) + '" title="Push now — all unanswered in this card">🚀 all here</button>' : '')
        + '</span></div>'
        + mina.sort(sorten).map(function (r) { return kort(r, false); }).join('');
    }
    // Handläggningsraden på projektsidorna: överst, ovanför första rutnätet.
    if (kortEls.length) {
      var host = document.getElementById('rek-bar-host');
      if (!host) {
        host = document.createElement('div'); host.id = 'rek-bar-host';
        var forsta = document.querySelector('.tiles') || document.querySelector('.grid') || document.querySelector('.lede');
        if (forsta && forsta.parentNode) forsta.parentNode.insertBefore(host, forsta); else document.body.insertBefore(host, document.body.firstChild);
      }
      host.innerHTML = bar(rek, null);
    }
    // Work List-startsidan: allihop, projektet utskrivet, raden överst.
    var lista = document.getElementById('rek-lista');
    if (lista) {
      var alla = rek.slice().sort(sorten);
      var kvar = alla.filter(function (r) { return beslutAv(r) !== 'bort'; });
      var n = document.getElementById('n-rek');
      if (n) n.textContent = String(alla.filter(oppen).length);
      lista.innerHTML = bar(rek, null) + (kvar.length
        ? kvar.map(function (r) { return kort(r, true); }).join('')
        : '<p class="tom">No recommendations right now. The workers and the Routine Guard write their suggestions here instead of in Telegram — with a rating and the buttons Push now / Yes / Later / No.</p>');
      var sekt = document.getElementById('rek-sektion');
      if (sekt) sekt.hidden = false;
    }
    aterstallUtkast(utkast);
    tystOmBorta();
    // Vakthundskorten ritar sina egna Ja/Nej-knappar men frågar hit efter
    // förslaget och beslutet — en enda sanning per förslag, oavsett var man trycker.
    try { window.dispatchEvent(new CustomEvent('wl-rek')); } catch (e) { /* gammal webbläsare */ }
  }
  // Ritas kortet om medan det läses upp tappar knappen sin markering — sätt tillbaka den.
  function tystOmBorta() {
    if (!talar) return;
    var k = talar.nyckel === 'alla' ? null : document.querySelector('.las[data-las="' + talar.nyckel + '"]');
    if (k) { k.classList.add('on'); talar.knapp = k; }
  }

  function skicka(id, beslut, knapp) {
    return fetch('/api/rek', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, beslut: beslut }) })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json().catch(function () { return null; }); })
      .then(function (j) {
        if (j && j.rek) rek = rensa(j.rek);
        delete pending[id]; spara(); rita();
        return true;
      })
      .catch(function () {
        if (knapp) { knapp.classList.add('err'); setTimeout(function () { knapp.classList.remove('err'); }, 1500); }
        return false;
      });
  }
  // Massbeslut: väntekön får varje obesvarat id (så sidan visar det direkt och
  // ett nätblipp inte tappar något), servern får EN begäran.
  function skickaAlla(beslut, projekt, knapp) {
    var traff = rek.filter(function (r) { return oppen(r) && (!projekt || r.projekt === projekt); });
    if (!traff.length) return Promise.resolve(true);
    traff.forEach(function (r) { pending[r.id] = beslut; });
    spara(); rita();
    return fetch('/api/rek', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alla: true, beslut: beslut, projekt: projekt || undefined }) })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json().catch(function () { return null; }); })
      .then(function (j) {
        if (j && j.rek) rek = rensa(j.rek);
        traff.forEach(function (r) { delete pending[r.id]; });
        spara(); rita();
        return true;
      })
      .catch(function () {
        if (knapp) { knapp.classList.add('err'); setTimeout(function () { knapp.classList.remove('err'); }, 1500); }
        return false;   // ligger kvar i väntekön och skickas ett i taget vid nästa tillfälle
      });
  }
  /* Papperskorgen. Kortet försvinner direkt (id:t ligger i bortKo) och POST:en går
   * i väg; kommer den inte fram ligger id:t kvar och skickas om vid nästa varv —
   * samma mönster som besluten och meddelandena. */
  function skickaRadera(id, knapp) {
    return fetch('/api/rek', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, radera: true }) })
      .then(function (r) { if (!r.ok && r.status !== 404) throw new Error('http ' + r.status); return r.json().catch(function () { return null; }); })
      .then(function (j) {
        if (j && j.rek) rek = rensa(j.rek);
        delete bortKo[id]; sparaBort(); rita();
        return true;
      })
      .catch(function () {
        if (knapp) { knapp.classList.add('err'); setTimeout(function () { knapp.classList.remove('err'); }, 1500); }
        return false;   // ligger kvar i papperskorgskön
      });
  }
  function tomBortKon() {
    var kedja = Promise.resolve();
    Object.keys(bortKo).forEach(function (id) {
      kedja = kedja.then(function () { return skickaRadera(id); });
    });
    return kedja;
  }
  function tomKon() {
    var kedja = Promise.resolve();
    Object.keys(pending).forEach(function (id) {
      kedja = kedja.then(function () { return skicka(id, pending[id] || 'oppen'); });
    });
    return kedja.then(tomMsgKon).then(tomBortKon);
  }
  // Meddelandena går samma väg som besluten: ligger kvar i localStorage tills
  // servern kvitterat, så ett nätblipp i soffan inte äter det Marc skrev.
  function skickaMsg(id, text, knapp) {
    return fetch('/api/rek', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, meddelande: text }) })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json().catch(function () { return null; }); })
      .then(function (j) {
        if (j && j.rek) rek = rensa(j.rek);
        koade = koade.filter(function (m) { return !(m.id === id && m.text === text); });
        sparaMsg(); rita();
        return true;
      })
      .catch(function () {
        if (knapp) { knapp.classList.add('err'); setTimeout(function () { knapp.classList.remove('err'); }, 1500); }
        rita();
        return false;
      });
  }
  function tomMsgKon() {
    var kedja = Promise.resolve();
    koade.slice().forEach(function (m) {
      kedja = kedja.then(function () { return skickaMsg(m.id, m.text); });
    });
    return kedja;
  }

  function hamta() {
    return fetch('/api/rek', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
      rek = rensa(j.rek);
      rita(); return tomKon();
    }).catch(function () { rita(); });
  }

  // Öppet för sidans egen kod (vakthundskorten): samma förslag, samma väntekö,
  // samma POST till /api/rek. Ett Ja här är ett Ja i Telegram och tvärtom.
  window.WL_REK = {
    hitta: function (id) { for (var i = 0; i < rek.length; i++) if (rek[i].id === id) return rek[i]; return null; },
    beslut: function (r) { return r ? beslutAv(r) : null; },
    satt: function (id, val) { pending[id] = val === 'oppen' ? null : val; spara(); rita(); return skicka(id, val); },
    // Röstagenten (#311) läser upp förslagen och pushar dem med rösten — den
    // behöver själva listan, och samma bild av vad som redan är besvarat.
    alla: function () { return rek.slice(); },
    obesvarade: function () { return rek.filter(oppen); },
    las: las, tyst: tyst,
  };

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var LABEL = { pusha: 'Push now', implementera: 'Yes', senare: 'Later', bort: 'No' };
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;
    var b;
    // uppläsning av ett förslag
    if ((b = t.closest('.las[data-las]'))) {
      var r = window.WL_REK.hitta(b.dataset.las);
      if (r) las(textFor(r), b, r.id);
      return;
    }
    // uppläsning av ett korts förslag
    if ((b = t.closest('button[data-las-projekt]'))) {
      lasAlla(rek.filter(function (r) { return r.projekt === b.dataset.lasProjekt; }).sort(sorten), b);
      return;
    }
    // pusha nu — alla i ett kort
    if ((b = t.closest('button[data-pusha-projekt]'))) {
      skickaAlla('pusha', b.dataset.pushaProjekt, b);
      return;
    }
    // handläggningsraden
    if ((b = t.closest('.rek-bar button[data-alla]'))) {
      var val = b.dataset.alla, projekt = b.closest('.rek-bar').dataset.projekt || null;
      var open = rek.filter(function (r) { return oppen(r) && (!projekt || r.projekt === projekt); });
      if (val === 'las') { lasAlla(open.sort(sorten), b); return; }
      if (!open.length) return;
      if ((val === 'pusha' || val === 'bort') && !confirm(LABEL[val] + ' on all ' + open.length + ' unanswered recommendations' + (val === 'pusha' ? ' — they become tasks first in the queue within a minute.' : ' — they get dismissed.')) ) return;
      skickaAlla(val, projekt, b);
      return;
    }
    // meddelande på ett förslag
    if ((b = t.closest('button[data-skicka]'))) {
      var ruta = document.querySelector('textarea[data-msg="' + b.dataset.skicka.replace(/"/g, '\\"') + '"]');
      var txt = ruta ? ruta.value.trim().slice(0, 800) : '';
      if (!txt) { if (ruta) ruta.focus(); return; }
      if (ruta) ruta.value = '';
      koade.push({ id: b.dataset.skicka, text: txt });
      sparaMsg(); rita();
      skickaMsg(b.dataset.skicka, txt, b);
      return;
    }
    // papperskorgen på ett förslag — två tryck, ingen systemruta (sidan ritar om
    // sig var sextionde sekund och en confirm() mitt i är lätt att råka trycka bort)
    if ((b = t.closest('button[data-radera]'))) {
      var rid = b.dataset.radera;
      if (!armerad[rid]) {
        armerad[rid] = 1; rita();
        setTimeout(function () { if (armerad[rid]) { delete armerad[rid]; rita(); } }, 5000);
        return;
      }
      delete armerad[rid];
      bortKo[rid] = 1; sparaBort();
      rek = rensa(rek); rita();
      skickaRadera(rid, b);
      return;
    }
    // ett förslag
    if ((b = t.closest('.rek .knappar button'))) {
      var kortEl = b.closest('.rek'), id = kortEl.dataset.rek;
      var v = b.classList.contains('on') ? 'oppen' : b.dataset.beslut;   // trycka på samma knapp igen = ångra
      pending[id] = v === 'oppen' ? null : v;
      spara(); rita();
      skicka(id, v, b);
    }
  });
  // Ctrl/⌘+Enter skickar — Enter ensamt får fortfarande göra radbryt.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !(e.ctrlKey || e.metaKey)) return;
    var ruta = e.target && e.target.matches && e.target.matches('textarea[data-msg]') ? e.target : null;
    if (!ruta) return;
    e.preventDefault();
    var knapp = document.querySelector('button[data-skicka="' + ruta.dataset.msg.replace(/"/g, '\\"') + '"]');
    if (knapp) knapp.click();
  });
  hamta();
  window.addEventListener('online', tomKon);
  setInterval(hamta, 60000);
  try { window.speechSynthesis.onvoiceschanged = function () { /* rösterna laddas i bakgrunden */ }; } catch (e) { /* ingen talsyntes */ }
})();
