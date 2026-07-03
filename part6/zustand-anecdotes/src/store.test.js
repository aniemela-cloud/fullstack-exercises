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
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('Anecdote Store actions', () => {
  test('initialize() loads anecdotes from anecdoteService', async () => {
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
  
  test('useAnecdotes() returns anecdotes sorted by votes', async () => {
    const mock_anecdotes = [
      { id: '1', content: 'Test', votes: 0 },
      { id: '2', content: 'Test 2', votes: 2 },
      { id: '3', content: 'Test 3', votes: 3 },      
    ]
    anecdoteService.getAll.mockResolvedValue(mock_anecdotes)
    const { result } = renderHook(() => useAnecdoteActions())

    const sorted_anecdotes = mock_anecdotes.toSorted((a, b) => b.votes - a.votes)

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(sorted_anecdotes)

  })

  test('useAnecdote() filters anecdotes based on the set filter', async () => {
    const aaa_anecdotes = [
      { id: '1', content: 'Aaa Test', votes: 5 },
      { id: '2', content: 'Aaa Test 2', votes: 4 },
      { id: '3', content: 'Aaa Test 3', votes: 3 },      
    ]
    const bbb_anecdotes = [
      { id: '4', content: 'Bbb Test', votes: 2 },
      { id: '5', content: 'Bbb Test 2', votes: 1 },
      { id: '6', content: 'Bbb Test 3', votes: 0 },      
    ]
    const xxx_anecdotes = [
      { id: '4', content: 'Xxx Test', votes: 2 },
      { id: '5', content: 'Xxx Test 2', votes: 1 },
      { id: '6', content: 'Xxx Test 3', votes: 0 },      
    ]
    const mock_anecdotes = aaa_anecdotes.concat(bbb_anecdotes, xxx_anecdotes)

    anecdoteService.getAll.mockResolvedValue(mock_anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
      await result.current.setFilter('aaa')
    })

    const { result: aaa_anecdotesResult } = renderHook(() => useAnecdotes())
    expect(aaa_anecdotesResult.current).toEqual(aaa_anecdotes)

    await act(async () => {
      await result.current.setFilter('bbb')
    })

    const { result: bbb_anecdotesResult } = renderHook(() => useAnecdotes())
    expect(bbb_anecdotesResult.current).toEqual(bbb_anecdotes)
  })

  test('addVote increases number of votes of an anecdote by 1', async () => {
    const mock_anecdotes = [
      { id: '1', content: 'Test', votes: 0 },
    ]
    anecdoteService.getAll.mockResolvedValue(mock_anecdotes)
    anecdoteService.updateVotes.mockImplementation(({id, votes}) => {
      return { id: id, content: 'Test', votes: votes }
    })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
      await result.current.addVote('1')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toEqual(1)
  })

})