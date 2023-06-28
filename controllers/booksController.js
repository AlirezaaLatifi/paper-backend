const books = require("../models/books.json");

function getAllBooks(req, res) {
  res.json(books);
}

function getBook(req, res) {
  const book = books.find((book) => book.id === Number(req.params.id));
  if (!book) {
    res.status(400).json({ message: `Book not found.` });
  }
  res.json(book);
}

function getSearchedBook(req, res) {
  const searchedTitle = req.query.title.toLowerCase();
  console.log(searchedTitle);
  if (!searchedTitle) return res.sendStatus(400);

  const foundBook = books.find(
    (book) => book.title.toLocaleLowerCase() === searchedTitle
  );

  if (!foundBook) {
    return res.status(404).json({ message: "searched book not found" });
  }

  res.json(foundBook);
}

module.exports = {
  getAllBooks,
  getBook,
  getSearchedBook,
};
