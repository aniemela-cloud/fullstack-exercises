import { useFeedbackStore } from './store'

const Buttons = () => {
  const incrementGood = useFeedbackStore(state => state.incrementGood)
  const incrementBad = useFeedbackStore(state => state.incrementBad)
  const incrementNeutral = useFeedbackStore(state => state.incrementNeutral)
  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>
    </div>
  )
}

export default Buttons
