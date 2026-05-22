const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <>
      <Part name={props.parts[0]} exercises={props.exercises[0]} />
      <Part name={props.parts[1]} exercises={props.exercises[1]} />
      <Part name={props.parts[2]} exercises={props.exercises[2]} />
    </>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.exercises[0] + props.exercises[1] + props.exercises[2]}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const parts_a = [part1,part2,part3]
  const exer_a = [exercises1,exercises2,exercises3]
  
  return (
    <div>
      <Header course={course} />
      <Content parts={parts_a} exercises={exer_a} />
      <Total exercises={exer_a} />
    </div>
  )
}

export default App