<p align="center">
  <img src="./assets/icon.png" width="200" />
  <br/>
  Get more insights from PostgreSQL
</p>

DB Lens is an **open-source database client** that helps you to explore database, understand data relations more quickly with automatic ER diagrams, visualise and analyse internal DB metrics such as index utilisation sequential scans, slow running queries, storage and many more.

[![GitHub issues](https://img.shields.io/github/issues/dblens/app)](https://github.com/dblens/app/issues)
[![GitHub stars](https://img.shields.io/github/stars/dblens/app)](https://github.com/dblens/app/stargazers)
[![GitHub license](https://img.shields.io/github/license/dblens/app)](https://github.com/dblens/app)

## Features

- Database Viewer 🔍
- SQL Playground ⚡️
- Automatic ER Diagrams on existing schema 💃
- Connect with a click: simply connect to a DB by clicking on the connection string 🪄
- Usage Analysis: Understand how the database is beign used across tables
- Performance overview: Understand how frequently table/index are scanned and the slow queries.

## Setup dev env

### Prerequisites

NodeJS & yarn (NPM should also work but we are maintaining a yarn lock file only

### Steps

- install dependencies

```
yarn install
```

- to run the application

```
yarn start
```

- to build and package the application

```
yarn package
```

## Branching

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!
