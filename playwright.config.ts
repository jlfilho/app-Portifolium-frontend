import { defineConfig, devices } from '@playwright/test';

const frontendPort = process.env.FRONTEND_PORT ?? '4300';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${frontendPort}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'node scripts/e2e-compose.mjs',
    url: baseURL,
    timeout: 300_000,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === 'true'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
