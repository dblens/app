## DB View

## Setup dev env

### Prerequisites

1. NodeJS & NPM
2. docker and docker-compose (for postgres)

### Steps

- Start a local postgres instance
  create a file `docker-compose.yaml` with the following data

```yaml
services:
  postgres:
    image: postgres:12
    restart: always
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    environment:
      POSTGRES_PASSWORD: postgrespassword
```

- run `docker-compose up -d`
- make sure postgres is running on 5432

- clone this repo run `npm start` to start the dev server
