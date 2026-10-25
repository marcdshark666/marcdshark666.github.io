# The Work List — delat minne för Claude, Codex och Antigravity

_Skrivs av `the-work-list/worklist.js` (kommandona start/note/done/fail/paus och varje pass). Senast 25/10 01:44. Läs den här filen FÖRST när du tar ett pass på listan. Skriv inte i den för hand — kör kommandona så hamnar det här; fri rad: `node worklist.js minne "text" --nasta "…"`. Rå logg: `worklist-minne.jsonl` bredvid. Listan: https://marcdshark666.github.io_

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
| 25/10 01:44 |  |  |  | not | Claude CLI inloggad igen (Marc körde claude auth login). Alla tre steg (Claude, Codex, Antigravity) redo. | Claude tar köade ärenden och ordinarie pass. |
| 25/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-25-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 24/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-24-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 24/10 21:32 | Claude | schemat |  | pass-slut | pass 2026-10-24-2130 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 24/10 18:01 | Claude | schemat |  | pass-slut | pass 2026-10-24-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 24/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-24-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 24/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-24-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 24/10 13:34 |  |  |  | not | Marc instruktion 24/10: Codex jobbar på uppdragen tills Antigravity hoppar in och hjälper till. Jobba aldrig på samma uppdrag som Codex - koordinera emellan via Work List / minnet. | Koordinera uppdrag med Codex så ingen krock uppstår. |
| 24/10 13:31 |  |  |  | not | Codex 24/10: kanalens beskrivningar omlasta med skyddad YouTube-fabrik och uploads-playlist avstamd mot tidigare ID:n. Inga nya ID:n eller andrade beskrivningar; 15 kanda direkta Amazon-taggfel kvar. AirPods-kortlank /6p leder fortfarande till B0DGW54P27 med US-taggen. Joseph Josephs produktdata kunde inte tolkas idag: lager OKANT. Telegram-inbox tom. Rapport state/codex-monitor-20261024.json; ful | Prioriterad uppfoljning: exakta ssstik-produktmatchningar, lager/leverans och ratt marknadskod. Respektera lankskydd och stopp; gamla lagerbevis far inte ateranvandas som dagens. |
| 24/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-24-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 24/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-24-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 24/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-24-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 24/10 06:01 | Claude | schemat |  | pass-slut | pass 2026-10-24-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 24/10 04:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-24-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 24/10 02:01 | Codex | schemat |  | pass-slut | pass 2026-10-24-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 24/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-24-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 23/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-23-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 23/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-23-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 23/10 18:01 | Claude | schemat |  | pass-slut | pass 2026-10-23-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 23/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-23-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 23/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-23-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 23/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-23-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 23/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-23-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 23/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-23-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 23/10 06:01 | Claude | schemat |  | pass-slut | pass 2026-10-23-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 23/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-23-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 23/10 02:01 | Codex | schemat |  | pass-slut | pass 2026-10-23-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 23/10 00:02 | Claude | schemat |  | pass-slut | pass 2026-10-23-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 22/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-22-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 22/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-22-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 22/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-22-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 22/10 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-22-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 22/10 14:00 | Codex | schemat |  | pass-slut | pass 2026-10-22-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 22/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-22-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 22/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-22-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 22/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-22-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 22/10 06:01 | Claude | schemat |  | pass-slut | pass 2026-10-22-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 22/10 04:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-22-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 22/10 02:01 | Codex | schemat |  | pass-slut | pass 2026-10-22-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 22/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-22-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 21/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-21-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 21/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-21-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 21/10 18:01 | Claude | schemat |  | pass-slut | pass 2026-10-21-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 21/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-21-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 21/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-21-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 21/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-21-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 21/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-21-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 21/10 08:00 | Codex | schemat |  | pass-slut | pass 2026-10-21-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 21/10 06:01 | Claude | schemat |  | pass-slut | pass 2026-10-21-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 21/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-21-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 21/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-21-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 21/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-21-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 20/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-20-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 20/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-20-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 20/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-20-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 20/10 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-20-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 20/10 14:00 | Codex | schemat |  | pass-slut | pass 2026-10-20-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 20/10 12:00 | Claude | schemat |  | pass-slut | pass 2026-10-20-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 20/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-20-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 20/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-20-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 20/10 06:00 | Claude | schemat |  | pass-slut | pass 2026-10-20-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 20/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-20-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 20/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-20-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 20/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-20-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 19/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-19-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 19/10 20:00 | Codex | schemat |  | pass-slut | pass 2026-10-19-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 19/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-19-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 19/10 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-19-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 19/10 14:00 | Codex | schemat |  | pass-slut | pass 2026-10-19-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 19/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-19-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 19/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-19-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 19/10 08:00 | Codex | schemat |  | pass-slut | pass 2026-10-19-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 19/10 06:00 | Claude | schemat |  | pass-slut | pass 2026-10-19-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 19/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-19-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 19/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-19-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 19/10 00:00 | Claude | schemat |  | pass-slut | pass 2026-10-19-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 18/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-18-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 18/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-18-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 18/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-18-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 18/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-18-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
