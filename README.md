# The Work List — data och sajt

Repot bär två saker, på två grenar:

- **`main`** — livedatan: `worklist/state.json` (maskerad vy av listan, skjuts upp av
  datorn var gång något händer), `projects/*.json` och `worklist/*.json` (medaljer,
  tillstånd, delning, svar, köordning, röst- och väckningsbegäran). Sidan läser dem
  direkt från GitHub och skriver dem med besökarens egen GitHub-token.
- **`site`** — den byggda sajten, serverad av GitHub Pages på
  https://marcdshark666.github.io. Skrivs om av `node worklist.js publish` på PC 1.

Källkoden ligger i det privata repot `marcdshark666/the-work-list`.
Rått `worklist.json` lämnar aldrig PC 1.
