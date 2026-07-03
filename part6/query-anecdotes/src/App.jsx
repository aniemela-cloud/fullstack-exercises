import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './requests'


const App = () => {
  const handleVote = (anecdote) => {
    console.log('vote', anecdote ? anecdote.id : '')
  }

/*  const anecdotes = [
    {
      content: 'If it hurts, do it more often',
      id: '47145',
      votes: 0,
    },
  ] */

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  if (result.isPending) {
    return (
      <div>
        <h3>Anecdote app</h3>
        <div>Loading data...</div>
      </div>
    )
  }

  if (result.isError) {
    return (
      <div>
        <h3>Anecdote app</h3>
        <div>Error loading data: {result.error.message} </div>
      </div>
    )
  }

  const anecdotes = result.data
  console.log('tanstack result', result.data)
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