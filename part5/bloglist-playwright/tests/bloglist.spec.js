const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Playwright Test User',
                username: 'pw_test',
                password: 'playwright123'
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

            await username_field.fill('pw_test')
            await password_field.fill('playwright12345')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Login failed', { exact: false })).toBeVisible()
        })

        test('Login with correct password is succesful', async ({ page }) => {
            const username_field = page.getByLabel('username')
            const password_field = page.getByLabel('password')

            await username_field.fill('pw_test')
            await password_field.fill('playwright123')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Playwright Test User logged in',
                { exact: false })).toBeVisible()
        })
    })

})