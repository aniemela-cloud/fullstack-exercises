import { useField } from '../hooks/useField'
import { useNavigate } from 'react-router-dom'
import { useAnecdotes } from '../hooks/useAnecdotes'

const CreateNew = () => {
  const {reset: cReset, ...content} = useField('text')
  const {reset: aReset, ...author} = useField('text')
  const {reset: iReset, ...info} = useField('text')
  const navigate = useNavigate()

  const { addAnecdote } = useAnecdotes()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({ content: content.value, author: author.value, info: info.value, votes: 0 })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    cReset()
    aReset()
    iReset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button><button type="reset">reset</button>
      </form>
    </div>
  )
}

export default CreateNew
