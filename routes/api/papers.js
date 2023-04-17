const express = require("express");
const router = express.Router();
const papersController = require("../../controllers/papersController");

router
  .route("/")
  .get(papersController.getAllPapers)
  .post(papersController.addPaper);

router.get("/users/:id", papersController.getUserPapers);

router
  .route("/:id")
  .patch(papersController.editePaper)
  .delete(papersController.deletePaper);

module.exports = router;
