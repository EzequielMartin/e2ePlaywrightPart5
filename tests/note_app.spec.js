const { test, expect, describe, beforeEach } = require('@playwright/test')

describe("Note app", () => {
  beforeEach(async ({ page }) => {
    await request.post("http://localhost:3001/api/testing/reset")
    await request.post("http://localhost:3001/api/users",
      {data: {
        name: "Ezequiel Martin",
        username: "ezem",
        password: "aprendiendofullstack"
      }}
    )

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test("Login form can be opened", async ({ page }) => {
    await page.getByRole("button", { name: "log in" }).click()
    await page.getByTestId("username").fill("ezem")
    await page.getByTestId("password").fill("aprendiendofullstack")
    await page.getByRole("button", { name: "login" }).click()
    await expect(page.getByText('Ezequiel Martin logged-in')).toBeVisible()
  })

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('ezem')
      await page.getByTestId('password').fill('aprendiendofullstack')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test("A note can be created", async ({ page }) => {
      await page.getByRole("button", { name: "New note" }).click()
      await page.getByRole("textbox").fill("Creando una nota con Playwright")
      await page.getByRole("button", { name: "save"}).click()
      await expect(page.getByText("Creando una nota con Playwright")).toBeVisible()
    })
  })
})
