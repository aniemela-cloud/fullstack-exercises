const NewBlog = ({ onSubmit, newAuthor, onAuthorChange, newTitle, onTitleChange,
  newUrl, onUrlChange }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Add New Blog</h2>
        <div>
          <label>
            author: 
            <input type="text" onChange={onAuthorChange} value={newAuthor} />
          </label>
        </div>
        <div>
          <label>
            blog title: 
            <input type="text" onChange={onTitleChange} value={newTitle} />
          </label>
        </div>
        <div>
          <label>
            URL: 
            <input type="text" onChange={onUrlChange} value={newUrl} />
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