const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
let persons = require("./api");

const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const count = persons.length;
  const time = new Date();
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${time}</p>
  `);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/persons", (reqeust, response) => {
  const body = reqeust.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const nameExists = persons.find((person) => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({ error: "name must be unique" });
  }

  if (!body) {
    return response.status(400).json({ error: "content missing" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
