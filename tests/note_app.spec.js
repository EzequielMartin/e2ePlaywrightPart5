const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe("Note app", () => {
  beforeEach(async ({ page, request }) => {
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
    await loginWith(page, "ezem", "aprendiendofullstack")
    await expect(page.getByText('Ezequiel Martin logged-in')).toBeVisible()
  })

  test("Login fails with wrong password", async ({ page }) => {
    await loginWith(page, "ezem", "contraseñaincorrecta")
    const errorDiv = await page.locator('.error')
    await expect(page.getByText("Wrong credentials")).toBeVisible()
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('Ezequiel Martin logged-in')).not.toBeVisible()

  })

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "ezem", "aprendiendofullstack")
    })

    test("A note can be created", async ({ page }) => {
      await createNote(page, "Creando una nota con Playwright")
      await expect(page.getByText("Creando una nota con Playwright")).toBeVisible()
    })

    describe("And a note exists", () => {
      beforeEach(async ({ page }) => {
        await createNote(page, "Another note by Playwright")
      })

      test("Importance can be changed", async ({ page }) => {
        await page.getByRole("button", { name: "make not important" }).click()
        await expect(page.getByText("make important")).toBeVisible()
      })
    })

    describe("And several notes exist", () => {
      beforeEach(async ({ page }) => {
        await createNote(page, "First note")
        await createNote(page, "Second note")
      })

      test("Importance can be changed on one of them", async ({ page }) => {
        const noteElement = await page.getByText("First note")

        await noteElement
          .getByRole("button", { name: "make not important"}).click()
        await expect(noteElement.getByText("make important")).toBeVisible()
      })
    })

  })
})
