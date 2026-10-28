# The Work List — delat minne för Claude, Codex och Antigravity

_Skrivs av `the-work-list/worklist.js` (kommandona start/note/done/fail/paus och varje pass). Senast 27/10 22:01. Läs den här filen FÖRST när du tar ett pass på listan. Skriv inte i den för hand — kör kommandona så hamnar det här; fri rad: `node worklist.js minne "text" --nasta "…"`. Rå logg: `worklist-minne.jsonl` bredvid. Listan: https://marcdshark666.github.io_

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

- Pass just nu: **Antigravity** · nästa pass: imorgon 00:00 (Claude)
- Listan: 0 öppna · 0 pausade · 0 pågår
- Claude: kvotstopp — quota used up 43 min ago — resets 9:40pm (Europe/Warsaw)
- Codex: redo — last 25/10 03:55: klar
- Antigravity: redo — last 12/10 15:55: klar

Kommandon: `node "E:\CHAT-RTX\CLAUDECODE GENERAL BRAIN\APP ideas\the-work-list\worklist.js" minne` (senaste raderna) · `minne --rota` · `stegen` · `status`

## Senaste händelserna (nyast först)

| När | Steg | Hand | # | Händelse | Vad | Nästa |
|---|---|---|---|---|---|---|
| 27/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-27-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 27/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-27-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 27/10 18:59 |  |  |  | not | Antigravity (reserv): Stängde av lokal AI på datorn och urladdade Qwen3-30B. Åtgärdade kaskadordningen i kvotkedja.js (OmniRoute före lokal) och tog bort automatisk förvärmning/start av lokal modell vid kvotstopp så att den förblir avstängd tills OmniRoute är helt förbrukat. |  |
| 27/10 18:00 | Claude | schemat |  | pass-slut | pass 2026-10-27-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 27/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-27-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 27/10 14:00 | Codex | schemat |  | pass-slut | pass 2026-10-27-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 27/10 12:00 | Claude | schemat |  | pass-slut | pass 2026-10-27-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 27/10 10:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-27-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 27/10 09:01 |  |  |  | not | Codex 27/10: 173 kanda videobeskrivningar omlasta, oforandrade. Webblasningsverktyget kunde inte oppna ACEFAST SE eller massager UK; bada lagerstatus OKANDA idag, inga gamla lagerbevis ateranvanda. Rapport state/codex-monitor-20261027.json. Telegram-inbox tom. Inga publika andringar; full audit och kallkopplingar fortfarande ofullstandiga. | Fortsatt prioritet: live produkt/variant/lagerkontroller och visuell kallmatchning. Skyddade klipp och stopp kvarstar; ingen kontroll ska markeras helt klar. |
| 27/10 08:00 | Codex | schemat |  | pass-slut | pass 2026-10-27-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 27/10 06:00 | Claude | schemat |  | pass-slut | pass 2026-10-27-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 27/10 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-27-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 27/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-27-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 27/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-27-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 26/10 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-26-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 26/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-26-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 26/10 18:01 | Claude | schemat |  | pass-slut | pass 2026-10-26-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 26/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-26-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 26/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-26-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 26/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-26-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 26/10 10:00 | Antigravity | schemat |  | pass-slut | pass 2026-10-26-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 26/10 09:03 |  |  |  | not | Codex 26/10: omappad Desktop-fil ssstik.io_1789205701990.mp4 visuellt granskad: vitt tangentbord med spindelnatsmonstrade tangenter. Tva live kanalbeskrivningar matchar kandidaten ZORNHER ZH870: Sy6d8_18Uoo och pcTYjhw7VWM. Kallkoppling EJ bekraftad utan jamforelse av publicerade bildrutor. Rapport state/codex-monitor-20261026.json och frame sparade. Inga publika andringar, lager ej kontrollerat i | Jamfor kandidatvideornas bildrutor med originalet; kontrollera sedan exakt modell/variant och lager utan att andra skyddade klipp. |
| 26/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-26-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 26/10 06:01 | Claude | schemat |  | pass-slut | pass 2026-10-26-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 26/10 04:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-26-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 26/10 02:00 | Codex | schemat |  | pass-slut | pass 2026-10-26-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 26/10 00:01 | Claude | schemat |  | pass-slut | pass 2026-10-26-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 25/10 22:07 | Antigravity | schemat |  | pass-slut | pass 2026-10-25-2206 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 25/10 20:01 | Codex | schemat |  | pass-slut | pass 2026-10-25-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 25/10 18:49 | Claude | schemat |  | pass-slut | pass 2026-10-25-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 25/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-25-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 25/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-25-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 25/10 13:02 |  |  |  | not | Antigravity (reserv): Byggde segmenterare i RADCORE för DT, MR (alla delar), Slätröntgen och Ultraljud/ER. Ny flik #/segmentering, JonahView-funktionalitet och Playwright-test verifierat 100%. |  |
| 25/10 12:07 |  |  |  | not | Antigravity reservsteg (Boss-chatt): Byggt och committat lokalt i worklist-bots (commit 4a4568a): 1) Rekommendationsknapp i toppraden till vanster om Tavla, 2) Edit-knapp (penna) for tidsbyte bredvid statusknappen i bade utfalld och hopfalld banner, 3) Statusknappen stoder nu 3 dagar (72 h) och 1 vecka (168 h) med basta projekt och potentialanalys. |  |
| 25/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-25-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 25/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-25-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 25/10 09:05 |  |  |  | not | Codex 25/10: 173 videobeskrivningar oforandrade. Utokad avstamning inklusive alla ssstik-mp4 pa Desktop gav 27 filnamn, 15 utan registrerat YouTube-ID, 4 saknade filer. Hogst visningar ar skyddade ajKbesOpF1A (70818), sedan fageldispenser (17896), Palm Scrub (5179). Rapport state/codex-monitor-20261025.json; inga publika andringar. Lager INTE verifierat idag; full audit EJ klar. | Prioritera visuell matchning av omappade Desktop-filer och exakt lagerkontroll; inga snippet-andringar i skyddade klipp. Bevara ajKbesOpF1A. |
| 25/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-25-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 25/10 06:00 | Claude | schemat |  | pass-slut | pass 2026-10-25-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 25/10 04:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-25-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 25/10 03:55 | Claude | bevakningen |  | pass-slut | pass 2026-10-25-0345 slut: 1 klara, 0 hinder, 0 kvar — Claude: kvoten är slut · Codex: klar | nästa pass 04:00 Antigravity |
| 25/10 03:55 | Codex | Codex 101/102 (codex exec) |  | steg-klart | Codex: klar (0 kvar) |  |
| 25/10 03:47 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | stopp | Claude: kvoten är slut (1 kvar) | Codex tar över |
| 25/10 03:47 | Claude | bevakningen |  | pass | pass 2026-10-25-0345 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 25/10 02:01 | Codex | schemat |  | pass-slut | pass 2026-10-25-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
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
