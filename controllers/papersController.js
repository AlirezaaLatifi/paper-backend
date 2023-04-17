const DB = {
  users: require("../models/users.json"),
  papers: require("../models/papers.json"),
  setPapers: function (data) {
    this.papers = data;
  },
};

const fsPromises = require("fs").promises;
const { json } = require("express");
const path = require("path");

function getAllPapers(req, res) {
  res.json({
    data: {
      papers: DB.papers,
    },
  });
}

function getUserPapers(req, res) {
  const reqUserID = Number(req.params.id);
  const foundUser = DB.users.find((user) => user.id === reqUserID);
  if (!foundUser) return res.status(400).json({ message: "wrong userID" });
  const foundUserPapers = DB.papers.filter(
    (paper) => paper.userID === foundUser.id
  );
  res.json({
    data: {
      papres: foundUserPapers,
    },
  });
}

// TODO: add Validation.
async function addPaper(req, res) {
  const paperData = req.body;
  let newPaper;
  if (paperData.type === "white") {
    newPaper = {
      id: DB.papers.length ? DB.papers[DB.papers.length - 1].id + 1 : 1,
      userID: paperData.userID,
      type: "white",
      text: paperData.text,
    };
  } else {
    newPaper = {
      id: DB.papers.length ? DB.papers[DB.papers.length - 1].id + 1 : 1,
      userID: paperData.userID,
      bookID: paperData.bookID,
      type: "cut",
      qoute: paperData.qoute,
      text: paperData.text,
    };
  }

  // updating database
  DB.setPapers([...DB.papers, newPaper]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "papers.json"),
    "\n" + JSON.stringify(DB.papers)
  );

  res.status(201).json({ message: "paper is added." });
}

async function deletePaper(req, res) {
  const foundPaper = DB.papers.find(
    (paper) => paper.id === Number(req.params.id)
  );
  if (!foundPaper) {
    return res
      .status(400)
      .json({ message: `Paper ID ${req.params.id} not found.` });
  }
  const newPapers = DB.papers.filter(
    (paper) => paper.id !== Number(req.params.id)
  );

  // updating database
  DB.setPapers(newPapers);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "papers.json"),
    "\n" + JSON.stringify(DB.papers)
  );

  res.status(200).json({ message: "paper removed successfully." });
}

async function editePaper(req, res) {
  const foundPaper = DB.papers.find(
    (paper) => paper.id === Number(req.params.id)
  );

  if (!foundPaper) {
    return res
      .status(400)
      .json({ message: `Paper ID ${req.params.id} not found.` });
  }
  const updatedPaper = { ...req.body, id: Number(req.params.id) };
  const otherPapers = DB.papers.filter(
    (paper) => paper.id !== Number(req.params.id)
  );
  const sortedPapers = [...otherPapers, updatedPaper].sort((a, b) => {
    return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
  });
  DB.setPapers(sortedPapers);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "papers.json"),
    "\n" + JSON.stringify(DB.papers)
  );
  res.json({ message: "paper is updated." });
}

module.exports = {
  getAllPapers,
  getUserPapers,
  addPaper,
  deletePaper,
  editePaper,
};
