# The Work List — delat minne för Claude, Codex och Antigravity

_Skrivs av `the-work-list/worklist.js` (kommandona start/note/done/fail/paus och varje pass). Senast 17/10 00:01. Läs den här filen FÖRST när du tar ett pass på listan. Skriv inte i den för hand — kör kommandona så hamnar det här; fri rad: `node worklist.js minne "text" --nasta "…"`. Rå logg: `worklist-minne.jsonl` bredvid. Listan: https://marcdshark666.github.io_

## Rotan — vem kollar listan när (Stockholm-tid, fyra pass per AI och dygn)

| Klockslag | Steg | Händer (adresser) | Schemalagt jobb |
|---|---|---|---|
| 00:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 02:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 04:00 | Antigravity | Antigravity 201–208 (Antigravity subagenter, upp till 8 parallellt) | WorkList-Antigravity |
| 06:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 08:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 10:00 | Antigravity | Antigravity 201–208 (Antigravity subagenter, upp till 8 parallellt) | WorkList-Antigravity |
| 12:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 14:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 16:00 | Antigravity | Antigravity 201–208 (Antigravity subagenter, upp till 8 parallellt) | WorkList-Antigravity |
| 18:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 20:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 22:00 | Antigravity | Antigravity 201–208 (Antigravity subagenter, upp till 8 parallellt) | WorkList-Antigravity |

Turordningen är cyklisk (Claude → Codex → Antigravity → …): passets steg går först; kan det inte (utloggat, kvot slut, saknas) tar nästa över, så listan alltid betas av. Bevakningen `WorkList-Poll` (var 10:e min) går Claude först. Codex och Antigravity får koda, testa och commita lokalt — aldrig deploya, pusha eller betala (protokoll 4 och 8 i `.agents/PROTOKOLL.md`). Ett uppdrag som kräver deploy pausas med "väntar på deploy" och tas i Claudes nästa pass.

## Just nu

- Pass just nu: **Claude** · nästa pass: idag 02:00 (Codex)
- Listan: 0 öppna · 0 pausade · 0 pågår
- Claude: redo — last 15/10 13:22: klar
- Codex: redo — last 12/10 15:46: klar
- Antigravity: redo — last 12/10 15:55: klar

Kommandon: `node "E:\CHAT-RTX\CLAUDECODE GENERAL BRAIN\APP ideas\the-work-list\worklist.js" minne` (senaste raderna) · `minne --rota` · `stegen` · `status`

## Senaste händelserna (nyast först)

