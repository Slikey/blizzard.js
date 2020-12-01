const fs = require('fs');
const path = require('path');

function forEachSpecification(fn) {
  const rawdata = fs.readFileSync(path.join(__dirname, 'schemas.json'));
  const data = JSON.parse(rawdata);

  const { root, games } = data;
  Object.entries(games).forEach(([game, apis]) => {
    apis.forEach(name => {
      fn({ root, game, name });
    });
  });
}

function getLocalPath(game) {
  return path.join(__dirname, 'files', game);
}

function getFilename(name) {
  return `${name}.json`;
}

function getLocalFile(game, name) {
  return path.join(getLocalPath(game), getFilename(name));
}

module.exports = {
  forEachSpecification,
  getLocalPath,
  getFilename,
  getLocalFile,
};
