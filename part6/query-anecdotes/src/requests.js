const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if(!response.ok) {
    throw new Error(`Failed to fetch anecdotes: ${response.status} ${response.statusText}`)
  }
  return await response.json()
}

export const addAnecdote = async ({ content }) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create anecdote: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

export const updateVotes = async ({id, votes}) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ votes: votes })
  })

  if (!response.ok) {
    throw new Error('Failed to update vote count')
  }

  return await response.json()
}
