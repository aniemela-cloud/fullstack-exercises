import { useState } from 'react'
const NewBlog = ({ newBlog }) => {
  const [newAuthor, setAuthor] = useState('')
  const [newTitle, setTitle] = useState('')
  const [newUrl, setUrl] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    newBlog({ author: newAuthor, title: newTitle, url: newUrl })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Add New Blog</h2>
        <div>
          <label>
            author:
            <input type="text" onChange={({ target }) => setAuthor(target.value)} value={newAuthor} />
          </label>
        </div>
        <div>
          <label>
            blog title:
            <input type="text" onChange={({ target }) => setTitle(target.value)} value={newTitle} />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input type="text" onChange={({ target }) => setUrl(target.value)} value={newUrl} />
          </label>
        </div>
        <div>
          <button type="submit">Add Blog</button>
        </div>
      </form>
    </div>
  )
}

export default NewBlog