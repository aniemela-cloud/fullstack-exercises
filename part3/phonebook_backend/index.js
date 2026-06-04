require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const Person = require('./models/person');
/*
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
*/
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
    Person.estimatedDocumentCount().then(result => {
        response.send(`<p>Phonebook has info on ${result} people.</p>
<p>${Date()}</p>`);
    }).catch(error => {
        console.log('/info error', error);
    });
});


app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result);
    }).catch(error => {
        console.log('/api/persons error', error);
        response.status(500).end();
    });
    //response.json(persons)
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person);
        } 
        else {
            response.status(404).end();
        }        
    }).catch(error => {
        next(error);
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        if(result) {
            response.status(204).end();
        }
        else {
            response.status(404).end();
        }
    }).catch(error => {
        next(error);
    });
});

app.put('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndUpdate(request.params.id, 
        {number: request.body.number}, 
        {returnDocument:'after'}).then(result => {
            if(result) {
                console.log('findByIdAndUpdate done: ',result);
                response.json(result);
            }
            else {
                response.status(404).end();
            }
        }).catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    //const randId = Math.floor(Math.random() * 10000).toString(36);
    const person = request.body;
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
    Person.findOne({name:person.name}).then(result => {
        if(result) {
            // there was an entry with the same name
            return response.status(409).json({
                error: "name must be unique"
            });
        } else {
            const newPerson = new Person({
                name: person.name,
                number: person.number,
            });
            newPerson.save().then(result => {
                console.log(`Added ${result.name} number ${result.number} to phonebook.`);
                response.json(result);
            }).catch(error => {
                console.log('Error saving new phonebook entry: ', error);
                response.status(500).end();
            })    
        }
    }).catch(error => next(error));
    
})

const mongoCastErrorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name == "CastError") {
        response.status(400).send({ error: 'malformatted id' });        
    }
    next(error);
}

app.use(mongoCastErrorHandler);

const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}
Started on: ${Date()}`)
});