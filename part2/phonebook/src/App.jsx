import { useState } from 'react'

const Phonebook = ({persons}) => {
  return (
    <div>
      {persons.map((person) => <Person person={person} key={person.name}/>)}
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
    { name: 'Arto Hellas',
      number: '040-1234567'
     }
  ]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

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

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input name="newNameInput" onChange={handleNameChange} value={newName} /> <br />
          number: <input name="newNumberInput" onChange={handleNumberChange} value={newNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        <Phonebook persons={persons} />
    </div>
  )
}

export default App