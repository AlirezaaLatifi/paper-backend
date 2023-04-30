const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

async function handleLogOut(req, res) {
  const cookies = req.cookies;

  // ? Isn't it better to send 403 with related message.
  if (!cookies?.jwt) return res.sendStatus(204);
  const reqRefreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === reqRefreshToken
  );

  // ? Isn't it better to send 403 with related message.
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    return res.sendStatus(204);
  }

  const currentUser = { ...foundUser, refreshToken: "" };
  const otherUsers = usersDB.users.filter(
    (user) => user.username !== foundUser.username
  );
  usersDB.setUsers([...otherUsers, currentUser].sort((a, b) => a.id - b.id));

  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.sendStatus(204);
}

module.exports = { handleLogOut };