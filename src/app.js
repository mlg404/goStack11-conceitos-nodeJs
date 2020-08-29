const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

function checkUuid (request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid project ID' })
  }

  return next();
}

app.use("/repositories/:id", checkUuid);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const data = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(data);

  return response.status(201).json(data);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  let repository = repositories.find(repo => repo.id == id)
  repository = { ...repository, title, url, techs };
  
  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  let repository = repositories.findIndex(repo => repo.id == id)
  repositories.splice(repository, 1);
  
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  let repository = repositories.find(repo => repo.id == id);
  repository.likes = repository.likes + 1;

  return response.status(201).json({ likes: repository.likes })

});

module.exports = app;
