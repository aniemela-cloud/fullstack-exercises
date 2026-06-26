import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach } from 'vitest'

const testBlogObject = {
  author: 'Test Author',
  title: 'Test Title',
  url: 'Test Url',
  likes: 7357,
  id: 'blog_test_id',
  user: {
    username: 'testuser',
    name: 'Test User',
    id: 'user_test_id'
  }
}
describe('Blog more/less button toggle behavior', () => {
  beforeEach(() => {
    render(<Blog blog={testBlogObject} />)
  })
  test('displays author and title, does not display url or likes', () => {
    const authorElement = screen.getByText('Test Author', { exact: false })
    expect(authorElement).toBeVisible()

    const titleElement = screen.getByText('Test Title', { exact: false })
    expect(titleElement).toBeVisible()

    const urlElement = screen.getByText('Test Url', { exact: false })
    expect(urlElement).not.toBeVisible()

    const likesElement = screen.getByText('7357', { exact: false })
    expect(likesElement).not.toBeVisible()
  })
  test('displays url and likes after toggling more/less button once; author and title also displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('more')
    await user.click(button)

    const urlElement = screen.getByText('Test Url', { exact: false })
    expect(urlElement).toBeVisible()

    const likesElement = screen.getByText('7357', { exact: false })
    expect(likesElement).toBeVisible()

    const authorElement = screen.getByText('Test Author', { exact: false })
    expect(authorElement).toBeVisible()

    const titleElement = screen.getByText('Test Title', { exact: false })
    expect(titleElement).toBeVisible()

  })
  test('does not display url and likes after toggling more/less button twice; author and title still displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('more')
    await user.click(button)

    const button_2 = screen.getByText('less')
    await user.click(button_2)

    const urlElement = screen.getByText('Test Url', { exact: false })
    expect(urlElement).not.toBeVisible()

    const likesElement = screen.getByText('7357', { exact: false })
    expect(likesElement).not.toBeVisible()
    const authorElement = screen.getByText('Test Author', { exact: false })
    expect(authorElement).toBeVisible()

    const titleElement = screen.getByText('Test Title', { exact: false })
    expect(titleElement).toBeVisible()
  })
})
describe('Blog like button behavior', () => {
  test('clicking the like button twice generates two callbacks', async() => {
    const mockUpdateLike = vi.fn()

    render(<Blog blog={testBlogObject} updateLike={mockUpdateLike}/>)

    const user = userEvent.setup()
    const button = screen.getByText('more')

    await user.click(button)
    // the 'like' button should now be visible
    const like_button = screen.getByText('like')

    await user.click(like_button)
    expect(mockUpdateLike.mock.calls).toHaveLength(1)

    await user.click(like_button)
    expect(mockUpdateLike.mock.calls).toHaveLength(2)
  })
})