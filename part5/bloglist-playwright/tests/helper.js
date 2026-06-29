const test_username = 'pw_test'
const test_password = 'playwright123'
const test_name = "Playwright Test User"

const loginWith = async (page, username, password) => {
    const username_field = page.getByLabel('username')
    const password_field = page.getByLabel('password')

    await username_field.fill(username)
    await password_field.fill(password)
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText(/logged in/i).waitFor()
}

const createPost = async (page, blogObj) => {
    const unfold_button = page.getByRole('button', { name: 'Add a blog' })
    await unfold_button.click()

    await page.getByLabel(/author/i, { exact: false }).fill(blogObj.author)
    await page.getByLabel(/blog title/i, { exact: false }).fill(blogObj.title)
    await page.getByLabel(/url/i, { exact: false }).fill(blogObj.url)
    await page.getByRole('button', { name: /add blog/i }).click()
    await page.locator('div.blog > span.blog_title', { hasText: `${blogObj.title}`}).waitFor()
}

export { loginWith, createPost, test_username, test_password, test_name }