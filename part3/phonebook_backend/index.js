const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();



let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

morgan.token('rq-body', (req, res) => {
    return JSON.stringify(req.body)
});

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny',{ skip: (req, res) => { return req.method === "POST" } }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :rq-body', 
    { skip: (req, res) => { return req.method !== "POST" }}));
// morgan format
// POST /api/persons 200 61 - 4.896 ms {"name":"foo","number":"bar"}
// :method :url :status :res[content-length] - :response-time ms :rq-body
app.get('/', (request, response) => {
    response.send('<h1>This is the phonebook backend</h1>')
});


app.get('/info', (request, response) => {
    let responseData = `<p>Phonebook has info on ${persons.length} people.</p>
<p>${Date()}</p>`;

    response.send(responseData)
});


app.get('/api/persons', (request, response) => {
    response.json(persons)
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const idx = persons.findIndex((person) => person.id === id);
    if (idx === -1) {
        response.status(404).end();
    } else {
        persons.splice(idx,1); // delete the found element by index
        response.status(204).end();
    }
})

app.post('/api/persons', (request, response) => {
    const randId = Math.floor(Math.random() * 10000).toString(36);
    let person = request.body;
    if (!person) {
        return response.status(400).json({
            error: "empty request body"
        });
    }
    if (typeof (person) !== "object") {
        return response.status(400).json({
            error: "malformed request body"
        });
    }
    if (!person.name) {
        return response.status(400).json({
            error: "name missing"
        });
    }
    if (!person.number) {
        return response.status(400).json({
            error: "number missing"
        });
    }
    if (persons.some((p) => p.name == person.name)) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }
    person = {
        name: person.name,
        number: person.number,
        id: randId
    }
    persons.push(person);
    response.json(person);
})


const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}
Started on: ${Date()}`)
});