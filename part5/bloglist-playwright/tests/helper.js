const test_username = 'pw_test'
const test_password = 'playwright123'
const test_name = "Playwright Test User"

const loginWith = async (page, username, password) => {
    const username_field = page.getByLabel('username')
    const password_field = page.getByLabel('password')

    await username_field.fill(username)
    await password_field.fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith, test_username, test_password, test_name }