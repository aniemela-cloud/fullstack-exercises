import { useAnecdoteActions, useNotificationActions } from '../store'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const { addNew } = useAnecdoteActions()
  const { setMessage } = useNotificationActions()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const newAnecdote = await anecdoteService.createNew(content)
    addNew(newAnecdote)
    setMessage(`Added anecdote: ${newAnecdote.content}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000);

    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button name="create">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm