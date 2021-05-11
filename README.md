# Pitufo - url

A simple url shortener with Fastify and Redis

# Install

## Clone
```sh
git clone git@github.com:cesg/pitufo-url.git
```

## Dependencies
```sh
npm i
```

## Env
```sh
cp .env.example .env
```

## Start
```sh
npm run start
```

# Usage
| URL           | Method | Body  | Response |   |
|---------------|--------|---------|----------|---|
| /             | POST   | { url } | { url }  |   |
| /:id          | GET    |         | { url }  |   |
| /redirect/:id | GET    |         |          |   |
