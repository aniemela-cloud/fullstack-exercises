import { create } from 'zustand'

export const useFeedbackStore = create(set => ({
  counter: 0,
  good: 0,
  bad: 0,
  neutral: 0,
  incrementGood: 
    () =>
      set(state => ({
        counter: state.counter + 1,
        good: state.good + 1
      })),
  incrementBad: 
    () =>
      set(state => ({
        counter: state.counter + 1,
        bad: state.bad + 1
      })),
  incrementNeutral:
    () =>
      set(state => ({
        counter: state.counter + 1,
        neutral: state.neutral + 1
      }))
}))