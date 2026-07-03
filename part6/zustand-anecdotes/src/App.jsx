import Filter from './components/Filter'
import Notification from './components/Notification'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import anecdoteService from './services/anecdotes'

const App = () => {
  const { initialize } = useAnecdoteActions()
  
  useEffect(() => {
    async function fetchData() {
      const fetchedAnecdotes = await anecdoteService.getAll()
      initialize(fetchedAnecdotes)
    }
    fetchData()
  }, [initialize])
  
  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App