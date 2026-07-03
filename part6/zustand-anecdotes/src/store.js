
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import anecdoteService from './services/anecdotes'

const useNotificationStore = create ((set) => ({
  message: null,
  actions: {
    setMessage: (message) => set(() => ({ message }))
  }
}))

const useAnecdoteStore = create(devtools((set, get) => ({
  anecdotes: [],
  filter: "",
  /*
    actions: {
  }
  */
  actions: {
    addVote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.updateVotes({ ...anecdote, votes: anecdote.votes + 1 })
      set(state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? { ...anecdote, votes: updated.votes } : anecdote
        ).sort((a, b) => b.votes - a.votes)
        // we're applying sort() to the array created by .map(), which is a copy of
        // the original state.anecdotes array
      })
      )
    },
    addNew: anecdote => set(
      state => ({
        anecdotes: state.anecdotes.concat(anecdote)
      })
    ),
    deleteAnecdote: async (id) => {
      const deleted = await anecdoteService.deleteAnecdote(id)
      if (deleted) {
        set(state => ({
          anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
        })
        )
      }
    },
    setFilter: value => set(
      () => ({ filter: value })
    ),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll() 
      set(() => ({ anecdotes }))
    }
  },
})))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  console.log('in useAnecdotes:', anecdotes)
  return anecdotes ? anecdotes.filter(
    (anecdote) =>
      (anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  ) : []
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useNotification = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useAnecdoteStore
