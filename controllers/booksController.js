const { readBooks, writeBooks } = require('../utils/booksFile');

async function getAllBooks(req, res) {
  try {
    const books = await readBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to read books' });
  }
}

async function getBookById(req, res) {
  try {
    const id = Number(req.params.id);
    const books = await readBooks();

    const book = books.find((book) => book.id === id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to read book' });
  }
}

async function createBook(req, res) {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const books = await readBooks();

    const newId = books.length ? books[books.length - 1].id + 1 : 1;

    const newBook = {
      id: newId,
      title: title.trim(),
    };

    books.push(newBook);
    await writeBooks(books);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book' });
  }
}

async function updateBook(req, res) {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const books = await readBooks();

    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updatedBook = {
      id,
      title: title.trim(),
    };

    books[bookIndex] = updatedBook;
    await writeBooks(books);

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book' });
  }
}

async function deleteBook(req, res) {
  try {
    const id = Number(req.params.id);
    const books = await readBooks();

    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];
    await writeBooks(books);

    res.status(200).json({
      message: 'Book deleted successfully',
      book: deletedBook,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};