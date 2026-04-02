const express = require('express');
const booksRoutes = require('./routes/booksRoutes');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/books', booksRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});