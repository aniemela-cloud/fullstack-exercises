const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = ({parts}) => {
  return (
    <>
      {parts.map((part) => <Part name={part.name} exercises={part.exercises} key={part.id}/>)}
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

const Total = ({parts}) => {
  let total_exercises =  parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises,
    0
  );
/*  parts.forEach(element => {
    total_exercises += element.exercises  
  }); */
  return (
    <p><b>total of {total_exercises} exercises</b></p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = { 
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  };
  return (
    <Course course={course} />
  )
}

export default App