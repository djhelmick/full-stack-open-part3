const express = require('express')
var morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1><div>This is the server for the part 3 exercises.</div>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>
      ${Intl.DateTimeFormat(undefined, 
      {
        dateStyle: 'full', 
        timeStyle: 'full'
      }).format(Date.now())}
    </div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: `${ !body.name ? 'name' : 'number' } is missing`
    })
  }
  else if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 99999 + 1)
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})