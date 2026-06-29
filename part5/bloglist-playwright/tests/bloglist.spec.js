const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

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

})