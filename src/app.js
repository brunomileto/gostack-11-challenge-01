const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

function getRepositoryByIndex(repoIndex){
  return repositories[repoIndex];
}

function getRepositoryIndexById(repoId){
  return repositories.findIndex(repository => repository.id === repoId);
}

function repositoryExists(id){
  return (getRepositoryIndexById(id)>=0);
};

function hasId(params){
  console.log(typeof params.id === 'undefined')
  return (typeof params.id !== 'undefined')  
}

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];



function validations(request, response, next){
  console.log(typeof request.params.id === 'undefined');
  console.log(isUuid());
  if (hasId(request)){
    const {id} = request.params === null ? 0 : request.params.id;
    const repoExist = repositoryExists(id);
    console.log(id);
    if (!isUuid()){
      return response.status(400).json({error: "Invalid repository ID."})
    };
  
    if (!repoExist){
      return response.status(400).json({error: "Repository not found."})
    };
  }

  next();
};

//app.use(validations);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(newRepository);
  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(x => x.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error:'Repo not found'})
  }
  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  if (!repositoryExists(id)){
    return response.status(400).json({error: "Repo does not exist!"});
  }
  repostioryIndex = getRepositoryIndexById(id);
  repositories.splice(repostioryIndex, 1)
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id, like} = request.params;
  if(!repositoryExists(id)){
    return response.status(400).json({error:'Repo does not exist!'})
  }

  const repoIndex = repositories.findIndex(x => x.id === id);
  repositories[repoIndex].likes += 1

  return response.status(200).json(repositories[repoIndex]);

});

app.listen(3333, () =>{
  console.log('Back-end started!');
});

module.exports = app;
