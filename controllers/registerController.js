const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");

async function registerNewUser(req, res) {
  const usersDB = {
    users: JSON.parse(
      await fsPromises.readFile(`${__dirname}/${process.env.USERS_DB}`, "utf8")
    ),
    setUsers: function (data) {
      this.users = data;
    },
  };

  const { username, pass } = req.body;
  console.log("reqbody", username, pass);
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
    console.log("newuser", newUser);

    usersDB.setUsers([...usersDB.users, newUser]);
    console.log("usersDB.users", usersDB.users);

    await fsPromises.writeFile(
      `${__dirname}/${process.env.USERS_DB}`,
      JSON.stringify(usersDB.users)
    );

    res.sendStatus(201);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { registerNewUser };
