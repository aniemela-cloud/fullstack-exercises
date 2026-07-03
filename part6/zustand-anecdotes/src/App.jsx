import Filter from './components/Filter'
import Notification from './components/Notification'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { useEffect } from 'react'
import { useAnecdoteActions } from './store'

const App = () => {
  const { initialize } = useAnecdoteActions()
  
  useEffect(() => {
      initialize()
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