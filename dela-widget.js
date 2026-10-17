/* dela-widget.js — delningsknappen och delningsläget, bredvid varje projekt (#384).
 *
 * Marc 2026-09-16: "the GitHub from quiz runner is shared with Złoty already he
 * has full access […] he can request access and then it will send me a message
 * on the worklist light up orange and when it's accessed its green and when
 * fully merged between computers ita purple and moved to the center of the
 * screen […] share links can be found next by each project and. Routines so
 * that you can paste into your chatgpt or Claude or antigravity and then be
 * able to connect in one click one share option for zloty one share option for
 * Marc and it should ask who are you which link you need".
 *
 * Tre saker, alla på samma ställe — bredvid projektet, inte på en egen sida:
 *
 *  1. LÄGET. En prick i tre färger som säger hur långt hopkopplingen kommit:
 *     🟠 delningen är skickad (eller access begärd, och Marc har fått besked)
 *     🟢 den är öppnad — han har varit inne
 *     🟣 hopkopplad på riktigt: hans dator kör projektet genom nodbryggan.
 *     Ett lila projekt FLYTTAS till mittkolumnen på Merged, för det är då det
 *     är gemensamt på riktigt och inte bara utlånat.
 *
 *  2. VEM ÄR DU. Första trycket frågar: Marc eller Złoty. Svaret ligger kvar
 *     (localStorage) och styr vilken länk och vilken text man får — Marc får
 *     sin mapp och Claude Code, Złoty får git clone och node2.js. Man byter
 *     med «not you?» i rutan.
 *
 *  3. LÄNKEN ATT KLISTRA IN. En färdig text att lägga in i ChatGPT, Claude
 *     eller Antigravity, så att den andra sidan är inne i projektet på ett
 *     tryck i stället för att få instruktioner i fem meddelanden.
 *
 * Läget sparas server-side i /api/delning (privat GitHub-repo, samma mönster
 * som prioriteterna och tillstånden). Inga nycklar ligger här: en delningslänk
 * är en publik GitHub-adress, och behörigheten på repot ger Marc för hand.
 */
