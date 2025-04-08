const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "log in" }).click()
  await page.getByTestId("username").fill(username)
  await page.getByTestId("password").fill(password)
  await page.getByRole("button", { name: "login" }).click()
}

const createNote = async (page, content) => {
  await page.getByRole("button", { name: "New note" }).click()
  await page.getByRole("textbox").fill(content)
  await page.getByRole("button", { name: "save" }).click()
  await page.getByText(content).waitFor() //Sirve para esperar a que las notas insertadas se renderizen asi no falla el test de cambiar la importancia de una nota cuando tengo varias notas
}

export { loginWith, createNote }