import { useAnecdoteActions, useAnecdotes, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { addVote, deleteAnecdote } = useAnecdoteActions()
  const { setMessage } = useNotificationActions()

  const handleVote = (anecdote) => {
    addVote(anecdote.id)
    setMessage(`Voted for ${anecdote.content}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000);
  }

  const handleDelete = (anecdote) => {
    deleteAnecdote(anecdote.id)
    setMessage(`Anecdote '${anecdote.content}' removed`)
    setTimeout(() => {
      setMessage(null)
    }, 5000);
  }

  const DeleteButton = ({anecdote}) => {
    // Instead of having a (value ? <button>delete</button> : ) in the
    // jsx return, I thought a nice little React component would be nice
    
    if (anecdote.votes > 0) {
      // deletion only for anecdotes with zero votes
      return null
    }
    return (
      <span>
        <button onClick={() => handleDelete(anecdote)}>delete</button>
      </span>
    )
  }

  console.log(anecdotes)
  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            <DeleteButton anecdote={anecdote} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList