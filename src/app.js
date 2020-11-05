const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  repo = {
    id: uuid(),
    title, 
    url,
    techs,
    likes: 0,
  }
  repositories.push(repo);
  return response.status(200).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json( { "error": "Project ID is not valid."});
  }

  repoIndex  = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Project not found."});
  }
  actualRepo = repositories[repoIndex] = repo;
  repo = {
    ...actualRepo,
    title,
    url,
    techs,
  }
  repositories[repoIndex] = repo;
  return response.json( repo );

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  repoIndex = repositories.findIndex(repository => repository.id == id);
  if ( repoIndex < 0 ){
    return response.status(400).json({ "error": "Project not found."});
  }
  repositories.splice(repoIndex, 1);
  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repository => repository.id == id);
  if ( repoIndex < 0 ) {
    return response.status(400).json( { "error": "Project not found."});
  }
  repositories[repoIndex].likes += 1;
  return response.json({ "likes": repositories[repoIndex].likes })
});

module.exports = app;
