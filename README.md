# Northcoders News API - MW build

## Project summary

An API for the purpose of accessing application data programmatically. Mimicking a backend service (such as reddit) providing the data to the front end architecture. Database used is PSQL.

## Hosted version URL

[mw-news.herokuapp.com/api/](https://mw-news.herokuapp.com/api/)

## Available endpoints

```http
GET /api (provides detailed information on all available endpoints)
GET /api/topics
GET /api/articles
GET /api/articles/:article_id
PATCH /api/articles/:article_id
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
GET /api/users/:username
```

## Environment requirements

- Node.js - version v12 and above
- Postgres - version v12.0 and above

# Instructions

### Step 1 - Project set-up

- fork and clone the repository here [nc-news](https://github.com/maria-walker/be-nc-news)

- run the following commands to install the necessary dependencies:

- - npm i express pg pg-format dotenv
- - npm i jest jest-sorted supertest

- familiarise yourself with the npm scripts provided in `package.json`.

### Step 2 - Database set-up

Create _two_ `.env` files: `.env.test` and `.env.development` using `.env-example` as a template. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Both `.env` files should be .gitignored.

`db` folder contains project data. `index.js` in each data folder exports out the data from that folder stored in separate files:

- `topicData`
- `articleData`
- `userData`
- `commentData`

### Step 3 - Creating tables and Seeding

`seed.js` contains async function (`seed`) that creates tables within the database and inserts data into them. Seed fuction is exported to `run-seed.js` where it's run with dev data. NPM script "run seed" runs `run-seed.js` and seeds the local database with development data.

### Step 4 - Testing

Utility functions used to format data for populating the database tables are tested using jest. Main app tests use supertest and jest-sorted in addition to jest.

Run `npm t utils` or `npm t app` in your terminal to perform tests on each file as required, or `npm t` to run both test suites together.
