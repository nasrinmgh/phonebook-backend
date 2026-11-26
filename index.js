const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
let persons = require("./api");

const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());
const path = require("path");

app.use(express.static(path.join(__dirname, "frontend", "dist")));
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

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({ error: "content missing" });
  }
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
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
