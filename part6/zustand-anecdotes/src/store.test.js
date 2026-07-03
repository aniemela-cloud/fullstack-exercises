import { beforeEach, describe, expect, test, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'


vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    updateVotes: vi.fn(),
    deleteAnecdote: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('Anecdote Store actions', () => {
  test('initialize loads anecdotes from anecdoteService', async () => {
    const mock_anecdotes = [
      { id: '1', content: 'Test', votes: 0 },
    ]
    anecdoteService.getAll.mockResolvedValue(mock_anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mock_anecdotes)
  })
})