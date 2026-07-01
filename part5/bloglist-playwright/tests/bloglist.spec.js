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

    test('Link to login is shown when no user is logged in', async ({ page }) => {
        const login_link = page.getByRole('link', { name: 'login' })
        await expect(login_link).toBeVisible()
    })
    describe('Login:', () => {
        test('Login with incorrect password fails', async ({ page }) => {
            const login_link = page.getByRole('link', { name: 'login' })
            await login_link.click()

            const username_field = page.getByLabel('username')
            const password_field = page.getByLabel('password')

            await username_field.fill(helper.test_username)
            await password_field.fill('playwright12345')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Login failed', { exact: false })).toBeVisible()
        })

        test('Login with correct password is succesful', async ({ page }) => {
            const login_link = page.getByRole('link', { name: 'login' })
            await login_link.click()

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
        test('Clicking on \'New blog\' shows \'add blog\' form', async ({ page }) => {
            const new_blog_link = page.getByRole('link', { name: 'New blog' })
            await new_blog_link.click()

            await expect(page.getByLabel(/author/i, { exact: false })).toBeVisible()
            await expect(page.getByLabel(/blog title/i, { exact: false })).toBeVisible()
            await expect(page.getByLabel(/url/i, { exact: false })).toBeVisible()
            await expect(page.getByRole('button', { name: /add blog/i})).toBeVisible()
        })

        test('A new blog is added when the \'add blog\' form is submitted', async ({ page }) => {
            const new_blog_link = page.getByRole('link', { name: 'New blog' })
            await new_blog_link.click()

            const test_author = 'Test Author'
            const test_title = 'Test Blog Entry'
            const test_url = 'http://test.url.is'

            await page.getByLabel(/author/i, { exact: false}).fill(test_author)
            await page.getByLabel(/blog title/i, { exact: false }).fill(test_title)
            await page.getByLabel(/url/i, { exact: false }).fill(test_url)
            await page.getByRole('button', { name: /add blog/i}).click()

            await expect(page.getByText(`${test_title} by ${test_author} added.`, { exact:false })).toBeVisible()
            // div.blog span.blog_title
            await expect(page.locator('li', { hasText: `${test_title}`})).toBeVisible()
        })

        test('Clicking on a blog navigates to the blog details', async ({ page }) => {
            const test_author = 'Test Author'
            const test_title = 'Test Blog Entry'
            const test_url = 'http://test.url.is'

            await helper.createPost(page, { author: test_author, title: test_title, url: test_url })
            await page.getByRole('link', { name: `${test_title}` } ).click()
            await expect(page.getByText(test_author, { exact: true })).toBeVisible()
            await expect(page.getByText(test_title, { exact: true })).toBeVisible()
            await expect(page.locator('div.blog_likes')).toBeVisible()
            await expect(page.locator('div.blog_url')).toBeVisible()
        })

        test('A blog can be liked, and liking increases like count', async ({ page }) => {
            const test_author = 'Test Author'
            const test_title = 'Test Blog Entry'
            const test_url = 'http://test.url.is'

            await helper.createPost(page, { author: test_author, title: test_title, url: test_url })
            await page.getByRole('link', { name: `${test_title}` } ).click()

            const like_button = page.getByRole('button', { name: /like/i })
            await like_button.click()
            await expect(page.locator('div.blog_likes').getByText('Likes: 1')).toBeVisible()

        })

        test('A blog can be deleted by the user who created it', async ({ page }) => {
            const test_author = 'Test Author'
            const test_title = 'Deletion Test Blog Entry'
            const test_url = 'http://test.url.is/gonna_be_deleted'

            await helper.createPost(page, { author: test_author, title: test_title, url: test_url })
            await page.getByRole('link', { name: `${test_title}` } ).click()

            const delete_button = page.locator('div.blog_delete').getByRole('button', { name: /delete/i })
            await expect(delete_button).toBeVisible()
            page.on('dialog', dialog => dialog.accept())
            await delete_button.click()
            await expect(page.locator('li', { hasText: `${test_title}`})).not.toBeVisible()
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
            await page.getByRole('link', { name: `${test_title}` } ).click()
            await expect(page.locator('div.blog_likes')).toBeVisible()            
            await expect(page.locator('div.blog_delete').getByRole('button', { name: /delete/i })).not.toBeVisible()
        })
        /*
        test('Blogs are sorted according to likes', async ({ page }) => {
            const test_author = ['Test Author', 'Other Test Author', 'Third Test Author']
            const test_title = ['Test Blog Entry', 'Second Blog Entry', 'Third Blog Entry']
            const test_url = ['http://test.url.is/111', 'http://test.url.is/222', 'http://test.url.is/333']

            await helper.createPost(page, { author: test_author[0], title: test_title[0], url: test_url[0] })
            await helper.createPost(page, { author: test_author[1], title: test_title[1], url: test_url[1] })
            await helper.createPost(page, { author: test_author[2], title: test_title[2], url: test_url[2] })

            const blog_divs = [
                page.locator('div.blog').filter({ hasText: test_title[0] }),
                page.locator('div.blog').filter({ hasText: test_title[1] }),
                page.locator('div.blog').filter({ hasText: test_title[2] }),
            ]
            // then we get the like button for each of the blog entries
            // these references are maintained even if the posts are re-ordered
            // since they rely on filter() finding the correct div
            const like_buttons = [
                blog_divs[0].getByRole('button',{ name: "like"}),
                blog_divs[1].getByRole('button',{ name: "like"}),
                blog_divs[2].getByRole('button',{ name: "like"})
            ]
            // first we click all the more buttons; we use first() since clicking
            // the button turns it into a 'less' button
            for (let i=0; i<3; i++) {
                await page.getByRole('button', { name: 'more' }).first().click()                
            }
            // click the like button of the third post (no matter it's position) two times
            await like_buttons[2].click()
            await like_buttons[2].click()
            // now idx 2 should be at the top, assuming the nth updates when the order of objects
            // in the DOM updates... and it should?
            await expect(page.locator('div.blog').nth(0)).toContainText(test_title[2])
            // now click 'Second Blog Entry's like button three times
            await like_buttons[1].click()
            await like_buttons[1].click()
            await like_buttons[1].click()
            // and now it should be at the top
            await expect(page.locator('div.blog').nth(0)).toContainText(test_title[1])
            // and idx 2 is at the second position
            await expect(page.locator('div.blog').nth(1)).toContainText(test_title[2])
            // Click idx 1 one more time to make sure it maintains the top spot
            await like_buttons[1].click()
            // Then clic post 0's like button three times to move it from the last spot to
            // the second spot
            await like_buttons[0].click()
            await like_buttons[0].click()
            await like_buttons[0].click()
            await expect(page.locator('div.blog').nth(1)).toContainText(test_title[0])
            // Then two more clicks to take it to the top spot
            await like_buttons[0].click()
            await like_buttons[0].click()
            await expect(page.locator('div.blog').nth(0)).toContainText(test_title[0])
        })
        */
    })

})