import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { anecdotes, isPending, isError, error, addVote } = useAnecdotes()
  
  const handleVote = (anecdote) => {
    addVote(anecdote)
    console.log('vote', anecdote ? anecdote.id : '')
  }

  if (isPending) {
    return (
      <div>
        <h3>Anecdote app</h3>
        <div>Loading data...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        <h3>Anecdote app</h3>
        <div>Error loading data: {error.message} </div>
      </div>
    )
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
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

export default App