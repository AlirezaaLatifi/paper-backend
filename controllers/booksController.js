const books = require("../models/books.json");

function getAllBooks(req, res) {
  res.json({
    data: {
      books,
    },
  });
}

function getBook(req, res) {
  const book = books.find((book) => book.id === Number(req.params.id));
  if (!book) {
    res.status(400).json({ error: `Book ID ${req.params.id} not found.` });
  }
  res.json(book);
}

module.exports = {
  getAllBooks,
  getBook,
};
