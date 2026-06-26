import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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

test('renders author and title, does not render url or likes', () => {
  render(<Blog blog={testBlogObject} />)

  const authorElement = screen.getByText('Test Author', { exact: false })
  expect(authorElement).toBeVisible()

  const titleElement = screen.getByText('Test Title', { exact: false })
  expect(titleElement).toBeVisible()

  const urlElement = screen.getByText('Test Url', { exact: false })
  expect(urlElement).not.toBeVisible()

  const likesElement = screen.getByText('7357', { exact: false })
  expect(likesElement).not.toBeVisible()

})