const express = require('express');
const path = require('path');
const fsPromises = require('fs').promises
const marked = require('marked');

const app = express();
const port = process.env.PORT || 8080;

app.use('/okta-hosted-login', express.static(path.join(__dirname, 'okta-hosted-login/build')));

app.use('/custom-login', express.static(path.join(__dirname, 'custom-login/build')));

app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/okta-hosted-login')) {
    res.sendFile(path.resolve(__dirname, 'okta-hosted-login', 'build', 'index.html'));
  } else if (req.originalUrl.startsWith('/custom-login')) {
    res.sendFile(path.resolve(__dirname, 'custom-login', 'build', 'index.html'));
  } else if (req.originalUrl === '/') {
    fsPromises.readFile(path.resolve(__dirname, 'README.md'), 'utf8')
      .then(file => res.send(marked(file.toString(), { gfm: true })));
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(port, () => console.log(`App is live on port ${port}!`));
