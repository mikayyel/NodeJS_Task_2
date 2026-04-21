const express = require('express');
require('dotenv').config();

const { connectDB } = require('./config/db');
const booksRoutes = require('./routes/booksRoutes');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/books', booksRoutes);

async function startServer() {
  const db = await connectDB();

  app.locals.db = db;

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  }); 
}

startServer();