| När | Steg | Hand | # | Händelse | Vad | Nästa |
|---|---|---|---|---|---|---|
| 17/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-17-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 16/10 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-16-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 16/10 20:00 | Codex | schemat |  | pass-slut | pass 2026-10-16-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 16/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-16-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 16/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-16-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 16/10 14:00 | Codex | schemat |  | pass-slut | pass 2026-10-16-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 16/10 12:00 | Claude | schemat |  | pass-slut | pass 2026-10-16-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 16/10 10:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-16-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 16/10 08:00 | Codex | schemat |  | pass-slut | pass 2026-10-16-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 16/10 06:01 | Claude | schemat |  | pass-slut | pass 2026-10-16-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 16/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-16-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 16/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-16-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 16/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-16-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 15/10 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-15-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 15/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-15-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 15/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-15-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 15/10 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-15-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 15/10 14:00 | Codex | schemat |  | pass-slut | pass 2026-10-15-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 15/10 13:22 | Claude | bevakningen |  | pass-slut | pass 2026-10-15-1319 slut: 1 klara, 0 hinder, 0 kvar — Claude: klar | nästa pass 14:00 Codex |
| 15/10 13:22 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | steg-klart | Claude: klar (0 kvar) |  |
| 15/10 13:21 | Claude | Claude | #4485 | done | Utkastet till Zlatan Sibhash ligger klart i /vanner (Tailscale, port 5199). Inget skickat, Marc skickar själv. Antagande: ingen ändring behövdes. · filer: vanner/data/vanner.json |  |
| 15/10 13:21 | Claude | Claude | #4485 | start | Verifierar att utkastet till Zlatan finns i /vanner · projekt vanner |  |
| 15/10 13:21 | Claude | bevakningen |  | pass | pass 2026-10-15-1319 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 15/10 12:00 | Claude | schemat |  | pass-slut | pass 2026-10-15-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 15/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-15-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 15/10 08:00 | Codex | schemat |  | pass-slut | pass 2026-10-15-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 15/10 06:00 | Claude | schemat |  | pass-slut | pass 2026-10-15-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 15/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-15-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 15/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-15-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 15/10 00:00 | Claude | schemat |  | pass-slut | pass 2026-10-15-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 14/10 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-14-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 14/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-14-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 14/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-14-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 14/10 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-14-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 14/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-14-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 14/10 12:00 | Claude | schemat |  | pass-slut | pass 2026-10-14-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 14/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-14-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 14/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-14-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 14/10 06:00 | Claude | schemat |  | pass-slut | pass 2026-10-14-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 14/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-14-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 14/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-14-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 14/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-14-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 13/10 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-13-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 13/10 20:00 | Codex | schemat |  | pass-slut | pass 2026-10-13-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 13/10 18:01 | Claude | schemat |  | pass-slut | pass 2026-10-13-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 13/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-13-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 13/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-13-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 13/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-13-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 13/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-13-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 13/10 09:01 |  |  |  | not | Codex 2026-10-13: skrivskyddad kontroll via skyddad YouTube-fabrik av 173 kanda video-ID:n. Inga beskrivningar andrade sedan 2026-10-09. 15 direkta Amazon-taggavvikelser kvar i com/IT/CA/AE; inga publika andringar. Rapport state/codex-monitor-20261013.json. Lager har INTE kontrollerats i detta pass; kortlankar, exakt produkt/variant och fullstandig kallavstamning ar fortsatt ofullstandiga. gadget- | Prioritera kvarvarande ssstik-kallmatchning och livekontroll av exakta produkter, lager och omdirigeringar. Skyddade klipp far inte andras; ingen kontroll ska markeras helt klar. |
| 13/10 08:00 | Codex | schemat |  | pass-slut | pass 2026-10-13-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 13/10 06:00 | Claude | schemat |  | pass-slut | pass 2026-10-13-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 13/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-13-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 13/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-13-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 13/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-13-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 12/10 23:51 |  | Codex | #3847 | done |  |  |
| 12/10 22:59 |  | antigravity | #1748 | note | Boss-genomgang 12/10: reklamationen kraver foto med LOT (4/10 01:07) - ej synkat. Skicka fotot i Telegram. Privat halsodata, Vakthund 15/11 rutin. |  |
| 12/10 22:59 |  | Codex | #3847 | note | Boss-genomgang 12/10: vantar fortfarande pa att fotot (12/10 10:13) synkas via Syncthing eller skickas i Telegram. Ingen gissning av betalning. |  |
| 12/10 22:59 |  | Codex | #3489 | note | Boss-genomgang 12/10: Etsy-vakt 09:00 visade 39 aktiva listningar; extern andring/radering/mejl kraver Marcs ja. Vantar pa Marc. |  |
| 12/10 22:59 |  | Codex | #3473 | note | Boss-genomgang 12/10: Mr Gadget ar i stopp-lage men ~18 GadgetDrop-/MrGadget-schemalagda uppgifter ar fortfarande Ready (Windows nekade avaktivering, kraver admin). Vantar pa Marcs ja/admin. |  |
| 12/10 22:59 |  | Codex | #3867 | note | Boss-genomgang 12/10: bilderna visar MausBot (mausbot.com, open source Apache 2.0, GitHub milind-soni/OpenMausBot). Kor lokalt mot claude/codex-CLI med befintliga inloggningar, gratis; MausBot Cloud ar betaltjanst och ska INTE anvandas. Vantar pa Marcs ja att installera/testa lokalt. |  |
| 12/10 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-12-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 12/10 20:00 | Codex | schemat |  | pass-slut | pass 2026-10-12-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 12/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-12-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 12/10 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-12-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 12/10 15:55 | Antigravity | schemat |  | pass-slut | pass 2026-10-12-1548 slut: 0 klara, 0 hinder, 0 kvar — Antigravity: klar | nästa pass 16:00 Antigravity |
| 12/10 15:55 | Antigravity | Antigravity 201–208 (Antigravity subagenter, upp till 8 parallellt) |  | steg-klart | Antigravity: klar (0 kvar) |  |
| 12/10 15:52 | Antigravity | Codex | #3887 | done | Diskmaskinen ren & tömd loggad 2026-10-12 15:38 (krypterat i data/valv/events.json.enc). Commit 6c9b276 pushad till origin/main på https://marcdshark666.github.io/husvakten/. · filer: data/valv/events.json.enc |  |
| 12/10 15:52 | Antigravity | Codex | #3887 | note | Krypterad händelse (commit 6c9b276) pushad till origin/main och verifierad på GitHub Pages-repot. |  |
| 12/10 15:49 | Antigravity | Codex | #3887 | start | Fortsätter med att kontrollera git push och Syncthing-foto för diskmaskinshändelsen · projekt husvakten |  |
| 12/10 15:49 | Antigravity | schemat |  | pass | pass 2026-10-12-1548 börjar (reserven tar över): 1 att göra, turordning Antigravity |  |
| 12/10 15:46 | Claude | bevakningen |  | pass-slut | pass 2026-10-12-1540 slut: 0 klara, 0 hinder, 1 kvar — Claude: kvoten är slut · Codex: klar | nästa pass 16:00 Antigravity |
| 12/10 15:46 | Codex | Codex 101/102 (codex exec) |  | steg-klart | Codex: klar (1 kvar) |  |
| 12/10 15:41 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | stopp | Claude: kvoten är slut (1 kvar) | Codex tar över |
| 12/10 15:41 | Claude | bevakningen |  | pass | pass 2026-10-12-1540 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 12/10 15:25 | Claude | bevakningen |  | pass-slut | pass 2026-10-12-1520 slut: 1 klara, 0 hinder, 0 kvar — Claude: kvoten är slut · Codex: klar | nästa pass 16:00 Antigravity |
| 12/10 15:25 | Codex | Codex 101/102 (codex exec) |  | steg-klart | Codex: klar (0 kvar) |  |
| 12/10 15:20 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | stopp | Claude: kvoten är slut (1 kvar) | Codex tar över |
| 12/10 15:20 | Claude | bevakningen |  | pass | pass 2026-10-12-1520 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 12/10 14:00 | Codex | schemat |  | pass-slut | pass 2026-10-12-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
