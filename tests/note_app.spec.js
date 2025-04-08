const { test, expect, describe } = require('@playwright/test')

describe("Note app", () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')
  
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test("Login form can be opened", async ({ page }) => {
    await page.goto("http://localhost:5173")

    await page.getByRole("button", { name: "log in" }).click()
    const textboxes = await page.getByRole('textbox').all()
    await textboxes[0].fill('ezem')
    await textboxes[1].fill('aprendiendofullstack')
    await page.getByRole("button", { name: "login" }).click()

    await expect(page.getByText('Ezequiel Martin logged-in')).toBeVisible()
  })
})
