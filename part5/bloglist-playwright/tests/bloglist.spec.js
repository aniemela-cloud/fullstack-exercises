const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')
const { before } = require('node:test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: helper.test_name,
                username: helper.test_username,
                password: helper.test_password
            }
        })
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown when no user is logged in', async ({ page }) => {
        const username_field = page.getByLabel('username')
        const password_field = page.getByLabel('password')

        await expect(username_field).toBeVisible()
        await expect(password_field).toBeVisible()
    })
    describe('Login:', () => {
        test('Login with incorrect password fails', async ({ page }) => {
            const username_field = page.getByLabel('username')
            const password_field = page.getByLabel('password')

            await username_field.fill(helper.test_username)
            await password_field.fill('playwright12345')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Login failed', { exact: false })).toBeVisible()
        })

        test('Login with correct password is succesful', async ({ page }) => {
            const username_field = page.getByLabel('username')
            const password_field = page.getByLabel('password')

            await username_field.fill(helper.test_username)
            await password_field.fill(helper.test_password)
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText(`${helper.test_name} logged in`,
                { exact: false })).toBeVisible()
        })
    })

    describe('Operations with logged in user', () => {
        beforeEach(async ({ page }) => {
            await helper.loginWith(page, helper.test_username, helper.test_password)
        })
        test('Clicking on \'Add a blog\' shows \'add blog\' form', async ({ page }) => {
            const unfold_button = page.getByRole('button', { name: 'Add a blog' })
            await unfold_button.click()

            await expect(page.getByLabel(/author/i, { exact: false })).toBeVisible()
            await expect(page.getByLabel(/blog title/i, { exact: false })).toBeVisible()
            await expect(page.getByLabel(/url/i, { exact: false })).toBeVisible()
            await expect(page.getByRole('button', { name: /add blog/i})).toBeVisible()
        })

        test('Clicking on \'cancel\' when \'add blog\' form is visible hides the form', async ({ page }) => {
            const unfold_button = page.getByRole('button', { name: 'Add a blog' })
            await unfold_button.click()

            const cancel_button = page.getByRole('button', { name: /cancel/i })
            await cancel_button.click()

            await expect(page.getByLabel(/author/i, { exact: false })).not.toBeVisible()
            await expect(page.getByLabel(/blog title/i, { exact: false })).not.toBeVisible()
            await expect(page.getByLabel(/url/i, { exact: false })).not.toBeVisible()
            await expect(page.getByRole('button', { name: /add blog/i})).not.toBeVisible()
        })

        test('A new blog is added when the \'add blog\' form is submitted', async ({ page }) => {
            const unfold_button = page.getByRole('button', { name: 'Add a blog' })
            await unfold_button.click()

            const test_author = 'Test Author'
            const test_title = 'Test Blog Entry'
            const test_url = 'http://test.url.is'

            await page.getByLabel(/author/i, { exact: false}).fill(test_author)
            await page.getByLabel(/blog title/i, { exact: false }).fill(test_title)
            await page.getByLabel(/url/i, { exact: false }).fill(test_url)
            await page.getByRole('button', { name: /add blog/i}).click()

            await expect(page.getByText(`${test_title} by ${test_author} added.`, { exact:false })).toBeVisible()
            // div.blog span.blog_title
            await expect(page.locator('div.blog > span.blog_title', { hasText: `${test_title}`})).toBeVisible()
        })

    })

})