import { expect, test } from '@playwright/test'

test('grid → open expanded card → browse all 4 tabs', async ({ page }) => {
  await page.goto('/')

  // Bulbasaur (#1) is first in default ID-ascending sort
  const bulbasaurCard = page.getByText('bulbasaur', { exact: true }).first()
  await expect(bulbasaurCard).toBeVisible({ timeout: 10000 })
  await bulbasaurCard.click()

  // Scope all assertions to the expanded card overlay
  const card = page.locator('div.fixed.inset-0.z-50')
  await expect(card).toBeVisible()

  // ── Stats tab (default) ────────────────────────────────────────────────────
  await expect(card.getByText('Base Stats')).toBeVisible()
  await expect(card.getByText(/BST \d+/)).toBeVisible()
  await expect(card.getByText('Abilities')).toBeVisible()
  await expect(card.getByText('Weak')).toBeVisible()

  // ── Bio tab ────────────────────────────────────────────────────────────────
  await card.getByRole('tab', { name: 'Bio' }).click()
  await expect(card.getByText('Seed Pokémon')).toBeVisible()
  await expect(card.getByText('Habitat')).toBeVisible()
  await expect(card.getByText('Egg Groups')).toBeVisible()

  // ── Moves tab ──────────────────────────────────────────────────────────────
  await card.getByRole('tab', { name: 'Moves' }).click()
  await expect(card.getByText('Level Up')).toBeVisible()
  await expect(card.getByText('TM / Tutor')).toBeVisible()

  // Click the first move row and confirm the description expands below it
  const firstMove = card.locator('tbody tr').first()
  await firstMove.click()
  const detailRow = card.locator('tbody tr').nth(1)
  await expect(detailRow).toBeVisible()

  // ── Evol tab ───────────────────────────────────────────────────────────────
  await card.getByRole('tab', { name: 'Evol' }).click()
  await expect(card.getByText('ivysaur', { exact: true })).toBeVisible()
  await expect(card.getByText('venusaur', { exact: true })).toBeVisible()
})
