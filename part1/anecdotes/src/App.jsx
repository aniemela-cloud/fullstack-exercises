import { useState } from 'react'

const NumVotesInfo = ({votes, selected}) => {
  let votetext = "no votes"
  if(votes[selected]) {
    votetext = votes[selected] + " votes"
  }
  return (
    <p>has {votetext}</p>
  )
}

const BestAnecdote = ({votes, anecdotes}) => {
  let idx = 0;
  let mostvotes = 0;
  for (let i = 0; i < votes.length; i++) {
    if(votes[i] > mostvotes) {
      mostvotes = votes[i]
      idx = i
    }
  }
  // This could check for the case where all anecdotes have zero votes
  // and display a different message, but that was not required in the exercise
  return (
    <div>
      <h1>Anecdote with the most votes</h1>
      <p>{anecdotes[idx]}</p>
    </div>
  )

}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  // votes array is an empty array of anecdotes.length elements; the code displaying
  // the votes needs to handle both 'undefined' and '0' and the code adding votes
  // needs to do the same, too
  const [votes, setVotes] = useState(Array(anecdotes.length))
  const [selected, setSelected] = useState(0)

  const setRandom = () => {
    console.log("randomizing, selected was ", selected)
    let newval = Math.floor(Math.random() * anecdotes.length)
    console.log("Setting to ",newval)
    setSelected(newval)
  }

  const voteFor = (i) => { 
    return () => {
      console.log("voting for ",i)
      let newvotes = [...votes]
      if(newvotes[i]) {
        // it's not undefined or 0
        newvotes[i] += 1
      } else {
        newvotes[i] = 1
      }
      setVotes(newvotes)
    }
  }
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <NumVotesInfo votes={votes} selected={selected} />
      <button onClick={voteFor(selected)}>
        vote
      </button>
      <button onClick={setRandom}>
        New anecdote!
      </button>
      <BestAnecdote votes={votes} anecdotes={anecdotes} />
    </div>
  )
}

export default App