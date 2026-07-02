
import { create } from 'zustand'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
/*
  actions: {
}
*/
  actions: {
    addVote: id => set(
      state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote
        ).sort((a,b) => b.votes - a.votes) 
        // we're applying sort() to the array created by .map(), which is a copy of
        // the original state.anecdotes array
      })
    ),
    addNew: anecdote => set(
      state => ({
        anecdotes: state.anecdotes.concat(asObject(anecdote))
      })
    ),
    setFilter: value => set(
      () => ({ filter: value })
    ),
    initialize: anecdotes => set(() => ({ anecdotes }))
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes.filter(
    (anecdote) => 
      (anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  )
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
