const fs = require('fs');
const path = require('path');
const https = require('https');

const specs = require('./specs');

function downloadSpecification({ root, game, name }) {
  const localPath = specs.getLocalPath(game);
  const filename = specs.getFilename(name);
  const localFile = specs.getLocalFile(game, name);
  const url = path.join(root, game, filename);
  console.log(`${game}    ${name}: ${url}`);

  https
    .get(url, res => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          fs.mkdirSync(localPath, { recursive: true }, err => {
            console.error(err);
          });
          fs.writeFileSync(localFile, body);
        } catch (error) {
          console.error(error.message);
        }
      });
    })
    .on('error', err => {
      console.error(err);
    });
}

function download() {
  specs.forEachSpecification(downloadSpecification);
}

download();
