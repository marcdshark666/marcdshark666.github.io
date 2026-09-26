# The Work List — delat minne för Claude, Codex och Antigravity

_Skrivs av `the-work-list/worklist.js` (kommandona start/note/done/fail/paus och varje pass). Senast 26/09 08:22. Läs den här filen FÖRST när du tar ett pass på listan. Skriv inte i den för hand — kör kommandona så hamnar det här; fri rad: `node worklist.js minne "text" --nasta "…"`. Rå logg: `worklist-minne.jsonl` bredvid. Listan: https://marcdshark666.github.io_

## Rotan — vem kollar listan när (Stockholm-tid, fyra pass per AI och dygn)

| Klockslag | Steg | Händer (adresser) | Schemalagt jobb |
|---|---|---|---|
| 00:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 02:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 04:00 | Antigravity | Antigravity 201 (Antigravity-appen via agentapi) | WorkList-Antigravity |
| 06:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 08:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 10:00 | Antigravity | Antigravity 201 (Antigravity-appen via agentapi) | WorkList-Antigravity |
| 12:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 14:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 16:00 | Antigravity | Antigravity 201 (Antigravity-appen via agentapi) | WorkList-Antigravity |
| 18:00 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) | WorkList-Claude |
| 20:00 | Codex | Codex 101/102 (codex exec) | WorkList-Codex |
| 22:00 | Antigravity | Antigravity 201 (Antigravity-appen via agentapi) | WorkList-Antigravity |

Turordningen är cyklisk (Claude → Codex → Antigravity → …): passets steg går först; kan det inte (utloggat, kvot slut, saknas) tar nästa över, så listan alltid betas av. Bevakningen `WorkList-Poll` (var 10:e min) går Claude först. Codex och Antigravity får koda, testa och commita lokalt — aldrig deploya, pusha eller betala (protokoll 4 och 8 i `.agents/PROTOKOLL.md`). Ett uppdrag som kräver deploy pausas med "väntar på deploy" och tas i Claudes nästa pass.

## Just nu

- Pass just nu: **Codex** · nästa pass: idag 10:00 (Antigravity)
- Listan: 1 öppna · 0 pausade · 1 pågår
- Claude: kör — run 2026-09-26-0820 in progress
- Codex: redo — last 24/09 17:43: klar
- Antigravity: redo — last 20/09 02:32: klar

Kommandon: `node "E:\CHAT-RTX\CLAUDECODE GENERAL BRAIN\APP ideas\the-work-list\worklist.js" minne` (senaste raderna) · `minne --rota` · `stegen` · `status`

## Senaste händelserna (nyast först)

