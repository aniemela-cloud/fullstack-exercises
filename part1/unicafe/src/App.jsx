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
      <FeedbackButton text="bad" onClick={addBad} />
    </div>
  )
}

const Stats = ({good, neutral, bad}) => {
  let total = good+neutral+bad;
  if (total <= 0) {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  } else {
    return (
      <div>
        <h2>statistics</h2>
        <table>
          <tbody>
            <SpecificStatus text="good" count={good} />
            <SpecificStatus text="neutral" count={neutral} />
            <SpecificStatus text="bad" count={bad} />
            <SpecificStatus text="all" count={total} />
            <SpecificStatus text="average" count={(good - bad) / total} />
            <SpecificStatus text="positive" count={(good * 100 / total) + " %"} />
          </tbody>
        </table>
      </div>
    )
  }
}

const SpecificStatus = ({text, count}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{count}</td>
    </tr>
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