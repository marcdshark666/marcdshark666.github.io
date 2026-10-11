// api-bundle.js — genererad av `node worklist.js build` ur api/*.js. Ändra i api/, inte här.
// Hanterarna körs i webbläsaren sedan flytten till GitHub Pages (2026-09-17); se wl-github.js.
window.WL_API = window.WL_API || {};
window.WL_API["delning"] = function (module, exports, process, Buffer, fetch, console, require) {
// Delningsläget per projekt — den orange/gröna/lila remsan på Merged (#384).
//
// Marc 2026-09-16: "he can request access and then it will send me a message on
// the worklist light up orange and when it's accessed its green and when fully
// merged between computers ita purple and moved to the center of the screen and
// the shared quiz runner should then be only purple when it's connected to
// zlotys computer and by the time ita orange because he has been sent the share".
//
// Tre lägen, i den ordning de händer:
//   orange  delningen är SKICKAD men inte kvitterad — Złoty har fått länken,
//           eller har själv bett om access och Marc har fått ett meddelande
//   gron    Złoty har öppnat den och kommit in (access is accessed)
//   lila    hopkopplat på riktigt: hans dator kör projektet genom nodbryggan.
//           Ett lila projekt flyttas till mittkolumnen på Merged.
//   ''      inte delat alls
//
// Lagras som projects/delning.json i det privata GitHub-repot (GH_DATA_REPO),
// samma mönster som api/tillstand.js och api/ko.js. Datorn läser filen i sitt
// bevakningsvarv (worklist.js delningVarv) och skickar Telegram till Marc när
// någon bett om access — sidan kan inte nå datorn själv.
//
//   GET  → { delning: { "<projekt>": {lage, at, av, begart, logg[]} }, uppdaterad }
//   POST { name, lage }            → sätter läget ('' nollställer)
//   POST { name, begar: 'zloty' }  → begär access; läget blir orange och datorn
//                                    skickar meddelandet till Marc nästa varv
//
// Ingen inloggning: sidan är noindex, och ett läge är ofarlig data — det säger
// bara hur långt hopkopplingen kommit. Inga nycklar, inga pengar, ingen access
// delas ut här: GitHub-behörigheten ger Marc för hand på GitHub.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'projects/delning.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const LAGEN = new Set(['orange', 'gron', 'lila']);
const VEM = new Set(['marc', 'zloty']);
const MAX_PROJEKT = 400;   // en delningslista, inte ett arkiv
const MAX_LOGG = 20;       // per projekt: de senaste stegen, inte hela historien

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: { delning: {}, uppdaterad: null }, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  let data = {};
  try { data = JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'); } catch { data = {}; }
  if (!data.delning || typeof data.delning !== 'object' || Array.isArray(data.delning)) data.delning = {};
  return { data: { delning: data.delning, uppdaterad: data.uppdaterad || null }, sha: j.sha };
}
async function write(data, sha) {
  const body = { message: `delning: ${new Date().toISOString()}`, content: Buffer.from(JSON.stringify(data, null, 2) + '\n', 'utf8').toString('base64'), branch: 'main' };
  if (sha) body.sha = sha;
  const r = await gh('PUT', body);
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') { const { data } = await read(); return res.status(200).json(data); }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let b = req.body;
    if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = null; } }
    if (!b || typeof b !== 'object') return res.status(400).json({ error: 'Missing JSON body' });

    const name = String(b.name || '').trim().slice(0, 80);
    if (!name || !/^[\w .&()+-]+$/u.test(name)) return res.status(400).json({ error: 'Invalid project name' });

    const { data, sha } = await read();
    const nu = new Date().toISOString();
    const post = data.delning[name] && typeof data.delning[name] === 'object' ? data.delning[name] : {};
    if (!Array.isArray(post.logg)) post.logg = [];

    if (b.begar !== undefined) {
      // Złoty ber om access. Läget går till orange direkt — begäran ÄR den
      // skickade delningen — och `begart.notis` står kvar tills datorn skickat
      // meddelandet till Marc, så en begäran aldrig faller mellan stolarna.
      const av = String(b.begar || '').toLowerCase();
      if (!VEM.has(av)) return res.status(400).json({ error: 'begar must be marc or zloty' });
      post.lage = post.lage === 'lila' || post.lage === 'gron' ? post.lage : 'orange';
      post.begart = { av, at: nu, notis: false, text: String(b.text || '').trim().slice(0, 300) || null };
      post.at = nu;
      post.logg.push({ at: nu, lage: post.lage, av, vad: 'asked for access' });
    } else {
      const lage = b.lage === '' || b.lage === null ? '' : String(b.lage || '');
      if (lage && !LAGEN.has(lage)) return res.status(400).json({ error: 'lage must be orange, gron, lila or empty' });
      const av = VEM.has(String(b.av || '').toLowerCase()) ? String(b.av).toLowerCase() : 'marc';
      post.lage = lage;
      post.at = nu;
      post.av = av;
      // Kvitterat läge betyder att begäran är besvarad — annars hade datorn
      // fortsatt påminna om en access Marc redan gett.
      if (post.begart && lage && lage !== 'orange') post.begart.notis = true;
      post.logg.push({ at: nu, lage: lage || 'none', av, vad: 'set level' });
    }
    post.logg = post.logg.slice(-MAX_LOGG);
    if (!post.lage && !post.begart) delete data.delning[name];
    else data.delning[name] = post;

    if (Object.keys(data.delning).length > MAX_PROJEKT) return res.status(429).json({ error: 'Too many projects stored' });
    data.uppdaterad = nu;
    await write(data, sha);
    return res.status(200).json(data);
  } catch (e) {
    console.error('delning error', e);
    return res.status(500).json({ error: e.message || 'Serverfel' });
  }
};

};
window.WL_API["ko"] = function (module, exports, process, Buffer, fetch, console, require) {
// Köordningen — pilarna under varje kort på The Work List (#336).
//
// Marc 2026-09-17: "Fix so that you can move up queued tasks up with a up or
// down arrow with 1 step and most up and most down button as well on all tasks
// available even on those in progress."
//
// Ordningen är EN linjal, inte en lista som numreras om: varje uppdrag har ett
// tal (`rang`) och lägst tal går först. Talet är en *effektiv ankomsttid* i
// millisekunder — samma skala som `received` — så ett nytt uppdrag sorterar in
// sig själv utan att någon rör de andra. Sidan räknar fram talet (mitt emellan
// grannarnas) och skickar det hit; datorn (worklist.js koVarv) skriver det på
// uppdraget vid nästa bevakning, och då tar händerna korten i den ordningen.
//
// Att sidan räknar talet och inte servern är med flit: servern har ingen kopia
// av kön, men webbläsaren har hela den vy sidan ritas av. Marc ser ordningen
// framför sig när han trycker — det är den ordningen som ska gälla, inte en
// ordning en funktion i molnet gissar sig till.
//
//   GET  → { ordning: { "<uppdragId>": {rang, flytt, at, fran, synkad, atgard} } }
//   POST { id, rang, flytt }   flytt = 'upp' | 'ner' | 'topp' | 'botten' (bara till loggen)
//
// En post per uppdrag, sista trycket gäller: flyttar Marc samma kort fem gånger
// ska datorn göra fem flyttar i rad, inte fem gamla beslut på fem bevakningar.
// Ingen inloggning: sidan är noindex och en köplats är ofarlig data — samma
// avvägning som prioriteterna, rekommendationerna och svaren. Ordningen kan
// bara sättas på ett uppdrag som redan finns (datorn kastar okända id), så en
// främmande POST kan inte trolla fram arbete ur tomma intet.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'worklist/ko.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const GRANS = 1e15;          // rimlighetsspärr: talen ligger kring 1,7e12 (ms sedan 1970)
const MAX_POSTER = 400;      // en flyttlista, inte ett arkiv
const FLYTTAR = new Set(['upp', 'ner', 'topp', 'botten']);

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: { ordning: {} }, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  let data;
  try { data = JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'); } catch { data = {}; }
  if (!data.ordning || typeof data.ordning !== 'object' || Array.isArray(data.ordning)) data.ordning = {};
  return { data, sha: j.sha };
}
/** Avbockade flyttar som datorn redan gjort städas bort när listan blir lång —
 *  äldst först, och aldrig något som väntar på att bli verkställt. */
function stada(ordning) {
  const nycklar = Object.keys(ordning);
  if (nycklar.length <= MAX_POSTER) return;
  nycklar
    .filter((k) => ordning[k] && ordning[k].synkad)
    .sort((a, b) => String(ordning[a].at || '').localeCompare(String(ordning[b].at || '')))
    .slice(0, nycklar.length - MAX_POSTER)
    .forEach((k) => { delete ordning[k]; });
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') { const { data } = await read(); return res.status(200).json({ ordning: data.ordning }); }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const id = String(body.id == null ? '' : body.id).trim();
    const rang = Number(body.rang);
    const flytt = body.flytt == null ? null : String(body.flytt);
    if (!/^\d{1,7}$/.test(id)) return res.status(400).json({ error: 'Invalid task' });
    if (!Number.isFinite(rang) || Math.abs(rang) > GRANS) return res.status(400).json({ error: 'Invalid rank' });
    if (flytt !== null && !FLYTTAR.has(flytt)) return res.status(400).json({ error: 'Invalid move' });

    // Read-modify-write med ETT återförsök vid sha-krock (409), som prio.js och
    // svar.js: två snabba tryck läser annars samma sha och det andra tappas.
    for (let attempt = 0; attempt < 2; attempt++) {
      const cur = await read();
      cur.data.ordning[id] = { rang, flytt, at: new Date().toISOString(), fran: 'sajten', synkad: false, atgard: null };
      stada(cur.data.ordning);
      const payload = {
        message: `köordning #${id}${flytt ? ` (${flytt})` : ''}`,
        branch: 'main',
        content: Buffer.from(JSON.stringify(cur.data, null, 1)).toString('base64'),
      };
      if (cur.sha) payload.sha = cur.sha;
      const w = await gh('PUT', payload);
      if (w.ok) return res.status(200).json({ ok: true, ordning: cur.data.ordning });
      if (w.status !== 409 || attempt === 1) return res.status(502).json({ error: `GitHub ${w.status}` });
    }
  } catch (e) {
    console.error('ko error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

};
window.WL_API["prio"] = function (module, exports, process, Buffer, fetch, console, require) {
// Prioritet per projekt (platina / guld / silver / brons / ingen) för Project Management.
// Rutinerna (Marc 2026-09-16) graderas i samma fil men på sin egen skala:
// diamant (bäst) / guldstjärna (mitten) / trofé (lägst). Nyckeln är rutin.<slug>.
// Lagras som projects/priorities.json i det privata GitHub-repot (GH_DATA_REPO),
// samma mönster som packing-road/api/sync.js. GET → {prio:{name:'platinum'|'gold'|'silver'|'bronze'|'diamond'|'star'|'trophy'}}
// POST {name, prio} → sparar. Ingen inloggning: sidan är noindex och prioritet är ofarlig data.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'projects/priorities.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const VALID = new Set(['platinum', 'gold', 'silver', 'bronze', 'diamond', 'star', 'trophy', 'none']);

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: {}, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  return { data: JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'), sha: j.sha };
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') { const { data } = await read(); return res.status(200).json({ prio: data }); }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const name = String(body.name || '').trim();
    const prio = String(body.prio || 'none');
    if (!/^[a-z0-9._-]{1,80}$/i.test(name) || !VALID.has(prio)) return res.status(400).json({ error: 'Invalid' });
    // Read-modify-write med ETT återförsök vid sha-krock (409): två snabba klick
    // på olika projekt läser samma sha och den andra PUT:en får annars 409 och
    // klicket skulle tappas. Vid krock läser vi om och skriver på färsk sha.
    let data;
    for (let attempt = 0; attempt < 2; attempt++) {
      const cur = await read();
      data = cur.data;
      if (prio === 'none') delete data[name]; else data[name] = prio;
      const payload = { message: `prio ${name} → ${prio}`, branch: 'main', content: Buffer.from(JSON.stringify(data, null, 1)).toString('base64') };
      if (cur.sha) payload.sha = cur.sha;
      const w = await gh('PUT', payload);
      if (w.ok) return res.status(200).json({ ok: true, prio: data });
      if (w.status !== 409 || attempt === 1) return res.status(502).json({ error: `GitHub ${w.status}` });
    }
  } catch (e) {
    console.error('prio error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

};
window.WL_API["rek"] = function (module, exports, process, Buffer, fetch, console, require) {
// Rekommendationer — förslagen som arbetarna annars hade skickat i Telegram.
// Marc 2026-09-07: "rekommendationerna ska skrivas på listan med graderingarna
// nedanför sidorna där, med Implementera / Kasta bort / Gör senare."
//
// Lagras som projects/recommendations.json i det privata GitHub-repot
// (GH_DATA_REPO) — samma mönster som api/prio.js. Datorn skriver nya förslag med
// `node worklist.js rek`, sidan skriver bara beslutet.
//
//   GET  → { rek: [ {id, projekt, rutin, titel, text, grad, nytta, insats, skapad, beslut, beslutAt, uppdragId, pusha, meddelanden} ] }
//   POST { id, beslut: 'implementera' | 'bort' | 'senare' | 'oppen' | 'pusha' } → sparar beslutet.
//   POST { id, meddelande: '...' } → lägger ett meddelande från Marc på förslaget (med eller utan beslut).
//        Marc 2026-09-16: "man ska indirekt också kunna skriva meddelanden på feedback delen eller ja eller nej".
//        Datorn (worklist.js) tar med meddelandena i uppdragstexten, och skriver dem som steg på ett
//        uppdrag som redan finns — så ett svar här når handen som jobbar, utan omvägen via Telegram.
//   POST { id, radera: true }  → tar bort förslaget från sidan. Marc 2026-09-16 (#317):
//        "Jag vill också ha ta bort denna uppdatering eller rekommendation fixa så att det
//        finns." Raden ligger kvar i filen med `raderad: true` — som en gravsten, så att
//        kontrollerna inte skriver tillbaka samma förslag i morgon. `radera: false` ångrar.
//   POST { alla: true, beslut, projekt? } → samma beslut på ALLA obesvarade förslag (Marc 2026-09-16:
//        "pusha nu-knapp av alla projekt och rutiners rekommendationer"), valfritt bara ett projekt/en rutin.
//
// 'pusha' = Ja + gå före i kön: beslut blir 'implementera' med pusha:true. Datorn
// (worklist.js rekVarv) gör ett uppdrag av det som läggs FÖRST bland de öppna, och
// livebevakaren tittar efter pushade förslag varje minut i stället för var tionde.
//
// Ingen inloggning: sidan är noindex och ett beslut är ofarlig data — samma
// avvägning som prioriteterna. Nya förslag går INTE att skapa härifrån, så en
// främmande POST kan aldrig lägga något i arbetskön.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'projects/recommendations.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const VALID = new Set(['implementera', 'bort', 'senare', 'oppen', 'pusha']);

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: { rek: [] }, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  let data;
  try { data = JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'); } catch { data = {}; }
  if (!Array.isArray(data.rek)) data.rek = [];
  return { data, sha: j.sha };
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') { const { data } = await read(); return res.status(200).json({ rek: data.rek }); }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const id = String(body.id || '').trim();
    const beslut = String(body.beslut || '');
    const alla = body.alla === true;
    const projekt = body.projekt ? String(body.projekt).trim().slice(0, 80) : null;
    // Ett meddelande kan komma ensamt (bara skriva) eller tillsammans med ett Ja/Nej.
    const meddelande = body.meddelande === undefined ? null : String(body.meddelande || '').trim().slice(0, 800);
    // Papperskorgen (#317) är ingen åsikt om förslaget utan ett "bort från sidan",
    // och kommer därför ensam — utan beslut och utan meddelande.
    const radera = body.radera === undefined ? null : body.radera === true;
    if (meddelande !== null && !meddelande) return res.status(400).json({ error: 'Empty message' });
    if (radera !== null && (alla || meddelande !== null || beslut)) return res.status(400).json({ error: 'Removal is done on its own, for one suggestion' });
    if (radera === null && meddelande === null && !VALID.has(beslut)) return res.status(400).json({ error: 'Invalid' });
    if (meddelande !== null && beslut && !VALID.has(beslut)) return res.status(400).json({ error: 'Invalid' });
    if (meddelande !== null && alla) return res.status(400).json({ error: 'A message is written on one suggestion at a time' });
    if (!alla && !/^[a-z0-9._-]{1,60}$/i.test(id)) return res.status(400).json({ error: 'Invalid' });
    const satt = (rad) => {
      rad.beslut = beslut === 'oppen' ? null : beslut === 'pusha' ? 'implementera' : beslut;
      rad.beslutAt = beslut === 'oppen' ? null : new Date().toISOString();
      rad.pusha = beslut === 'pusha';
      rad.svarFran = beslut === 'oppen' ? null : 'sajten';
    };
    // Read-modify-write med ETT återförsök vid sha-krock (409), som prio.js:
    // två snabba klick på olika förslag läser annars samma sha och det andra tappas.
    for (let attempt = 0; attempt < 2; attempt++) {
      const cur = await read();
      let msg;
      if (alla) {
        // Massbeslutet rör bara det som är obesvarat — ett Nej Marc redan tryckt ska inte bli ett Ja.
        const traff = cur.data.rek.filter((r) => !r.beslut && !r.raderad && (!projekt || r.projekt === projekt));
        if (!traff.length) return res.status(200).json({ ok: true, antal: 0, rek: cur.data.rek });
        traff.forEach(satt);
        msg = `rekommendationer: ${traff.length} obesvarade → ${beslut}${projekt ? ` (${projekt})` : ''}`;
      } else {
        const rad = cur.data.rek.find((r) => String(r.id) === id);
        if (!rad) return res.status(404).json({ error: 'Unknown recommendation' });
        if (radera !== null) {
          if (radera) { rad.raderad = true; rad.raderadAt = new Date().toISOString(); }
          else { delete rad.raderad; delete rad.raderadAt; }
        }
        if (meddelande) {
          if (!Array.isArray(rad.meddelanden)) rad.meddelanden = [];
          // Taket håller filen liten — ett förslag är en dialog, inte en chattlogg.
          if (rad.meddelanden.length >= 30) rad.meddelanden.shift();
          rad.meddelanden.push({ text: meddelande, at: new Date().toISOString(), fran: 'sajten', synkad: false });
        }
        if (beslut) satt(rad);
        msg = radera !== null
          ? `rekommendation ${id} → ${radera ? 'borttagen' : 'återställd'}`
          : meddelande
            ? `rekommendation ${id}: meddelande från Marc${beslut ? ` + ${beslut}` : ''}`
            : `rekommendation ${id} → ${beslut}`;
      }
      const payload = { message: msg, branch: 'main', content: Buffer.from(JSON.stringify(cur.data, null, 1)).toString('base64') };
      if (cur.sha) payload.sha = cur.sha;
      const w = await gh('PUT', payload);
      if (w.ok) return res.status(200).json({ ok: true, antal: alla ? cur.data.rek.filter((r) => r.svarFran === 'sajten' && r.beslutAt && Date.now() - Date.parse(r.beslutAt) < 5000).length : 1, rek: cur.data.rek });
      if (w.status !== 409 || attempt === 1) return res.status(502).json({ error: `GitHub ${w.status}` });
    }
  } catch (e) {
    console.error('rek error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

};
window.WL_API["rost"] = function (module, exports, process, Buffer, fetch, console, require) {
// Röstagenten på framsidan (#311). Marc 2026-09-16: "en knapp som man kan prata
// med The Worklist högst upp som en AI-agent som har en röst med en glob ...
// och man kan starta den och fråga och begära också och koordinera saker".
//
// Frågorna besvarar sidan själv ur livevyn — ingen modell, inga API-kostnader.
// Det som är en BEGÄRAN ("lägg till uppdrag ...") behöver däremot nå datorn, och
// datorn läser bara det privata GitHub-repot. Därför den här endpointen: den
// lägger raden i worklist/voice-inbox.json, och `worklist.js rost` (som
// livebevakaren kör varje minut) gör ett riktigt uppdrag av den och skriver
// tillbaka uppdragsnumret — som sidan sedan läser upp.
//
//   GET  → { rader: [ {id, text, skapad, uppdragId, status} ] }   (senaste 20)
//   POST { text, vad? } → { ok, id, rad }
//
// Ingen inloggning — samma avvägning som api/rek.js meddelanden: sidan är
// noindex och en rad här blir ett uppdrag på Marcs egen lista, aldrig något som
// körs automatiskt utan att en hand läser texten först. Till skillnad från rek.js
// KAN den här skapa nytt, så den är stryptad hårt: högst 12 rader i timmen och
// 40 per dygn, 600 tecken per rad. Blir det missbruk är nästa steg en nyckel i
// adressen (?k=), samma mönster som Skrivbordet.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'worklist/voice-inbox.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const MAX_TIMME = 12;
const MAX_DYGN = 40;
const MAX_TECKEN = 600;
const BEHALL = 200;          // rader vi sparar i filen; äldre faller bort

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: { rader: [] }, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  let data;
  try { data = JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'); } catch { data = {}; }
  if (!Array.isArray(data.rader)) data.rader = [];
  return { data, sha: j.sha };
}
const publik = (r) => ({ id: r.id, text: r.text, skapad: r.skapad, uppdragId: r.uppdragId || null, status: r.uppdragId ? 'task' : 'waiting' });

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') {
      const { data } = await read();
      return res.status(200).json({ rader: data.rader.slice(-20).map(publik) });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const text = String(body.text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_TECKEN);
    if (text.length < 3) return res.status(400).json({ error: 'Say something longer than that.' });

    // Read-modify-write med ETT återförsök vid sha-krock, som api/prio.js.
    for (let forsok = 0; forsok < 2; forsok++) {
      const cur = await read();
      const nu = Date.now();
      const senasteTimmen = cur.data.rader.filter((r) => nu - (Date.parse(r.skapad) || 0) < 3600e3).length;
      const senasteDygnet = cur.data.rader.filter((r) => nu - (Date.parse(r.skapad) || 0) < 86400e3).length;
      if (senasteTimmen >= MAX_TIMME || senasteDygnet >= MAX_DYGN) {
        return res.status(429).json({ error: `Too many voice tasks in a short time (max ${MAX_TIMME}/hour, ${MAX_DYGN}/day). Write in Telegram instead.` });
      }
      // Samma mening två gånger inom en minut = dubbelklick eller ett eko i
      // röstigenkänningen, inte två uppdrag.
      const dubblett = cur.data.rader.find((r) => r.text === text && nu - (Date.parse(r.skapad) || 0) < 60e3);
      if (dubblett) return res.status(200).json({ ok: true, id: dubblett.id, rad: publik(dubblett), dubblett: true });

      const rad = { id: `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, text, vad: String(body.vad || 'uppdrag').slice(0, 24), skapad: new Date().toISOString(), uppdragId: null, plockad: null };
      cur.data.rader.push(rad);
      if (cur.data.rader.length > BEHALL) cur.data.rader = cur.data.rader.slice(-BEHALL);
      const payload = { message: `röst: ${text.slice(0, 60)}`, branch: 'main', content: Buffer.from(JSON.stringify(cur.data, null, 1)).toString('base64') };
      if (cur.sha) payload.sha = cur.sha;
      const w = await gh('PUT', payload);
      if (w.ok) return res.status(200).json({ ok: true, id: rad.id, rad: publik(rad) });
      if (w.status !== 409 || forsok === 1) return res.status(502).json({ error: `GitHub ${w.status}` });
    }
  } catch (e) {
    console.error('rost error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

};
window.WL_API["state"] = function (module, exports, process, Buffer, fetch, console, require) {
// Livevyn för The Work List. Sidan är statisk (index.html bär en kopia av datan
// vid bygget), men datorn skjuter upp en färsk, maskerad vy till det privata
// GitHub-repot (GH_DATA_REPO → worklist/state.json) varje gång något ändras —
// ett nytt uppdrag i Telegram-kön, ett steg i tidslinjen, ett klart uppdrag.
// Sidan hämtar den här endpointen var tionde sekund och ritar om sig utan
// omladdning. Det kostar ingen Vercel-deploy (de har ett dagligt tak) och gör
// att listan syns i mobilen inom sekunder efter att Marc skickat något.
//
// GET → { ok, built, updatedAt, state }   state = samma vy som index.html byggs av.
// Ingen inloggning: sidan är noindex och vyn är redan maskerad (samma redact
// som bygget) — råfilen worklist.json lämnar aldrig datorn.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const FILE = 'worklist/state.json';
const API = `https://api.github.com/repos/${REPO}/contents/${FILE}`;

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!TOKEN || !REPO) return res.status(503).json({ ok: false, error: 'Storage not connected' });
  try {
    // OBS: 'application/vnd.github.raw' och inte '+json'. Contents-API:t lagger
    // bara med base64-innehallet for filer UNDER 1 MB — over det svarar det
    // 200 med encoding:"none" och content:"" , och sidan fick "Trasig
    // state.json" fast filen var hel (2026-09-16: vyn passerade 1,13 MB och
    // livevyn slutade uppdatera sig helt). Rastypen har ingen sadan grans.
    const r = await fetch(`${API}?ref=main`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/vnd.github.raw',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'the-work-list',
      },
    });
    // Ännu ingen state.json (första gången, eller repot nyss tömt): sidan
    // behåller det den byggdes med i stället för att blinka tomt.
    if (r.status === 404) return res.status(200).json({ ok: true, state: null, reason: 'no state yet' });
    if (!r.ok) return res.status(502).json({ ok: false, error: `GitHub ${r.status}` });
    const rå = await r.text();
    let state;
    try {
      state = JSON.parse(rå);
      // Svarade GitHub anda med metadata (annan Accept, en proxy emellan) kanns
      // det pa content+encoding — da ligger vyn i base64 som forr.
      if (state && typeof state === 'object' && typeof state.content === 'string' && state.encoding) {
        state = JSON.parse(Buffer.from(state.content, 'base64').toString('utf8'));
      }
    } catch { return res.status(502).json({ ok: false, error: 'Broken state.json' }); }
    return res.status(200).json({ ok: true, built: state && state.built, updatedAt: state && state.pushed, state });
  } catch (e) {
    console.error('state error', e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};

};
window.WL_API["svar"] = function (module, exports, process, Buffer, fetch, console, require) {
// Svar på uppdragen — direkt på sajten, som en trad i Telegram fast på webben.
//
// Marc 2026-09-16 (#310): "Under varje hinderbit på the work list sidan vill jag
// att man ska kunna också göra som ett svar under ja och nej eller inte. Och sen
// vill jag att man ska kunna göra som ett svar underligt som i telegram, fast
// man ska kunna göra det direkt på hemsidan. […] Även om de är färdiga att klara
// ska det finnas ett svar tablå nedanför varje task som man kan göra tillägg och
// referera till de olika sakerna. Till exempel de som är hinder pausade, då ska
// man kunna skriva nedanför dem så att man kan komplettera."
//
// Lagras som worklist/svar.json i det privata GitHub-repot (GH_DATA_REPO) —
// samma mönster som api/rek.js och api/prio.js. Datorn (worklist.js svarVarv)
// läser obehandlade svar varje bevakning och gör något av dem:
//   · uppdrag som pågår/väntar → svaret skrivs som ett steg, handen ser det
//   · uppdrag som är klart/hinder → svaret blir ett NYTT uppdrag som hänvisar
//     till det gamla, för ingen hand läser ett avslutat uppdrag
//   · Ja på ett hinder eller en paus → uppdraget tas upp igen, först i kön
//   · Nej → lagt åt sidan, ingen mer åtgärd
//
//   GET  → { svar: { "<uppdragId>": [ {id, text, ja, at, fran, synkad, atgard} ] } }
//   POST { id, text }                    → skriver ett svar
//   POST { id, ja: 'ja'|'nej' }          → svarar Ja/Nej på ett hinder eller en paus
//   POST { id, ja: 'bort' }              → tar bort uppdraget från listan (Marc 2026-09-16, #317:
//        "Jag vill gärna ha en ta bort knapp för de här sakerna som tillägg nedanför inte bara
//        ja eller nej"). Datorn sätter status 'deleted' — kortet försvinner från sajten och
//        ingen hand kan plocka det, men raden ligger kvar i worklist.json så inget går förlorat.
//   POST { id, ja, text }                → båda i ett
//   POST { id, ja: 'tar'|'avstar', fran: 'shared' }  → Ja/Nej på ERBJUDANDET (Marc 2026-09-17):
//        ett uppdrag på Złotys sida är ett erbjudande med en timmes frist. 'tar' = han tar
//        det, 'avstar' = han lämnar det och PC 1 gör det direkt. Inget svar inom fristen
//        ger samma flytt automatiskt (worklist.js erbjudandeVarv). `fran` säger var
//        knappen satt ('shared' = den delade sidan); datorn skriver det i steget.
//
// Ingen inloggning: sidan är noindex och ett svar är ofarlig data — samma
// avvägning som prioriteterna och rekommendationerna. Ett svar kan bara läggas
// på ett uppdrag som redan finns (datorn kastar svar på okända id), så en
// främmande POST kan inte trolla fram arbete ur tomma intet.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'worklist/svar.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const MAX_TEXT = 1200;
const MAX_PER_UPPDRAG = 40;   // en trad, inte en chattlogg

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: { svar: {} }, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  let data;
  try { data = JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'); } catch { data = {}; }
  if (!data.svar || typeof data.svar !== 'object' || Array.isArray(data.svar)) data.svar = {};
  return { data, sha: j.sha };
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') { const { data } = await read(); return res.status(200).json({ svar: data.svar }); }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const id = String(body.id == null ? '' : body.id).trim();
    const text = String(body.text || '').trim().slice(0, MAX_TEXT);
    const ja = body.ja === undefined || body.ja === null || body.ja === '' ? null : String(body.ja);
    const fran = /^[a-z0-9-]{1,24}$/.test(String(body.fran || '')) ? String(body.fran) : 'sajten';
    if (!/^\d{1,7}$/.test(id)) return res.status(400).json({ error: 'Invalid task' });
    if (ja !== null && !['ja', 'nej', 'bort', 'tar', 'avstar'].includes(ja)) return res.status(400).json({ error: 'Invalid answer' });
    if (!text && ja === null) return res.status(400).json({ error: 'Empty answer' });

    // Read-modify-write med ETT återförsök vid sha-krock (409), som prio.js och
    // rek.js: två snabba svar på olika uppdrag läser annars samma sha och det
    // andra skulle tappas.
    for (let attempt = 0; attempt < 2; attempt++) {
      const cur = await read();
      if (!Array.isArray(cur.data.svar[id])) cur.data.svar[id] = [];
      const trad = cur.data.svar[id];
      if (trad.length >= MAX_PER_UPPDRAG) trad.shift();
      const rad = {
        id: `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        text: text || null,
        ja,
        at: new Date().toISOString(),
        fran,
        synkad: false,
        atgard: null,      // fylls av datorn: 'steg' | 'uppdrag #N' | 'upptaget' | 'bortlagt' | 'borttaget' | 'accepted …' | 'handed to …'
      };
      trad.push(rad);
      const payload = {
        message: `svar på uppdrag #${id}${ja ? ` (${ja})` : ''}`,
        branch: 'main',
        content: Buffer.from(JSON.stringify(cur.data, null, 1)).toString('base64'),
      };
      if (cur.sha) payload.sha = cur.sha;
      const w = await gh('PUT', payload);
      if (w.ok) return res.status(200).json({ ok: true, rad, svar: cur.data.svar });
      if (w.status !== 409 || attempt === 1) return res.status(502).json({ error: `GitHub ${w.status}` });
    }
  } catch (e) {
    console.error('svar error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

};
window.WL_API["tillstand"] = function (module, exports, process, Buffer, fetch, console, require) {
// Tillståndsnivå per projekt (Marc 2026-09-15): stopp / fraga / fri.
//   stopp  🔴 ingenting utan Marcs godkännande i Telegram
//   fraga  🟡 stora ändringar (länkar, publicering, deploy, radering) kräver godkännande
//   fri    🟢 fritt flöde
// Lagras som projects/tillstand.json i det privata GitHub-repot (GH_DATA_REPO),
// samma mönster som api/prio.js. Datorn hämtar filen med `node worklist.js
// tillstand --sync` till APP ideas/.agents/tillstand.json, som spärrarna läser
// (gadget-drop/pipeline/tillstand.py, ~/.claude/hooks/telegram-godkann.js).
// GET → { niva:{name:'stopp'|'fraga'|'fri'}, standard, uppdaterad }
// POST { name, niva } → sparar en rad;  POST { standard } → sparar standardnivån.
// Ingen inloggning: sidan är noindex, och en nivå kan bara STRAMA ÅT eller
// släppa Marcs egna jobb — inga hemligheter, inga pengar.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'projects/tillstand.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const VALID = new Set(['stopp', 'fraga', 'fri']);

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: { niva: {}, standard: 'fri', uppdaterad: null }, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  let data = {};
  try { data = JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'); } catch { data = {}; }
  return { data: { niva: data.niva || {}, standard: VALID.has(data.standard) ? data.standard : 'fri', uppdaterad: data.uppdaterad || null }, sha: j.sha };
}
async function write(data, sha) {
  const body = { message: `tillstand: ${new Date().toISOString()}`, content: Buffer.from(JSON.stringify(data, null, 2) + '\n', 'utf8').toString('base64'), branch: 'main' };
  if (sha) body.sha = sha;
  const r = await gh('PUT', body);
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') { const { data } = await read(); return res.status(200).json(data); }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let b = req.body;
    if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = null; } }
    if (!b || typeof b !== 'object') return res.status(400).json({ error: 'Missing JSON body' });
    const { data, sha } = await read();
    if (b.standard !== undefined) {
      if (!VALID.has(b.standard)) return res.status(400).json({ error: 'standard must be stopp, fraga or fri' });
      data.standard = b.standard;
    }
    if (b.name !== undefined) {
      const name = String(b.name || '').trim().slice(0, 80);
      if (!name || !/^[\w .&()+-]+$/u.test(name)) return res.status(400).json({ error: 'Invalid project name' });
      if (!VALID.has(b.niva)) return res.status(400).json({ error: 'niva must be stopp, fraga or fri' });
      data.niva[name] = b.niva;
    }
    if (b.standard === undefined && b.name === undefined) return res.status(400).json({ error: 'Give name+niva or standard' });
    data.uppdaterad = new Date().toISOString();
    await write(data, sha);
    return res.status(200).json(data);
  } catch (e) {
    console.error('tillstand error', e);
    return res.status(500).json({ error: e.message || 'Serverfel' });
  }
};

};
window.WL_API["vack"] = function (module, exports, process, Buffer, fetch, console, require) {
// Väckningsknappen på vakthundskorten (#381). Marc 2026-09-17: "That I can
// activate them through a press and it will send the signal if they are sleeping
// also should be a choice".
//
// Mobilen når aldrig datorn direkt — den talar bara med Vercel. Trycket läggs
// därför som en rad i worklist/wake-requests.json i det privata GitHub-repot
// (GH_DATA_REPO), och `worklist.js vack --varv` (som bevakningen kör var 10:e
// minut) gör en riktig väckning av den och skriver tillbaka vad som hände:
//   · hunden lever men sover  → dess tick körs direkt
//   · hunden svarar inte      → starta-vakthund.sh, samma väg som Vakthund-Vakt
//
//   GET  → { rader: [ {id, n, skapad, utford, svar, status} ] }   (senaste 20)
//   POST { n } → { ok, id, rad }
//
// Ingen inloggning: samma avvägning som api/rost.js — sidan är noindex, och det
// enda en rad här kan åstadkomma är att Marcs egen vakthund vaknar på hans egen
// dator. Stryptad ändå: en väckning per hund och femminutersfönster, högst 20 i
// timmen, så en knapp som fastnar aldrig kan starta om åtta sessioner i loop.

const TOKEN = process.env.GH_DATA_TOKEN || '';
const REPO = process.env.GH_DATA_REPO || '';
const PATH = 'worklist/wake-requests.json';
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
const MAX_TIMME = 20;
const PER_HUND_MIN = 5;      // samma hund igen inom så här många minuter = samma tryck
const BEHALL = 100;

function gh(method, body) {
  const init = { method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'the-work-list', 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  return fetch(API + (method === 'GET' ? '?ref=main' : ''), init);
}
async function read() {
  const r = await gh('GET');
  if (r.status === 404) return { data: { rader: [] }, sha: null };
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const j = await r.json();
  let data;
  try { data = JSON.parse(Buffer.from(j.content || '', 'base64').toString('utf8') || '{}'); } catch { data = {}; }
  if (!Array.isArray(data.rader)) data.rader = [];
  return { data, sha: j.sha };
}
const publik = (r) => ({ id: r.id, n: r.n, skapad: r.skapad, utford: r.utford || null, svar: r.svar || null, status: r.utford ? 'done' : 'waiting' });

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN || !REPO) return res.status(503).json({ error: 'Storage not connected' });
  try {
    if (req.method === 'GET') {
      const { data } = await read();
      return res.status(200).json({ rader: data.rader.slice(-20).map(publik) });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const n = Number(body.n);
    if (!Number.isInteger(n) || n < 1 || n > 8) return res.status(400).json({ error: 'Watchdog 1-8 only' });

    // Read-modify-write med ETT återförsök vid sha-krock, som api/prio.js.
    for (let forsok = 0; forsok < 2; forsok++) {
      const cur = await read();
      const nu = Date.now();
      const senasteTimmen = cur.data.rader.filter((r) => nu - (Date.parse(r.skapad) || 0) < 3600e3).length;
      if (senasteTimmen >= MAX_TIMME) return res.status(429).json({ error: `Too many wake-ups in a short time (max ${MAX_TIMME}/hour).` });
      // Samma hund igen innan datorn hunnit plocka raden = dubbelklick, inte två väckningar.
      const pagaende = cur.data.rader.find((r) => r.n === n && nu - (Date.parse(r.skapad) || 0) < PER_HUND_MIN * 60e3);
      if (pagaende) return res.status(200).json({ ok: true, id: pagaende.id, rad: publik(pagaende), dubblett: true });

      const rad = { id: `w${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, n, skapad: new Date().toISOString(), utford: null, svar: null };
      cur.data.rader.push(rad);
      if (cur.data.rader.length > BEHALL) cur.data.rader = cur.data.rader.slice(-BEHALL);
      const payload = { message: `väck vakthund ${n}`, branch: 'main', content: Buffer.from(JSON.stringify(cur.data, null, 1)).toString('base64') };
      if (cur.sha) payload.sha = cur.sha;
      const w = await gh('PUT', payload);
      if (w.ok) return res.status(200).json({ ok: true, id: rad.id, rad: publik(rad) });
      if (w.status !== 409 || forsok === 1) return res.status(502).json({ error: `GitHub ${w.status}` });
    }
  } catch (e) {
    console.error('vack error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

};
