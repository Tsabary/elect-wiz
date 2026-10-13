import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  // Runs against a production build so tests exercise what ships: the placeholder
  // corpus, in a non-production environment so the clock override works. The
  // server's own clock is pinned before the poll blackout, so pages are rendered
  // with poll information whatever the real date; each test moves the clock with
  // the `clock-override` cookie or header.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `pnpm build && pnpm exec next start -p ${PORT}`,
        url: `${baseURL}/he`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        env: {
          APP_ENV: "test",
          CONTENT_CORPUS: "placeholder",
          CLOCK_OVERRIDE: "2026-10-20T12:00:00Z",
        },
      },
});
