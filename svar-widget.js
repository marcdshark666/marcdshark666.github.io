/* Svar under varje uppdrag — som en tråd i Telegram, fast på sajten.
 *
 * Marc 2026-09-16 (#310): "Under varje hinderbit på the work list sidan vill jag
 * att man ska kunna också göra som ett svar under ja och nej eller inte. […] man
 * ska kunna göra det direkt på hemsidan. Så under varje pausad, varje hinder,
 * varje allt på så vis ska man kunna ändra saker direkt genom hemsidan […] Även
 * om de är färdiga att klara ska det finnas ett svar tablå nedanför varje task
 * som man kan göra tillägg och referera till de olika sakerna."
 *
 * Rutan sitter under varje kort på startsidan och på /paus. Den visar svaren som
 * redan finns, och en Svara-knapp fäller ut skrivrutan. Hinder och pausade får
 * dessutom Ja / Nej, för det är där frågan "ska jag ta upp det här igen?" står.
 *
 * Vad svaret FAKTISKT gör står i klartext under rutan innan man trycker, och
 * datorn (worklist.js svarVarv) gör sedan just det vid nästa bevakning:
 *   · pågår / i kö  → svaret blir ett steg på uppdraget, handen ser det
 *   · pausad        → steg på pausen; Ja tar upp den igen, först i kön
 *   · hinder / klart → svaret blir ett NYTT uppdrag som hänvisar till det gamla,
 *                      för ingen hand läser ett avslutat uppdrag
 *   · Nej           → lagt åt sidan, ingen åtgärd
 *   · Ta bort       → kortet försvinner från listan (#317). Marc 2026-09-16: "Jag vill
 *                      gärna ha en ta bort knapp för de här sakerna som tillägg nedanför
 *                      inte bara ja eller nej." Knappen sitter under VARJE kort, inte bara
 *                      under hinder och pausade — det ska gå att städa bort vad som helst.
 *                      Uppdraget får status 'deleted' hos datorn: borta från sidan, osynligt
 *                      för händerna, men raden finns kvar i worklist.json om den behövs igen.
 *
 * Svaren sparas server-side (api/svar → privat GitHub-repo). En väntekö i
 * localStorage gör att ett tryck aldrig tappas om nätet blippar, och utkast
 * sparas medan man skriver — livevyn ritar om sidan var tionde sekund och får
 * aldrig äta upp en halvskriven mening.
 */
