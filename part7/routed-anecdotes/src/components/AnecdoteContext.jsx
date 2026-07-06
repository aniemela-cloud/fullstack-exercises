import { useState, createContext } from 'react'

const AnecdoteContext = createContext()

export default AnecdoteContext

export const AnecdoteContextProvider = (props) => {
  const [anecdotes, setAnecdotes] = useState([])

  return (
    <AnecdoteContext.Provider value={{ anecdotes, setAnecdotes }}>
      {props.children}
    </AnecdoteContext.Provider>
  )
}