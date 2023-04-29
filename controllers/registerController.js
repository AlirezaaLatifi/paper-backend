const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

async function registerNewUser(req, res) {
  const { username, pass } = req.body;
  // check for empty inputs
  if (!username || !pass)
    return res
      .status(400)
      .json({ message: "username and password are required" });
  // check for duplication
  const isDuplicate = usersDB.users.find((user) => user.username === username);
  if (isDuplicate)
    return res.status(409).json({ message: "username already exists." });
  // registering
  try {
    const hashedPass = await bcrypt.hash(pass, 10);
    const newUser = {
      id: usersDB.users.length
        ? usersDB.users[usersDB.users.length - 1].id + 1
        : 1,
      username,
      pass: hashedPass,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.sendStatus(201);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { registerNewUser };