(function () {
  var KO = 'wl_svar_ko';        // svar som inte kommit fram än
  var UTKAST = 'wl_svar_utkast'; // halvskrivna meningar
  var OPPNA = 'wl_svar_oppna';   // vilka kort som har skrivrutan utfälld
  var BORTNA = 'wl_svar_bortna'; // kort Marc tagit bort, tills datorn hunnit ikapp

  var css = '.svarruta{margin-top:10px;border-top:1px dashed var(--rule,#ddd);padding-top:8px}'
    + '.svarruta .svartopp{display:flex;gap:8px;align-items:center;flex-wrap:wrap}'
    + '.svarruta .svartopp button{font-family:var(--body,inherit);font-size:12.5px;font-weight:600;border:1px solid var(--rule,#ddd);background:var(--sunk,#eee);color:var(--ink,#222);border-radius:9px;padding:4px 10px;cursor:pointer}'
    + '.svarruta .svartopp button:hover{filter:brightness(1.06)}'
    + '.svarruta .svartopp button.on{background:var(--accent-soft,#dfe8f5);color:var(--accent,#1f4e8c);border-color:var(--accent,#1f4e8c)}'
    + '.svarruta .svartopp .antal{font-family:var(--mono,monospace);font-size:11px;color:var(--ink-3,#888)}'
    + '.svarruta .bubblor{display:flex;flex-direction:column;gap:4px;margin-top:7px}'
    + '.svarruta .bubbla{font-size:13px;background:var(--sunk,#eee);border-radius:10px;padding:5px 9px;color:var(--ink,#222);line-height:1.4}'
    + '.svarruta .bubbla .n{font-family:var(--mono,monospace);font-size:11px;color:var(--ink-3,#888);margin-right:6px}'
    + '.svarruta .bubbla.vantar{opacity:.6}'
    + '.svarruta .bubbla.ja{border-left:3px solid var(--done,#24734a)}'
    + '.svarruta .bubbla.nej{border-left:3px solid var(--fail,#ad392f)}'
    + '.svarruta .bubbla .atg{display:block;font-family:var(--mono,monospace);font-size:11px;color:var(--ink-3,#888);margin-top:2px}'
    + '.svarruta .janej{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}'
    + '.svarruta .janej button{font-family:var(--body,inherit);font-size:13px;font-weight:600;border:1px solid var(--rule,#ddd);background:var(--sunk,#eee);color:var(--ink,#222);border-radius:9px;padding:6px 11px;cursor:pointer}'
    + '.svarruta .janej button.ja.on{background:var(--done-soft,#d6ecdf);color:var(--done,#24734a);border-color:var(--done,#24734a)}'
    + '.svarruta .janej button.nej.on{background:var(--fail-soft,#f5dbd7);color:var(--fail,#ad392f);border-color:var(--fail,#ad392f)}'
    + '.svarruta .janej button.bort{margin-left:auto}'
    + '.svarruta .janej button.bort.armerad{background:var(--fail,#ad392f);color:#fff;border-color:var(--fail,#ad392f)}'
    + '.svarruta .janej button.err,.svarruta .skriv button.err{outline:2px solid var(--fail,#ad392f)}'
    + '.svarruta .skriv{display:flex;gap:6px;margin-top:7px;align-items:flex-start}'
    + '.svarruta .skriv textarea{flex:1;min-width:0;font-family:var(--body,inherit);font-size:13px;line-height:1.35;border:1px solid var(--rule,#ddd);border-radius:10px;padding:6px 9px;background:var(--panel,#fff);color:var(--ink,#222);resize:vertical;min-height:38px}'
    + '.svarruta .skriv button{font-family:var(--body,inherit);font-size:13px;font-weight:600;border:1px solid var(--rule,#ddd);background:var(--sunk,#eee);color:var(--ink,#222);border-radius:9px;padding:6px 11px;cursor:pointer;white-space:nowrap}'
    + '.svarruta .lage{font-size:12px;color:var(--ink-3,#888);margin-top:5px}';

  var data = {};        // { uppdragId: [rad, …] } från servern
  var ko = [];          // ej framskickade svar
  var utkast = {};      // { uppdragId: text }
  var oppna = {};       // { uppdragId: 1 }
  var laddat = false;
  var armerad = {};      // ta bort-knappar som väntar på sitt andra tryck
  var bortna = {};       // { uppdragId: tidpunkt } — göms redan nu, städas när datorn läst svaret

  try { ko = JSON.parse(localStorage.getItem(KO) || '[]'); } catch (e) { ko = []; }
  if (!Array.isArray(ko)) ko = [];
  try { utkast = JSON.parse(localStorage.getItem(UTKAST) || '{}') || {}; } catch (e) { utkast = {}; }
  try { oppna = JSON.parse(localStorage.getItem(OPPNA) || '{}') || {}; } catch (e) { oppna = {}; }
  try { bortna = JSON.parse(localStorage.getItem(BORTNA) || '{}') || {}; } catch (e) { bortna = {}; }
  // Gömda kort är en tillfällig lögn i webbläsaren: datorn tar bort uppdraget på
  // riktigt vid nästa bevakning och då slutar det komma med i datan. Kom det
  // aldrig fram ska kortet synas igen i stället för att försvinna för gott — två
  // dygn räcker med marginal för en dator som stått av över helgen.
  (function () {
    var nu = Date.now(), rensat = false;
    Object.keys(bortna).forEach(function (k) { if (!(nu - (bortna[k] || 0) < 48 * 3600 * 1000)) { delete bortna[k]; rensat = true; } });
    if (rensat) { try { localStorage.setItem(BORTNA, JSON.stringify(bortna)); } catch (e) { /* privat läge */ } }
  })();

  function sparaKo() { try { localStorage.setItem(KO, JSON.stringify(ko)); } catch (e) { /* privat läge */ } }
  function sparaUtkast() { try { localStorage.setItem(UTKAST, JSON.stringify(utkast)); } catch (e) { /* privat läge */ } }
  function sparaOppna() { try { localStorage.setItem(OPPNA, JSON.stringify(oppna)); } catch (e) { /* privat läge */ } }
  function sparaBortna() { try { localStorage.setItem(BORTNA, JSON.stringify(bortna)); } catch (e) { /* privat läge */ } }
  /* Trycker Marc Ta bort ska kortet försvinna i samma sekund — inte om tio
   * minuter när bevakningen läst svaret. Kortet göms därför direkt i
   * webbläsaren; datorn gör sedan borttagningen på riktigt och då slutar
   * uppdraget komma med i datan över huvud taget. */
  function doljKort(id) {
    var ruta = document.querySelector('.svarruta[data-uppdrag="' + String(id).replace(/"/g, '\\"') + '"]');
    var kort = ruta && ruta.closest ? ruta.closest('.card, article') : null;
    if (kort) kort.style.display = 'none';
  }
  function doljBortna() { Object.keys(bortna).forEach(doljKort); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function klockslag(iso) {
    try { return new Date(iso).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ''); }
    catch (e) { return ''; }
  }

  /* Vad ett svar gör beror på var uppdraget står. Det skrivs ut i rutan så att
   * ingen trycker Skicka och undrar vart orden tog vägen. */
  function lage(status) {
    var bort = ' 🗑 Delete removes the whole card from the list.';
    if (status === 'paused') return { janej: true, text: 'Written on the paused task — the hand continues where it left off. Yes takes it up again, first in the queue.' + bort };
    if (status === 'failed') return { janej: true, text: 'The blocker is closed: what you write becomes a NEW task that refers back to it. Yes takes it up again, first in the queue.' + bort };
    if (status === 'done') return { janej: false, text: 'The task is done: what you write becomes a NEW task that refers back to it — an addition, not a rewrite of the old one.' + bort };
    return { janej: false, text: 'Written as a step on the task — the hand working on it sees it on the page.' + bort };
  }

  function rader(id) {
    var sparade = (data[String(id)] || []).slice();
    var vantande = ko.filter(function (k) { return String(k.id) === String(id); })
      .map(function (k) { return { id: k.nyckel, text: k.text, ja: k.ja, at: k.at, vantar: true }; });
    return sparade.concat(vantande);
  }

  /** Rutan under ett kort. `it` är uppdraget ur listan (id + status). */
  function panel(it) {
    var id = String(it.id);
    var st = String(it.status || 'open');
    var L = lage(st);
    var lista = rader(id);
    var ute = !!oppna[id];
    var d = document.createElement('div');
    d.className = 'svarruta';
    d.dataset.uppdrag = id;

    var html = '<div class="svartopp">'
      + '<button type="button" data-oppna="' + esc(id) + '"' + (ute ? ' class="on"' : '') + '>' + (ute ? '✕ Close reply' : '💬 Reply') + '</button>'
      + (lista.length ? '<span class="antal">' + lista.length + ' replies</span>' : '')
      + '</div>';

    if (lista.length) {
      html += '<div class="bubblor">' + lista.map(function (r) {
        var kl = 'bubbla' + (r.vantar ? ' vantar' : '') + (r.ja === 'ja' ? ' ja' : (r.ja === 'nej' || r.ja === 'bort') ? ' nej' : '');
        var huvud = (r.ja === 'ja' ? '✅ Yes' : r.ja === 'nej' ? '🚫 No' : r.ja === 'bort' ? '🗑 Delete' : '');
        var kropp = [huvud, r.text ? esc(r.text) : ''].filter(Boolean).join(' — ');
        return '<div class="' + kl + '"><span class="n">' + esc(klockslag(r.at)) + '</span>' + kropp
          + (r.vantar ? '<span class="atg">sending…</span>' : r.atgard ? '<span class="atg">→ ' + esc(r.atgard) + '</span>' : '')
          + '</div>';
      }).join('') + '</div>';
    }

    if (ute) {
      // Ja/Nej bara där frågan "ta upp det här igen?" står — Ta bort under ALLA kort (#317).
      html += '<div class="janej">'
        + (L.janej
          ? '<button type="button" class="ja" data-ja="ja" data-id="' + esc(id) + '">✅ Yes — take up again</button>'
            + '<button type="button" class="nej" data-ja="nej" data-id="' + esc(id) + '">🚫 No — set aside</button>'
          : '')
        + '<button type="button" class="bort' + (armerad[id] ? ' armerad' : '') + '" data-bort="' + esc(id) + '" title="The card disappears from the list">'
        + (armerad[id] ? '🗑 Press again to delete' : '🗑 Delete') + '</button>'
        + '</div>';
      html += '<div class="skriv">'
        + '<textarea rows="2" data-skriv="' + esc(id) + '" aria-label="Reply to task ' + esc(id) + '" placeholder="Write a reply or an addition…">' + esc(utkast[id] || '') + '</textarea>'
        + '<button type="button" data-skicka="' + esc(id) + '">Send</button>'
        + '</div>'
        + '<div class="lage">' + esc(L.text) + '</div>';
    }
    d.innerHTML = html;
    // Livevyn bygger om korten var tionde sekund: ett kort Marc redan tagit bort
    // får inte blinka fram igen medan datorn hinner ikapp.
    if (bortna[id]) setTimeout(function () { doljKort(id); }, 0);
    return d;
  }

  /** Skickar ett svar. Lyckas det inte direkt ligger det kvar i kön och går fram
   *  vid nästa försök — samma mönster som rekommendationsknapparna. */
  function skicka(id, text, ja, knapp) {
    if (ja === 'bort') { bortna[String(id)] = Date.now(); sparaBortna(); doljKort(id); }
    var rad = { nyckel: 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), id: String(id), text: text || null, ja: ja || null, at: new Date().toISOString() };
    ko.push(rad); sparaKo();
    rita();
    return fetch('/api/svar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: rad.id, text: rad.text || undefined, ja: rad.ja || undefined }) })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (j) {
        ko = ko.filter(function (k) { return k.nyckel !== rad.nyckel; }); sparaKo();
        if (j && j.svar) data = j.svar;
        rita();
      })
      .catch(function () {
        if (knapp) { knapp.classList.add('err'); knapp.title = 'Did not go through — stays queued and will resend.'; }
        rita();
      });
  }

  /** Tömmer väntekön — körs när sidan öppnas och efter varje lyckat anrop. */
  function skickaKon() {
    if (!ko.length) return;
    var nasta = ko[0];
    fetch('/api/svar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: nasta.id, text: nasta.text || undefined, ja: nasta.ja || undefined }) })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (j) {
        ko = ko.filter(function (k) { return k.nyckel !== nasta.nyckel; }); sparaKo();
        if (j && j.svar) data = j.svar;
        rita();
        skickaKon();
      })
      .catch(function () { /* nästa varv */ });
  }

  function hamta() {
    return fetch('/api/svar?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (j && j.svar) { data = j.svar; laddat = true; rita(); }
      })
      .catch(function () { /* sidan fungerar utan svaren */ });
  }

  /* Skyddet gäller SKRIVRUTAN, inte vilket fokus som helst: en knapp behåller
   * fokus efter ett klick, och skyddade vi hela rutan då skulle den aldrig
   * ritas om efter att man tryckt Svara. */
  function skriverI(root) {
    var a = document.activeElement;
    if (!a || a.tagName !== 'TEXTAREA' || !a.dataset || !a.dataset.skriv) return false;
    return root ? root.contains(a) : true;
  }

  /** Ritar om alla rutor som redan sitter på sidan, utan att röra resten. */
  function rita() {
    var rutor = document.querySelectorAll('.svarruta[data-uppdrag]');
    for (var i = 0; i < rutor.length; i++) {
      var gammal = rutor[i];
      var id = gammal.dataset.uppdrag;
      // Rör aldrig rutan man står och skriver i.
      if (skriverI(gammal)) continue;
      var status = gammal.dataset.status || 'open';
      var ny = panel({ id: id, status: status });
      ny.dataset.status = status;
      gammal.replaceWith(ny);
    }
    doljBortna();
  }

  /* Skriver Marc just nu? Livevyn bygger om alla kort var tionde sekund och får
   * inte kasta bort en halvfärdig mening mitt i. */
  function skriverNu() { return skriverI(null); }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.svarruta button') : null;
    if (!b) return;
    if (b.dataset.oppna) {
      var id = b.dataset.oppna;
      if (oppna[id]) delete oppna[id]; else oppna[id] = 1;
      sparaOppna();
      rita();
      if (oppna[id]) {
        var ta = document.querySelector('.svarruta[data-uppdrag="' + id + '"] textarea');
        if (ta) ta.focus();
      }
      return;
    }
    // Ta bort — två tryck, inget confirm(): en systemruta mitt i en livevy som
    // ritar om sig är lätt att råka trycka bort på mobilen. Första trycket
    // armerar knappen ("Tryck igen"), andra skickar. Armeringen slocknar av sig
    // själv efter fem sekunder.
    if (b.dataset.bort) {
      var bid = b.dataset.bort;
      if (!armerad[bid]) {
        armerad[bid] = 1;
        rita();
        setTimeout(function () { if (armerad[bid]) { delete armerad[bid]; rita(); } }, 5000);
        return;
      }
      delete armerad[bid];
      b.classList.remove('err');
      var brut = document.querySelector('.svarruta[data-uppdrag="' + bid + '"] textarea');
      var btxt = brut ? brut.value.trim() : '';
      if (brut) { brut.value = ''; delete utkast[bid]; sparaUtkast(); }
      skicka(bid, btxt, 'bort', b);
      return;
    }
    if (b.dataset.ja) {
      b.classList.remove('err');
      // Ja/Nej får följa med en text om man skrivit något — ett tryck, ett svar.
      var jid = b.dataset.id;
      var ruta = document.querySelector('.svarruta[data-uppdrag="' + jid + '"] textarea');
      var txt = ruta ? ruta.value.trim() : '';
      if (ruta) { ruta.value = ''; delete utkast[jid]; sparaUtkast(); }
      skicka(jid, txt, b.dataset.ja, b);
      return;
    }
    if (b.dataset.skicka) {
      b.classList.remove('err');
      var sid = b.dataset.skicka;
      var ta2 = document.querySelector('.svarruta[data-uppdrag="' + sid + '"] textarea');
      var t = ta2 ? ta2.value.trim() : '';
      if (!t) { if (ta2) ta2.focus(); return; }
      ta2.value = ''; delete utkast[sid]; sparaUtkast();
      skicka(sid, t, null, b);
    }
  });

  document.addEventListener('input', function (e) {
    var ta = e.target;
    if (!ta || !ta.dataset || !ta.dataset.skriv) return;
    var id = ta.dataset.skriv;
    if (ta.value.trim()) utkast[id] = ta.value; else delete utkast[id];
    sparaUtkast();
  });

  // Ctrl/Cmd+Enter skickar — samma vana som i chattar.
  document.addEventListener('keydown', function (e) {
    if (!(e.key === 'Enter' && (e.ctrlKey || e.metaKey))) return;
    var ta = e.target;
    if (!ta || !ta.dataset || !ta.dataset.skriv) return;
    var knapp = document.querySelector('.svarruta[data-uppdrag="' + ta.dataset.skriv + '"] button[data-skicka]');
    if (knapp) knapp.click();
  });

  window.WL_SVAR = {
    panel: panel,
    rader: rader,
    skriverNu: skriverNu,
    laddat: function () { return laddat; },
    hamta: hamta,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  function start() {
    var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    hamta().then(skickaKon);
    // Färska svar även när någon annan (Telegram-svaret, en annan flik) skrivit.
    setInterval(function () { if (!document.hidden && !skriverNu()) hamta(); }, 30000);
  }
})();
