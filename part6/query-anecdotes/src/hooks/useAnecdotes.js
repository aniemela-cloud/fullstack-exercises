import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVotes, addAnecdote } from '../requests'
import useNotification from './useNotification'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification() 

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const addVoteMutation = useMutation({
    mutationFn: updateVotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      showNotification(`Add vote failed: ${error ? error.message : 'unknown reason'}`)
    }
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: addAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      showNotification(`Add anecdote failed: ${error ? error.message : 'unknown reason'}`)
    }

  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content }),
    addVote: (anecdote) => 
      addVoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })

  }
}