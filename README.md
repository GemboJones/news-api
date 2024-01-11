# NC Social News (back-end)


Back-End API for NC Social News, which handles articles, topics, comments and ratings (similar to Reddit) in a PSQL database, providing information to the front-end architecture.

### View the hosted API here: <a href="https://news-api-4x3j.onrender.com/api">NC Social News (back-end) ↗️</a>

View the Front-End Repo here: <a href="https://github.com/GemboJones/fe-nc-news">NC Social News (front-end)</a>

---

# Setup Instructions
### Requirements:
<ul>
<li>Node.js 17.x</li>
<li>Postgres 14.x</li>
</ul>

### Clone this repository:
```
git clone https://github.com/GemboJones/news-api.git
```

### Install dependencies:
```
npm install
```

### Create .env files:
You will need two .env files for your project: <strong>.env.test</strong> and <strong>.env.development</strong>.

Into .env.development, add:
```
PGDATABASE=nc_news
```

Into .env.test, add:
```
PGDATABASE=nc_news_test
```

### Create local database:
```
npm run setup-dbs
```

### Seed the database:
```
npm run seed
```

### To run tests:
```
npm test
```