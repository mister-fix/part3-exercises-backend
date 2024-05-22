const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 3001;

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.use(express.json());

morgan.token("body", (request) => {
	if (request.method === "POST") {
		return JSON.stringify(request.body);
	}

	return "";
});

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (request, response) => {
	response.send(
		`<p>Phonebook has info for ${
			persons.length
		} people <br /> ${new Date()}</p>`
	);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((p) => p.id === id);

	response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons.filter((person) => person.id !== id);

	response.status(204).end();
});

const generateId = () => {
	const newId = Math.floor(Math.random() * 9000) + 1000;
	const isUnique = !persons.some((person) => person.id === newId);

	return isUnique ? newId : generateId();
};

const checkPerson = (name) => {
	return persons.some(
		(person) => person.name.toLowerCase() === name.toLowerCase()
	);
};

app.post("/api/persons/", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name or number is missing",
		});
	} else if (checkPerson(body.name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	persons = persons.concat(person);

	response.json(person);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
