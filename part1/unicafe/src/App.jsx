import { useState } from 'react'

const FeedbackButton = ({text,onClick}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Feedback = ({addGood,addNeutral,addBad}) => {
  return (
    <div>
      <h1>give feedback</h1>
      <FeedbackButton text="good" onClick={addGood} />
      <FeedbackButton text="neutral" onClick={addNeutral} />
      <FeedbackButton text="good" onClick={addBad} />
    </div>
  )
}

const Stats = ({good, neutral, bad}) => {
  return (
    <div>
      <h2>statistics</h2>
      <SpecificStatus text="good" count={good} />
      <SpecificStatus text="neutral" count={neutral} />
      <SpecificStatus text="bad" count={bad} />
    </div>
  )
}

const SpecificStatus = ({text, count}) => {
  return (
    <p>{text} {count}</p>
  )

}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => {
    console.log("addGood when good = ",good)
    setGood(good + 1)
  }
  const addNeutral = () => {
    console.log("addNeutral when neutral = ",neutral)
    setNeutral(neutral + 1)
  }
  const addBad = () => {
    console.log("addBad when bad = ",bad)
    setBad(bad + 1)
  }
  
  return (
    <div>
      <Feedback addGood={addGood} addNeutral={addNeutral} addBad={addBad} />
      <Stats good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App