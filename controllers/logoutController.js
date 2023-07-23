const fsPromises = require("fs").promises;

async function handleLogOut(req, res) {
  const usersDB = {
    users: JSON.parse(
      await fsPromises.readFile(`${__dirname}/${process.env.USERS_DB}`, "utf8")
    ),
    setUsers: function (data) {
      this.users = data;
    },
  };

  const cookies = req.cookies;

  // ? Isn't it better to send 403 with related message.
  if (!cookies?.jwt) return res.sendStatus(204);
  const reqRefreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === reqRefreshToken
  );

  // ? Isn't it better to send 403 with related message.
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      // domain: "paper.iran.liara.run",
    });
    return res.sendStatus(204);
  }

  const currentUser = { ...foundUser, refreshToken: "" };
  const otherUsers = usersDB.users.filter(
    (user) => user.username !== foundUser.username
  );
  usersDB.setUsers([...otherUsers, currentUser].sort((a, b) => a.id - b.id));

  await fsPromises.writeFile(
    `${__dirname}/${process.env.USERS_DB}`,
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    // domain: "paper.iran.liara.run",
  });
  res.sendStatus(204);
}

module.exports = { handleLogOut };
