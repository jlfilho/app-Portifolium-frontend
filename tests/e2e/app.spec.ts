import { expect, test } from '@playwright/test';

test('carrega a area publica usando a API real pelo proxy do frontend', async ({ page, request }) => {
  const health = await request.get('/api/actuator/health');
  expect(health.ok()).toBeTruthy();

  await page.goto('/cursos-publicos');

  await expect(page.getByRole('heading', { name: /Nossos Cursos/i })).toBeVisible();
  await expect(page.getByLabel(/Buscar cursos/i)).toBeVisible();
});

test('permite login com usuario seed da API real', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel(/E-mail/i).fill('admin@uea.edu.br');
  await page.getByLabel(/^Senha$/i).fill('admin123');
  await page.getByRole('button', { name: /Entrar/i }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
});