(function () {
  'use strict';

  var API = '/api/delning';
  var VEM_KEY = 'wl-dela-vem';
  var SITE = 'https://marcdshark666.github.io';   // GitHub Pages sedan 2026-09-17
  var NODREPO = 'https://github.com/marcdshark666/the-work-list-nodes';

  var LAGEN = [
    ['orange', '🟠', 'Share sent', 'the link has gone out — not opened yet'],
    ['gron', '🟢', 'Accessed', 'opened — he has been inside'],
    ['lila', '🟣', 'Merged', 'connected to Złoty’s computer — sits in the middle'],
  ];
  var ETIKETT = {}, HINT = {}, PRICK = {};
  LAGEN.forEach(function (x) { PRICK[x[0]] = x[1]; ETIKETT[x[0]] = x[2]; HINT[x[0]] = x[3]; });

  var PERSONER = {
    marc: { namn: 'Marc', cli: 'Claude Code', dator: 'PC 1 — this machine', sida: SITE + '/' },
    zloty: { namn: 'Złoty', cli: 'ChatGPT / Codex', dator: 'PC 2 — Złoty’s machine', sida: SITE + '/shared' },
  };

  var data = { delning: {} };
  var vem = null;
  try { vem = localStorage.getItem(VEM_KEY); } catch (e) { /* privat läge */ }
  if (vem !== 'marc' && vem !== 'zloty') vem = null;

  // ------------------------------------------------------------------ stil
  var CSS = ''
    + '.dela{display:inline-flex;align-items:center;gap:6px;margin-left:auto;flex:0 0 auto}'
    + '.dela button{font-family:inherit;font-size:12px;border:1px solid var(--rule);background:var(--sunk);color:var(--ink-2);border-radius:999px;padding:3px 10px;cursor:pointer;white-space:nowrap}'
    + '.dela button:hover{border-color:var(--accent);color:var(--ink)}'
    + '.dela .lage{font-size:13px;line-height:1;padding:3px 7px}'
    + '.dela .lage.satt{background:var(--panel)}'
    + '.card .dela{margin:2px 0 0}'
    + '.mrad .dela{margin-left:6px}'
    + '.mrad{position:relative}'
    + '.mrad.d-orange{border-color:#d4880f;box-shadow:inset 3px 0 0 #d4880f}'
    + '.mrad.d-gron{border-color:#2e9e5b;box-shadow:inset 3px 0 0 #2e9e5b}'
    + '.mrad.d-lila{border-color:#8b5cf6;box-shadow:inset 3px 0 0 #8b5cf6,0 0 0 1px rgba(139,92,246,.35)}'
    + '.card.d-orange{border-color:#d4880f}.card.d-gron{border-color:#2e9e5b}.card.d-lila{border-color:#8b5cf6;box-shadow:0 0 0 2px rgba(139,92,246,.3),var(--shadow)}'
    + '.mrad .dprick{font-size:12px;line-height:1}'
    + '#delaruta{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;place-items:center;z-index:70;padding:16px;overflow:auto}'
    + '#delaruta.pa{display:grid}'
    + '#delaruta .box{background:var(--panel);color:var(--ink);border:1px solid var(--rule);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.45);max-width:640px;width:100%;padding:18px 18px 16px;max-height:92vh;overflow:auto}'
    + '#delaruta h4{font-family:var(--display);font-size:18px;margin:0 0 2px;font-weight:800}'
    + '#delaruta .sub{font-size:12.5px;color:var(--ink-3);margin:0 0 12px}'
    + '#delaruta .vemval{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 4px}'
    + '#delaruta .vemval button{flex:1 1 180px;text-align:left;font-family:inherit;border:1px solid var(--rule);background:var(--sunk);color:var(--ink);border-radius:16px;padding:12px 14px;cursor:pointer}'
    + '#delaruta .vemval button:hover{border-color:var(--accent)}'
    + '#delaruta .vemval b{display:block;font-family:var(--display);font-size:16px}'
    + '#delaruta .vemval span{font-size:12px;color:var(--ink-3)}'
    + '#delaruta .rad{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}'
    + '#delaruta .rad a,#delaruta .rad button{font-family:inherit;font-size:13px;font-weight:600;border:1px solid var(--rule);background:var(--sunk);color:var(--ink);border-radius:999px;padding:7px 13px;cursor:pointer;text-decoration:none}'
    + '#delaruta .rad a:hover,#delaruta .rad button:hover{border-color:var(--accent)}'
    + '#delaruta .rad .prim{background:var(--accent);border-color:var(--accent);color:#fff}'
    + '#delaruta pre{background:var(--sunk);border:1px solid var(--rule);border-radius:14px;padding:11px 12px;font-family:var(--mono);font-size:11.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word;margin:6px 0 0;max-height:34vh;overflow:auto}'
    + '#delaruta .sec2{font-family:var(--display);font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--ink-3);margin:14px 0 0}'
    + '#delaruta .lagval{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 0}'
    + '#delaruta .lagval button{font-size:13px;border-radius:999px;padding:6px 12px;border:1px solid var(--rule);background:var(--sunk);color:var(--ink);cursor:pointer;font-family:inherit}'
    + '#delaruta .lagval button.on{background:var(--panel);border-color:var(--ink-3);box-shadow:0 0 0 2px var(--accent-soft)}'
    + '#delaruta .stang{float:right;border:0;background:none;color:var(--ink-3);font-size:22px;line-height:1;cursor:pointer;padding:0 2px}'
    + '#delaruta .kvitto{font-size:12.5px;color:var(--done);margin:8px 0 0;min-height:1em}'
    + '#delaruta .kvitto.fel{color:var(--fail)}'
    + '#delavem{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:var(--panel);border:1px solid var(--rule);border-radius:16px;padding:9px 12px;margin:0 0 16px;box-shadow:var(--shadow);font-size:13px}'
    + '#delavem b{font-family:var(--display);font-size:13px}'
    + '#delavem button{font-family:inherit;font-size:12.5px;border:1px solid var(--rule);background:var(--sunk);color:var(--ink);border-radius:999px;padding:4px 11px;cursor:pointer}'
    + '#delavem button.on{background:var(--accent);border-color:var(--accent);color:#fff}'
    + '#delavem .info{color:var(--ink-3);font-size:12px;margin-left:auto}'
    + '@media(max-width:600px){#delavem .info{margin-left:0;width:100%}}';

  function stil() {
    if (document.getElementById('dela-css')) return;
    var s = document.createElement('style');
    s.id = 'dela-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  // --------------------------------------------------------------- hjälpare
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lageAv(namn) { var p = data.delning[namn]; return (p && p.lage) || ''; }
  function postAv(namn) { return data.delning[namn] || null; }
  function kortnamn(repo) { return String(repo || '').replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, ''); }

  /** Allt widgeten vet om ett projekt — hämtas ur data-attributen som
   *  projects.js bakat in, så ingen extra begäran behövs för att öppna rutan. */
  function projektAv(el) {
    return {
      namn: el.getAttribute('data-name') || '',
      repo: el.getAttribute('data-repo') || '',
      live: el.getAttribute('data-live') || '',
      mapp: el.getAttribute('data-dir') || '',
      rutin: el.getAttribute('data-rutin') || '',
    };
  }

  // ------------------------------------------- texten man klistrar in i sin AI
  // En prompt, inte en länksamling: den som klistrar in ska vara inne i
  // projektet efter ett tryck, inte få veta var den kan läsa om det.
  function prompt(p, som) {
    var rader = [];
    var vad = p.rutin ? 'the routine «' + p.rutin + '»' : 'the project «' + p.namn + '»';
    if (som === 'marc') {
      rader.push('Work on ' + vad + ' together with Złoty (PC 2, ChatGPT Pro / Codex).');
      if (p.mapp) rader.push('Folder on this machine: ' + p.mapp);
      if (p.repo) rader.push('Repo: ' + p.repo);
      if (p.live) rader.push('Live: ' + p.live);
      rader.push('Read CLAUDE.md and README.md in the folder first, then the memory index');
      rader.push('~/.claude/projects/E--CHAT-RTX-CLAUDECODE-GENERAL-BRAIN-APP-ideas/memory/MEMORY.md.');
      rader.push('Złoty works in the same repo from his own machine — pull before you push,');
      rader.push('and never force-push: his work list runs on the same branch.');
      rader.push('The task list is at ' + SITE + ' .');
    } else {
      rader.push('You are working with Marc on ' + vad + '. You have full access to the repo.');
      if (p.repo) {
        rader.push('');
        rader.push('Get the code (once):');
        rader.push('  gh auth login                      # your own GitHub sign-in, no API key');
        rader.push('  gh repo clone ' + kortnamn(p.repo) + ' ' + (p.namn || 'project'));
        rader.push('  cd ' + (p.namn || 'project'));
      }
      if (p.live) rader.push((p.repo ? '' : '') + 'Live site: ' + p.live);
      rader.push('');
      rader.push('Get your tasks (once):');
      rader.push('  gh repo clone marcdshark666/the-work-list-nodes');
      rader.push('  cd the-work-list-nodes && node node2.js check');
      rader.push('Every day:');
      rader.push('  node node2.js list                   what is waiting for you');
      rader.push('  node node2.js next                   the next task as a ready prompt');
      rader.push('  node node2.js start <id> / note <id> "…" / done <id> "…" / fail <id> "…"');
      rader.push('');
      rader.push('Read README.md in the project before you change anything. Pull before you push,');
      rader.push('never force-push — Marc works in the same branch from PC 1.');
      rader.push('The shared page is ' + SITE + '/shared .');
    }
    return rader.join('\n');
  }

  /** En rad att skicka i ett meddelande — kort nog för Telegram eller SMS. */
  function kortlank(p, som) {
    var bitar = [(p.rutin ? 'Routine ' : '') + (p.rutin || p.namn)];
    if (p.repo) bitar.push(p.repo);
    if (p.live) bitar.push(p.live);
    bitar.push(PERSONER[som].sida);
    return bitar.join(' · ');
  }

  // ------------------------------------------------------------------ rutan
  function ruta() {
    var r = document.getElementById('delaruta');
    if (r) return r;
    r = document.createElement('div');
    r.id = 'delaruta';
    r.innerHTML = '<div class="box" role="dialog" aria-modal="true" aria-label="Share"></div>';
    r.addEventListener('click', function (e) { if (e.target === r) stang(); });
    document.body.appendChild(r);
    return r;
  }
  function stang() { var r = document.getElementById('delaruta'); if (r) r.classList.remove('pa'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') stang(); });

  var oppet = null;   // projektet rutan står öppen på

  function rita() {
    if (!oppet) return;
    var p = oppet, r = ruta(), box = r.querySelector('.box');
    var cur = lageAv(p.namn), post = postAv(p.namn);

    // Steg 1: vem är du? Utan svar vet vi inte vilken länk som ska visas.
    if (!vem) {
      box.innerHTML = '<button class="stang" type="button" data-x aria-label="Close">×</button>'
        + '<h4>Who are you?</h4>'
        + '<p class="sub">The link is not the same for both of you — Marc gets the folder on this machine, Złoty gets the clone command. Pick once; it is remembered.</p>'
        + '<div class="vemval">'
        + '<button type="button" data-vem="marc"><b>Marc</b><span>Claude Code · PC 1 — this machine</span></button>'
        + '<button type="button" data-vem="zloty"><b>Złoty</b><span>ChatGPT Pro / Codex · PC 2</span></button>'
        + '</div>';
      r.classList.add('pa');
      return;
    }

    var som = vem, per = PERSONER[som];
    var txt = prompt(p, som);
    var lankar = [];
    if (p.repo) lankar.push('<a href="' + esc(p.repo) + '" target="_blank" rel="noopener">Open repo ↗</a>');
    if (p.live) lankar.push('<a href="' + esc(p.live) + '" target="_blank" rel="noopener">Open site ↗</a>');
    lankar.push('<a href="' + esc(per.sida) + '" target="_blank" rel="noopener">' + (som === 'marc' ? 'Work List' : 'Shared page') + ' ↗</a>');
    if (som === 'zloty') lankar.push('<a href="' + NODREPO + '" target="_blank" rel="noopener">Task bridge ↗</a>');

    var lagerad = LAGEN.map(function (x) {
      return '<button type="button" data-lage="' + x[0] + '" class="' + (cur === x[0] ? 'on' : '') + '" title="' + esc(x[3]) + '">' + x[1] + ' ' + esc(x[2]) + '</button>';
    }).join('') + '<button type="button" data-lage="" class="' + (cur ? '' : 'on') + '" title="not shared">⚪ Not shared</button>';

    var begart = post && post.begart && !post.begart.notis
      ? '<p class="sub" style="margin:8px 0 0">⏳ Access asked for by <b>' + esc((PERSONER[post.begart.av] || {}).namn || post.begart.av) + '</b> — Marc gets the message at the next check.</p>'
      : '';

    box.innerHTML = '<button class="stang" type="button" data-x aria-label="Close">×</button>'
      + '<h4>' + esc(p.rutin || p.namn) + '</h4>'
      + '<p class="sub">You are <b>' + esc(per.namn) + '</b> · ' + esc(per.cli) + ' · ' + esc(per.dator)
      + ' — <button type="button" data-byt style="border:0;background:none;color:var(--accent);cursor:pointer;font:inherit;padding:0;text-decoration:underline">not you?</button></p>'
      + '<div class="rad">' + lankar.join('') + '</div>'
      + '<div class="sec2">Paste this into ChatGPT, Claude or Antigravity</div>'
      + '<div class="rad"><button type="button" class="prim" data-kopia="prompt">⎘ Copy the connect prompt</button>'
      + '<button type="button" data-kopia="rad">⎘ Copy one line to send</button>'
      + (p.repo ? '<button type="button" data-kopia="clone">⎘ Copy clone command</button>' : '')
      + '</div>'
      + '<pre data-txt>' + esc(txt) + '</pre>'
      + '<div class="sec2">How far the sharing has come</div>'
      + '<div class="lagval">' + lagerad + '</div>'
      + '<p class="sub" style="margin:6px 0 0">' + (cur ? esc(HINT[cur]) : 'not shared with anyone yet') + '</p>'
      + (som === 'zloty' ? '<div class="rad"><button type="button" data-begar>✋ Ask Marc for access</button></div>' : '')
      + begart
      + '<p class="kvitto" data-kvitto></p>';
    r.classList.add('pa');
  }

  function kvitto(text, fel) {
    var el = document.querySelector('#delaruta [data-kvitto]');
    if (!el) return;
    el.textContent = text;
    el.className = 'kvitto' + (fel ? ' fel' : '');
    if (!fel) setTimeout(function () { if (el.textContent === text) el.textContent = ''; }, 4000);
  }
  function kopiera(text) {
    // Clipboard API kräver säker kontext; på en gammal webbläsare eller över
    // http faller vi tillbaka på markering, så knappen aldrig gör ingenting.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { kvitto('Copied — paste it into your AI.'); }, manuellt);
    }
    manuellt();
    function manuellt() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      kvitto(ok ? 'Copied — paste it into your AI.' : 'Could not copy — mark the text above and copy it.', !ok);
    }
  }

  function spara(kropp) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kropp) })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function (j) { if (j && j.delning) data = j; ritaAllt(); rita(); return j; });
  }

  // ----------------------------------------------------------------- knappar
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    if (t.closest('#delaruta [data-x]')) { stang(); return; }

    var v = t.closest('#delaruta [data-vem]');
    if (v) {
      vem = v.getAttribute('data-vem');
      try { localStorage.setItem(VEM_KEY, vem); } catch (err) { /* privat läge */ }
      ritaVemrad(); rita();
      return;
    }
    if (t.closest('#delaruta [data-byt]')) { vem = null; try { localStorage.removeItem(VEM_KEY); } catch (err) { } ritaVemrad(); rita(); return; }

    var k = t.closest('#delaruta [data-kopia]');
    if (k && oppet) {
      var sort = k.getAttribute('data-kopia');
      if (sort === 'prompt') kopiera(prompt(oppet, vem || 'marc'));
      else if (sort === 'rad') kopiera(kortlank(oppet, vem || 'marc'));
      else kopiera('gh repo clone ' + kortnamn(oppet.repo) + ' ' + (oppet.namn || 'project'));
      return;
    }

    var l = t.closest('#delaruta [data-lage]');
    if (l && oppet) {
      var lage = l.getAttribute('data-lage');
      spara({ name: oppet.namn, lage: lage, av: vem || 'marc' })
        .then(function () { kvitto(lage ? PRICK[lage] + ' set to ' + ETIKETT[lage] + '.' : 'Cleared.'); })
        .catch(function (err) { kvitto('Could not save: ' + err.message, true); });
      return;
    }

    if (t.closest('#delaruta [data-begar]') && oppet) {
      spara({ name: oppet.namn, begar: vem || 'zloty' })
        .then(function () { kvitto('Asked — Marc gets the message at the next check, and the project is orange until he answers.'); })
        .catch(function (err) { kvitto('Could not ask: ' + err.message, true); });
      return;
    }

    // Delningsknappen bredvid projektet
    var d = t.closest('.dela [data-dela]');
    if (d) {
      e.preventDefault();
      var host = d.closest('[data-name]');
      if (!host) return;
      oppet = projektAv(host);
      rita();
      return;
    }

    var f = t.closest('#delavem button[data-vem2]');
    if (f) {
      var val = f.getAttribute('data-vem2');
      vem = val === 'x' ? null : val;
      try { if (vem) localStorage.setItem(VEM_KEY, vem); else localStorage.removeItem(VEM_KEY); } catch (err) { }
      ritaVemrad();
      return;
    }
  });

  // --------------------------------------------------- knappen bredvid varje
  function vardar() {
    var lista = [].slice.call(document.querySelectorAll('.card[data-name], .mrad[data-name]'));
    return lista;
  }
  function ritaAllt() {
    vardar().forEach(function (el) {
      var p = projektAv(el), cur = lageAv(p.namn);
      el.classList.remove('d-orange', 'd-gron', 'd-lila');
      if (cur) el.classList.add('d-' + cur);
      el.setAttribute('data-lage', cur);

      var box = el.querySelector(".dela");
      if (!box) {
        box = document.createElement('span');
        box.className = 'dela';
        // Kortet: under namnraden. Merged-raden: sist på raden, där det finns
        // plats utan att knuffa ut projektnamnet.
        var namnrad = el.querySelector('.name');
        if (namnrad) namnrad.appendChild(box);
        else if (el.classList.contains('mrad')) el.appendChild(box);
        else el.appendChild(box);
      }
      var titel = cur ? PRICK[cur] + ' ' + ETIKETT[cur] + ' — ' + HINT[cur] : 'Not shared yet';
      box.innerHTML = '<button type="button" class="lage' + (cur ? ' satt' : '') + '" data-dela title="' + esc(titel) + '" aria-label="' + esc(titel) + '">' + (cur ? PRICK[cur] : '⚪') + '</button>'
        + (el.classList.contains('mrad') ? '' : '<button type="button" data-dela title="Share links and a ready prompt to paste into ChatGPT, Claude or Antigravity">\u{1f517} Share</button>');
    });
    flyttaLila();
  }

  // "when fully merged between computers ita purple and moved to the center of
  // the screen" — mittkolumnen på Merged är det gemensamma. Flytten görs här och
  // inte när sidan byggs, så att ett tryck syns direkt utan ombyggnad.
  function flyttaLila() {
    var mitt = document.querySelector('.mdack .mkol.mitt');
    if (!mitt) return;
    var rader = [].slice.call(document.querySelectorAll('.mdack .mrad[data-lage="lila"]'));
    rader.forEach(function (rad) {
      if (rad.parentNode === mitt) return;
      var tom = mitt.querySelector('.mtom');
      if (tom) tom.remove();
      mitt.appendChild(rad);
    });
    // Tomma kolumner ska säga det, annars ser de trasiga ut.
    [].slice.call(document.querySelectorAll('.mdack .mkol')).forEach(function (kol) {
      if (kol.querySelector('.mrad') || kol.querySelector('.mtom')) return;
      var t = document.createElement('div');
      t.className = 'mtom'; t.textContent = 'Everything here has moved to the middle.';
      kol.appendChild(t);
    });
  }

  // ------------------------------------------------- "vem är du" högst upp
  function ritaVemrad() {
    if (!document.querySelector('.mdack')) { var g = document.getElementById('delavem'); if (g) g.remove(); return; }
    var host = document.getElementById('delavem');
    if (!host) {
      host = document.createElement('div');
      host.id = 'delavem';
      var f = document.querySelector('.tiles') || document.querySelector('.mdack');
      if (f && f.parentNode) f.parentNode.insertBefore(host, f); else document.body.insertBefore(host, document.body.firstChild);
    }
    host.innerHTML = '<b>Who are you?</b>'
      + '<button type="button" data-vem2="marc" class="' + (vem === 'marc' ? 'on' : '') + '">Marc</button>'
      + '<button type="button" data-vem2="zloty" class="' + (vem === 'zloty' ? 'on' : '') + '">Złoty</button>'
      + (vem ? '<button type="button" data-vem2="x">ask me again</button>' : '')
      + '<span class="info">' + (vem
        ? 'Share gives you the link for ' + esc(PERSONER[vem].namn) + ' — ' + esc(PERSONER[vem].cli) + '.'
        : 'The share button asks before it gives you a link — the two of you need different ones.') + '</span>';
  }

  // ------------------------------------------------------------------ start
  function hamta() {
    fetch(API + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.delning) { data = j; ritaAllt(); if (oppet) rita(); } })
      .catch(function () { /* utan servern står det bakade läget kvar */ });
  }
  function start() {
    stil();
    // Läget som bakades in när sidan byggdes (config.json → projects.js) gäller
    // tills servern svarat, så prickarna inte blinkar fram efter en sekund.
    var bak = document.getElementById('dela-bakat');
    if (bak) { try { data = JSON.parse(bak.textContent || '{}') || { delning: {} }; } catch (e) { data = { delning: {} }; } }
    if (!data.delning) data.delning = {};
    ritaVemrad();
    ritaAllt();
    hamta();
    setInterval(hamta, 120000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
