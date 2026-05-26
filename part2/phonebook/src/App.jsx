import { useState } from 'react'

const Phonebook = ({persons, filter}) => {
  let personlist;
  if(filter) {
    personlist = persons.filter(
      (element) => element.name.toLowerCase().includes(filter.toLowerCase())
    );
  } else {
    personlist = persons;
  }
  return (
    <div>
      {personlist.map((person) => <Person person={person} key={person.name}/>)}
    </div>
  )
}

const Person = ({person}) => {
  return (
    <p>{person.name}: {person.number}</p>
  )
};

const App = () => {
 const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');


  const addName = (event) => {
    event.preventDefault();
    //console.log("addName: ", event)
    const newPerson = {
      name: newName,
      number: newNumber
    };
    const found = persons.find(
      (element) => element.name.toLowerCase() === newPerson.name.toLowerCase()
    );
    if (found === undefined) {
      //console.log("addName newPerson: ",newPerson);
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
    } else {
      alert(`${newPerson.name} is already in the phonebook`)
    }
  };

  const handleNameChange = (event) => {
    //console.log("handleNameChange, target", event.target);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <form onSubmit={addName}>
        <div>
          <h2>Add new entry</h2>
          name: <input name="newNameInput" onChange={handleNameChange} value={newName} /> <br />
          number: <input name="newNumberInput" onChange={handleNumberChange} value={newNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <p>Filter by name: <input name="nameFilterInput" onChange={handleNameFilterChange} value={nameFilter} /></p>
        <Phonebook persons={persons} filter={nameFilter}/>
    </div>
  )
}

export default App