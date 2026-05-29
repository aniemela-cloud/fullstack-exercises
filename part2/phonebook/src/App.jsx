import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

const Phonebook = ({persons, filter, deleteAction}) => {
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
      {personlist.map((person) => 
      <Person person={person} 
        key={person.id}
        deleteAction={() => deleteAction(person.id)}/>)}
    </div>
  )
}

const Person = ({person, deleteAction}) => {
  return (
    <p>{person.name}: {person.number} <button onClick={deleteAction}> delete </button></p>
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
  const [notifyMessage, setNotifyMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
          setNotifyMessage(`${data.name} added to phonebook.`);
          setTimeout(() => setNotifyMessage(null), 5000);
        });
    } else {
      let confResult = confirm(`${newPerson.name} is already in the phonebook. Replace their phone number with this one?`)
      if (confResult) {
        // get ID from the found record and store it in newPerson just in case;
        // JSON server documentation is rather sparse, and does not state what
        // happens with a PUT request if the data segment does not include the 
        // ID...
        newPerson.id = found.id;
        phonebookService.updateById(found.id, newPerson)
          .then(data => {
            // data should have a JS object with the data we sent to the server
            setPersons(persons.map(person => person.id === data.id ? data : person));
            setNotifyMessage(`${data.name} phone number updated.`);
            setTimeout(() => setNotifyMessage(null), 5000);
          })
      }
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

  const deleteActionFor = (phonebookId) => {
    console.log("deleteAction for ",phonebookId)
    phonebookService.deleteById(phonebookId)
      .then(result => {
        console.log('deleteById result: ', result)
        let deletedPerson = persons.find(person => person.id === phonebookId);
        setPersons(persons.filter(person => person.id !== phonebookId));
        setNotifyMessage(`${deletedPerson.name} removed from phonebook.`);
        setTimeout(() => setNotifyMessage(null), 5000);

      })
      .catch(error => {
        console.log('error caught from deleteById', error);
        setErrorMessage("That phonebook entry is no longer present on the server.");
        setTimeout(() => setErrorMessage(null), 5000)
    })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notifyMessage} className="notice" />
      <Notification message={errorMessage} className="error" />
      <PersonForm
        onSubmit={addName}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
        <Filter nameFilter={nameFilter} onChange={handleNameFilterChange} />
        <Phonebook persons={persons} filter={nameFilter} deleteAction={deleteActionFor} />
    </div>
  )
}

export default App