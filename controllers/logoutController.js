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
  if (!cookies?.jwt) return res.sendStatus(204);
  const reqRefreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === reqRefreshToken
  );
  if (!foundUser) {
    // TODO: add secure:ture and sameSite:'None' in production at the  below cookie's option
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  const currentUser = { ...foundUser, refreshToken: "" };
  const otherUsers = usersDB.users.filter(
    (user) => user.username !== foundUser.username
  );
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(usersDB.users)
  );
  // TODO: add secure:ture and sameSite:'None' in production at the  below cookie's option
  res.clearCookie("jwt", { httpOnly: true });
  res.sendStatus(204);
}

module.exports = { handleLogOut };
