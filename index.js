const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Sample data storage (in-memory)
const elections = [];

// POST endpoint to add an election
app.post('/elections', (req, res) => {
  const { id, name, numVoters } = req.body;

  // Create a new election object
  const newElection = {
    id,
    name,
    numVoters,
    subdomain: `sub${id}` // Create the subdomain
  };

  // Add the election to the array
  elections.push(newElection);

  res.json({ message: 'Election added successfully', election: newElection });
});

// GET endpoint to retrieve a specific election by ID
app.get('/elections/:id', (req, res) => {
  const electionId = parseInt(req.params.id);

  // Find the election with the specified ID
  const election = elections.find(election => election.id === electionId);

  if (election) {
    res.json(election);
  } else {
    res.status(404).json({ message: 'Election not found' });
  }
});

// Subdomain-specific route
app.use((req, res, next) => {
  const subdomainParts = req.hostname.split('.');
  const subdomain = subdomainParts[0];
  const election = elections.find(election => election.subdomain === subdomain);

  if (election) {
    res.send(`Welcome to the ${election.name} election!`);
  } else {
    next(); // Continue to the next middleware if subdomain is not found
  }
});

// GET endpoint to retrieve all elections
app.get('/elections', (req, res) => {
    res.json(elections);
  });  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




