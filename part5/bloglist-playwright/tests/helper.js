const test_username = 'pw_test'
const test_password = 'playwright123'
const test_name = "Playwright Test User"

const loginWith = async (page, username, password) => {
    const login_link = page.getByRole('link', { name: 'login' })
    await login_link.click()

    const username_field = page.getByLabel('username')
    const password_field = page.getByLabel('password')

    await username_field.fill(username)
    await password_field.fill(password)
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText(/logged in/i).waitFor()
}

const createPost = async (page, blogObj) => {
    const new_blog_link = page.getByRole('link', { name: 'New blog' })
    await new_blog_link.click()

    await page.getByLabel(/author/i, { exact: false }).fill(blogObj.author)
    await page.getByLabel(/blog title/i, { exact: false }).fill(blogObj.title)
    await page.getByLabel(/url/i, { exact: false }).fill(blogObj.url)
    await page.getByRole('button', { name: /add blog/i }).click()
    await page.locator('li', { hasText: `${blogObj.title}`}).waitFor()
}

export { loginWith, createPost, test_username, test_password, test_name }