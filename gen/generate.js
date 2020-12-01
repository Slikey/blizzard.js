const fs = require('fs');
const specs = require('./specs');

const gameDeclaration = `/**
* Start of a game
*/
function {game}(blizzard) {
  {resource_instances}
}

{resources}

/* End of a game */`;
const resourceDeclaration = `/**
* Start of a {name}
*/
function {resource}(blizzard) {
  this.blizzard = blizzard;
}

{functions}
/* End of a {resource} */`;
const methodDeclaration = `/**
* {name}
*
* {description}
*/
{resource}.prototype.{function_name} = function({parameters}) {
  return this.blizzard.{httpMethod}({path}, {args});
}`;

function transformResourceName(name) {
  let res = name;
  res = res.replaceAll(' ', '');

  return res;
}

function transformMethodName(name) {
  let res = name;
  res = res.replaceAll(' ', '');
  res = `${res.substr(0, 1).toLowerCase()}${res.substr(1, res.length - 2)}`;

  return res
    .replaceAll('woW', 'wow')
    .replaceAll('pvP', 'pvp');
}

function generateMethod(resource, method) {
  const { name, description, path, httpMethod, parameters } = method;

  return methodDeclaration
    .replaceAll('{name}', name)
    .replaceAll('{description}', description)
    .replaceAll('{resource}', resource)
    .replaceAll('{function_name}', transformMethodName(name))
    .replaceAll('{parameters}', '{ ...args }')
    .replaceAll('{httpMethod}', httpMethod.toLowerCase())
    .replaceAll('{path}', `\`${path}\``)
    .replaceAll('{args}', '...args');
}

function generateResource(resource) {
  const { name, methods } = resource;
  const resourceName = transformResourceName(name);

  let methodsText = '';
  methods.forEach(method => {
    methodsText += `${generateMethod(resourceName, method)}\n`;
  });

  return resourceDeclaration
    .replaceAll('{name}', name)
    .replaceAll('{resource}', resourceName)
    .replaceAll('{functions}', methodsText);
}

function generateSpecification({ game, name }) {
  const localFile = specs.getLocalFile(game, name);
  const rawdata = fs.readFileSync(localFile);
  const { resources } = JSON.parse(rawdata);
  resources.forEach(resource => {
    console.log(generateResource(resource));
  });
}

function generate() {
  specs.forEachSpecification(generateSpecification);
}

generate();
