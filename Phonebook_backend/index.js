require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')
// const { request } = require('express')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


morgan.token('content', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  else {
    return ' '
  }
})

/*
app.get('/info', (req, res) => {
  const utcDate1 = new Date(Date.now())
  res.send(`<p>Phonebook has info for ${persons.length} people </p> <p> ${utcDate1} </p>`)
})*/

/*app.get('/api/persons/:id', (req, res) => {
 const id = Number(req.params.id)
 const person = persons.find(person => person.id === id)
 if (person) {
   res.json(person)
 } else {
   res.status(404).end()
 }
})*/

/*
app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  res.json(person)
}) */


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  if (Person.find({ name: body.name }).length > 0) {
    return response.status(400).json({ error: 'Post name is already in the phonebook' })
  }
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has ${persons.length} registered people </p> <p> Date : ${new Date()} </p>`)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {

  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // working
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
