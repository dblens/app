<p align="center">
  <img src="./assets/icon.png" width="200" />
  <br/>
  Get more insights from PostgreSQL

</p>


DB Lens is an **open-source database client** that helps you to explore database, understand data relations more quickly with automatic ER diagrams, visualise and analyse internal DB metrics such as index utilisation sequential scans, slow running queries, storage and many more.

[![GitHub issues](https://img.shields.io/github/issues/dblens/app)](https://github.com/dblens/app/issues)
[![GitHub stars](https://img.shields.io/github/stars/dblens/app)](https://github.com/dblens/app/stargazers)
[![GitHub license](https://img.shields.io/github/license/dblens/app)](https://github.com/dblens/app)


## Don't want to install?

Try running 
```sh
npx dblens <connection_string>
# npx dblens postgres://user:pass@host/db
```
from your terminal

## Features
>Note : Some features are not available on the browser version yet.

![1](https://user-images.githubusercontent.com/8408875/174975064-6683c826-15e5-4ddc-b421-eb45024262ec.jpg)

![3](https://user-images.githubusercontent.com/8408875/174975231-01990182-e633-4456-b34a-dad542e6fc28.jpg)

![5](https://user-images.githubusercontent.com/8408875/174975214-840c3ba8-57a5-4636-b42f-61f61fb408cc.jpg)

![4](https://user-images.githubusercontent.com/8408875/174975248-63bbeb5e-c830-4193-8c48-7c8570de9fe5.jpg)

![2](https://user-images.githubusercontent.com/8408875/174975318-dbdae2db-ece4-4151-bdad-e94a62f85614.jpg)

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
