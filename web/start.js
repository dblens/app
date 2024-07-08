#!/usr/bin/env node

const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');
const { argv, cwd, chdir } = require('process');
const path = require('path');

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

// Change working directory to the script's directory if necessary
const scriptDir = path.dirname(__filename);
chdir(scriptDir);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3253, async (err) => {
    if (err) throw err;
    console.log('DB lens | Opening http://localhost:3253');
    
    // Dynamically import the 'open' package
    const open = await import('open');
    // Open the URL in the default web browser
    open.default('http://localhost:3253');
  });
});
