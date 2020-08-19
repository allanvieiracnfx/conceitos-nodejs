const express = require("express");
const cors = require("cors");

const { v4: uuid, v4: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).send()
  }

  return next();
}

function validatedRepository(request, response, next){
  const { id } = request.params;

  const index = getIndexRepository(id);

  if(index < 0){
    return  response.status(400).send();
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId, validatedRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const repository = getNewRepository(request, 0, 0);
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = getIndexRepository(id);
  const likes = repositories[index].likes;
  repositories[index] = getNewRepository(request, id, likes);
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = getIndexRepository(id);
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = getIndexRepository(id);
  const repository = repositories[index];
  repository.likes += 1;
  return response.json(repository);
});

function getIndexRepository(id){
  return repositories.findIndex(repository => repository.id === id);
}

function getNewRepository(request, id, likes){
  const { title, url, techs } = request.body;
  id = id > 0 ? id : uuid();
  return repository = {
    id,
    url,
    title,
    techs,
    likes
  };
}

module.exports = app;
