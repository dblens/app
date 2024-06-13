#!/usr/bin/env node

const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');
const { argv } = require('process');

const dev = process.env.NODE_ENV !== 'production';

// Parse the command-line argument for the connection string
const connectionString = argv[2];

if (!connectionString) {
  console.error('Please provide a connection string as an argument.');
  process.exit(1);
}

console.log(`Using connection string: ${connectionString}`);

// Set the environment variable
process.env.CONNECTION_STRING = connectionString;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3253, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3253');
  });
});