| När | Steg | Hand | # | Händelse | Vad | Nästa |
|---|---|---|---|---|---|---|
| 26/09 08:22 | Claude | Claude | #668 | start | Söker i Gmail efter en fungerande Amazon Seller Support-adress och skickar ett uppföljningsmejl om case 22075043231 med referens till supportärendena · projekt marcs-resell |  |
| 26/09 08:21 | Claude | bevakningen |  | pass | pass 2026-09-26-0820 börjar (bevakningen): 2 att göra, turordning Claude → Codex → Antigravity |  |
| 26/09 08:01 | Codex | schemat |  | pass-slut | pass 2026-09-26-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 26/09 06:00 | Claude | schemat |  | pass-slut | pass 2026-09-26-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 26/09 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-26-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 26/09 02:00 | Codex | schemat |  | pass-slut | pass 2026-09-26-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 26/09 00:00 | Claude | schemat |  | pass-slut | pass 2026-09-26-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 25/09 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-25-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 25/09 20:00 | Codex | schemat |  | pass-slut | pass 2026-09-25-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 25/09 18:22 | Claude | bevakningen |  | pass-slut | pass 2026-09-25-1820 slut: 1 klara, 0 hinder, 0 kvar — Claude: klar | nästa pass 20:00 Codex |
| 25/09 18:22 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | steg-klart | Claude: klar (0 kvar) |  |
| 25/09 18:21 | Claude | Claude | #657 | done | Kvitterat: Dexcom-reklamationen för G7 LOT 1826111002 (#653/#654, Asana ÄRENDE 4) är skickad av Marc själv. Inget nytt skickat för att undvika dubblett; #653 räknas som löst. |  |
| 25/09 18:21 | Claude | Claude | #657 | note | Avstämt: #654 fyllde i Rubin-formuläret (G7, LOT 1826111002, utgång 2027-09-30, Asana ÄRENDE 4) men spärren stoppade Nästa; Marc har loggat in och skickat själv. Ingen ny reklamation skickas – undviker dubblett. |  |
| 25/09 18:21 | Claude | Claude | #657 | start | Marc säger att sensorreklamationen (#653/#654) redan är gjord av honom – jag stämmer av och stänger utan att skicka något nytt · projekt dexcom-reklamations-assistent |  |
| 25/09 18:20 | Claude | bevakningen |  | pass | pass 2026-09-25-1820 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 25/09 18:08 | Claude | bevakningen |  | pass-slut | pass 2026-09-25-1803 slut: 0 klara, 1 hinder, 0 kvar — Claude: klar | nästa pass 20:00 Codex |
| 25/09 18:08 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | steg-klart | Claude: klar (0 kvar) |  |
| 25/09 18:07 | Claude | Claude | #653 | fail | Fotot hittat: G7 LOT 1826111002, utgång 2027-09-30, Rubin-märke OK. Saknas: insättningsdatum, datum sensorn felade, feltyp. Marc: svara med dem + 'kör' (molnsessionen 'Sensor reklamering' väntar redan på Sensor Start-datumet – svara bara på ett ställe, annars dubblett). | Marc behöver agera |
| 25/09 18:07 | Claude | Claude | #653 | note | Hittade förpackningsfotot (uppladdat 18:05 idag): Dexcom G7, LOT 1826111002, tillv. 2026-04-01, utgång 2027-09-30, Rubin-klistermärke finns. Sparat i dexcom-reklamations-assistent/sensorbilder/2026-09-25-lot-1826111002-kartong.jpg. Insättnings-/feldatum och feltyp saknas. |  |
| 25/09 18:05 | Claude | Claude | #653 | start | Letar efter dagens sensorbild/LOT i Telegram-kön och Gmail; hittas inget ber jag Marc skicka bilder · projekt dexcom-reklamations-assistent |  |
| 25/09 18:05 | Claude | bevakningen |  | pass | pass 2026-09-25-1803 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 25/09 18:00 | Claude | schemat |  | pass-slut | pass 2026-09-25-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 25/09 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-25-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 25/09 14:00 | Codex | schemat |  | pass-slut | pass 2026-09-25-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 25/09 12:00 | Claude | schemat |  | pass-slut | pass 2026-09-25-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 25/09 10:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-25-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 25/09 09:01 |  |  |  | not | Mr Gadget 25/9: 170 kända videor återlästa, 15 tidigare tagg-/URL-avvikelser kvar. Fågeloriginalet B0CNK9PBWV verifierat som YudeWater 2-pack In Stock med leverans Sverige. Med creatorsDisableRedirect=true stannar läsprovet på original-ASIN; vanlig länk omdirigerade igår till Obelunrp B0F4WYMZ84, annan brand och ej verifierat antal. Förberett URL-förslag för skyddad 6TCvhFC2w90 finns i state/codex | Marc behöver uttryckligen beställa eventuell rättning av det skyddade fågelklippet; använd rapportens före/efter, kringgå inga spärrar. Verifiera övriga produkter separat. Äldre patrullrapport får int |
| 25/09 08:01 | Codex | schemat |  | pass-slut | pass 2026-09-25-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 25/09 06:00 | Claude | schemat |  | pass-slut | pass 2026-09-25-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 25/09 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-25-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 25/09 02:00 | Codex | schemat |  | pass-slut | pass 2026-09-25-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 25/09 00:00 | Claude | schemat |  | pass-slut | pass 2026-09-25-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 24/09 22:01 | Antigravity | schemat |  | pass-slut | pass 2026-09-24-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 24/09 20:00 | Codex | schemat |  | pass-slut | pass 2026-09-24-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 24/09 18:00 | Claude | schemat |  | pass-slut | pass 2026-09-24-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 24/09 17:43 | Claude | bevakningen |  | pass-slut | pass 2026-09-24-1740 slut: 1 klara, 0 hinder, 0 kvar — Claude: hoppades över: claude är utloggad på datorn — Marc: kör `claude auth login` i en terminal · Codex: klar | nästa pass 18:00 Claude |
| 24/09 17:43 | Codex | Codex 101/102 (codex exec) |  | steg-klart | Codex: klar (0 kvar) |  |
| 24/09 17:40 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 4 parallellt) |  | hoppade-over | Claude: hoppades över: claude är utloggad på datorn — Marc: kör `claude auth login` i en terminal (1 kvar) | Codex tar över |
| 24/09 17:40 | Claude | bevakningen |  | pass | pass 2026-09-24-1740 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 24/09 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-24-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 24/09 14:00 | Codex | schemat |  | pass-slut | pass 2026-09-24-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 24/09 12:00 | Claude | schemat |  | pass-slut | pass 2026-09-24-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 24/09 10:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-24-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 24/09 09:03 |  |  |  | not | Mr Gadget 24/9: 170 livebeskrivningar återlästa via skyddad YouTube-fabrik; 15 tidigare marknads-/URL-avvikelser kvar. Fem browserkontroller. Nytt fynd: fågelhållarens US-länk B0CNK9PBWV omdirigerar i svensk session till amazon.se B0F4WYMZ84 (Obelunrp, säljare HuiHaos), In stock men exakt produkt/antal och provision ej verifierade efter bytet. Juicer UK fortfarande Page Not Found; ACEFAST UK/SE un | Kontrollera fågelhållarens geografiska omdirigering mot originalets modell och antal; skyddat klipp får inte ändras automatiskt. Samordna befintlig tillståndsfråga, skapa ingen dubblett. |
| 24/09 08:02 | Codex | schemat |  | pass-slut | pass 2026-09-24-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 24/09 06:00 | Claude | schemat |  | pass-slut | pass 2026-09-24-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 24/09 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-24-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 24/09 02:00 | Codex | schemat |  | pass-slut | pass 2026-09-24-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 24/09 00:01 | Claude | schemat |  | pass-slut | pass 2026-09-24-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 23/09 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-23-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 23/09 20:00 | Codex | schemat |  | pass-slut | pass 2026-09-23-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 23/09 18:00 | Claude | schemat |  | pass-slut | pass 2026-09-23-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 23/09 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-09-23-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 23/09 14:00 | Codex | schemat |  | pass-slut | pass 2026-09-23-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 23/09 12:00 | Claude | schemat |  | pass-slut | pass 2026-09-23-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 23/09 10:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-23-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 23/09 09:02 |  |  |  | not | Mr Gadget 23/9: läst delat minne, tillstånd stopp och färsk patrull (170 videor, 22 skyddade klipp). Browseruppföljning av fem okända direkta produktlänkar: juicer UK B0GWJ335TD är nu Page Not Found (nytt fel); B08LN2X89N omdirigerar till svensk söksida, ingen exakt produkt/lagerverifikation. ACEFAST B0GKRKMKXG UK+SE Currently unavailable. Massager B0DY7JSV5N kan inte levereras till Sverige. Rappo | Juicerns döda länk behöver ett beslut från Marc för det skyddade klippet. Kontrollera exakt ersättare separat; inget automatiskt byte eller slutsåldtolkning av fel-/söksidor. Full lagergranskning kvar |
| 23/09 08:01 | Codex | schemat |  | pass-slut | pass 2026-09-23-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 23/09 06:00 | Claude | schemat |  | pass-slut | pass 2026-09-23-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 23/09 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-23-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 23/09 02:00 | Codex | schemat |  | pass-slut | pass 2026-09-23-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 23/09 00:01 | Claude | schemat |  | pass-slut | pass 2026-09-23-0000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
| 22/09 22:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-22-2200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 00:00 Claude |
| 22/09 20:00 | Codex | schemat |  | pass-slut | pass 2026-09-22-2000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 22:00 Antigravity |
| 22/09 18:00 | Claude | schemat |  | pass-slut | pass 2026-09-22-1800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 20:00 Codex |
| 22/09 16:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-22-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 22/09 14:00 | Codex | schemat |  | pass-slut | pass 2026-09-22-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 22/09 12:01 | Claude | schemat |  | pass-slut | pass 2026-09-22-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 22/09 10:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-22-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 22/09 09:02 |  |  |  | not | Mr Gadget 22/9 morgon: läst delat minne och färsk länkpatrull 07:01 (170 videor, 22 skyddade klipp med rapporterade länkproblem). Separat läsande återkontroll av 53 nattlänkar: fem produktsidor ger uttryckligt In Stock; tio Amazon-svar saknar verifierbart lager. Modell/variant och leveransland är inte fullständigt verifierade; söklänkar ger inget produktbevis. Rapport gadget-drop/state/codex-monit | Fortsätt exakt modell-/lagerverifiering via produktsidor där hämtningen är blockerad; 312 koder väntar enligt patrullen på tillåten deploy. Respektera länkskydd och invänta rätt tillstånd; markera int |
| 22/09 08:01 | Codex | schemat |  | pass-slut | pass 2026-09-22-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 22/09 06:00 | Claude | schemat |  | pass-slut | pass 2026-09-22-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 22/09 04:00 | Antigravity | schemat |  | pass-slut | pass 2026-09-22-0400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 06:00 Claude |
| 22/09 02:00 | Codex | schemat |  | pass-slut | pass 2026-09-22-0200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 22/09 00:37 | Claude | bevakningen |  | pass-slut | pass 2026-09-22-0030 slut: 1 klara, 3 hinder, 0 kvar — Claude: hoppades över: claude är utloggad på datorn — Marc: kör `claude auth login` i en terminal · Codex: klar | nästa pass 02:00 Codex |
| 22/09 00:37 | Codex | Codex 101/102 (codex exec) |  | steg-klart | Codex: klar (0 kvar) |  |
| 22/09 00:30 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 4 parallellt) |  | hoppade-over | Claude: hoppades över: claude är utloggad på datorn — Marc: kör `claude auth login` i en terminal (4 kvar) | Codex tar över |
| 22/09 00:30 | Claude | bevakningen |  | pass | pass 2026-09-22-0030 börjar (bevakningen): 4 att göra, turordning Claude → Codex → Antigravity |  |
| 22/09 00:30 | Claude | Claude Code (appen) |  | not | Rotan och det delade minnet infört (Marc 2026-09-22). Claude-CLI:n är utloggad sedan 21/9 23:00 — Marc måste köra claude auth login; Codex saknar krediter; Antigravity är enda levande steget. | Marc: claude auth login i en terminal på PC 1 |
