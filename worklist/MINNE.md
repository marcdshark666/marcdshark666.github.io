# The Work List — delat minne för Claude, Codex och Antigravity

_Skrivs av `the-work-list/worklist.js` (kommandona start/note/done/fail/paus och varje pass). Senast 28/10 18:13. Läs den här filen FÖRST när du tar ett pass på listan. Skriv inte i den för hand — kör kommandona så hamnar det här; fri rad: `node worklist.js minne "text" --nasta "…"`. Rå logg: `worklist-minne.jsonl` bredvid. Listan: https://marcdshark666.github.io_

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

- Pass just nu: **Claude** · nästa pass: idag 20:00 (Codex)
- Listan: 0 öppna · 0 pausade · 0 pågår
- Claude: kör — run 2026-10-28-1810 in progress
- Codex: redo — last 25/10 03:55: klar
- Antigravity: redo — last 12/10 15:55: klar

Kommandon: `node "E:\CHAT-RTX\CLAUDECODE GENERAL BRAIN\APP ideas\the-work-list\worklist.js" minne` (senaste raderna) · `minne --rota` · `stegen` · `status`

## Senaste händelserna (nyast först)

| När | Steg | Hand | # | Händelse | Vad | Nästa |
|---|---|---|---|---|---|---|
| 28/10 18:13 | Claude | Claude | #7823 | done | Inget att ladda upp: de 5 intygen låg redan i BT-portfolion (uppladdade 28/10 av Hund 2, CK-20261028-btintyg5), 13 dokument, inga dubbletter; verifierat via sidtext utan att röra skärmen. Bockat av i /bt Att göra. Heartbeat: Konversationsbotens uppdrag till Boss ej bekräftat levererat, portalen loggar ut vid inaktivitet, inget ändrat. https://desktop-r13nmtb.tailf9ee87.ts.net/bt/ · filer: files/ch |  |
| 28/10 18:13 | Claude | Claude | #7823 | note | Bockat av i /bt → Att göra (checks.json: diplom+uppladdat för Antibiotika Smart, Läkemedelsgenomgångar, Handledning, DISA, Hållbarhet, Patientsäkerhet) och intyg/kurser/INDEX.md. Klarmarkering i portfolion görs av handledaren. |  |
| 28/10 18:13 | Claude | Claude | #7823 | note | Verifierat via sidtext i portalen: alla 5 kvarvarande intyg (Antibiotika Smart, Fördjupad läkemedelsgenomgång, DISA, Grundläggande hållbarhet, Säker vård/patientsäkerhet) laddades upp 28/10 av Hund 2 BT-läkaren (CK-20261028-btintyg5). 13 personliga dokument totalt, inga dubbletter. Inget mer att ladda upp. |  |
| 28/10 18:11 | Claude | Claude | #7859 | done | Tolkat: Marc ber mig bortse från den avklippta #7808 och fortsätta Konversationsboten som Grok-likt samtalsläge. Ingen ändring behövs: boten har redan läsverktyg, utredarregel och delegering till Boss (kallor.js, tillägg 6). Tips: skriv nya önskemål här. |  |
| 28/10 18:11 | Claude | Claude | #7823 | start | Fortsätter: kollar användarguard (är Marc vid datorn?) innan skärmen rörs · projekt bt-start |  |
| 28/10 18:11 | Claude | Claude | #7859 | start | Tolkar: Marc ber mig bortse från avklippta #7808 och fortsätta Konversationsboten (Grok-likt samtalsläge); kollar nuläget · projekt worklist-bots |  |
| 28/10 18:11 | Claude | bevakningen |  | pass | pass 2026-10-28-1810 börjar (bevakningen): 2 att göra, turordning Claude → Codex → Antigravity |  |
| 28/10 18:03 | Claude | schemat |  | pass-slut | pass 2026-10-28-1800 slut: 0 klara, 0 hinder, 1 kvar — Claude: klar | nästa pass 20:00 Codex |
| 28/10 18:03 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | steg-klart | Claude: klar (1 kvar) |  |
| 28/10 18:02 | Claude | Claude | #7823 | paus | Obevakad körning kl 18: uppgiften kräver skärmstyrning av Marcs inloggade Chrome/Outlook och kan inte göras säkert när Marc kan använda datorn (regel: rör inte skärmen). Inget uppladdat ännu. Kvar: hämta 5 PDF ur Outlook, jämför mot 7 redan uppladdade i BT-portfolion, ladda upp enligt bt-start/files/bt-portfolio-uppladdning/LAS-MIG.md, verifiera per fil. Heartbeat/inloggning ej utrett. Kör via bev | nästa pass fortsätter där det slutade |
| 28/10 18:02 | Claude | Claude | #7823 | start | Återupptar: kollar om skärmen är fri för uppladdning · projekt bt-start |  |
| 28/10 18:02 | Claude | schemat |  | pass | pass 2026-10-28-1800 börjar (schemalagt pass): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 28/10 16:44 | Claude | bevakningen |  | pass-slut | pass 2026-10-28-1642 slut: 0 klara, 0 hinder, 1 kvar — Claude: klar | nästa pass 18:00 Claude |
| 28/10 16:44 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | steg-klart | Claude: klar (1 kvar) |  |
| 28/10 16:44 | Claude | Claude | #7823 | paus | Inga uppladdningar gjorda. Chrome är inloggad (flikar Outlook/Dokument-Portal/BT-portfolion) och Outlook står på sökning 'Antibiotika', så Marc eller en tidigare hand använder skärmen just nu – rör den inte. Kvar: ladda ned de 5 PDF:erna ur Outlook (Antibiotika Smart, Läkemedelsgenomgångar, DISA, Hållbarhet, Patientsäkerhet), kontrollera BT-portfolion mot de 7 redan uppladdade, ladda upp via Dokum | nästa pass fortsätter där det slutade |
| 28/10 16:43 | Claude | Claude | #7823 | start | Kontrollerar läge och möjlighet att ladda upp BT-intyg till Lärtorget · projekt bt-start |  |
| 28/10 16:43 | Claude | bevakningen |  | pass | pass 2026-10-28-1642 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 28/10 16:06 | Claude | bevakningen |  | pass-slut | pass 2026-10-28-1604 slut: 0 klara, 1 hinder, 0 kvar — Claude: klar | nästa pass 18:00 Claude |
| 28/10 16:06 | Claude | Vakthund-platserna 1–8 (claude -p, upp till 8 parallellt) |  | steg-klart | Claude: klar (0 kvar) |  |
| 28/10 16:05 | Claude | Claude | #7808 | fail | Röstmeddelandet avklippt ('göra saturation konversatio…'), går ej att tolka säkert. Bilderna visar att Konversationsboten saknar verktyg och bara erbjuder vidarebefordran till Boss. Marc: skriv om vad som ska ändras i Konversationsboten. | Marc behöver agera |
| 28/10 16:05 | Claude | Claude | #7808 | start | Tolkar avbruten röstinstruktion om Konversationsboten · projekt worklist-bots |  |
| 28/10 16:05 | Claude | bevakningen |  | pass | pass 2026-10-28-1604 börjar (bevakningen): 1 att göra, turordning Claude → Codex → Antigravity |  |
| 28/10 16:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-28-1600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 18:00 Claude |
| 28/10 14:01 | Codex | schemat |  | pass-slut | pass 2026-10-28-1400 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 16:00 Antigravity |
| 28/10 12:01 | Claude | schemat |  | pass-slut | pass 2026-10-28-1200 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 14:00 Codex |
| 28/10 10:01 | Antigravity | schemat |  | pass-slut | pass 2026-10-28-1000 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 12:00 Claude |
| 28/10 09:04 |  |  |  | not | Codex 28/10: 173 kanda videobeskrivningar oforandrade. Nasta omappade Desktop-fil ssstik.io_1789206026922.mp4 granskad vid 2 och 8 sekunder: morkt tangentbord med metallram; exakt modell kan inte sakert avlasas. Bildbevis och rapport state/codex-monitor-20261028.json sparade. Ingen kallkoppling gissad, inga publika andringar. Lagerkontroll och full audit kvarstar. | Fortsatt visuell modell- och kanalmatchning av omappade filer samt separat live lagerkontroll. Skyddade klipp far inte andras. |
| 28/10 08:01 | Codex | schemat |  | pass-slut | pass 2026-10-28-0800 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 10:00 Antigravity |
| 28/10 06:11 | Claude | schemat |  | pass-slut | pass 2026-10-28-0600 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 08:00 Codex |
| 28/10 04:11 | Antigravity | schemat |  | pass-slut | pass 2026-10-28-0400 slut: 0 klara, 0 hinder, 0 kvar — fel: .data.lock togs över under arbetet — skriver INTE, annars försvinner uppdrag som kommit in under tiden | nästa pass 06:00 Claude |
| 28/10 02:07 | Codex | schemat |  | pass-slut | pass 2026-10-28-0201 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 04:00 Antigravity |
| 28/10 00:14 | Claude | schemat |  | pass-slut | pass 2026-10-28-0001 slut: 0 klara, 0 hinder, 0 kvar — inget att göra | nästa pass 02:00 Codex |
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
