import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

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
      {personlist.map((person) => <Person person={person} key={person.id}/>)}
    </div>
  )
}

const Person = ({person}) => {
  return (
    <p>{person.name}: {person.number}</p>
  )
};

const Filter = ({nameFilter, onChange}) => {
  return (
    <p>Filter by name:
      <input name="nameFilterInput" onChange={onChange} value={nameFilter} />
    </p>
  ) 
}

const PersonForm = ({onSubmit, newName, onNameChange, newNumber, onNumberChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <h2>Add new entry</h2>
        name: <input name="newNameInput" onChange={onNameChange} value={newName} /> <br />
        number: <input name="newNumberInput" onChange={onNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
/*
 <PersonForm 
  onSubmit={addName}
  newName={newName}
  onNameChange={handleNameChange}
  newNumber={newNumber}
  onNumberChange={handleNumberChange}
  />
  
*/
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    //console.log("effect triggered");
    phonebookService.getAll()
    .then(data => {
      setPersons(data)
    })
  }, []);

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
      // JSON server generates a unique ID for the entry when
      // POSTed in, so we don't have to think about it here.
      // Different backends would work differently, of course.
      phonebookService.addNew(newPerson)
      .then(data => {
        setPersons(persons.concat(data));
        setNewName('');
        setNewNumber('');
      });
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
      <PersonForm
        onSubmit={addName}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
        <Filter nameFilter={nameFilter} onChange={handleNameFilterChange} />
        <Phonebook persons={persons} filter={nameFilter}/>
    </div>
  )
}

export default App