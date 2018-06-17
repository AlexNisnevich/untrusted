'use strict';

const express = require('express');
const ecstatic = require('../lib/ecstatic');
const http = require('http');

const app = express();

app.use(ecstatic({
  root: `${__dirname}/public`,
  showdir: true,
}));

http.createServer(app).listen(8080);

console.log('Listening on :8080');
