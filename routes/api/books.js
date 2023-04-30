const express = require("express");
const router = express.Router();
const booksController = require("../../controllers/booksController");

router.get("/", booksController.getAllBooks);
router.get("/search", booksController.getSearchedBook);
router.get("/:id", booksController.getBook);

module.exports = router;
