const fs = require('fs/promises');
const path = require('path');

const booksPath = path.join(__dirname, '..', 'data', 'books.json');

async function readBooks() {
  const data = await fs.readFile(booksPath, 'utf-8');
  return JSON.parse(data);
}

async function writeBooks(books) {
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
}

module.exports = {
  readBooks,
  writeBooks,
};