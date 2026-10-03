// wl-github.js — The Work List talar med GitHub direkt, utan server (2026-09-17).
//
// Marc: "move everything from work list the whole web page to GitHub instead of
// Vercel". Sajten ligger nu på GitHub Pages och har ingen serverfunktion. Allt
// som förr gick till /api/<namn> på Vercel fångas här och körs I WEBBLÄSAREN:
// samma api/*.js-filer (paketerade av `node worklist.js build` till
// api-bundle.js) med samma logik, fast fetch går rakt mot api.github.com.
//
//   · LÄSA kräver ingen inloggning: repot är publikt. Sidan frågar GitHubs API
//     med villkorad hämtning (ETag → 304 kostar ingen kvot), och faller tillbaka
//     på raw.githubusercontent.com (≤ 5 min gammalt) om kvoten skulle ta slut.
//   · SKRIVA (medaljer, Ja/Nej, svar, köordning, röst, väckning …) kräver att
//     besökaren kopplat sin egen GitHub-token — den ligger bara i den här
//     webbläsarens localStorage och skickas bara till api.github.com. Ingen delad
//     hemlighet finns i sidan. Inloggningen ÄR behörigheten: den som får skriva
//     i repot får trycka på knapparna, precis som i nodkanalen.
//
// Livevyn: worklist/state.meta.json (liten) frågas var tionde sekund; först när
// den pekar på en ny commit hämtas worklist/state.json från den commiten via
// raw (oföränderlig adress → alltid färsk, aldrig i API-kvoten).
(function () {
  'use strict';
  if (window.WL_GH) return;

  var REPO = (document.documentElement.getAttribute('data-wl-repo') || 'marcdshark666/marcdshark666.github.io').trim();
  var BRANCH = 'main';
  var API = 'https://api.github.com';
  var RAW = 'https://raw.githubusercontent.com/' + REPO + '/';
  var KEY = 'wl.gh.token', KEY_LOGIN = 'wl.gh.login';
  var realFetch = window.fetch.bind(window);

  var ls = {
    get: function (k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } },
    set: function (k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { /* privat läge */ } },
  };
  var mem = { token: ls.get(KEY), login: ls.get(KEY_LOGIN) };

  // ---- Buffer-polyfill: hanterarna använder bara from()/toString() med utf8 och base64.
  function B(u8) { this.u8 = u8; }
  B.from = function (x, enc) {
    if (enc === 'base64') {
      var bin = atob(String(x || '').replace(/\s+/g, ''));
      var u = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      return new B(u);
    }
    return new B(new TextEncoder().encode(String(x == null ? '' : x)));
  };
  B.prototype.toString = function (enc) {
    if (enc === 'base64') {
      var s = '', u = this.u8;
      for (var i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return btoa(s);
    }
    return new TextDecoder().decode(this.u8);
  };
  B.byteLength = function (x) { return new TextEncoder().encode(String(x)).length; };

  function jsonResponse(obj, status) {
    return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
  }

  // ---- raw-fallback: samma fil, samma svarsform som Contents-API:t, men utan kvot.
  function rawFallback(url, headers) {
    var m = /\/repos\/([^/]+\/[^/]+)\/contents\/([^?]+)/.exec(url);
    if (!m) return Promise.resolve(jsonResponse({ message: 'unsupported' }, 400));
    var ref = (/[?&]ref=([^&]+)/.exec(url) || [])[1] || BRANCH;
    var wantRaw = /vnd\.github\.raw/.test(String((headers && (headers.Accept || headers.accept)) || ''));
    return realFetch('https://raw.githubusercontent.com/' + m[1] + '/' + ref + '/' + m[2], { cache: 'no-cache' }).then(function (r) {
      if (r.status === 404) return jsonResponse({ message: 'Not Found' }, 404);
      if (!r.ok) return jsonResponse({ message: 'raw ' + r.status }, r.status);
      return r.text().then(function (t) {
        if (wantRaw) return new Response(t, { status: 200, headers: { 'Content-Type': 'application/json' } });
        return jsonResponse({ content: B.from(t).toString('base64'), encoding: 'base64', sha: null, size: t.length, path: m[2] });
      });
    });
  }

  // ---- fetch som hanterarna får: GET går alltid (utan token: anonymt), skrivning kräver token.
  function ghFetch(url, init) {
    init = init || {};
    var method = String(init.method || 'GET').toUpperCase();
    var headers = Object.assign({}, init.headers || {});
    // Hanterarna sätter Authorization: Bearer <TOKEN>; utan riktig token tas den bort.
    if (!mem.token) { delete headers.Authorization; delete headers.authorization; }
    else headers.Authorization = 'Bearer ' + mem.token;
    delete headers['User-Agent'];   // webbläsaren sätter sin egen; egen är förbjuden
    if (method === 'GET' || method === 'HEAD') {
      // Utan token: raw.githubusercontent.com direkt. Anonymt har API:t bara 60
      // anrop i timmen per IP-adress (och villkorade 304 räknas med) — sidan
      // frågar var tionde sekund, så kvoten vore slut på tio minuter. Raw har
      // ingen kvot men en femminuterscache: den som bara tittar ser listan med
      // upp till fem minuters fördröjning; den som kopplat sin token ser den live.
      if (!mem.token && /api\.github\.com\/repos\/[^/]+\/[^/]+\/contents\//.test(url)) return rawFallback(url, headers);
      var i2 = Object.assign({}, init, { headers: headers, cache: 'no-cache' });
      return realFetch(url, i2).then(function (r) {
        if ((r.status === 403 || r.status === 429) && /api\.github\.com\/repos\/.+\/contents\//.test(url)) return rawFallback(url, headers);
        return r;
      }, function () { return rawFallback(url, headers); });
    }
    if (!mem.token) return Promise.resolve(jsonResponse({ message: 'Connect GitHub first' }, 401));
    return realFetch(url, Object.assign({}, init, { headers: headers }));
  }

  // ---- hanterarna ur api-bundle.js, instansierade per token (de läser env vid start).
  var instances = {};
  function handler(name) {
    var src = window.WL_API && window.WL_API[name];
    if (!src) return null;
    var key = name + '|' + (mem.token ? 'auth' : 'anon');
    if (instances[key]) return instances[key];
    var module = { exports: {} };
    var proc = { env: { GH_DATA_TOKEN: mem.token || 'anonymous-read', GH_DATA_REPO: REPO } };
    src(module, module.exports, proc, B, ghFetch, console, function () { throw new Error('require is not available in the browser'); });
    instances[key] = module.exports;
    return module.exports;
  }
  function resetInstances() { instances = {}; }

  function parseBody(init) {
    var b = init && init.body;
    if (b == null) return {};
    if (typeof b === 'string') { try { return JSON.parse(b); } catch (e) { return {}; } }
    if (typeof b === 'object' && !(b instanceof Blob) && !(b instanceof FormData)) return b;
    return {};
  }
  function runHandler(name, method, body, query) {
    var h = handler(name);
    if (!h) return Promise.resolve(jsonResponse({ ok: false, error: 'Unknown endpoint ' + name }, 404));
    return new Promise(function (resolve) {
      var status = 200;
      var res = {
        setHeader: function () { return res; },
        status: function (n) { status = n; return res; },
        json: function (o) { resolve(jsonResponse(o, status)); },
        send: function (b) { resolve(new Response(typeof b === 'string' ? b : JSON.stringify(b), { status: status })); },
        end: function (b) { resolve(new Response(b || '', { status: status })); },
      };
      Promise.resolve().then(function () { return h({ method: method, body: body, query: query, headers: {} }, res); })
        .catch(function (e) { resolve(jsonResponse({ ok: false, error: String(e && e.message || e) }, 500)); });
    });
  }

  // ---- livevyn: liten meta först, hela vyn bara när commiten är ny.
  var stateCache = { pushed: null, state: null };
  function readMeta() {
    var head = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    return ghFetch(API + '/repos/' + REPO + '/contents/worklist/state.meta.json?ref=' + BRANCH, { headers: head })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j) return null;
        if (j.pushed) return j;
        if (j.content) { try { return JSON.parse(B.from(j.content, 'base64').toString('utf8')); } catch (e) { return null; } }
        return null;
      }).catch(function () { return null; });
  }
  function stateCall() {
    return readMeta().then(function (meta) {
      if (meta && meta.pushed && meta.pushed === stateCache.pushed && stateCache.state) {
        var s = stateCache.state;
        return jsonResponse({ ok: true, built: s.built, updatedAt: s.pushed, state: s, cached: true });
      }
      var hamta = meta && meta.sha
        ? realFetch(RAW + meta.sha + '/worklist/state.json').then(function (r) { if (!r.ok) throw new Error('raw ' + r.status); return r.json(); })
        : Promise.reject(new Error('no meta'));
      return hamta.catch(function () {
        // Ingen meta (äldre bevakare) eller raw svarade inte: kör api/state.js som förr.
        return runHandler('state', 'GET', {}, {}).then(function (r) { return r.json(); }).then(function (j) { return j && j.state; });
      }).then(function (state) {
        if (!state) return jsonResponse({ ok: true, state: null, reason: 'no state yet' });
        stateCache = { pushed: (meta && meta.pushed) || state.pushed || null, state: state };
        return jsonResponse({ ok: true, built: state.built, updatedAt: state.pushed, state: state });
      });
    });
  }

  // ---- anslutningen: besökarens egen token, bara i den här webbläsaren.
  function whoami(token) {
    return realFetch(API + '/user', { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { return j && j.login ? j.login : null; }).catch(function () { return null; });
  }
  function connect(varfor) {
    var text = (varfor === 'write' ? 'This button writes to the list, and writing needs your own GitHub token.\n\n' : '')
      + 'Paste a GitHub token with Contents: read & write on ' + REPO + '.\n'
      + 'Create one at github.com → Settings → Developer settings → Fine-grained tokens (only this repository).\n'
      + 'It stays in this browser only and is sent only to api.github.com.';
    var t = window.prompt(text, '');
    if (t == null) return Promise.resolve(false);
    t = t.trim();
    if (!t) return Promise.resolve(false);
    return whoami(t).then(function (login) {
      if (!login) { window.alert('GitHub did not accept that token.'); return false; }
      mem.token = t; mem.login = login; ls.set(KEY, t); ls.set(KEY_LOGIN, login); resetInstances(); paint();
      return true;
    });
  }
  function disconnect() {
    mem.token = ''; mem.login = ''; ls.set(KEY, ''); ls.set(KEY_LOGIN, ''); resetInstances(); paint();
  }

  // ---- den lilla nyckelknappen nere till vänster.
  var badge = null;
  function paint() {
    if (!badge) return;
    badge.textContent = mem.login ? '🔑 ' + mem.login : '🔑 Connect GitHub';
    badge.title = mem.login
      ? 'Writes to the list go to GitHub as ' + mem.login + '. Click to disconnect.'
      : 'Reading works for everyone. To press buttons (medals, yes/no, replies …) connect your GitHub token.';
    badge.setAttribute('data-on', mem.login ? '1' : '0');
  }
  function mountBadge() {
    if (badge || !document.body) return;
    var css = document.createElement('style');
    css.textContent = '#wl-gh-badge{position:fixed;left:10px;bottom:10px;z-index:9999;font:12px/1 system-ui,sans-serif;padding:6px 9px;border-radius:999px;border:1px solid rgba(127,127,127,.45);background:rgba(255,255,255,.85);color:#333;cursor:pointer;backdrop-filter:blur(4px);opacity:.75}#wl-gh-badge:hover{opacity:1}#wl-gh-badge[data-on="1"]{border-color:rgba(46,160,67,.7)}@media(prefers-color-scheme:dark){#wl-gh-badge{background:rgba(20,20,24,.85);color:#ddd}}html[data-theme="dark"] #wl-gh-badge{background:rgba(20,20,24,.85);color:#ddd}';
    document.head.appendChild(css);
    badge = document.createElement('button');
    badge.id = 'wl-gh-badge'; badge.type = 'button';
    badge.addEventListener('click', function () {
      if (mem.login) { if (window.confirm('Disconnect GitHub (' + mem.login + ') from this browser?')) disconnect(); }
      else connect();
    });
    document.body.appendChild(badge);
    paint();
  }
  if (document.body) mountBadge(); else document.addEventListener('DOMContentLoaded', mountBadge);

  // ---- själva fångsten: allt som ser ut som /api/<namn> körs här.
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : ((input && input.url) || '');
    var m = /^(?:https?:\/\/[^/]+)?\/api\/([a-z]+)\/?(?:\?([^#]*))?$/.exec(url);
    if (!m) return realFetch(input, init);
    init = init || {};
    var name = m[1];
    var method = String(init.method || (input && input.method) || 'GET').toUpperCase();
    var query = {};
    if (m[2]) m[2].split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); });
    var go = function () {
      if (name === 'state' && method === 'GET') return stateCall();
      return runHandler(name, method, method === 'GET' ? {} : parseBody(init), query);
    };
    var p = (method !== 'GET' && !mem.token) ? connect('write').then(function (ok) { return ok ? go() : jsonResponse({ ok: false, error: 'Not connected to GitHub' }, 401); }) : go();
    return p.catch(function (e) { return jsonResponse({ ok: false, error: String(e && e.message || e) }, 500); });
  };

  window.WL_GH = {
    repo: REPO, branch: BRANCH,
    connect: connect, disconnect: disconnect,
    login: function () { return mem.login; },
    connected: function () { return !!mem.token; },
    raw: RAW,
  };
})();
