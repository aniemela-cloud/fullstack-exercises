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
    <p>{person.name}</p>
  )
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]); 
  const [newName, setNewName] = useState('');

  const addName = (event) => {
    event.preventDefault();
    //console.log("addName: ", event)
    const newPerson = {
      name: newName
    };
    const found = persons.find(
      (element) => element.name.toLowerCase() === newPerson.name.toLowerCase()
    );
    if (found === undefined) {
      //console.log("addName newPerson: ",newPerson);
      setPersons(persons.concat(newPerson));
      setNewName('');
    } else {
      alert(`${newPerson.name} is already in the phonebook`)
    }
  };

  const handleNameChange = (event) => {
    //console.log("handleNameChange, target", event.target);
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input name="newNameInput" onChange={handleNameChange} value={newName} />
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