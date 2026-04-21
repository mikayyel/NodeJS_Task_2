const { ObjectId } = require('mongodb');

async function getAllBooks(req, res) {
  try {
    const db = req.app.locals.db;
    const booksCollection = await db.collection('books').find().toArray();
    res.status(200).json(booksCollection);
  } catch(err) {
    res.status(500).json({
      message: 'Failed to fetch books',
      error: err.message
    });
  }
}

async function getBookById(req, res) {
  try {
    const id = req.params.id;

    if(!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const db = req.app.locals.db;

    const book = await db.collection('books').findOne({ 
      _id: new ObjectId(id)
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error(err);

    res.status(500).json({ 
      error: err.message,
      message: 'Failed to read book' 
    });
  }
}

async function createBook(req, res) {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const trimmedTitle = title.trim();
    const normalizedTitle = trimmedTitle.toLowerCase();

    const db = req.app.locals.db;

    const existingBook = await db.collection('books').findOne({
      normalizedTitle: normalizedTitle
    });

    if(existingBook) {
      return res.status(409).json({
        message: 'The book already exists'
      })
    } 

    const newBook = {
      title: trimmedTitle,
      normalizedTitle: normalizedTitle
    }

    const result = await db.collection('books').insertOne(newBook);

    res.status(201).json({
      message: 'Book created successfully',
      book: {
        _id: result.insertedId,
        ...newBook
      }
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ 
      error: err.message,
      message: 'Failed to create book' 
    });
  }
}

async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if(!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const trimmedTitle = title.trim();
    const normalizedTitle = trimmedTitle.toLowerCase();

    const db = req.app.locals.db;

    const isDuplicate = await db.collection('books').findOne({ 
      normalizedTitle: normalizedTitle,
      _id: { $ne: new ObjectId(id) }
    })

    if(isDuplicate) {
      return res.status(409).json({
        message: 'The book already exists'
      })
    }

    const result = await db.collection('books').updateOne(
      {_id: new ObjectId(id)},
      {
        $set: {
          title: trimmedTitle,
          normalizedTitle: normalizedTitle
        }
      }
    );

    if(result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    res.status(200).json({
      message: 'Book updated successfully',
      book: {
        _id: id,
        title: trimmedTitle,
        normalizedTitle: normalizedTitle
      }
    })
  } catch (err) {
    console.error(err);

    res.status(500).json({ 
      error: err.message,
      message: 'Failed to update book' 
    });
  }
}

async function deleteBook(req, res) {
  try {
    const id = req.params.id;

    if(!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const db = req.app.locals.db;

    const existingBook = await db.collection('books').findOne({
      _id: new ObjectId(id)
    });

    if(!existingBook) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    await db.collection('books').deleteOne({
      _id: new ObjectId(id)
    });

    res.status(200).json({
      message: 'Book deleted successfully'
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ 
      error: err.message,
      message: 'Failed to delete book' 
    });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};