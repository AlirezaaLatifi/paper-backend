const DB = {
  users: require("../models/users.json"),
  papers: require("../models/papers.json"),
  setPapers: function (data) {
    this.papers = data;
  },
};

const fsPromises = require("fs").promises;
const { format } = require("date-fns");
const path = require("path");

function getAllPapers(req, res) {
  const responsePapers = DB.papers.map((paper) => {
    return {
      ...paper,
      user: DB.users.find((user) => user.id === paper.userID).username,
    };
  });

  res.json({
    data: {
      papers: responsePapers,
    },
  });
}

function getUserPapers(req, res) {
  const reqUserID = Number(req.params.id);
  const foundUser = DB.users.find((user) => user.id === reqUserID);
  if (!foundUser) return res.status(400).json({ message: "user not found" });
  const foundUserPapers = DB.papers.filter(
    (paper) => paper.userID === foundUser.id
  );
  res.json({
    data: {
      papres: foundUserPapers,
    },
  });
}

// TODO: Validation.
async function addPaper(req, res) {
  const paperData = req.body;
  console.log(paperData);
  let newPaper;
  if (paperData.type === "white") {
    newPaper = {
      id: DB.papers.length ? DB.papers[DB.papers.length - 1].id + 1 : 1,
      userID: DB.users.find((user) => user.username === paperData.username).id,
      type: "white",
      text: paperData.text,
      createdDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
  } else {
    newPaper = {
      id: DB.papers.length ? DB.papers[DB.papers.length - 1].id + 1 : 1,
      userID: DB.users.find((user) => user.username === paperData.username).id,
      bookID: paperData.bookID,
      bookTitle: paperData.bookTitle,
      type: "cut",
      qoute: paperData.qoute,
      text: paperData.text,
      createdDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
  }

  // updating database
  DB.setPapers([...DB.papers, newPaper]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "papers.json"),
    JSON.stringify(DB.papers)
  );

  res.sendStatus(201);
}

async function deletePaper(req, res) {
  const foundPaper = DB.papers.find(
    (paper) => paper.id === Number(req.params.id)
  );
  if (!foundPaper) {
    return res.status(400).json({ message: `Paper not found.` });
  }

  // updating database
  const newPapers = DB.papers.filter(
    (paper) => paper.id !== Number(req.params.id)
  );
  DB.setPapers(newPapers);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "papers.json"),
    JSON.stringify(DB.papers)
  );

  res.sendStatus(204);
}

async function editePaper(req, res) {
  const foundPaper = DB.papers.find(
    (paper) => paper.id === Number(req.params.id)
  );

  if (!foundPaper) {
    return res.status(400).json({ message: `Paper not found.` });
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
    JSON.stringify(DB.papers)
  );
  res.sendStatus(204);
}

module.exports = {
  getAllPapers,
  getUserPapers,
  addPaper,
  deletePaper,
  editePaper,
};
