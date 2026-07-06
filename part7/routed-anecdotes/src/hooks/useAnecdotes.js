import { useContext, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'
import AnecdoteContext from '../components/AnecdoteContext'

export const useAnecdotes = () => {
  //const [anecdotes, setAnecdotes] = useState([])
  const { anecdotes, setAnecdotes } = useContext(AnecdoteContext)
  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  })

  const addAnecdote = (anecdote) => {
    anecdoteService.createNew(anecdote).then(data => setAnecdotes(anecdotes.concat(data)))
  }

  const deleteAnecdote = (anecdote) => {
    anecdoteService.deleteAnecdote(anecdote.id).then(
      data => setAnecdotes(anecdotes.filter(a => a.id !== data.id)))
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}