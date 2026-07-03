import { useAnecdoteActions, useAnecdotes, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { addVote } = useAnecdoteActions()
  const { setMessage } = useNotificationActions()

  const handleVote = (anecdote) => {
    addVote(anecdote.id)
    setMessage(`Voted for ${anecdote.content}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000);
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
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList