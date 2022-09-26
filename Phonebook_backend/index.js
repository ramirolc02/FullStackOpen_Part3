
const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())
 // app.use(morgan('tiny'))
 const morgan = require('morgan')
 morgan.token('content', (req,res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body) 
  }
    else{
      return " ";
    }
  })
  
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons',(req,res)=>{
  res.json(persons)
})

app.get('/info',(req,res)=>{
   const utcDate1 = new Date(Date.now())
   res.send(`<p>Phonebook has info for ${persons.length} people </p> <p> ${utcDate1} </p>` )
})

app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person){
    res.json(person)
  }else{
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req,res)=>{
  const id = Number(req.params.id)
  persons=persons.filter(person => person.id != id)
  res.status(204).end()
})

const generateId = () => {
  min = 0
  max = 1000000
  const randomId = persons.length > 0
    ? Math.floor(Math.random()*(max-min+1)+min)
    : 0
  return randomId 
}

app.post('/api/persons',(req,res)=>{
   const body = req.body
   if (!body.name ) {
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
    id:generateId(),
    name: body.name,
    number: body.number
   }
   persons = persons.concat(person)
   res.json(person)
  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)