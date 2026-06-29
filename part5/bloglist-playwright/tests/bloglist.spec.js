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

        test('A blogs likes are not shown by default; clicking \'more\' shows likes, clicking \'less\' re-hides them ', async ({ page }) => {
            const test_author = 'Test Author'
            const test_title = 'Test Blog Entry'
            const test_url = 'http://test.url.is'

            await helper.createPost(page, { author: test_author, title: test_title, url: test_url })
            // sanity check that a blog has been added to the page
            await expect(page.locator('div.blog > span.blog_title', { hasText: `${test_title}`})).toBeVisible()
            const more_button = page.locator('div.blog').getByRole('button', { name: /more/i, exact: false })
            await expect(more_button).toBeVisible()
            await more_button.click()
            await expect(page.locator('div.blog_extra > div.blog_likes')).toBeVisible()
            await expect(page.locator('div.blog_extra > div.blog_url')).toBeVisible()
            const less_button = page.locator('div.blog').getByRole('button', { name: /less/i, exact:false })
            await expect(less_button).toBeVisible()
            await less_button.click()
            await expect(page.locator('div.blog_extra > div.blog_likes')).not.toBeVisible()
            await expect(page.locator('div.blog_extra > div.blog_url')).not.toBeVisible()
        })


        test('A blog can be liked, and liking increases like count', async ({ page }) => {
            const test_author = 'Test Author'
            const test_title = 'Test Blog Entry'
            const test_url = 'http://test.url.is'

            await helper.createPost(page, { author: test_author, title: test_title, url: test_url })
            const more_button = page.locator('div.blog').getByRole('button', { name: /more/i, exact: false })
            await more_button.click()
            const like_button = page.locator('div.blog_extra').getByRole('button', { name: /like/i })
            await like_button.click()
            await expect(page.locator('div.blog_extra > div.blog_likes').getByText('Likes: 1')).toBeVisible()

        })

        test('A blog can be deleted by the user who created it', async ({ page }) => {
            const test_author = 'Test Author'
            const test_title = 'Deletion Test Blog Entry'
            const test_url = 'http://test.url.is/gonna_be_deleted'

            await helper.createPost(page, { author: test_author, title: test_title, url: test_url })
            const more_button = page.locator('div.blog').getByRole('button', { name: /more/i, exact: false })
            await more_button.click()
            const delete_button = page.locator('div.blog_delete').getByRole('button', { name: /delete/i })
            await expect(delete_button).toBeVisible()
            page.on('dialog', dialog => dialog.accept())
            await delete_button.click()
            await expect(page.locator('div.blog > span.blog_title', { hasText: `${test_title}`})).not.toBeVisible()
        })

        test('User who did not create the blog does not see a delete button', async ({ page, request }) => {
            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Deletion Helper',
                    username: 'deleteuser',
                    password: 'delete123'
                }
            })
            const test_author = 'Test Author'
            const test_title = 'Deletion Test Blog Entry'
            const test_url = 'http://test.url.is/gonna_be_deleted'
            // Create post with the user automatically logged in with for the test
            await helper.createPost(page, { author: test_author, title: test_title, url: test_url })
            // Log out
            const logout_button = page.getByRole('button', { 'name': /logout/i })
            await(expect(logout_button)).toBeVisible()
            await logout_button.click()
            // Log in with the user created for this specific test
            await helper.loginWith(page, 'deleteuser', 'delete123')
            const more_button = page.locator('div.blog').getByRole('button', { name: /more/i, exact: false })
            await more_button.click()
            await expect(page.locator('div.blog_delete').getByRole('button', { name: /delete/i })).not.toBeVisible()
        })

    })

})